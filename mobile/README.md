# Variance Mobile - React Native App

Mobile companion app for the Variance Blackjack Trainer web application.

## Features

- All web app sections accessible on mobile
- **Start Card Counting** - Real-time card counting tracker with:
  - Customizable deck count (1-8 decks)
  - Adjustable penetration (50-90%)
  - Running count and true count display
  - Large touch-friendly buttons for card input (+1, 0, -1)
  - Card history tracking

## Setup

See `MOBILE_SETUP.md` for detailed installation instructions.

## Quick Start

```bash
cd mobile
npm install
npm run ios    # or npm run android
```

## Project Structure

- `src/screens/` - Screen components
- `src/components/` - Reusable components
- `src/navigation/` - Navigation setup
- `src/services/` - Firebase and other services
- `src/utils/` - Shared utilities (card counting logic)

## Shared Resources

The mobile app shares:
- Firebase configuration with the web app
- Card counting logic (Hi-Lo system)
- User authentication and data
