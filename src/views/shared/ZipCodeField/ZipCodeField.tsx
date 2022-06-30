import React, { memo, useState, useCallback, useMemo, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';

import { Button } from '../Button';

import { COLOR, ENV, FONT_SIZE, ICON } from '_constants';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { actions } from '_state_mgmt/user/actions';

import { useGeocodeAddress } from '_utils/useGeocodeAddress';
import { useTestingHelper } from '_utils/useTestingHelper';
import PathIcon from '_assets/shared/path.svg';
import { IUser } from '_models/user';

import { styles, TextInputStyled } from './styles';
import { Icon } from '_commons/components/atoms/Icon';

export interface Props {
  onEditing: (value: boolean) => void;
}

export enum ZipCodeStatusMessage {
  EMPTY = 'This space cannot be empty',
  INVALID = 'Invalid Zip Code',
  MAX_LENGTH = 'Enter your 5-digit Zip Code',
  ONLY_NUMBERS = 'Please, enter only numbers',
  SAVING = 'Saving your Zip Code...',
  VALID = 'Enter a 5-digit Zip Code'
}

export const ZipCodeField = ({ onEditing }: Props) => {
  const { getTestIdProps } = useTestingHelper('zip-code');

  const {
    deps,
    state: {
      user: { currentUser }
    },
    dispatch
  } = useContext(GlobalContext);

  const {
    personal: {
      currentLocation: { zip: userCurrentZipCode }
    }
  } = currentUser;

  const [onLoadGeocodeAddress, isLoadingGeocodeAddress = false] = useGeocodeAddress();
  const [isZipCodeSaved, setIsZipCodeSaved] = useState<boolean>(false);
  const [zipCodeValue, setZipCodeValue] = useState<string>('');
  const [message, setMessage] = useState<string>(ZipCodeStatusMessage.VALID);
  const [isZipCodeValid, setIsValidZipCode] = useState<boolean>(false);
  const [isAddZipCodeButtonVisible, setIsAddZipCodeButtonVisible] = useState<boolean>(true);

  const onChangeZipCode = useCallback((value: string) => {
    let isValid = false;
    setZipCodeValue(value);
    if (!value.length) {
      setMessage(ZipCodeStatusMessage.EMPTY);
    } else if (!/^\d+$/.test(value)) {
      setMessage(ZipCodeStatusMessage.ONLY_NUMBERS);
    } else if (value.length !== 5) {
      setMessage(ZipCodeStatusMessage.MAX_LENGTH);
    } else {
      isValid = true;
      setMessage(ZipCodeStatusMessage.VALID);
    }
    setIsValidZipCode(isValid);
  }, []);

  const isAndroid = useMemo(() => deps.nativeHelperService.platform.OS === 'android', [deps.nativeHelperService.platform.OS]);

  const callGeocodeAddress = useCallback(
    async (zipCode: string) => {
      const resGeocodeAddress = await onLoadGeocodeAddress(zipCode);
      if (resGeocodeAddress.length) {
        const [
          {
            geometry: {
              location: { lat: latitude, lng: longitude }
            }
          }
        ] = resGeocodeAddress;
        setIsZipCodeSaved(true);

        const newCurrentUser = { ...currentUser };
        const newCurrentLocation = { zip: zipCodeValue, latitude, longitude };

        deps.nativeHelperService.storage.set(ENV.STORAGE_KEY.CURRENT_LOCATION, newCurrentLocation);
        newCurrentUser.personal.currentLocation = newCurrentLocation;
        setTimeout(() => {
          dispatch(actions.setCurrentUser(newCurrentUser));
          onEditing(false);
        }, 2000);
      } else {
        setIsValidZipCode(false);
        setZipCodeValue('');
        setMessage(ZipCodeStatusMessage.INVALID);
      }
    },
    [currentUser, dispatch, onLoadGeocodeAddress, onEditing, zipCodeValue, deps]
  );

  useEffect(() => {
    const loadCurrentLocation = async () => {
      const storedLocation = await deps.nativeHelperService.storage.get<IUser['personal']['currentLocation']>(ENV.STORAGE_KEY.CURRENT_LOCATION);
      const hasFullCurrentLocation =
        currentUser.personal.currentLocation.zip && currentUser.personal.currentLocation.latitude && currentUser.personal.currentLocation.longitude;

      if (storedLocation && !hasFullCurrentLocation) {
        const newCurrentUser = { ...currentUser };
        newCurrentUser.personal.currentLocation = storedLocation;
        dispatch(actions.setCurrentUser(newCurrentUser));
      }
    };
    loadCurrentLocation();
  }, [currentUser, deps.nativeHelperService.storage, dispatch]);

  if (isAddZipCodeButtonVisible && !userCurrentZipCode) {
    return (
      <>
        <TouchableOpacity onPress={() => setIsAddZipCodeButtonVisible(false)} {...getTestIdProps('button-add-zip-code')}>
          <View style={styles.button}>
            <PathIcon />
            <Text style={styles.buttonText} {...getTestIdProps('button-text')}>
              Add your Zip Code
            </Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.subTitle} {...getTestIdProps('text-message')}>
          To unlock offers, complete this step.
        </Text>
      </>
    );
  }

  return isZipCodeSaved ? (
    <View style={styles.toast} {...getTestIdProps('toast')}>
      <Text style={styles.toastText}>Zip Code saved!</Text>
    </View>
  ) : (
    <>
      <View style={styles.inputIconContainer} {...getTestIdProps('container')}>
        <TextInputStyled
          value={zipCodeValue}
          onChangeText={onChangeZipCode}
          placeholder="00000"
          isInvalid={!isZipCodeValid && message !== ZipCodeStatusMessage.VALID}
          {...getTestIdProps('field')}
        />

        {isLoadingGeocodeAddress ? (
          <View {...getTestIdProps('lottie')} style={styles.lottieContainer}>
            <LottieView style={styles.lottieIcon} loop autoPlay source={require('../../../assets/spinner/spinner-loader.json')} />
          </View>
        ) : (
          <View style={styles.inputIcon}>
            <Button
              compatibilityMode={isAndroid}
              onPress={() => (isZipCodeValid ? callGeocodeAddress(zipCodeValue) : null)}
              containerColor="#FFF"
              innerContainerStyle={styles.inputIconSmallContainer}
              {...getTestIdProps('arrow-right-icon')}
            >
              <Icon name={ICON.ARROW_RIGHT} color={isZipCodeValid ? COLOR.PRIMARY_BLUE : COLOR.DARK_GRAY} size={FONT_SIZE.BIG} />
            </Button>
          </View>
        )}
      </View>
      {isLoadingGeocodeAddress ? (
        <Text style={[styles.subTitle, styles.blueSubTitle]} {...getTestIdProps('text-loading')}>
          {ZipCodeStatusMessage.SAVING}
        </Text>
      ) : (
        <Text style={[styles.subTitle, !isZipCodeValid && message !== ZipCodeStatusMessage.VALID && styles.subTitleError]} {...getTestIdProps('text-message')}>
          {message}
        </Text>
      )}
    </>
  );
};

export default memo(ZipCodeField);
