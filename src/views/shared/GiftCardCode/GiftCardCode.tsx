import React, { memo, useMemo } from 'react';
import { View, Text, StyleProp, ViewStyle, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';

import { useTestingHelper } from '../../../utils/useTestingHelper';
import { ImageWithFallbackAndLoading } from '../ImageWithFallbackAndLoading';
import GiftCardCodeFallback from '../../../assets/shared/giftCardCodeFallback.svg';
import { Title } from '../Title';
import { ENV } from '../../../constants';

import { styles } from './styles';

const windowWidth = Dimensions.get('window').width;

export enum CodeKind {
  CODE128 = 'CODE128',
  PDF417 = 'PDF417',
  DATA_MATRIX = 'DATA_MATRIX',
  QR_CODE = 'QR_CODE',
  PDF417_COMPACT = 'PDF417_COMPACT'
}

export interface Props {
  barcodeKind?: string;
  barcodeValue: string;
  imageHeight?: number;
  imageWidth?: number;
  colorHex?: string;
  fontColorHex?: string;
  fontSize?: number;
  loadingSize?: number;
  style?: StyleProp<ViewStyle>;
}

export const GiftCardCode = ({
  barcodeKind,
  barcodeValue,
  imageWidth,
  imageHeight,
  colorHex = 'FFFFFF',
  fontColorHex = '000000',
  fontSize = 0,
  loadingSize = 35,
  style
}: Props) => {
  const { getTestIdProps } = useTestingHelper('card-code');
  if (!imageWidth) {
    switch (barcodeKind?.toUpperCase()) {
      case CodeKind.CODE128:
      case CodeKind.PDF417:
      case CodeKind.PDF417_COMPACT:
        imageWidth = windowWidth * 0.8;
        imageHeight = 93;
        break;
      default:
        imageWidth = 170;
        imageHeight = 170;
    }
  }

  const source = useMemo(
    () => ({
      uri: `${ENV.TELLURIDE_API.CONTENT_BASE_URL}tellurideAS/PersonalizedEmail/genbc?msg=${barcodeValue}&height=${Math.round(imageHeight)}&width=${Math.round(
        imageWidth
      )}&fontSize=${fontSize}&bgColorHex=${colorHex}&fontColorHex=${fontColorHex}&barcode.kind=${barcodeKind}`
    }),
    [barcodeKind, barcodeValue, colorHex, fontColorHex, fontSize, imageHeight, imageWidth]
  );

  const Fallback = useMemo(
    () => (
      <View style={styles.fallbackContainer} {...getTestIdProps('fallback')}>
        <GiftCardCodeFallback />
        <Title style={styles.fallbackTitle}>We can't load this code right now</Title>
        <Text style={styles.fallbackSubtitle}>Please try again later.</Text>
      </View>
    ),
    [getTestIdProps]
  );

  return (
    <View style={[styles.container, style]}>
      <ImageWithFallbackAndLoading
        source={source}
        customFallback={Fallback}
        loading={
          <LottieView style={{ width: loadingSize, height: loadingSize }} loop autoPlay source={require('../../../assets/spinner/spinner-loader.json')} />
        }
        resizeMode="cover"
        style={{ width: imageWidth, height: imageHeight }}
        {...getTestIdProps('image')}
      />
    </View>
  );
};

export default memo(GiftCardCode);
