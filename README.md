# 🚀 WebCheck360

**Website Audit Funnel mit Admin-Dashboard & Lead-Management**

Eine vollautomatisierte Website-Analyse-Plattform, die Unternehmen dabei hilft, das Optimierungspotenzial ihrer Webseiten zu erkennen und qualifizierte Leads zu generieren.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## ✨ Features

### 🔍 Website-Analyse
- **Performance Score** – Ladezeit, Core Web Vitals (via Lighthouse)
- **SEO Score** – Meta-Tags, Struktur, Best Practices
- **Trust Score** – SSL, Impressum, Datenschutz, Kontaktdaten
- **Conversion Score** – CTAs, Formulare, Mobile-Optimierung

### 📸 Screenshot-Service
- Automatische Desktop & Mobile Screenshots
- Powered by Playwright
- Visuelle Darstellung der analysierten Website

### 👨‍💼 Admin-Dashboard
- Übersicht aller Analysen mit Statistiken
- Lead-Verwaltung mit Status-Tracking
- Notizen und Kommentare pro Audit
- CSV-Export für CRM-Integration
- Filterung nach Score, E-Mail, Datum

### 📧 Lead-Generierung
- Kontaktformular mit automatischer E-Mail-Benachrichtigung
- Formspree-Integration (kein Backend nötig)
- Leads werden automatisch mit Audits verknüpft

### 🌍 Mehrsprachig
- Deutsch (DE)
- Englisch (EN)
- Einfach erweiterbar

---

## 🛠 Tech Stack

| Kategorie | Technologie |
|-----------|-------------|
| Framework | Next.js 14 (App Router) |
| Sprache | TypeScript |
| Styling | Tailwind CSS |
| Datenbank | lowdb (JSON) |
| Analyse | Google Lighthouse |
| Screenshots | Playwright |
| E-Mail | Formspree |
| i18n | next-intl |

---

## 🚀 Installation

### Voraussetzungen
- Node.js 18+ 
- npm oder yarn

### Setup

```bash
# Repository klonen
git clone https://github.com/mikegehrke/WebCheck360.git
cd WebCheck360

# Dependencies installieren
npm install

# Playwright Browser installieren
npx playwright install chromium

# Umgebungsvariablen einrichten
cp .env.example .env.local

# Entwicklungsserver starten
npm run dev
```

Die App läuft dann unter: http://localhost:3000

---

## ⚙️ Konfiguration

Erstelle eine `.env.local` Datei:

```env
# Admin-Zugang
ADMIN_PASSWORD=dein-sicheres-passwort

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=WebCheck360
```

---

## 📁 Projektstruktur

```
WebCheck360/
├── app/
│   ├── [locale]/          # Mehrsprachige Seiten
│   │   ├── admin/         # Admin-Dashboard
│   │   ├── funnel/        # Analyse-Funnel
│   │   └── results/       # Ergebnisseiten
│   └── api/               # API Routes
│       ├── analyze/       # Website-Analyse
│       ├── contact/       # Kontaktformular
│       └── admin/         # Admin-APIs
├── components/            # React-Komponenten
├── lib/                   # Utilities & DB
├── services/              # Analyse-Services
├── data/                  # JSON-Datenbank
└── public/                # Statische Assets
```

---

## 🔐 Admin-Zugang

- **URL:** `/de/admin/login` oder `/en/admin/login`
- **Passwort:** Wird in `.env.local` als `ADMIN_PASSWORD` gesetzt

---

## 📊 API Endpoints

| Methode | Endpoint | Beschreibung |
|---------|----------|--------------|
| POST | `/api/analyze` | Website analysieren |
| POST | `/api/contact` | Kontaktanfrage senden |
| GET | `/api/admin/audits` | Alle Audits abrufen |
| GET | `/api/admin/audits/[id]` | Einzelnes Audit |
| PATCH | `/api/admin/audits/[id]` | Status aktualisieren |

---

## 🚢 Deployment

### Vercel (Empfohlen)

1. Repository mit Vercel verbinden
2. Environment Variables setzen
3. Deploy

**Wichtig:** Playwright funktioniert nicht auf Vercel. Für Produktion:
- Screenshots über externe API (z.B. screenshotapi.net)
- Oder self-hosted auf einem VPS

### Docker (Coming Soon)

```bash
docker build -t webcheck360 .
docker run -p 3000:3000 webcheck360
```

---

## 📝 Lizenz

MIT License - siehe [LICENSE](LICENSE)

---

## 👤 Autor

**Mike Gehrke**  
Digital Solutions · Köln

- Website: [mg-digital-solutions.de](https://mg-digital-solutions-beta.vercel.app)
- Email: gehrkemike2@gmail.com
- GitHub: [@mikegehrke](https://github.com/mikegehrke)

---

## 🤝 Contributing

Pull Requests sind willkommen! Für größere Änderungen bitte zuerst ein Issue erstellen.

---

<p align="center">
  Made with ❤️ in Köln
</p>
