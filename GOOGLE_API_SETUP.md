# 🔑 Google PageSpeed Insights API Setup

## Schritt 1: API Key erstellen

### 1. Google Cloud Console öffnen
Gehen Sie zu: https://console.cloud.google.com/

### 2. Neues Projekt erstellen (oder bestehendes wählen)
- Klicken Sie oben links auf das Dropdown
- "Neues Projekt"
- Name: **WebCheck360**
- Erstellen

### 3. PageSpeed Insights API aktivieren
1. Gehen Sie zu: https://console.cloud.google.com/apis/library/pagespeedonline.googleapis.com
2. Klicken Sie auf **"AKTIVIEREN"**
3. Warten Sie ~30 Sekunden bis aktiviert

### 4. API Key erstellen
1. Gehen Sie zu: https://console.cloud.google.com/apis/credentials
2. Klicken Sie **"+ ZUGANGSDATEN ERSTELLEN"** → **"API-Schlüssel"**
3. **WICHTIG:** API-Schlüssel wird angezeigt → **KOPIEREN SIE IHN!**

### 5. API Key einschränken (WICHTIG für Sicherheit!)
1. Klicken Sie auf den neu erstellten API Key
2. Unter **"Anwendungsbeschränkungen"**:
   - Wählen Sie **"HTTP-Referrer (Websites)"**
   - Fügen Sie hinzu:
     ```
     https://www.webcheck360.de/*
     https://webcheck360.de/*
     http://localhost:3000/*
     ```

3. Unter **"API-Beschränkungen"**:
   - Wählen Sie **"APIs beschränken"**
   - Wählen Sie nur: **PageSpeed Insights API**
   
4. Klicken Sie **"SPEICHERN"**

---

## Schritt 2: API Key in Projekt einfügen

### 1. `.env.local` Datei öffnen/erstellen
Datei: `/Users/mikegehrke/dev/WebCheck360/.env.local`

```bash
# Google PageSpeed Insights API Key
GOOGLE_PAGESPEED_API_KEY=IHR_API_KEY_HIER
```

### 2. `.env.local` zu `.gitignore` hinzufügen
**BEREITS ERLEDIGT** ✅ (Next.js ignoriert .env.local automatisch)

---

## Schritt 3: API nutzen

Die API ist bereits in Ihrer App eingebunden:

**Datei:** `services/lighthouse.ts`

```typescript
const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
const url = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&category=performance&category=accessibility&category=best-practices&category=seo&strategy=mobile${apiKey ? `&key=${apiKey}` : ''}`;
```

**Mit API Key:**
- ✅ 25.000 Anfragen/Tag (kostenlos)
- ✅ Keine Rate Limits
- ✅ Stabile Performance

**Ohne API Key:**
- ❌ Nur 100 Anfragen/Tag
- ❌ Schnelle Rate Limits
- ❌ IP-basierte Blockierung möglich

---

## Schritt 4: API Key testen

### 1. Server neu starten
```bash
# Terminal stoppen (Ctrl+C)
npm run dev
```

### 2. Test durchführen
1. Gehen Sie zu: http://localhost:3000
2. Geben Sie eine URL ein
3. Starten Sie die Analyse
4. **Prüfen Sie in der Console:**
   - ✅ API Key wird genutzt: "Using Google API Key"
   - ❌ Kein API Key: "No API key found, using rate-limited endpoint"

### 3. Logs prüfen (Terminal)
Sie sollten sehen:
```
✓ Compiled /api/analyze in 1234ms
→ PageSpeed API Request: https://www.googleapis.com/pagespeedonline/v5/runPagespeed?...&key=AIza...
```

---

## Schritt 5: Vercel Environment Variables (für Production)

### 1. Vercel Dashboard öffnen
https://vercel.com/mikegehrke/webcheck360/settings/environment-variables

### 2. Environment Variable hinzufügen
- **Key:** `GOOGLE_PAGESPEED_API_KEY`
- **Value:** `Ihr_API_Key_hier`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development
- Klicken Sie **"Save"**

### 3. Redeploy auslösen
```bash
git commit --allow-empty -m "Trigger redeploy for API key"
git push
```

Oder im Vercel Dashboard: **"Deployments"** → **"..."** → **"Redeploy"**

---

## 📊 API Quota überwachen

### Google Cloud Console
https://console.cloud.google.com/apis/api/pagespeedonline.googleapis.com/quotas

Hier sehen Sie:
- **Anfragen heute:** z.B. 523 / 25.000
- **Fehler:** 0
- **Durchschnittliche Latenz:** ~2.5s

### Quota erhöhen (falls nötig)
- Kostenlos: 25.000/Tag
- Kostenpflichtig: Bis zu 400.000/Tag
- Antrag über Google Cloud Console

---

## ⚠️ Troubleshooting

### "API key not valid"
→ Prüfen Sie API-Beschränkungen (Schritt 1.5)
→ Warten Sie 5 Minuten nach Änderungen

### "Quota exceeded"
→ Sie haben 25.000 Anfragen/Tag überschritten
→ Warten Sie bis Mitternacht (Pacific Time)

### "API not enabled"
→ PageSpeed Insights API aktivieren (Schritt 1.3)

### "Referrer not allowed"
→ HTTP-Referrer in API Key Einstellungen prüfen (Schritt 1.5)

---

## 🎯 Best Practices

✅ **DO:**
- API Key in `.env.local` speichern
- HTTP-Referrer Einschränkungen nutzen
- Nur PageSpeed Insights API erlauben
- Quota regelmäßig überwachen

❌ **DON'T:**
- API Key in Git committen
- Uneingeschränkte API Keys verwenden
- API Key in Frontend-Code einbetten
- Mehrere ungenutzte API Keys erstellen

---

## 📞 Support

**Google Cloud Support:**
https://cloud.google.com/support

**PageSpeed Insights API Docs:**
https://developers.google.com/speed/docs/insights/v5/get-started

**WebCheck360 API Code:**
`/services/lighthouse.ts` (Zeile ~50)

---

**✅ Nach Setup:**
- [ ] API Key erstellt
- [ ] API Key eingeschränkt
- [ ] `.env.local` erstellt
- [ ] Lokal getestet
- [ ] Vercel Environment Variable gesetzt
- [ ] Production getestet
