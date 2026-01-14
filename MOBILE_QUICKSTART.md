# WebCheck360 Mobile Apps - Quick Start

## ✅ Was ist fertig?

- ✅ **Capacitor** installiert und konfiguriert
- ✅ **iOS Projekt** erstellt (`/ios`)
- ✅ **Android Projekt** erstellt (`/android`)
- ✅ **Hybrid-Modus** aktiviert (Apps laden https://www.webcheck360.de)
- ✅ Splash Screen Plugin integriert

## 🎯 Architektur

```
┌─────────────────────┐
│   Mobile App        │
│   (iOS/Android)     │
│                     │
│   ┌─────────────┐   │
│   │  WebView    │   │
│   │             │   │
│   └──────┬──────┘   │
│          │          │
└──────────┼──────────┘
           │
           │ HTTPS
           ▼
┌─────────────────────┐
│ www.webcheck360.de  │
│                     │
│ • /api/analyze      │
│ • /api/contact      │
│ • /api/leads        │
│ • Next.js Pages     │
└─────────────────────┘
```

**Vorteil:** 
- Kein Code-Duplikat
- Ein Backend für Web + Mobile
- Updates ohne App Store Review

## 🚀 Entwicklung starten

### iOS (benötigt macOS + Xcode)
```bash
npm run ios
```
Dies öffnet das Xcode-Projekt. Dort:
1. Simulator auswählen (z.B. iPhone 15 Pro)
2. ▶️ Play drücken
3. App lädt https://www.webcheck360.de

### Android (benötigt Android Studio)
```bash
npm run android
```
Dies öffnet Android Studio. Dort:
1. Emulator erstellen/starten
2. ▶️ Run drücken
3. App lädt https://www.webcheck360.de

## 📱 Wichtige Befehle

```bash
# iOS in Xcode öffnen
npm run ios

# Android in Android Studio öffnen
npm run android

# Änderungen synchronisieren
npm run cap:sync

# Nur iOS synchronisieren
npx cap sync ios

# Nur Android synchronisieren
npx cap sync android
```

## 🎨 Nächste Schritte: Assets

### 1. App Icon erstellen
Erstellen Sie: `resources/icon.png` (1024x1024)
- Vorlage: `resources/icon-template.svg`
- Empfehlung: Canva, Figma, oder Designer beauftragen

### 2. Icons generieren
```bash
npm install -g @capacitor/assets
npx capacitor-assets generate --iconBackgroundColor '#0ea5e9'
```

Dies erstellt automatisch:
- iOS: alle Icon-Größen
- Android: alle Icon-Größen  
- Splash Screens: iOS + Android

### 3. Screenshots für Stores
- iOS Simulator starten
- Screenshots machen (Cmd+S)
- Android Emulator starten
- Screenshots machen

## 🏪 Store Submission

Siehe **MOBILE_APP_GUIDE.md** für:
- Detaillierte Store-Anforderungen
- Ablehnungsgründe vermeiden
- Checkliste vor Einreichung
- Privacy Policy Setup

## 🔧 Konfiguration anpassen

### App Name ändern
`capacitor.config.ts`:
```typescript
appName: 'WebCheck360'
```

### Bundle ID / Package Name ändern
`capacitor.config.ts`:
```typescript
appId: 'de.webcheck360.app'
```

### Splash Screen Farbe
`capacitor.config.ts`:
```typescript
plugins: {
  SplashScreen: {
    backgroundColor: '#0ea5e9'
  }
}
```

### Backend URL ändern (für Testing)
`capacitor.config.ts`:
```typescript
server: {
  url: 'http://localhost:3000' // Für lokales Testen
}
```

## ⚠️ Troubleshooting

### iOS Build-Fehler
```bash
cd ios/App
pod install
cd ../..
npm run ios
```

### Android Gradle-Fehler
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### WebView lädt nicht
1. `capacitor.config.ts` prüfen → `server.url` korrekt?
2. Internet-Verbindung vorhanden?
3. Console in Xcode/Android Studio prüfen

## 📊 Performance

Die App lädt die **gleiche** optimierte Website:
- ✅ Lighthouse 100/100/100/100
- ✅ Alle Optimierungen bleiben
- ✅ Service Worker funktioniert
- ✅ Cookies + LocalStorage verfügbar

## 🎓 Weiterführende Infos

- [Capacitor Docs](https://capacitorjs.com/docs)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Android Material Design](https://material.io/design)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policy](https://play.google.com/about/developer-content-policy/)

---

**Fragen?** Siehe MOBILE_APP_GUIDE.md oder Capacitor Dokumentation.
