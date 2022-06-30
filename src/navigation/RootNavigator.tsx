/* istanbul ignore file */
/** @todo test navigator */
import React, { ReactElement, useCallback } from 'react';
import { CardStyleInterpolators, createStackNavigator, StackHeaderProps, TransitionSpecs } from '@react-navigation/stack';

import { NavigationHeader } from '_components/NavigationHeader';
import { MissionSearchInput } from '_modules/missions/components/MissionSearchInput';
import { COLOR, ROUTES } from '_constants';

// Screens
import { AppCommonWebView } from '_commons/components/organisms/AppCommonWebView';
import { MissionSelectCategory } from '_modules/missions/screens/MissionSelectCategory';
import { Splash } from '_views/Splash';
import { LoginAuth0 } from '_views/LoginAuth0';
import { TermsAndConditions } from '_views/TermsAndConditions';
import { PrivacyPolicy } from '_views/PrivacyPolicy';
import { HowItWorksNavigator } from '_views/HowItWorksNavigator/HowItWorksNavigator';
import { MainTab } from '_navigation/MainTab';
import { MissionList } from '_modules/missions/screens/MissionList';
import { RewardDetail } from '_modules/rewards/screens/RewardDetail';
import { GiftCardBalance } from '_views/GiftCardBalance';
import { GiftCardGooglePay } from '_views/GiftCardGooglePay';
import { MissionDetail } from '_views/MissionDetail';
import { GiftCardList } from '_views/GiftCardList';
import { RewardCheckout } from '_modules/rewards/screens/RewardCheckout';
import { FusionViewer } from '_views/FusionViewer';
import { DevTools } from '_views/DevTools';
import { Profile } from '_views/Profile';
import { AppOnboarding } from '_views/AppOnboarding';
import { EarnTooltipScreen } from '_components/TooltipScreen';
import { RewardsOnboarding } from '_modules/rewards/screens/RewardsOnboarding';
import { PointBalanceDetail } from '_views/PointBalanceDetail';
import { MissionSearchList } from '_modules/missions/screens/MissionSearchList';
import { SurveyDetail } from '_views/SurveyDetail';
import { SurveyPQ } from '_views/SurveyPQ';
import { InStoreOffersSearchMap } from '_views/InStoreOffersSearchMap';
import { ApplyNow } from '_views/ApplyNow';
import { InStoreOfferDetail } from '_views/InStoreOfferDetail';
import { ManageSywCard } from '_views/ManageSywCard';
import { CardLink } from '_views/CardLink';
import { WalletDetail } from '_views/WalletDetail';
import { MapSearch } from '_views/MapSearch';
import { InStoreOfferWebView } from '_views/InStoreOfferDetail/InStoreOfferWebView';
import { GiftCardDetail } from '_views/GiftCardDetail';
import { UpdateModal } from '_views/shared/UpdateModal';
import { TransactionFilters } from '_views/TransactionFilters';
import { EditProfile } from '_views/EditProfile';
import { DeleteAccount } from '_views/DeleteAccount';
import { GiftCardFilter } from '_views/GiftCardFilter';
import { MissionsOnboarding } from '_modules/missions/screens/MissionsOnboarding';
import { GiftCardListByCategory } from '_modules/rewards/screens/GiftCardListByCategory';
import { YourGiftCards } from '_modules/wallet/screens/YourGiftCards';
import { Unifimoney } from '_views/Unifimoney';

import { withSafeArea } from '_utils/withSafeArea';

const { Screen, Navigator } = createStackNavigator();

