import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import moment from 'moment';

import { ROUTES } from '_constants';
import { Deps, IGlobalState } from '_models/general';
import { getInitialState } from '_state_mgmt/GlobalState';
import { getCardLinkOffer_1, getLinkedCards_2, getMerchant } from '_test_utils/entities';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { getMockDeps } from '_test_utils/getMockDeps';

import { DayOfWeek, ICardLinkOffer } from '_models/cardLink';
import { InStoreOfferDetail } from '.';
import { Props } from './InStoreOfferDetail';

const mockedNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({ useNavigation: () => ({ navigate: mockedNavigate }) }));

describe('In-Store Offer Detail', () => {
  let dateNowSpy;
  let deps: Deps;
  let props: Props;
  let initialState: IGlobalState;
  const mockGoBack = jest.fn();

  const setInitialOffer = (offer: ICardLinkOffer) => {
    initialState.cardLink.offers = [offer];
    props.route.params.offerId = offer.offerId;
  };

  beforeEach(() => {
    initialState = getInitialState();
    props = {
      navigation: {
        goBack: () => {
          mockGoBack();
        },
        push: jest.fn()
      } as any,
      route: {
        params: { offerId: undefined }
      }
    };
    deps = getMockDeps();
    dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => 1629903600000);

    setInitialOffer(getCardLinkOffer_1());
  });

  afterAll(() => {
    dateNowSpy.mockRestore();
  });

  it('should render a default text when rewardValue is not provided', async () => {
    setInitialOffer(
      getCardLinkOffer_1({
        pointsAwarded: { rewardValue: null, rewardType: null }
      })
    );
    const { getAllByTestId } = renderWithGlobalContext(<InStoreOfferDetail {...props} />, deps, initialState);
    expect(getAllByTestId('pill-text')[0].props.children).toContain('Local Offer');
    await waitFor(() => {
      expect(getAllByTestId('pill-text')[0].props.children).toContain('Local Offer');
    });
  });

  it('should not try to activate offer when user does not have linked cards', async () => {
    deps.apiService.fetchLinkedCardsList = jest.fn().mockResolvedValue([]);
    deps.apiService.activateLocalOffer = jest.fn();
    const { getByTestId } = renderWithGlobalContext(<InStoreOfferDetail {...props} />, deps, initialState);
    fireEvent(getByTestId('in-store-offer-detail-footer-activate-btn'), 'onPress', { stopPropagation: jest.fn() });
    await waitFor(() => {
      expect(deps.apiService.activateLocalOffer).not.toBeCalled();
    });
  });

  it('should activate offer', async () => {
    deps.apiService.activateLocalOffer = jest.fn();
    const { queryByTestId } = renderWithGlobalContext(<InStoreOfferDetail {...props} />, deps, initialState);
    await waitFor(() => {
      fireEvent(queryByTestId('in-store-offer-detail-footer-activate-btn'), 'onPress', { stopPropagation: jest.fn() });
      expect(deps.apiService.activateLocalOffer).toBeCalledWith(initialState.cardLink.offers[0].offerId);
    });
  });

  it('should hide stars when there is no rating', async () => {
    setInitialOffer(
      getCardLinkOffer_1({
        rating: {
          overallRating: null
        }
      })
    );
    const { queryByTestId } = renderWithGlobalContext(<InStoreOfferDetail {...props} />, deps, initialState);
    await waitFor(() => {
      expect(queryByTestId('in-store-offer-detail-heading-stars')).toBeNull();
    });
  });

  it('should hide the description container when there is no description', async () => {
    setInitialOffer(
      getCardLinkOffer_1({
        description: null
      })
    );
    const { queryByTestId } = renderWithGlobalContext(<InStoreOfferDetail {...props} />, deps, initialState);
    await waitFor(() => {
      expect(queryByTestId('in-store-offer-detail-description-container')).toBeNull();
    });
  });

  it('should hide the meal values container when there is no price range', async () => {
    setInitialOffer(
      getCardLinkOffer_1({
        merchant: getMerchant({
          priceRange: null
        })
      })
    );
    const { queryByTestId } = renderWithGlobalContext(<InStoreOfferDetail {...props} />, deps, initialState);
    await waitFor(() => {
      expect(queryByTestId('in-store-offer-detail-meal-values-container')).toBeNull();
    });
  });

  it('should hide the address container when there is no street (address)', async () => {
    setInitialOffer(
      getCardLinkOffer_1({
        merchant: getMerchant({
          address: {
            latitude: -1.100809,
            longitude: 56.108808,
            street: null
          }
        })
      })
    );
    const { queryByTestId } = renderWithGlobalContext(<InStoreOfferDetail {...props} />, deps, initialState);
    await waitFor(() => {
      expect(queryByTestId('in-store-offer-detail-address')).toBeNull();
    });
  });

  it('should render when there is no merchant website available', async () => {
    setInitialOffer(
      getCardLinkOffer_1({
        merchant: getMerchant({
          websiteUrl: undefined
        })
      })
    );

    const { queryByTestId } = renderWithGlobalContext(<InStoreOfferDetail {...props} />, deps, initialState);
    await waitFor(() => {
      expect(queryByTestId('in-store-offer-detail-web-url')).toBeFalsy();
    });
  });

  it('should render when there is no merchant menu url available', async () => {
    setInitialOffer(
      getCardLinkOffer_1({
        menu: {
          externalUrl: undefined
        }
      })
    );

    const { queryByTestId } = renderWithGlobalContext(<InStoreOfferDetail {...props} />, deps, initialState);
    await waitFor(() => {
      expect(queryByTestId('in-store-offer-detail-menu-url')).toBeFalsy();
    });
  });

  it('should hide the operation hours container when there is no calendar for merchant', async () => {
    setInitialOffer(
      getCardLinkOffer_1({
        calendar: []
      })
    );
    const { queryByTestId } = renderWithGlobalContext(<InStoreOfferDetail {...props} />, deps, initialState);
    await waitFor(() => {
      expect(queryByTestId('in-store-offer-detail-operation-hours-container')).toBeNull();
    });
  });

  it('should hide the operation hours container when the open hour is invalid', async () => {
    setInitialOffer(
      getCardLinkOffer_1({
        calendar: [
          {
            dayOfWeek: moment().format('ddd') as DayOfWeek,
            dayHours: {
              open: null,
              close: moment().hours(23).minutes(59).format('hh:mma'),
              openForBusiness: true
            }
          }
        ]
      })
    );
    const { queryByTestId } = renderWithGlobalContext(<InStoreOfferDetail {...props} />, deps, initialState);
    await waitFor(() => {
      expect(queryByTestId('in-store-offer-detail-operation-hours-container')).toBeNull();
    });
  });

  it('should render open and closing times', async () => {
    setInitialOffer(
      getCardLinkOffer_1({
        calendar: [
          {
            dayOfWeek: moment().format('ddd') as DayOfWeek,
            dayHours: {
              open: moment().hours(0).minutes(0).format('hh:mma'),
              close: moment().hours(23).minutes(59).format('hh:mma'),
              openForBusiness: true
            }
          }
        ]
      })
    );

    const { getByTestId } = renderWithGlobalContext(<InStoreOfferDetail {...props} />, deps, initialState);
    await waitFor(() => {
      expect(getByTestId('in-store-offer-detail-opening-time').props.children).toContain('12 AM');
      expect(getByTestId('in-store-offer-detail-closing-time').props.children).toContain('11 PM');
    });
  });

  it('should render when open and close time are equal than current time', async () => {
    const currentTime = moment();

    setInitialOffer(
      getCardLinkOffer_1({
        calendar: [
          {
            dayOfWeek: currentTime.format('ddd') as DayOfWeek,
            dayHours: {
              open: currentTime.format('hh:mma'),
              close: currentTime.format('hh:mma'),
              openForBusiness: true
            }
          }
        ]
      })
    );

    const { getByTestId } = renderWithGlobalContext(<InStoreOfferDetail {...props} />, deps, initialState);
    await waitFor(() => {
      expect(getByTestId('in-store-offer-detail-opening-time').props.children).toContain(currentTime.format('h A'));
      expect(getByTestId('in-store-offer-detail-closing-time').props.children).toContain(currentTime.format('h A'));
    });
  });

  it('should render a closed status when it is out of the time range', async () => {
    setInitialOffer(
      getCardLinkOffer_1({
        calendar: [
          {
            dayOfWeek: moment().format('ddd') as DayOfWeek,
            dayHours: {
              open: moment().hours(0).minutes(0).format('hh:mma'),
              close: moment().hours(0).minutes(0).format('hh:mma'),
              openForBusiness: true
            }
          }
        ]
      })
    );

    const { queryByTestId } = renderWithGlobalContext(<InStoreOfferDetail {...props} />, deps, initialState);
    await waitFor(() => {
      expect(queryByTestId('in-store-offer-detail-closed-label')).toBeTruthy();
    });
  });

  it('should render a closed status when openForBusiness is false', async () => {
    setInitialOffer(
      getCardLinkOffer_1({
        calendar: [
          {
            dayOfWeek: moment().format('ddd') as DayOfWeek,
            dayHours: {
              open: moment().hours(0).minutes(0).format('hh:mma'),
              close: moment().hours(23).minutes(59).format('hh:mma'),
              openForBusiness: false
            }
          }
        ]
      })
    );

    const { queryByTestId } = renderWithGlobalContext(<InStoreOfferDetail {...props} />, deps, initialState);
    await waitFor(() => {
      expect(queryByTestId('in-store-offer-detail-closed-label')).toBeTruthy();
    });
  });

  it('should render closing times might differ when close date is not valid', async () => {
    setInitialOffer(
      getCardLinkOffer_1({
        calendar: [
          {
            dayOfWeek: moment().format('ddd') as DayOfWeek,
            dayHours: {
              open: moment().hours(0).minutes(0).format('hh:mma'),
              close: null,
              openForBusiness: true
            }
          }
        ]
      })
    );

    const { getByTestId, queryByTestId } = renderWithGlobalContext(<InStoreOfferDetail {...props} />, deps, initialState);
    await waitFor(() => {
      expect(getByTestId('in-store-offer-detail-opening-time').props.children).toContain('12 AM');
      expect(queryByTestId('in-store-offer-detail-closing-time').props.children).toEqual('Closing time unknown');
    });
  });

  it('should open address', async () => {
    const { getAllByTestId } = renderWithGlobalContext(<InStoreOfferDetail {...props} />, deps, initialState);
    await waitFor(() => {
      fireEvent(getAllByTestId('in-store-offer-detail-address')[0], 'onPress', { stopPropagation: jest.fn() });
      expect(deps.nativeHelperService.linking.openURL).toHaveBeenCalled();
    });
  });

  it('should open website', async () => {
    const offer = getCardLinkOffer_1({
      merchant: getMerchant({
        websiteUrl: 'https://www.makingsense.com'
      })
    });
    setInitialOffer(offer);
    const { getAllByTestId } = renderWithGlobalContext(<InStoreOfferDetail {...props} />, deps, initialState);
    await waitFor(() => {
      fireEvent(getAllByTestId('in-store-offer-detail-web-url')[0], 'onPress', { stopPropagation: jest.fn() });
      expect(mockedNavigate).toHaveBeenCalledWith(ROUTES.IN_STORE_OFFERS.WEB_VIEW, { uri: expect.any(String), title: expect.any(String) });
    });
  });

  it('should open menu url on webview screen', async () => {
    deps.nativeHelperService.linking.canOpenURL = () => Promise.resolve(true);
    deps.nativeHelperService.linking.openURL = jest.fn();

    const offer = getCardLinkOffer_1({
      menu: {
        externalUrl: 'https://www.makingsense.com'
      }
    });

    setInitialOffer(offer);
    const { getAllByTestId } = renderWithGlobalContext(<InStoreOfferDetail {...props} />, deps, initialState);
    await waitFor(() => {
      fireEvent(getAllByTestId('in-store-offer-detail-menu-url')[0], 'onPress', { stopPropagation: jest.fn() });
      expect(mockedNavigate).toHaveBeenCalledWith(ROUTES.IN_STORE_OFFERS.WEB_VIEW, { title: offer.brandName, uri: offer.menu.externalUrl });
    });
  });

  it('should open menu map', async () => {
    deps.nativeHelperService.platform.OS = 'ios';
    deps.nativeHelperService.platform.select = jest.fn(obj => obj[deps.nativeHelperService.platform.OS]);
    const offer = getCardLinkOffer_1({
      merchant: getMerchant({
        address: {
          latitude: -1.100809,
          longitude: 56.108808,
          street: null
        }
      })
    });
    const iosLinkedCallParameter = `maps:0,0?q=${offer.brandName}@${offer.merchant.address.latitude},${offer.merchant.address.longitude}`;
    setInitialOffer(offer);
    const { getByTestId } = renderWithGlobalContext(<InStoreOfferDetail {...props} />, deps, initialState);
    await waitFor(() => {
      fireEvent(getByTestId('map-widget-map-container'), 'onPress');
      expect(deps.nativeHelperService.linking.openURL).toHaveBeenCalledWith(iosLinkedCallParameter);
    });
  });

  it('should render fallback menu map', async () => {
    const offer = getCardLinkOffer_1({
      merchant: getMerchant({
        address: {
          latitude: null,
          longitude: null,
          street: null
        }
      })
    });
    setInitialOffer(offer);
    const { queryByTestId } = renderWithGlobalContext(<InStoreOfferDetail {...props} />, deps, initialState);
    await waitFor(() => {
      expect(queryByTestId('map-widget-fallback-container')).toBeTruthy();
    });
  });

  it('should render when there is no benefits available', async () => {
    setInitialOffer(
      getCardLinkOffer_1({
        benefits: undefined
      })
    );

    const { queryByTestId } = renderWithGlobalContext(<InStoreOfferDetail {...props} />, deps, initialState);
    await waitFor(() => {
      expect(queryByTestId('in-store-offer-calendar-container')).toBeFalsy();
    });
  });

  it('should activate an offer when routeToActivateLocalOffer is set', async () => {
    initialState.cardLink.linkedCardsList = [getLinkedCards_2()];
    deps.apiService.activateLocalOffer = jest.fn();
    initialState.cardLink.routeToActivateLocalOffer = ROUTES.IN_STORE_OFFERS.OFFER_DETAIL;
    renderWithGlobalContext(<InStoreOfferDetail {...props} />, deps, initialState);
    await waitFor(() => {
      expect(deps.apiService.activateLocalOffer).toBeCalledWith(initialState.cardLink.offers[0].offerId);
    });
  });
});
