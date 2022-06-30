import React, { memo, PropsWithChildren, useCallback, useMemo } from 'react';
import { FlatList, ScrollView, StyleProp, View, ViewStyle } from 'react-native';
import { View as AnimatedView } from 'react-native-animatable';
import styled from '@emotion/native';

import { COLOR, FONT_SIZE, ICON } from '_constants';
import { Icon } from '_commons/components/atoms/Icon';

import { styles } from './styles';

export type Props = PropsWithChildren<{
  speed?: number;
}>;

const backGroundColor = COLOR.MEDIUM_GRAY;
const baseColor = COLOR.SKELETON_GRAY;

export const SkeletonHorizontalDivision = memo(() => <View style={styles.horizontalDivision} />);
export const SkeletonVerticalDivision = memo(() => <View style={styles.verticalDivision} />);
export const SkeletonBlock = styled.View<{
  width?: number | string;
  height?: string | number;
  color?: COLOR;
  radius?: number;
  dir?: 'row' | 'column';
  flex?: number;
  padding?: string;
}>`
  width: ${({ width = '100%' }) => width};
  height: ${({ height = 'auto' }) => height};
  background-color: ${({ color = baseColor }) => color};
  border-radius: ${({ radius = 8 }) => `${radius}px`};
  flex-direction: ${({ dir = 'column' }) => dir};
  flex: ${({ flex = '0 1 auto' }) => flex};
`;

export const SkeletonItem = memo(({ speed = 2000, children }: Props) => {
  const animation = useMemo(() => ({ 0: { opacity: 1 }, 0.5: { opacity: 0.35 }, 1: { opacity: 1 } }), []);
  return (
    <AnimatedView duration={speed} easing="ease" iterationCount="infinite" animation={animation}>
      {children}
    </AnimatedView>
  );
});

export const SearchSkeletonItem = memo(() => (
  <SkeletonBlock width="100%" dir="row" color={COLOR.TRANSPARENT}>
    <SkeletonBlock height="40px" flex={1} radius={20} />
    <SkeletonBlock height="40px" width="40px" radius={40} style={{ marginLeft: 15 }} />
  </SkeletonBlock>
));

export const TitleBallSkeletonItem = memo(() => (
  <SkeletonBlock width="100%" dir="row" color={COLOR.TRANSPARENT} style={[styles.alignCenter, styles.justifyCenter]}>
    <SkeletonBlock height="60px" width="60px" radius={60} style={{ marginRight: 15 }} />
    <SkeletonBlock height="20px" width="75px" radius={20} />
  </SkeletonBlock>
));

export const TextSkeletonItem = memo(({ style }: { style?: StyleProp<ViewStyle> }) => (
  <SkeletonBlock width="100%" height="20px" radius={10} dir="row" style={[styles.alignBetween, style]} />
));

export const ShortTextSkeletonItem = memo(({ width = 50 }: { width?: number }) => (
  <SkeletonBlock width={`${width}%`} height="20px" radius={10} dir="row" style={styles.alignBetween} />
));

export const FatTextSkeletonItem = memo(({ style }: { style?: StyleProp<ViewStyle> }) => (
  <SkeletonBlock width="100%" height="50px" radius={30} dir="row" style={[styles.alignBetween, style]} />
));

export const CreditCardSkeleton = memo(() => (
  <View style={styles.alignCenter}>
    <SkeletonBlock height="75px" width="117px" dir="row" radius={5} color={backGroundColor} style={{ padding: 10 }}>
      <SkeletonBlock height="5px" width="50%" dir="row" radius={5} style={{ marginLeft: 10, marginTop: 15 }} />

      <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
        <SkeletonBlock height="17px" width="17px" radius={25} />
        <SkeletonBlock height="17px" width="17px" radius={25} color={COLOR.DARK_GRAY} style={{ position: 'relative', right: 8, opacity: 0.24 }} />
      </View>
    </SkeletonBlock>
  </View>
));

