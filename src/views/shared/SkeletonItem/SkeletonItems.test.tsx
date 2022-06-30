import React from 'react';
import { render } from '@testing-library/react-native';

import * as SkeletonItems from './SkeletonItem';

describe('SkeletonItem', () => {
  it.each([
    'SkeletonItem',
    'SearchSkeletonItem',
    'TextSkeletonItem',
    'SmallSquareSkeletonItem',
    'BigSquareSkeletonItem',
    'SkeletonHorizontalDivision',
    'SkeletonVerticalDivision',
    'MediumSquareSkeletonItem',
    'ShortTextSkeletonItem',
    'MediumSquareSkeletonItemAlt',
    'RowSkeletonItem',
    'SwitchNavBarSkeletonItem',
    'CreditCardSkeletonItem',
    'FatTextSkeletonItem',
    'LongRowSkeletonItem',
    'TileSkeletonItem',
    'FullBigRowSkeletonItem',
    'TooltipTitleSkeletonItem',
    'FullFatRowSkeletonItem',
    'MediumTallRectangleSkeletonItem',
    'MediumRowSkeletonItem',
    'FullBigSquareSkeletonItem',
    'TitleBallSkeletonItem',
    'SmallTileSkeletonItem',
    'MediumTileSkeletonItem',
    'CreditCardSkeleton',
    'ItemSkeleton',
    'CircleSkeleton',
    'CardOfferSkeleton',
    'CardElementSkeleton',
    'CardOfferWithOutIconSkeleton',
    'CardOfferWithButtonSkeleton',
    'CardOfferWithBrandsSkeleton',
    'CardOfferIconRightSkeleton',
    'RowSkeletonItemAlt',
    'SkeletonItemReward',
    'SkeletonItemOffer',
    'RowSkeletonItemAltColor',
    'ListHeaderComponentSkeletonItemAlt',
    'LevelCardSkeletonItemAlt',
    'PointBalanceSummarySkeletonItem',
    'PointBalanceProgressSkeletonItem',
    'RowSkeletonItems',
    'FullFatRowSkeletonItemCard',
    'FullFatRowSkeletonItemCardLevel'
  ])('should render a "%s" component', compoName => {
    const Component = SkeletonItems[compoName];
    const { toJSON } = render(<Component>children</Component>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render a "SkeletonList" component', () => {
    const { toJSON } = render(<SkeletonItems.SkeletonList repetitionCount={2}>children</SkeletonItems.SkeletonList>);
    expect(toJSON()).toMatchSnapshot();
  });
});
