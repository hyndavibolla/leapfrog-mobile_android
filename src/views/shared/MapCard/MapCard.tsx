import React, { memo, useMemo, useContext, useCallback, useState } from 'react';
import { ImageBackground, Text, TouchableHighlight, View } from 'react-native';

import PathIcon from '_assets/shared/path.svg';
import { Title, TitleType } from '_components/Title';
import { ZipCodeField } from '_components/ZipCodeField';
import { GlobalContext } from '_state_mgmt/GlobalState';

import { useTestingHelper } from '_utils/useTestingHelper';
import { styles } from './styles';

export interface Props {
  isLocationEnabled: boolean;
  isLocationPermissionBlocked: boolean;
  onPressEnabledButton: () => void;
  onPressExploreButton: () => void;
}

export const MapCard = ({ isLocationEnabled, isLocationPermissionBlocked, onPressEnabledButton, onPressExploreButton }: Props) => {
  const { getTestIdProps } = useTestingHelper('map-card');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const {
    state: {
      user: { currentUser }
    }
  } = useContext(GlobalContext);

  const {
    personal: {
      currentLocation: { zip: userCurrentZipCode }
    }
  } = currentUser;

  const editZipCode = useCallback(() => {
    setIsEditing(value => !value);
  }, []);

  const image = useMemo(
    () => (isLocationEnabled ? require('../../../assets/shared/exploreOnTheMap.png') : require('../../../assets/shared/enabledLocationMap.png')),
    [isLocationEnabled]
  );

  return (
    <View {...getTestIdProps('container')}>
      <Title style={styles.title} type={TitleType.SECTION} numberOfLines={1} ellipsizeMode="tail">
        {isLocationEnabled ? 'Get MAX points for every meal, every day' : 'Hungry? Find offers nearby now!'}
      </Title>
      <Text style={styles.subtitle}>
        {isLocationEnabled
          ? 'Eat at thousands of local restaurants, cafes, and bars — and earn MAX points on every purchase.'
          : 'To see offers at local restaurants near you, enable location services and link your card. Eat and earn points!'}
      </Text>
      <View style={styles.cardContainer}>
        <ImageBackground imageStyle={{ borderRadius: 6 }} style={styles.image} source={image}>
          {(isLocationPermissionBlocked && !userCurrentZipCode) || isEditing ? (
            <ZipCodeField onEditing={setIsEditing} />
          ) : (
            <TouchableHighlight
              onPress={isLocationEnabled || userCurrentZipCode ? onPressExploreButton : onPressEnabledButton}
              underlayColor="transparent"
              {...getTestIdProps('button')}
            >
              <View style={styles.button}>
                <PathIcon />
                <Text style={styles.buttonText} {...getTestIdProps('button-text')}>
                  {isLocationEnabled || userCurrentZipCode ? 'Find places near you' : 'Enable Location'}
                </Text>
              </View>
            </TouchableHighlight>
          )}
        </ImageBackground>
      </View>

      {userCurrentZipCode ? (
        <Text style={styles.buttonEditZipCode} onPress={editZipCode} {...getTestIdProps('button-edit-zip-code')}>
          Edit Zip Code
        </Text>
      ) : null}
    </View>
  );
};

export default memo(MapCard);