export const ItemSkeleton = memo(({ style }: { style?: StyleProp<ViewStyle> }) => (
  <View style={[{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }, style]}>
    <SkeletonBlock height="44px" width="44px" radius={22} />
    <View style={{ width: '80%', marginLeft: 10 }}>
      <SkeletonBlock height="13px" width="50%" dir="row" radius={5} style={{ marginBottom: 8 }} />
      <SkeletonBlock height="13px" width="80%" dir="row" radius={5} />
    </View>
  </View>
));

export const CircleSkeleton = memo(({ size = 60, style }: { size?: number; style?: StyleProp<ViewStyle> }) => (
  <SkeletonBlock height={`${size}px`} width={`${size}px`} radius={size / 2} style={style} />
));

export const CardOfferSkeleton = memo(({ height, width, style }: { height: number; width: number; style?: StyleProp<ViewStyle> }) => (
  <SkeletonBlock height={`${height}px`} width={`${width}px`} dir="row" radius={8} color={backGroundColor} style={[{ padding: 20 }, style]}>
    <View>
      <CircleSkeleton />
    </View>
    <SkeletonBlock width={'100%'} height="13px" radius={6} style={{ marginTop: 10, marginLeft: 12 }} />
  </SkeletonBlock>
));

export const CardElementSkeleton = memo(({ style }: { style?: StyleProp<ViewStyle> }) => (
  <SkeletonBlock height="100px" width="330px" dir="row" radius={8} color={backGroundColor} style={[{ alignItems: 'center', justifyContent: 'center' }, style]}>
    <SkeletonBlock width="70%" height="12px" radius={6} />
  </SkeletonBlock>
));

export const CardOfferWithOutIconSkeleton = memo(() => (
  <SkeletonBlock height="141px" width="100%" dir="column" radius={8} color={backGroundColor} style={{ padding: 30 }}>
    <SkeletonBlock width="75%" height="20px" radius={30} />
    <SkeletonBlock width="55%" height="20px" radius={30} style={{ marginTop: 12 }} />
  </SkeletonBlock>
));

export const CardOfferWithButtonSkeleton = memo(() => (
  <SkeletonBlock height="auto" width="100%" dir="row" radius={8} color={backGroundColor} style={{ marginRight: 15, padding: 20 }}>
    <CircleSkeleton />
    <View style={{ width: '70%', marginLeft: 20, marginTop: 20 }}>
      <SkeletonBlock width="100%" height="12px" radius={6} />
      <SkeletonBlock width="50%" height="28px" radius={14} style={{ marginTop: 35 }} />
    </View>
  </SkeletonBlock>
));

export const CardOfferWithBrandsSkeleton = memo(() => (
  <SkeletonBlock width="100%" dir="column" radius={8} color={backGroundColor} style={{ paddingVertical: 30 }}>
    <View style={{ paddingHorizontal: 15 }}>
      <SkeletonBlock width="50%" height="20px" radius={100} />
      <SkeletonBlock width="90%" height="12px" radius={6} style={{ marginTop: 10 }} />
      <SkeletonBlock width="80%" height="12px" radius={6} style={{ marginTop: 10 }} />
    </View>
    <SkeletonVerticalDivision />
    <SkeletonVerticalDivision />
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      <SkeletonHorizontalDivision />
      <CircleSkeleton size={70} />
      <SkeletonHorizontalDivision />
      <CircleSkeleton size={70} />
      <SkeletonHorizontalDivision />
      <CircleSkeleton size={70} />
      <SkeletonHorizontalDivision />
      <CircleSkeleton size={70} />
      <SkeletonHorizontalDivision />
      <CircleSkeleton size={70} />
      <SkeletonHorizontalDivision />
      <CircleSkeleton size={70} />
    </ScrollView>
  </SkeletonBlock>
));

export const CardOfferIconRightSkeleton = memo(({ style, hideCircle }: { style?: StyleProp<ViewStyle>; hideCircle?: boolean }) => (
  <SkeletonBlock height="141px" width="332px" dir="row" radius={8} color={backGroundColor} style={[{ paddingTop: 25, paddingHorizontal: 20 }, style]}>
    <View style={{ width: '50%' }}>
      <SkeletonBlock width="80%" height="20px" radius={14} />
      <SkeletonBlock width="100%" height="12px" radius={6} style={{ marginTop: 10 }} />
      <SkeletonBlock width="100%" height="12px" radius={6} style={{ marginTop: 10 }} />
    </View>
    {!hideCircle && (
      <View style={{ width: '50%', paddingTop: 15, paddingRight: 20, alignItems: 'flex-end' }}>
        <CircleSkeleton />
      </View>
    )}
  </SkeletonBlock>
));

