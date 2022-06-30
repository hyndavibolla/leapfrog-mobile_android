import { ROUTES } from './routes';

export enum ForterNavigationType {
  PRODUCT = 'PRODUCT',
  ACCOUNT = 'ACCOUNT',
  SEARCH = 'SEARCH',
  CHECKOUT = 'CHECKOUT',
  CART = 'CART',
  HELP = 'HELP',
  APP = 'APP'
}

export enum ForterActionType {
  TAP = 'TAP',
  CLIPBOARD = 'CLIPBOARD',
  TYPING = 'TYPING',
  ADD_TO_CART = 'ADD_TO_CART',
  REMOVE_FROM_CART = 'REMOVE_FROM_CART',
  ACCEPTED_PROMOTION = 'ACCEPTED_PROMOTION',
  ACCEPTED_TOS = 'ACCEPTED_TOS',
  ACCOUNT_LOGIN = 'ACCOUNT_LOGIN',
  ACCOUNT_LOGOUT = 'ACCOUNT_LOGOUT',
  ACCOUNT_ID_ADDED = 'ACCOUNT_ID_ADDED',
  PAYMENT_INFO = 'PAYMENT_INFO',
  SHARE = 'SHARE',
  CONFIGURATION_UPDATE = 'CONFIGURATION_UPDATE',
  APP_ACTIVE = 'APP_ACTIVE',
  APP_PAUSE = 'APP_PAUSE',
  RATE = 'RATE',
  IS_JAILBROKEN = 'IS_JAILBROKEN',
  SEARCH_QUERY = 'SEARCH_QUERY',
  REFERRER = 'REFERRER',
  WEBVIEW_TOKEN = 'WEBVIEW_TOKEN',
  OTHER = 'OTHER'
}

export enum ConversionEventType {
  LOGIN = 'login',
  LOGIN_ATTEMPT = 'login_attempt',
  REGISTER = 'af_complete_registration'
}

export enum UxObject {
  LIST = 'list',
  BUTTON = 'button',
  SEARCH = 'search',
  TILE = 'tile',
  CARD = 'card',
  TOOLTIP_OVERLAY = 'tooltip overlay'
}

