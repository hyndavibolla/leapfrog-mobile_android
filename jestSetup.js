import React, { Component } from 'react';
import moment from 'moment';
import 'react-native-gesture-handler/jestSetup';
import '@testing-library/jest-native/extend-expect';

process.env.TZ = 'America/Los_Angeles';
moment.locale('en-US');

Math.random = () => 0.5;

jest.mock('react-native/Libraries/LogBox/LogBox');

jest.mock('./src/utils/useDebounce', () => ({ __esModule: true, useDebounce: s => s }));
jest.mock('./src/views/shared/Spinner', () => ({ __esModule: true, Spinner: () => <div>Spinner</div> }));
jest.mock('./src/views/shared/LoadingToast', () => ({ __esModule: true, LoadingToast: () => <div>LoadingToast</div> }));

jest.mock('./node_modules/react-native/Libraries/EventEmitter/NativeEventEmitter.js');

jest.mock('react-native-scroll-bottom-sheet', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>
}));

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('react-native-animatable');
const RNAnimatable = require('react-native-animatable');
class AnimatedComponent extends Component {
  constructor(props) {
    super(props);
    animationMethods.forEach(methodName => (this[methodName] = jest.fn()));
  }
  render() {
    return <div {...this.props} />;
  }
}
RNAnimatable.View = AnimatedComponent;
RNAnimatable.Text = AnimatedComponent;
RNAnimatable.Image = AnimatedComponent;
RNAnimatable.ScrollView = AnimatedComponent;

jest.mock('./src/views/shared/ImpressionView', () => ({
  __esModule: true,
  ImpressionView: (() => {
    function ImpressionView() {
      return <div {...this.props} />;
    }
    ImpressionView.configureWithDetails = jest.fn();
    ImpressionView.current = { configureWithDetails: ImpressionView.configureWithDetails };
    return ImpressionView;
  })()
}));

// https://github.com/react-navigation/react-navigation/issues/9568#issuecomment-881943770
jest.mock('@react-navigation/native/lib/commonjs/useLinking.native', () => ({
  default: () => ({ getInitialState: { then: jest.fn() } }),
  __esModule: true
}));

jest.mock('react-native-safe-area-context', () => {
  const originalModule = jest.requireActual('react-native-safe-area-context');
  return {
    __esModule: true,
    ...originalModule,
    useSafeAreaInsets: () => {
      return { left: 0, right: 0, bottom: 0, top: 0 };
    }
  };
});

jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');
  class MockMapView extends React.Component {
    fitToSuppliedMarkers() {
      return;
    }
    animateToRegion() {
      return;
    }
    render() {
      const { testID, children, ...props } = this.props;
      return (
        <View
          {...{
            ...props,
            testID
          }}
        >
          {children}
        </View>
      );
    }
  }

  const MockMarker = props => {
    const { children, ...properties } = props;
    return <View {...properties}>{children}</View>;
  };

  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
    PROVIDER_GOOGLE: 'google'
  };
});

