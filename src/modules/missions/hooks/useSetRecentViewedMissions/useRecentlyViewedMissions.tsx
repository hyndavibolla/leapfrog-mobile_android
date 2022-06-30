import { useContext } from 'react';

import { GlobalContext } from '_state_mgmt/GlobalState';

export const useRecentlyViewedMissions = (storageKey: string) => {
  const {
    deps: {
      nativeHelperService: { storage }
    }
  } = useContext(GlobalContext);

  const setRecentlyViewedItem = async (item: string) => {
    const recentViewedMissions = (await storage.get<string[]>(storageKey)) || [];
    if (!recentViewedMissions.includes(item)) {
      recentViewedMissions.unshift(item);
      storage.set(storageKey, recentViewedMissions.slice(0, 20));
    }
  };

  return { setRecentlyViewedItem };
};
