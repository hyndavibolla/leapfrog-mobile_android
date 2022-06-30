import React from 'react';
import { Alert, View, Text, FlatList } from 'react-native';

import { SmallGiftCard, Orientation } from '../../src/views/shared/SmallGiftCard';

import { styles } from '../styles';
import { RenderGlobalContextWrapped } from './RenderGlobalContextWrapped';

export const OverviewStory = () => {
  const giftList = [
    {
      image: 'https://i0.pngocean.com/files/298/294/566/tilta-logo-brand-product-font-apple-music-logo.jpg',
      title: 'iTunes'
    },
    {
      image: 'https://i0.pngocean.com/files/298/294/566/tilta-logo-brand-product-font-apple-music-logo.jpg',
      title: "Sportsman's Warehouse"
    },
    {
      image: 'https://i0.pngocean.com/files/298/294/566/tilta-logo-brand-product-font-apple-music-logo.jpg',
      title: 'This is a very very large brand'
    }
  ];

  const onPress = () => Alert.alert('Event detected', 'Gift card pressed');

  return (
    <RenderGlobalContextWrapped>
      <View style={styles.subcontainer}>
        <Text style={styles.title}>Small Gift Card</Text>
        <Text style={styles.text}>This component is used to render a small gift card.</Text>
        <View style={styles.division} />
        <Text style={styles.subtitle}>Horizontal</Text>
        <View style={styles.componentContainer}>
          <FlatList
            data={giftList}
            renderItem={({ item: gift }) => (
              <View style={{ margin: 10 }}>
                <SmallGiftCard onPress={onPress} image={gift.image} title={gift.title} />
              </View>
            )}
            horizontal={true}
          />
        </View>
        <View style={styles.division} />
        <Text style={styles.subtitle}>Vertical</Text>
        <View style={styles.componentContainer}>
          <FlatList
            data={giftList}
            renderItem={({ item: gift }) => (
              <View style={{ margin: 10 }}>
                <SmallGiftCard onPress={onPress} image={gift.image} title={gift.title} orientation={Orientation.VERTICAL} />
              </View>
            )}
            horizontal={true}
          />
        </View>
      </View>
    </RenderGlobalContextWrapped>
  );
};
