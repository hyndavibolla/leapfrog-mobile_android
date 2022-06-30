import React from 'react';

import { getDeps } from '../../src/state-mgmt/dependencies';
import { GlobalProvider, getInitialState, combinedReducer } from '../../src/state-mgmt/GlobalState';

import { InStoreOfferDetailHeading } from '../../src/views/InStoreOfferDetail/InStoreOfferDetailHeading';

export default function InStoreOfferDetailHeadingStory() {
  return (
    <GlobalProvider deps={getDeps()} initState={getInitialState()} combinedReducers={combinedReducer}>
      <InStoreOfferDetailHeading isActive={false} activeUntil={new Date()} name="Coca-Cola" rewardText="test" />
    </GlobalProvider>
  );
}
