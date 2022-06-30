import { DateLike } from './general';
import { RedemptionType } from './mission';

export enum DayOfWeek {
  SUNDAY = 'Sun',
  MONDAY = 'Mon',
  TUESDAY = 'Tue',
  WEDNESDAY = 'Wed',
  THURSDAY = 'Thu',
  FRIDAY = 'Fri',
  SATURDAY = 'Sat'
}

export interface ICardLinkOfferCalendarDayHours {
  open: DateLike;
  close: DateLike;
  openForBusiness: boolean;
}

export interface ICardLinkOfferCalendarBenefits {
  available: boolean;
  monthDay: Date;
}

export interface ICardLinkOfferCalendar {
  dayOfWeek: DayOfWeek;
  dayHours: ICardLinkOfferCalendarDayHours;
}

export interface ICardLinkOfferMerchant {
  address: {
    latitude: number;
    longitude: number;
    street: string;
  };
  priceRange: string;
  merchantDistance: number;
  websiteUrl: string;
}

export interface ICardLinkOfferPointsAwarded {
  rewardValue: number;
  rewardType: RedemptionType;
}

export enum ProgramType {
  SYWMAX = 'SYWMAX'
}

export enum ProgramSubType {
  MC = 'MC'
}

export enum Providers {
  MASTERCARD = 'mastercard'
}

export enum InStoreOfferStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export interface ICardLinkOffer {
  activeUntil: DateLike;
  benefits: ICardLinkOfferCalendarBenefits[];
  brandImage: string;
  brandName: string;
  brandLogo: string;
  calendar: ICardLinkOfferCalendar[];
  /** @deprecated For local offers, use merchant.websiteUrl instead. */
  callToActionUrl: string;
  description: string;
  disclaimer: string;
  menu: {
    externalUrl: string;
  };
  merchant: ICardLinkOfferMerchant;
  offerId: string;
  pointsAwarded: ICardLinkOfferPointsAwarded;
  programType: ProgramType;
  programSubType: ProgramSubType;
  provider: Providers;
  rating: {
    overallRating: number;
  };
  status: InStoreOfferStatus;
  validFrom: DateLike;
  validUntil: DateLike;
}

export interface ICardLinkOffers {
  userId: string;
  offers: ICardLinkOffer[];
}

export interface ILinkedCard {
  cardId: string;
  cardLastFour: string;
  cardType: string;
  partnerType: LinkedCardPartnerType;
  tuId?: string;
  isSywCard: boolean;
}

export enum LinkedCardPartnerType {
  MASTERCARD = 'MSTR',
  REWARDS_NETWORK = 'RWNW'
}

export enum EnrollmentEventType {
  ENROLL = 'ENROLL',
  UNENROLL = 'UNENROLL'
}

export enum cardName {
  VISA = 'Visa',
  MSTR = 'MasterCard',
  DISC = 'Discovery',
  AMEX = 'American Express'
}

export const PRICE_RANGE_MAX_VALUE = 5;

export interface IGeocodeAddress {
  formatted_address: string;
  geometry: IGeometry;
  types: string[];
  address_components: IAddressComponent[];
  parsedAddress?: IParsedAddress;
}

export interface IParsedAddress {
  postalCode?: IAddressComponent;
  city?: IAddressComponent;
  state?: IAddressComponent;
  country?: IAddressComponent;
}
export interface IGeometry {
  location: IGeocodeLocation;
}

export interface IGeocodeLocation {
  lat: number;
  lng: number;
}

export interface ILocation {
  latitude: number;
  longitude: number;
}

export interface IAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export enum LocationType {
  ADDRESS = 'Address',
  OFFER = 'Offer'
}
export interface ILocationStorage {
  type: LocationType;
  value: string;
  searchItem: IGeocodePlacePrediction | string;
  timestamp: number;
}
export interface IGeocodePlace {
  predictions: IGeocodePlacePrediction[];
}

export interface IGeocodePlacePrediction {
  place_id: string;
  structured_formatting: IGeocodePlaceStructuredFormatting;
  types: string[];
  place_details?: IGeocodePlaceDetails;
}

export interface IGeocodePlaceStructuredFormatting {
  main_text: string;
  secondary_text: string;
  main_text_matched_substrings: IGeocodePlaceStructuredFormattingMatchedSubstrings[];
}

export interface IGeocodePlaceStructuredFormattingMatchedSubstrings {
  offset: number;
  length: number;
}

export interface IGeocodePlaceDetails {
  formatted_address: string;
  geometry: IGeometry;
  place_id: string;
  name: string;
}
