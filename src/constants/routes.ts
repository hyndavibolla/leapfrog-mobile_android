import { TransactionFilter } from '_models/offer';

export const ROUTES = {
  DEV_TOOLS: 'devTools',
  DEV_TOOLS_TAB: {
    LOG: 'devTools/logs',
    API_OVERRIDE: 'devTools/apiOverride',
    STORAGE: 'devTools/storageEditor',
    STORYBOOK: 'devTools/storybook'
  },
  SPLASH: 'splash',
  LOGIN: 'login',
  TERMS_AND_CONDITIONS: 'terms-and-conditions',
  PRIVACY_POLICY: 'privacy-policy',
  HOW_IT_WORKS: {
    TITLE: 'how-it-works',
    BENEFITS: 'how-it-works/benefits',
    LEVELS: 'how-it-works/levels',
    POINTS: 'how-it-works/points',
    FAQ: 'how-it-works/faqs'
  },
  MAIN: 'main',
  MAIN_TAB: {
    MAIN: 'main-tabs',
    STREAK: 'streaks',
    EARN: 'earn',
    REWARDS: 'rewards',
    WALLET: 'wallet'
  },
  WALLET: {
    REDEMPTIONS: 'redemptions',
    CREDIT_CARDS: 'credit-cards'
  },
  POINT_HISTORY: 'transactions',
  MISSION_SEE_ALL: 'earn/search',
  GIFT_CARD_SEE_ALL: 'rewards/search',
  MISSION_DETAIL: 'earn/offer',
  GIFT_CARD_LIST_DETAIL: 'wallet/giftcard/detail',
  GIFT_CARD_BALANCE: 'wallet/giftcard/balance',
  GIFT_CARD_GOOGLE_PAY: 'wallet/giftcard/google-pay',
  GIFT_CARD_DETAIL: 'rewards/brand',
  GIFT_CARD_CHECKOUT: 'rewards/gc/checkout',
  FUSION_VIEWER: 'cc-application-finished',
  PROFILE: 'profile',
  EDIT_PROFILE: 'profile/edit',
  DELETE_ACCOUNT: 'profile/deleteAccount',
  TOOLTIP: {
    ONBOARDING: 'onboarding/tooltip',
    ONBOARDING_STEP_1: 'onboarding/tooltip/1',
    ONBOARDING_STEP_2: 'onboarding/tooltip/2',
    ONBOARDING_STEP_3: 'onboarding/tooltip/3',
    EARN: 'earn/tooltip',
    EARN_STEP_1: 'earn/tooltip/1',
    EARN_STEP_2: 'earn/tooltip/2',
    REWARDS: 'rewards/tooltip',
    REWARDS_STEP_1: 'rewards/tooltip/1',
    REWARDS_STEP_2: 'rewards/tooltip/2',
    MISSIONS: 'missions/tooltip',
    MISSIONS_STEP_1: 'missions/tooltip/1',
    MISSIONS_STEP_2: 'missions/tooltip/2',
    MISSIONS_STEP_3: 'missions/tooltip/3'
  },
  TRACKING_MODALS: {
    EARN_BRAND_CATEGORY_LIST: 'earn/brand-category-list',
    REWARDS_CHOOSE_CATEGORIES: 'rewards/brand-category-list'
  },
  STREAK_LIST: 'streak/search',
  SURVEY_DETAIL: 'surveys',
  SURVEY_PQ: 'surveys/pq',
  IN_STORE_OFFERS: {
    OFFER_SEARCH_MAP: 'inStore/offer/map',
    MAP_SEARCH: 'inStore/map',
    OFFER_DETAIL: 'inStore/offer/detail',
    CARD_LINK: 'inStore/cardLink',
    WEB_VIEW: 'inStore/webview'
  },
  APPLY_NOW: 'apply-now',
  MANAGE_SYW_CARD: 'wallet/manage',
  WALLET_DETAIL: 'wallet/card/detail',
  FORCED_UPDATE_MODAL: 'forced-update',
  TRANSACTION_FILTERS: {
    MAIN: 'transaction/filters',
    TRANSACTIONS_LOCAL_OFFERS: `transaction/filters/${TransactionFilter.LOCAL_OFFERS}`,
    TRANSACTIONS_MISSIONS: `transaction/filters/${TransactionFilter.MISSIONS}`,
    TRANSACTIONS_REWARDS: `transaction/filters/${TransactionFilter.REWARDS}`,
    TRANSACTIONS_SYW_MASTERCARD: `transaction/filters/${TransactionFilter.SYW_MASTERCARD}`
  },
  COMMON_WEB_VIEW: {
    MAIN: 'webview'
  },
  FILTER: 'rewards/filter',
  MISSION_SELECT_CATEGORY: 'earn/select-category',
  REWARDS_LIST_BY_CATEGORY: 'rewards/search/category',
  WALLET_YOUR_GIFT_CARDS: {
    MAIN: 'wallet/your-gift-cards',
    TAB_YOUR_GIFT_CARDS_ACTIVE: 'your-gift-cards/active',
    TAB_YOUR_GIFT_CARDS_ARCHIVED: 'your-gift-cards/archived'
  },
  UNIFIMONEY: 'unifimoney'
};

