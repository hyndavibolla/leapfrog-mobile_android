import React from 'react';
import { InStoreOfferDetailFooter } from '../../src/views/InStoreOfferDetail/InStoreOfferDetailFooter';
import { View } from 'react-native';
import { css } from '@emotion/native';

const styles = {
  container: css`
    margin-top: 50px;
  `
};

export default function InStoreOfferDetailFooterStory() {
  return (
    <View style={styles.container}>
      <InStoreOfferDetailFooter onActivateRequested={() => {}} rewardText="4 per $1" isActive={false} disabled={false} />
    </View>
  );
}
