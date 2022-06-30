import React, { ComponentProps, memo, useCallback, useState } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

import { Input } from '../Input';
import { useTestingHelper } from '../../../utils/useTestingHelper';

export interface Props
  extends Pick<
    ComponentProps<typeof DateTimePickerModal>,
    Exclude<keyof ComponentProps<typeof DateTimePickerModal>, 'onConfirm' | 'onCancel' | 'isVisible' | 'mode'>
  > {
  isInvalid?: boolean;
  onChangeDate: (date: Date) => void;
}

export default memo(({ isInvalid, date, onChangeDate, ...props }: Props) => {
  const { getTestIdProps } = useTestingHelper('date-picker');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = useCallback(() => setDatePickerVisibility(true), []);
  const hideDatePicker = useCallback(() => setDatePickerVisibility(false), []);
  const onConfirm = useCallback(
    (d: Date) => {
      onChangeDate(d);
      hideDatePicker();
    },
    [onChangeDate, hideDatePicker]
  );
  const formattedDate = date ? moment(date).format('MMM Do, YYYY') : '';

  return (
    <>
      <Input value={formattedDate} onPressIn={showDatePicker} isInvalid={isInvalid} showSoftInputOnFocus={false} {...getTestIdProps('input')} />
      <DateTimePickerModal {...props} isVisible={isDatePickerVisible} mode="date" onConfirm={onConfirm} onCancel={hideDatePicker} />
    </>
  );
});
