import React, { memo, useMemo, useCallback } from 'react';
import { Text, View } from 'react-native';
import moment from 'moment';

import { COLOR, FONT_SIZE, ICON } from '_constants';
import { useTestingHelper } from '_utils/useTestingHelper';
import CloseCircleIcon from '_assets/shared/closeCircleIcon.svg';
import { ICardLinkOfferCalendarBenefits } from '_models/cardLink';
import { Icon } from '_commons/components/atoms/Icon';

import styles from './styles';

const numberDays = 7;

export interface Props {
  offerBenefits: ICardLinkOfferCalendarBenefits[];
}

export const InStoreOfferCalendar = ({ offerBenefits }: Props) => {
  const { getTestIdProps } = useTestingHelper('in-store-offer-calendar');
  const calendarDays = useCallback((format: string) => [...Array(numberDays)].map((_, index) => moment().add(index, 'days').format(format)), []);
  const availableDays = useMemo(
    () =>
      [...Array(numberDays)].map((_, index) =>
        offerBenefits.find(({ monthDay, available }) => moment().add(index, 'days').startOf('day').isSame(moment(monthDay).startOf('day')) && available)
      ),
    [offerBenefits]
  );

  return (
    <View {...getTestIdProps('container')} style={styles.container}>
      <Icon name={ICON.CALENDAR_LIGHT} color={COLOR.DARK_GRAY} size={FONT_SIZE.REGULAR} />
      <View style={styles.rightCalendarContainer}>
        <Text style={styles.calendarLabel}>Redemption calendar</Text>
        <View style={styles.calendar}>
          <View style={styles.rowContainer}>
            {calendarDays('dd').map((day, index) => (
              <View key={day + index} style={styles.itemCalendar}>
                <Text style={styles.dayLabel}>{day}</Text>
              </View>
            ))}
          </View>
          <View style={styles.rowContainer}>
            {calendarDays('DD').map(day => (
              <View key={day} style={styles.itemCalendar}>
                <Text style={styles.dayLabel}>{day}</Text>
              </View>
            ))}
          </View>
          <View style={styles.rowContainer}>
            {availableDays.map((isOpen, index) => (
              <View key={index} style={styles.itemCalendar}>
                {isOpen ? <Icon name={ICON.TICK_CIRCLE} size={FONT_SIZE.REGULAR} /> : <CloseCircleIcon width={20} height={20} />}
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default memo(InStoreOfferCalendar);
