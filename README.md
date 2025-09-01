# EduPage Rozvrh (Node.js + Vercel)

Moderní webová aplikace pro zobrazení rozvrhu třídy z EduPage.

## Funkce
- Moderní design, defaultně dark mode
- Režim "dnešek" (zobrazuje jen dnešní hodiny, od 18:00 automaticky další den)
- Týdenní režim (přepínání tlačítkem)
- Překlady předmětů, učitelů, učeben přes `translate.json`
- Automatické zvýraznění aktuální hodiny
- PWA podpora (možnost uložit jako aplikaci)

## Lokální spuštění

1. Nainstalujte závislosti:
   ```bash
   npm install
   ```
2. Spusťte server (např. pomocí Vercel CLI nebo `node`):
   ```bash
   vercel dev
   ```
   nebo
   ```bash
   node api/rozvrh.js
   ```
3. Otevřete `index.html` v prohlížeči.

## Překlady

Překlady ID na názvy předmětů, učitelů a učeben se nastavují v souboru `translate.json`:
```json
{
  "subject_-79": "Tělocvik",
  "teacher_-79": "Mgr. Nováková",
  "classroom_-96": "Tělocvična"
}
```

## PWA
Pro možnost "Uložit jako aplikaci" v Chrome je přiložen manifest (`manifest.json`).

## Autor
Adam Hornof
