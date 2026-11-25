"use client";
import { useEffect, useRef } from "react";

export default function Waveform({ file, start, end }: { file?: string; start: number; end: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const width = canvas.clientWidth * (window.devicePixelRatio || 1);
    const height = 72 * (window.devicePixelRatio || 1);
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);
    const bars = 100;
    for (let i = 0; i < bars; i++) {
      const x = (i / bars) * width;
      const amplitude = file ? (0.18 + Math.abs(Math.sin(i * 12.9898) * Math.cos(i * 0.27)) * 0.72) : (0.14 + Math.abs(Math.sin(i * 0.48)) * 0.36);
      const h = amplitude * height * 0.78;
      ctx.fillStyle = i / bars >= start && i / bars <= end ? "#6edcf5" : "rgba(110,220,245,.22)";
      ctx.fillRect(x, (height - h) / 2, Math.max(2, width / bars - 2), h);
    }
  }, [file, start, end]);
  return <canvas ref={canvasRef} className="waveform" aria-label="Decorative audio waveform preview" />;
}