export const ROUTES_PARAMS = {
  [ROUTES.TOOLTIP.ONBOARDING]: ['step'],
  [ROUTES.TOOLTIP.EARN]: ['step'],
  [ROUTES.TOOLTIP.REWARDS]: ['step'],
  [ROUTES.TOOLTIP.MISSIONS]: ['step'],
  [ROUTES.MISSION_DETAIL]: ['brandRequestorId'],
  [ROUTES.GIFT_CARD_DETAIL]: ['brandId'],
  [ROUTES.TRANSACTION_FILTERS.MAIN]: ['filterName']
};

export const ROUTES_CONFIG = {
  screens: {
    [ROUTES.DEV_TOOLS]: ROUTES.DEV_TOOLS,
    [ROUTES.DEV_TOOLS_TAB.LOG]: ROUTES.DEV_TOOLS_TAB.LOG,
    [ROUTES.DEV_TOOLS_TAB.API_OVERRIDE]: ROUTES.DEV_TOOLS_TAB.API_OVERRIDE,
    [ROUTES.DEV_TOOLS_TAB.STORAGE]: ROUTES.DEV_TOOLS_TAB.STORAGE,
    [ROUTES.DEV_TOOLS_TAB.STORYBOOK]: ROUTES.DEV_TOOLS_TAB.STORYBOOK,
    [ROUTES.SPLASH]: ROUTES.SPLASH,
    [ROUTES.LOGIN]: ROUTES.LOGIN,
    [ROUTES.TERMS_AND_CONDITIONS]: ROUTES.TERMS_AND_CONDITIONS,
    [ROUTES.PRIVACY_POLICY]: ROUTES.PRIVACY_POLICY,
    [ROUTES.HOW_IT_WORKS.TITLE]: {
      screens: {
        [ROUTES.HOW_IT_WORKS.TITLE]: ROUTES.HOW_IT_WORKS.TITLE,
        [ROUTES.HOW_IT_WORKS.BENEFITS]: ROUTES.HOW_IT_WORKS.BENEFITS,
        [ROUTES.HOW_IT_WORKS.LEVELS]: ROUTES.HOW_IT_WORKS.LEVELS,
        [ROUTES.HOW_IT_WORKS.POINTS]: ROUTES.HOW_IT_WORKS.POINTS,
        [ROUTES.HOW_IT_WORKS.FAQ]: ROUTES.HOW_IT_WORKS.FAQ
      }
    },
    [ROUTES.MAIN]: {
      screens: {
        [ROUTES.MAIN_TAB.MAIN]: {
          screens: {
            [ROUTES.MAIN_TAB.STREAK]: ROUTES.MAIN_TAB.STREAK,
            [ROUTES.MAIN_TAB.EARN]: ROUTES.MAIN_TAB.EARN,
            [ROUTES.MAIN_TAB.REWARDS]: ROUTES.MAIN_TAB.REWARDS,
            [ROUTES.MAIN_TAB.WALLET]: ROUTES.MAIN_TAB.WALLET
          }
        }
      }
    },
    [ROUTES.POINT_HISTORY]: ROUTES.POINT_HISTORY,
    [ROUTES.MISSION_SEE_ALL]: ROUTES.MISSION_SEE_ALL,
    [ROUTES.GIFT_CARD_SEE_ALL]: ROUTES.GIFT_CARD_SEE_ALL,
    [ROUTES.MISSION_DETAIL]: { path: `${ROUTES.MISSION_DETAIL}/:brandRequestorId?` },
    [ROUTES.GIFT_CARD_DETAIL]: { path: `${ROUTES.GIFT_CARD_DETAIL}/:brandId?` },
    [ROUTES.GIFT_CARD_BALANCE]: ROUTES.GIFT_CARD_BALANCE,
    [ROUTES.GIFT_CARD_GOOGLE_PAY]: ROUTES.GIFT_CARD_GOOGLE_PAY,
    [ROUTES.GIFT_CARD_CHECKOUT]: ROUTES.GIFT_CARD_CHECKOUT,
    [ROUTES.FUSION_VIEWER]: ROUTES.FUSION_VIEWER,
    [ROUTES.PROFILE]: ROUTES.PROFILE,
    [ROUTES.EDIT_PROFILE]: ROUTES.EDIT_PROFILE,
    [ROUTES.DELETE_ACCOUNT]: ROUTES.DELETE_ACCOUNT,
    [ROUTES.TOOLTIP.ONBOARDING]: { path: `${ROUTES.TOOLTIP.ONBOARDING}/:step?` },
    [ROUTES.TOOLTIP.EARN]: { path: `${ROUTES.TOOLTIP.EARN}/:step?` },
    [ROUTES.TOOLTIP.REWARDS]: { path: `${ROUTES.TOOLTIP.REWARDS}/:step?` },
    [ROUTES.TOOLTIP.MISSIONS]: { path: `${ROUTES.TOOLTIP.MISSIONS}/:step?` },
    [ROUTES.STREAK_LIST]: ROUTES.STREAK_LIST,
    [ROUTES.SURVEY_DETAIL]: ROUTES.SURVEY_DETAIL,
    [ROUTES.SURVEY_PQ]: ROUTES.SURVEY_PQ,
    [ROUTES.IN_STORE_OFFERS.OFFER_SEARCH_MAP]: ROUTES.IN_STORE_OFFERS.OFFER_SEARCH_MAP,
    [ROUTES.IN_STORE_OFFERS.MAP_SEARCH]: ROUTES.IN_STORE_OFFERS.MAP_SEARCH,
    [ROUTES.IN_STORE_OFFERS.OFFER_DETAIL]: ROUTES.IN_STORE_OFFERS.OFFER_DETAIL,
    [ROUTES.IN_STORE_OFFERS.CARD_LINK]: ROUTES.IN_STORE_OFFERS.CARD_LINK,
    [ROUTES.IN_STORE_OFFERS.WEB_VIEW]: ROUTES.IN_STORE_OFFERS.WEB_VIEW,
    [ROUTES.APPLY_NOW]: ROUTES.APPLY_NOW,
    [ROUTES.MANAGE_SYW_CARD]: ROUTES.MANAGE_SYW_CARD,
    [ROUTES.WALLET_DETAIL]: ROUTES.WALLET_DETAIL,
    [ROUTES.TRANSACTION_FILTERS.MAIN]: { path: `${ROUTES.TRANSACTION_FILTERS.MAIN}/:filterName?` }
  }
};

