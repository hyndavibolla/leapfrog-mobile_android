import moment from 'moment';

import { GameModel } from '../models';
import { sortByDate } from './sortByDate';

export const getNextPointsToExpire = (pointsToExpire: GameModel.PointsToExpire[]): GameModel.PointsToExpire => {
  const currentDate = Date.now();
  if (!pointsToExpire?.length) return null;
  return [...pointsToExpire].sort(sortByDate('memberOwnExpiryDate')).reduceRight(
    (points, curr) => {
      const isExpired = !curr.memberOwnExpiryDate || moment(curr.memberOwnExpiryDate).isBefore(moment(currentDate), 'day');
      const expiresBeforePrevious = !points.memberOwnExpiryDate || moment(curr.memberOwnExpiryDate).isBefore(points.memberOwnExpiryDate, 'day');
      const expiresTheSameDayAsPrevious = moment(curr.memberOwnExpiryDate).isSame(points.memberOwnExpiryDate, 'day');
      if (isExpired) return points;
      if (expiresBeforePrevious) return curr;
      /* istanbul ignore else - else is not possible given previous conditions */
      if (expiresTheSameDayAsPrevious) return { ...points, memberOwnPoints: points.memberOwnPoints + curr.memberOwnPoints };
    },
    { memberOwnExpiryDate: null, memberOwnPoints: 0 }
  );
};
