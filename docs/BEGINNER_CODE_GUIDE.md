# SonicSpace — beginner code guide

## 1. What does the app do?
SonicSpace is a Next.js website with an interactive 3D listening room. It explains surround sound and the ideas behind object-based spatial audio. Each colored marker represents an audio source; the user can move it around the listener, adjust its height, and hear a simplified directional effect.

## 2. The main technologies
- **Next.js:** the framework that runs the website and builds it for production.
- **React:** builds the interface from reusable components.
- **TypeScript:** adds types so many mistakes can be caught before the website runs.
- **Three.js:** draws the 3D room.
- **React Three Fiber:** lets us describe the Three.js scene using React components.
- **Web Audio API:** creates and positions sound in the browser.
- **Zustand:** keeps shared state such as sound positions and volume.
- **Lucide:** provides consistent SVG icons.

## 3. Folder map
- `src/app/layout.tsx`: document metadata, Google Sans Flex font and global stylesheet.
- `src/app/page.tsx`: the home route; renders the Studio component.
- `src/app/globals.css`: visual theme, layout, responsive rules and fullscreen styles.
- `src/components/studio/Studio.tsx`: the main visitor experience, guided explanation and audio controls.
- `src/components/room/RoomScene.tsx`: the 3D room and draggable sound markers.
- `src/components/studio/Waveform.tsx`: waveform-style preview for a selected audio item.
- `src/components/ui/InfoTip.tsx`: accessible explanations for technical terms.
- `src/lib/audio/engine.ts`: Web Audio API graph, HRTF panners, built-in sounds and uploaded audio buffers.
- `src/lib/audio/profiles.ts`: simple listening profile gain adjustments.
- `src/store/useStudioStore.ts`: shared source list, listener controls and selected source.
- `src/types/audio.ts`: TypeScript data shapes.

## 4. How React fits together
The root route in `page.tsx` renders `Studio`. Studio reads and updates the Zustand store. It passes source data to `RoomScene`. RoomScene renders a Canvas and one 3D marker per source. When a marker is dragged, RoomScene reports the new coordinates to Studio, and the store updates. React re-renders the marker at its new position.

## 5. How a sound becomes spatial
The audio engine creates an AudioContext after a user clicks Play. Each source gets a gain node and a PannerNode. The PannerNode uses the browser's HRTF panning model. Its X, Y and Z positions are updated from the source's coordinates. The gain node controls that source's volume. The nodes connect to a master gain, then to the speakers or headphones.

## 6. What HRTF means
HRTF stands for Head-Related Transfer Function. Our ears and head affect sound differently depending on where it comes from. The browser's HRTF panner approximates some of those directional cues for headphones. It is not a complete Atmos rendering system.

## 7. Why audio starts only after a click
Browsers restrict autoplay with sound. SonicSpace waits for the user to press Play, then creates or resumes the AudioContext. This is expected browser behavior.

## 8. Important React concepts
- `useState`: local UI state, such as which tutorial step is open.
- `useEffect`: synchronize React state with browser APIs or the audio engine.
- `useRef`: keep a reference to a DOM element or mutable value without rerendering.
- Props: data and callbacks passed from a parent component to a child component.
- Zustand selectors: read a shared value and update it from multiple components.

## 9. Run and check it
```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
```
Open http://localhost:3000. Test with headphones after pressing Play scene.

## 10. Production scope and limitations
This is a hackathon learning visualization. It is not an Atmos decoder, calibrated speaker renderer, professional DAW, room simulator, or certified audio product. Generated sounds are synthesized in the browser. Uploaded files are decoded locally; project JSON does not embed the audio file bytes.
