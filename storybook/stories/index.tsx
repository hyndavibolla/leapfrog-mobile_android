import React from 'react';
import { ScrollView } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { withKnobs } from '@storybook/addon-ondevice-knobs';

import { styles } from '../styles';

import { TitleOverviewStory } from './TitleStories';
import * as buttonStories from './ButtonStories';
import * as iconStories from './IconStories';
import * as tooltipButtonStories from './TooltipButtonStories';
import * as navigationButtonStories from './NavigationButtonStories';
import { ErrorBoundaryStory } from './ErrorBoundaryStories';
import * as pillStories from './PillStories';
import * as toastStories from './ToastStories';
import * as pointBalanceSummaryStories from './PointBalanceSummaryStories';
import * as accordionStories from './AccordionStories';
import * as cardStories from './CardStories';
import * as dividerStories from './DividerStories';
import * as rewardCardStories from './RewardCardStories';
import * as spinnerStories from './SpinnerStories';
import * as modalStories from './ModalStories';
import * as levelBenefitsStories from './LevelBenefitStories';
import * as cardBenefitsStories from './CardBenefitStories';
import * as ProgressRingStories from './ProgressRingStories';
import * as activityDetailStoryStories from './ActivityDetailStories';
import * as SwitchNavBarStories from './SwitchNavBarStories';
import * as LargeMissionCardStories from './LargeMissionCardStories';
import * as PetiteStories from './PetiteMissionCardStories';
import * as MissionSearchInputStories from './SearchInputStories';
import * as MediumMissionCardStories from './MediumMissionCardStories';
import * as SmallMissionCardStories from './SmallMissionCardStories';
import * as SmallGiftCardStories from './SmallGiftCardStories';
import * as BrandHeaderStories from './BrandHeaderStories';
import * as BrandLogo from './BrandLogoStories';
import * as CategoryCard from './CategoryCardStories';
import * as RouletteNumber from './RouletteNumberStories';
import * as NumberListInput from './NumberListInputStories';
import * as ModalNotificationStories from './ModalNotificationStories';
import * as CreditCardCard from './CreditCardCardStories';
import { SkeletonItemStory } from './SkeletonItemStories';
import { DatePickerStory } from './DatePickerStories';
import { CheckInputStory } from './CheckInputStories';
import { InputStory } from './InputStories';
import { SelectInputStory } from './SelectInputStories';
import InStoreOfferDetailStory from './InStoreOfferDetailStories';
import InStoreOfferDetailHeadingStory from './InStoreOfferDetailHeadingStories';
import InStoreOfferDetailFooterStory from './InStoreOfferDetailFooterStories';
import { BannersManageCardsStory } from './BannersManageCardsStories';
import { GiftCardCodeStory } from './GiftCardCodeStories';
import { OnboardingStory } from './OnboardingStories';
import UnifimoneyBannerStory from './UnifimoneyBannerStories';
import TagStory from './TagStories';

storiesOf('Atoms', module)
  .addDecorator(getStory => <ScrollView style={styles.container}>{getStory()}</ScrollView>)
  .add('Tag', TagStory);

storiesOf('Molecules', module)
  .addDecorator(getStory => <ScrollView style={styles.container}>{getStory()}</ScrollView>)
  .add('Onboarding', OnboardingStory);

storiesOf('Form Elements', module)
  .addDecorator(getStory => <ScrollView style={styles.container}>{getStory()}</ScrollView>)
  .addDecorator(withKnobs)
  .add('Button', buttonStories.OverviewStory)
  .add('Icons', iconStories.OverviewStory)
  .add('Tooltip Button', tooltipButtonStories.OverviewStory)
  .add('Navigation Button', navigationButtonStories.Navbar)
  .add('Switch Nav Bar', SwitchNavBarStories.OverviewStory)
  .add('Search Input', MissionSearchInputStories.SearchInputStory)
  .add('Number List Input', NumberListInput.NumberListInputStory)
  .add('Date Picker', DatePickerStory)
  .add('Input', InputStory)
  .add('SelectInput', SelectInputStory)
  .add('CheckInputStory', CheckInputStory);

