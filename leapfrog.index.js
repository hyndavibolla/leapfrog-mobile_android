import { AppRegistry, Text, TextInput } from 'react-native';

import { name as appName } from './app.json';
import { AppRoot } from './src/AppRoot';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

AppRegistry.registerComponent(appName, () => AppRoot);
