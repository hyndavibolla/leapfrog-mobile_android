import React, { memo, useContext, useEffect, useCallback, useState, useMemo, useRef } from 'react';
import { View, FlatList, Animated, Image, ScrollView, ImageStyle } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';

import RewardsEmptyState from '_assets/shared/giftCardEmptyStateIcon.svg';
import GiftCardWaterMark from '_assets/shared/sywGiftCardWaterMark.svg';
import { SectionWrapper } from '_commons/components/molecules/SectionWrapper';
import { CriticalError } from '_components/CriticalError';
import { EmptyState } from '_components/EmptyState';
import { GiftCardSearchInput } from '_components/GiftCardSearchInput';
import { OnboardingTooltip } from '_components/OnboardingTooltip';
import { Title, TitleType } from '_components/Title';
import { MediumCategoryCard } from '_components/MediumCategoryCard';
import { GiftCardSection } from '_views/TransactionFilters/components';

import { Carrousel } from '_components/Carrousel';
import { ENV, ROUTES, TealiumEventType, UxObject, ForterActionType, PageNames } from '_constants';
import { RewardModel } from '_models';
import { TooltipKey } from '_models/general';
import { statusType } from '_models/giftCard';
import { TransactionFilter } from '_models/offer';
import { IRecentSearchHistory, RecentSearchHistoryType } from '_models/searchHistory';
import { BrandCategory } from '_modules/rewards/components/BrandCategory';
import { GiftCardBanner } from '_modules/gift-cards/components/GiftCardBanner';
import { TranslateSearchBarWrapper } from '_commons/components/organisms/TranslateSearchBarWrapper';
import { useGiftCards } from '_state_mgmt/giftCard';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { useEventTracker, useTooltipList } from '_state_mgmt/core/hooks';
import { useRewardConfigBrandSearch } from '_state_mgmt/reward/hooks';
import { KnownSlideObjectSearchKey } from '_state_mgmt/reward/state';
import { formatPrettyTitle } from '_utils/formatPrettyTitle';
import { useAnimatedHeader } from '_utils/useAnimatedHeader';
import { useTestingHelper } from '_utils/useTestingHelper';
import { useSetRecentSearchItem } from '_utils/useSetRecentSearchItem';
import { RewardMainSkeleton } from './components/RewardMainSkeleton';
import { PointsToExpireBanner } from './components/PointsToExpireBanner';
import { RewardCard } from './components/RewardCard';

import { styles } from './styles';

export interface Props {
  navigation: StackNavigationProp<any>;
}

export const REDEEM_URL = 'https://www.shopyourway.com/';

