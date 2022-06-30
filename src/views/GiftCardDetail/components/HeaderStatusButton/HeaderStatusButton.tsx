import React from 'react';
import { Pressable } from 'react-native';

import { Icon } from '_commons/components/atoms/Icon';
import { COLOR, FONT_SIZE, ICON } from '_constants';
import { statusType } from '_models/giftCard';
import { useTestingHelper } from '_utils/useTestingHelper';

export type Props = {
  status: statusType;
  onPress: () => void;
};

const HeaderStatusButton = ({ status, onPress }: Props) => {
  const { getTestIdProps } = useTestingHelper('header-status-button');

  return (
    <Pressable onPress={onPress} {...getTestIdProps('pressable')}>
      <Icon
        name={status === statusType.ACTIVE ? ICON.FOLDER_ARROW_DOWN : ICON.FOLDER_ARROW_UP}
        size={FONT_SIZE.SMALL}
        color={COLOR.BLACK}
        {...getTestIdProps('icon')}
      />
    </Pressable>
  );
};

export default HeaderStatusButton;
