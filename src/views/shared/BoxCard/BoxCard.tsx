import React, { memo, useCallback, useContext, useState } from 'react';
import { View, Text } from 'react-native';

import { GlobalContext } from '_state_mgmt/GlobalState';
import { useTestingHelper } from '_utils/useTestingHelper';
import { Icon } from '_commons/components/atoms/Icon';
import { ICON, FONT_SIZE, COLOR } from '_constants';
import { styles } from './styles';

export interface Props {
  title: string;
  value: string;
  showCopy?: boolean;
  showCheckOnCopy?: boolean;
}

export const BoxCard = ({ title, value, showCopy = false, showCheckOnCopy = false }: Props) => {
  const {
    deps: {
      nativeHelperService: {
        clipboard: { setString }
      }
    }
  } = useContext(GlobalContext);
  const { getTestIdProps } = useTestingHelper('box-card');
  const copyToClipboard = useCallback(
    (valueToCopy: string) => {
      setString(valueToCopy);
      setCopied(true);
    },
    [setString]
  );
  const [copied, setCopied] = useState<boolean>(false);

  return (
    <View style={styles.itemBoxCard}>
      <Text style={styles.itemBoxCardTitle}>{title}</Text>
      <View style={styles.itemBoxCardContent}>
        <Text numberOfLines={1} style={styles.itemBoxCardValue}>
          {value}
        </Text>
        <View style={styles.itemBoxCopyContent}>
          {showCheckOnCopy && copied && (
            <View {...getTestIdProps('copied')} style={styles.itemBoxCopied}>
              <Icon name={ICON.TICK} size={FONT_SIZE.SMALLER} color={COLOR.GREEN} />
            </View>
          )}
          {showCopy && (!copied || !showCheckOnCopy) && (
            <Text {...getTestIdProps('copy')} onPress={() => copyToClipboard(value)} style={styles.itemBoxCopy}>
              Copy
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default memo(BoxCard);