/** testing doesn't work well with react native svgs */
jest.mock('./src/assets/button/claimIcon.svg', () => ({ __esModule: true, default: () => <>ClaimIcon</> }));
jest.mock('./src/assets/button/walletWhite.svg', () => ({ __esModule: true, default: () => <>WalletIcon</> }));
jest.mock('./src/assets/button/closeBlack.svg', () => ({ __esModule: true, default: () => <>CloseBlack</> }));
jest.mock('./src/assets/button/closeWhite.svg', () => ({ __esModule: true, default: () => <>CloseWhite</> }));
jest.mock('./src/assets/shared/questionBlue.svg', () => ({ __esModule: true, default: () => <>QuestionBlue</> }));
jest.mock('./src/assets/shared/walmartIcon.svg', () => ({ __esModule: true, default: () => <>walmartIcon</> }));
jest.mock('./src/assets/shared/kmartIcon.svg', () => ({ __esModule: true, default: () => <>KmartIcon</> }));
jest.mock('./src/assets/shared/searsIcon.svg', () => ({ __esModule: true, default: () => <>SearsIcon</> }));
jest.mock('./src/assets/shared/sywCardIcon.svg', () => ({ __esModule: true, default: () => <>SywCardIcon</> }));
jest.mock('./src/assets/shared/cardIcon.svg', () => ({ __esModule: true, default: () => <>CardIcon</> }));
jest.mock('./src/assets/shared/giftIcon.svg', () => ({ __esModule: true, default: () => <>GiftIcon</> }));
jest.mock('./src/assets/shared/goOutIcon.svg', () => ({ __esModule: true, default: () => <>GoOutIcon</> }));
jest.mock('./src/assets/shared/goOutIconDarkGrey.svg', () => ({ __esModule: true, default: () => <>GoOutIconDarkGrey</> }));
jest.mock('./src/assets/shared/questionBall.svg', () => ({ __esModule: true, default: () => <>QuestionBall</> }));
jest.mock('./src/assets/shared/swyEmptyBalance.svg', () => ({ __esModule: true, default: () => <>SwyEmptyBalance</> }));
jest.mock('./src/assets/shared/starbucksIcon.svg', () => ({ __esModule: true, default: () => <>StarbucksIcon</> }));
jest.mock('./src/assets/shared/expiredIcon.svg', () => ({ __esModule: true, default: () => <>ExpiredIcon</> }));
jest.mock('./src/assets/shared/cashbackIconCircle.svg', () => ({ __esModule: true, default: () => <>CashbackIconCircle</> }));
jest.mock('./src/assets/shared/filterIcon.svg', () => ({ __esModule: true, default: () => <>FilterIcon</> }));
jest.mock('./src/assets/shared/filterIconActive.svg', () => ({ __esModule: true, default: () => <>FilterIconActive</> }));
jest.mock('./src/assets/shared/cardIconBlue.svg', () => ({ __esModule: true, default: () => <>CardIconBlue</> }));
jest.mock('./src/assets/level-badge/laurelIcon.svg', () => ({ __esModule: true, default: () => <>LaurelIcon</> }));
jest.mock('./src/assets/shared/giftCircle.svg', () => ({ __esModule: true, default: () => <>GiftCircle</> }));
jest.mock('./src/assets/shared/giftRedeemCircle.svg', () => ({ __esModule: true, default: () => <>GiftRedeemCircle</> }));
jest.mock('./src/assets/shared/sywGiftCardWaterMark.svg', () => ({ __esModule: true, default: () => <>SYWGiftCardWaterMark</> }));
jest.mock('./src/assets/shared/brandNoResults.svg', () => ({ __esModule: true, default: () => <>BrandNoResults</> }));
jest.mock('./src/assets/shared/sywCard.svg', () => ({ __esModule: true, default: () => <>SYWCard</> }));
jest.mock('./src/assets/shared/sywLogo.svg', () => ({ __esModule: true, default: () => <>SYWLogo</> }));
jest.mock('./src/assets/shared/moreInfo.svg', () => ({ __esModule: true, default: () => <>MoreInfo</> }));
jest.mock('./src/assets/shared/yellowStar.svg', () => ({ __esModule: true, default: () => <>YellowStar</> }));
jest.mock('./src/assets/shared/delete-circle.svg', () => ({ __esModule: true, default: () => <>DeleteCircle</> }));
jest.mock('./src/assets/shared/orangeExclamationMark.svg', () => ({ __esModule: true, default: () => <>OrangeExclamationMark</> }));
jest.mock('./src/assets/credit-card/benefits@3x.svg', () => ({ __esModule: true, default: () => <>CreditCardBenefits</> }));
jest.mock('./src/assets/shared/noConnectionOrange.svg', () => ({ __esModule: true, default: () => <>NoConnectionOrange</> }));
jest.mock('./src/assets/shared/loyaltyBrandFallback.svg', () => ({ __esModule: true, default: () => <>LoyaltyBrandFallback</> }));
jest.mock('./src/assets/shared/criticalError.svg', () => ({ __esModule: true, default: () => <>CriticalError</> }));
jest.mock('./src/assets/shared/whiteExclamation.svg', () => ({ __esModule: true, default: () => <>WhiteExclamation</> }));
jest.mock('./src/assets/shared/rewardsEmptyState.svg', () => ({ __esModule: true, default: () => <>RewardsEmptyState</> }));
jest.mock('./src/assets/shared/availableTransactionsEmptyState.svg', () => ({ __esModule: true, default: () => <>AvailableTransactionsEmptyState</> }));
// this reference should be removed with this ticket https://sywjira.atlassian.net/browse/LEAP-3459
jest.mock('./src/assets/shared/arrowUpgrade.svg', () => ({ __esModule: true, default: () => <>UpgradeArrow</> }));
// this reference should be removed with this ticket https://sywjira.atlassian.net/browse/LEAP-3459
jest.mock('./src/assets/shared/arrowDowngrade.svg', () => ({ __esModule: true, default: () => <>DowngradeArrow</> }));
jest.mock('./src/assets/shared/equalLvl.svg', () => ({ __esModule: true, default: () => <>Equal</> }));
jest.mock('./src/assets/shared/logoutIcon.svg', () => ({ __esModule: true, default: () => <>LogoutIcon</> }));
jest.mock('./src/assets/shared/warningStatus.svg', () => ({ __esModule: true, default: () => <>Warning</> }));
jest.mock('./src/assets/shared/history.svg', () => ({ __esModule: true, default: () => <>History</> }));
jest.mock('./src/assets/shared/avatarWarn.svg', () => ({ __esModule: true, default: () => <>AvatarWarn</> }));
jest.mock('./src/assets/tooltip/tooltipActive.svg', () => ({ __esModule: true, default: () => <>TooltipActive</> }));
jest.mock('./src/assets/tooltip/tooltipInactive.svg', () => ({ __esModule: true, default: () => <>TooltipInactive</> }));
jest.mock('./src/assets/tooltip/tooltipActivePlain.svg', () => ({ __esModule: true, default: () => <>TooltipInactivePlain</> }));
jest.mock('./src/assets/shared/giftCardEmptyStateIcon.svg', () => ({ __esModule: true, default: () => <>GiftCardEmptyState</> }));
jest.mock('./src/assets/shared/planetIcon.svg', () => ({ __esModule: true, default: () => <>PlanetIcon</> }));
jest.mock('./src/assets/shared/emailVerification.svg', () => ({ __esModule: true, default: () => <>EmailVerification</> }));
jest.mock('./src/assets/shared/emailVerificationFailed.svg', () => ({ __esModule: true, default: () => <>EmailVerificationFailed</> }));
// this reference should be removed with this ticket https://sywjira.atlassian.net/browse/LEAP-3459
jest.mock('./src/assets/shared/arrowDownRed.svg', () => ({ __esModule: true, default: () => <>ArrowDownRed</> }));
jest.mock('./src/assets/spinner/betaVersion@3x.svg', () => ({ __esModule: true, default: () => <>BetaVersion</> }));
jest.mock('./src/assets/shared/sywIconDarkBlue.svg', () => ({ __esModule: true, default: () => <>SYWIconDark</> }));
jest.mock('./src/assets/shared/bustedIcon.svg', () => ({ __esModule: true, default: () => <>BustedIcon</> }));
jest.mock('./src/assets/notification-modal/step1@3x.svg', () => ({ __esModule: true, default: () => <>Step1</> }));
jest.mock('./src/assets/notification-modal/step2@3x.svg', () => ({ __esModule: true, default: () => <>Step2</> }));
jest.mock('./src/assets/notification-modal/step3@3x.svg', () => ({ __esModule: true, default: () => <>Step3</> }));
jest.mock('./src/assets/notification-modal/step4@3x.svg', () => ({ __esModule: true, default: () => <>Step4</> }));
jest.mock('./src/assets/shared/streakIcon.svg', () => ({ __esModule: true, default: () => <>StreakIcon</> }));
jest.mock('./src/assets/shared/exclamationCircle.svg', () => ({ __esModule: true, default: () => <>ExclamationCircle</> }));
jest.mock('./src/assets/button/shortArrowRight.svg', () => ({ __esModule: true, default: () => <>ShortArrowRight</> }));
jest.mock('./src/assets/shared/surveyIcon.svg', () => ({ __esModule: true, default: () => <>SurveyIcon</> }));
jest.mock('./src/assets/shared/wavingHand.svg', () => ({ __esModule: true, default: () => <>WavingHand</> }));
jest.mock('./src/assets/shared/searsLogo.svg', () => ({ __esModule: true, default: () => <>SearsLogo</> }));
jest.mock('./src/assets/shared/kmartLogo.svg', () => ({ __esModule: true, default: () => <>KmartLogo</> }));
jest.mock('./src/assets/shared/sywRewardCardLogo.svg', () => ({ __esModule: true, default: () => <>sywRewardCardLogo</> }));
jest.mock('./src/assets/shared/warningSection.svg', () => ({ __esModule: true, default: () => <>WarningSection</> }));
jest.mock('./src/assets/shared/disabledStar.svg', () => ({ __esModule: true, default: () => <>DisabledStar</> }));
jest.mock('./src/assets/shared/path.svg', () => ({ __esModule: true, default: () => <>Path</> }));
jest.mock('./src/assets/shared/sywmaxLogo.svg', () => ({ __esModule: true, default: () => <>SywMaxLogo</> }));
jest.mock('./src/assets/shared/starGray.svg', () => ({ __esModule: true, default: () => <>StarGray</> }));
jest.mock('./src/assets/shared/cardError.svg', () => ({ __esModule: true, default: () => <>CardError</> }));
jest.mock('./src/assets/in-store-offer/cardFallback.svg', () => ({ __esModule: true, default: () => <>CardFallbackIcon</> }));
jest.mock('./src/assets/in-store-offer/refreshFallBack.svg', () => ({ __esModule: true, default: () => <>RefreshFallBackIcon</> }));
jest.mock('./src/assets/in-store-offer/creditCardFallback.svg', () => ({ __esModule: true, default: () => <>CreditCardFallbackIcon</> }));
jest.mock('./src/assets/in-store-offer/refreshFallBackCloud.svg', () => ({ __esModule: true, default: () => <>RefreshFallBackCloudIcon</> }));
jest.mock('./src/assets/shared/simpleEmptyStar.svg', () => ({ __esModule: true, default: () => <>SimpleEmptyStar</> }));
jest.mock('./src/assets/shared/simpleFilledStar.svg', () => ({ __esModule: true, default: () => <>SimpleFilledStar</> }));
jest.mock('./src/assets/shared/surveyEmptyIcon.svg', () => ({ __esModule: true, default: () => <>SurveyEmptyIcon</> }));
jest.mock('./src/assets/shared/circleCartError.svg', () => ({ __esModule: true, default: () => <>CircleCartErrorIcon</> }));
jest.mock('./src/assets/in-store-offer/locationError.svg', () => ({ __esModule: true, default: () => <>LocationErrorIcon</> }));
jest.mock('./src/assets/shared/cardIconDarkBlue.svg', () => ({ __esModule: true, default: () => <>CardIconDarkBlue</> }));
jest.mock('./src/assets/in-store-offer/creditCard.svg', () => ({ __esModule: true, default: () => <>CreditCardIcon</> }));
jest.mock('./src/assets/in-store-offer/rightAngleBracket.svg', () => ({ __esModule: true, default: () => <>RightAngleBracketIcon</> }));
jest.mock('./src/assets/in-store-offer/cardLinkFallback.svg', () => ({ __esModule: true, default: () => <>CardLinkFallbackIcon</> }));
jest.mock('./src/assets/in-store-offer/restaurantFallback.svg', () => ({ __esModule: true, default: () => <>RestaurantFallback</> }));
jest.mock('./src/assets/shared/giftCardFallback.svg', () => ({ __esModule: true, default: () => <>GiftCardFallback</> }));
jest.mock('./src/assets/in-store-offer/locationPurpleError.svg', () => ({ __esModule: true, default: () => <>LocationErrorIcon</> }));
jest.mock('./src/assets/shared/giftCardCodeFallback.svg', () => ({ __esModule: true, default: () => <>GiftCardCodeFallback</> }));
jest.mock('./src/assets/shared/closeCircleIcon.svg', () => ({ __esModule: true, default: () => <>CloseCircleIcon</> }));
jest.mock('./src/assets/button/closeWhite.svg', () => ({ __esModule: true, default: () => <>CloseWhite</> }));
jest.mock('./src/assets/in-store-offer/amexCard.svg', () => ({ __esModule: true, default: () => <>AmexCardIcon</> }));
jest.mock('./src/assets/in-store-offer/discoverCard.svg', () => ({ __esModule: true, default: () => <>DiscoverCardIcon</> }));
jest.mock('./src/assets/in-store-offer/masterCard.svg', () => ({ __esModule: true, default: () => <>MasterCardIcon</> }));
jest.mock('./src/assets/in-store-offer/visaCard.svg', () => ({ __esModule: true, default: () => <>VisaCardIcon</> }));
jest.mock('./src/assets/in-store-offer/howItWorks.svg', () => ({ __esModule: true, default: () => <>HowItWorksIcon</> }));
jest.mock('./src/assets/in-store-offer/howItWorksActive.svg', () => ({ __esModule: true, default: () => <>HowItWorksActiveIcon</> }));
jest.mock('./src/assets/shared/noMissionsFallback.svg', () => ({ __esModule: true, default: () => <>NoMissionsFallback</> }));
jest.mock('./src/assets/fallbackTransactions/fallback.svg', () => ({ __esModule: true, default: () => <>FallbackIcon</> }));
jest.mock('./src/assets/fallbackTransactions/transactions.svg', () => ({ __esModule: true, default: () => <>TransactionsIcon</> }));
jest.mock('./src/assets/fallbackTransactions/localOffers.svg', () => ({ __esModule: true, default: () => <>LocalOffersIcon</> }));
jest.mock('./src/assets/fallbackTransactions/missions.svg', () => ({ __esModule: true, default: () => <>MissionsIcon</> }));
jest.mock('./src/assets/fallbackTransactions/mastercard.svg', () => ({ __esModule: true, default: () => <>MastercardIcon</> }));
jest.mock('_assets/wallet/saveToGooglePay.svg', () => ({ __esModule: true, default: () => <>SaveToGooglePay</> }));
jest.mock('./src/assets/shared/localOfferBanner.svg', () => ({ __esModule: true, default: () => <>LocalOfferBannerBackground</> }));
jest.mock('_assets/shared/emptyState.svg', () => ({ __esModule: true, default: () => <>EmptyState</> }));
jest.mock('_assets/shared/giftEmoji.svg', () => ({ __esModule: true, default: () => <>GiftEmoji</> }));
jest.mock('_assets/shared/smileyFaceEmoji.svg', () => ({ __esModule: true, default: () => <>SmileyFaceEmoji</> }));
jest.mock('_assets/shared/rocketEmoji.svg', () => ({ __esModule: true, default: () => <>RocketEmoji</> }));
jest.mock('_assets/missions/online-progress.svg', () => ({ __esModule: true, default: () => <>OnlineProgress</> }));