export enum TealiumEventType {
  LOGIN = 'authentication',
  SYSTEM = 'system',
  ACCOUNT = 'account update',
  INITIATE_WALLET = 'initiate_wallet',
  INITIATE_MISSIONS = 'initiate_missions',
  INITIATE_LOCAL_OFFERS = 'initiate_local_offers',
  INITIATE_CITI_APPLICATION = 'initiate_citi_application',
  LOGOUT = 'logout',
  BACK_TO_FOREGROUND = 'foreground',
  BACKGROUND = 'background',
  FUSION_INTERACTION_END = 'fusion',
  LAUNCH = 'launch',
  ERROR = 'error',
  LEVEL_CHANGE = 'level change',
  SEARCH = 'search',
  SELECT_MISSION = 'affiliate brand',
  SELECT_GIFT_CARD = 'rewards brand',
  CHECKOUT_GIFT_CARD = 'rewards checkout',
  CARD_APPLICATION = 'card application',
  CARD_APPLICATION_COMPLETE = 'card application complete',
  SELECT_GIFT_CARD_CATEGORY = 'rewards brand category',
  EDIT_SYW_ACCOUNT = 'edit syw account',
  PROFILE = 'profile',
  EXIT_TO_AFFILIATE_BRAND = 'affiliate brand exit',
  SELECT_AFFILIATE_BRAND_CATEGORY = 'affiliate brand category',
  EARN_TOOLTIP = 'earn tooltip',
  EARN_TOOLTIP_STEP_1_SUCCESS = 'earn tooltip step 1 success',
  EARN_TOOLTIP_STEP_2_SUCCESS = 'earn tooltip step 2 success',
  EARN_TOOLTIP_STEP_1_CANCEL = 'earn tooltip step 1 cancel',
  EARN_TOOLTIP_STEP_2_CANCEL = 'earn tooltip step 2 cancel',
  REWARD_TOOLTIP = 'rewards tooltip',
  REWARD_TOOLTIP_STEP_1_SUCCESS = 'rewards tooltip step 1 success',
  REWARD_TOOLTIP_STEP_2_SUCCESS = 'rewards tooltip step 2 success',
  REWARD_TOOLTIP_STEP_1_CANCEL = 'rewards tooltip step 1 cancel',
  REWARD_TOOLTIP_STEP_2_CANCEL = 'rewards tooltip step 2 cancel',
  MISSIONS_TOOLTIP = 'missions tooltip',
  MISSIONS_TOOLTIP_STEP_1_SUCCESS = 'missions tooltip step 1 success',
  MISSIONS_TOOLTIP_STEP_2_SUCCESS = 'missions tooltip step 2 success',
  MISSIONS_TOOLTIP_STEP_3_SUCCESS = 'missions tooltip step 3 success',
  MISSIONS_TOOLTIP_STEP_1_CANCEL = 'missions tooltip step 1 cancel',
  MISSIONS_TOOLTIP_STEP_2_CANCEL = 'missions tooltip step 2 cancel',
  MISSIONS_TOOLTIP_STEP_3_CANCEL = 'missions tooltip step 3 cancel',
  SURVEY_CARD_TAP = 'survey card tap',
  NEW_ON_MAX_CARD_TAP = 'new on max',
  OFFER = 'offer',
  IN_STORE = 'in-store',
  EXIT = 'exit',
  LOCATION = 'location',
  CARD = 'card',
  CARDLINK = 'cardlink',
  WALLET = 'wallet',
  ONBOARDING_STEP_1_SUCCESS = 'onboarding step 1 success',
  ONBOARDING_STEP_2_SUCCESS = 'onboarding step 2 success',
  ONBOARDING_STEP_3_SUCCESS = 'onboarding step 3 success',
  ONBOARDING_STEP_1_CANCEL = 'onboarding step 1 cancel',
  ONBOARDING_STEP_2_CANCEL = 'onboarding step 2 cancel',
  ONBOARDING_STEP_3_CANCEL = 'onboarding step 3 cancel',
  GIFT_CARD_ARCHIVE = 'giftcard_archive',
  GIFT_CARD_UNARCHIVE = 'giftcard_unarchive',
  SET_PN_PREFERENCE = 'set PN preference',
  TUTORIAL = 'tutorial',
  TUTORIAL_SKIPPED = 'tutorial_skipped',
  TUTORIAL_BANNER_SHOWN = 'tutorial_banner_shown',
  TUTORIAL_NEXT = 'tutorial_next',
  TUTORIAL_COMPLETED = 'tutorial_completed',
  TUTORIAL_REMINDER_SHOWN = 'tutorial_reminder_shown',
  TERMS_WALLET = '5321_terms_wallet',
  TERMS_MISSIONS = '5321_terms_missions',
  TERMS_LOCAL_OFFERS = '5321_terms_local_offers',
  TERMS_OTHER = '5321_terms_other',
  CLAIM_REWARDS_CARDS = 'claim_rewards_cards',
  CARD_TAPPED = 'card_tapped'
}

export enum EventDetail {
  ACTIVATION = 'activation',
  OPEN = 'open',
  CLOSE = 'close',
  ENROLL = 'enroll',
  UNENROLL = 'unenroll',
  RECENTLY_VIEWED_MISSIONS = 'recently_viewed_brands'
}

