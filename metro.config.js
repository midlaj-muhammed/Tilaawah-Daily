const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Use a try-catch to handle potential compatibility issues
let config;
try {
    config = getDefaultConfig(__dirname);
} catch (error) {
    console.error('Error loading default config:', error);
    // Fallback to basic config if getDefaultConfig fails
    config = {
        resolver: {
            unstable_enablePackageExports: true,
            unstable_conditionNames: [
                'react-native',
                'browser',
                'require',
                'import',
                'default',
            ],
        },
    };
}

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
if (config.resolver) {
    config.resolver.unstable_enablePackageExports = true;
    config.resolver.unstable_conditionNames = [
        'react-native',
        'browser',
        'require',
        'import',
        'default',
    ];
}

module.exports = config;
