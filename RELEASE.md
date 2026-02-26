# 🚀 Release Guide for Tilaawah Daily

## 📱 Creating a New Release

### Option 1: Automated GitHub Actions (Recommended)

1. **Create a version tag**:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **GitHub Actions will automatically**:
   - Build the APK
   - Create a GitHub Release
   - Upload the APK as a release asset
   - Generate release notes

### Option 2: Manual Release

1. **Build APK locally**:
   ```bash
   ./build-apk.sh
   ```

2. **Create GitHub Release**:
   - Go to: https://github.com/midlaj-muhammed/Tilaawah-Daily/releases
   - Click "Create a new release"
   - Enter tag version (e.g., `v1.0.0`)
   - Add release title and description
   - Upload `Tilaawah-Daily.apk` file
   - Click "Publish release"

### Option 3: Manual Workflow Dispatch

1. **Go to Actions tab** in your GitHub repository
2. **Select "Build and Release APK" workflow**
3. **Click "Run workflow"**
4. **Enter version number** (e.g., `1.0.0`)
5. **Workflow will build and create release automatically**

## 📋 Release Checklist

Before creating a release:

- [ ] App builds without errors
- [ ] All features are working
- [ ] APK size is optimized (< 50MB)
- [ ] Test on at least one Android device
- [ ] Update version number in `app.json`
- [ ] Update CHANGELOG.md (if exists)
- [ ] Screenshots are up to date

## 📊 APK Information

After building, your APK will be available at:
```
https://github.com/midlaj-muhammed/Tilaawah-Daily/releases/download/v1.0.0/Tilaawah-Daily-v1.0.0.apk
```

## 🔗 Useful URLs

- **Releases Page**: https://github.com/midlaj-muhammed/Tilaawah-Daily/releases
- **Latest Release**: https://github.com/midlaj-muhammed/Tilaawah-Daily/releases/latest
- **Actions**: https://github.com/midlaj-muhammed/Tilaawah-Daily/actions

## 📱 Installation Instructions for Users

1. **Download APK** from the releases page
2. **Enable installation** from unknown sources:
   - Go to Settings > Security > Unknown Sources
   - Enable the option
3. **Install the APK**:
   - Open the downloaded file
   - Follow installation prompts
4. **Launch the app** and enjoy!

## 🏷️ Version Naming

Use semantic versioning:
- **Major**: `1.0.0` (breaking changes)
- **Minor**: `1.1.0` (new features)
- **Patch**: `1.0.1` (bug fixes)

Example tags: `v1.0.0`, `v1.1.0`, `v1.0.1`
