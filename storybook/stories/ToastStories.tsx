import React from 'react';
import { View } from 'react-native';
import { text } from '@storybook/addon-knobs';

import { Text } from '../../src/views/shared/Text';
import ClaimIcon from '../../src/assets/button/claimIcon.svg';
import { Toast, ToastType } from '../../src/views/shared/Toast';
import { styles } from '../styles';

export const InfoToastStory = () => (
  <View style={[styles.subcontainer]}>
    <Text style={styles.title}>Info toast</Text>
    <View style={styles.division} />
    <Text style={styles.title}>string as children</Text>
    <View style={[styles.componentContainer, { position: 'relative', height: 165 }]}>
      <Toast type={ToastType.SUCCESS} title="INFO with string children">
        {text('txt', 'description goes here')}
      </Toast>
    </View>
    <View style={styles.division} />
    <Text style={styles.title}>compo as children</Text>
    <View style={[styles.componentContainer, { position: 'relative', height: 185 }]}>
      <Toast type={ToastType.SUCCESS} title="INFO with compo children">
        <Text style={{ color: 'purple', fontSize: 20 }}>description goes here</Text>
      </Toast>
    </View>
    <View style={styles.division} />
    <Text style={styles.title}>no children</Text>
    <View style={[styles.componentContainer, { position: 'relative', height: 165 }]}>
      <Toast type={ToastType.SUCCESS} title="INFO without children" />
    </View>
    <View style={styles.division} />
    <Text style={styles.title}>custom component as children</Text>
    <View style={[styles.componentContainer, { position: 'relative', height: 165 }]}>
      <Toast>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <ClaimIcon width={20} height={20} />
          <Text style={{ fontSize: 17, color: 'yellow', marginLeft: 10 }}>a custom toast</Text>
        </View>
      </Toast>
    </View>
  </View>
);

export const WarningToastStory = () => (
  <View style={[styles.subcontainer]}>
    <Text style={styles.title}>Warning toast</Text>
    <View style={styles.division} />
    <Text style={styles.title}>string as children</Text>
    <View style={[styles.componentContainer, { position: 'relative', height: 165 }]}>
      <Toast type={ToastType.WARNING} title="WARNING with string children">
        {text('txt', 'description goes here')}
      </Toast>
    </View>
    <View style={styles.division} />
    <Text style={styles.title}>compo as children</Text>
    <View style={[styles.componentContainer, { position: 'relative', height: 185 }]}>
      <Toast type={ToastType.WARNING} title="WARNING with compo children">
        <Text style={{ color: 'purple', fontSize: 20 }}>description goes here</Text>
      </Toast>
    </View>
    <View style={styles.division} />
    <Text style={styles.title}>no children</Text>
    <View style={[styles.componentContainer, { position: 'relative', height: 165 }]}>
      <Toast type={ToastType.WARNING} title="WARNING without children" />
    </View>
    <View style={styles.division} />
    <Text style={styles.title}>custom component as children</Text>
    <View style={[styles.componentContainer, { position: 'relative', height: 165 }]}>
      <Toast type={ToastType.WARNING}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <ClaimIcon width={20} height={20} />
          <Text style={{ fontSize: 17, color: 'yellow', marginLeft: 10 }}>a custom toast</Text>
        </View>
      </Toast>
    </View>
  </View>
);

export const ErrorToastStory = () => (
  <View style={[styles.subcontainer]}>
    <Text style={styles.title}>Error toast</Text>
    <View style={styles.division} />
    <Text style={styles.title}>string as children</Text>
    <View style={[styles.componentContainer, { position: 'relative', height: 165 }]}>
      <Toast type={ToastType.ERROR} title="ERROR with string children">
        {text('txt', 'description goes here')}
      </Toast>
    </View>
    <View style={styles.division} />
    <Text style={styles.title}>compo as children</Text>
    <View style={[styles.componentContainer, { position: 'relative', height: 185 }]}>
      <Toast type={ToastType.ERROR} title="ERROR with compo children">
        <Text style={{ color: 'purple', fontSize: 20 }}>description goes here</Text>
      </Toast>
    </View>
    <View style={styles.division} />
    <Text style={styles.title}>no children</Text>
    <View style={[styles.componentContainer, { position: 'relative', height: 165 }]}>
      <Toast type={ToastType.ERROR} title="ERROR without children" />
    </View>
    <View style={styles.division} />
    <Text style={styles.title}>no children multiple lines</Text>
    <View style={[styles.componentContainer, { position: 'relative', height: 165 }]}>
      <Toast
        type={ToastType.ERROR}
        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. In rutrum vestibulum mauris, in sollicitudin ante dictum nec."
      />
    </View>
    <View style={styles.division} />
    <Text style={styles.title}>custom component as children</Text>
    <View style={[styles.componentContainer, { position: 'relative', height: 165 }]}>
      <Toast type={ToastType.ERROR}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <ClaimIcon width={20} height={20} />
          <Text style={{ fontSize: 17, color: 'yellow', marginLeft: 10 }}>a custom toast</Text>
        </View>
      </Toast>
    </View>
  </View>
);
