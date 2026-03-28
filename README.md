# ping

**ping** is a cross-platform mobile application built with React Native and Expo. It provides real-time audio analysis with haptic and visual feedback, helping users stay aware of their surroundings.

## ✨ Features

- **Real-time audio analysis** — Continuously monitors ambient sound and classifies audio events.
- **Haptic feedback** — Alerts are communicated through device vibrations using `expo-haptics`.
- **Cross-platform** — Runs on iOS, Android, and the web from a single codebase.
- **TypeScript** — Fully typed codebase for reliability and developer confidence.

## 🚀 Tech Stack

| Layer | Technology |
| :--- | :--- |
| Framework | React Native (Expo ~49) |
| Language | TypeScript |
| Audio | expo-av |
| Haptics | expo-haptics |
| Icons | @expo/vector-icons |

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- A physical device or emulator (iOS/Android)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/davidrr2004/ping.git
cd ping/app

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

Scan the QR code with the **Expo Go** app on your phone, or press `a` / `i` to open an Android or iOS emulator.

## 📁 Project Structure

```
ping/
├── app/          # React Native mobile app (Expo)
│   ├── App.tsx
│   ├── AudioAnalysisApp.tsx
│   └── app/      # Screen and component files
└── web/          # Web companion interface
```

## 📄 License

This project is private and not licensed for public distribution.
