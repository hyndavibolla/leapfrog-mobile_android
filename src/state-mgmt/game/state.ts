import { GameModel } from '../../models';

export interface IGameState {
  current: GameModel.IGame;
  historical: { totalLifetimeEarnedPoints: number; pointByMonthMap: { [month: string]: number } };
}

export const initialState: IGameState = {
  current: {
    balance: {
      availablePoints: 0,
      pendingPoints: 0,
      memberOwnPointsToExpire: []
    },
    memberships: {
      userHasSywCard: false,
      userIsSywMaxMember: false,
      userIsAllowedToUseSywMax: true,
      sywCardLastFour: '1234'
    },
    missions: {
      pointsPerCent: 0
    },
    lastUpdatedAt: 0
  },
  historical: {
    totalLifetimeEarnedPoints: 0,
    pointByMonthMap: {}
  }
};