export const PageNames = {
  MAIN: {
    EARN: 'Main > Earn',
    MISSIONS: 'Main > Streaks',
    REWARDS: 'Main > Rewards',
    WALLET: 'Main > Wallet'
  },
  EARN: {
    EARN_CATEGORY: 'Main > Earn > Search > Category List',
    MISSION_SEE_ALL: 'Main > Earn > Search > :listName: > See All',
    MISSION_DETAIL: 'Main > Earn > Offer > :brandName:'
  },
  REWARDS: {
    REWARDS_CATEGORY: 'Main > Rewards > Search > Category List',
    REWARDS_SEARCH: 'Main > Rewards > Search > See All',
    REWARDS_BRAND: 'Main > Rewards > GiftCard > :brandName:',
    REWARDS_CHECKOUT: 'Main > Rewards > GiftCard > :brandName: > Checkout'
  },
  WALLET: {
    WALLET_YOUR_GIFT_CARDS_ACTIVE: 'Main > Wallet > Gift Cards > Active',
    WALLET_YOUR_GIFT_CARDS_ARCHIVED: 'Main > Wallet > Gift Cards > Archived',
    WALLET_GIFT_CARD: 'Main > Wallet > GiftCard > :brandName:',
    WALLET_DETAIL: 'Main > Wallet > Linked Card > :last4Digits:',
    WALLET_CARD_DETAIL: 'wallet/card/detail',
    REDEMPTIONS: 'wallet > redemptions',
    CREDIT_CARDS: 'wallet > credit cards'
  },
  PROFILE: {
    MAIN: 'Profile'
  },
  HOW_IT_WORKS: {
    BENEFITS: undefined,
    LEVELS: undefined,
    POINTS: 'How It Works > Points',
    FAQ: 'How It Works > FAQs'
  },
  IN_STORE_OFFERS: {
    OFFER_SEARCH_MAP: 'Main > Earn > In-Store Offers > Map',
    OFFER_DETAIL: 'Main > Earn > In-Store Offers > :brandName: > Detail'
  },
  TOOLTIP: {
    EARN_STEP_1: 'Main > Earn > Onboarding > 1',
    EARN_STEP_2: 'Main > Earn > Onboarding > 2',
    MISSIONS_STEP_1: 'Main > Streaks > Onboarding > 1',
    MISSIONS_STEP_2: 'Main > Streaks > Onboarding > 2',
    MISSIONS_STEP_3: 'Main > Streaks > Onboarding > 3',
    REWARDS_STEP_1: 'Main > Rewards > Onboarding > 1',
    REWARDS_STEP_2: 'Main > Rewards > Onboarding > 2',
    ONBOARDING_STEP_1: 'Onboarding > Screen 1',
    ONBOARDING_STEP_2: 'Onboarding > Screen 2',
    ONBOARDING_STEP_3: 'Onboarding > Screen 3'
  },
  SURVEY_DETAIL: 'Main > Earn > Surveys',
  CARDLINK: 'Main > Earn > In-Store Offers > CardLink',
  TUTORIAL: 'Tutorial'
};

