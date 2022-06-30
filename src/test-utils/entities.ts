import { ENV } from '../constants';
import { UserModel, ActivityModel, OfferModel, GameModel, MissionModel, RewardModel, StreakModel, PromptModel } from '../models';
import {
  DayOfWeek,
  ICardLinkOffers,
  ILinkedCard,
  ProgramSubType,
  ProgramType,
  Providers,
  InStoreOfferStatus,
  ICardLinkOfferMerchant,
  ICardLinkOffer,
  LinkedCardPartnerType,
  IGeocodeAddress,
  LocationType,
  ILocationStorage,
  IGeocodePlace,
  IGeocodePlaceDetails,
  ICardLinkOfferCalendarBenefits
} from '_models/cardLink';
import { ISailthruMessage } from '_models/general';
import { barcodeType, IGiftCardDetail, IGiftCardBalance, methodType, redemptionType, IGiftCard, statusType } from '_models/giftCard';
import { IRecentSearchHistory, RecentSearchHistoryType, RedemptionType } from '_models/mission';
import { OfferType } from '_models/streak';

export const getUser = (): UserModel.IUser => ({
  firstName: 'John',
  lastName: 'wick',
  email: 'john.wick@email.com',
  avatarUrl: 'https://avatar.com',
  emailValidationStatus: UserModel.EmailStatus.APPROVED,
  sywUserId: '123456789',
  personal: {
    sywMemberNumber: '123',
    sywPinNumber: '1234567890123456',
    cellPhoneNumber: '2105428027',
    searsUserId: '123456789',
    homeAddress: {
      addressLine1: '7216 Aldea Dr',
      addressLine2: 'Unit #A',
      state: 'Texas',
      stateOther: null,
      city: 'Austin',
      zip: '78745',
      country: 'United States'
    },
    currentLocation: {
      zip: 90011,
      latitude: 55.0,
      longitude: -57.0
    }
  }
});

export const getGame = (): GameModel.IGame => ({
  balance: {
    availablePoints: 1500,
    pendingPoints: 200,
    memberOwnPointsToExpire: []
  },
  memberships: {
    userHasSywCard: true,
    userIsSywMaxMember: false,
    userIsAllowedToUseSywMax: true,
    sywCardLastFour: '1234'
  },
  missions: {
    pointsPerCent: 10
  },
  lastUpdatedAt: 1980
});

export const getOnboardingGame = (): GameModel.IGame => ({
  balance: {
    availablePoints: 0,
    pendingPoints: 200,
    memberOwnPointsToExpire: []
  },
  memberships: {
    userHasSywCard: true,
    userIsSywMaxMember: false,
    userIsAllowedToUseSywMax: true,
    sywCardLastFour: '1234'
  },
  missions: {
    pointsPerCent: 10
  },
  lastUpdatedAt: 1980
});

export const getSafeZoneGame = (): GameModel.IGame => ({
  balance: {
    availablePoints: 3000,
    pendingPoints: 200,
    memberOwnPointsToExpire: []
  },
  memberships: {
    userHasSywCard: true,
    userIsSywMaxMember: false,
    userIsAllowedToUseSywMax: true,
    sywCardLastFour: '1234'
  },
  missions: {
    pointsPerCent: 10
  },
  lastUpdatedAt: 1980
});

export const getOffer_1 = (): OfferModel.IOffer => ({
  id: 'offer-one',
  name: 'offer one',
  points: 200,
  pointsType: OfferModel.PointsType.EARN,
  programType: OfferModel.ProgramType.BIG,
  programSubCategory: OfferModel.ProgramSubCategory.GAS,
  pointStartDate: '2020-01-01T12:00:00.000Z',
  pointEndDate: '2020-02-01T12:00:00.000Z',
  dollarRedeemed: 10
});

export const getOffer_2 = (): OfferModel.IOffer => ({
  id: 'offer-two',
  name: 'offer two',
  points: 300,
  pointsType: OfferModel.PointsType.POINTS_AVAILABLE,
  programType: OfferModel.ProgramType.ONBOARDING,
  programSubCategory: OfferModel.ProgramSubCategory.GROCERY,
  pointStartDate: '2020-01-01T12:00:00.000Z',
  pointEndDate: '2020-02-01T12:00:00.000Z',
  dollarRedeemed: 10
});

export const getOffer_3 = (): OfferModel.IOffer => ({
  id: 'offer-three',
  name: 'offer three',
  points: 400,
  pointsType: OfferModel.PointsType.REDEEM,
  programType: OfferModel.ProgramType.SPEED,
  programSubCategory: OfferModel.ProgramSubCategory.KMART,
  pointStartDate: '2020-01-01T12:00:00.000Z',
  pointEndDate: '2020-02-01T12:00:00.000Z',
  dollarRedeemed: 10
});

export const getOffer_4 = (): OfferModel.IOffer => ({
  id: 'offer-four',
  name: null,
  points: 1000,
  pointsType: OfferModel.PointsType.EARN,
  programType: OfferModel.ProgramType.STREAK,
  programSubCategory: OfferModel.ProgramSubCategory.GAS,
  pointStartDate: '2021-01-14T06:00:00.000Z',
  pointEndDate: '2022-01-14T06:00:00.000Z',
  dollarRedeemed: 10
});

export const getOffer_5 = (): OfferModel.IOffer => ({
  id: 'offer-five',
  name: null,
  points: 1000,
  pointsType: null,
  programType: null,
  programSubCategory: null,
  pointStartDate: '2021-01-14T06:00:00.000Z',
  pointEndDate: '2022-01-14T06:00:00.000Z',
  dollarRedeemed: 10
});

export const getOffer_6 = (): OfferModel.IOffer => ({
  id: 'offer-six',
  name: null,
  points: 1000,
  pointsType: null,
  programType: OfferModel.ProgramType.CARDLINK,
  programSubCategory: null,
  pointStartDate: '2021-01-14T06:00:00.000Z',
  pointEndDate: '2022-01-14T06:00:00.000Z',
  dollarRedeemed: 10
});

export const getOffer_7 = (): OfferModel.IOffer => ({
  id: 'offer-seven',
  name: null,
  points: 1000,
  pointsType: null,
  programType: OfferModel.ProgramType.SYWMAX,
  programSubCategory: OfferModel.ProgramSubCategory.MISSION,
  rewardOfferCode: 'OFFER_CODE',
  pointStartDate: '2021-01-14T06:00:00.000Z',
  pointEndDate: '2022-01-14T06:00:00.000Z',
  dollarRedeemed: 10
});

export const getOffer_8 = (): OfferModel.IOffer => ({
  id: 'offer-eight',
  name: null,
  points: 1000,
  pointsType: OfferModel.PointsType.REDEEM,
  programType: null,
  programSubCategory: null,
  pointStartDate: '2021-01-14T06:00:00.000Z',
  pointEndDate: '2022-01-14T06:00:00.000Z',
  dollarRedeemed: 10
});

