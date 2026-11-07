# Void Matter Online

Personal web game hosted on [Firebase Hosting](https://firebase.google.com/docs/hosting).

- **GCP / Firebase project ID:** `void-matter-online` (personal Google account `cajmyers@gmail.com`)
- **Static site:** `public/` → deploy with Firebase CLI

## One-time Firebase CLI (personal account)

Work Firebase login (`cmyers@telana.com`) cannot manage this project. Once per machine:

```bash
~/dev/projects/personal/setup-firebase-once.sh
```

## Local preview

```bash
firebase emulators:start --only hosting
# or
npx --yes serve public
```

## Deploy

From this directory (under `~/dev/projects/personal/` so gcloud + Firebase use personal credentials):

```bash
firebase deploy --only hosting
```

Live URL after first deploy: `https://void-matter-online.web.app` (and `.firebaseapp.com`).

## License

Private — all rights reserved unless otherwise noted.
