# SonicSpace — interview preparation

## A simple explanation to memorise
"SonicSpace is an interactive learning website that helps people understand surround sound and the ideas behind Dolby Atmos. It visualizes a listener in a 3D room and represents separate sounds as movable objects. Visitors can change a sound's position and hear a simplified directional cue through headphones. The goal is to make an everyday technology easier to understand."

## 20 likely questions and beginner-friendly answers

1. **What problem are you solving?** Spatial audio is common in entertainment, but its technical ideas are hidden from everyday users. We make them visual and interactive.
2. **Why did you choose this topic?** People encounter immersive audio in films, games, music and devices without necessarily understanding it.
3. **What is stereo?** A common two-channel format that places sound across left and right.
4. **What is surround sound?** Audio arranged to come from speakers positioned around the listener.
5. **What is Dolby Atmos?** An immersive, object-based audio format that can include height information and is rendered for supported playback systems.
6. **Is SonicSpace Dolby Atmos?** No. It is an educational visualization of spatial-audio concepts, not a decoder or certified renderer.
7. **What is an audio object?** A sound with associated position information that can be placed within a 3D listening space.
8. **What is HRTF?** A model of how the listener's head and ears change sound based on its direction.
9. **Why use headphones?** The Web Audio API's HRTF panner is designed to create directional cues that are easier to explore over headphones.
10. **Why is it interactive?** Moving a source lets visitors connect a visual change in position with the idea of directional audio.
11. **Why Next.js?** It provides a React application framework, routing, metadata and production build tooling.
12. **Why TypeScript?** It makes data shapes explicit and catches many mistakes before runtime.
13. **Why React Three Fiber?** It lets us build the 3D scene with React components and state.
14. **What is Three.js?** A JavaScript 3D library that renders graphics using WebGL.
15. **What is Zustand?** A small state-management library used to share scene state between components.
16. **What does the audio engine do?** It creates an AudioContext, source nodes, gain nodes and position-aware panner nodes.
17. **Why does audio need a button click?** Browsers generally block sound autoplay until a user gesture.
18. **How do you handle dragging?** The marker captures pointer input and camera orbit controls are disabled while that marker is being dragged.
19. **What happens to uploaded audio?** The browser decodes it locally. The project does not send audio files to a server.
20. **What would you add next?** More educational comparisons, accurate speaker-layout examples, accessibility improvements and additional listening experiments.

## Demo checklist
- Load the homepage and deliver the one-minute project pitch.
- Explain stereo, surround and Atmos in plain language.
- Select a colored sound object and move it.
- Adjust height.
- Start audio with headphones.
- Show the immersive room button.
- Open a hover or focus help tip.
- Explain that the demo is a simplified learning model, not an Atmos renderer.

## Avoid overclaiming
Say "illustrates spatial audio ideas", "simplified HRTF directional cues", and "educational prototype". Do not say that this website decodes Dolby Atmos, guarantees true overhead perception, or reproduces a certified Atmos mix.
