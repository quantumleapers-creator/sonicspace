"use client";
import { Canvas } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Grid, Text, Billboard } from "@react-three/drei";
import { Maximize2, Minimize2 } from "lucide-react";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { AudioSource } from "@/types/audio";

function SourceOrb({ source, selected, onSelect, onMove, onDragStart, onDragEnd }: {
  source: AudioSource; selected: boolean;
  onSelect: () => void;
  onMove: (id: string, x: number, y: number, z: number) => void;
  onDragStart: () => void; onDragEnd: () => void;
}) {
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: source.color, emissive: source.color, emissiveIntensity: selected ? 0.85 : 0.32,
    roughness: 0.3, metalness: 0.25,
  }), [source.color, selected]);
  const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), -source.y));
  const isDragging = useRef(false);

  const startDrag = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    onSelect();
    isDragging.current = true;
    dragPlane.current.set(new THREE.Vector3(0, 1, 0), -source.y);
    onDragStart();
    (event.target as unknown as { setPointerCapture?: (id: number) => void }).setPointerCapture?.(event.pointerId);
    document.body.style.cursor = "grabbing";
  };
  const moveDrag = (event: ThreeEvent<PointerEvent>) => {
    if (!isDragging.current) return;
    event.stopPropagation();
    const point = new THREE.Vector3();
    if (event.ray.intersectPlane(dragPlane.current, point)) {
      onMove(source.id, THREE.MathUtils.clamp(point.x, -6, 6), source.y, THREE.MathUtils.clamp(point.z, -6, 6));
    }
  };
  const endDrag = (event: ThreeEvent<PointerEvent>) => {
    if (!isDragging.current) return;
    event.stopPropagation();
    isDragging.current = false;
    (event.target as unknown as { releasePointerCapture?: (id: number) => void }).releasePointerCapture?.(event.pointerId);
    document.body.style.cursor = "auto";
    onDragEnd();
  };

  return <group position={[source.x, source.y, source.z]}>
    <mesh material={material}
      onClick={e => { e.stopPropagation(); onSelect(); }}
      onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag}
      onPointerOver={() => { if (!isDragging.current) document.body.style.cursor = "grab"; }}
      onPointerOut={() => { if (!isDragging.current) document.body.style.cursor = "auto"; }}>
      <sphereGeometry args={[selected ? 0.32 : 0.25, 32, 32]} />
    </mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.22, 0]}>
      <ringGeometry args={[0.38, 0.405, 48]} /><meshBasicMaterial color={source.color} transparent opacity={0.55} side={THREE.DoubleSide} />
    </mesh>
    <Billboard position={[0, 0.52, 0]}><Text fontSize={0.22} color="#eaf4ff" outlineWidth={0.018} outlineColor="#07111d">{source.name}</Text></Billboard>
  </group>;
}

export default function RoomScene({ sources, selectedId, onSelect, onMove }: {
  sources: AudioSource[]; selectedId: string; onSelect: (id: string) => void;
  onMove: (id: string, x: number, y: number, z: number) => void;
}) {
  const [draggingSource, setDraggingSource] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const roomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncFullscreen = () => setIsFullscreen(document.fullscreenElement === roomRef.current);
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement === roomRef.current) {
        await document.exitFullscreen();
      } else {
        await roomRef.current?.requestFullscreen();
      }
    } catch {
      // Fullscreen can be unavailable in embedded browsers or denied by browser policy.
      // The normal room remains fully usable when that happens.
    }
  };
  const handleDragStart = () => setDraggingSource(true);
  const handleDragEnd = () => setDraggingSource(false);
  return <div ref={roomRef} className={`scene ${draggingSource ? "scene-dragging" : ""}`} role="group" aria-label="Interactive three-dimensional sound room">
    <Canvas camera={{ position: [8, 7, 10], fov: 42 }} dpr={[1, 1.7]}>
      <color attach="background" args={["#091321"]} />
      <ambientLight intensity={0.7} /><pointLight position={[3, 7, 3]} intensity={45} color="#66d9ff" />
      <pointLight position={[-5, 3, -4]} intensity={25} color="#9c83ff" />
      <Grid args={[14, 14]} cellSize={1} cellThickness={0.5} cellColor="#34506e" sectionSize={3} sectionThickness={1} sectionColor="#5e8ab5" fadeDistance={24} infiniteGrid />
      <mesh position={[0, -0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 14]} /><meshStandardMaterial color="#0e1c2e" transparent opacity={0.22} />
      </mesh>
      <Text position={[0, 0.02, 5.35]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.2} color="#7196bd" anchorX="center" anchorY="middle">FRONT</Text>
      <Text position={[0, 0.02, -5.35]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.2} color="#7196bd" anchorX="center" anchorY="middle">BEHIND</Text>
      <Text position={[-5.35, 0.02, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} fontSize={0.2} color="#7196bd" anchorX="center" anchorY="middle">LEFT</Text>
      <Text position={[5.35, 0.02, 0]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]} fontSize={0.2} color="#7196bd" anchorX="center" anchorY="middle">RIGHT</Text>
      <group><mesh position={[0, 0.1, 0]}><sphereGeometry args={[0.28, 24, 24]} /><meshStandardMaterial color="#65dcff" emissive="#2ca8d4" emissiveIntensity={0.9} /></mesh>
        <Billboard position={[0, 0.65, 0]}><Text fontSize={0.22} color="#aeeeff">LISTENER</Text></Billboard></group>
      {sources.map(source => <SourceOrb key={source.id} source={source} selected={selectedId === source.id}
        onSelect={() => onSelect(source.id)} onMove={onMove} onDragStart={handleDragStart} onDragEnd={handleDragEnd} />)}
      <Suspense fallback={null}><OrbitControls makeDefault enabled={!draggingSource} enablePan={!draggingSource} enableZoom minDistance={5} maxDistance={24} maxPolarAngle={Math.PI / 2.05} /></Suspense>
    </Canvas>
    <button
      type="button"
      className="scene-fullscreen-toggle"
      onClick={toggleFullscreen}
      title={isFullscreen ? "Exit immersive sound room" : "View the sound room fullscreen"}
      aria-label={isFullscreen ? "Exit immersive sound room" : "View the sound room fullscreen"}
    >
      {isFullscreen ? <Minimize2 size={16} aria-hidden="true" /> : <Maximize2 size={16} aria-hidden="true" />}
      <span>{isFullscreen ? "Exit immersive view" : "Immersive view"}</span>
    </button>
    <div className="scene-caption">{draggingSource ? "Moving your sound — the view is locked" : "Each colored dot is one sound. Drag a dot to move it; drag the empty floor to look around."}</div>
  </div>;
}