export const TileSkeletonItem = memo(({ height = 170, width = 150 }: { height?: number; width?: number }) => (
  <SkeletonBlock height={`${height}px`} width={`${width}px`} color={backGroundColor} style={[styles.alignCenter, styles.justifyCenter]}>
    <CircleSkeleton />
    <SkeletonBlock height="15px" width="70%" style={{ marginTop: 25 }} />
  </SkeletonBlock>
));

export const MediumTileSkeletonItem = memo(() => (
  <SkeletonBlock style={[styles.alignCenter, styles.justifyCenter]} color={COLOR.TRANSPARENT}>
    <SkeletonBlock width="140px" height="65px" color={backGroundColor} style={[styles.alignCenter, styles.justifyCenter]}>
      <SkeletonBlock height="20px" width="70px" />
    </SkeletonBlock>
  </SkeletonBlock>
));

export const SmallTileSkeletonItem = memo(() => (
  <SkeletonBlock width="100px" height="65px" color={backGroundColor} style={[styles.alignCenter, styles.justifyCenter]}>
    <SkeletonBlock height="10px" width="50px" />
  </SkeletonBlock>
));

export const SmallSquareSkeletonItem = memo(() => (
  <SkeletonBlock width="100px" height="100px" color={backGroundColor} style={[styles.alignCenter, styles.justifyCenter]}>
    <CircleSkeleton />
  </SkeletonBlock>
));

export const MediumSquareSkeletonItem = memo(() => (
  <SkeletonBlock width="350px" height="160px" dir="row" color={backGroundColor} style={[styles.alignEnd, { padding: 30 }]}>
    <View>
      <CircleSkeleton size={50} style={{ marginRight: 15 }} />
    </View>
    <SkeletonBlock color={COLOR.TRANSPARENT}>
      <SkeletonBlock width="50%" height="20px" radius={10} dir="row" style={styles.alignBetween} />
      <SkeletonVerticalDivision />
      <SkeletonBlock width="50%" height="20px" radius={10} dir="row" style={styles.alignBetween} />
    </SkeletonBlock>
  </SkeletonBlock>
));

export const MediumSquareSkeletonItemAlt = memo(() => (
  <SkeletonBlock width="350px" height="160px" dir="row" color={backGroundColor} style={{ padding: 30 }}>
    <View>
      <CircleSkeleton size={50} style={{ marginRight: 15 }} />
    </View>
    <SkeletonBlock color={COLOR.TRANSPARENT}>
      <SkeletonBlock width="80%" height="25px" radius={10} dir="row" style={styles.alignBetween} />
      <SkeletonVerticalDivision />
      <SkeletonBlock width="50%" height="20px" radius={10} dir="row" style={styles.alignBetween} />
      <SkeletonVerticalDivision />
      <SkeletonBlock width="50%" height="20px" radius={10} dir="row" style={styles.alignBetween} />
    </SkeletonBlock>
  </SkeletonBlock>
));

export const BigSquareSkeletonItem = memo(() => (
  <SkeletonBlock width="350px" height="300px" dir="row" color={backGroundColor} style={[styles.alignEnd, { padding: 30 }]}>
    <SkeletonBlock dir="row" color={COLOR.TRANSPARENT} style={styles.alignCenter}>
      <CircleSkeleton size={50} style={{ marginRight: 15 }} />
      <SkeletonBlock width="50%" height="20px" radius={10} dir="row" style={styles.alignBetween} />
    </SkeletonBlock>
  </SkeletonBlock>
));

export const FullBigSquareSkeletonItem = memo(() => (
  <SkeletonBlock width="100%" height="300px" dir="row" color={backGroundColor} style={[styles.alignEnd, { padding: 30 }]}>
    <SkeletonBlock dir="row" color={COLOR.TRANSPARENT} style={styles.alignCenter}>
      <CircleSkeleton size={50} style={{ marginRight: 15 }} />
      <SkeletonBlock width="50%" height="20px" radius={10} dir="row" style={styles.alignBetween} />
    </SkeletonBlock>
  </SkeletonBlock>
));

