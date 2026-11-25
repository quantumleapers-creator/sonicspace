import type { AudioSource, BuiltinPreset, Profile } from "@/types/audio";
import { profileGain } from "./profiles";

type ActiveNodes = {
  panner: PannerNode;
  gain: GainNode;
  oscillators: OscillatorNode[];
  bufferSources: AudioBufferSourceNode[];
  filters: AudioNode[];
  fileSource?: AudioBufferSourceNode;
};

export class SpatialAudioEngine {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private nodes = new Map<string, ActiveNodes>();
  private buffers = new Map<string, AudioBuffer>();
  private noiseBuffer: AudioBuffer | null = null;

  get isReady() { return !!this.context; }

  async start() {
    if (!this.context) {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) throw new Error("Web Audio API is not supported in this browser.");
      this.context = new AudioContextClass();
      this.master = this.context.createGain();
      this.master.gain.value = 0.82;
      this.master.connect(this.context.destination);
    }
    if (this.context.state !== "running") await this.context.resume();
  }

  async decode(file: File) {
    await this.start();
    const buffer = await this.context!.decodeAudioData(await file.arrayBuffer());
    const url = URL.createObjectURL(file);
    this.buffers.set(url, buffer);
    return { url, duration: buffer.duration };
  }

  private getNoiseBuffer() {
    if (!this.context) throw new Error("Audio engine has not started.");
    if (!this.noiseBuffer) {
      const length = this.context.sampleRate * 3;
      const buffer = this.context.createBuffer(1, length, this.context.sampleRate);
      const channel = buffer.getChannelData(0);
      for (let i = 0; i < length; i++) channel[i] = (Math.random() * 2 - 1) * 0.45;
      this.noiseBuffer = buffer;
    }
    return this.noiseBuffer;
  }

  private ensureNodes(source: AudioSource) {
    if (!this.context || !this.master) throw new Error("Audio engine has not started.");
    const existing = this.nodes.get(source.id);
    if (existing) return existing;

    const panner = this.context.createPanner();
    panner.panningModel = "HRTF";
    panner.distanceModel = "inverse";
    panner.refDistance = 1;
    panner.maxDistance = 24;
    panner.rolloffFactor = 0.42;
    const gain = this.context.createGain();
    gain.gain.value = 0;
    gain.connect(panner);
    panner.connect(this.master);
    const entry: ActiveNodes = { panner, gain, oscillators: [], bufferSources: [], filters: [] };
    this.nodes.set(source.id, entry);

    if (source.kind !== "file") this.createBuiltinSound(entry, source.preset ?? "soft-tone", source.frequency ?? 220);
    return entry;
  }

  private createBuiltinSound(entry: ActiveNodes, preset: BuiltinPreset, frequency: number) {
    if (!this.context) return;
    const ctx = this.context;
    const makeOscillator = (type: OscillatorType, hz: number, amplitude = 1) => {
      const osc = ctx.createOscillator();
      const voiceGain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = hz;
      voiceGain.gain.value = amplitude;
      osc.connect(voiceGain);
      voiceGain.connect(entry.gain);
      osc.start();
      entry.oscillators.push(osc);
      entry.filters.push(voiceGain);
    };
    switch (preset) {
      case "rain": {
        const noise = ctx.createBufferSource();
        noise.buffer = this.getNoiseBuffer(); noise.loop = true;
        const high = ctx.createBiquadFilter(); high.type = "highpass"; high.frequency.value = 650;
        const low = ctx.createBiquadFilter(); low.type = "lowpass"; low.frequency.value = 9500;
        noise.connect(high); high.connect(low); low.connect(entry.gain); noise.start();
        entry.bufferSources.push(noise); entry.filters.push(high, low);
        break;
      }
      case "wind": {
        const noise = ctx.createBufferSource(); noise.buffer = this.getNoiseBuffer(); noise.loop = true;
        const low = ctx.createBiquadFilter(); low.type = "lowpass"; low.frequency.value = 430; low.Q.value = 0.8;
        const movement = ctx.createGain(); movement.gain.value = 0.48;
        noise.connect(low); low.connect(movement); movement.connect(entry.gain); noise.start();
        const lfo = ctx.createOscillator(); const lfoDepth = ctx.createGain();
        lfo.frequency.value = 0.13; lfoDepth.gain.value = 0.2; lfo.connect(lfoDepth); lfoDepth.connect(movement.gain); lfo.start();
        entry.bufferSources.push(noise); entry.oscillators.push(lfo); entry.filters.push(low, movement, lfoDepth);
        break;
      }
      case "drone":
        makeOscillator("sine", 82, 0.34);
        makeOscillator("triangle", 123, 0.11);
        break;
      case "engine": {
        const low = ctx.createBiquadFilter(); low.type = "lowpass"; low.frequency.value = 250;
        const osc = ctx.createOscillator(); osc.type = "sawtooth"; osc.frequency.value = 58;
        const voiceGain = ctx.createGain(); voiceGain.gain.value = 0.27;
        osc.connect(low); low.connect(voiceGain); voiceGain.connect(entry.gain); osc.start();
        const lfo = ctx.createOscillator(); const depth = ctx.createGain(); lfo.frequency.value = 0.55; depth.gain.value = 7;
        lfo.connect(depth); depth.connect(osc.frequency); lfo.start();
        entry.oscillators.push(osc, lfo); entry.filters.push(low, voiceGain, depth);
        break;
      }
      case "beacon": {
        const osc = ctx.createOscillator(); osc.type = "triangle"; osc.frequency.value = 660;
        const pulse = ctx.createGain(); pulse.gain.value = 0.08;
        osc.connect(pulse); pulse.connect(entry.gain); osc.start();
        const lfo = ctx.createOscillator(); const depth = ctx.createGain(); lfo.frequency.value = 1.4; depth.gain.value = 0.07;
        lfo.connect(depth); depth.connect(pulse.gain); lfo.start();
        entry.oscillators.push(osc, lfo); entry.filters.push(pulse, depth);
        break;
      }
      case "soft-tone":
      default:
        makeOscillator("sine", frequency, 0.42);
        break;
    }
  }

  setMasterVolume(value: number) {
    if (this.master && this.context) this.master.gain.setTargetAtTime(value, this.context.currentTime, 0.04);
  }

  private setPosition(entry: ActiveNodes, source: AudioSource, listenerYaw: number) {
    if (!this.context) return;
    const yaw = listenerYaw * Math.PI / 180;
    const rotatedX = source.x * Math.cos(yaw) - source.z * Math.sin(yaw);
    const rotatedZ = source.x * Math.sin(yaw) + source.z * Math.cos(yaw);
    entry.panner.positionX.setTargetAtTime(rotatedX, this.context.currentTime, 0.035);
    entry.panner.positionY.setTargetAtTime(source.y, this.context.currentTime, 0.035);
    entry.panner.positionZ.setTargetAtTime(rotatedZ, this.context.currentTime, 0.035);
  }

  syncSource(source: AudioSource, profile: Profile, listenerYaw: number) {
    if (!this.context) return;
    const entry = this.ensureNodes(source);
    this.setPosition(entry, source, listenerYaw);
    if (entry.fileSource && source.kind === "file" && source.audioUrl) {
      const buffer = this.buffers.get(source.audioUrl);
      if (buffer) {
        entry.fileSource.loopStart = Math.max(0, Math.min(source.trimStart, buffer.duration));
        entry.fileSource.loopEnd = Math.max(entry.fileSource.loopStart + 0.02, Math.min(source.trimEnd || buffer.duration, buffer.duration));
      }
    }
    const level = source.enabled && !source.muted ? profileGain(profile, source.name, source.volume) : 0;
    entry.gain.gain.setTargetAtTime(level, this.context.currentTime, 0.045);
  }

  playFile(source: AudioSource, profile: Profile, listenerYaw: number) {
    if (!this.context || !source.audioUrl) return;
    const buffer = this.buffers.get(source.audioUrl);
    if (!buffer) return;
    const entry = this.ensureNodes(source);
    if (entry.fileSource) { try { entry.fileSource.stop(); } catch { /* already stopped */ } }
    const fileSource = this.context.createBufferSource();
    fileSource.buffer = buffer;
    fileSource.loop = true;
    const start = Math.max(0, Math.min(source.trimStart, buffer.duration));
    const end = Math.max(start + 0.02, Math.min(source.trimEnd || buffer.duration, buffer.duration));
    fileSource.loopStart = start;
    fileSource.loopEnd = end;
    fileSource.connect(entry.gain);
    fileSource.start(0, start);
    entry.fileSource = fileSource;
    entry.bufferSources.push(fileSource);
    this.syncSource(source, profile, listenerYaw);
  }

  stopSource(id: string) {
    const entry = this.nodes.get(id);
    if (!entry) return;
    entry.oscillators.forEach(node => { try { node.stop(); } catch { /* already stopped */ } });
    entry.bufferSources.forEach(node => { try { node.stop(); } catch { /* already stopped */ } });
    entry.filters.forEach(node => { try { node.disconnect(); } catch { /* already disconnected */ } });
    entry.gain.disconnect();
    entry.panner.disconnect();
    this.nodes.delete(id);
  }

  stopAll() { Array.from(this.nodes.keys()).forEach(id => this.stopSource(id)); }

  dispose() {
    this.stopAll();
    this.buffers.forEach((_, url) => URL.revokeObjectURL(url));
    this.buffers.clear();
    this.context?.close();
    this.context = null;
    this.master = null;
    this.noiseBuffer = null;
  }
}
