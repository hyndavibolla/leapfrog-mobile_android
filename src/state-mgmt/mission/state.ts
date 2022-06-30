import { MissionModel } from '_models';

export enum ExtraKnownMissionSearchKey {
  SEE_ALL = 'see-all',
  GENERAL_SEARCH_RESULTS = 'general-search-results',
  STREAK_BRANDS = 'streak-brands'
}

export const KnownMissionSearchKey = { ...ExtraKnownMissionSearchKey, ...MissionModel.MissionListType };

export interface IMissionState {
  buttonUserId: string;
  isButtonInit: boolean;
  missionMap: { [uuid: string]: MissionModel.IMission };
  missionSearchMap: Record<string, string[]>;
  missionListTitleMap: Record<string, string>;
  categoryList: MissionModel.ICategory[];
  keywordMap: Record<MissionModel.KeywordType, string[]>;
  recentlyViewedMissions: MissionModel.IMission[];
}

export const initialState: IMissionState = {
  buttonUserId: null,
  isButtonInit: false,
  missionMap: {},
  missionSearchMap: Object.values(KnownMissionSearchKey).reduce((total, key) => ({ ...total, [key]: [] }), {} as Record<string, string[]>),
  missionListTitleMap: Object.values(KnownMissionSearchKey).reduce((total, key) => ({ ...total, [key]: '' }), {} as Record<string, string>),
  categoryList: [],
  keywordMap: Object.values(MissionModel.KeywordType).reduce((total, key) => ({ ...total, [key]: [] }), {} as any),
  recentlyViewedMissions: []
};
