import React, { memo, useState, useCallback, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Button } from '_components/Button';
import { SearchFilterItem } from '_commons/components/molecules/SearchFilterItem';

import { formatPrettyTitle } from '_utils/formatPrettyTitle';
import { useTestingHelper } from '_utils/useTestingHelper';

import { styles } from './styles';
import { ForterActionType, PageNames, PageType, TealiumEventType, UxObject } from '_constants/eventTracking';
import { useEventTracker } from '_state_mgmt/core/hooks';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { ROUTES } from '_constants/routes';
import { useSetRecentSearchItem } from '_utils/useSetRecentSearchItem';
import { ENV } from '_constants/env';
import { IRecentSearchHistory, RecentSearchHistoryType } from '_models/searchHistory';

interface RouteParams {
  params: {
    categories: string[];
  };
}

export interface Props {
  route: RouteParams;
  navigation: StackNavigationProp<any>;
}

export const GiftCardFilter = ({
  navigation,
  route: {
    params: { categories }
  }
}: Props) => {
  const { getTestIdProps } = useTestingHelper('filter');
  const setRecentHistoryItem = useSetRecentSearchItem(ENV.STORAGE_KEY.GIFT_CARDS_SEARCH_HISTORY);
  const { state } = useContext(GlobalContext);
  const { trackUserEvent } = useEventTracker();
  const maxSelectedCategories = 1;
  const [innerCategorySelectionList, setInnerCategorySelectionList] = useState<string[]>([]);

  const onCategoryToggle = useCallback(
    (categoryId: string) =>
      setInnerCategorySelectionList(innerList => {
        if (innerList.includes(categoryId)) {
          return innerList.filter(c => c !== categoryId);
        } else {
          trackUserEvent(
            TealiumEventType.SELECT_GIFT_CARD_CATEGORY,
            {
              page_name: PageNames.REWARDS.REWARDS_CATEGORY,
              page_type: PageType.SELECTION,
              select_category: categoryId,
              event_type: categoryId,
              event_detail: categoryId,
              brand_category: categoryId,
              uxObject: UxObject.LIST
            },
            ForterActionType.TAP
          );
          return [...innerList, categoryId].slice(innerList.length + 1 - Math.min(maxSelectedCategories, innerList.length + 1));
        }
      }),
    [maxSelectedCategories, trackUserEvent]
  );

  const onClearAll = useCallback(() => {
    setInnerCategorySelectionList([]);
  }, []);

  const handleSubmit = useCallback(() => {
    const navigate = state.core.routeHistory[1] === ROUTES.REWARDS_LIST_BY_CATEGORY ? navigation.navigate : navigation.replace;
    const currentCategory = innerCategorySelectionList[0];
    if (currentCategory) {
      const historyItem: IRecentSearchHistory = { id: currentCategory, name: formatPrettyTitle(currentCategory), type: RecentSearchHistoryType.CATEGORY };
      setRecentHistoryItem(historyItem);
    }
    navigate(ROUTES.REWARDS_LIST_BY_CATEGORY, { searchCategoryIdList: innerCategorySelectionList });
  }, [navigation, state.core, innerCategorySelectionList, setRecentHistoryItem]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Select a category</Text>
        <TouchableOpacity onPress={onClearAll} {...getTestIdProps('clear')}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
          {categories.map(categoryId => {
            const isSelected = innerCategorySelectionList.includes(categoryId);
            return (
              <SearchFilterItem
                key={categoryId}
                isSelected={isSelected}
                onPress={() => onCategoryToggle(categoryId)}
                identifier={categoryId}
                title={formatPrettyTitle(categoryId)}
              />
            );
          })}
        </ScrollView>

        <View style={styles.footerContainer}>
          <Button innerContainerStyle={styles.innerButton} textStyle={styles.buttonText} onPress={handleSubmit} {...getTestIdProps('apply')}>
            Apply
          </Button>
        </View>
      </View>
    </View>
  );
};

export default memo(GiftCardFilter);
