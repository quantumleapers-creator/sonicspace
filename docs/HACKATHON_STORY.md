# SonicSpace: the two-minute story

## One-line pitch
SonicSpace makes surround sound and the ideas behind Dolby Atmos visible, so people who use immersive audio every day can finally understand how sound can occupy a space around them.

## The problem
We regularly watch films, play games, and listen to music through technologies that can place sound around us or above us. Yet the experience is often hidden behind a settings menu, a logo on a streaming title, or a device specification. The spatial logic is difficult to understand if you can only hear the final result.

## The idea
Put the listener in the middle of a simple 3D room. Represent every sound as a colored object. Let visitors move objects in front of, beside, behind, and above the listener. Then play a simplified headphone demonstration so visitors can connect the visual position with directional audio cues.

## Explain it in under two minutes
1. **Start with the familiar:** Stereo puts sound across left and right.
2. **Introduce surround:** Surround sound adds speakers around the listener, so audio can come from the front, sides, and rear.
3. **Introduce Atmos:** Dolby Atmos is object-based and can include height information. A playback renderer adapts the experience to a supported speaker or headphone setup.
4. **Show the room:** The centre dot represents the listener. Colored dots represent separate sound objects.
5. **Move one:** Drag a dot from the front to the side or behind the listener. Move it higher or lower.
6. **Listen:** Press Play scene and use headphones to hear simplified directional cues.

## What to say during the demo
"Most of us have seen the Dolby Atmos badge or heard surround sound in a film, game, or song. But it can feel like invisible technology. SonicSpace lets you see it. This centre point is the listener, and each dot is a sound. Move a sound and you change where it is placed around the listener. Traditional surround sound is built around speaker channels; Atmos adds object-based placement and height. Our browser demo uses HRTF panning to illustrate direction. It is a teaching model, not an Atmos decoder."

## Honest scope
SonicSpace does not decode Dolby Atmos streams, produce certified Atmos output, or emulate a complete commercial renderer. The Web Audio API HRTF panner is a simplified way to demonstrate directional cues. Perceived height and direction vary with browser, headphones, and listener.
