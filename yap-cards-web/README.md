# YAP cards (web)

React + Vite app forked from [munjoonteo/wnrs](https://github.com/munjoonteo/wnrs): same layout and styling patterns, with **YAP** questions in a **single shuffled deck** (no levels).

```bash
cd yap-cards-web
npm install
npm run dev
```

## Visitor question review queue

Visitor-submitted questions are sent to an external endpoint (not injected into the live deck).

1. Copy env template:
   ```bash
   cp env.sample .env
   ```
2. Set `VITE_QUESTION_SUBMIT_URL` to your webhook URL.
3. The app will POST JSON:
   ```json
   {
     "question": "string",
     "submittedAt": "ISO-8601 timestamp"
   }
   ```

For Google Sheets, use a Google Apps Script Web App URL as the endpoint, review submissions in-sheet, then copy approved questions into `src/assets/questions.ts` once daily.

Original WNRS UI and concept by [@munjoonteo](https://github.com/munjoonteo) and [@ilyues](https://github.com/ilyues).
