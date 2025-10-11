# ping-expo-app

A minimal Expo app scaffold created to demonstrate file-based routing with two tabs.

Run locally (PowerShell):

```powershell
# 1) Install dependencies
npm install

# 2) Start the dev server
npx expo start

# Press 'a' to open Android emulator, 'i' for iOS simulator, or scan the QR code with the Expo Go app.
```

Files of interest:
- `app/(tabs)/index.tsx` - Home tab (Hello World)
- `app/(tabs)/explore.tsx` - Explore tab
- `app/_layout.tsx` - App layout (expo-router stack)
