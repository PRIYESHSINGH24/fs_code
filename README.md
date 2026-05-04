# Gemini Voice Assistant - Expo Export Guide

This project was built to be a high-performance, AI-powered voice assistant.

## How to run in Expo Go
1. **Download/Export** this project as a ZIP from AI Studio.
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Start Expo**:
   ```bash
   npx expo start
   ```
4. **Scan the QR Code**: Use the Expo Go app on your mobile device to scan the QR code displayed in your terminal.

## Architecture Note
This version uses React Web (Vite + Tailwind) for the AI Studio preview. 
- To run on **iOS/Android Native builds**, replace `div` with `View` and `button` with `TouchableOpacity` from `react-native`.
- To run as a **Progressive Web App (PWA)**, use `npx expo start --web`.

## Features
- **Real-time Gemini AI**: Powered by `gemini-3-flash-preview`.
- **Dual Language**: Supports English and Hindi voice interaction.
- **Persona Engine**: 5 unique modes (Doctor, Teacher, etc.) with custom tones.
- **Voice Pipeline**: Integrated browser-based Speech-to-Text and Text-to-Speech.