export const getOffer_9 = (): OfferModel.IOffer => ({
  id: 'offer-nine',
  name: null,
  points: 1000,
  pointsType: OfferModel.PointsType.EARN,
  programType: OfferModel.ProgramType.CITI,
  programSubCategory: null,
  pointStartDate: '2021-01-14T06:00:00.000Z',
  pointEndDate: '2022-01-14T06:00:00.000Z',
  dollarRedeemed: 10
});

export const getSurvey_1 = (): OfferModel.IOffer => ({
  id: 'offer-five',
  name: 'Walmart camp Survey',
  points: 3333,
  pointsType: OfferModel.PointsType.EARN,
  programType: OfferModel.ProgramType.SYWMAX,
  programSubCategory: OfferModel.ProgramSubCategory.SURVEY,
  pointStartDate: '2021-05-05T05:00:00.000Z',
  pointEndDate: '2021-05-05T04:59:59.000Z',
  dollarRedeemed: 10
});

export const getActivity_1 = (): ActivityModel.IActivity => ({
  points: 100,
  activityType: ActivityModel.Type.TRANSACTION,
  requestorName: 'requestor one',
  brandDetails: {
    brandLogo: 'https://www.requestor-image.com',
    brandName: '',
    brandShortDescription: ''
  },
  offers: [getOffer_1(), getOffer_2()],
  timestamp: '2020-01-01T12:00:00.000Z',
  activityDetails: {
    partnerId: '123abc',
    giftCardName: 'brand'
  },
  txnId: '11EACDE0F1A4A8D018B2295922CBA5C0'
});

export const getActivity_2 = (): ActivityModel.IActivity => ({
  points: 200,
  activityType: ActivityModel.Type.EXPIRY,
  requestorName: 'requestor two',
  brandDetails: {
    brandLogo: 'https://www.requestor-image-2.com',
    brandName: '',
    brandShortDescription: ''
  },
  offers: [getOffer_3()],
  timestamp: '2020-01-02T12:00:00.000Z',
  activityDetails: {
    partnerId: '456def',
    giftCardName: 'brand'
  },
  txnId: '11EACDE0F1A4A8D018B2295922CBA5C0'
});

export const getActivity_3 = (): ActivityModel.IActivity => ({
  points: 300,
  activityType: ActivityModel.Type.AVAILABLE,
  requestorName: 'requestor three',
  brandDetails: {
    brandLogo: 'https://www.requestor-image-3.com',
    brandName: '',
    brandShortDescription: ''
  },
  offers: [getOffer_1()],
  timestamp: '2020-01-03T12:00:00.000Z',
  activityDetails: {
    partnerId: '789ghi',
    giftCardName: 'brand'
  },
  txnId: '11EACDE0F1A4A8D018B2295922CBA5C0'
});

export const getActivity_4 = (): ActivityModel.IActivity => ({
  points: 300,
  activityType: ActivityModel.Type.RETURN,
  requestorName: 'requestor four',
  brandDetails: {
    brandLogo: 'https://www.requestor-image-4.com',
    brandName: '',
    brandShortDescription: ''
  },
  offers: [],
  timestamp: '2020-01-03T12:00:00.000Z',
  activityDetails: {
    partnerId: '012jkl',
    giftCardName: 'brand',
    giftCardValue: 5.0
  },
  txnId: '11EACDE0F1A4A8D018B2295922CBA5C0'
});

export const getActivity_5 = (): ActivityModel.IActivity => ({
  points: 5000,
  activityType: ActivityModel.Type.TRANSACTION,
  requestorName: '',
  brandDetails: {
    brandLogo: '',
    brandName: '',
    brandShortDescription: ''
  },
  offers: [getOffer_4()],
  timestamp: '2020-06-23T19:24:05.000Z',
  activityDetails: {
    partnerId: '345mno',
    giftCardName: 'brand'
  },
  txnId: '11EACDE0F1A4A8D018B2295922CBA5C0'
});

export const getActivity_6 = (): ActivityModel.IActivity => ({
  points: 3333,
  activityType: ActivityModel.Type.TRANSACTION,
  requestorName: null,
  brandDetails: null,
  timestamp: '2020-06-23T19:24:05.000Z',
  offers: [getSurvey_1()],
  activityDetails: {
    partnerId: '678pqr',
    giftCardName: 'brand'
  },
  txnId: '11EACDE0F1A4A8D018B2295922CBA5C0'
});

export const getActivity_7 = (): ActivityModel.IActivity => ({
  points: 200,
  activityType: ActivityModel.Type.EXPIRY,
  requestorName: 'requestor two',
  brandDetails: {
    brandLogo: 'https://www.requestor-image-2.com',
    brandName: '',
    brandShortDescription: ''
  },
  offers: [getOffer_3()],
  timestamp: '2020-01-02T12:00:00.000Z',
  activityDetails: null,
  txnId: '11EACDE0F1A4A8D018B2295922CBA5C0'
});

export const getMissionCategory_1 = (): MissionModel.ICategory => ({
  name: 'Apparel & Accessories',
  imageUrl: 'https://cdn2.iconfinder.com/data/icons/bright-webshop/512/T-shirt-512.png',
  lifestyleUrl: 'https://i.sears.com/s/i/or/SYW-MAX/Brands_Apparel_&_Accessories-_AGGGFVI9CG',
  rank: 1
});
export const getMissionCategory_2 = (): MissionModel.ICategory => ({
  name: 'Beauty & Wellness',
  imageUrl: 'https://images.vexels.com/media/users/3/142247/isolated/lists/3f0b86857be6d4f07e2c257a045d576e-olla-de-perfume-plana.png',
  lifestyleUrl: 'https://i.sears.com/s/i/or/SYW-MAX/Brands_Beauty-&-Wellness_AGJ84EHXR6',
  rank: 2
});
export const getMissionCategory_3 = (): MissionModel.ICategory => ({
  name: 'Grocery & Delivery',
  imageUrl: 'https://cdn3.iconfinder.com/data/icons/retail-supplies-blue/64/635_shopping-basket-cart-shop-512.png',
  lifestyleUrl: 'https://i.sears.com/s/i/or/SYW-MAX/Brands_Grocery-&-delivery__AGMGAF63O5',
  rank: 4
});

export const getMissionKeyword_1 = (): MissionModel.IKeyword => ({ value: 'Travel', type: MissionModel.KeywordType.CATEGORY });
export const getMissionKeyword_2 = (): MissionModel.IKeyword => ({ value: 'Travelocity', type: MissionModel.KeywordType.BRAND });
export const getMissionKeyword_3 = (): MissionModel.IKeyword => ({ value: 'TrèStiQue', type: MissionModel.KeywordType.BRAND });

export const getAwardCondition_1 = (): MissionModel.IAwardCondition => ({
  category: 'Coffee',
  rewardValue: 0,
  rewardType: MissionModel.RedemptionType.FIXED_POINTS,
  rewardOfferCode: 'code-1',
  programType: OfferModel.ProgramType.SYWMAX,
  programSubType: 'mission',
  alternateRewardValue: 250
});
export const getAwardCondition_2 = (): MissionModel.IAwardCondition => ({
  category: 'T-Shirts',
  rewardValue: 200,
  rewardType: MissionModel.RedemptionType.FIXED_POINTS,
  rewardOfferCode: 'code-2',
  programType: OfferModel.ProgramType.STREAK,
  programSubType: 'AO',
  alternateRewardValue: 400
});

