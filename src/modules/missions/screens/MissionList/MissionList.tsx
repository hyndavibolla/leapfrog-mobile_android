import React, { memo, useCallback, useContext, useEffect, useMemo, useLayoutEffect, useRef, useState } from 'react';
import { View, NativeSyntheticEvent, NativeScrollEvent, ViewabilityConfig, SectionList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StackHeaderProps, StackNavigationProp } from '@react-navigation/stack';

import { Icon } from '_commons/components/atoms/Icon';
import { RecentHistoryItem } from '_commons/components/molecules/RecentHistoryItem';
import { Button } from '_components/Button';
import { ConnectionBanner } from '_components/ConnectionBanner';
import ErrorBoundary from '_components/ErrorBoundary';
import { MediumCategoryCard } from '_components/MediumCategoryCard';
import { NavigationHeader } from '_components/NavigationHeader';
import { LocalOfferBanner } from '_components/LocalOfferBanner';
import { Text } from '_components/Text';
import { Title, TitleType } from '_components/Title';
import { WideMissionCard } from '_components/WideMissionCard';
import {
  ROUTES,
  CONTAINER_STYLE,
  ENV,
  COLOR,
  TealiumEventType,
  UxObject,
  ForterActionType,
  PageType,
  PageNames,
  ICON,
  FONT_SIZE,
  GROCERY_AND_DELIVERY_CATEGORY
} from '_constants';
import { MissionListSkeleton } from './components/MissionListSkeleton';
import { TopBrandsSection } from '_views/TransactionFilters/components';
import Fallback from './MissionList.fallback';

import { CategoryNavigationHeader } from '_modules/missions/components/CategoryNavigationHeader';
import { ISearchCriteria, MissionSearchInput, MissionSearchInputVariant } from '_modules/missions/components/MissionSearchInput';
import { MissionImpressionView } from '_modules/missions/components/MissionImpressionView';
import { ButtonCreativeType } from '_models/general';
import { ICategory, IMission, IRecentSearchHistory, MissionListType, RecentSearchHistoryType } from '_models/mission';
import { TransactionFilter } from '_models/offer';
import { useEventTracker } from '_state_mgmt/core/hooks';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { actions as missionActions } from '_state_mgmt/mission/actions';
import { useMissionFreeSearch, useSearchHistory } from '_state_mgmt/mission/hooks';
import { KnownMissionSearchKey } from '_state_mgmt/mission/state';
import { isAvailableStreakIndicator } from '_utils/isAvailableStreakIndicator';
import { isDeepEqual } from '_utils/isDeepEqual';
import { normalizeTextForSearching } from '_utils/normalizeTextForSearching';
import { getPageNameWithParams } from '_utils/trackingUtils';
import { useDebounce } from '_utils/useDebounce';
import { useLocationPermission } from '_utils/useLocationPermission';
import { useTestingHelper } from '_utils/useTestingHelper';
import { Section } from '_modules/earn/screens/EarnMain';
import { useSetRecentSearchItem } from '_utils/useSetRecentSearchItem';
import { isSectionWithStreakTag } from '_utils/isSectionWithStreakTag';

import { styles } from './styles';

export interface Props {
  route: {
    params: {
      searchKey: string;
      missionListType: MissionListType;
      initialSearchCriteria: ISearchCriteria;
      title?: string;
      isMainSearchFromEarnPage?: boolean;
      sectionName?: string;
    };
  };
  navigation: StackNavigationProp<any>;
}

const topTolerance: number = 250;
const viewabilityConfig: ViewabilityConfig = { waitForInteraction: false, itemVisiblePercentThreshold: 50, minimumViewTime: 1000 };

