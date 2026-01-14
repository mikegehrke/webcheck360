# App Store Assets Guide

## 📱 iOS App Store Requirements

### App Icon (1024x1024 PNG)
- Muss genau 1024x1024 Pixel sein
- PNG-Format ohne Transparenz
- Keine abgerundeten Ecken (macht iOS automatisch)
- Kein Text "Beta" oder ähnliches
- **Erstellen:** `resources/icon.png` (1024x1024)

### Screenshots
**Erforderliche Größen:**
- iPhone 6.7" (1290 x 2796) - iPhone 15 Pro Max
- iPhone 6.5" (1242 x 2688) - iPhone 11 Pro Max
- iPad Pro 12.9" (2048 x 2732)

**Anzahl:** 3-10 Screenshots pro Größe

### App Store Listing
- **App Name:** WebCheck360
- **Subtitle:** Website-Performance & SEO Tool
- **Description:** 
  - Primär (170 Zeichen)
  - Ausführlich (4000 Zeichen)
- **Keywords:** website,performance,seo,lighthouse,speed,test
- **Support URL:** https://www.webcheck360.de/imprint
- **Privacy Policy URL:** https://www.webcheck360.de/privacy

---

## 🤖 Google Play Store Requirements

### App Icon (512x512 PNG)
- 512x512 Pixel
- 32-bit PNG mit Alpha
- Vollkreis-Safe-Zone (Google zeigt Icons in Kreisen)
- **Erstellen:** `resources/icon-android.png` (512x512)

### Feature Graphic (1024x500 PNG)
- Wird im Store prominent angezeigt
- **Erstellen:** `resources/feature-graphic.png`

### Screenshots
**Erforderliche Größen:**
- Phone (mind. 320px kürzeste Seite)
- 7" Tablet (optional)
- 10" Tablet (optional)

**Anzahl:** 2-8 Screenshots

### Play Store Listing
- **App Name:** WebCheck360
- **Short Description:** Website Performance & SEO Analyse (80 Zeichen)
- **Full Description:** (4000 Zeichen)
- **Privacy Policy:** https://www.webcheck360.de/privacy
- **Contact Email:** Ihre Email

---

## 🎨 Asset-Generierung

### Schritt 1: Basis-Icon erstellen
Erstellen Sie `resources/icon.png` (1024x1024) mit:
- WebCheck360 Logo
- Blauer Hintergrund (#0ea5e9)
- Klares, minimalistisches Design

### Schritt 2: Splash Screen
Erstellen Sie `resources/splash.png` (2732x2732) mit:
- Logo zentriert
- Hintergrundfarbe: #0ea5e9

### Schritt 3: Automatische Generierung
```bash
npm install -g @capacitor/assets
npx capacitor-assets generate
```

Dies generiert automatisch alle benötigten Icon- und Splash-Screen-Größen.

---

## ⚠️ Typische Ablehnungsgründe vermeiden

### iOS
❌ **Zu vermeiden:**
- App ist nur eine WebView ohne native Features
- Fehlende Funktionalität ohne Internet
- In-App-Purchase Umgehung
- Fehlende Datenschutzerklärung
- Crashs beim Start

✅ **Sicherstellen:**
- App hat Offline-Fallback (zeigt Nachricht)
- Privacy Policy ist verlinkt
- App funktioniert stabil
- Keine externen Payment-Links (wenn nicht vorgesehen)

### Android
❌ **Zu vermeiden:**
- Fehlende Privacy Policy
- Zu allgemeine Permissions
- Unstabile App
- Irreführende Store-Beschreibung

✅ **Sicherstellen:**
- Nur benötigte Permissions anfordern
- Privacy Policy URL angeben
- Target SDK Level aktuell (API 34+)

---

## 📋 Checkliste vor Einreichung

### Beide Plattformen
- [ ] App Icon (iOS: 1024x1024, Android: 512x512)
- [ ] Screenshots (3+ pro Gerätegröße)
- [ ] Privacy Policy veröffentlicht
- [ ] Support/Imprint URL
- [ ] App-Beschreibung (DE + EN)
- [ ] Keywords recherchiert
- [ ] Testgerät geprüft (keine Crashes)
- [ ] Internet-Verbindung erforderlich → klar kommuniziert

### iOS spezifisch
- [ ] Apple Developer Account ($99/Jahr)
- [ ] Bundle ID: de.webcheck360.app
- [ ] Version: 1.0.0
- [ ] Build Number: 1
- [ ] Export Compliance: Nein (keine Verschlüsselung außer HTTPS)

### Android spezifisch
- [ ] Google Play Console Account ($25 einmalig)
- [ ] Package Name: de.webcheck360.app
- [ ] Version Code: 1
- [ ] Version Name: 1.0.0
- [ ] Content Rating ausgefüllt
- [ ] Target Audience: Alle Altersgruppen

---

## 🚀 Build & Deploy

### iOS (benötigt macOS + Xcode)
```bash
npm run ios
# In Xcode: Product > Archive > Distribute App
```

### Android
```bash
npm run android
# In Android Studio: Build > Generate Signed Bundle
```

---

## 📞 Nächste Schritte

1. **App Icon erstellen** → Designer beauftragen oder selbst in Figma
2. **Screenshots machen** → App auf Simulator starten, Screenshots erstellen
3. **Store Listings schreiben** → Beschreibungen für DE/EN
4. **Privacy Policy finalisieren** → Auf webcheck360.de/privacy
5. **Testflight/Internal Testing** → Beta-Tester einladen
6. **Review einreichen** → Normalerweise 1-3 Tage Wartezeit