export const PageByRoutes = {
  [ROUTES.HOW_IT_WORKS.BENEFITS]: PageNames.HOW_IT_WORKS.BENEFITS,
  [ROUTES.HOW_IT_WORKS.LEVELS]: PageNames.HOW_IT_WORKS.LEVELS,
  [ROUTES.HOW_IT_WORKS.POINTS]: PageNames.HOW_IT_WORKS.POINTS,
  [ROUTES.HOW_IT_WORKS.FAQ]: PageNames.HOW_IT_WORKS.FAQ,
  [ROUTES.MAIN_TAB.STREAK]: PageNames.MAIN.MISSIONS,
  [ROUTES.MAIN_TAB.EARN]: PageNames.MAIN.EARN,
  [ROUTES.MAIN_TAB.REWARDS]: PageNames.MAIN.REWARDS,
  [ROUTES.MAIN_TAB.WALLET]: PageNames.MAIN.WALLET,
  [ROUTES.TRACKING_MODALS.EARN_BRAND_CATEGORY_LIST]: PageNames.EARN.EARN_CATEGORY,
  [ROUTES.TRACKING_MODALS.REWARDS_CHOOSE_CATEGORIES]: PageNames.REWARDS.REWARDS_CATEGORY,
  [ROUTES.GIFT_CARD_SEE_ALL]: PageNames.REWARDS.REWARDS_SEARCH,
  [ROUTES.PROFILE]: PageNames.PROFILE.MAIN,
  [ROUTES.IN_STORE_OFFERS.OFFER_SEARCH_MAP]: PageNames.IN_STORE_OFFERS.OFFER_SEARCH_MAP,
  [ROUTES.IN_STORE_OFFERS.CARD_LINK]: PageNames.CARDLINK,
  [ROUTES.SURVEY_DETAIL]: PageNames.SURVEY_DETAIL,
  [ROUTES.TOOLTIP.EARN_STEP_1]: PageNames.TOOLTIP.EARN_STEP_1,
  [ROUTES.TOOLTIP.EARN_STEP_2]: PageNames.TOOLTIP.EARN_STEP_2,
  [ROUTES.TOOLTIP.MISSIONS_STEP_1]: PageNames.TOOLTIP.MISSIONS_STEP_1,
  [ROUTES.TOOLTIP.MISSIONS_STEP_2]: PageNames.TOOLTIP.MISSIONS_STEP_2,
  [ROUTES.TOOLTIP.MISSIONS_STEP_3]: PageNames.TOOLTIP.MISSIONS_STEP_3,
  [ROUTES.TOOLTIP.REWARDS_STEP_1]: PageNames.TOOLTIP.REWARDS_STEP_1,
  [ROUTES.TOOLTIP.REWARDS_STEP_2]: PageNames.TOOLTIP.REWARDS_STEP_2,
  [ROUTES.TOOLTIP.ONBOARDING_STEP_1]: PageNames.TOOLTIP.ONBOARDING_STEP_1,
  [ROUTES.TOOLTIP.ONBOARDING_STEP_2]: PageNames.TOOLTIP.ONBOARDING_STEP_2,
  [ROUTES.TOOLTIP.ONBOARDING_STEP_3]: PageNames.TOOLTIP.ONBOARDING_STEP_3,
  [ROUTES.WALLET_YOUR_GIFT_CARDS.TAB_YOUR_GIFT_CARDS_ACTIVE]: PageNames.WALLET.WALLET_YOUR_GIFT_CARDS_ACTIVE,
  [ROUTES.WALLET_YOUR_GIFT_CARDS.TAB_YOUR_GIFT_CARDS_ARCHIVED]: PageNames.WALLET.WALLET_YOUR_GIFT_CARDS_ARCHIVED,
  [ROUTES.WALLET.REDEMPTIONS]: PageNames.WALLET.REDEMPTIONS,
  [ROUTES.WALLET.CREDIT_CARDS]: PageNames.WALLET.CREDIT_CARDS
};

export const PageParams = {
  [PageNames.EARN.MISSION_SEE_ALL]: ['listName'],
  [PageNames.EARN.MISSION_DETAIL]: ['brandName'],
  [PageNames.REWARDS.REWARDS_BRAND]: ['brandName'],
  [PageNames.REWARDS.REWARDS_CHECKOUT]: ['brandName'],
  [PageNames.WALLET.WALLET_GIFT_CARD]: ['brandName'],
  [PageNames.WALLET.WALLET_DETAIL]: ['last4Digits'],
  [PageNames.IN_STORE_OFFERS.OFFER_DETAIL]: ['brandName']
};

const SECTION = {
  REDEEM: 'redeem',
  REWARDS: 'rewards',
  WALLET: 'wallet'
};