export const SwitchNavBarSkeletonItem = memo(() => (
  <SkeletonBlock radius={40} color={backGroundColor} style={{ padding: 5 }}>
    <SkeletonBlock height="50px" width="50%" radius={50} />
  </SkeletonBlock>
));

export const CreditCardSkeletonItem = memo(() => (
  <SkeletonBlock height="230px" color={backGroundColor} style={{ padding: 40, justifyContent: 'space-between' }}>
    <SkeletonBlock width="50%" height="20px" radius={10} dir="row" />
    <SkeletonBlock dir="row" color={COLOR.TRANSPARENT} style={{ justifyContent: 'flex-end' }}>
      <CircleSkeleton size={50} />
      <CircleSkeleton size={50} />
    </SkeletonBlock>
  </SkeletonBlock>
));

export const RowSkeletonItem = memo(() => (
  <SkeletonBlock height="80px" dir="row" color={backGroundColor} style={{ padding: 15, alignItems: 'center' }}>
    <CircleSkeleton size={40} style={{ marginRight: 15 }} />
    <SkeletonBlock width="60%" height="20px" radius={10} dir="row" />
  </SkeletonBlock>
));

export const RowSkeletonItems = memo(() => (
  <SkeletonBlock height="100px" dir="row" color={backGroundColor} style={{ padding: 15, alignItems: 'center' }}>
    <CircleSkeleton size={80} />
    <SkeletonBlock width="60%" dir="column" color={COLOR.TRANSPARENT} style={{ marginLeft: 15 }}>
      <SkeletonBlock width="35%" height="25px" radius={20} dir="row" />
      <SkeletonBlock width="60%" height="40px" radius={20} dir="row" style={{ marginTop: 10 }} />
    </SkeletonBlock>
  </SkeletonBlock>
));

export const RowSkeletonItemAltColor = memo(() => (
  <SkeletonBlock height="80px" dir="row" color={backGroundColor} style={{ padding: 15, alignItems: 'center' }}>
    <CircleSkeleton size={40} style={{ marginRight: 15 }} />
    <SkeletonBlock width="40%" height="20px" radius={10} dir="row" />
  </SkeletonBlock>
));

export const LongRowSkeletonItem = memo(() => (
  <SkeletonBlock height="80px" width="350px" dir="row" color={backGroundColor} style={{ padding: 15, alignItems: 'center' }}>
    <CircleSkeleton size={40} style={{ marginRight: 15 }} />
    <SkeletonBlock width="60%" height="20px" radius={10} dir="row" />
  </SkeletonBlock>
));

export const FullBigRowSkeletonItem = memo(() => (
  <SkeletonBlock height="200px" color={backGroundColor} style={{ padding: 15, justifyContent: 'space-around' }}>
    <SkeletonBlock dir="row" color={COLOR.TRANSPARENT} style={styles.alignCenter}>
      <CircleSkeleton size={50} style={{ marginRight: 15 }} />
      <SkeletonBlock width="80%" height="20px" dir="row" />
    </SkeletonBlock>
    <SkeletonBlock dir="row" color={COLOR.TRANSPARENT} style={styles.alignCenter}>
      <CircleSkeleton size={50} style={{ marginRight: 15 }} />
      <SkeletonBlock width="80%" height="20px" dir="row" />
    </SkeletonBlock>
  </SkeletonBlock>
));

export const FullFatRowSkeletonItem = memo(() => (
  <SkeletonBlock height="230px" color={backGroundColor} style={{ paddingHorizontal: 15, paddingBottom: 50, justifyContent: 'flex-end' }}>
    <SkeletonBlock width="100%" height="50px" radius={30} dir="row" />
  </SkeletonBlock>
));

export const FullFatRowSkeletonItemCard = memo(() => (
  <SkeletonBlock height="230px" color={backGroundColor} style={{ paddingHorizontal: 15, paddingBottom: 50, justifyContent: 'flex-end' }}>
    <SkeletonBlock width="50%" height="20px" radius={30} dir="row" style={{ marginBottom: 40, alignSelf: 'center' }} />
    <SkeletonBlock width="100%" height="50px" radius={30} dir="row" />
  </SkeletonBlock>
));