export const getMission_1 = (): MissionModel.IMission => ({
  brandName: 'Starbucks',
  brandLogo: 'https://www.movistar.es/estaticos/img/ico-app-mi-movistar-2017.png',
  brandDescription: 'Great coffee, everywhere.',
  brandCategories: ['Food'],
  brandRequestorId: 'STBU',
  image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTVkMt3KFinkf_ehnCq5yk2DLZBls6GYFZLeA&usqp=CAU',
  name: 'Get some coffee!',
  description: 'Let us treat you with some wonderful coffee beans straight from Colombia.',
  termsAndConditions:
    '<p>Awarded points can only be applied towards Starbucks rewards.</p><p>Offer <strong>not</strong> applicable outside of the US continental territory.</p>',
  pointsAwarded: {
    rewardValue: 200,
    rewardType: MissionModel.RedemptionType.FIXED_POINTS,
    conditions: [getAwardCondition_1(), getAwardCondition_2()]
  },
  callToActionUrl: 'callToActionUrl_1',
  validFrom: '2020-07-29T12:04.000Z',
  validUntil: '2020-08-07T12:04.000Z',
  rank: 1,
  provider: MissionModel.Provider.BUTTON,
  offerId: 'offer-G1YuJWxyAMVV0_XOuMIAf3IQQsqHi2_3sEmBSoKE8dJUxnKPH3WEZ',
  offerCode: 'offer-code-1',
  uuid: 'offer-code-1;offer-G1YuJWxyAMVV0_XOuMIAf3IQQsqHi2_3sEmBSoKE8dJUxnKPH3WEZ',
  pubRef: undefined,
  rewardOfferCode: 'code-1'
});

export const getMission_2 = (): MissionModel.IMission => ({
  brandName: 'Walmart',
  brandLogo: 'https://www.vodafone.es/c/particulares/es/acceso-area-privada/mvf/static/img/modules/backgrounds/New_VF_Icon_RGB_RED.png',
  brandDescription: 'We sell things that you buy.',
  brandCategories: ['Food'],
  brandRequestorId: 'WLMA',
  image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTVkMt3KFinkf_ehnCq5yk2DLZBls6GYFZLeA&usqp=CAU',
  name: 'Get some thing that you want to buy!',
  description: 'In 1945, businessman and former J. C. Penney employee Sam Walton bought a branch of the Ben Franklin stores from the Butler Brothers.',
  termsAndConditions:
    '<p>Awarded points can only be applied towards Walmart rewards.</p><p>Offer <strong>not</strong> applicable outside of the US continental territory.</p>',
  pointsAwarded: {
    rewardValue: 100,
    rewardType: MissionModel.RedemptionType.POINT_PER_DOLLAR,
    conditions: [getAwardCondition_1()]
  },
  callToActionUrl: 'callToActionUrl_2',
  validFrom: '2020-08-29T12:09.000Z',
  validUntil: '2020-09-07T12:06.000Z',
  rank: 1,
  provider: MissionModel.Provider.BUTTON,
  offerId: 'offer-K1YuJWxyAMVV0_XOuMIAf3IQQsqHi2_3sEmBSoKE8dJUxnKPH3WEX',
  offerCode: 'offer-code-2',
  uuid: 'offer-code-2;offer-K1YuJWxyAMVV0_XOuMIAf3IQQsqHi2_3sEmBSoKE8dJUxnKPH3WEX',
  pubRef: undefined,
  rewardOfferCode: 'code-1'
});

export const getMission_3 = (): MissionModel.IMission => ({
  brandName: 'Walmart',
  brandLogo: 'https://i.ibb.co/nMJXNWq/Logos-SYW-MAX.png',
  brandDescription: 'We sell things that you buy.',
  brandCategories: ['Food'],
  brandRequestorId: 'NIKE',
  image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTVkMt3KFinkf_ehnCq5yk2DLZBls6GYFZLeA&usqp=CAU',
  name: 'Get some thing that you want to buy!',
  description: 'In 1945, businessman and former J. C. Penney employee Sam Walton bought a branch of the Ben Franklin stores from the Butler Brothers.',
  termsAndConditions:
    '<p>Awarded points can only be applied towards Walmart rewards.</p><p>Offer <strong>not</strong> applicable outside of the US continental territory.</p>',
  pointsAwarded: {
    rewardValue: 200,
    rewardType: MissionModel.RedemptionType.FIXED_POINTS,
    conditions: [getAwardCondition_1()]
  },
  callToActionUrl: 'callToActionUrl_3',
  validFrom: '2020-08-29T12:09.000Z',
  validUntil: '2020-09-07T12:06.000Z',
  rank: 1,
  provider: MissionModel.Provider.BUTTON,
  offerId: 'offer-XOuMIAf3IQQsqHi2_K1YuJWxyAMVV0_3sEmBSoKE8dJUxnKPH3WEX',
  offerCode: 'offer-code-3',
  uuid: 'offer-code-3;offer-XOuMIAf3IQQsqHi2_K1YuJWxyAMVV0_3sEmBSoKE8dJUxnKPH3WEX',
  pubRef: undefined,
  rewardOfferCode: 'code-1'
});

export const getMission_4 = (): MissionModel.IMission => ({
  brandName: 'Apparel Goods',
  brandLogo: 'https://www.movistar.es/estaticos/img/ico-app-mi-movistar-2017.png',
  brandDescription: 'Great coffee, everywhere.',
  brandCategories: ['Food'],
  brandRequestorId: 'STBU',
  image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTVkMt3KFinkf_ehnCq5yk2DLZBls6GYFZLeA&usqp=CAU',
  name: 'Get some coffee!',
  description: 'Let us treat you with some wonderful coffee beans straight from Colombia.',
  termsAndConditions:
    '<p>Awarded points can only be applied towards Starbucks rewards.</p><p>Offer <strong>not</strong> applicable outside of the US continental territory.</p>',
  pointsAwarded: {
    rewardValue: 200,
    rewardType: MissionModel.RedemptionType.FIXED_POINTS,
    conditions: [getAwardCondition_1(), getAwardCondition_2()]
  },
  callToActionUrl: 'callToActionUrl_1',
  validFrom: '2020-07-29T12:04.000Z',
  validUntil: '2020-08-07T12:04.000Z',
  rank: 1,
  provider: MissionModel.Provider.BUTTON,
  offerId: 'offer-G1YuJWxyAMVV0_XOuMIAf3IQQsqHi2_3sEmBSoKE8dJUxnKPH3WEZ',
  offerCode: 'offer-code-1',
  uuid: 'offer-code-4;offer-G1YuJWxyAMVV0_XOuMIAf3IQQsqHi2_3sEmBSoKE8dJUxnKPH3WEZ',
  pubRef: undefined,
  rewardOfferCode: 'code-1'
});

