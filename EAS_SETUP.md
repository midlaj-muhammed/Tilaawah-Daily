# 🔧 EAS Build Setup Guide

## 🚨 Required: Expo Account Token

The GitHub Actions workflow requires an Expo account token to authenticate with EAS Build.

## 📋 Setup Steps:

### 1. **Login to Expo** (if not already):
```bash
eas login
```

### 2. **Get Your Expo Token**:
```bash
eas whoami
```

### 3. **Add EXPO_TOKEN to GitHub Secrets**:
1. Go to your GitHub repository: https://github.com/midlaj-muhammed/Tilaawah-Daily
2. Click **Settings** tab
3. Click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Name: `EXPO_TOKEN`
6. Value: Your Expo account token
7. Click **Add secret**

### 4. **Create EAS Project** (if not already):
```bash
eas project:info
# Or create new project:
eas project:create
```

### 5. **Verify Configuration**:
```bash
eas build:configure
```

## 🔑 Token Information:

- **Where to find**: After `eas login`, your token is stored locally
- **Alternative**: Get token from Expo dashboard: https://expo.dev/accounts
- **Permissions**: Token needs build permissions for your project
- **Security**: Never commit tokens to repository

## 🚀 After Setup:

Once you've added the EXPO_TOKEN secret:
1. Push changes to trigger a build
2. Or create a version tag: `git tag v1.0.0 && git push origin v1.0.0`
3. Monitor build progress in GitHub Actions tab

## 📱 Build Process:

1. **Authentication**: Uses EXPO_TOKEN for EAS CLI
2. **Build**: Cloud-based Android APK build
3. **Download**: APK downloaded to workflow runner
4. **Release**: Uploaded to GitHub Releases

## 🔍 Troubleshooting:

**Token Issues**:
- Ensure token has correct permissions
- Regenerate token if expired
- Check GitHub secrets are correctly named

**Build Issues**:
- Verify `eas.json` configuration
- Check Android project setup
- Review build logs in Actions tab

---

**📞 Need Help?**
- Expo EAS docs: https://docs.expo.dev/build/introduction/
- GitHub Actions docs: https://docs.github.com/en/actions