export const SECTION_MAP = {
  [TealiumEventType.SELECT_GIFT_CARD]: SECTION.REDEEM,
  [TealiumEventType.CARD_APPLICATION]: SECTION.WALLET,
  [TealiumEventType.CARD_APPLICATION_COMPLETE]: SECTION.WALLET,
  [TealiumEventType.SEARCH]: SECTION.REDEEM,
  [TealiumEventType.SELECT_GIFT_CARD_CATEGORY]: SECTION.REDEEM,
  [TealiumEventType.CHECKOUT_GIFT_CARD]: SECTION.REDEEM,
  [TealiumEventType.SEARCH]: ROUTES.MAIN_TAB.EARN,
  [TealiumEventType.EDIT_SYW_ACCOUNT]: ROUTES.PROFILE,
  [TealiumEventType.PROFILE]: ROUTES.DELETE_ACCOUNT,
  [TealiumEventType.SELECT_MISSION]: ROUTES.MAIN_TAB.EARN,
  [TealiumEventType.EXIT_TO_AFFILIATE_BRAND]: ROUTES.MAIN_TAB.EARN,
  [TealiumEventType.SELECT_AFFILIATE_BRAND_CATEGORY]: ROUTES.MAIN_TAB.EARN,
  [TealiumEventType.EARN_TOOLTIP]: ROUTES.MAIN_TAB.EARN,
  [TealiumEventType.EARN_TOOLTIP_STEP_1_SUCCESS]: ROUTES.MAIN_TAB.EARN,
  [TealiumEventType.EARN_TOOLTIP_STEP_2_SUCCESS]: ROUTES.MAIN_TAB.EARN,
  [TealiumEventType.EARN_TOOLTIP_STEP_1_CANCEL]: ROUTES.MAIN_TAB.EARN,
  [TealiumEventType.EARN_TOOLTIP_STEP_2_CANCEL]: ROUTES.MAIN_TAB.EARN,
  [TealiumEventType.SURVEY_CARD_TAP]: ROUTES.MAIN_TAB.EARN,
  [TealiumEventType.REWARD_TOOLTIP]: ROUTES.MAIN_TAB.REWARDS,
  [TealiumEventType.REWARD_TOOLTIP_STEP_1_SUCCESS]: ROUTES.MAIN_TAB.REWARDS,
  [TealiumEventType.REWARD_TOOLTIP_STEP_2_SUCCESS]: ROUTES.MAIN_TAB.REWARDS,
  [TealiumEventType.REWARD_TOOLTIP_STEP_1_CANCEL]: ROUTES.MAIN_TAB.REWARDS,
  [TealiumEventType.REWARD_TOOLTIP_STEP_2_CANCEL]: ROUTES.MAIN_TAB.REWARDS,
  [TealiumEventType.REWARD_TOOLTIP_STEP_2_CANCEL]: ROUTES.MAIN_TAB.REWARDS,
  [TealiumEventType.NEW_ON_MAX_CARD_TAP]: ROUTES.MAIN_TAB.EARN
};

export enum PageType {
  TOP = 'top-level-screen',
  PROMO = 'promo',
  SELECTION = 'selection',
  ACCOUNT = 'account',
  DELETE_SYW_ACCOUNT = 'delete_account',
  SEARCH = 'search',
  INFO = 'info',
  BOF = 'bof',
  CARD_CLICK = 'card click',
  CARD_CLOSE = 'card close',
  SURVEY_PQ = 'prequal',
  SURVEY_DETAIL = 'survey'
}

