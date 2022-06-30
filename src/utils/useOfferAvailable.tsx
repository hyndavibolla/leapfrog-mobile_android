import moment from 'moment';

import { useContext } from 'react';
import { OfferModel } from '../models';
import { GlobalContext } from '../state-mgmt/GlobalState';
import { Type } from '../models/activity';

export const useOfferAvailable = (activityType: string, offer: OfferModel.IOffer): boolean => {
  const { deps } = useContext(GlobalContext);
  if (!offer?.pointStartDate) return true;

  const now = moment(Date.now());
  const date = moment(offer?.pointStartDate);

  if (activityType === Type.EXPIRY && date.isAfter(now)) deps.logger.warn('Offer is in the future', { offer, activityType });
  return date.isSameOrBefore(now);
};
