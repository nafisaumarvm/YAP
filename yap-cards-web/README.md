# YAP cards (web)

React + Vite app forked from [munjoonteo/wnrs](https://github.com/munjoonteo/wnrs): same layout and styling patterns, with **YAP** questions in a **single shuffled deck** (no levels).

```bash
cd yap-cards-web
npm install
npm run dev
```

## Visitor question review queue

Visitor-submitted questions use a Netlify form (not injected into the live deck).

Netlify detects a hidden build-time form in `index.html` and receives submissions from the visible form in `App.tsx`.

Review submissions in your Netlify dashboard, then copy approved questions into `src/assets/questions.ts` once daily.

Original WNRS UI and concept by [@munjoonteo](https://github.com/munjoonteo) and [@ilyues](https://github.com/ilyues).
