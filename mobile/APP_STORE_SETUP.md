# App Store Connect Setup Guide

## Prerequisites

1. **Apple Developer Account**: You need an active Apple Developer Program membership ($99/year)
2. **App Store Connect Access**: Ensure you have access to App Store Connect

## Step 1: Install EAS CLI

```bash
cd mobile
npm install eas-cli --save-dev
# OR globally (requires sudo):
# npm install -g eas-cli
```

## Step 2: Login to Expo

```bash
cd mobile
npx eas login
# OR if installed globally:
# eas login
```

You'll need to create an Expo account if you don't have one (free).

## Step 3: Configure EAS Project

```bash
cd mobile
npx eas build:configure
```

This will:
- Link your project to Expo's servers
- Set up the EAS project ID (already configured in app.json)

## Step 4: Set Up App Store Connect App

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click "My Apps" → "+" → "New App"
3. Fill in:
   - **Platform**: iOS
   - **Name**: Variance
   - **Primary Language**: English
   - **Bundle ID**: com.variance.mobile (create if needed)
   - **SKU**: variance-mobile-001
   - **User Access**: Full Access

## Step 5: Configure Build Credentials

```bash
cd mobile
npx eas credentials
```

Select:
- **Platform**: iOS
- **Action**: Set up credentials

EAS will guide you through:
- Apple Developer Account authentication
- Certificate setup
- Provisioning profile creation

## Step 6: Build for App Store

```bash
cd mobile
npx eas build --platform ios --profile production
```

This will:
- Create a production build on Expo's servers
- Sign it with your Apple certificates
- Generate an `.ipa` file ready for App Store submission

The build will take 10-20 minutes. You can monitor progress at:
https://expo.dev/accounts/[your-username]/projects/variance/builds

## Step 7: Submit to App Store Connect

Once the build completes:

```bash
cd mobile
npx eas submit --platform ios
```

This will:
- Upload the build to App Store Connect
- Create a new version in App Store Connect
- Prepare it for App Store review

## Step 8: Complete App Store Listing

1. Go to App Store Connect → Your App → App Store tab
2. Fill in required information:
   - **App Preview** (screenshots/videos)
   - **Description**: "Master blackjack card counting with comprehensive training tools, simulations, and progress tracking."
   - **Keywords**: blackjack, card counting, training, casino, strategy
   - **Support URL**: Your website URL
   - **Privacy Policy URL**: Required
   - **Age Rating**: Complete the questionnaire
   - **Pricing**: Set to Free or Paid

3. Add screenshots:
   - iPhone 6.7" Display (iPhone 14 Pro Max)
   - iPhone 6.5" Display (iPhone 11 Pro Max)
   - iPhone 5.5" Display (iPhone 8 Plus)
   - iPad Pro (12.9-inch)

## Step 9: Submit for Review

1. In App Store Connect, go to your app version
2. Click "Submit for Review"
3. Answer any compliance questions
4. Submit!

## Important Notes

- **Bundle Identifier**: Currently set to `com.variance.mobile` - ensure this matches your App Store Connect app
- **Build Number**: Increment this (`buildNumber` in app.json) for each new build
- **Version**: Update `version` in app.json for each App Store release
- **Privacy Policy**: Required for App Store submission

## Testing Before Submission

Test your build using TestFlight first:

```bash
npx eas build --platform ios --profile preview
```

Then distribute via TestFlight to testers before submitting to the App Store.

## EAS Configuration Files

- `eas.json`: Build profiles (development, preview, production)
- `app.json`: App metadata and configuration

## Troubleshooting

- **Certificate Issues**: Run `npx eas credentials` to regenerate
- **Build Failures**: Check build logs at expo.dev
- **App Store Connect Errors**: Verify bundle ID matches everywhere

## Next Steps After Approval

1. Monitor reviews and ratings
2. Respond to user feedback
3. Plan updates and new features
4. Update version numbers for each release

