/**
 * Metro configuration for React Native
 * https://facebook.github.io/metro/docs/configuration
 */

const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

module.exports = mergeConfig(defaultConfig, {
  resolver: {
    // Ensure common extensions are resolved (including TS/TSX)
    sourceExts: defaultConfig.resolver.sourceExts,
  },
});