export const RewardMain = ({ navigation }: Props) => {
  const { state, deps } = useContext(GlobalContext);
  const setRecentHistoryItem = useSetRecentSearchItem(ENV.STORAGE_KEY.GIFT_CARDS_SEARCH_HISTORY);
  const {
    core: { viewedTooltipList, dismissedTooltipList, expirePointsBannerDataSet },
    game: {
      current: {
        balance: { memberOwnPointsToExpire }
      }
    },
    giftCard: { giftCardsList },
    reward: { slideObjectMapByType, config, slideCategoryIdList }
  } = state;
  const { getTestIdProps } = useTestingHelper('gift-card-group-list');
  const [onLoadGiftCardsList] = useGiftCards();
  const [onRewardConfigBrandSearch, isLoading = true, error] = useRewardConfigBrandSearch();
  const { trackUserEvent } = useEventTracker();
  const [searchText, setSearchText] = useState<string>('');
  const [searchCategoryIdList, setSearchCategoryIdList] = useState<string[]>([]);
  const { getViewedTooltipList, getDismissedTooltipList } = useTooltipList();
  const [onGetViewedTooltipList] = getViewedTooltipList;
  const [onGetDismissedTooltipList] = getDismissedTooltipList;
  const tooltipKey = TooltipKey.REWARDS;
  const mainScrollViewRef = useRef<ScrollView>(null);
  const isTooltipViewed = viewedTooltipList.includes(tooltipKey);
  const fullCategoryIdList = useMemo(() => slideCategoryIdList.sort(), [slideCategoryIdList]);
  const configCategoryMap = config.categories.reduce((total, curr) => ({ ...total, [curr.id]: curr.brands }), {});
  const brandByCategoryListUnsorted = useMemo(
    () =>
      config.categories
        .filter(({ id: categoryId }) => ![ENV.CUSTOM_BRAND_CATEGORY_KEY, ENV.BLACKLIST_BRAND_CATEGORY_KEY].includes(categoryId))
        .slice(0, 6)
        .map(({ id: categoryId }) => ({
          categoryName: categoryId,
          list: configCategoryMap[categoryId]
            ?.map((slideObject: RewardModel.IBrandDetail) => slideObjectMapByType[RewardModel.SlideObjectType.BRAND][slideObject.brandId] as RewardModel.IBrand)
            ?.filter(Boolean)
            .slice(0, 15)
        }))
        .filter(item => !!item.list?.length),
    [config.categories, configCategoryMap, slideObjectMapByType]
  );

  const brandByCategoryList = useMemo(() => {
    const brandByCategoryListMoreThanTwo = brandByCategoryListUnsorted.filter(({ list }) => list.length > 2);
    const brandByCategoryListLessThanTwo = brandByCategoryListUnsorted.filter(({ list }) => list.length <= 2);
    return brandByCategoryListMoreThanTwo.concat(brandByCategoryListLessThanTwo);
  }, [brandByCategoryListUnsorted]);

  const restOfCategories = useMemo(
    () => fullCategoryIdList.filter(category => !brandByCategoryList.find(({ categoryName }) => categoryName === category)),
    [fullCategoryIdList, brandByCategoryList]
  );

  const getNavigateToDetail = useCallback(
    (item: RewardModel.IBrand) => () => {
      trackUserEvent(
        TealiumEventType.SELECT_GIFT_CARD,
        {
          page_name: PageNames.REWARDS.REWARDS_SEARCH,
          event_type: item.brandName,
          event_detail: item.id,
          uxObject: UxObject.LIST,
          brand_name: item.brandName,
          brand_id: item.id,
          brand_category: item.categories[0]?.name
        },
        ForterActionType.TAP
      );
      navigation.navigate(ROUTES.GIFT_CARD_DETAIL, { brandId: item.id });
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const getNavigateToList = useCallback(
    (categoryId: string) => () => {
      const historyItem: IRecentSearchHistory = { id: categoryId, name: formatPrettyTitle(categoryId), type: RecentSearchHistoryType.CATEGORY };
      setRecentHistoryItem(historyItem);
      return navigation.navigate(ROUTES.REWARDS_LIST_BY_CATEGORY, {
        searchCategoryIdList: [categoryId].filter(Boolean),
        searchKey: KnownSlideObjectSearchKey.FULL_BRAND_SEARCH_RESULTS
      });
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const renderMoreCategory = useCallback(
    ({ item: categoryId }) => (
      <MediumCategoryCard
        title={formatPrettyTitle(categoryId)}
        boxStyle={styles.moreCategoriesBox}
        itemContainerStyle={styles.moreCategoriesItemContainerStyle}
        textStyle={styles.moreCategoriesTextStyle}
        onPress={getNavigateToList(categoryId)}
      />
    ),
    [getNavigateToList]
  );

  const onRedeem = useCallback(() => {
    navigation.navigate(ROUTES.COMMON_WEB_VIEW.MAIN, {
      showTitle: false,
      url: REDEEM_URL
    });
  }, [navigation]);

  const onSearch = useCallback(() => {
    const searchKey = KnownSlideObjectSearchKey.FULL_BRAND_SEARCH_RESULTS;
    navigation.navigate(ROUTES.GIFT_CARD_SEE_ALL, { title: 'Search Results', searchKey, searchText, searchCategoryIdList });
  }, [searchText, searchCategoryIdList]); // eslint-disable-line react-hooks/exhaustive-deps

  const onFocusChange = useCallback(
    () =>
      navigation.navigate(ROUTES.GIFT_CARD_SEE_ALL, {
        title: 'Search Results',
        searchKey: KnownSlideObjectSearchKey.FULL_BRAND_SEARCH_RESULTS,
        searchText,
        searchCategoryIdList,
        autoFocus: true
      }),
    [searchText, searchCategoryIdList] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const onSeeTooltipScreen = () => {
    trackUserEvent(TealiumEventType.REWARD_TOOLTIP, {}, ForterActionType.TAP);
    navigation.navigate(ROUTES.TOOLTIP.REWARDS);
  };

  const onFilterPress = useCallback(() => navigation.navigate(ROUTES.FILTER, { categories: fullCategoryIdList }), [navigation, fullCategoryIdList]);

  const activeUniqueGiftCards = useMemo(() => {
    return giftCardsList.filter(
      (value, index, list) =>
        index === list.findIndex(giftCard => giftCard.brandDetails.brandId === value.brandDetails.brandId && giftCard.statusInd === statusType.ACTIVE)
    );
  }, [giftCardsList]);

  useFocusEffect(
    useCallback(() => {
      mainScrollViewRef?.current?.scrollTo({ x: 0, y: 0, animated: false });
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      onRewardConfigBrandSearch();
      setSearchText('');
      setSearchCategoryIdList([]);
    }, [onRewardConfigBrandSearch])
  );

  useFocusEffect(
    useCallback(() => {
      deps.eventTrackerService.rZero.trackEvent('user_visited_rewards');
    }, [deps.eventTrackerService])
  );

  useEffect(() => {
    onLoadGiftCardsList();
    onGetViewedTooltipList();
    if (!dismissedTooltipList.includes(tooltipKey)) onGetDismissedTooltipList();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { scrollYValue, searchBarTranslate } = useAnimatedHeader();

  if (error) return <CriticalError />;

  return (
    <View style={styles.container} {...getTestIdProps('container')}>
      <Animated.View style={styles.container}>
        <TranslateSearchBarWrapper translateY={searchBarTranslate}>
          <GiftCardSearchInput
            text={searchText}
            onSubmitText={onSearch}
            onChangeText={setSearchText}
            categoryIdList={searchCategoryIdList}
            onFocusChange={onFocusChange}
            onFilterPress={onFilterPress}
          />
        </TranslateSearchBarWrapper>
        {!brandByCategoryList.length && isLoading ? (
          <RewardMainSkeleton />
        ) : (
          <Animated.ScrollView
            ref={mainScrollViewRef}
            contentContainerStyle={styles.scrollViewContainer}
            showsVerticalScrollIndicator={false}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollYValue } } }], { useNativeDriver: true })}
            scrollEventThrottle={25}
            {...getTestIdProps('scroll')}
          >
            <EmptyState
              visible={!brandByCategoryList.length}
              Icon={RewardsEmptyState}
              title="Rewards is currently under maintenance"
              subtitleLine1="We are working for you!"
              subtitleLine2="Please come back again later."
            />
            {!brandByCategoryList.length ? null : (
              <View style={styles.onboardingTooltipContainer}>
                <OnboardingTooltip
                  title="Get rewarded with Gift Cards"
                  onPress={onSeeTooltipScreen}
                  isFlashy={!isTooltipViewed}
                  {...getTestIdProps('header-container')}
                />
              </View>
            )}

            <PointsToExpireBanner memberOwnPointsToExpire={memberOwnPointsToExpire} expirePointsBannerDataSet={expirePointsBannerDataSet} />
            {activeUniqueGiftCards.length ? (
              <SectionWrapper title={{ value: 'Gift cards list' }}>
                <GiftCardBanner giftCards={activeUniqueGiftCards} />
              </SectionWrapper>
            ) : null}
            {brandByCategoryList.map(({ categoryName, list }, index) => (
              <BrandCategory
                key={index.toString()}
                categoryName={categoryName}
                list={list}
                onPressSeeAll={getNavigateToList}
                onPressItem={getNavigateToDetail}
              />
            ))}
            <View style={styles.footerContainer}>
              <GiftCardSection transactionType={TransactionFilter.REWARDS} />
              <RewardCard
                title="Rewards, reimagined."
                description={`Redeem your points${'\n'}at ShopYourWay.com`}
                image={<Image style={styles.rewardCardImage as ImageStyle} source={require('_assets/shared/rewardsImage.png')} />}
                onPress={onRedeem}
                isImageOnLeft
                containerStyles={styles.rewardCardContainerStyles}
                titleStyles={styles.rewardCardTitle}
                descriptionStyles={styles.rewardCardDescription}
                anchorStyles={styles.rewardCardAnchor}
              />
              <View style={styles.footerCategoryList}>
                <Title style={styles.sectionTitle} numberOfLines={1} ellipsizeMode="tail" type={TitleType.SECTION}>
                  Explore more categories
                </Title>
                <View style={styles.moreCategoriesList}>
                  <Carrousel itemWidth={160} separatorWidth={0}>
                    <FlatList
                      data={restOfCategories}
                      keyExtractor={categoryID => categoryID}
                      renderItem={renderMoreCategory}
                      showsHorizontalScrollIndicator={false}
                      horizontal
                    />
                  </Carrousel>
                </View>
              </View>
              <View style={styles.giftCardWaterMarkContainer}>
                <GiftCardWaterMark />
              </View>
            </View>
          </Animated.ScrollView>
        )}
      </Animated.View>
    </View>
  );
};

export default memo(RewardMain);
