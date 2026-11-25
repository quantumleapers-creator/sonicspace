export type Profile = "cinema" | "gaming" | "music" | "voice";
export type SourceKind = "tone" | "builtin" | "file";
export type BuiltinPreset = "soft-tone" | "rain" | "wind" | "drone" | "engine" | "beacon";

export interface AudioSource {
  id: string;
  name: string;
  kind: SourceKind;
  preset?: BuiltinPreset;
  color: string;
  emoji: string;
  x: number;
  y: number;
  z: number;
  volume: number;
  muted: boolean;
  solo: boolean;
  enabled: boolean;
  frequency?: number;
  audioUrl?: string;
  trimStart: number;
  trimEnd: number;
  duration: number;
}
export interface ProjectSnapshot {
  version: 1;
  name: string;
  profile: Profile;
  masterVolume: number;
  listenerYaw: number;
  sources: Omit<AudioSource, "audioUrl">[];
}