export const getSlideCategoryIdList = (): string[] => ['Entertainment', 'Sports and Outdoors', 'Travel', 'Automotive'];

export const getRewardConfig_1 = (): RewardModel.IRewardConfig => ({
  categories: [
    {
      id: ENV.CUSTOM_BRAND_CATEGORY_KEY,
      brands: [
        { brandId: getSlideBrand_1().id, brandName: getSlideBrand_1().brandName },
        { brandId: getSlideBrand_2().id, brandName: getSlideBrand_2().brandName }
      ]
    },
    {
      id: 'Entertainment',
      brands: [
        { brandId: getSlideBrand_1().id, brandName: getSlideBrand_1().brandName },
        { brandId: getSlideBrand_2().id, brandName: getSlideBrand_2().brandName }
      ]
    },
    {
      id: 'Sports and Outdoors',
      brands: [
        { brandId: getSlideBrand_1().id, brandName: getSlideBrand_1().brandName },
        { brandId: getSlideBrand_2().id, brandName: getSlideBrand_2().brandName }
      ]
    },
    {
      id: 'Travel',
      brands: [
        { brandId: getSlideBrand_1().id, brandName: getSlideBrand_1().brandName },
        { brandId: getSlideBrand_2().id, brandName: getSlideBrand_2().brandName }
      ]
    },
    {
      id: 'Automotive',
      brands: [
        { brandId: getSlideBrand_1().id, brandName: getSlideBrand_1().brandName },
        { brandId: getSlideBrand_2().id, brandName: getSlideBrand_2().brandName }
      ]
    }
  ],
  limits: {
    maxAmount: 0,
    minAmount: 0,
    duration: '0'
  }
});

export const getRewardConfig_2 = (): RewardModel.IRewardConfig => ({
  categories: [
    {
      id: 'Entertainment',
      brands: [
        { brandId: getSlideBrand_1().id, brandName: getSlideBrand_1().brandName },
        { brandId: getSlideBrand_2().id, brandName: getSlideBrand_2().brandName }
      ]
    }
  ],
  limits: {
    duration: '0',
    maxAmount: 0,
    minAmount: 0
  }
});

export const getRewardConfig_3 = (): RewardModel.IRewardConfig => ({
  categories: [
    {
      id: 'Entertainment',
      brands: [{ brandId: getSlideBrand_4().id, brandName: getSlideBrand_4().brandName }]
    }
  ],
  limits: {
    duration: '0',
    maxAmount: 0,
    minAmount: 0
  }
});

export const getEmptyRewardConfig = (): RewardModel.IRewardConfig => ({
  categories: [],
  limits: {
    duration: '0',
    maxAmount: 0,
    minAmount: 0
  }
});

export const getSlideObject_1 = (): RewardModel.ISlideObject => ({
  type: RewardModel.SlideObjectType.BRAND,
  id: getSlideBrand_1().id,
  attributes: getSlideBrand_1()
});

export const getSlideObject_2 = (): RewardModel.ISlideObject => ({
  type: RewardModel.SlideObjectType.BRAND,
  id: getSlideBrand_2().id,
  attributes: getSlideBrand_2()
});

export const getSlideObject_3 = (): RewardModel.ISlideObject => ({
  type: RewardModel.SlideObjectType.BRAND,
  id: getSlideBrand_4().id,
  attributes: getSlideBrand_4()
});

export const getSlideBrand_1 = (): RewardModel.IBrand => ({
  id: '754338d5-7c5e-4785-bd05-67cd46545df9',
  brandName: 'Burgers For Days',
  iconUrl: 'https://s3.amazonaws.com/raise-content/ibi/GameStop-Logo.png',
  legalTerms: 'This card can be used to purchase merchandise only in stores',
  description: 'Buy stuff, buy lots of it.',
  cardValueConfig: {
    increment: 1,
    maxValue: 50000,
    minValue: 500,
    variableLoadSupported: true
  },
  redemptionConfigs: {
    disclaimer: 'Can only use 2 cards',
    kind: 'IN_STORE_OR_ONLINE_ONLY',
    methods: [
      {
        kind: 'ENTER_ONLINE',
        info: 'Enter the gift card info online'
      },
      {
        kind: 'SHOW_BARCODE',
        info: 'Show the barcode to the cashier'
      }
    ]
  },
  sortedPosition: 2,
  categories: [
    {
      name: 'Entertainment'
    },
    {
      name: 'Travel'
    },
    {
      name: 'Automotive'
    }
  ]
});

export const getSlideBrand_2 = (): RewardModel.IBrand => ({
  id: '67cd46545df9-754338d5-7c5e-4785-bd05',
  brandName: 'Durum For Weeks',
  iconUrl: 'https://s3.amazonaws.com/raise-content/ibi/GameStop-Logo.png',
  legalTerms: 'This card can be used to purchase merchandise only in stores',
  description: 'Buy stuff, buy lots of it.',
  cardValueConfig: {
    increment: 1,
    maxValue: 50000,
    minValue: 500,
    variableLoadSupported: true
  },
  redemptionConfigs: {
    disclaimer: 'Can only use 2 cards',
    kind: 'IN_STORE_OR_ONLINE_ONLY',
    methods: [
      {
        kind: 'ENTER_ONLINE',
        info: 'Enter the gift card info online'
      },
      {
        kind: 'SHOW_BARCODE',
        info: 'Show the barcode to the cashier'
      }
    ]
  },
  sortedPosition: 2,
  categories: [
    {
      name: 'Entertainment'
    }
  ]
});

export const getSlideBrand_3 = (): RewardModel.IBrand => ({
  id: '67cd46545df9-7c5e-4785-bd05-754338d5',
  brandName: 'Durum For Years',
  iconUrl: 'https://s3.amazonaws.com/raise-content/ibi/GameStop-Logo.png',
  legalTerms: 'This card can be used to purchase merchandise only in stores',
  description: 'Buy stuff, buy lots of it.',
  cardValueConfig: {
    increment: 1,
    maxValue: 50000,
    minValue: 500,
    variableLoadSupported: true
  },
  redemptionConfigs: {
    disclaimer: 'Can only use 2 cards',
    kind: 'IN_STORE_OR_ONLINE_ONLY',
    methods: [
      {
        kind: 'ENTER_ONLINE',
        info: 'Enter the gift card info online'
      },
      {
        kind: 'SHOW_BARCODE',
        info: 'Show the barcode to the cashier'
      }
    ]
  },
  sortedPosition: 2,
  categories: [
    {
      name: 'Entertainment'
    }
  ]
});

