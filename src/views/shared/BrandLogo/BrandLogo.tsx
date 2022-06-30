import React, { memo, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { ImageStyle, StyleProp, ViewStyle, View } from 'react-native';
import { SvgProps } from 'react-native-svg';
import Image from 'react-native-fast-image';

import ErrorBoundary from '../ErrorBoundary';
import { shouldShowFeature } from '_components/Flagged';
import { useDebounce } from '_utils/useDebounce';
import { useTestingHelper } from '_utils/useTestingHelper';
import { noop } from '_utils/noop';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { ActivityModel, OfferModel } from '_models';
import { FeatureFlag } from '_models/general';
import { ENV } from '_constants';

import StreakIcon from '_assets/shared/streakIcon.svg';
import ArrowDownIcon from '_assets/shared/arrowDownRed.svg';
import KmartIcon from '_assets/shared/kmartIcon.svg';
import SearsIcon from '_assets/shared/searsIcon.svg';
import SurveyIcon from '_assets/shared/surveyIcon.svg';
import GiftIcon from '_assets/shared/giftIcon.svg';
import BrandFallback from '_assets/shared/loyaltyBrandFallback.svg';
import SYWIconDarkBlue from '_assets/shared/sywIconDarkBlue.svg';

import { styles } from './styles';

export interface Props {
  image?: string;
  icon?: ReactNode;
  category?: string;
  activityType?: string;
  style?: StyleProp<ViewStyle>;
  size?: number;
  fallbackIcon?: ReactNode;
  Fallback?: React.FC<SvgProps>;
  streakIndicator?: boolean;
  onLoadImageCallback?: () => void;
  isGiftCard?: boolean;
}

const BrandLogo = ({
  image,
  icon,
  category,
  activityType,
  style,
  size = 60,
  fallbackIcon,
  Fallback,
  streakIndicator,
  onLoadImageCallback = noop,
  isGiftCard
}: Props) => {
  const { getTestIdProps } = useTestingHelper('brand-logo');
  const { deps } = useContext(GlobalContext);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const logoStyle = useMemo(() => [styles.logo, style], [style]);
  const debouncedLoading = useDebounce(loading, ENV.IMAGE_LOADING_FLICKERING_DEBOUNCE_MS); // avoids flickering when image was cached

  const setLoadingStart = useCallback(() => setLoading(true), []);
  const setLoadingEnd = useCallback(() => setLoading(false), []);

  const shouldUseFallback = (!image && !icon) || category === OfferModel.PointsType.POINTS_EXPIRY || error || debouncedLoading;

  const customBrandIcon = useMemo(() => {
    // this case should be removed with this ticket https://sywjira.atlassian.net/browse/LEAP-3459
    if (category === OfferModel.PointsType.POINTS_EXPIRY) return <ArrowDownIcon width={size} height={size} />;
    /* istanbul ignore next */
    if (category === OfferModel.ProgramType.STREAK) return <StreakIcon width={size} height={size} />;
    if (category === OfferModel.ProgramSubCategory.KMART) return <KmartIcon width={size} height={size} />;
    if (category === OfferModel.ProgramSubCategory.SEARS) return <SearsIcon width={size} height={size} />;
    /* istanbul ignore next */
    if (category === OfferModel.ProgramSubCategory.SURVEY && shouldShowFeature(FeatureFlag.SURVEY)) return <SurveyIcon width={size} height={size} />;
    if (category === OfferModel.ProgramType.CARDLINK) return <SYWIconDarkBlue width={size} height={size} />;
    if (activityType === ActivityModel.Type.REDEMPTION || category === ActivityModel.Type.REDEEM || (!category && isGiftCard))
      return <GiftIcon width={size} height={size} />;
    if (activityType === ActivityModel.Type.TRANSACTION) return <SYWIconDarkBlue width={size} height={size} />;
    return <BrandFallback width={size} height={size} />;
  }, [activityType, category, size, isGiftCard]);

  const fallbackCompo = Fallback ? (
    <View style={styles.fallbackContainer}>
      <Fallback width={size} height={size} />
    </View>
  ) : (
    <View style={styles.containerIcon}>{customBrandIcon}</View>
  );

  const renderFallback = fallbackIcon ?? fallbackCompo;

  const IndicatorIcon = streakIndicator ? StreakIcon : null;

  const renderContent = useMemo(() => {
    if (image)
      return (
        <Image
          style={shouldUseFallback ? { width: 0, height: 0 } : (styles.image as any)}
          fallback={deps.nativeHelperService.platform.OS === 'android'}
          resizeMode="cover"
          onLoadStart={setLoadingStart}
          onLoadEnd={setLoadingEnd}
          onLoad={onLoadImageCallback}
          onError={setError as any}
          source={{ uri: image, priority: 'high' }}
          {...getTestIdProps('image')}
        />
      );
    if (icon) return icon;
    return null;
  }, [deps.nativeHelperService.platform.OS, getTestIdProps, icon, image, onLoadImageCallback, setLoadingEnd, setLoadingStart, shouldUseFallback]);

  return (
    <ErrorBoundary>
      <View style={logoStyle as ImageStyle}>
        {!shouldUseFallback ? null : renderFallback}
        {renderContent}
        {!IndicatorIcon ? null : (
          <IndicatorIcon width={size / 2.5} height={size / 2.5} style={[styles.indicator, { top: -1 * (size / 15), right: -1 * (size / 15) }]} />
        )}
      </View>
    </ErrorBoundary>
  );
};

export default memo(BrandLogo);
