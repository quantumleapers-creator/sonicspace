# SonicSpace — See what you hear

SonicSpace is a hackathon learning demo that makes surround sound and the ideas behind Dolby Atmos easier to understand. Its central question is simple: **what if people could see where sounds are placed instead of only hearing the result?**

A visitor can explore a 3D listening room, move individual sound markers around a listener, raise a sound above ear level, and listen to a simplified browser-based spatial-audio effect.

> **Important scope note:** SonicSpace is an educational visualization, not a Dolby Atmos decoder, bitstream renderer, certified playback system, or replacement for supported Atmos content and hardware. Its headphone demonstration uses the browser Web Audio API's HRTF panner to illustrate directional cues.

## The idea in under two minutes

- **Stereo:** sound is mainly placed across a left-to-right line.
- **Surround sound:** sound can be placed around a listener using channels assigned to speakers around the room.
- **Dolby Atmos:** an object-based immersive format that lets creators position sounds in 3D space, including height; the playback renderer adapts that information to supported speaker or headphone setups.
- **Why SonicSpace exists:** the technology is often experienced through films, games, music and headphones without people seeing the spatial logic behind it. This project turns that hidden idea into an interactive visual explanation.

## What visitors can do

1. Read the short explanation on the opening screen.
2. Follow the three-step guide: choose a sound, give it a place, and listen.
3. Drag a colored sound marker around the listener.
4. Change its height above or below ear level.
5. Press **Play scene** and use headphones to explore the simplified spatial cues.
6. Select **Immersive view** inside the 3D room to expand only the visualization to fullscreen. Press Escape or use **Exit immersive view** to return.
7. Hover, focus or tap the information icons to reveal plain-language explanations.
8. Add generated sounds or upload an audio file.

## Tech stack

- **Next.js 16 / React 19 / TypeScript** — application framework and UI.
- **React Three Fiber / Three.js** — interactive 3D room.
- **Web Audio API** — generated sound sources, gain controls and HRTF panning.
- **Zustand** — shared state for sound positions and controls.
- **Google Sans Flex** — Google’s open-source variable typeface, loaded from Google Fonts with a system sans-serif fallback.
- **Lucide React** — lightweight SVG icons with consistent sizing and accessible labels; a custom SVG app icon provides branded browser identity.

## Requirements

- Node.js 22 (see `.nvmrc`; Next.js 16 requires Node.js 20.9 or newer)
- npm 10+
- A modern desktop browser with Web Audio API and WebGL support
- Headphones recommended for the spatial listening experiment

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`, then press **Play scene**. Browsers require a direct user gesture before they allow audio playback.

## Production build

```bash
npm run typecheck
npm run lint
npm run build
npm start
```

Commit the generated `package-lock.json` after running `npm install` so the CI and Vercel builds resolve the exact same dependency tree.

## Deploy to Vercel

1. Push this repository to GitHub.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Select the Next.js framework preset.
4. Use `npm run build` as the build command. No environment variables are required for the current demo.
5. Deploy and test the public HTTPS URL with headphones.

## Project structure

```text
src/
├── app/
│   ├── layout.tsx             # page metadata and root layout
│   ├── page.tsx               # main route
│   └── globals.css            # typography, theme and responsive layout
├── components/
│   ├── room/RoomScene.tsx     # 3D room and draggable sound markers
│   ├── studio/Studio.tsx      # story, guided tour and interactive controls
│   ├── studio/Waveform.tsx    # waveform preview for uploaded files
│   └── ui/InfoTip.tsx         # accessible hover/focus explanations
├── lib/audio/                 # browser audio engine and listening profiles
├── store/                     # shared application state
└── types/                      # TypeScript data contracts

docs/
├── HACKATHON_STORY.md         # two-minute pitch and visitor journey
├── BEGINNER_CODE_GUIDE.md     # beginner code walkthrough
├── INTERVIEW_PREP.md          # interview question practice
└── QA_CHECKLIST.md            # release test checklist
```

## Honest limitations

- Audio files are decoded and played locally in the browser. The project does not upload them to a server.
- Scene JSON export stores settings, not the actual bytes of uploaded audio files.
- The 3D room is a teaching visualization. The audio engine provides simplified HRTF direction cues; it does not model measured room reflections, occlusion, speaker calibration or the full Dolby Atmos rendering pipeline.
- The height slider changes the visual object's Y position and passes that coordinate to the browser panner. Perceived height varies by browser, device and listener.
- The starter effects are generated using Web Audio nodes, not professional field recordings.
- Google Sans Flex is requested from Google Fonts at runtime; if that connection is unavailable, the UI falls back to system sans-serif fonts.

## Documentation

See `docs/HACKATHON_STORY.md` for the short pitch and visitor journey, `docs/BEGINNER_CODE_GUIDE.md` for the code walkthrough, `docs/INTERVIEW_PREP.md` for interview preparation, and `docs/QA_CHECKLIST.md` for final testing.
