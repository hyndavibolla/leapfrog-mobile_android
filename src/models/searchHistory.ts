export enum RecentSearchHistoryType {
  REWARD = 'reward',
  MISSION = 'mission',
  CATEGORY = 'category '
}

export interface IRecentSearchHistory {
  id: string;
  name: string;
  type: RecentSearchHistoryType;
}