export const getSlideBrand_4 = (): RewardModel.IBrand => ({
  id: '67cd46545df9-7c5e-4785-bd05-754338d9',
  brandName: 'Durum For Years',
  iconUrl: 'https://s3.amazonaws.com/raise-content/ibi/GameStop-Logo.png',
  legalTerms: 'This card can be used to purchase merchandise only in stores',
  description: 'Buy stuff, buy lots of it.',
  cardValueConfig: {
    increment: 1,
    maxValue: 50000,
    minValue: 500,
    variableLoadSupported: true
  },
  redemptionConfigs: {
    disclaimer: 'Can only use 2 cards',
    kind: 'IN_STORE_OR_ONLINE_ONLY',
    methods: [
      {
        kind: 'ENTER_ONLINE',
        info: 'Enter the gift card info online'
      },
      {
        kind: 'SHOW_BARCODE',
        info: 'Show the barcode to the cashier'
      }
    ]
  },
  sortedPosition: 2,
  categories: [
    {
      name: 'Entertainment'
    }
  ],
  faceplateUrl: 'https://s3.amazonaws.com/raise-content/ibi/GameStop-Logo.png'
});

export const getStreak_1 = (): StreakModel.IStreak => ({
  offerId: 'offer-G1YuJWxyAMVV0_XOuMIAf3IQQsqHi2_3sEmBSoKE8dJUxnKPH3WEZ',
  offerCode: 'offer-code-1',
  startDt: '2021-03-17T13:40:00.000Z',
  endDt: '2021-04-17T13:40:00.000Z',
  title: 'Grocery & Delivery Streak',
  rewardValue: 3000,
  rewardType: RedemptionType.FIXED_POINTS,
  imageUrl: "https://i.sears.com/s/i/or/SYW-MAX/Brands_Sam's-club-Logos-SYW-MAX_H5YHQFPMCT",
  thresholdValue: 3,
  thresholdType: null,
  currentQualifiedValue: 1,
  minimumSpendPerTransaction: 25,
  disclaimer: 'This streak requires use you to use a credit card for all purchases...',
  description: 'This is a streak with a description :D',
  rank: 1,
  rewardOfferCode: 'code-1',
  type: OfferType.SINGLE,
  conditions: [
    {
      title: 'Grocery & Delivery Streak',
      imageUrl: "https://i.sears.com/s/i/or/SYW-MAX/Brands_Sam's-club-Logos-SYW-MAX_H5YHQFPMCT",
      thresholdValue: 3,
      thresholdType: null,
      currentQualifiedValue: 1,
      minimumSpendPerTransaction: 25,
      disclaimer: 'This streak requires use you to use a credit card for all purchases...'
    }
  ]
});

export const getQuestion_1 = (): PromptModel.IQuestion => ({
  promptGroupName: PromptModel.QuestionGroupName.SURVEY_PROFILE,
  attributeID: 'A9CD00163E00113C11E41661AD846011',
  questionPackageID: 'A9CD00163E00113C11E41661AD542850',
  questionRuleID: 'A9CD00163E00113C11E41661AD542850',
  questionTextID: 'A9CD00163E00113C11E41661ADA29670',
  questionTitle: 'Gender',
  questionLine1: 'What gender do you primarily identify with?',
  questionLine2: '',
  questionLine3: '',
  questionLine4: 'Text=^[a-z]+$',
  questionLine5: '',
  answerTemplate: PromptModel.AnswerTemplate.SELECT,
  answerChoices: {
    answerOption: [
      { answerTxt: 'Male', answerChoiceID: 'A9CD00163E00113C11E41661ADAA1080' },
      { answerTxt: 'Female', answerChoiceID: 'A9CD00163E00113C11E41661ADAD44D0' }
    ]
  }
});

export const getQuestion_2 = (): PromptModel.IQuestion => ({
  promptGroupName: PromptModel.QuestionGroupName.SURVEY_PROFILE,
  attributeID: 'B9CD00163E00113C11E41661AD846011',
  questionPackageID: 'B9CD00163E00113C11E41661AD542850',
  questionRuleID: 'B9CD00163E00113C11E41661AD542850',
  questionTextID: 'B9CD00163E00113C11E41661ADA29670',
  questionTitle: 'Zip code',
  questionLine1: 'What is your current zip code to use for surveys?',
  questionLine2: '',
  questionLine3: '',
  questionLine4: 'Text=^[a-z]+$',
  questionLine5: '',
  answerTemplate: PromptModel.AnswerTemplate.TEXT,
  answerChoices: { answerOption: [{ answerTxt: null, answerChoiceID: 'AFF70242AC11000211EBB756752CE8C0' }] }
});

export const getQuestion_3 = (): PromptModel.IQuestion => ({
  promptGroupName: PromptModel.QuestionGroupName.SURVEY_PROFILE,
  attributeID: 'C9CD00163E00113C11E41661AD846011',
  questionPackageID: 'C9CD00163E00113C11E41661AD542850',
  questionRuleID: 'C9CD00163E00113C11E41661AD542850',
  questionTextID: 'C9CD00163E00113C11E41661ADA29670',
  questionTitle: 'Date of Birth',
  questionLine1: 'When were you born?',
  questionLine2: '',
  questionLine3: '',
  questionLine4: 'Text=^[a-z]+$',
  questionLine5: 'MM-DD-YYYY',
  answerTemplate: PromptModel.AnswerTemplate.TEXT,
  answerChoices: { answerOption: [{ answerTxt: null, answerChoiceID: 'AFF70242AC11000211EBB756752CE8C0' }] }
});

export const getAnswer_1 = (): PromptModel.IAnswer => ({
  attributeID: 'A9CD00163E00113C11E41661AD846011',
  questionPackageID: 'A9CD00163E00113C11E41661AD542850',
  questionRuleID: 'A9CD00163E00113C11E41661AD542850',
  questionTextID: 'A9CD00163E00113C11E41661ADA29670',
  questionTitle: 'Gender',
  questionLine1: 'What gender do you primarily identify with?',
  questionLine2: '',
  questionLine3: '',
  questionLine4: '',
  questionLine5: '',
  answerTemplate: PromptModel.AnswerTemplate.SELECT,
  answerChoices: null,
  selectedAnswers: [{ id: 'A9CD00163E00113C11E41661ADAA1080', text: 'Male' }]
});

export const getAnswer_2 = (): PromptModel.IAnswer => ({
  attributeID: 'A9CD00163E00113C11E41661AD846011',
  questionPackageID: 'A9CD00163E00113C11E41661AD542850',
  questionRuleID: 'A9CD00163E00113C11E41661AD542850',
  questionTextID: 'A9CD00163E00113C11E41661ADA29670',
  questionTitle: 'Zip code',
  questionLine1: 'What is your current zip code to use for surveys?',
  questionLine2: '',
  questionLine3: '',
  questionLine4: '',
  questionLine5: '',
  answerTemplate: PromptModel.AnswerTemplate.TEXT,
  answerChoices: null,
  selectedAnswers: [{ id: 'AFF70242AC11000211EBB756752CE8C0', text: '78745' }]
});

export const getAnswer_3 = (): PromptModel.IAnswer => ({
  attributeID: 'A9CD00163E00113C11E41661AD846011',
  questionPackageID: 'A9CD00163E00113C11E41661AD542850',
  questionRuleID: 'A9CD00163E00113C11E41661AD542850',
  questionTextID: 'A9CD00163E00113C11E41661ADA29670',
  questionTitle: 'Date of Birth',
  questionLine1: 'When were you born?',
  questionLine2: '',
  questionLine3: '',
  questionLine4: '',
  questionLine5: '',
  answerTemplate: PromptModel.AnswerTemplate.TEXT,
  answerChoices: null,
  selectedAnswers: [{ id: 'AFF70242AC11000211EBB756752CE8C0', text: '1983-07-15' }]
});

