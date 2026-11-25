import { create } from "zustand";
import type { AudioSource, BuiltinPreset, Profile } from "@/types/audio";

const palette = ["#ffb86b", "#b69cff", "#6ee7b7", "#ff8fab", "#62d8ff", "#ffd166"];
const starter: AudioSource[] = [
  { id: "rain", name: "Rain ambience", kind: "builtin", preset: "rain", emoji: "☂", color: palette[1], x: -2.8, y: 0.3, z: -1.7, volume: 0.28, muted: false, solo: false, enabled: true, trimStart: 0, trimEnd: 1, duration: 1 },
  { id: "wind", name: "Soft wind", kind: "builtin", preset: "wind", emoji: "〰", color: palette[2], x: 2.8, y: 1.2, z: -2.2, volume: 0.2, muted: false, solo: false, enabled: true, trimStart: 0, trimEnd: 1, duration: 1 },
  { id: "drone", name: "Warm drone", kind: "builtin", preset: "drone", emoji: "◉", color: palette[0], x: 3.1, y: 0.1, z: 2.6, volume: 0.18, muted: false, solo: false, enabled: true, trimStart: 0, trimEnd: 1, duration: 1 },
];
type StudioState = {
  sources: AudioSource[]; profile: Profile; masterVolume: number; listenerYaw: number; selectedId: string;
  addSource: (source: AudioSource) => void; updateSource: (id: string, patch: Partial<AudioSource>) => void;
  removeSource: (id: string) => void; selectSource: (id: string) => void;
  setProfile: (profile: Profile) => void; setMasterVolume: (value: number) => void;
  setListenerYaw: (value: number) => void; replaceSources: (sources: AudioSource[]) => void;
  reset: () => void;
};
export const useStudioStore = create<StudioState>((set) => ({
  sources: starter, profile: "cinema", masterVolume: 0.82, listenerYaw: 0, selectedId: "rain",
  addSource: source => set(s => ({ sources: [...s.sources, source], selectedId: source.id })),
  updateSource: (id, patch) => set(s => ({ sources: s.sources.map(item => item.id === id ? { ...item, ...patch } : item) })),
  removeSource: id => set(s => ({ sources: s.sources.filter(item => item.id !== id), selectedId: s.selectedId === id ? (s.sources.find(x => x.id !== id)?.id ?? "") : s.selectedId })),
  selectSource: selectedId => set({ selectedId }),
  setProfile: profile => set({ profile }),
  setMasterVolume: masterVolume => set({ masterVolume }),
  setListenerYaw: listenerYaw => set({ listenerYaw }),
  replaceSources: sources => set({ sources, selectedId: sources[0]?.id ?? "" }),
  reset: () => set({ sources: starter.map(source => ({ ...source })), profile: "cinema", masterVolume: 0.82, listenerYaw: 0, selectedId: "rain" }),
}));
export const sourceColor = (index: number) => palette[index % palette.length];
export const builtinLabel: Record<BuiltinPreset, { name: string; emoji: string; volume: number }> = {
  "soft-tone": { name: "Soft tone", emoji: "♫", volume: 0.16 },
  rain: { name: "Rain ambience", emoji: "☂", volume: 0.25 },
  wind: { name: "Soft wind", emoji: "〰", volume: 0.2 },
  drone: { name: "Warm drone", emoji: "◉", volume: 0.18 },
  engine: { name: "Low engine", emoji: "◆", volume: 0.16 },
  beacon: { name: "Beacon pulse", emoji: "✦", volume: 0.13 },
};
