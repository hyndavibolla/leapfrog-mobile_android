import React from 'react';
import { InStoreOfferDetail } from '../../src/views/InStoreOfferDetail';
import { getCardLinkOffer_1 } from '../../src/test-utils/entities';
import { getDeps } from '../../src/state-mgmt/dependencies';
import { combinedReducer, getInitialState, GlobalProvider } from '../../src/state-mgmt/GlobalState';

export default function InStoreOfferDetailStory() {
  const offer = getCardLinkOffer_1();
  const initialState = getInitialState();
  initialState.cardLink.offers = [offer];

  const params = {
    offerId: offer.offerId
  };

  const navigation: any = {
    goBack: () => {
      console.log('Fake go back has been triggered!');
    },
    push: () => {
      console.log('Fake navigation push has been triggered!');
    }
  };

  return (
    <GlobalProvider deps={getDeps()} initState={getInitialState()} combinedReducers={combinedReducer}>
      <InStoreOfferDetail route={{ params }} navigation={navigation} />
    </GlobalProvider>
  );
}
