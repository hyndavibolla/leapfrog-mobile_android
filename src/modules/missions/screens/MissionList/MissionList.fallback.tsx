import React, { memo } from 'react';
import { View, ScrollView } from 'react-native';
import { Icon } from '_commons/components/atoms/Icon';

import { Text } from '_components/Text';
import { Title, TitleType } from '_components/Title';
import { ICON } from '_constants/icons';
import { COLOR, FONT_SIZE } from '_constants/styles';
import { useTestingHelper } from '_utils/useTestingHelper';
import { styles } from './styles.fallback';

interface FallbackProps {
  isEmptyState?: boolean;
  footer?: React.ReactNode;
}

const Fallback = ({ isEmptyState, footer }: FallbackProps) => {
  const { getTestIdProps } = useTestingHelper('mission-list');

  return (
    <View style={styles.listContainer}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container} {...getTestIdProps(isEmptyState ? 'empty' : 'fallback')}>
          <View style={styles.messageContainer}>
            <Icon
              name={isEmptyState ? ICON.CUSTOM_SEARCH : ICON.CUSTOM_ROCKET}
              size={FONT_SIZE.BIGGER}
              color={isEmptyState ? COLOR.PRIMARY_BLUE : COLOR.RED}
              backgroundStyle={{ backgroundColor: isEmptyState ? COLOR.SOFT_PRIMARY_BLUE : COLOR.SOFT_RED, alignItems: 'flex-end' }}
              innerBackgroundStyle={styles.iconInnerBackground}
            />
            <Title style={styles.title} type={TitleType.HEADER}>
              {isEmptyState ? "Uh-oh. It looks like we can't find what you've entered." : "Uh-oh. We can't load the stores."}
            </Title>
            <Text style={styles.text}>
              {isEmptyState ? 'Try searching again.' : 'Please try again later. In the meantime, please explore the MAX catalog.'}
            </Text>
          </View>
        </View>
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </ScrollView>
    </View>
  );
};

export default memo(Fallback);