export const getSailthruMessage_1 = (): ISailthruMessage => ({
  id: '609af324927ab10001ee01e1',
  share: false,
  title: 'Message Test',
  type: 'image_message',
  htmlText: '<p>This is a test message.</p>\n',
  isRead: false,
  custom: {},
  createdAt: '2021-05-11T18:12:06Z',
  text: 'This is a test message.'
});

export const getNewOnMaxMessage_1 = (): ISailthruMessage => ({
  id: '609af324927ab10001ee01e7',
  share: false,
  title: 'Level Up!',
  type: 'image_message',
  htmlText: '<p>As you earn points with your purchases you’ll  level up and earn even more points.</p>\n',
  isRead: false,
  custom: {
    ctaRoute: 'streaks',
    category: 'NEW_ON_MAX',
    minAppVersion: '0.0.0',
    ctaText: 'Let’s go!'
  },
  createdAt: '2021-05-11T18:09:43Z',
  text: 'As you earn points with your purchases you’ll  level up and earn even more points.',
  cardImageUrl: 'https://d3w44czcvy0k0e.cloudfront.net/messages/multimedia_messages/609aea3bc83b1a00011704d0_assets_card.png?1620767375'
});

export const getNewOnMaxMessage_2 = (): ISailthruMessage => ({
  id: '609aea3bc83b1a00011704d0',
  share: false,
  title: 'Level Up!',
  type: 'image_message',
  htmlText: '<p>As you earn points with your purchases you’ll  level up and earn even more points.</p>\n',
  isRead: false,
  custom: {
    ctaRoute: 'profile > balance',
    category: 'NEW_ON_MAX',
    minAppVersion: '0.0.0',
    ctaText: 'Let’s go!'
  },
  createdAt: '2021-05-11T18:09:43Z',
  text: 'As you earn points with your purchases you’ll  level up and earn even more points.',
  cardImageUrl: 'https://d3w44czcvy0k0e.cloudfront.net/messages/multimedia_messages/609aea3bc83b1a00011704d0_assets_card.png?1620767375'
});

export const getNewOnMaxMessage_3 = (): ISailthruMessage => ({
  id: '609aea3bc83b1a00011704d1',
  share: false,
  title: 'Level Up!',
  type: 'image_message',
  htmlText: '<p>As you earn points with your purchases you’ll  level up and earn even more points.</p>\n',
  isRead: false,
  custom: {
    ctaRoute: 'profile > balance',
    category: 'NEW_ON_MAX',
    minAppVersion: '0.0.0',
    maxAppVersion: '2.0.0',
    ctaText: 'Let’s go!'
  },
  createdAt: '2021-05-11T19:20:43Z',
  text: 'As you earn points with your purchases you’ll  level up and earn even more points.',
  cardImageUrl: 'https://d3w44czcvy0k0e.cloudfront.net/messages/multimedia_messages/609aea3bc83b1a00011704d0_assets_card.png?1620767375'
});

export const getNewOnMaxMessage_4 = (): ISailthruMessage => ({
  id: '609aea3bc83b1a00011704d2',
  share: false,
  title: 'Survey are here',
  type: 'image_message',
  htmlText: '<p>This is a test message.</p>\n',
  isRead: false,
  custom: {
    ctaRoute: 'survey pq',
    category: 'NEW_ON_MAX',
    minAppVersion: '0.0.0',
    maxAppVersion: '2.0.0',
    ctaText: 'Let’s go!'
  },
  createdAt: '2021-05-11T19:20:43Z',
  text: 'This is a test message.',
  cardImageUrl: 'https://d3w44czcvy0k0e.cloudfront.net/messages/multimedia_messages/609aea3bc83b1a00011704d0_assets_card.png?1620767375'
});

const monthDay = new Date();
export const getLocalOffersBenefits = (): ICardLinkOfferCalendarBenefits[] => [{ available: true, monthDay }];

export const getLocalOffers_1 = (): ICardLinkOffers => ({
  userId: '1234',
  offers: [
    {
      activeUntil: '2021-12-11T19:20:43Z',
      benefits: getLocalOffersBenefits(),
      brandImage: 'http://www.local-offer.com/image/1',
      brandName: 'local-offer-brand-1',
      brandLogo: 'http://www.local-offer.com/logo/1',
      calendar: [
        {
          dayOfWeek: DayOfWeek.MONDAY,
          dayHours: {
            open: '08:00AM',
            close: '05:59PM',
            openForBusiness: true
          }
        }
      ],
      callToActionUrl: 'http://www.local-offer.com/call-to-action/1',
      description: 'local-offer-1-description',
      disclaimer: 'local-offer-1-disclaimer',
      menu: {
        externalUrl: 'http://www.local-offer.com/menu'
      },
      merchant: {
        address: {
          latitude: 40.64514,
          longitude: -73.95539,
          street: '2307 Beverley Rd, Brooklyn, NY 11226, United States'
        },
        priceRange: '0',
        merchantDistance: 1,
        websiteUrl: 'http://www.local-offer.com/website'
      },
      offerId: '12345',
      pointsAwarded: {
        rewardType: RedemptionType.FIXED_POINTS,
        rewardValue: 10000
      },
      programType: ProgramType.SYWMAX,
      programSubType: ProgramSubType.MC,
      provider: Providers.MASTERCARD,
      rating: {
        overallRating: 3
      },
      status: InStoreOfferStatus.ACTIVE,
      validFrom: '2000-09-01T05:00:00Z',
      validUntil: '2221-09-01T05:00:00Z'
    }
  ]
});

