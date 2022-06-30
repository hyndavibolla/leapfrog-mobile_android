module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        allowUndefined: true
      }
    ],
    [
      'module-resolver',
      {
        alias: {
          _assets: './src/assets',
          _components: './src/views/shared',
          _commons: './src/commons',
          _constants: './src/constants',
          _models: './src/models',
          _modules: './src/modules',
          _navigation: './src/navigation',
          _services: './src/services',
          _state_mgmt: './src/state-mgmt',
          _test_utils: './src/test-utils',
          _utils: './src/utils',
          _views: './src/views'
        }
      }
    ]
  ]
};