const animationMethods = [
  'bounce',
  'flash',
  'jello',
  'pulse',
  'rotate',
  'rubberBand',
  'shake',
  'swing',
  'tada',
  'wobble',
  'bounceIn',
  'bounceInDown',
  'bounceInUp',
  'bounceInLeft',
  'bounceInRight',
  'bounceOut',
  'bounceOutDown',
  'bounceOutUp',
  'bounceOutLeft',
  'bounceOutRight',
  'fadeIn',
  'fadeInDown',
  'fadeInDownBig',
  'fadeInUp',
  'fadeInUpBig',
  'fadeInLeft',
  'fadeInLeftBig',
  'fadeInRight',
  'fadeInRightBig',
  'fadeOut',
  'fadeOutDown',
  'fadeOutDownBig',
  'fadeOutUp',
  'fadeOutUpBig',
  'fadeOutLeft',
  'fadeOutLeftBig',
  'fadeOutRight',
  'fadeOutRightBig',
  'flipInX',
  'flipInY',
  'flipOutX',
  'flipOutY',
  'lightSpeedIn',
  'lightSpeedOut',
  'slideInDown',
  'slideInUp',
  'slideInLeft',
  'slideInRight',
  'slideOutDown',
  'slideOutUp',
  'slideOutLeft',
  'slideOutRight',
  'zoomIn',
  'zoomInDown',
  'zoomInUp',
  'zoomInLeft',
  'zoomInRight',
  'zoomOut',
  'zoomOutDown',
  'zoomOutUp',
  'zoomOutLeft',
  'zoomOutRight'
];