const RootNavigator = () => {
  const header = useCallback((props: StackHeaderProps, searchBar?: ReactElement) => <NavigationHeader {...props} searchBar={searchBar} />, []);

  return (
    <Navigator headerMode="screen" screenOptions={{ header, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}>
      <Screen name={ROUTES.SPLASH} options={{ headerShown: false }} component={Splash} />
      <Screen name={ROUTES.LOGIN} component={withSafeArea(LoginAuth0, false)} options={{ animationEnabled: false, headerShown: false }} />
      <Screen name={ROUTES.TERMS_AND_CONDITIONS} component={withSafeArea(TermsAndConditions, true)} />
      <Screen name={ROUTES.PRIVACY_POLICY} component={withSafeArea(PrivacyPolicy, true)} />
      <Screen
        name={ROUTES.MAIN}
        component={withSafeArea(MainTab, false, { onlyBlueStatusBar: true })}
        options={{ animationEnabled: false, headerShown: false }}
      />
      <Screen
        name={ROUTES.POINT_HISTORY}
        component={withSafeArea(PointBalanceDetail, true)}
        initialParams={{ title: 'Your Balance' }}
        options={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}
      />
      <Screen
        name={ROUTES.HOW_IT_WORKS.TITLE}
        component={withSafeArea(HowItWorksNavigator, true)}
        options={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}
      />
      <Screen
        name={ROUTES.MISSION_SEE_ALL}
        component={withSafeArea(MissionList, true, { isFixedHeader: true, barStyle: 'default' })}
        options={({ route }: any) => ({
          title: route?.params?.title || 'Missions',
          animationEnabled: false,
          header: props => header(props, <MissionSearchInput />)
        })}
      />
      <Screen
        name={ROUTES.GIFT_CARD_SEE_ALL}
        component={withSafeArea(GiftCardList, true)}
        options={({ route }: any) => ({ title: route?.params?.title || 'Gift Cards' })}
      />
      <Screen
        name={ROUTES.GIFT_CARD_LIST_DETAIL}
        component={withSafeArea(GiftCardDetail, true)}
        options={({ route }: any) => ({ title: route?.params?.title || 'Gift Card Detail' })}
      />
      <Screen name={ROUTES.GIFT_CARD_BALANCE} component={withSafeArea(GiftCardBalance, true)} />
      <Screen
        name={ROUTES.GIFT_CARD_GOOGLE_PAY}
        component={withSafeArea(GiftCardGooglePay, true)}
        initialParams={{ showGoBackCrossBtn: true, hideGoBackArrowBtn: true }}
      />
      <Screen
        name={ROUTES.MISSION_DETAIL}
        options={{ headerShown: false }}
        component={withSafeArea(MissionDetail, false, { onlyBlueStatusBar: false }, ['left', 'right'])}
      />
      <Screen
        name={ROUTES.GIFT_CARD_DETAIL}
        options={{ headerShown: false }}
        component={withSafeArea(RewardDetail, false, { onlyBlueStatusBar: true, color: COLOR.LIGHT_GRAY, barStyle: 'dark-content' })}
      />
      <Screen
        name={ROUTES.GIFT_CARD_CHECKOUT}
        initialParams={{ showGoBackCrossBtn: true, title: 'Checkout', bottomShadow: true }}
        options={{ headerShown: true, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }}
        component={withSafeArea(RewardCheckout, true, { onlyBlueStatusBar: true, color: COLOR.LIGHT_GRAY, barStyle: 'dark-content' })}
      />
      <Screen
        name={ROUTES.FUSION_VIEWER}
        initialParams={{ title: 'Apply Now', bottomShadow: true }}
        options={{ headerShown: true }}
        component={withSafeArea(FusionViewer, true)}
      />
      <Screen
        name={ROUTES.SURVEY_DETAIL}
        initialParams={{ title: 'Surveys', bottomShadow: true, hideGoBackArrowBtn: true, showGoBackCrossBtn: true }}
        options={{ headerShown: true }}
        component={withSafeArea(SurveyDetail, true)}
      />
      <Screen
        name={ROUTES.SURVEY_PQ}
        initialParams={{ title: 'Pre-Qualification Surveys', bottomShadow: true, hideGoBackArrowBtn: true, showGoBackCrossBtn: true }}
        options={{ headerShown: true }}
        component={withSafeArea(SurveyPQ, true)}
      />
      <Screen name={ROUTES.DEV_TOOLS} component={withSafeArea(DevTools, true)} />
      <Screen
        name={ROUTES.PROFILE}
        options={{ headerShown: false }}
        component={withSafeArea(Profile, false, { onlyBlueStatusBar: false }, ['left', 'right'])}
      />
      <Screen
        name={ROUTES.EDIT_PROFILE}
        initialParams={{ title: 'Edit your profile', bottomShadow: true }}
        options={{ headerShown: true }}
        component={withSafeArea(EditProfile, true)}
      />
      <Screen
        name={ROUTES.DELETE_ACCOUNT}
        initialParams={{ title: 'Delete Account', bottomShadow: true, hideGoBackArrowBtn: true, showGoBackCrossBtn: true }}
        options={{ headerShown: true }}
        component={withSafeArea(DeleteAccount, false, { onlyBlueStatusBar: false }, ['left', 'right'])}
      />
      <Screen
        name={ROUTES.TOOLTIP.ONBOARDING}
        options={{ headerShown: false }}
        component={withSafeArea(AppOnboarding, false, { onlyBlueStatusBar: false }, ['left', 'right'])}
      />
      <Screen name={ROUTES.TOOLTIP.EARN} options={{ headerShown: false }} component={withSafeArea(EarnTooltipScreen, false)} />
      <Screen
        name={ROUTES.TOOLTIP.REWARDS}
        options={{ headerShown: false }}
        component={withSafeArea(RewardsOnboarding, false, { onlyBlueStatusBar: false }, ['left', 'right'])}
      />
      <Screen
        name={ROUTES.TOOLTIP.MISSIONS}
        options={{ headerShown: false }}
        component={withSafeArea(MissionsOnboarding, false, { onlyBlueStatusBar: false }, ['left', 'right'])}
      />
      <Screen
        name={ROUTES.STREAK_LIST}
        component={withSafeArea(MissionSearchList, true)}
        options={({ route }: any) => ({ title: route?.params?.title || 'Streak Brands' })}
      />
      <Screen
        name={ROUTES.IN_STORE_OFFERS.OFFER_SEARCH_MAP}
        initialParams={{ title: 'InStore Offers Search Map' }}
        options={{ headerShown: false }}
        component={withSafeArea(InStoreOffersSearchMap, true)}
      />
      <Screen
        name={ROUTES.IN_STORE_OFFERS.OFFER_DETAIL}
        initialParams={{ title: 'InStore Offer Detail' }}
        options={{ headerShown: false }}
        component={withSafeArea(InStoreOfferDetail, false, { onlyBlueStatusBar: false }, ['left', 'right'])}
      />
      <Screen
        name={ROUTES.APPLY_NOW}
        options={{ headerShown: true }}
        component={withSafeArea(ApplyNow, false, { onlyBlueStatusBar: false }, ['left', 'right'])}
        initialParams={{ title: 'SHOP YOUR WAY MASTERCARD®', bottomShadow: true }}
      />
      <Screen
        name={ROUTES.MANAGE_SYW_CARD}
        options={{ headerShown: true }}
        component={withSafeArea(ManageSywCard, true)}
        initialParams={{ title: 'SHOP YOUR WAY MASTERCARD®', bottomShadow: true }}
      />
      <Screen
        name={ROUTES.WALLET_DETAIL}
        initialParams={{ title: 'SHOP YOUR WAY MASTERCARD®' }}
        options={{ headerShown: true }}
        component={withSafeArea(WalletDetail, false, { onlyBlueStatusBar: false }, ['left', 'right'])}
      />
      <Screen
        name={ROUTES.IN_STORE_OFFERS.CARD_LINK}
        initialParams={{ title: 'Add a card - Cardlink', bottomShadow: true, hideGoBackArrowBtn: true, showGoBackCrossBtn: true }}
        options={{ headerShown: true }}
        component={withSafeArea(CardLink, true)}
      />
      <Screen
        name={ROUTES.IN_STORE_OFFERS.MAP_SEARCH}
        options={{ headerShown: false }}
        component={withSafeArea(MapSearch, false, { onlyBlueStatusBar: false }, ['left', 'right'])}
      />
      <Screen
        name={ROUTES.IN_STORE_OFFERS.WEB_VIEW}
        initialParams={{ bottomShadow: true, showGoBackCrossBtn: true }}
        component={withSafeArea(InStoreOfferWebView, true)}
        options={({ route }: any) => ({ title: route?.params?.title })}
      />
      <Screen
        name={ROUTES.FORCED_UPDATE_MODAL}
        options={{
          headerShown: false,
          gestureEnabled: false,
          transitionSpec: {
            open: TransitionSpecs.TransitionIOSSpec,
            close: TransitionSpecs.TransitionIOSSpec
          },
          cardOverlayEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS
        }}
      >
        {props => <UpdateModal {...props} isUpdateRequired={true} />}
      </Screen>
      <Screen
        name={ROUTES.TRANSACTION_FILTERS.MAIN}
        initialParams={{ title: 'YOUR TRANSACTIONS' }}
        component={withSafeArea(TransactionFilters, true)}
        options={{ headerShown: true }}
      />
      <Screen
        name={ROUTES.COMMON_WEB_VIEW.MAIN}
        initialParams={{ title: 'EXTERNAL WEBSITE' }}
        options={{ headerShown: true }}
        component={withSafeArea(AppCommonWebView, true)}
      />
      <Screen
        name={ROUTES.MISSION_SELECT_CATEGORY}
        initialParams={{ title: 'FILTERS', bottomShadow: true, hideGoBackArrowBtn: true, showGoBackCrossBtn: true }}
        options={{ headerShown: true }}
        component={withSafeArea(MissionSelectCategory, true)}
      />
      <Screen
        name={ROUTES.FILTER}
        component={withSafeArea(GiftCardFilter, true)}
        options={{ headerShown: true }}
        initialParams={{
          title: 'FILTERS',
          bottomShadow: true,
          showGoBackCrossBtn: true,
          hideGoBackArrowBtn: true
        }}
      />
      <Screen
        name={ROUTES.REWARDS_LIST_BY_CATEGORY}
        component={withSafeArea(GiftCardListByCategory, true)}
        options={({ route }: any) => ({ title: route?.params?.title || 'Gift Cards' })}
      />
      <Screen
        name={ROUTES.WALLET_YOUR_GIFT_CARDS.MAIN}
        initialParams={{ title: 'YOUR GIFT CARDS', bottomShadow: true }}
        options={{ headerShown: true }}
        component={withSafeArea(YourGiftCards, true)}
      />
      <Screen
        name={ROUTES.UNIFIMONEY}
        initialParams={{ title: 'UNIFIMONEY', bottomShadow: true }}
        options={{ headerShown: true }}
        component={withSafeArea(Unifimoney, true)}
      />
    </Navigator>
  );
};

export default RootNavigator;
