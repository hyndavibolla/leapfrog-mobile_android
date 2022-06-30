import React, { useCallback, useEffect, useContext, forwardRef, MutableRefObject } from 'react';
import { View, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { SearchInput } from '_components/SearchInput';
import { COLOR, ENV, ICON, ROUTES } from '_constants';
import { MissionModel } from '_models';
import { MissionListType } from '_models/mission';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { useGetMissionCategoryList, useGetMissionKeywordList } from '_state_mgmt/mission/hooks';
import { KnownMissionSearchKey } from '_state_mgmt/mission/state';
import { useTestingHelper } from '_utils/useTestingHelper';
import { Icon } from '_commons/components/atoms/Icon';

export interface ISearchCriteria {
  search: string;
  categoryNameList: string[];
}

export enum HistoryItem {
  HISTORY = 'history'
}

export enum MissionSearchInputVariant {
  LIGHT,
  DARK
}

export type SearchItem = HistoryItem | MissionModel.KeywordType;

export interface Props {
  value?: string;
  selectedCategoryNames?: string[];
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  hideFilters?: boolean;
  onFocusChange?: (isFocused: boolean) => void;
  searchKey?: string;
  disableSubmit?: boolean;
  variant?: MissionSearchInputVariant;
}

export const buildMissionSearchCriteria = (searchCriteria: ISearchCriteria, categoryNameList: string[]): ISearchCriteria => {
  const typedCategory = searchCriteria.search && categoryNameList.find(c => searchCriteria.search.trim().toLowerCase() === c.trim().toLowerCase());
  const newCategoryNameList = Array.from(new Set([...searchCriteria.categoryNameList, typedCategory]));
  return typedCategory
    ? { search: '', categoryNameList: newCategoryNameList.slice(newCategoryNameList.length - ENV.MISSION_MAX_SELECTED_CATEGORIES) }
    : searchCriteria;
};

const minCharsToSubmit = 2;

export const MissionSearchInput = (
  {
    value,
    selectedCategoryNames = [],
    onChange,
    placeholder,
    disabled,
    hideFilters,
    onFocusChange,
    searchKey,
    disableSubmit,
    variant = MissionSearchInputVariant.DARK
  }: Props,
  ref: ((instance: TextInput) => void) | MutableRefObject<TextInput>
) => {
  const { getTestIdProps } = useTestingHelper('mission-search-input');
  const [onLoadCategories] = useGetMissionCategoryList();
  const [onLoadKeywords] = useGetMissionKeywordList();
  const { state } = useContext(GlobalContext);
  const { push } = useNavigation() as StackNavigationProp<any>;
  const { categoryList } = state.mission;

  const onSearchChange = useCallback((search: string) => onChange && onChange(search), [onChange]);

  const onSubmit = useCallback(async () => {
    if (disableSubmit || !value || value.length <= minCharsToSubmit) return;
    push(ROUTES.MISSION_SEE_ALL, {
      title: placeholder ? placeholder.replace('Search in ', '') : 'Stores or Categories',
      searchKey: searchKey || KnownMissionSearchKey.GENERAL_SEARCH_RESULTS,
      initialSearchCriteria: buildMissionSearchCriteria(
        { search: value, categoryNameList: selectedCategoryNames },
        categoryList.map(c => c.name)
      ),
      missionListType: MissionListType.DEFAULT
    });
  }, [categoryList, disableSubmit, push, searchKey, value, placeholder, selectedCategoryNames]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  useEffect(() => {
    onLoadCategories();
    onLoadKeywords();
  }, [onLoadCategories, onLoadKeywords]);

  const textColor = variant === MissionSearchInputVariant.LIGHT ? COLOR.DARK_GRAY : COLOR.WHITE;

  return (
    <View {...getTestIdProps('container')}>
      <SearchInput
        ref={ref}
        placeholder={placeholder || 'Search for brands or categories'}
        placeholderTextColor={textColor}
        onChange={onSearchChange}
        value={value}
        onSubmit={onSubmit}
        disabled={disabled}
        onFilterPress={() => push(ROUTES.MISSION_SELECT_CATEGORY, { searchKey, placeholder })}
        filtersActive={selectedCategoryNames.length}
        hideFilters={hideFilters}
        searchInputStyle={{ color: textColor }}
        onFocusChange={onFocusChange}
        Icon={<Icon name={ICON.SEARCH} color={textColor} />}
        backgroundColor={variant === MissionSearchInputVariant.LIGHT ? COLOR.WHITE : COLOR.BLUE_NAVIGATION}
      />
    </View>
  );
};

export default forwardRef<TextInput, Props>(MissionSearchInput);
