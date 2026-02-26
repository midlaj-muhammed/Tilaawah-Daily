#!/bin/bash

# Build APK for release distribution
echo "🔨 Building Tilaawah Daily APK..."

cd "$(dirname "$0")"

# Clean previous builds
echo "🧹 Cleaning previous builds..."
npx expo run:android --variant release --clean

# Find the built APK
APK_PATH="android/app/build/outputs/apk/release/app-release.apk"

if [ -f "$APK_PATH" ]; then
    echo "✅ APK built successfully!"
    echo "📍 Location: $APK_PATH"
    echo "📊 Size: $(du -h "$APK_PATH" | cut -f1)"
    
    # Create a copy with desired name
    cp "$APK_PATH" "Tilaawah-Daily.apk"
    echo "📋 Copied to: Tilaawah-Daily.apk"
    
    echo "🚀 Ready for GitHub upload!"
else
    echo "❌ APK build failed!"
    exit 1
fi