export const getLocalOffers_2 = (): ICardLinkOffers => ({
  userId: '1234',
  offers: [
    {
      activeUntil: '2021-08-11T19:20:43Z',
      benefits: getLocalOffersBenefits(),
      brandImage: 'http://www.local-offer.com/image/1',
      brandName: 'local-offer-brand-1',
      brandLogo: 'http://www.local-offer.com/logo/1',
      calendar: [
        {
          dayOfWeek: DayOfWeek.MONDAY,
          dayHours: {
            open: '08:00AM',
            close: '05:59PM',
            openForBusiness: true
          }
        }
      ],
      callToActionUrl: 'http://www.local-offer.com/call-to-action/1',
      description: 'local-offer-1-description',
      disclaimer: 'local-offer-1-disclaimer',
      menu: {
        externalUrl: 'http://www.local-offer.com/menu'
      },
      merchant: {
        address: {
          latitude: 40.64514,
          longitude: -73.95539,
          street: '2307 Beverley Rd, Brooklyn, NY 11226, United States'
        },
        priceRange: '0',
        merchantDistance: 1,
        websiteUrl: 'http://www.local-offer.com/website'
      },
      offerId: '12345',
      pointsAwarded: {
        rewardType: RedemptionType.FIXED_POINTS,
        rewardValue: 10000
      },
      programType: ProgramType.SYWMAX,
      programSubType: ProgramSubType.MC,
      provider: Providers.MASTERCARD,
      rating: {
        overallRating: 3
      },
      status: InStoreOfferStatus.INACTIVE,
      validFrom: '2021-01-11T19:20:43Z',
      validUntil: '2100-12-11T19:20:43Z'
    },
    {
      activeUntil: '2100-12-11T19:20:43Z',
      benefits: getLocalOffersBenefits(),
      brandImage: 'http://www.local-offer.com/image/1',
      brandName: 'local-offer-brand-1',
      brandLogo: 'http://www.local-offer.com/logo/1',
      calendar: [
        {
          dayOfWeek: DayOfWeek.MONDAY,
          dayHours: {
            open: '08:00AM',
            close: '05:59PM',
            openForBusiness: true
          }
        }
      ],
      callToActionUrl: 'http://www.local-offer.com/call-to-action/1',
      description: 'local-offer-1-description',
      disclaimer: 'local-offer-1-disclaimer',
      menu: {
        externalUrl: 'http://www.local-offer.com/menu'
      },
      merchant: {
        address: {
          latitude: 40.64514,
          longitude: -73.95539,
          street: '2307 Beverley Rd, Brooklyn, NY 11226, United States'
        },
        priceRange: '0',
        merchantDistance: 1,
        websiteUrl: 'http://www.local-offer.com/website'
      },
      offerId: '6789',
      pointsAwarded: {
        rewardType: RedemptionType.FIXED_POINTS,
        rewardValue: 10000
      },
      programType: ProgramType.SYWMAX,
      programSubType: ProgramSubType.MC,
      provider: Providers.MASTERCARD,
      rating: {
        overallRating: 3
      },
      status: InStoreOfferStatus.ACTIVE,
      validFrom: '2021-01-11T19:20:43Z',
      validUntil: '2021-12-11T19:20:43Z'
    }
  ]
});

export const getLinkedCards_1 = (): ILinkedCard => ({
  cardId: 'abc123',
  cardLastFour: '0284',
  cardType: 'VISA',
  partnerType: LinkedCardPartnerType.MASTERCARD,
  tuId: 'abc123',
  isSywCard: false
});

export const getLinkedCards_2 = (): ILinkedCard => ({
  cardId: 'abc124',
  cardLastFour: '1123',
  cardType: 'MSTR',
  partnerType: LinkedCardPartnerType.MASTERCARD,
  isSywCard: true
});

export const getLinkedCards_3 = (): ILinkedCard => ({
  cardId: 'abc125',
  cardLastFour: '4567',
  cardType: 'DISC',
  partnerType: LinkedCardPartnerType.MASTERCARD,
  isSywCard: true
});

export const getLinkedCards_4 = (): ILinkedCard => ({
  cardId: 'abc126',
  cardLastFour: '8910',
  cardType: 'AMEX',
  partnerType: LinkedCardPartnerType.MASTERCARD,
  isSywCard: true
});

export function getMerchant(overrides: Partial<ICardLinkOfferMerchant> = {}): ICardLinkOfferMerchant {
  const merchant = {
    address: {
      latitude: -1.100809,
      longitude: 56.108808,
      street: '2100 Apple Avenue'
    },
    priceRange: '10',
    merchantDistance: 0.2,
    websiteUrl: 'https://merchanturl.com'
  };

  return {
    ...merchant,
    ...overrides
  };
}

export function getCardLinkOffer_1(overrides: Partial<ICardLinkOffer> = {}): ICardLinkOffer {
  const offer = {
    activeUntil: '2021-08-08T00:00:00Z',
    benefits: getLocalOffersBenefits(),
    brandImage: 'https://cdn.computerhoy.com/sites/navi.axelspringer.es/public/media/image/2020/02/coca-cola-portada-1877741.jpg',
    brandName: 'Coca-Cola',
    brandLogo: 'https://tentulogo.com/wp-content/uploads/2017/06/cocacola-logo.jpg',
    calendar: [],
    callToActionUrl: 'https://randomurl.com',
    description: 'Am I supposed to be a description?',
    disclaimer: 'No disclaimer. Everything is cool.',
    menu: {
      externalUrl: 'https://anotherrandomurl.com'
    },
    merchant: getMerchant(),
    offerId: '0090-1241g-11hjg-zzz18',
    pointsAwarded: {
      rewardValue: 4,
      rewardType: RedemptionType.FIXED_POINTS
    },
    programType: ProgramType.SYWMAX,
    programSubType: ProgramSubType.MC,
    provider: Providers.MASTERCARD,
    rating: {
      overallRating: 3
    },
    status: InStoreOfferStatus.INACTIVE,
    validFrom: '2000-09-01T05:00:00Z',
    validUntil: '2221-09-01T05:00:00Z'
  };

  return {
    ...offer,
    ...overrides
  };
}

export const getLocalOffers_3 = (): ICardLinkOffers => ({
  userId: '1234',
  offers: [
    getCardLinkOffer_1(),
    getCardLinkOffer_1({ offerId: 'test1' }),
    getCardLinkOffer_1({ offerId: 'test12' }),
    getCardLinkOffer_1({ offerId: 'test123' }),
    getCardLinkOffer_1({ offerId: 'test1234' }),
    getCardLinkOffer_1({ offerId: 'test12345' })
  ]
});

export const getLocalOffers_4 = (): ICardLinkOffers => ({
  userId: '1234',
  offers: [
    getCardLinkOffer_1(),
    getCardLinkOffer_1({ offerId: 'test1' }),
    getCardLinkOffer_1({ offerId: 'test12' }),
    getCardLinkOffer_1({ offerId: 'test12' }),
    getCardLinkOffer_1({ offerId: 'test1234' }),
    getCardLinkOffer_1({ offerId: 'test1234' })
  ]
});

export const getGeocodeAddress = (): IGeocodeAddress => ({
  formatted_address: 'Sunset Valley, Austin, TX 78745-6089, USA',
  geometry: {
    location: {
      lat: 37.4224764,
      lng: -122.0842499
    }
  },
  types: ['postal_code', 'political'],
  address_components: [
    {
      long_name: '600',
      short_name: '600',
      types: ['subpremise']
    },
    {
      long_name: '450',
      short_name: '450',
      types: ['street_number']
    },
    {
      long_name: 'North Roxbury Drive',
      short_name: 'N Roxbury Dr',
      types: ['route']
    },
    {
      long_name: 'Beverly Hills',
      short_name: 'Beverly Hills',
      types: ['locality', 'political']
    },
    {
      long_name: 'Los Angeles County',
      short_name: 'Los Angeles County',
      types: ['administrative_area_level_2', 'political']
    },
    {
      long_name: 'California',
      short_name: 'CA',
      types: ['administrative_area_level_1', 'political']
    },
    {
      long_name: 'United States',
      short_name: 'US',
      types: ['country', 'political']
    },
    {
      long_name: '90210',
      short_name: '90210',
      types: ['postal_code']
    }
  ]
});

