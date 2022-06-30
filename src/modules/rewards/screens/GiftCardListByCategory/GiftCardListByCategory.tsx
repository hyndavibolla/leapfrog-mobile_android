import React, { memo, useContext, useMemo, useCallback, useRef, useState, useEffect, useLayoutEffect } from 'react';
import { View, FlatList, NativeSyntheticEvent, NativeScrollEvent, TextInput } from 'react-native';
import { StackHeaderProps, StackNavigationProp } from '@react-navigation/stack';

import NoResults from '_assets/shared/brandNoResults.svg';
import { Icon } from '_commons/components/atoms/Icon';
import { Button } from '_components/Button';
import { ConnectionBanner } from '_components/ConnectionBanner';
import { GiftCardSearchInput } from '_components/GiftCardSearchInput';
import { NavigationHeader } from '_components/NavigationHeader';
import { Orientation, SmallGiftCard } from '_components/SmallGiftCard';
import { Text } from '_components/Text';
import { Title, TitleType } from '_components/Title/Title';
import { ENV, ROUTES, CONTAINER_STYLE, COLOR, PageType, TealiumEventType, ForterActionType, UxObject, PageNames, ICON, FONT_SIZE } from '_constants';
import { RewardModel } from '_models';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { useEventTracker } from '_state_mgmt/core/hooks';
import { KnownSlideObjectSearchKey } from '_state_mgmt/reward/state';
import { isDeepEqual } from '_utils/isDeepEqual';
import { normalizeTextForSearching } from '_utils/normalizeTextForSearching';
import { useTestingHelper } from '_utils/useTestingHelper';
import { formatPrettyTitle } from '_utils/formatPrettyTitle';
import { styles } from './styles';
import { useSetRecentSearchItem } from '_utils/useSetRecentSearchItem';
import { IRecentSearchHistory, RecentSearchHistoryType } from '_models/searchHistory';

export interface Props {
  route: { params: { searchKey: string; searchText?: string; searchCategoryIdList?: string[]; autoFocus?: boolean } };
  navigation: StackNavigationProp<any>;
}

