import type { Profile } from "@/types/audio";

export const profiles: { id: Profile; name: string; description: string; multiplier: number }[] = [
  { id: "cinema", name: "Cinema", description: "Balanced, spacious scene", multiplier: 1 },
  { id: "gaming", name: "Gaming", description: "Sharper directional emphasis", multiplier: 1.12 },
  { id: "music", name: "Music", description: "Slightly wider, softer mix", multiplier: 0.96 },
  { id: "voice", name: "Voice clarity", description: "Prioritise dialogue sources", multiplier: 1.05 },
];

export function profileGain(profile: Profile, sourceName: string, volume: number) {
  const voiceFactor = profile === "voice"
    ? (sourceName.toLowerCase().includes("dialogue") ? 1.65 : 0.45)
    : 1;
  return Math.max(0, Math.min(1, volume * profiles.find(p => p.id === profile)!.multiplier * voiceFactor));
}
