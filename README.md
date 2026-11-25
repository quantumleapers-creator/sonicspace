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

## Explore the experience

Open the live demo: **[SonicSpace](https://sonicspace-hackathon639-7445.vercel.app)**

1. Start with the two-minute introduction to surround sound and Dolby Atmos.
2. Follow the three-step guide to choose a sound, position it in the room, and listen.
3. Drag the colored sound objects around the listener, including above and below ear level.
4. Use **Immersive view** to expand the 3D room.
5. Hover over, focus, or tap the information icons to learn what each concept and control means.

Headphones are recommended for the listening demonstration. Audio starts only after you press **Play scene**.

## What to understand

SonicSpace is an educational visualization of spatial-audio ideas. It demonstrates how sounds can be placed around a listener and how object-based audio can include height. It is not a Dolby Atmos decoder or certified renderer; its headphone demonstration uses simplified browser-based HRTF positioning.

## Technology

Built with Next.js, React, TypeScript, Three.js / React Three Fiber, the Web Audio API, and Zustand.
