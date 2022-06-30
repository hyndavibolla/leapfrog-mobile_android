import React from 'react';
import { View } from 'react-native';

import { Text } from '../../src/views/shared/Text';
import * as SkeletonItems from '../../src/views/shared/SkeletonItem';
import { styles } from '../styles';

export const SkeletonItemStory = () => (
  <SkeletonItems.SkeletonItem>
    <View style={styles.subcontainer}>
      {[
        'SearchSkeletonItem',
        'TextSkeletonItem',
        'ShortTextSkeletonItem',
        'FatTextSkeletonItem',
        'TileSkeletonItem',
        'SmallSquareSkeletonItem',
        'MediumSquareSkeletonItem',
        'MediumSquareSkeletonItemAlt',
        'BigSquareSkeletonItem',
        'FullBigSquareSkeletonItem',
        'SwitchNavBarSkeletonItem',
        'CreditCardSkeletonItem',
        'RowSkeletonItem',
        'RowSkeletonItemAltColor',
        'LongRowSkeletonItem',
        'FullBigRowSkeletonItem',
        'FullFatRowSkeletonItem',
        'FullFatRowSkeletonItemCard',
        'FullFatRowSkeletonItemCardLevel',
        'TooltipTitleSkeletonItem',
        'RowSkeletonItemAlt',
        'RowSkeletonItems',
        'MediumTallRectangleSkeletonItem',
        'MediumRowSkeletonItem',
        'ImageSkeletonItem',
        'MissionDetailDescriptionSkeletonItem',
        'MissionDetailDisclaimerSkeletonItem',
        'MissionDetailButtonSkeletonItem',
        'LevelBenefitSkeletonItem',
        'SmallRowSkeletonItem',
        'LevelCardSkeletonItem',
        'LevelCardSkeletonItemAlt',
        'PointBalanceSummarySkeletonItem',
        'PointBalanceProgressSkeletonItem',
        'ListHeaderComponentSkeletonItem',
        'ListHeaderComponentSkeletonItemAlt',
        'TitleBallSkeletonItem',
        'SmallTileSkeletonItem',
        'MediumTileSkeletonItem',
        'CreditCardSkeleton',
        'ItemSkeleton',
        'CircleSkeleton',
        'CardElementSkeleton',
        'CardOfferWithOutIconSkeleton',
        'CardOfferWithButtonSkeleton',
        'CardOfferWithBrandsSkeleton',
        'CardOfferIconRightSkeleton'
      ].map(compoName => {
        const Component = SkeletonItems[compoName];
        return (
          <View key={compoName}>
            <Text style={styles.title}>{compoName}</Text>
            <View style={styles.componentContainer}>
              <Component />
            </View>
            <View style={styles.division} />
          </View>
        );
      })}
    </View>
  </SkeletonItems.SkeletonItem>
);
