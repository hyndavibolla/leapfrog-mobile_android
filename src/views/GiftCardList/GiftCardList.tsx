import React, { memo, useContext, useMemo, useCallback, useRef, useState, useEffect, useLayoutEffect } from 'react';
import { View, FlatList, TextInput, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
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
import { ENV, ROUTES, PageType, TealiumEventType, ForterActionType, UxObject, PageNames, COLOR, CONTAINER_STYLE, FONT_SIZE, ICON } from '_constants';
import { RewardModel } from '_models';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { useEventTracker } from '_state_mgmt/core/hooks';
import { KnownSlideObjectSearchKey } from '_state_mgmt/reward/state';
import { normalizeTextForSearching } from '_utils/normalizeTextForSearching';
import { useTestingHelper } from '_utils/useTestingHelper';
import { useSetRecentSearchItem } from '_utils/useSetRecentSearchItem';
import { IRecentSearchHistory, RecentSearchHistoryType } from '_models/searchHistory';
import { RecentHistoryList } from '_commons/components/molecules/RecentHistoryList';
import { GiftCardSection } from '_views/TransactionFilters/components';
import { TransactionFilter } from '_models/offer';

import { styles } from './styles';

export interface Props {
  route: { params: { searchKey: string; searchText?: string; autoFocus?: boolean } };
  navigation: StackNavigationProp<any>;
}

const topTolerance = 250;

export const GiftCardList = ({ route, navigation }: Props) => {
  const isFocused = navigation.isFocused();
  const { getTestIdProps } = useTestingHelper('gift-card-list');
  const setRecentHistoryItem = useSetRecentSearchItem(ENV.STORAGE_KEY.GIFT_CARDS_SEARCH_HISTORY);
  const { trackUserEvent } = useEventTracker();
  const {
    state,
    deps: {
      nativeHelperService: { storage }
    }
  } = useContext(GlobalContext);
  const flatListRef = useRef<FlatList>();
  const [isScrollNearTop, setIsScrollNearTop] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>(route?.params?.searchText || '');
  const [recentSearchHistory, setRecentSearchHistory] = useState<IRecentSearchHistory[]>([]);
  const autoFocus = !!route?.params?.autoFocus;
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
          return fitsTextSearchCriteria;
        })
        .sort((a, b) => a.brandName.localeCompare(b.brandName)),
    [brandIdList, brandMap, searchText]
  );

  const searchInputRef = useRef<TextInput>();

  const handlePressHistoryItem = useCallback(
    (id: string | number, name: string, type: string) => {
      if (type === RecentSearchHistoryType.CATEGORY) {
        navigation.navigate(ROUTES.REWARDS_LIST_BY_CATEGORY, {
          searchCategoryIdList: [id],
          searchKey: KnownSlideObjectSearchKey.FULL_BRAND_SEARCH_RESULTS
        });
      } else {
        setSearchText(name);
      }
    },
    [navigation]
  );

  useEffect(() => {
    trackUserEvent(
      TealiumEventType.SEARCH,
      {
        page_name: PageNames.MAIN.REWARDS,
        page_type: PageType.TOP,
        event_type: ROUTES.MAIN_TAB.REWARDS,
        search_term: searchText,
        event_detail: searchText,
        event_name: TealiumEventType.SEARCH,
        uxObject: UxObject.SEARCH,
        search_results_num: brandList.length.toString()
      },
      ForterActionType.SEARCH_QUERY
    );
  }, [searchText, brandList, trackUserEvent]);

  useEffect(() => {
    if (!isFocused) return;
    (async () => {
      setRecentSearchHistory((await storage.get<IRecentSearchHistory[]>(ENV.STORAGE_KEY.GIFT_CARDS_SEARCH_HISTORY)) || []);
    })();
  }, [isFocused, storage]);

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
    [setIsScrollNearTop]
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

  const header = useCallback(
    (props: StackHeaderProps) => (
      <NavigationHeader
        {...props}
        searchBar={
          <GiftCardSearchInput
            text={searchText}
            ref={searchInputRef}
            onChangeText={setSearchText}
            categoryIdList={[]}
            autoFocus={autoFocus}
            onFilterPress={onFilterPress}
          />
        }
      />
    ),
    [autoFocus, onFilterPress, searchText]
  );

  useLayoutEffect(() => {
    navigation.setOptions({ header });
  }, [header, navigation]);

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

  const ListHeaderComponent = useCallback(() => {
    return (
      <>
        <RecentHistoryList historyList={recentSearchHistory} onPress={handlePressHistoryItem} style={styles.recentHistoryList} visible={!searchText} />

        <Text style={styles.searchedText} {...getTestIdProps('searched-text')}>
          {searchText ? 'Search Results:' : 'All Gift Cards'}
        </Text>
      </>
    );
  }, [recentSearchHistory, getTestIdProps, handlePressHistoryItem, searchText]);

  const ListFooterComponent = useCallback(() => {
    return (
      <View style={styles.footerContainer}>
        <GiftCardSection transactionType={TransactionFilter.REWARDS} />
      </View>
    );
  }, []);

  return (
    <>
      <ConnectionBanner />
      <View style={styles.container}>
        <>
          <FlatList
            ListHeaderComponent={ListHeaderComponent}
            style={styles.list}
            {...getTestIdProps('scroll')}
            ref={flatListRef}
            onScroll={onScroll}
            data={brandList}
            renderItem={renderItem}
            contentContainerStyle={!brandList.length && styles.listContainer}
            onScrollBeginDrag={onScrollBeginDrag}
            ListEmptyComponent={ListEmptyComponent}
            ListFooterComponent={ListFooterComponent}
            ListFooterComponentStyle={styles.listContainerEnd}
            keyExtractor={keyExtractor}
          />
        </>
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
      </View>
    </>
  );
};

export default memo(GiftCardList);
