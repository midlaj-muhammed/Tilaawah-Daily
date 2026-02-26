# 🔐 Android Keystore Setup Guide

## 🚨 Required: GitHub Secrets for Android Signing

The GitHub Actions workflow now requires Android keystore secrets to sign the APK.

## 📋 Setup Steps:

### 1. **Get Your Keystore Base64**:
```bash
cd "/home/midlaj/Documents/Tilaawah Daily/tilaawah-daily"
base64 tilaawah-daily.keystore
```

### 2. **Add GitHub Secrets**:
Go to your GitHub repository: https://github.com/midlaj-muhammed/Tilaawah-Daily/settings/secrets/actions

Add these secrets:

#### **ANDROID_KEYSTORE_BASE64**:
- **Name**: `ANDROID_KEYSTORE_BASE64`
- **Value**: Output from `base64 tilaawah-daily.keystore`

#### **ANDROID_KEYSTORE_ALIAS**:
- **Name**: `ANDROID_KEYSTORE_ALIAS`
- **Value**: `tilaawah-daily`

#### **ANDROID_KEYSTORE_PASSWORD**:
- **Name**: `ANDROID_KEYSTORE_PASSWORD`
- **Value**: `tilaawah123`

#### **ANDROID_KEY_PASSWORD**:
- **Name**: `ANDROID_KEY_PASSWORD`
- **Value**: `tilaawah123`

### 3. **Verify Setup**:
```bash
# Test keystore locally
keytool -list -v -keystore tilaawah-daily.keystore -alias tilaawah-daily
# Enter password: tilaawah123
```

## 🔑 Keystore Information:

- **File**: `tilaawah-daily.keystore`
- **Alias**: `tilaawah-daily`
- **Password**: `tilaawah123`
- **Key Password**: `tilaawah123`
- **Validity**: 10,000 days

## 🚀 After Setup:

Once you've added all secrets:
1. Push changes to trigger a build
2. Or create a version tag: `git tag v1.0.0 && git push origin v1.0.0`
3. Monitor build progress in GitHub Actions tab

## 🔍 Troubleshooting:

**Secret Issues**:
- Ensure all 4 secrets are added
- Verify base64 encoding is correct (no extra spaces)
- Check secret names match exactly

**Keystore Issues**:
- Verify keystore file exists locally
- Test keystore with `keytool` command
- Ensure passwords match exactly

**Build Issues**:
- Check GitHub Actions logs for keystore errors
- Verify EAS build configuration
- Review environment variables

## 📱 Build Process:

1. **Authentication**: Uses EXPO_TOKEN for EAS CLI
2. **Keystore Setup**: Decodes base64 keystore from secrets
3. **Build**: Uses keystore for Android APK signing
4. **Download**: APK downloaded to workflow runner
5. **Release**: Uploaded to GitHub Releases

---

**🔐 Security Notes:**
- Never commit keystore files to repository
- Use GitHub secrets for sensitive data
- Keystore passwords should be strong
- Keep backup of keystore file securely

**📞 Need Help?**
- EAS Build docs: https://docs.expo.dev/build/introduction/
- GitHub Actions docs: https://docs.github.com/en/actions
- Android signing docs: https://docs.expo.dev/build-reference/app-signing/