storiesOf('Containers', module)
  .addDecorator(getStory => <ScrollView style={styles.container}>{getStory()}</ScrollView>)
  .addDecorator(withKnobs)
  .add('Accordion', accordionStories.AccordionStory)
  .add('Card', cardStories.OverviewStory)
  .add('Modal', modalStories.ModalStory);

storiesOf('Mission Cards', module)
  .addDecorator(getStory => <ScrollView style={styles.container}>{getStory()}</ScrollView>)
  .addDecorator(withKnobs)
  .add('Large Mission Card', LargeMissionCardStories.OverviewStory)
  .add('Medium Mission Card', MediumMissionCardStories.OverviewStory)
  .add('Small Mission Card', SmallMissionCardStories.OverviewStory)
  .add('Petite Mission Card', PetiteStories.OverviewStory)
  .add('Category Card', CategoryCard.OverviewStory)
  .add('Credit Card Card', CreditCardCard.OverviewStory);

storiesOf('Modal Notifications', module)
  .addDecorator(getStory => <ScrollView style={styles.container}>{getStory()}</ScrollView>)
  .addDecorator(withKnobs)
  .add('Claim Points', ModalNotificationStories.ClaimPointsStory);

storiesOf('Gift Cards', module)
  .addDecorator(getStory => <ScrollView style={styles.container}>{getStory()}</ScrollView>)
  .addDecorator(withKnobs)
  .add('Small Gift Card', SmallGiftCardStories.OverviewStory);

storiesOf('Information Presentation', module)
  .addDecorator(getStory => <ScrollView style={styles.container}>{getStory()}</ScrollView>)
  .addDecorator(withKnobs)
  .add('Point Balance Summary', pointBalanceSummaryStories.GeneralStory)
  .add('Level Benefit', levelBenefitsStories.OverviewStory)
  .add('Card Benefit', cardBenefitsStories.GeneralStory)
  .add('Activity Detail and Item', activityDetailStoryStories.ActivityDetailStory)
  .add('Brand Header', BrandHeaderStories.OverviewStory)
  .add('Brand Logo', BrandLogo.OverviewStory)
  .add('Roulette Number', RouletteNumber.OverviewStory)
  .add('Reward Card', rewardCardStories.OverviewStory);

storiesOf('Small Modular', module)
  .addDecorator(withKnobs)
  .addDecorator(getStory => <ScrollView style={styles.container}>{getStory()}</ScrollView>)
  .add('Title', () => <TitleOverviewStory />)
  .add('Pill', pillStories.PillStory)
  .add('Divider', dividerStories.OverviewStory)
  .add('Spinner', spinnerStories.SpinnerStory)
  .add('Progress Ring', ProgressRingStories.OverviewStory)
  .add('Skeleton Items', SkeletonItemStory);

storiesOf('Toast', module)
  .addDecorator(getStory => <ScrollView style={styles.container}>{getStory()}</ScrollView>)
  .addDecorator(withKnobs)
  .add('Info', toastStories.InfoToastStory)
  .add('Warning', toastStories.WarningToastStory)
  .add('Error', toastStories.ErrorToastStory);

storiesOf('Error Boundary', module)
  .addDecorator(getStory => <ScrollView style={styles.container}>{getStory()}</ScrollView>)
  .add('Error Boundary', ErrorBoundaryStory);

storiesOf('Info Screens', module)
  .addDecorator(getStory => <ScrollView style={styles.selfishContainer}>{getStory()}</ScrollView>)
  .add('Offer Detail', InStoreOfferDetailStory)
  .add('Offer Detail Heading', InStoreOfferDetailHeadingStory)
  .add('Offer Detail Footer', InStoreOfferDetailFooterStory);

storiesOf('Banners Manage Cards', module)
  .addDecorator(getStory => <ScrollView style={styles.container}>{getStory()}</ScrollView>)
  .add('Banners Manage Cards', BannersManageCardsStory);

storiesOf('Gift Card Code', module)
  .addDecorator(getStory => <ScrollView style={styles.container}>{getStory()}</ScrollView>)
  .add('Gift Card Code', GiftCardCodeStory);

storiesOf('Unifimoney Banners', module)
  .addDecorator(getStory => <ScrollView style={styles.container}>{getStory()}</ScrollView>)
  .add('Unifimoney Banners', UnifimoneyBannerStory);
