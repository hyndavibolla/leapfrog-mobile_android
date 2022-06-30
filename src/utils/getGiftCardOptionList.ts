import { ENV } from '../constants';
import { RewardModel } from '../models';
import { getNumberListFromRange } from './getNumberListFromRange';

export const getGiftCardOptionList = (brand: RewardModel.IBrand, maxOptionListLength = ENV.GIFT_CARD_MAX_OPTIONS_COUNT): number[] => {
  const { minValue, maxValue, variableLoadSupported, denominations } = brand.cardValueConfig;

  const { minimum, maximum } = {
    minimum: minValue / 100,
    maximum: maxValue / 100
  };

  return (
    !variableLoadSupported
      ? (denominations || []).map(denomination => denomination / 100).filter(denomination => denomination >= minimum && denomination <= maximum)
      : getNumberListFromRange({ minimum, maximum, maxOptionCount: maxOptionListLength, multiple: 5 })
  ).filter(Boolean);
};