const CardSkeletonWithShadow = memo(() => (
  <SkeletonBlock color={COLOR.TRANSPARENT} style={{ marginTop: -10 }}>
    <SkeletonBlock width="100%" height="100px" radius={10} dir="row" />
    <SkeletonBlock width="100%" height="100px" radius={10} dir="row" color={backGroundColor} style={{ position: 'absolute', top: 4 }}>
      <SkeletonBlock width="20%" height="24px" radius={10} dir="row" style={{ margin: 20 }} />
    </SkeletonBlock>
  </SkeletonBlock>
));

export const FullFatRowSkeletonItemCardLevel = memo(() => (
  <SkeletonBlock color={COLOR.TRANSPARENT}>
    <SkeletonBlock width="100%" height="100px" radius={10} dir="row" color={backGroundColor}>
      <SkeletonBlock width="20%" height="24px" radius={10} dir="row" style={{ margin: 20 }} />
    </SkeletonBlock>
    <CardSkeletonWithShadow />
    <CardSkeletonWithShadow />
    <CardSkeletonWithShadow />
    <CardSkeletonWithShadow />
  </SkeletonBlock>
));

export const TooltipTitleSkeletonItem = memo(() => (
  <SkeletonBlock color={COLOR.TRANSPARENT} dir="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
    <SkeletonBlock height="20px" width="200px" />
    <CircleSkeleton size={25} style={{ marginLeft: 15 }} />
  </SkeletonBlock>
));

export const RowSkeletonItemAlt = memo(() => (
  <SkeletonBlock height={100} dir="row" color={backGroundColor} style={{ padding: 20 }}>
    <CircleSkeleton style={{ marginRight: 15 }} />
    <SkeletonBlock width="80%" height="20px" radius={10} dir="row" style={{ marginTop: 15 }} />
  </SkeletonBlock>
));