export const GiftCardListByCategory = ({ route, navigation }: Props) => {
  const { getTestIdProps } = useTestingHelper('gift-card-list-category');
  const setRecentHistoryItem = useSetRecentSearchItem(ENV.STORAGE_KEY.GIFT_CARDS_SEARCH_HISTORY);
  const { trackUserEvent } = useEventTracker();
  const { state } = useContext(GlobalContext);
  const flatListRef = useRef<FlatList>();
  const [isScrollNearTop, setIsScrollNearTop] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>(route?.params?.searchText || '');
  const [searchCategoryIdList, setSearchCategoryIdList] = useState<string[]>([]);
  const autoFocus = !!route?.params?.autoFocus;
  const topTolerance = 250;
  const searchKey = route?.params?.searchKey || /* istanbul ignore next */ KnownSlideObjectSearchKey.FULL_BRAND_SEARCH_RESULTS;
  const brandMap = state.reward.slideObjectMapByType[RewardModel.SlideObjectType.BRAND] as Record<string, RewardModel.IBrand>;
  const brandIdList = state.reward.slideObjectSearchMap[searchKey];
  const fullCategoryIdList = useMemo(() => state.reward.slideCategoryIdList.sort(), [state.reward.slideCategoryIdList]);
  const brandList: RewardModel.IBrand[] = useMemo(
    () =>
      (brandIdList || [])
        .map(id => brandMap[id])
        .filter(brand => {
          if (!brand) return false;
          const fitsTextSearchCriteria = normalizeTextForSearching(brand.brandName).startsWith(normalizeTextForSearching(searchText));
          const fitsCategorySearchCriteria = !searchCategoryIdList.length || brand.categories.some(cId => searchCategoryIdList.includes(cId.name));
          return fitsTextSearchCriteria && fitsCategorySearchCriteria;
        })
        .sort((a, b) => a.brandName.localeCompare(b.brandName)),
    [brandIdList, brandMap, searchCategoryIdList, searchText]
  );

  const searchInputRef = useRef<TextInput>();

  const { searchCategoryIdList: categoryList } = route.params || {};

  useEffect(() => {
    trackUserEvent(
      TealiumEventType.SEARCH,
      {
        page_type: PageType.TOP,
        event_type: ROUTES.MAIN_TAB.REWARDS,
        search_term: searchText,
        search_results_num: brandList.length.toString(),
        select_category: searchCategoryIdList[0],
        uxObject: UxObject.LIST,
        event_name: TealiumEventType.SELECT_GIFT_CARD_CATEGORY,
        page_name: PageNames.REWARDS.REWARDS_CATEGORY,
        event_detail: searchCategoryIdList[0]
      },
      ForterActionType.SEARCH_QUERY
    );
  }, [searchText, brandList, trackUserEvent, searchCategoryIdList]);

  const getNavigateToDetail = useCallback(
    (brand: RewardModel.IBrand) => () => {
      const historyItem: IRecentSearchHistory = { id: brand.brandName, name: brand.brandName, type: RecentSearchHistoryType.REWARD };
      setRecentHistoryItem(historyItem);
      trackUserEvent(
        TealiumEventType.SELECT_GIFT_CARD,
        {
          page_name: PageNames.REWARDS.REWARDS_SEARCH,
          address: `${ENV.SCHEME}${ROUTES.GIFT_CARD_DETAIL}`,
          event_type: brand.brandName,
          event_detail: brand.id,
          uxObject: UxObject.LIST,
          brand_name: brand.brandName,
          brand_id: brand.id,
          brand_category: brand.categories[0]?.name
        },
        ForterActionType.TAP
      );
      navigation.navigate(ROUTES.GIFT_CARD_DETAIL, { brandId: brand.id });
    },
    [navigation, trackUserEvent, setRecentHistoryItem]
  );

  const renderItem = useCallback(
    ({ item }: { item: RewardModel.IBrand }) => (
      <View style={styles.itemContainer}>
        <View style={styles.itemIndividualContainer} key={item.id}>
          <SmallGiftCard
            orientation={Orientation.HORIZONTAL}
            title={item.brandName}
            image={item.iconUrl}
            onPress={getNavigateToDetail(item)}
            style={styles.cardContainer}
          />
        </View>
      </View>
    ),
    [getNavigateToDetail]
  );
  const keyExtractor = useCallback(({ id }: RewardModel.IBrand) => id, []);
  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      setIsScrollNearTop(event.nativeEvent.contentOffset.y > topTolerance);
    },
    [setIsScrollNearTop, topTolerance]
  );

  const scrollToTop = useCallback(() => flatListRef.current.scrollToOffset({ animated: true, offset: 0 }), [flatListRef]);

  /* istanbul ignore next line */
  const onScrollBeginDrag = useCallback(() => {
    if (searchInputRef?.current?.isFocused()) searchInputRef?.current?.blur();
  }, []);

  /* istanbul ignore next line */
  const onFilterPress = useCallback(() => {
    navigation.navigate(ROUTES.FILTER, { categories: fullCategoryIdList });
  }, [navigation, fullCategoryIdList]);

  useEffect(() => {
    if (categoryList && !isDeepEqual(searchCategoryIdList, categoryList)) {
      setSearchCategoryIdList(categoryList);
    }
  }, [categoryList, searchCategoryIdList, setSearchCategoryIdList]);

  const navigationHeader = useCallback(
    (props: StackHeaderProps) => (
      <NavigationHeader
        {...props}
        searchBar={
          <GiftCardSearchInput
            text={searchText}
            ref={searchInputRef}
            onChangeText={setSearchText}
            categoryIdList={searchCategoryIdList}
            autoFocus={autoFocus}
            onFilterPress={onFilterPress}
          />
        }
      />
    ),
    [autoFocus, onFilterPress, searchCategoryIdList, searchText]
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      header: navigationHeader
    });
  }, [navigation, navigationHeader]);

  const ListEmptyComponent = useCallback(() => {
    return (
      <View style={styles.emptyStateContainer} {...getTestIdProps('empty-state')}>
        <View style={styles.emptyStateMessageContainer}>
          <NoResults />
          <Title style={styles.emptyStateTitle} type={TitleType.HEADER}>
            {'Woops! No search results :('}
          </Title>
          <Text style={styles.emptyStateText}>Try with other words, or explore other brands in the reward section.</Text>
        </View>
      </View>
    );
  }, [getTestIdProps]);

  return (
    <>
      <ConnectionBanner />
      <View style={styles.container}>
        <>
          <FlatList
            ListHeaderComponent={
              <Text style={styles.searchedText} {...getTestIdProps('searched-text')}>
                {formatPrettyTitle(searchCategoryIdList[0])} Gift Cards
              </Text>
            }
            style={styles.list}
            {...getTestIdProps('scroll')}
            ref={flatListRef}
            onScroll={onScroll}
            data={brandList}
            renderItem={renderItem}
            contentContainerStyle={!brandList.length && styles.listContainer}
            onScrollBeginDrag={onScrollBeginDrag}
            ListEmptyComponent={ListEmptyComponent}
            ListFooterComponent={<View style={styles.itemSeparator} />}
            ListFooterComponentStyle={styles.listContainerEnd}
            keyExtractor={keyExtractor}
          />

          {!isScrollNearTop ? null : (
            <Button
              onPress={scrollToTop}
              {...getTestIdProps('scroll-btn')}
              containerColor={COLOR.WHITE}
              style={styles.upButtonContainer}
              innerContainerStyle={[CONTAINER_STYLE.shadow, styles.upButtonContent]}
            >
              <Icon name={ICON.ARROW_UP} color={COLOR.BLACK} size={FONT_SIZE.HUGE} />
            </Button>
          )}
        </>
      </View>
    </>
  );
};

export default memo(GiftCardListByCategory);
