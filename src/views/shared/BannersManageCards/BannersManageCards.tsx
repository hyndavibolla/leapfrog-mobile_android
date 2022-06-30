import React, { memo, useContext } from 'react';
import { Text } from 'react-native';
import { useTestingHelper } from '_utils/useTestingHelper';

import { GlobalContext } from '_state_mgmt/GlobalState';

import { BannerManageYourCards } from '_components/BannersManageCards/BannerManageYourCards';
import { BannerApplyAndUseNow } from '_components/BannersManageCards/BannerApplyAndUseNow';
import { BannerAddNewCard } from '_components/BannerAddNewCard';

import { styles } from './styles';

const BannersManageCards = () => {
  const { getTestIdProps } = useTestingHelper('banner-manage-cards');

  const {
    state: {
      cardLink: { linkedCardsList },
      game: {
        current: {
          memberships: { userHasSywCard }
        }
      }
    }
  } = useContext(GlobalContext);

  return (
    <>
      {linkedCardsList?.length ? <BannerManageYourCards /> : <BannerAddNewCard />}
      {!userHasSywCard && (
        <>
          <Text style={styles.title} {...getTestIdProps('banner-apply-for-card')}>
            Shop Your Way Mastercard®‡
          </Text>
          <BannerApplyAndUseNow />
        </>
      )}
    </>
  );
};

export default memo(BannersManageCards);
