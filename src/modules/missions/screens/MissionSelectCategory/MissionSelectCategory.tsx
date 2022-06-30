import React, { memo, useCallback, useContext, useState } from 'react';
import { View, ScrollView, TouchableHighlight } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { CategoryCard } from '_views/shared/CategoryCard';
import { useTestingHelper } from '_utils/useTestingHelper';
import { styles } from './styles';
import { Text } from '_views/shared/Text';
import { ENV, FONT_FAMILY, ForterActionType, ROUTES, TealiumEventType, UxObject } from '_constants';
import { Button } from '_views/shared/Button/Button';
import { useEventTracker } from '_state_mgmt/core/hooks';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { KnownMissionSearchKey } from '_state_mgmt/mission/state';
import { MissionListType } from '_models/mission';

export interface Props {
  route: {
    params: {
      searchKey?: string;
      placeholder?: string;
      selectedCategoryNames?: string[];
    };
  };
}

const MissionSelectCategory = ({
  route: {
    params: { searchKey, placeholder, selectedCategoryNames = [] }
  }
}: Props) => {
  const { getTestIdProps } = useTestingHelper('mission-select-category');
  const { replace, goBack, dispatch } = useNavigation() as StackNavigationProp<any>;
  const {
    state: {
      mission: { categoryList },
      core: { routeHistory }
    }
  } = useContext(GlobalContext);
  const [selectedNameList, setSelectedNameList] = useState(selectedCategoryNames);
  const { trackUserEvent } = useEventTracker();

  const onToggle = useCallback(
    (categoryName: string) => {
      const isValueOnList = selectedNameList.includes(categoryName);
      if (!isValueOnList) {
        trackUserEvent(
          TealiumEventType.SELECT_AFFILIATE_BRAND_CATEGORY,
          {
            select_category: categoryName,
            event_type: categoryName,
            brand_category: categoryName,
            uxObject: UxObject.LIST
          },
          ForterActionType.TAP
        );
      }

      setSelectedNameList(
        isValueOnList
          ? selectedNameList.filter(category => category !== categoryName)
          : [...selectedNameList, categoryName].slice(selectedNameList.length + 1 - ENV.MISSION_MAX_SELECTED_CATEGORIES)
      );
    },
    [selectedNameList, trackUserEvent]
  );

  const handleSubmit = useCallback(() => {
    if (
      selectedNameList.length === selectedCategoryNames.length &&
      selectedNameList.reduce((isTheSame, current) => isTheSame && selectedCategoryNames.includes(current), true)
    ) {
      goBack();
      return;
    }
    if (routeHistory[1] === ROUTES.MISSION_SEE_ALL) {
      dispatch(
        /* istanbul ignore next */ navigationState => {
          const routes = navigationState.routes.filter(route => route.name !== ROUTES.MISSION_SEE_ALL);
          return CommonActions.reset({
            ...navigationState,
            routes,
            index: routes.length - 1
          });
        }
      );
    }
    replace(ROUTES.MISSION_SEE_ALL, {
      title: placeholder ? placeholder.replace('Search in ', '') : 'Stores or Categories',
      searchKey: searchKey || KnownMissionSearchKey.GENERAL_SEARCH_RESULTS,
      initialSearchCriteria: { categoryNameList: selectedNameList },
      missionListType: MissionListType.DEFAULT
    });
  }, [selectedNameList, goBack, placeholder, replace, searchKey, selectedCategoryNames, routeHistory, dispatch]);

  return (
    <View style={[styles.container]}>
      <View style={styles.headerContainer}>
        <Text font={FONT_FAMILY.BOLD} style={styles.headerTitle}>
          Select a category
        </Text>
        <TouchableHighlight underlayColor="transparent" onPress={() => setSelectedNameList([])} {...getTestIdProps('clear-all')}>
          <Text font={FONT_FAMILY.BOLD} style={styles.clearBtn}>
            Clear
          </Text>
        </TouchableHighlight>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.categoryContainer}>
          {categoryList.map(({ name, imageUrl }) => (
            <View style={styles.categoryItem} key={name}>
              <CategoryCard image={imageUrl} label={name} isSelected={selectedNameList.includes(name)} onPress={() => onToggle(name)} />
            </View>
          ))}
        </View>
      </ScrollView>
      {selectedNameList.length > 0 && (
        <View style={styles.footerContainer}>
          <Button innerContainerStyle={styles.innerButton} textStyle={styles.buttonText} onPress={handleSubmit} {...getTestIdProps('apply')}>
            Apply
          </Button>
        </View>
      )}
    </View>
  );
};

export default memo(MissionSelectCategory);
