"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AudioLines, ArrowDown, ArrowRight, ArrowUp, Check, ChevronRight, CircleHelp, Download,
  Clapperboard, CloudRain, Gamepad2, Headphones, Info, Maximize2, Minimize2,
  Music2, Pause, Play, Plus, RadioTower, RotateCcw, Smartphone, Sparkles,
  Move3d, Upload, Volume2, VolumeX, Waves, Wind, X,
} from "lucide-react";
import RoomScene from "@/components/room/RoomScene";
import Waveform from "./Waveform";
import InfoTip from "@/components/ui/InfoTip";
import { useStudioStore, sourceColor, builtinLabel } from "@/store/useStudioStore";
import { SpatialAudioEngine } from "@/lib/audio/engine";
import type { BuiltinPreset, ProjectSnapshot } from "@/types/audio";

const engine = new SpatialAudioEngine();
const uid = () => `source-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const tourSteps = [
  {
    title: "Choose a sound",
    short: "Every dot is one sound",
    detail: "Pick rain, wind or an engine. In a real film or game, each dot could be dialogue, footsteps, a passing car or music.",
    action: "Select a sound in the room or add one from the sound library.",
    icon: AudioLines,
  },
  {
    title: "Give it a place",
    short: "Move sound around you",
    detail: "Drag a colored dot in front of, beside or behind the listener. Use the height control to move it above or below ear level.",
    action: "Drag one colored dot, then try the height slider below the scene.",
    icon: Move3d,
  },
  {
    title: "Hear the space",
    short: "Listen for direction",
    detail: "Start the scene and use headphones. The browser's HRTF panner creates a simplified directional effect so you can hear why position matters.",
    action: "Press Play scene. Move a dot while listening and notice the direction change.",
    icon: Headphones,
  },
];


export default function Studio() {
  const { sources, profile, masterVolume, listenerYaw, selectedId, addSource, updateSource, removeSource, selectSource, setProfile, setMasterVolume, setListenerYaw, replaceSources, reset } = useStudioStore();
  const [playing, setPlaying] = useState(false);
  const [status, setStatus] = useState("Ready to explore");
  const [projectName, setProjectName] = useState("SonicSpace demo");
  const [notice, setNotice] = useState("Choose a sound, move it, then listen.");
  const [tourStep, setTourStep] = useState(0);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const appRef = useRef<HTMLElement>(null);
  const selected = sources.find(s => s.id === selectedId) ?? sources[0];
  const hasSolo = sources.some(s => s.solo);
  const liveSources = useMemo(() => sources.map(s => ({ ...s, enabled: s.enabled && (!hasSolo || s.solo) })), [sources, hasSolo]);

  useEffect(() => {
    if (!playing) return;
    liveSources.forEach(source => engine.syncSource(source, profile, listenerYaw));
    engine.setMasterVolume(masterVolume);
  }, [liveSources, profile, listenerYaw, masterVolume, playing]);

  useEffect(() => {
    const updateFullscreen = () => setIsFullscreen(document.fullscreenElement === appRef.current);
    document.addEventListener("fullscreenchange", updateFullscreen);
    return () => document.removeEventListener("fullscreenchange", updateFullscreen);
  }, []);

  useEffect(() => () => engine.dispose(), []);

  const start = async () => {
    try {
      await engine.start();
      liveSources.forEach(source => {
        engine.syncSource(source, profile, listenerYaw);
        if (source.kind === "file") engine.playFile(source, profile, listenerYaw);
      });
      engine.setMasterVolume(masterVolume);
      setPlaying(true);
      setStatus("Playing");
      setNotice("Now move a sound marker and listen for its direction.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Audio could not start. Try another browser.");
    }
  };

  const pause = () => {
    engine.stopAll();
    setPlaying(false);
    setStatus("Paused");
    setNotice("Paused. Press Play scene to listen again.");
  };

  const addBuiltin = (preset: BuiltinPreset) => {
    const id = uid();
    const meta = builtinLabel[preset];
    addSource({ id, name: meta.name, kind: "builtin", preset, emoji: meta.emoji, color: sourceColor(sources.length),
      x: Number(((Math.random() - 0.5) * 6).toFixed(1)), y: 0.3,
      z: Number(((Math.random() - 0.5) * 6).toFixed(1)), volume: meta.volume,
      muted: false, solo: false, enabled: true, frequency: 220, trimStart: 0, trimEnd: 1, duration: 1 });
    setNotice(`${meta.name} added. Select its dot to explore its position.`);
    setTourStep(0);
  };

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement === appRef.current) await document.exitFullscreen();
      else await appRef.current?.requestFullscreen();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Fullscreen is unavailable in this browser.");
    }
  };

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    try {
      await engine.start();
      let count = 0;
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("audio/")) continue;
        const { url, duration } = await engine.decode(file);
        const id = uid();
        addSource({ id, name: file.name.replace(/\.[^.]+$/, "").slice(0, 32) || "Audio file", kind: "file", emoji: "♫", color: sourceColor(sources.length + count), x: (Math.random() - .5) * 6, y: 0, z: (Math.random() - .5) * 6, volume: .2, muted: false, solo: false, enabled: true, audioUrl: url, trimStart: 0, trimEnd: duration, duration });
        count++;
      }
      setNotice(count ? `${count} sound file${count === 1 ? "" : "s"} added in this browser.` : "Choose a supported audio file to add it to the scene.");
      if (playing && count) {
        const latest = useStudioStore.getState().sources.slice(-count);
        latest.forEach(source => engine.playFile(source, profile, listenerYaw));
      }
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Audio upload failed.");
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const saveProject = () => {
    const snapshotSources: ProjectSnapshot["sources"] = sources.map(source => {
      const serializableSource = { ...source };
      delete serializableSource.audioUrl;
      return serializableSource;
    });
    const snapshot: ProjectSnapshot = { version: 1, name: projectName, profile, masterVolume, listenerYaw, sources: snapshotSources };
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "sonicspace-scene.json"; a.click();
    URL.revokeObjectURL(url);
    setNotice("Scene settings exported. Uploaded sound files are not included.");
  };

  };

  const loadProject = async (file: File) => {
    try {
      const data = JSON.parse(await file.text()) as ProjectSnapshot;
      if (data.version !== 1 || !Array.isArray(data.sources)) throw new Error("This scene file version is not supported.");
      if (playing) pause();
      replaceSources(data.sources.map(s => ({ ...s, audioUrl: undefined, kind: s.kind === "file" ? "builtin" as const : s.kind, preset: s.preset ?? "soft-tone" as const })));
      setProjectName(data.name || "Imported scene"); setProfile(data.profile || "cinema");
      setMasterVolume(data.masterVolume ?? .78); setListenerYaw(data.listenerYaw ?? 0);
      setNotice("Scene settings imported. Add uploaded sound files again if needed.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not import this scene.");
    }
  };

  const goToTourStep = (step: number) => {
    setTourStep(step);
    if (step === 0 && sources[0]) selectSource(sources[0].id);
    if (step === 1 && sources[0]) selectSource(sources[0].id);
    document.getElementById("sound-room")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return <main ref={appRef} className={`app-shell ${isFullscreen ? "fullscreen-active" : ""}`}>
    <header className="topbar glass">
      <div className="brandmark">
        <div className="logo"><AudioLines size={23} aria-hidden="true" /></div>
        <div><h1>SonicSpace</h1><span>See what you hear</span></div>
      </div>
      <div className="header-message"><span className="status-dot" /> {status}</div>
      <div className="top-actions">
        <button className="icon-button" title="Restart the scene" aria-label="Restart the scene" onClick={() => { pause(); reset(); setTourStep(0); setNotice("Scene reset. Rain, wind and a warm tone are ready to explore."); }}><RotateCcw size={17} /></button>
        <label className="icon-button" title="Import a saved scene" aria-label="Import a saved scene"><Upload size={17} /><input hidden type="file" accept="application/json,.json" onChange={e => e.target.files?.[0] && loadProject(e.target.files[0])} /></label>
        <button className="icon-button" title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"} aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"} onClick={toggleFullscreen}>{isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}</button>
      </div>
    </header>

    <section className="story-hero" aria-labelledby="story-title">
      <div className="story-copy">
        <div className="eyebrow"><Sparkles size={14} /> THE SOUND AROUND YOU</div>
        <h2 id="story-title">Sound doesn&apos;t stop at <span>left and right.</span></h2>
        <p className="story-lead">Surround sound puts audio around you. <strong>Dolby Atmos adds height and treats individual sounds like objects that can move through 3D space.</strong> SonicSpace makes that invisible technology visible, so anyone can understand what they may already hear in films, music and games.</p>
        <div className="story-actions">
          <button className="hero-cta" onClick={() => document.getElementById("quick-tour")?.scrollIntoView({ behavior: "smooth", block: "center" })}>Explore it in 2 minutes <ArrowDown size={16} /></button>
          <span className="hero-footnote"><Headphones size={14} /> Headphones recommended for the listening demo</span>
        </div>
        <div className="story-note"><Info size={14} /> A learning prototype: it visualizes spatial-audio ideas; it is not a Dolby Atmos decoder or certified renderer.</div>
      </div>

      <div className="hero-visual" aria-label="Illustration of sounds positioned around and above a listener">
        <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" />
        <div className="orbit-center"><Headphones size={32} /></div>
        <div className="orbit-node node-front"><AudioLines size={17} /><span>Front</span></div>
        <div className="orbit-node node-left"><Waves size={17} /><span>Side</span></div>
        <div className="orbit-node node-back"><CloudRain size={17} /><span>Behind</span></div>
        <div className="orbit-node node-above"><ArrowUp size={18} /><span>Above</span></div>
        <div className="visual-caption">One listener · sound from every direction</div>
      </div>
    </section>

    <section className="concept-row" aria-label="The difference between surround sound and Dolby Atmos">
      <article className="concept-card glass">
        <div className="concept-icon surround-icon"><RadioTower size={21} /></div>
        <div className="concept-copy"><div className="concept-kicker">SURROUND SOUND <InfoTip title="Surround sound">Traditional surround formats use channels mapped to speakers placed around the listening position, such as front, side and rear speakers.</InfoTip></div><h3>Sound wraps around you</h3><p>Instead of only left and right, speakers around the room create a sense of space.</p></div>
      </article>
      <article className="concept-card glass">
        <div className="concept-icon atmos-icon"><Sparkles size={21} /></div>
        <div className="concept-copy"><div className="concept-kicker">DOLBY ATMOS <InfoTip title="Dolby Atmos">Atmos is an object-based immersive format. Sounds can carry position information, including height, and the playback system renders them for a supported speaker or headphone setup.</InfoTip></div><h3>Sound can move above you</h3><p>Individual sound objects can be placed and moved in 3D, including overhead.</p></div>
      </article>
    </section>

    <section className="everyday-strip" aria-label="Everyday places you may encounter spatial audio">
      <div className="everyday-heading"><span className="eyebrow">YOU MAY ALREADY HEAR IT</span><h3>Hidden in everyday entertainment</h3></div>
      <div className="everyday-item"><span className="everyday-icon film"><Clapperboard size={17} /></span><span><b>Films & TV</b><small>Rain overhead. A vehicle behind you.</small></span></div>
      <div className="everyday-item"><span className="everyday-icon games"><Gamepad2 size={17} /></span><span><b>Games</b><small>Footsteps, movement and distant action.</small></span></div>
      <div className="everyday-item"><span className="everyday-icon music"><Music2 size={17} /></span><span><b>Music & headphones</b><small>Instruments and voices with a sense of space.</small></span></div>
      <div className="everyday-item"><span className="everyday-icon mobile"><Smartphone size={17} /></span><span><b>On the go</b><small>Supported phones, apps and content.</small></span></div>
    </section>

    <section className="tour-panel glass" id="quick-tour" aria-labelledby="tour-title">
      <div className="tour-heading"><div><span className="eyebrow">A 3-STEP EXPERIMENT</span><h3 id="tour-title">See how spatial sound works</h3><p>No audio engineering knowledge needed.</p></div><div className="tour-count">{tourStep + 1}<span>/ 3</span></div></div>
      <div className="tour-steps">
        {tourSteps.map((step, index) => {
          const StepIcon = step.icon;
          return <button key={step.title} className={`tour-step ${tourStep === index ? "active" : ""} ${tourStep > index ? "complete" : ""}`} onClick={() => goToTourStep(index)} aria-current={tourStep === index ? "step" : undefined}>
            <span className="tour-step-icon">{tourStep > index ? <Check size={18} /> : <StepIcon size={18} />}</span>
            <span className="tour-step-text"><b>{index + 1}. {step.title}</b><small>{step.short}</small></span>
            <ChevronRight className="tour-chevron" size={16} />
          </button>;
        })}
      </div>
      <div className="tour-detail"><div><b>{tourSteps[tourStep].title}: </b>{tourSteps[tourStep].detail}<div className="tour-action-copy">{tourSteps[tourStep].action}</div></div><button className="tour-next" onClick={() => goToTourStep((tourStep + 1) % tourSteps.length)}>{tourStep === 2 ? "Start again" : "Next step"} <ArrowRight size={15} /></button></div>
    </section>

    <section className="workspace" id="sound-room">
      <div className="room-panel glass">
        <div className="panel-heading"><div><div className="panel-title-row"><h2>Explore the sound room</h2><InfoTip title="What am I looking at?">The glowing centre is you, the listener. Each colored dot is a separate sound. Move the dots around the room to see how direction changes.</InfoTip></div><p>Pick a colored dot and drag it around the listener.</p></div><span className="pill scene-pill"><span className="live-dot" /> YOUR SOUND MAP</span></div>
        <RoomScene sources={sources} selectedId={selected?.id ?? ""} onSelect={selectSource} onMove={(id, x, y, z) => updateSource(id, { x, y, z })} />
        <div className="scene-footer"><span><i className="legend-dot cyan" /> You are here</span><span><i className="legend-dot violet" /> Individual sounds</span><span className="scene-hint"><Move3d size={14} /> Drag a dot to change its place</span></div>
      </div>

      <aside className="inspector glass">
        <div className="panel-heading"><div><div className="panel-title-row"><h2>Try it yourself</h2><InfoTip title="Why try this?">Moving a sound object changes its position relative to the listener. This simple experiment makes the idea behind spatial audio easier to see and hear.</InfoTip></div><p>Start playback, then move a sound dot.</p></div><span className="inspector-mark"><Waves size={18} /></span></div>
        <button className={`play-button ${playing ? "is-playing" : ""}`} onClick={playing ? pause : start}>{playing ? <Pause size={18} /> : <Play size={18} />} {playing ? "Pause scene" : "Play scene"}</button>
        <div className="control-block"><label>Overall volume <strong>{Math.round(masterVolume * 100)}%</strong></label><input aria-label="Overall volume" type="range" min="0" max="1" step=".01" value={masterVolume} onChange={e => setMasterVolume(Number(e.target.value))} /></div>
        <div className="control-block"><label><span>Turn your head</span><InfoTip title="Listener direction">Imagine that you are sitting in the middle of the room. Turn this control left or right to change which way the listener faces.</InfoTip><strong>{listenerYaw}°</strong></label><input aria-label="Turn listener left or right" type="range" min="-180" max="180" step="1" value={listenerYaw} onChange={e => setListenerYaw(Number(e.target.value))} /><div className="range-ends"><span>LEFT</span><span>RIGHT</span></div></div>
        <div className="headphone-note"><Headphones size={18} /><span><b>Use headphones</b><small>The demo uses browser HRTF to create directional cues. Results vary by device and headphones.</small></span><InfoTip title="HRTF in plain English">Your brain works out where a sound is by comparing tiny timing and loudness differences between your ears. HRTF processing imitates some of those cues to make headphone audio feel directional.</InfoTip></div>
        <div className="sound-library">
          <div className="library-heading"><div><b>Choose a sound</b><InfoTip title="Sound objects">In object-based audio, a sound can have its own position. Here, each button adds a simple generated sound to the room so you can experiment.</InfoTip></div><span>{sources.length} in scene</span></div>
          <div className="preset-grid">
            <button onClick={() => addBuiltin("rain")}><CloudRain size={16} /><span>Rain</span></button>
            <button onClick={() => addBuiltin("wind")}><Wind size={16} /><span>Wind</span></button>
            <button onClick={() => addBuiltin("drone")}><Waves size={16} /><span>Low tone</span></button>
            <button onClick={() => addBuiltin("engine")}><RadioTower size={16} /><span>Engine</span></button>
          </div>
          <div className="sound-list">
            {sources.map(source => <div className={`track-item ${selected?.id === source.id ? "selected" : ""}`} key={source.id}>
              <button className="track-select" onClick={() => selectSource(source.id)}><span className="track-color" style={{ background: source.color }} /><span>{source.name}</span></button>
              <button className="tiny-icon" title={source.muted ? "Turn sound on" : "Mute sound"} aria-label={source.muted ? `Turn ${source.name} on` : `Mute ${source.name}`} onClick={() => updateSource(source.id, { muted: !source.muted })}>{source.muted ? <VolumeX size={14} /> : <Volume2 size={14} />}</button>
              <button className="tiny-icon danger" title="Remove sound" aria-label={`Remove ${source.name}`} onClick={() => { engine.stopSource(source.id); removeSource(source.id); }}><X size={14} /></button>
            </div>)}
          </div>
          <button className="upload-button" onClick={() => fileRef.current?.click()}><Plus size={16} /> Add your own sound</button>
          <input ref={fileRef} hidden type="file" accept="audio/*" multiple onChange={e => upload(e.target.files)} />
        </div>
      </aside>
    </section>

    {selected && <section className="editor glass">
      <div className="editor-heading"><div><div className="panel-title-row"><h2>Selected sound: {selected.name}</h2><InfoTip title="Sound position">The horizontal controls move this sound around the listener. Height controls how far above or below ear level it appears in the illustration and spatial audio simulation.</InfoTip></div><p>Change where it sits in your sound world.</p></div><span className="selected-color" style={{ background: selected.color }} /></div>
      <div className="simple-editor-grid">
        <div className="height-control"><label>Height <strong>{selected.y > .25 ? "Above you" : selected.y < -.25 ? "Below you" : "Ear level"}</strong></label><input aria-label="Sound height" type="range" min="-2" max="3.5" step=".1" value={selected.y} onChange={e => updateSource(selected.id, { y: Number(e.target.value) })} /><div className="range-ends"><span>BELOW</span><span>ABOVE</span></div></div>
        <div className="volume-control"><label>Sound volume <strong>{Math.round(selected.volume * 100)}%</strong></label><input aria-label="Selected sound volume" type="range" min="0" max="1" step=".01" value={selected.volume} onChange={e => updateSource(selected.id, { volume: Number(e.target.value) })} /></div>
        <div className="advanced-toggle-wrap"><button className="advanced-toggle" onClick={() => setAdvancedOpen(value => !value)} aria-expanded={advancedOpen}>{advancedOpen ? "Hide" : "Show"} extra controls <ChevronRight size={15} className={advancedOpen ? "rotate" : ""} /></button></div>
      </div>
      {advancedOpen && <div className="advanced-panel">
        <div className="editor-grid">
          <div className="wave-panel"><div className="field-label">Waveform <span>Highlighted area is the playback range</span></div><Waveform file={selected.audioUrl} start={selected.duration ? selected.trimStart / selected.duration : 0} end={selected.duration ? selected.trimEnd / selected.duration : 1} /><div className="trim-row"><label>Start <b>{selected.trimStart.toFixed(2)}s</b><input type="range" min="0" max={Math.max(.1, selected.duration)} step=".01" value={Math.min(selected.trimStart, selected.duration)} onChange={e => updateSource(selected.id, { trimStart: Math.min(Number(e.target.value), Math.max(0, selected.trimEnd - .02)) })} /></label><label>End <b>{selected.trimEnd.toFixed(2)}s</b><input type="range" min="0.1" max={Math.max(.1, selected.duration)} step=".01" value={Math.max(.1, Math.min(selected.trimEnd, selected.duration))} onChange={e => updateSource(selected.id, { trimEnd: Math.max(selected.trimStart + .02, Number(e.target.value)) })} /></label></div></div>
          <div className="source-controls"><div className="field-label">Precise room position <InfoTip title="X, Y and Z">X moves left and right, Y moves up and down, and Z moves front and back. These are 3D coordinates for the demonstration scene.</InfoTip></div><div className="xyz-grid">{(["x", "y", "z"] as const).map(axis => <label key={axis}><span>{axis.toUpperCase()}</span><input type="number" min={axis === "y" ? -2 : -6} max={axis === "y" ? 3.5 : 6} step=".1" value={selected[axis]} onChange={e => updateSource(selected.id, { [axis]: Number(e.target.value) })} /></label>)}</div><div className="source-actions"><label className="check"><input type="checkbox" checked={selected.solo} onChange={e => updateSource(selected.id, { solo: e.target.checked })} /> Hear this sound alone</label><label className="check"><input type="checkbox" checked={selected.muted} onChange={e => updateSource(selected.id, { muted: e.target.checked })} /> Mute</label></div></div>
        </div>
      </div>}
    </section>}

    <section className="why-it-matters glass">
      <div className="why-symbol"><Sparkles size={21} /></div>
      <div><span className="eyebrow">WHY THIS MATTERS</span><h3>We hear the technology. We rarely see how it works.</h3><p>Spatial audio is often hidden behind a format badge, device setting or playback option. SonicSpace turns the idea into a simple visual experiment: a listener in the middle, sounds around them, and height as another dimension.</p></div>
      <a href="https://www.dolby.com/technologies/dolby-atmos/" target="_blank" rel="noreferrer">Learn about Dolby Atmos <ArrowRight size={15} /></a>
    </section>

    <footer className="floating-dock glass"><button className={`dock-play ${playing ? "active" : ""}`} onClick={playing ? pause : start} aria-label={playing ? "Pause scene" : "Play scene"}>{playing ? <Pause size={17} /> : <Play size={17} />}</button><div className="dock-copy"><b>{playing ? "Sound is playing" : "Ready when you are"}</b><span>{notice}</span></div><div className="dock-actions"><button className="secondary-button" onClick={saveProject} title="Download scene settings"><Download size={15} /> Save scene</button></div></footer>
    <div className="help-note"><CircleHelp size={13} /> Audio runs locally in your browser. It is not uploaded.</div>
  </main>;
}