export const PAGE_TYPE_MAP = {
  [ROUTES.TOOLTIP.EARN_STEP_1]: PageType.INFO,
  [ROUTES.TOOLTIP.EARN_STEP_2]: PageType.INFO,
  [ROUTES.TOOLTIP.REWARDS_STEP_1]: PageType.INFO,
  [ROUTES.TOOLTIP.REWARDS_STEP_2]: PageType.INFO,
  [ROUTES.TOOLTIP.MISSIONS_STEP_1]: PageType.INFO,
  [ROUTES.TOOLTIP.MISSIONS_STEP_2]: PageType.INFO,
  [ROUTES.TOOLTIP.MISSIONS_STEP_3]: PageType.INFO,
  [ROUTES.HOW_IT_WORKS.BENEFITS]: PageType.INFO,
  [ROUTES.HOW_IT_WORKS.LEVELS]: PageType.INFO,
  [ROUTES.HOW_IT_WORKS.POINTS]: PageType.INFO,
  [ROUTES.HOW_IT_WORKS.FAQ]: PageType.INFO,
  [ROUTES.MAIN]: PageType.TOP,
  [ROUTES.MAIN_TAB.STREAK]: PageType.TOP,
  [ROUTES.MAIN_TAB.EARN]: PageType.TOP,
  [ROUTES.MAIN_TAB.REWARDS]: PageType.TOP,
  [ROUTES.MAIN_TAB.WALLET]: PageType.TOP,
  [ROUTES.POINT_HISTORY]: PageType.ACCOUNT,
  [ROUTES.MISSION_SEE_ALL]: PageType.SELECTION,
  [ROUTES.GIFT_CARD_SEE_ALL]: PageType.SELECTION,
  [ROUTES.MISSION_DETAIL]: PageType.PROMO,
  [ROUTES.GIFT_CARD_DETAIL]: PageType.BOF,
  [ROUTES.GIFT_CARD_CHECKOUT]: PageType.BOF,
  [ROUTES.PROFILE]: PageType.ACCOUNT,
  [ROUTES.TRACKING_MODALS.EARN_BRAND_CATEGORY_LIST]: PageType.SELECTION,
  [ROUTES.TRACKING_MODALS.REWARDS_CHOOSE_CATEGORIES]: PageType.SELECTION,
  [ROUTES.STREAK_LIST]: PageType.SELECTION,
  [ROUTES.SURVEY_DETAIL]: PageType.INFO
};

export const SECTION_PAGE_MAP = {
  [ROUTES.TOOLTIP.EARN_STEP_1]: ROUTES.MAIN_TAB.EARN,
  [ROUTES.TOOLTIP.EARN_STEP_2]: ROUTES.MAIN_TAB.EARN,
  [ROUTES.TOOLTIP.REWARDS_STEP_1]: ROUTES.MAIN_TAB.REWARDS,
  [ROUTES.TOOLTIP.REWARDS_STEP_2]: ROUTES.MAIN_TAB.REWARDS,
  [ROUTES.TOOLTIP.MISSIONS_STEP_1]: ROUTES.MAIN_TAB.STREAK,
  [ROUTES.TOOLTIP.MISSIONS_STEP_2]: ROUTES.MAIN_TAB.STREAK,
  [ROUTES.TOOLTIP.MISSIONS_STEP_3]: ROUTES.MAIN_TAB.STREAK,
  [ROUTES.MAIN_TAB.EARN]: ROUTES.MAIN_TAB.EARN,
  [ROUTES.MAIN_TAB.REWARDS]: SECTION.REWARDS,
  [ROUTES.MAIN_TAB.WALLET]: SECTION.WALLET,
  [ROUTES.PROFILE]: ROUTES.PROFILE,
  [ROUTES.TRACKING_MODALS.EARN_BRAND_CATEGORY_LIST]: ROUTES.MAIN_TAB.EARN,
  [ROUTES.TRACKING_MODALS.REWARDS_CHOOSE_CATEGORIES]: SECTION.REDEEM,
  [ROUTES.GIFT_CARD_SEE_ALL]: SECTION.REDEEM,
  [ROUTES.HOW_IT_WORKS.BENEFITS]: ROUTES.PROFILE,
  [ROUTES.HOW_IT_WORKS.LEVELS]: ROUTES.PROFILE,
  [ROUTES.HOW_IT_WORKS.POINTS]: ROUTES.PROFILE,
  [ROUTES.HOW_IT_WORKS.FAQ]: ROUTES.PROFILE,
  [ROUTES.GIFT_CARD_DETAIL]: SECTION.REDEEM,
  [ROUTES.MISSION_DETAIL]: ROUTES.MAIN_TAB.EARN,
  [ROUTES.MISSION_SEE_ALL]: ROUTES.MAIN_TAB.EARN,
  [ROUTES.GIFT_CARD_CHECKOUT]: SECTION.REDEEM,
  [ROUTES.SURVEY_DETAIL]: ROUTES.SURVEY_DETAIL
};

