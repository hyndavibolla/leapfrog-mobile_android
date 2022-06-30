import React, { memo, useEffect, useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { useTestingHelper } from '_utils/useTestingHelper';
import Redemptions from '_views/WalletMain/components/Redemptions/Redemptions';
import { ROUTES } from '_constants/routes';
import { NAVIGATOR_TAB, COLOR } from '_constants/styles';
import { CreditCards } from '_views/WalletMain/components/CreditCards';
import { ApplicationModal } from '_views/WalletMain/components/ApplicationModal';

const { Navigator, Screen } = createMaterialTopTabNavigator();

export interface Props {
  route: { params?: { finishedURI?: boolean } };
}

const WalletMain = ({ route }: Props) => {
  const { getTestIdProps } = useTestingHelper('wallet-main-navigator');
  const finishedURI = route.params?.finishedURI ?? false;
  const [shouldShowApplicationModal, setShouldShowApplicationModal] = useState(false);

  useEffect(() => {
    if (finishedURI) {
      setShouldShowApplicationModal(true);
    }
  }, [finishedURI]);

  const handleShouldShowApplication = () => {
    setShouldShowApplicationModal(false);
  };

  return (
    <>
      <ApplicationModal isVisible={shouldShowApplicationModal} handleShouldShowApplication={handleShouldShowApplication} />
      <Navigator
        tabBarOptions={{
          labelStyle: NAVIGATOR_TAB.label,
          indicatorStyle: NAVIGATOR_TAB.indicator,
          activeTintColor: COLOR.PRIMARY_BLUE,
          inactiveTintColor: COLOR.DARK_GRAY,
          allowFontScaling: false
        }}
      >
        <Screen name={ROUTES.WALLET.REDEMPTIONS} component={Redemptions} {...getTestIdProps('redemptions-link')} options={{ title: 'REDEMPTIONS' }} />
        <Screen name={ROUTES.WALLET.CREDIT_CARDS} component={CreditCards} {...getTestIdProps('credit-cards-link')} options={{ title: 'CREDIT CARDS' }} />
      </Navigator>
    </>
  );
};

export default memo(WalletMain);
