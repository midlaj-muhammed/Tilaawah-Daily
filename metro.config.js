const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Fix Firebase JS SDK module resolution for React Native / Metro.
//
// Problem: firebase/auth ESM re-exports from @firebase/auth, but Metro
// can't resolve @firebase/auth from within the firebase package directory.
// The @firebase/auth package is hoisted to node_modules/@firebase/auth
// and has a "react-native" condition in its package.json exports that
// points to dist/rn/index.js (the RN-specific build).
//
// Solution: Use unstable_enablePackageExports to let Metro honor the
// "exports" field in package.json, and add "react-native" as a
// condition so Metro resolves to the RN-specific builds.
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = [
    'react-native',
    'browser',
    'require',
    'import',
    'default',
];

module.exports = config;
