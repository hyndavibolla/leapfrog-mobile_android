import React, { useCallback, useState } from 'react';
import { View, TouchableHighlight } from 'react-native';

import { Text } from '../../src/views/shared/Text';
import { styles } from '../styles';
import ErrorBoundary from '../../src/views/shared/ErrorBoundary';

const HandGrenade = ({ children }) => {
  const [showError, setShowError] = useState(null);
  return (
    <TouchableHighlight onPress={() => setShowError(true)}>
      <View>
        <Text>{children}</Text>
        {showError &&
          (() => {
            const a: any = null;
            a.b.c = 10;
            return null;
          })()}
      </View>
    </TouchableHighlight>
  );
};

export const ErrorBoundaryStory = () => {
  const fallback = useCallback(() => <Text>hi, i am what you see when a render error was caught</Text>, []);

  return (
    <View style={styles.subcontainer}>
      <Text style={[styles.title, { color: 'red' }]}>KEEP IN MIND</Text>
      <Text style={[styles.text, { color: 'red' }]}>
        You'll see a debug big error screen, there is a "dismiss" button on the bottom left you can press to keep navigating
      </Text>
      <View style={styles.division} />
      <View style={styles.componentContainer}>
        <HandGrenade>* This should crash when pressed</HandGrenade>
      </View>
      <View style={styles.division} />
      <View style={styles.componentContainer}>
        <ErrorBoundary>
          <HandGrenade>* This should be caught and dissapear when pressed</HandGrenade>
        </ErrorBoundary>
      </View>
      <View style={styles.division} />
      <View style={styles.componentContainer}>
        <ErrorBoundary fallback={fallback}>
          <HandGrenade>* This should render a fallback when pressed</HandGrenade>
        </ErrorBoundary>
      </View>
    </View>
  );
};