export const FORTER_ROUTE_MAP = {
  [ROUTES.MAIN]: ForterNavigationType.APP,
  [ROUTES.MAIN_TAB.STREAK]: ForterNavigationType.APP,
  [ROUTES.MAIN_TAB.EARN]: ForterNavigationType.APP,
  [ROUTES.MAIN_TAB.REWARDS]: ForterNavigationType.APP,
  [ROUTES.MAIN_TAB.WALLET]: ForterNavigationType.APP,
  [ROUTES.HOW_IT_WORKS.BENEFITS]: ForterNavigationType.HELP,
  [ROUTES.HOW_IT_WORKS.LEVELS]: ForterNavigationType.HELP,
  [ROUTES.HOW_IT_WORKS.POINTS]: ForterNavigationType.HELP,
  [ROUTES.HOW_IT_WORKS.FAQ]: ForterNavigationType.HELP,
  [ROUTES.POINT_HISTORY]: ForterNavigationType.ACCOUNT,
  [ROUTES.MISSION_SEE_ALL]: ForterNavigationType.SEARCH,
  [ROUTES.MISSION_DETAIL]: ForterNavigationType.PRODUCT,
  [ROUTES.GIFT_CARD_SEE_ALL]: ForterNavigationType.SEARCH,
  [ROUTES.GIFT_CARD_DETAIL]: ForterNavigationType.PRODUCT,
  [ROUTES.GIFT_CARD_CHECKOUT]: ForterNavigationType.CHECKOUT,
  [ROUTES.FUSION_VIEWER]: ForterNavigationType.CHECKOUT,
  [ROUTES.PROFILE]: ForterNavigationType.ACCOUNT,
  [ROUTES.TOOLTIP.ONBOARDING_STEP_1]: ForterNavigationType.APP,
  [ROUTES.TOOLTIP.ONBOARDING_STEP_2]: ForterNavigationType.APP,
  [ROUTES.TOOLTIP.ONBOARDING_STEP_3]: ForterNavigationType.APP,
  [ROUTES.TOOLTIP.EARN_STEP_1]: ForterNavigationType.HELP,
  [ROUTES.TOOLTIP.EARN_STEP_2]: ForterNavigationType.HELP,
  [ROUTES.TOOLTIP.REWARDS_STEP_1]: ForterNavigationType.HELP,
  [ROUTES.TOOLTIP.REWARDS_STEP_2]: ForterNavigationType.HELP,
  [ROUTES.TOOLTIP.MISSIONS_STEP_1]: ForterNavigationType.HELP,
  [ROUTES.TOOLTIP.MISSIONS_STEP_2]: ForterNavigationType.HELP,
  [ROUTES.TOOLTIP.MISSIONS_STEP_3]: ForterNavigationType.HELP,
  [ROUTES.TERMS_AND_CONDITIONS]: ForterNavigationType.HELP,
  [ROUTES.PRIVACY_POLICY]: ForterNavigationType.HELP,
  [ROUTES.SPLASH]: ForterNavigationType.APP,
  [ROUTES.LOGIN]: ForterNavigationType.APP,
  [ROUTES.TRACKING_MODALS.EARN_BRAND_CATEGORY_LIST]: ForterNavigationType.APP,
  [ROUTES.TRACKING_MODALS.REWARDS_CHOOSE_CATEGORIES]: ForterNavigationType.APP,
  [ROUTES.STREAK_LIST]: ForterNavigationType.APP,
  [ROUTES.SURVEY_DETAIL]: ForterNavigationType.APP
};

export const ROUTES_IGNORED_BY_TRACKER = [
  null, // on purpose: tracker should ignore null route names
  undefined, // on purpose: tracker should ignore undefined route names
  ROUTES.DEV_TOOLS,
  ROUTES.SPLASH,
  ROUTES.TERMS_AND_CONDITIONS,
  ROUTES.PRIVACY_POLICY,
  ROUTES.HOW_IT_WORKS.TITLE,
  ROUTES.FUSION_VIEWER,
  ROUTES.MISSION_DETAIL,
  ROUTES.SURVEY_DETAIL,
  ROUTES.GIFT_CARD_DETAIL,
  ...Object.values(ROUTES.TOOLTIP)
];
