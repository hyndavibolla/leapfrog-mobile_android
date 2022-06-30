import { act } from '@testing-library/react-hooks';

import { getMockDeps } from '_test_utils/getMockDeps';
import { Deps, IGlobalState } from '_models/general';
import { getStateSnapshotStorage } from '_utils/getStateSnapshotStorage';
import { getLinkedCards_1, getLocalOffers_1, getLinkedCards_2 } from '_test_utils/entities';
import { renderWrappedHook } from '_test_utils/renderWrappedHook';
import { EnrollmentEventType, LinkedCardPartnerType } from '_models/cardLink';
import { wait } from '_utils/wait';
import { waitFor } from '@testing-library/react-native';

import { getInitialState } from '../GlobalState';
import { useActivateLocalOfferById, useGetLinkedCardsList, useGetLocalOffers, useCardEnrollment } from './hooks';
import { actions } from './actions';

describe('card link hooks', () => {
  let deps: Deps;
  let mockReducer: any;
  let state: IGlobalState;
  let initialState: IGlobalState;
  let latitude;
  let longitude;
  let zip;
  let limit;
  let offset;
  let merchantName;

  beforeEach(() => {
    initialState = getInitialState();
    state = initialState;
    mockReducer = jest.fn().mockReturnValue(state);
    deps = getMockDeps();
    deps.stateSnapshot = getStateSnapshotStorage();
    latitude = 1;
    longitude = 1;
    zip = 90210;
    limit = 10;
    offset = 0;
    merchantName = 'test';
  });

  describe('useGetLocalOffers', () => {
    it('should fetch local offers', async () => {
      deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(getLocalOffers_1()) as any;
      const { result } = renderWrappedHook(() => useGetLocalOffers(), deps, state, mockReducer);
      await act(async () => {
        await (result.current[0] as any)({ latitude, longitude, zip, limit, offset, merchantName });
        expect(deps.apiService.fetchLocalOffers).toBeCalledWith({ latitude, longitude, zip, limit, offset, merchantName });
        expect(mockReducer).toBeCalledWith(expect.any(Object), actions.setLocalOffers(getLocalOffers_1()));
      });
    });

    it('should warn about local offers without address', async () => {
      const localOffers = getLocalOffers_1();
      localOffers.offers[0].merchant.address = null;

      deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(localOffers) as any;
      const { result } = renderWrappedHook(() => useGetLocalOffers(), deps, state, mockReducer);
      await act(async () => {
        await (result.current[0] as any)({ latitude, longitude, zip, limit, offset, merchantName });
        expect(deps.logger.warn).toBeCalledWith('Offer does not have a latitude or longitude location, discarding.', expect.anything());
      });
    });

    it.each`
      priceRange   | isValid
      ${'a'}       | ${false}
      ${100}       | ${false}
      ${-20}       | ${false}
      ${null}      | ${true}
      ${undefined} | ${true}
      ${0}         | ${true}
    `('should treat priceRange=$priceRange as valid=$isValid', async ({ priceRange, isValid }) => {
      const localOffers = getLocalOffers_1();
      localOffers.offers[0].merchant.priceRange = priceRange;

      deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(localOffers) as any;
      const { result } = renderWrappedHook(() => useGetLocalOffers(), deps, state, mockReducer);
      await act(async () => {
        await (result.current[0] as any)({ latitude, longitude, zip, limit, offset, merchantName });
        if (isValid) {
          expect(deps.logger.warn).not.toBeCalled();
        } else {
          expect(deps.logger.warn).toBeCalledWith('Offer has a non-supported price range.', expect.anything());
        }
      });
    });
  });

  describe('useGetLinkedCardsList', () => {
    it('should get a list of Linked Cards', async () => {
      deps.apiService.fetchLinkedCardsList = jest.fn().mockResolvedValue({ linkedCards: [getLinkedCards_1(), getLinkedCards_2()] });
      const { result, mockReducer: resolvedMockReducer } = renderWrappedHook(() => useGetLinkedCardsList(), deps);
      await act(async () => {
        await result.current[0]();
        expect(deps.apiService.fetchLinkedCardsList).toBeCalled();
        expect(resolvedMockReducer).toBeCalledWith(expect.any(Object), actions.setLinkedCards([getLinkedCards_1(), getLinkedCards_2()]));
      });
    });

    it('should get a empty list of Linked Cards and set hasCalledLocalOffer to true', async () => {
      deps.apiService.fetchLinkedCardsList = jest.fn().mockResolvedValue({ linkedCards: [] });
      const { result, mockReducer: resolvedMockReducer } = renderWrappedHook(() => useGetLinkedCardsList(), deps);
      await act(async () => {
        await result.current[0]();
        expect(deps.apiService.fetchLinkedCardsList).toBeCalled();
        expect(result.current[3]).toHaveLength(0);
        expect(resolvedMockReducer).toBeCalledWith(expect.any(Object), actions.setLinkedCards([]));
        expect(resolvedMockReducer).toBeCalledWith(expect.any(Object), actions.setHasCalledLocalOffer(true));
      });
    });

    it('should filter the list of cards only to the MASTERCARD partner', async () => {
      const linkedCards = [getLinkedCards_1(), getLinkedCards_2()];
      linkedCards[1].partnerType = LinkedCardPartnerType.REWARDS_NETWORK;
      deps.apiService.fetchLinkedCardsList = jest.fn().mockResolvedValue({ linkedCards });
      const { result, mockReducer: resolvedMockReducer } = renderWrappedHook(() => useGetLinkedCardsList(), deps);
      await act(async () => {
        await result.current[0]();
        expect(deps.apiService.fetchLinkedCardsList).toBeCalled();
        expect(resolvedMockReducer).toBeCalledWith(expect.any(Object), actions.setLinkedCards([linkedCards[0]]));
      });
    });

    it('should not set linked cards when call the api', async () => {
      deps.apiService.fetchLinkedCardsList = jest.fn().mockResolvedValue({});
      const { result, mockReducer: resolvedMockReducer } = renderWrappedHook(() => useGetLinkedCardsList(), deps);
      await act(async () => {
        await result.current[0]();
        expect(resolvedMockReducer).not.toBeCalled();
      });
    });

    it('should not set linked cards when the API result is invalid', async () => {
      deps.apiService.fetchLinkedCardsList = jest.fn().mockResolvedValue(null);
      const { result, mockReducer: resolvedMockReducer } = renderWrappedHook(() => useGetLinkedCardsList(), deps);
      await waitFor(async () => {
        await result.current[0]();
        expect(resolvedMockReducer).not.toBeCalled();
      });
    });
  });

  describe('useActivateLocalOfferById', () => {
    it('should activate the offer', async () => {
      const mockedOfferId = '1234';
      deps.apiService.activateLocalOffer = jest.fn();
      const { result, mockReducer: resolvedMockReducer } = renderWrappedHook(() => useActivateLocalOfferById(), deps);
      await act(async () => {
        await result.current[0](mockedOfferId);
        expect(deps.apiService.activateLocalOffer).toBeCalled();
        expect(resolvedMockReducer).toBeCalledWith(expect.any(Object), actions.activateLocalOffer(mockedOfferId));
      });
    });

    it('should not activate the offer when the api call fails', async () => {
      const mockedOfferId = '1234';
      deps.apiService.activateLocalOffer = jest.fn().mockResolvedValue({});
      const { result, mockReducer: resolvedMockReducer } = renderWrappedHook(() => useActivateLocalOfferById(), deps);
      await act(async () => {
        await result.current[0](mockedOfferId);
        expect(deps.apiService.activateLocalOffer).toBeCalled();
        expect(resolvedMockReducer).not.toBeCalledWith();
      });
    });
  });

  describe('useCardEnrollment', () => {
    it('should not enroll a card when the api fails and track the error', async () => {
      deps.apiService.enrollCard = jest.fn().mockRejectedValue(new Error('error'));
      deps.eventTrackerService.isTrackingEnabled = jest.fn().mockResolvedValue(true);
      const { result } = renderWrappedHook(() => useCardEnrollment(), deps);
      await act(async () => {
        await result.current[0]({
          eventType: EnrollmentEventType.UNENROLL,
          programDetail: getLinkedCards_1()
        });
        expect(deps.apiService.enrollCard).toBeCalled();
        await act(() => wait(0));
        expect(deps.eventTrackerService.tealiumSDK.track).toBeCalled();
      });
    });
  });
});
