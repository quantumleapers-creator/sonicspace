# Deployment

## Vercel
1. Connect the GitHub repository to a Vercel project.
2. Framework preset: Next.js.
3. Root directory: repository root.
4. Install command: `npm install` (or `npm ci` when a package-lock is committed).
5. Build command: `npm run build`.
6. No environment variables are required for the current browser-only demo.
7. Deploy the `main` branch to production and test the resulting HTTPS URL.

## Local verification
```bash
npm install
npm run lint
npm run typecheck
npm run build
npm start
```

## Notes
The Web Audio API runs in the visitor's browser. It needs a user gesture to start. No server-side audio processing or upload storage is configured.