export const MissionList = ({ route, navigation }: Props) => {
  const {
    searchKey = KnownMissionSearchKey.SEE_ALL,
    missionListType = MissionListType.DEFAULT,
    initialSearchCriteria,
    title,
    isMainSearchFromEarnPage,
    sectionName
  } = route.params;
  const setRecentHistoryItem = useSetRecentSearchItem(ENV.STORAGE_KEY.OFFERS_SEARCH_HISTORY);

  const [searchText, setSearchText] = useState<string>(initialSearchCriteria?.search || '');
  const [categoryNameList] = useState<string[]>(initialSearchCriteria?.categoryNameList || []);
  const [searchedText, setSearchedText] = useState<string>('');
  const [isScrollNearTop, setIsScrollNearTop] = useState<boolean>(false);
  const [isBannerOnTop, setIsBannerOnTop] = useState<boolean>(true);
  const [viewedMissionList, setViewedMissionList] = useState<string[]>([]);
  const [recentSearchHistory, setRecentSearchHistory] = useState<IRecentSearchHistory[]>([]);

  const flatListRef = useRef<SectionList>();
  const isFocused = navigation.isFocused();

  const {
    deps: {
      nativeHelperService: { storage }
    },
    state: {
      mission: { missionSearchMap, missionMap, categoryList }
    },
    dispatch
  } = useContext(GlobalContext);

  const isDefaultSearch = useMemo(
    () => searchKey === KnownMissionSearchKey.SEE_ALL && missionListType === MissionListType.DEFAULT && !categoryNameList.length,
    [categoryNameList.length, missionListType, searchKey]
  );

  const { setSearchHistory } = useSearchHistory();
  const { trackUserEvent } = useEventTracker();
  const { isLocationAvailable } = useLocationPermission();
  const [onSearch, isSearching, searchError] = useMissionFreeSearch();
  const [isContentLoaded, setIsContentLoaded] = useState<boolean>(false);
  const { getTestIdProps } = useTestingHelper('mission-list');

  const setStorageRecentSearchHistory = useCallback(
    async (searchHistoryItem: IRecentSearchHistory) => {
      if (!isMainSearchFromEarnPage) return;
      setRecentHistoryItem(searchHistoryItem);
    },
    [isMainSearchFromEarnPage, setRecentHistoryItem]
  );

  const handleRecentSearchHistory = useCallback(
    ({ id, name, type, isAvailableStreakIndicator: recentIsAvailableStreakIndicator }: IRecentSearchHistory) => {
      setStorageRecentSearchHistory({ id, name, type });
      if (type === RecentSearchHistoryType.MISSION) {
        navigation.navigate(ROUTES.MISSION_DETAIL, { brandRequestorId: id, isAvailableStreakIndicator: recentIsAvailableStreakIndicator });
        return;
      }
      navigation.push(ROUTES.MISSION_SEE_ALL, {
        searchKey: KnownMissionSearchKey.GENERAL_SEARCH_RESULTS,
        missionListType: MissionListType.DEFAULT,
        initialSearchCriteria: { categoryNameList: [name] }
      });
    },
    [setStorageRecentSearchHistory, navigation]
  );

  const handleLocalOfferNavigateMap = useCallback(() => {
    trackUserEvent(
      TealiumEventType.LOCATION,
      {
        page_name: PageNames.EARN.MISSION_SEE_ALL,
        event_type: TealiumEventType.LOCATION,
        event_name: TealiumEventType.IN_STORE,
        uxObject: UxObject.BUTTON
      },
      ForterActionType.TAP
    );
    navigation.push(ROUTES.IN_STORE_OFFERS.OFFER_SEARCH_MAP);
  }, [navigation, trackUserEvent]);

  const handleLocalOfferNavigateToEarn = useCallback(() => {
    const params: { scrollToSection: Section } = {
      scrollToSection: 'mapCardSection'
    };
    navigation.navigate(ROUTES.MAIN_TAB.EARN, params);
  }, [navigation]);

  const handleCategoryPress = useCallback(
    name => {
      navigation.push(ROUTES.MISSION_SEE_ALL, {
        searchKey: KnownMissionSearchKey.GENERAL_SEARCH_RESULTS,
        missionListType: MissionListType.DEFAULT,
        initialSearchCriteria: { categoryNameList: [name] }
      });

      setStorageRecentSearchHistory({ id: name, name, type: RecentSearchHistoryType.CATEGORY });
    },
    [navigation, setStorageRecentSearchHistory]
  );

  /** @todo istanbul ignore next was added on [LEAP-672] - this should be removed */
  const handleViewableItemsChanged = useCallback(
    /* istanbul ignore next */ (result: { viewableItems: { item: IMission }[] }) => {
      setViewedMissionList(prev => {
        const newList = Array.from(new Set([...prev, ...result.viewableItems.map(({ item: { uuid } }) => uuid)])).sort();
        return isDeepEqual(newList, prev) ? prev : newList;
      });
    },
    []
  );

  const handleScroll = useCallback(
    ({
      nativeEvent: {
        contentOffset: { y }
      }
    }: NativeSyntheticEvent<NativeScrollEvent>) => {
      setIsScrollNearTop(y > topTolerance);
    },
    [setIsScrollNearTop]
  );

  const handlePressButton = useCallback(
    () => flatListRef.current.scrollToLocation({ animated: true, viewPosition: 1, sectionIndex: 0, itemIndex: 0 }),
    [flatListRef]
  );

  const missionList = useMemo(() => {
    return (missionSearchMap[searchKey] || []).map(uuid => missionMap[uuid]);
  }, [searchKey, missionSearchMap, missionMap]);

  const categoriesSearchResults = useMemo((): any[] => {
    if (!isDefaultSearch) {
      return [];
    }
    const result = [
      ...categoryList.filter(({ name }) => normalizeTextForSearching(name).startsWith(normalizeTextForSearching(searchedText))),
      ...missionList.filter(({ brandName }) => normalizeTextForSearching(brandName).includes(normalizeTextForSearching(searchedText)))
    ];
    return result;
  }, [categoryList, isDefaultSearch, missionList, searchedText]);

  const getSecondaryTitle = useMemo((): string => {
    if (categoryNameList.length) {
      return `${categoryNameList[0]} Offers`;
    }
    if (title) return title;
    const prefix = categoriesSearchResults.length ? 'Other Offers for' : 'Results for';
    return `${prefix} ${`"${searchedText}"`}`;
  }, [categoriesSearchResults.length, categoryNameList, searchedText, title]);

  const isValidSearchText = useMemo(() => {
    return searchText?.length >= 3;
  }, [searchText]);

  const isValidSearchedText = useMemo(() => {
    return searchedText?.length >= 3;
  }, [searchedText]);

  const hideEmptyState = useMemo(() => {
    return isDefaultSearch && !isValidSearchedText;
  }, [isDefaultSearch, isValidSearchedText]);

  // Implicit any to avoid warning on section typing
  const sectionList: any = useMemo(
    () =>
      hideEmptyState
        ? []
        : [
            {
              title: `Results for "${searchedText}"`,
              data: [...categoriesSearchResults]
            },
            {
              title: getSecondaryTitle,
              data: isDefaultSearch
                ? missionList.filter(({ brandName }) => !normalizeTextForSearching(brandName).includes(normalizeTextForSearching(searchedText)))
                : missionList
            }
          ],
    [categoriesSearchResults, getSecondaryTitle, hideEmptyState, isDefaultSearch, missionList, searchedText]
  );

  const isInstanceOfMission = useCallback((object: any): object is IMission => {
    return 'brandName' in object;
  }, []);

  const keyExtractor = useCallback(
    (item: IMission | ICategory) => {
      return isInstanceOfMission(item) ? item.uuid : item.name;
    },
    [isInstanceOfMission]
  );

  const handleMissionPress = useCallback(
    ({ brandName, offerId, brandRequestorId, brandCategories, uuid }: IMission, missionIsAvailableStreakIndicator: boolean) => {
      trackUserEvent(
        TealiumEventType.SELECT_MISSION,
        {
          page_name: getPageNameWithParams(PageNames.EARN.MISSION_SEE_ALL, [missionListType]),
          event_type: brandName,
          event_detail: offerId,
          uxObject: UxObject.LIST,
          brand_name: brandName,
          brand_id: brandRequestorId,
          brand_category: brandCategories[0],
          address: `${ENV.SCHEME}${ROUTES.MISSION_DETAIL}?offerId=${uuid}`
        },
        ForterActionType.TAP
      );

      setStorageRecentSearchHistory({
        id: brandRequestorId,
        name: brandName,
        type: RecentSearchHistoryType.MISSION,
        isAvailableStreakIndicator: missionIsAvailableStreakIndicator
      });

      navigation.navigate(ROUTES.MISSION_DETAIL, { brandRequestorId, isAvailableStreakIndicator: missionIsAvailableStreakIndicator });
    },
    [missionListType, navigation, setStorageRecentSearchHistory, trackUserEvent]
  );

  const handleSubmit = useCallback(() => {
    dispatch(missionActions.flushSearchList(searchKey));
    onSearch(searchKey, missionListType, categoryNameList[0], undefined, ENV.MISSION_LIMIT.FULL, undefined, searchText).then(() => {
      setSearchedText(searchText);
      setIsContentLoaded(true);
    });
  }, [dispatch, searchKey, missionListType, categoryNameList, searchText, onSearch]);

  const getRecentSearchHistory = useMemo(() => {
    if (!isMainSearchFromEarnPage) return;
    return (
      !!recentSearchHistory.length && (
        <View style={[styles.containerSearchHistory, !isBannerOnTop && styles.containerSearchHistoryTop]}>
          <Text style={styles.titleSearchHistory}>Recent Search History</Text>
          {recentSearchHistory.map(({ id, name, type, isAvailableStreakIndicator: recentIsAvailableStreakIndicator }: IRecentSearchHistory) => {
            return (
              <RecentHistoryItem
                title={name}
                category={type !== RecentSearchHistoryType.MISSION}
                onPress={() => handleRecentSearchHistory({ id, name, type, isAvailableStreakIndicator: recentIsAvailableStreakIndicator })}
              />
            );
          })}
        </View>
      )
    );
  }, [handleRecentSearchHistory, isBannerOnTop, isMainSearchFromEarnPage, recentSearchHistory]);

  const BannerComponent = useMemo(() => {
    if (categoryNameList.length && categoryNameList[0] !== GROCERY_AND_DELIVERY_CATEGORY) return;
    return (
      <>
        <View style={styles.itemSeparator} />
        <LocalOfferBanner
          title={'Hungry? Take a look at restaurants near you!'}
          description="Enable your location to search for local offers."
          onPress={() => {
            isLocationAvailable ? handleLocalOfferNavigateMap() : handleLocalOfferNavigateToEarn();
          }}
        />
      </>
    );
  }, [categoryNameList, handleLocalOfferNavigateMap, handleLocalOfferNavigateToEarn, isLocationAvailable]);

  const HeaderComponent = useMemo(
    () => (
      <View style={styles.horizontalMargin}>
        {isBannerOnTop && BannerComponent}
        {getRecentSearchHistory}
      </View>
    ),
    [BannerComponent, getRecentSearchHistory, isBannerOnTop]
  );

  const FooterComponent = useMemo(
    () => (
      <View style={styles.horizontalMargin}>
        {!isBannerOnTop && BannerComponent}
        {(!missionList.length || (isMainSearchFromEarnPage && !isValidSearchedText)) && (
          <View style={styles.itemSeparator}>
            <TopBrandsSection transactionType={TransactionFilter.ALL_TRANSACTIONS} />
          </View>
        )}
        <View style={styles.footerSeparator} />
      </View>
    ),
    [BannerComponent, isBannerOnTop, isMainSearchFromEarnPage, isValidSearchedText, missionList.length]
  );

  const renderItem = useCallback(
    ({ item }: { item: IMission | ICategory }) => {
      return (
        <View style={styles.itemContainer} {...getTestIdProps('mission-item')}>
          {isInstanceOfMission(item) ? (
            <MissionImpressionView
              streakIndicator={isAvailableStreakIndicator(item)}
              hasStreakTag={isAvailableStreakIndicator(item) && isSectionWithStreakTag(getSecondaryTitle, sectionName)}
              missionCardComponent={WideMissionCard}
              fullSize
              mission={item}
              onPress={handleMissionPress}
              wasViewed={viewedMissionList.includes(item.uuid)}
              creativeType={ButtonCreativeType.LIST}
            />
          ) : (
            <View style={styles.categoryItem}>
              <MediumCategoryCard title={item.name} backgroundUrl={item.lifestyleUrl} onPress={() => handleCategoryPress(item.name)} />
            </View>
          )}
        </View>
      );
    },
    [getTestIdProps, handleCategoryPress, handleMissionPress, isInstanceOfMission, viewedMissionList, getSecondaryTitle, sectionName]
  );

  const placeholder = useMemo(() => {
    if (categoryNameList && categoryNameList[0]) return `Search for ${categoryNameList[0]}`;
    if (title === 'Active Missions Offers') return 'Search for Missions';
    if (title) return `Search for ${title}`;
    return 'Search for brands or categories';
  }, [categoryNameList, title]);

  const renderSectionHeader = useCallback(({ section: { title: sectionTitle, data } }) => {
    return data.length && sectionTitle ? (
      <Title style={[styles.sectionHeader, styles.horizontalMargin]} type={TitleType.SECTION}>
        {sectionTitle}
      </Title>
    ) : null;
  }, []);

  const header = useCallback(
    (props: StackHeaderProps) => {
      const category = categoryList.find(categoryToFind => categoryToFind.name === categoryNameList[0]);
      const searchBar = (
        <MissionSearchInput
          value={searchText}
          selectedCategoryNames={categoryNameList}
          placeholder={placeholder}
          onChange={setSearchText}
          variant={category ? MissionSearchInputVariant.LIGHT : MissionSearchInputVariant.DARK}
          disableSubmit
        />
      );
      return category ? (
        <CategoryNavigationHeader backgroundSrc={category.lifestyleUrl} {...props} searchBar={searchBar} />
      ) : (
        <NavigationHeader {...props} searchBar={searchBar} />
      );
    },
    [categoryList, categoryNameList, placeholder, searchText]
  );

  /** @todo istanbul ignore next and react-hooks/exhaustive-deps was added on [LEAP-1948] and [LEAP-3009] */
  /* this should be removed */
  /* istanbul ignore next */
  useLayoutEffect(() => {
    navigation.setOptions({ header });
  }, [header, navigation]);

  useEffect(() => {
    trackUserEvent(
      TealiumEventType.SEARCH,
      {
        page_name: PageNames.MAIN.EARN,
        page_type: PageType.TOP,
        event_type: ROUTES.MISSION_SEE_ALL,
        search_term: searchedText,
        search_results_num: missionList.length.toString(),
        event_detail: searchText,
        event_name: TealiumEventType.SEARCH,
        uxObject: UxObject.SEARCH,
        ...(categoryNameList.length && {
          select_category: categoryNameList[0],
          uxObject: UxObject.LIST,
          event_name: TealiumEventType.SELECT_AFFILIATE_BRAND_CATEGORY,
          event_detail: categoryNameList[0]
        })
      },
      ForterActionType.SEARCH_QUERY
    );
  }, [categoryNameList, missionList.length, searchText, searchedText, trackUserEvent]);

  /** @todo react-hooks/exhaustive-deps was added on [LEAP-3384] */
  /* this should be removed */
  useFocusEffect(
    useCallback(() => {
      if (isContentLoaded) return;
      if (!isDefaultSearch) {
        setIsBannerOnTop(true);
        handleSubmit();
      } else {
        setIsBannerOnTop(false);
        if (isValidSearchText) {
          handleSubmit();
        } else {
          setIsContentLoaded(true);
        }
      }
      if (searchText) setSearchHistory(searchText);
    }, [isContentLoaded, isDefaultSearch, isValidSearchText, missionListType, searchKey]) // eslint-disable-line react-hooks/exhaustive-deps
  );

  /** @todo istanbul ignore next was added on [LEAP-3384] */
  /* istanbul ignore next line */
  useDebounce(
    useCallback(() => {
      if (!isContentLoaded || !isValidSearchText || searchText === searchedText) return;
      if (!isDefaultSearch) {
        navigation.replace(ROUTES.MISSION_SEE_ALL, {
          searchKey: KnownMissionSearchKey.SEE_ALL,
          missionListType: MissionListType.DEFAULT,
          initialSearchCriteria: { search: searchText, categoryNameList: [] },
          title: ''
        });
        return;
      }
      setIsContentLoaded(false);
      handleSubmit();
    }, [handleSubmit, isContentLoaded, isDefaultSearch, isValidSearchText, navigation, searchText, searchedText]),
    1000
  );

  useEffect(() => {
    if (!isFocused) return;
    (async () => {
      if (isMainSearchFromEarnPage) {
        setRecentSearchHistory((await storage.get<IRecentSearchHistory[]>(ENV.STORAGE_KEY.OFFERS_SEARCH_HISTORY)) || []);
      }
    })();
  }, [isFocused, isMainSearchFromEarnPage, storage]);

  const fallback = useCallback(() => <Fallback />, []);

  if (isSearching || !isContentLoaded) {
    return <MissionListSkeleton />;
  }

  return (
    <>
      <ConnectionBanner />
      <View style={styles.container}>
        <>
          <ErrorBoundary fallback={fallback} error={typeof searchError !== 'undefined'}>
            {missionList.length || hideEmptyState ? (
              <SectionList
                style={styles.list}
                contentContainerStyle={styles.listContentContainer}
                {...getTestIdProps('scroll')}
                ref={flatListRef}
                onScroll={handleScroll}
                sections={sectionList}
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}
                keyExtractor={keyExtractor}
                viewabilityConfig={viewabilityConfig}
                onViewableItemsChanged={handleViewableItemsChanged}
                stickySectionHeadersEnabled={false}
                ListHeaderComponent={HeaderComponent}
                ListFooterComponent={FooterComponent}
              />
            ) : (
              <Fallback isEmptyState footer={FooterComponent} />
            )}
          </ErrorBoundary>
          {!isScrollNearTop ? null : (
            <Button
              style={styles.upButtonContainer}
              {...getTestIdProps('scroll-btn')}
              onPress={handlePressButton}
              containerColor={COLOR.WHITE}
              innerContainerStyle={[CONTAINER_STYLE.shadow, { width: 50, height: 50 }]}
            >
              <Icon name={ICON.ARROW_UP} color={COLOR.BLACK} size={FONT_SIZE.HUGE} />
            </Button>
          )}
        </>
      </View>
    </>
  );
};
export default memo(MissionList);
