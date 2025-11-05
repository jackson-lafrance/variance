# Running Variance Mobile App on Your Phone

## Method 1: Using Expo Go (Easiest - Development)

This is the fastest way to test the app on your phone during development.

### Step 1: Install Expo Go on Your Phone

- **iOS**: Download "Expo Go" from the App Store
- **Android**: Download "Expo Go" from Google Play Store

### Step 2: Start the Development Server

```bash
cd mobile
npm install  # If you haven't already
npm start
```

This will:
- Start the Expo development server
- Open a terminal interface with a QR code
- Show options to open on iOS simulator, Android emulator, or web

### Step 3: Connect Your Phone

**Option A: Same WiFi Network (Recommended)**
1. Make sure your phone and computer are on the same WiFi network
2. Open Expo Go app on your phone
3. Scan the QR code from the terminal
4. The app will load on your phone

**Option B: Tunnel Mode (if WiFi doesn't work)**
1. Press `s` in the terminal to open settings
2. Press `t` to enable tunnel mode
3. Scan the new QR code with Expo Go

**Option C: Manual Connection**
1. In Expo Go app, tap "Enter URL manually"
2. Enter the URL shown in the terminal (usually `exp://192.168.x.x:8081`)

### Step 4: Development

- Changes you make to the code will automatically reload on your phone
- Shake your phone to open the developer menu
- Press `r` in the terminal to reload the app

---

## Method 2: Development Build (More Native Features)

This creates a standalone app on your phone with full native capabilities.

### For iOS:

```bash
cd mobile
npm install
npx eas build --platform ios --profile development
```

After the build completes (10-20 minutes), you'll get a link to download and install the app on your iPhone via TestFlight or direct install.

### For Android:

```bash
cd mobile
npm install
npx eas build --platform android --profile development
```

After the build completes, you'll get an APK download link. Install it on your Android device.

---

## Method 3: Local Build (Advanced)

### iOS (requires Mac + Xcode):

```bash
cd mobile
npm install
npm run ios
```

This will:
- Build and install on iOS Simulator (if connected)
- Or build and install on connected iPhone via USB

### Android (requires Android Studio):

```bash
cd mobile
npm install
npm run android
```

This will:
- Build and install on Android Emulator (if running)
- Or build and install on connected Android device via USB

---

## Troubleshooting

### QR Code Not Scanning?
- Make sure phone and computer are on same WiFi
- Try tunnel mode (press `t` in Expo terminal)
- Check firewall settings aren't blocking port 8081

### App Won't Load?
- Check your phone's internet connection
- Try restarting the Expo server: `npm start -- --clear`
- Make sure all dependencies are installed: `npm install`

### Firebase Not Working?
- Make sure Firebase config is set up in `mobile/src/services/firebase.ts`
- Check that your Firebase project allows requests from your phone's IP

### Need to Reset?
```bash
cd mobile
rm -rf node_modules
npm install
npm start -- --clear
```

---

## Quick Start (Recommended)

```bash
# Navigate to mobile directory
cd mobile

# Install dependencies (first time only)
npm install

# Start Expo development server
npm start

# Scan QR code with Expo Go app on your phone
```

The app will automatically reload when you make code changes!

