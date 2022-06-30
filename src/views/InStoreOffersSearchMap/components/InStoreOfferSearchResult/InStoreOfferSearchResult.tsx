import React, { memo, Ref } from 'react';
import { View, ScrollView, StyleProp, ViewStyle, Text } from 'react-native';

import { FallbackOffers } from '../FallbackOffers';
import { Button } from '_components/Button';
import { Loading } from '_views/Loading';
import { useTestingHelper } from '_utils/useTestingHelper';

import CreditCardFallbackIcon from '_assets/in-store-offer/creditCardFallback.svg';
import RefreshFallBackCloudIcon from '_assets/in-store-offer/refreshFallBackCloud.svg';
import LocationErrorIcon from '_assets/in-store-offer/locationError.svg';

import { styles } from './styles';
import { InStoreOfferList } from '_components/InStoreOffers/components/InStoreOfferList';
import { ICardLinkOffer } from '_models/cardLink';

const limitByDefaultOfResults = 20;

export interface Props {
  isLoading: boolean;
  hasLinkedCards: boolean;
  fetchingOffersError: boolean;
  invalidSearchError?: boolean;
  gettingLocationError: boolean;
  resultNumber: number;
  isSearching?: boolean;
  isRequestingMoreResults: boolean;
  allowNavigation: boolean;
  disabled?: boolean;
  scrollRef?: Ref<any>;
  buildItemStyle: (item: ICardLinkOffer, index: number) => StyleProp<ViewStyle>;
  buildItemShowStreet: (item: ICardLinkOffer) => boolean;
  onGoBackToLocationPressed?: () => void;
  onLoadMorePressed?: () => void;
  onOfferSelected: (offerId: string, index: number) => void;
}

const InStoreOfferSearchResult = ({
  isLoading,
  hasLinkedCards,
  fetchingOffersError,
  invalidSearchError,
  gettingLocationError,
  resultNumber,
  isSearching,
  isRequestingMoreResults,
  allowNavigation,
  disabled,
  scrollRef,
  buildItemStyle,
  buildItemShowStreet,
  onGoBackToLocationPressed,
  onLoadMorePressed,
  onOfferSelected
}: Props) => {
  const { getTestIdProps } = useTestingHelper('in-store-offer-search-result');

  if (isLoading && !isRequestingMoreResults) {
    return <Loading text="Searching nearby locations" />;
  }

  if (fetchingOffersError) {
    return (
      <FallbackOffers
        icon={<RefreshFallBackCloudIcon width={80} height={80} />}
        description="Uh-oh. We couldn't load the stores"
        note="Please try again later. In the meantime, please explore the MAX catalog."
      />
    );
  }

  if (invalidSearchError) {
    return (
      <FallbackOffers
        icon={<LocationErrorIcon width={80} height={80} />}
        description="Hmm. We can't find this location"
        note="It looks like you entered an invalid zip code or city. Please try again."
      />
    );
  }

  if (gettingLocationError) {
    return (
      <FallbackOffers
        icon={<RefreshFallBackCloudIcon width={80} height={80} />}
        description="Hmm. We can't find this location"
        note="It looks like you entered an invalid zip code. Please try again"
      />
    );
  }

  if (!resultNumber) {
    return isSearching ? (
      <>
        <View style={styles.locationFallbackContainer}>
          <FallbackOffers
            icon={<CreditCardFallbackIcon width={80} height={80} />}
            description="Uh-oh. We can't find any restaurants in this area"
            note="Please try searching in another location."
            noteStyle={styles.noteStyle}
            descriptionStyle={styles.descriptionStyle}
          />
        </View>
        <View style={styles.locationFallbackSmallContainer}>
          <Button
            innerContainerStyle={styles.locationButtonContainer}
            textStyle={styles.textButton}
            onPress={onGoBackToLocationPressed}
            {...getTestIdProps('got-to-my-location')}
          >
            Go back to my location
          </Button>
        </View>
      </>
    ) : (
      <FallbackOffers
        icon={<CreditCardFallbackIcon />}
        description="Uh-oh. We can't find any restaurants in this area"
        note="Please try searching in another location."
      />
    );
  }
  return (
    <View>
      <ScrollView style={styles.listContainer} {...getTestIdProps('scroll')} showsVerticalScrollIndicator={false} ref={scrollRef}>
        <InStoreOfferList
          hasLinkedCards={hasLinkedCards}
          allowNavigation={allowNavigation}
          disabled={disabled}
          onOfferSelected={(selectedOffer, index) => onOfferSelected(selectedOffer.offerId, index)}
          buildItemStyle={buildItemStyle}
          buildItemShowStreet={buildItemShowStreet}
        />
        {resultNumber % limitByDefaultOfResults === 0 && !isRequestingMoreResults && (
          <View style={styles.buttonContainer}>
            <Button innerContainerStyle={styles.button} textStyle={styles.textButton} onPress={onLoadMorePressed} {...getTestIdProps('button-load-more')}>
              Load more
            </Button>
          </View>
        )}
        {isRequestingMoreResults && isLoading && <Loading text="Searching nearby locations" style={styles.loadingContainer} />}
        {isRequestingMoreResults && !isLoading && <Text style={styles.noLoadingMore}>Oh?! There aren't any more locations available at this time.</Text>}
      </ScrollView>
    </View>
  );
};

export default memo(InStoreOfferSearchResult);
