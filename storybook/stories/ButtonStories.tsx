import React from 'react';
import { Alert, View } from 'react-native';
import { boolean } from '@storybook/addon-knobs';

import { Text } from '_views/shared/Text';
import { Button } from '_views/shared/Button';
import { COLOR, CONTAINER_STYLE, FONT_SIZE, ICON } from '_constants';
import ClaimIcon from '_assets/button/claimIcon.svg';
import CloseBlack from '_assets/button/closeBlack.svg';
import CloseWhite from '_assets/button/closeWhite.svg';
import { Icon } from '_commons/components/atoms/Icon';
import { BackButton } from '_commons/components/molecules/Backbutton/BackButton';

import { styles } from '../styles';

const onPress = () => Alert.alert('Alert', 'Button clicked! ');

export const BasicStory = () => (
  <View style={styles.subcontainer}>
    <Text style={styles.title}>Basic</Text>
    <View style={styles.componentContainer}>
      <Button disabled={boolean('Disabled', false)} onPress={onPress}>
        BASIC Button
      </Button>
    </View>
  </View>
);

export const OptionStory = () => (
  <View style={styles.subcontainer}>
    <Text style={styles.title}>Option</Text>
    <View style={styles.componentContainer}>
      <Button disabled={boolean('Disabled', false)} onPress={onPress} textColor={COLOR.BLACK} containerColor={COLOR.GRAY}>
        OPTION Button
      </Button>
    </View>
  </View>
);

export const BuyStory = () => (
  <View style={styles.subcontainer}>
    <Text style={styles.title}>Buy</Text>
    <View style={styles.componentContainer}>
      <Button
        disabled={boolean('Disabled', false)}
        onPress={onPress}
        textColor={COLOR.WHITE}
        containerColor={COLOR.GREEN}
        innerContainerStyle={{ paddingLeft: 25, paddingRight: 25 }}
      >
        {['BUY Button', () => <Icon name={ICON.ARROW_RIGHT} color={COLOR.WHITE} />]}
      </Button>
    </View>
  </View>
);

export const CloseIconStory = () => (
  <View style={styles.subcontainer}>
    <Text style={styles.title}>Close Icon</Text>
    <Text style={styles.title}>You can change the background color of the button and the color of the svg.</Text>
    <View style={[styles.componentContainer, styles.dark]}>
      <Button
        disabled={boolean('Disabled', false)}
        onPress={onPress}
        containerColor={COLOR.WHITE}
        innerContainerStyle={[CONTAINER_STYLE.shadow, { width: 30, height: 30 }]}
      >
        <View style={styles.closeIconContainer}>
          <Icon name={ICON.CLOSE} color={COLOR.BLACK} size={FONT_SIZE.MEDIUM} />
        </View>
      </Button>
    </View>
  </View>
);

export const CloseLightStory = () => (
  <View style={styles.subcontainer}>
    <Text style={styles.title}>Close Light</Text>
    <View style={[styles.componentContainer, styles.dark]}>
      <Button disabled={boolean('Disabled', false)} onPress={onPress} textColor={COLOR.BLACK} containerColor={COLOR.WHITE}>
        {['CLOSE_LIGHT Button', () => <CloseBlack />]}
      </Button>
    </View>
  </View>
);

export const CloseDarkStory = () => (
  <View style={styles.subcontainer}>
    <Text style={styles.title}>Close Dark</Text>
    <View style={styles.componentContainer}>
      <Button disabled={boolean('Disabled', false)} onPress={onPress} textColor={COLOR.WHITE} containerColor={COLOR.BLACK}>
        {['CLOSE_DARK Button', () => <CloseWhite />]}
      </Button>
    </View>
  </View>
);

export const ClaimStory = () => (
  <View style={styles.subcontainer}>
    <Text style={styles.title}>Claim</Text>
    <View style={styles.componentContainer}>
      <Button disabled={boolean('Disabled', false)} onPress={onPress}>
        {['CLAIM_POINTS Button', () => <ClaimIcon />, 350]}
      </Button>
    </View>
  </View>
);

export const ArrowUpStory = () => (
  <View style={styles.subcontainer}>
    <Text style={styles.title}>Arrow Up</Text>
    <View style={[styles.componentContainer]}>
      <Button
        disabled={boolean('Disabled', false)}
        onPress={onPress}
        containerColor={COLOR.WHITE}
        innerContainerStyle={[CONTAINER_STYLE.shadow, { width: 50, height: 50 }]}
      >
        <Icon name={ICON.ARROW_UP} color={COLOR.BLACK} size={FONT_SIZE.HUGE} />
      </Button>
    </View>
  </View>
);

export const ArrowLeftStory = () => (
  <View style={styles.subcontainer}>
    <Text style={styles.title}>Back Button</Text>
    <View style={[styles.componentContainer]}>
      <BackButton onPress={onPress} />
    </View>
  </View>
);

export const OverviewStory = () => (
  <View style={styles.subcontainer}>
    <Text style={styles.title}>Buttons</Text>
    <Text style={styles.text}>Basic button component that it is used across the app.</Text>
    <View style={styles.division} />
    <Text style={styles.subtitle}>Types</Text>
    <Text style={styles.text}>Supports different types that change their color.</Text>
    <View style={styles.division} />
    <BasicStory />
    <View style={styles.division} />
    <OptionStory />
    <View style={styles.division} />
    <BuyStory />
    <View style={styles.division} />
    <CloseIconStory />
    <View style={styles.division} />
    <CloseLightStory />
    <View style={styles.division} />
    <CloseDarkStory />
    <View style={styles.division} />
    <ClaimStory />
    <View style={styles.division} />
    <ArrowUpStory />
    <View style={styles.division} />
    <ArrowLeftStory />
  </View>
);