export const getGeocodeAddressWithoutPostalAndCountry = (): IGeocodeAddress => ({
  formatted_address: 'Sunset Valley, Austin, TX 78745-6089, USA',
  geometry: {
    location: {
      lat: 37.4224764,
      lng: -122.0842499
    }
  },
  types: ['postal_code', 'political'],
  address_components: [
    {
      long_name: '600',
      short_name: '600',
      types: ['subpremise']
    },
    {
      long_name: '450',
      short_name: '450',
      types: ['street_number']
    },
    {
      long_name: 'North Roxbury Drive',
      short_name: 'N Roxbury Dr',
      types: ['route']
    },
    {
      long_name: 'Los Angeles County',
      short_name: 'Los Angeles County',
      types: ['administrative_area_level_2', 'political']
    }
  ]
});

export const getGeocodePlace = (): IGeocodePlace => ({
  predictions: [
    {
      place_id: 'place-id',
      structured_formatting: {
        main_text: 'Chicago',
        main_text_matched_substrings: [
          {
            offset: 0,
            length: 7
          }
        ],
        secondary_text: 'IL, USA'
      },
      types: ['locality', 'political', 'geocode']
    }
  ]
});

export const getGeocodePlaceDetails = (): IGeocodePlaceDetails => ({
  formatted_address: 'Bogota, TN, USA',
  geometry: {
    location: {
      lat: 36.1638616,
      lng: -89.4383256
    }
  },
  place_id: 'place-id',
  name: 'Bogota'
});

export const getStorageRecentSearch_1 = (): ILocationStorage => ({
  type: LocationType.ADDRESS,
  value: 'place-id',
  searchItem: {
    place_id: 'place-id',
    structured_formatting: {
      main_text: 'Chicago',
      main_text_matched_substrings: [
        {
          offset: 0,
          length: 7
        }
      ],
      secondary_text: 'IL, USA'
    },
    types: ['locality', 'political', 'geocode'],
    place_details: {
      formatted_address: 'Chicago, IL, USA',
      geometry: {
        location: {
          lat: 41.8781136,
          lng: -87.6297982
        }
      },
      place_id: 'place-id',
      name: 'Chicago'
    }
  },
  timestamp: 1
});

export const getStorageRecentSearch_2 = (): ILocationStorage => ({
  type: LocationType.OFFER,
  value: 'Palm House',
  searchItem: 'Palm House',
  timestamp: 1
});

export const getGiftCard = (): IGiftCard => ({
  cardBrand: "Chico's",
  cardNumber: 'C4KU HF4L DS4',
  cardValue: 10,
  barcodeType: 'code128',
  barcodeValue: 'ASD123',
  pinNumber: '2082',
  cardProvider: 'RAISE',
  providerCardId: '93ed4685-fa5e-465e-a2ba-217a3903f28d',
  providerBrandId: '02474e64-ee5f-49c1-a323-2267dea4fc6b',
  statusInd: statusType.ACTIVE,
  purchaseTs: '2022-03-02T15:52:28.000Z',
  cardBalance: 10,
  cardBalanceCheckDt: null,
  cardBalanceCheckAvailableCount: null,
  brandDetails: {
    brandId: '423bb8cf-db3b-40fb-bfac-3fe2daab5182',
    brandName: 'Forever 21',
    brandLogo: 'https://raise-content.s3.amazonaws.com/MP-OPs/forever-21-icon.png',
    legalTerms:
      'Gift cards may only be used for purchases at Forever 21 stores in the U.S. or at forever21.com. Purchase amounts will be deducted from the card balance until it is $0.00. Gift cards are not reloadable, may not be returned, used to pay down a credit card balance, or used to buy gift cards or e-gift cards. Gift cards may not be exchanged for cash (unless required by law). Protect your gift card like cash because neither the issuer nor Forever 21 is responsible for lost or stolen gift cards or use without your permission. If lost or stolen, gift card can only be replaced with the original proof of purchase for the remaining balance in our records. Resale is strictly prohibited. Gift card funds are not transferable. Gift card has no expiration date. Void where prohibited or restricted by law. Gift card terms and conditions are subject to change without notice and some items may not be available for purchase. Please visit https://www.forever21.com/us/giftcard.html for current terms, conditions, and limitations. Use of a gift card is governed by the laws of California. To check the available balance on a gift card, visit your local store, call 1-888-494-3837 or visit https://www.forever21.com/us/giftcard.html.',
    brandShortDescription:
      'Forever 21 is the authority on fashion & the go-to retailer for the latest trends, must-have styles & the hottest deals. Shop dresses, tops, tees, leggings & more.',
    cardValueConfig: {
      increment: 1,
      maxValue: 20000,
      minValue: 500,
      variableLoadSupported: true
    },
    redemptionConfiguration: {
      kind: 'IN_STORE_OR_ONLINE_ONLY',
      methods: [{ kind: 'SHOW_BARCODE' }, { kind: 'ENTER_ONLINE' }]
    },
    categories: [{ name: 'APPAREL' }],
    faceplateUrl: 'https://raise-content.s3.amazonaws.com/MP-OPs/00_I%26I+Faceplate+Imagery/GC_Forever21_print.jpg',
    backOfCardUrl: 'https://api.getslide.com/static/brands/back_of_card_423bb8cf-db3b-40fb-bfac-3fe2daab5182-00000000-0000-0000-0000-000000000000.html'
  }
});

export const getGiftCardDetail = (): IGiftCardDetail => ({
  brandName: 'brandName',
  brandLogo: 'https://s3.amazonaws.com',
  cardValue: 15.5,
  cardBalance: 10,
  cardNumber: '123456789',
  cardPin: '0395',
  orderDate: '2021-10-01T01:02:03.123Z',
  barcode: {
    kind: barcodeType.CODE128,
    value: '63E4WLS'
  },
  brand_uuid: 'bf390e02-d728-406a-b6c8-ea10d1f7dce3',
  legal_terms: 'Lorem Ipsum is simply dummy text',
  description: 'Lorem Ipsum is simply dummy text of the printing and typesetting',
  redemption_configs: {
    kind: redemptionType.IN_STORE_OR_ONLINE_ONLY,
    methods: [
      {
        kind: methodType.SHOW_BARCODE
      },
      {
        kind: methodType.ENTER_ONLINE
      }
    ]
  },
  balance_checks_available: 3,
  balance_check_supported: true,
  balance_check_url: 'https://google.com'
});

export const getGiftCardBalance = (): IGiftCardBalance => ({
  id: 'abc123',
  cardValue: 15
});

export const getStorageRecentSearchHistory = (): IRecentSearchHistory => ({
  id: 'abc123',
  name: 'abc123',
  type: RecentSearchHistoryType.MISSION
});

export const getStorageRecentSearchHistory_2 = (): IRecentSearchHistory => ({
  id: 'abc456',
  name: 'abc456',
  type: RecentSearchHistoryType.CATEGORY
});
