import { useContext } from 'react';

import { IRecentSearchHistory } from '_models/searchHistory';
import { GlobalContext } from '_state_mgmt/GlobalState';

export const useSetRecentSearchItem = (storageKey: string) => {
  const {
    deps: {
      nativeHelperService: { storage }
    }
  } = useContext(GlobalContext);

  const insertNewSearchItem = async (searchHistoryItem: IRecentSearchHistory) => {
    const newRecentSearchHistory = [searchHistoryItem, ...((await storage.get<IRecentSearchHistory[]>(storageKey)) || [])]
      .reduce((nonRepeatedSearchHistory, nextSearchHistoryItem, index, recentSearchHistory) => {
        if (recentSearchHistory.findIndex(({ id }) => id === nextSearchHistoryItem.id) === index) {
          nonRepeatedSearchHistory.push(nextSearchHistoryItem);
        }
        return nonRepeatedSearchHistory;
      }, [])
      .slice(0, 5);

    storage.set(storageKey, newRecentSearchHistory);
  };

  return insertNewSearchItem;
};
