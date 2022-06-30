import React, { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';

import { EventDetail, ForterActionType, PageNames, PageType, ROUTES, TealiumEventType, UxObject } from '_constants';
import { ICardLinkOffer, ICardLinkOffers, ILinkedCard, EnrollmentEventType, PRICE_RANGE_MAX_VALUE, LinkedCardPartnerType, ILocation } from '_models/cardLink';
import { IFetchLocalOffersParameters } from '_services/ApiService';
import { useAsyncCallback } from '_utils/useAsyncCallback';

import { InStoreOfferLinkCardModal, InStoreOfferLinkCardModalKey } from '_views/shared/InStoreOfferLinkCardModal';
import { InStoreOfferUnavailableModal, InStoreOfferUnavailableModalKey } from '_views/shared/InStoreOfferUnavailableModal';
import { InStoreOfferActivatedModal, InStoreOfferActivatedModalKey } from '_views/shared/InStoreOfferActivatedModal';
import { ModalSize, ModalType } from '_views/shared/Modal';
import { ToastType } from '_views/shared/Toast';
import { isNumeric } from '_utils/isNumeric';

import { useErrorLog, useToast, useEventTracker } from '../core/hooks';
import { GlobalContext } from '../GlobalState';
import { actions as coreActions } from '../core/actions';
import { actions } from './actions';

export const useGetLocalOffers = () => {
  const { dispatch, deps } = useContext(GlobalContext);
  const localOfferState: [(params: IFetchLocalOffersParameters) => Promise<ICardLinkOffers>, boolean, any, ICardLinkOffers] = useAsyncCallback(
    async ({ latitude, longitude, zip, limit, offset, merchantName, dataShouldBePersisted = true }: IFetchLocalOffersParameters) => {
      try {
        const localOfferList = await deps.apiService.fetchLocalOffers({
          latitude,
          longitude,
          zip,
          limit,
          offset,
          merchantName: merchantName?.toLocaleLowerCase().trim()
        });
        dispatch(actions.setHasCalledLocalOffer(true));
        const concatenatedArray = offset
          ? [...new Map([...deps.stateSnapshot.get().cardLink.offers, ...localOfferList.offers].map(obj => [`${obj.offerId}:${obj.brandName}`, obj])).values()]
          : localOfferList.offers;
        localOfferList.offers = concatenatedArray
          .map(offer => {
            if (!offer.merchant?.address?.latitude || !offer.merchant?.address?.longitude) {
              deps.logger.warn('Offer does not have a latitude or longitude location, discarding.', { offerId: offer.offerId, offer });
              return null;
            }

            const priceRange = offer.merchant?.priceRange;
            if (
              priceRange !== '' &&
              priceRange !== null &&
              priceRange !== undefined &&
              (!isNumeric(priceRange) || Number(priceRange) > PRICE_RANGE_MAX_VALUE || Number(priceRange) < 0)
            ) {
              deps.logger.warn('Offer has a non-supported price range.', { priceRange, offer });
            }

            return offer;
          })
          .filter(o => !!o);

        // TO-DO this should be removed, it is only for CloseByOffers
        if (dataShouldBePersisted) {
          dispatch(actions.setLastSearchedLocation({ latitude, longitude }));
          dispatch(actions.setLocalOffers(localOfferList));
        }
        dispatch(actions.setLocalOfferFailed(false));

        return localOfferList;
      } catch (e) {
        dispatch(actions.setHasCalledLocalOffer(true));
        dispatch(actions.setLocalOfferFailed(true));
        throw new Error(e.toString());
      }
    },
    [deps.apiService.fetchLocalOffers]
  );

  useErrorLog(localOfferState[2], 'There was an issue fetching local offers');

  return localOfferState;
};

export const useGetLinkedCardsList = () => {
  const { deps, dispatch } = useContext(GlobalContext);
  const fetchState = useAsyncCallback(async () => {
    deps.logger.debug('useGetCardLinkList');
    const { linkedCards } = await deps.apiService.fetchLinkedCardsList();
    // degenerate case: response.linkedCards is null or undefined (empty arrays are truthy)
    if (!linkedCards) return linkedCards;
    if (!linkedCards.length) dispatch(actions.setHasCalledLocalOffer(true));
    const filteredCards = linkedCards.filter(c => c.partnerType.toLowerCase() === LinkedCardPartnerType.MASTERCARD.toLowerCase());
    dispatch(actions.setLinkedCards(filteredCards));
    return filteredCards;
  }, []);
  useErrorLog(fetchState[2], 'There was an issue fetching Linked Cards');
  return fetchState;
};

export const useActivateLocalOfferById = () => {
  const { dispatch, deps } = useContext(GlobalContext);
  const activationState: [(offerId: string) => Promise<void>, boolean, any, void] = useAsyncCallback(
    async (offerId: string) => {
      await deps.apiService.activateLocalOffer(offerId);
      dispatch(actions.activateLocalOffer(offerId));
    },
    [deps.apiService.activateLocalOffer],
    true
  );
  useErrorLog(activationState[2], 'There was an issue activating a local offer');
  return activationState;
};

export const useValidateAndActivateLocalOffer = () => {
  const { dispatch, deps } = useContext(GlobalContext);
  const { showToast } = useToast();
  const { navigate } = useNavigation();
  const [activateLocalOffer] = useActivateLocalOfferById();
  const { trackSystemEvent } = useEventTracker();
  return useAsyncCallback(async (offer: ICardLinkOffer, hasLinkedCards: boolean) => {
    const {
      brandName,
      brandLogo,
      validFrom,
      validUntil,
      offerId,
      merchant: {
        address: { street }
      }
    } = offer;
    const buildModal = (modalKey: string, Content: any, contentProps: any) => {
      dispatch(
        coreActions.addModal(modalKey, {
          size: ModalSize.EXTRA_LARGE,
          type: ModalType.BOTTOM,
          visible: true,
          children: <Content brandName={brandName} brandLogo={brandLogo} {...contentProps} />
        })
      );
    };
    if (!hasLinkedCards) {
      buildModal(InStoreOfferLinkCardModalKey, InStoreOfferLinkCardModal, {
        onLinkCardPress: /* istanbul ignore next */ () => {
          dispatch(coreActions.removeModal(InStoreOfferLinkCardModalKey));
          navigate(ROUTES.IN_STORE_OFFERS.CARD_LINK, { shouldActivateOffer: true });
        },
        onCancel: /* istanbul ignore next */ () => {
          dispatch(coreActions.removeModal(InStoreOfferLinkCardModalKey));
        }
      });
      return;
    }
    const currentDate = new Date();
    if (new Date(validFrom) > currentDate || new Date(validUntil) < currentDate) {
      deps.logger.warn('Tried to activate offer outside of valid period', { offer });
      buildModal(InStoreOfferUnavailableModalKey, InStoreOfferUnavailableModal, {
        onActionPress: /* istanbul ignore next */ () => {
          dispatch(coreActions.removeModal(InStoreOfferUnavailableModalKey));
        }
      });
      return;
    }
    try {
      await activateLocalOffer(offerId);

      /* ignored because of the branching created on the ?. operators, but they should not happen */
      /* also, it can't be tested because our reducer does not leave empty cardlink/offers/activeUntil */
      /* istanbul ignore next */
      const activeUntil = deps.stateSnapshot.get().cardLink?.offers?.find(o => o.offerId === offer.offerId)?.activeUntil;
      buildModal(InStoreOfferActivatedModalKey, InStoreOfferActivatedModal, {
        onActionPress: /* istanbul ignore next */ () => {
          dispatch(coreActions.removeModal(InStoreOfferActivatedModalKey));
        },
        activeUntil,
        street
      });
    } catch (error) {
      deps.logger.error(error, { context: 'Error while activating the offer', offer });
      showToast({ type: ToastType.ERROR_WITHOUT_ICON, title: "Whoops! We couldn't activate your offer. Please try again." });
      trackSystemEvent(
        TealiumEventType.ERROR,
        {
          page_name: PageNames.MAIN.EARN,
          page_type: PageType.SELECTION,
          section: ROUTES.MAIN_TAB.EARN,
          event_type: TealiumEventType.OFFER,
          event_name: TealiumEventType.IN_STORE,
          event_detail: EventDetail.ACTIVATION,
          uxObject: UxObject.LIST,
          brand_name: offer.brandName,
          error: "Whoops! We couldn't activate your offer. Please try again."
        },
        ForterActionType.TAP
      );
    }
  }, []);
};

export const useCardEnrollment = () => {
  const { deps } = useContext(GlobalContext);
  const { trackSystemEvent } = useEventTracker();
  const fetchState = useAsyncCallback(async ({ eventType, programDetail }: { eventType: EnrollmentEventType; programDetail: ILinkedCard }) => {
    deps.logger.debug('useCardEnrollment', { eventType, programDetail });
    return await deps.apiService.enrollCard({ eventType, programDetail });
  }, []);
  useErrorLog(fetchState[2], 'There was an issue trying to enroll a card');
  if (fetchState[2]) {
    trackSystemEvent(
      TealiumEventType.ERROR,
      {
        page_name: PageNames.WALLET.WALLET_CARD_DETAIL,
        page_type: PageType.INFO,
        section: ROUTES.MAIN_TAB.WALLET,
        event_type: TealiumEventType.CARD,
        event_name: TealiumEventType.CARDLINK,
        event_detail: EventDetail.UNENROLL,
        uxObject: UxObject.BUTTON,
        error: 'There was an issue trying to enroll a card'
      },
      ForterActionType.TAP
    );
  }
  return fetchState;
};

export const useCurrentLocation = () => {
  const {
    deps: {
      nativeHelperService: { geolocation }
    }
  } = useContext(GlobalContext);
  const currentLocationState: [() => Promise<ILocation>, boolean, any, ILocation] = useAsyncCallback(
    () =>
      new Promise<ILocation>((resolve, reject) => {
        geolocation.getCurrentPosition(
          ({ coords }) => {
            resolve(coords);
          },
          error => {
            reject(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000
          }
        );
      }),
    [geolocation],
    true
  );
  return currentLocationState;
};
