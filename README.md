# WebCheck360

Website Audit Funnel mit Admin-Panel & Screenshot-Service

## 🚀 Quick Start

```bash
# Dependencies installieren
npm install

# Playwright Browser installieren
npx playwright install chromium

# Development Server starten
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000)

## 📁 Projektstruktur

```
WebCheck360/
├── app/
│   ├── [locale]/           # i18n Routing (DE/EN)
│   │   ├── funnel/         # Funnel Pages
│   │   ├── results/[id]/   # Ergebnis-Seiten
│   │   └── admin/          # Admin Panel
│   └── api/
│       ├── analyze/        # Website-Analyse API
│       ├── leads/          # Lead-Management
│       └── admin/          # Admin APIs
├── components/
│   ├── ui/                 # UI Components
│   ├── funnel/             # Funnel Components
│   └── results/            # Ergebnis Components
├── services/
│   ├── screenshot.ts       # Playwright Screenshots
│   ├── lighthouse.ts       # Performance-Analyse
│   ├── seo-analyzer.ts     # SEO-Checks
│   ├── trust-scanner.ts    # Trust-Faktoren
│   ├── conversion-analyzer.ts  # Conversion-Checks
│   └── score-engine.ts     # Scoring-Logik
├── lib/
│   ├── db.ts               # SQLite Database
│   ├── types.ts            # TypeScript Types
│   └── utils.ts            # Helper Functions
└── messages/
    ├── de.json             # Deutsche Texte
    └── en.json             # Englische Texte
```

## ⚙️ Technologie

- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS**
- **next-intl** (i18n)
- **SQLite** (better-sqlite3)
- **Playwright** (Screenshots)
- **Lighthouse** (Performance)

## 🔧 Umgebungsvariablen

Siehe `.env.local`:

```env
DATABASE_PATH=./data/webcheck360.db
JWT_SECRET=your-secret-key
ADMIN_EMAIL=admin@webcheck360.de
ADMIN_PASSWORD=admin123
```

## 📊 Scoring-Gewichtung

| Kategorie | Gewichtung |
|-----------|------------|
| Performance | 30% |
| Mobile UX | 25% |
| SEO | 20% |
| Trust | 15% |
| Conversion | 10% |

## 🛠️ Entwicklung

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start
```

## 📝 License

MIT