export const ARCHIVED_ROUTES = {
  'main/earn': ROUTES.MAIN_TAB.EARN,
  'main/rewards': ROUTES.MAIN_TAB.REWARDS,
  'main/wallet%20%3E%20cc': ROUTES.MAIN_TAB.WALLET,
  'How%20It%20Works': ROUTES.HOW_IT_WORKS.TITLE,
  'How%20It%20Works/how%20it%20works%20%3E%20benefits': ROUTES.HOW_IT_WORKS.BENEFITS,
  'How%20It%20Works/how%20it%20works%20%3E%20levels': ROUTES.HOW_IT_WORKS.LEVELS,
  'How%20It%20Works/how%20it%20works%20%3E%20points': ROUTES.HOW_IT_WORKS.POINTS,
  'How%20It%20Works/how%20it%20works%20%3E%20faqs': ROUTES.HOW_IT_WORKS.FAQ,
  Transactions: ROUTES.POINT_HISTORY,
  'earn%20%3E%20search%20results': ROUTES.MISSION_SEE_ALL,
  'rewards%20%3E%20search%20results': ROUTES.GIFT_CARD_SEE_ALL,
  ccApplicationFinished: ROUTES.FUSION_VIEWER,
  'earn%20tooltip': ROUTES.TOOLTIP.EARN,
  'rewards%20tooltip': ROUTES.TOOLTIP.REWARDS,
  'Terms%20and%20Conditions': ROUTES.TERMS_AND_CONDITIONS,
  'Privacy%20Policy': ROUTES.PRIVACY_POLICY,
  'rewards%20%3E%20gc%20checkout': ROUTES.GIFT_CARD_CHECKOUT,
  'Dev%20Tools': ROUTES.DEV_TOOLS,
  'Dev%20Tools/Logs': ROUTES.DEV_TOOLS_TAB.LOG,
  'Dev%20Tools/API%20Override': ROUTES.DEV_TOOLS_TAB.API_OVERRIDE,
  Splash: ROUTES.SPLASH,
  Login: ROUTES.LOGIN
};
