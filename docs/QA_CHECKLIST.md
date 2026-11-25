# SonicSpace QA checklist

## First-time visitor
- [ ] The opening screen clearly explains why SonicSpace exists.
- [ ] A beginner can describe surround sound and Atmos after the two-minute path.
- [ ] Guided steps can be selected with mouse, keyboard and touch.
- [ ] Info tips can be opened by hover, focus and click/tap.

## 3D room
- [ ] The room renders on a modern browser with WebGL support.
- [ ] A selected sound marker is visually distinct.
- [ ] Dragging a source moves only that source.
- [ ] Orbit controls do not move the camera during a source drag.
- [ ] Empty-floor dragging orbits the room.
- [ ] The Immersive view button expands the room only.
- [ ] Escape or the exit button exits immersive view.

## Audio
- [ ] Pressing Play starts audio after a user gesture.
- [ ] Rain, wind, drone, engine and beacon presets produce sound.
- [ ] Moving a source changes the directional cue.
- [ ] Mute, source volume and master volume work.
- [ ] Uploaded audio is decoded locally and can be played.
- [ ] Headphones are recommended and limitations are clearly stated.

## Quality and release
- [ ] `npm run lint` completes without warnings or errors.
- [ ] `npm run typecheck` completes without diagnostics.
- [ ] `npm run build` completes successfully.
- [ ] Test mobile layout at a narrow viewport.
- [ ] Test reduced motion and keyboard focus indicators.
- [ ] Confirm that audio is not uploaded to a server.
- [ ] Confirm README and beginner documentation are up to date.