export const MediumTallRectangleSkeletonItem = memo(() => (
  <SkeletonBlock
    width="105px"
    height="155px"
    color={backGroundColor}
    style={{ paddingVertical: 15, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center' }}
  >
    <CircleSkeleton style={{ marginBottom: 30 }} />
    <SkeletonBlock width="80px" height="15px" radius={10} />
  </SkeletonBlock>
));

export const MediumRowSkeletonItem = memo(() => (
  <SkeletonBlock height={100} width="255px" dir="row" color={backGroundColor} style={{ padding: 20, alignItems: 'center' }}>
    <CircleSkeleton style={{ marginRight: 15 }} />
    <SkeletonBlock width="60%" height="20px" radius={10} dir="row" />
  </SkeletonBlock>
));

/* istanbul ignore next */
export const ImageSkeletonItem = memo(() => (
  <SkeletonBlock width="100%" height="185px" color={backGroundColor} radius={0} style={{ paddingVertical: 25, paddingHorizontal: 20 }}>
    <CircleSkeleton size={30} />
    <Icon name={ICON.SYW_CIRCLE} size={FONT_SIZE.XL} color={COLOR.WHITE} style={{ alignSelf: 'center' }} />
  </SkeletonBlock>
));

/* istanbul ignore next */
export const MissionDetailDescriptionSkeletonItem = memo(() => (
  <SkeletonBlock width="100%" color={backGroundColor} style={{ paddingTop: 20, paddingBottom: 35, paddingLeft: 35, paddingRight: 40 }}>
    <SkeletonBlock width="100%" dir="row" style={{ alignItems: 'center' }} color={COLOR.TRANSPARENT}>
      <CircleSkeleton style={{ marginLeft: 10, marginRight: 15 }} />
      <SkeletonBlock width="60%" height="20px" radius={10} dir="row" />
    </SkeletonBlock>
    <SkeletonVerticalDivision />
    <SkeletonBlock width="80%" height="15px" radius={10} />
    <SkeletonVerticalDivision />
    <SkeletonBlock width="50%" height="15px" radius={10} />
    <SkeletonVerticalDivision />
    <SkeletonBlock width="80%" height="15px" radius={10} />
    <SkeletonVerticalDivision />
    <SkeletonBlock width="50%" height="15px" radius={10} />
  </SkeletonBlock>
));

/* istanbul ignore next */
export const MissionDetailDisclaimerSkeletonItem = memo(() => (
  <SkeletonBlock width="100%" color={backGroundColor} style={{ paddingTop: 50, paddingBottom: 40, paddingLeft: 25, paddingRight: 40 }}>
    <SkeletonBlock width="40%" height="20px" radius={10} dir="row" />
    <SkeletonVerticalDivision />
    <SkeletonBlock width="100%" dir="row" color={COLOR.TRANSPARENT}>
      <CircleSkeleton size={32} style={{ flexShrink: 0, marginRight: 20 }} />
      <SkeletonBlock color={COLOR.TRANSPARENT}>
        <SkeletonBlock width="100%" height="15px" radius={10} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="60%" height="15px" radius={10} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="100%" height="15px" radius={10} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="60%" height="15px" radius={10} />
        <SkeletonVerticalDivision />
      </SkeletonBlock>
    </SkeletonBlock>
    <SkeletonVerticalDivision />
    <SkeletonBlock width="100%" dir="row" color={COLOR.TRANSPARENT}>
      <CircleSkeleton size={32} style={{ flexShrink: 0, marginRight: 20 }} />
      <SkeletonBlock color={COLOR.TRANSPARENT}>
        <SkeletonBlock width="100%" height="15px" radius={10} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="60%" height="15px" radius={10} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="100%" height="15px" radius={10} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="60%" height="15px" radius={10} />
        <SkeletonVerticalDivision />
      </SkeletonBlock>
    </SkeletonBlock>
    <SkeletonVerticalDivision />
    <SkeletonVerticalDivision />
    <SkeletonBlock width="40%" height="20px" radius={10} />
    <SkeletonBlock width="100%" color={COLOR.TRANSPARENT} style={{ paddingLeft: 10, marginTop: 35 }}>
      <SkeletonBlock width="100%" height="15px" radius={10} />
      <SkeletonVerticalDivision />
      <SkeletonBlock width="60%" height="15px" radius={10} />
      <SkeletonVerticalDivision />
      <SkeletonBlock width="100%" height="15px" radius={10} />
      <SkeletonVerticalDivision />
      <SkeletonBlock width="60%" height="15px" radius={10} />
      <SkeletonVerticalDivision />
      <SkeletonBlock width="100%" height="15px" radius={10} />
      <SkeletonVerticalDivision />
      <SkeletonBlock width="60%" height="15px" radius={10} />
      <SkeletonVerticalDivision />
      <SkeletonBlock width="100%" height="15px" radius={10} />
    </SkeletonBlock>
  </SkeletonBlock>
));

/* istanbul ignore next */
export const MissionDetailButtonSkeletonItem = memo(() => (
  <SkeletonBlock width="100%" color={backGroundColor} style={{ paddingTop: 20, paddingBottom: 40, paddingRight: 40, alignItems: 'flex-end' }}>
    <SkeletonBlock width="170px" height="50px" radius={25} dir="row" />
  </SkeletonBlock>
));

export const LevelCardSkeletonItemAlt = memo(() => (
  <SkeletonBlock width="285px" color={backGroundColor} style={{ paddingTop: 20, paddingHorizontal: 25, paddingBottom: 25 }}>
    <SkeletonBlock dir="row" style={{ justifyContent: 'space-between' }} color={COLOR.TRANSPARENT}>
      <SkeletonBlock width="80px" height="20px" radius={10} />
      <SkeletonBlock width="80px" height="20px" radius={10} />
    </SkeletonBlock>
    <SkeletonVerticalDivision />
    <SkeletonBlock dir="row" color={COLOR.TRANSPARENT}>
      <CircleSkeleton size={16} style={{ flexGrow: 0, marginRight: 10 }} />
      <SkeletonBlock width="60%" height="16px" radius={10} style={{ flexGrow: 0 }} />
    </SkeletonBlock>
    <SkeletonVerticalDivision />
    <SkeletonBlock dir="row" color={COLOR.TRANSPARENT}>
      <CircleSkeleton size={16} style={{ flexGrow: 0, marginRight: 10 }} />
      <SkeletonBlock width="60%" height="16px" radius={10} style={{ flexGrow: 0 }} />
      <CircleSkeleton size={24} style={{ flexGrow: 0, position: 'absolute', right: 0 }} />
    </SkeletonBlock>
  </SkeletonBlock>
));

export const PointBalanceSummarySkeletonItem = memo(() => (
  <>
    <SkeletonBlock
      width="100%"
      color={backGroundColor}
      style={{ paddingVertical: 25, paddingHorizontal: 20, borderBottomStartRadius: 0, borderBottomEndRadius: 0 }}
      dir="row"
    >
      <CircleSkeleton size={16} style={{ marginRight: 10, flexGrow: 0 }} />
      <SkeletonBlock width="20%" height="15px" radius={10} style={{ marginRight: '20%', flexGrow: 0 }} />
      <CircleSkeleton size={16} style={{ marginRight: 10, flexGrow: 0 }} />
      <SkeletonBlock width="20%" height="15px" radius={10} style={{ flexGrow: 0 }} />
    </SkeletonBlock>
    <SkeletonBlock width="100%" color={COLOR.WHITE} style={{ padding: 20, borderTopStartRadius: 0, borderTopEndRadius: 0 }} dir="row">
      <SkeletonBlock width="16px" height="16px" radius={16} style={{ marginRight: 15, flexGrow: 0 }} />
      <SkeletonBlock width="60%" height="15px" radius={10} style={{ flexGrow: 0 }} />
    </SkeletonBlock>
  </>
));

export const PointBalanceProgressSkeletonItem = memo(() => (
  <SkeletonBlock width="100%" color={backGroundColor} style={{ padding: 20, paddingTop: 15 }}>
    <SkeletonBlock width="100%" color={COLOR.TRANSPARENT} dir="row">
      <CircleSkeleton size={50} style={{ marginRight: 20 }} />
      <SkeletonBlock color={COLOR.TRANSPARENT} style={{ flexGrow: 0, width: 140 }}>
        <SkeletonBlock width="80px" height="20px" radius={20} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="140px" height="15px" radius={15} />
      </SkeletonBlock>
    </SkeletonBlock>
    <SkeletonBlock width="100%" height="5px" radius={5} style={{ marginVertical: 50 }}>
      <SkeletonBlock width="60%" height="5px" radius={5} color={COLOR.DARK_GRAY} />
    </SkeletonBlock>
    <SkeletonBlock width="80%" height="15px" radius={15} />
    <SkeletonVerticalDivision />
    <SkeletonBlock width="60%" height="15px" radius={15} />
  </SkeletonBlock>
));

export const ListHeaderComponentSkeletonItem = memo(() => (
  <SkeletonBlock width="100%" color={backGroundColor} style={{ padding: 20, paddingRight: 25 }}>
    <SkeletonBlock width="100%" color={COLOR.TRANSPARENT} dir="row" style={{ justifyContent: 'space-between' }}>
      <SkeletonBlock color={COLOR.TRANSPARENT}>
        <SkeletonBlock color={COLOR.TRANSPARENT} dir="row">
          <CircleSkeleton size={20} style={{ marginRight: 10 }} />
          <SkeletonBlock width="60px" height="20px" radius={20} />
        </SkeletonBlock>
        <SkeletonVerticalDivision />
        <SkeletonBlock width="60%" height="15px" radius={15} />
      </SkeletonBlock>
      <CircleSkeleton size={20} style={{ alignSelf: 'center' }} />
    </SkeletonBlock>
    <SkeletonVerticalDivision />
    <SkeletonBlock width="100%" color={COLOR.TRANSPARENT} dir="row" style={{ justifyContent: 'space-between' }}>
      <SkeletonBlock color={COLOR.TRANSPARENT}>
        <SkeletonBlock color={COLOR.TRANSPARENT} dir="row">
          <CircleSkeleton size={20} style={{ marginRight: 10 }} />
          <SkeletonBlock width="60px" height="20px" radius={20} />
        </SkeletonBlock>
        <SkeletonVerticalDivision />
        <SkeletonBlock width="60%" height="15px" radius={15} />
      </SkeletonBlock>
    </SkeletonBlock>
  </SkeletonBlock>
));

export const ListHeaderComponentSkeletonItemAlt = memo(() => (
  <SkeletonBlock width="100%" color={backGroundColor} style={{ padding: 20, paddingRight: 25 }}>
    <SkeletonBlock width="100%" color={COLOR.TRANSPARENT} dir="row" style={{ justifyContent: 'space-between' }}>
      <SkeletonBlock color={COLOR.TRANSPARENT}>
        <SkeletonBlock color={COLOR.TRANSPARENT} dir="row">
          <CircleSkeleton size={20} style={{ marginRight: 10 }} />
          <SkeletonBlock width="60px" height="20px" radius={20} />
        </SkeletonBlock>
        <SkeletonVerticalDivision />
        <SkeletonBlock width="60%" height="15px" radius={15} />
      </SkeletonBlock>
      <CircleSkeleton size={20} style={{ alignSelf: 'center' }} />
    </SkeletonBlock>
    <SkeletonVerticalDivision />
    <SkeletonBlock width="100%" color={COLOR.TRANSPARENT} dir="row" style={{ justifyContent: 'space-between' }}>
      <SkeletonBlock color={COLOR.TRANSPARENT}>
        <SkeletonBlock color={COLOR.TRANSPARENT} dir="row">
          <CircleSkeleton size={20} style={{ marginRight: 10 }} />
          <SkeletonBlock width="60px" height="20px" radius={20} />
        </SkeletonBlock>
        <SkeletonVerticalDivision />
        <SkeletonBlock width="60%" height="15px" radius={15} />
      </SkeletonBlock>
      <CircleSkeleton size={20} style={{ alignSelf: 'center' }} />
    </SkeletonBlock>
  </SkeletonBlock>
));

export const SkeletonItemReward = memo(({ width, height }: PropsWithChildren<{ width?: '100%'; height?: '80px' }>) => (
  <SkeletonBlock width={width} height={height} color={COLOR.MEDIUM_GRAY} style={{ padding: 20, paddingRight: 25 }}>
    <SkeletonBlock color={COLOR.TRANSPARENT} dir="row" style={{ alignItems: 'center' }}>
      <SkeletonBlock color={COLOR.TRANSPARENT} dir="column">
        <SkeletonBlock width="60%" height="21px" radius={15} style={{ marginBottom: 7 }} />
        <SkeletonBlock width="60%" height="17px" radius={15} />
      </SkeletonBlock>
      <CircleSkeleton size={25} />
    </SkeletonBlock>
  </SkeletonBlock>
));

export const SkeletonItemOffer = memo(() => (
  <SkeletonBlock
    width="100%"
    height="70px"
    dir="row"
    style={{ alignItems: 'center', justifyContent: 'flex-start', paddingLeft: 14, paddingRight: 22 }}
    color={COLOR.MEDIUM_GRAY}
  >
    <SkeletonBlock dir="row" color={COLOR.TRANSPARENT}>
      <CircleSkeleton size={40} style={{ marginRight: 14 }} />
      <SkeletonBlock width="150px" dir="column" style={{ justifyContent: 'space-between' }} color={COLOR.TRANSPARENT}>
        <SkeletonBlock width="100px" height="19px" />
        <SkeletonBlock width="100px" height="15px" />
      </SkeletonBlock>
    </SkeletonBlock>
    <SkeletonBlock width="62px" height="19px" />
  </SkeletonBlock>
));

export const SkeletonList = memo(
  ({
    repetitionCount,
    children,
    scrollEnabled = false,
    horizontal = true
  }: PropsWithChildren<{ repetitionCount: number; scrollEnabled?: boolean; horizontal?: boolean }>) => {
    const data = useMemo(() => Array.from(Array(repetitionCount)).map((_, index) => index), [repetitionCount]);
    const keyExtractor = useCallback((_, index) => String(index), []);
    const renderItem = useCallback(() => <>{children}</>, [children]);
    return <FlatList scrollEnabled={scrollEnabled} horizontal={horizontal} data={data} renderItem={renderItem} keyExtractor={keyExtractor} />;
  }
);
