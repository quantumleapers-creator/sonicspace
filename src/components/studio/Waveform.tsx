"use client";
import { useEffect, useRef } from "react";

export default function Waveform({ file, color = "#72d6ff" }: { file: File | null; color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !file) return;
    let cancelled = false;
    const draw = async () => {
      const context = canvas.getContext("2d");
      if (!context) return;
      const audio = new AudioContext();
      try {
        const buffer = await audio.decodeAudioData(await file.arrayBuffer());
        if (cancelled) return;
        const data = buffer.getChannelData(0);
        const width = canvas.width;
        const height = canvas.height;
        const step = Math.ceil(data.length / width);
        context.clearRect(0, 0, width, height);
        context.strokeStyle = color;
        context.lineWidth = 1;
        context.beginPath();
        for (let x = 0; x < width; x++) {
          let min = 1;
          let max = -1;
          for (let i = 0; i < step; i++) {
            const value = data[x * step + i] ?? 0;
            min = Math.min(min, value);
            max = Math.max(max, value);
          }
          context.moveTo(x, (1 + min) * height / 2);
          context.lineTo(x, (1 + max) * height / 2);
        }
        context.stroke();
      } finally {
        await audio.close();
      }
    };
    void draw();
    return () => { cancelled = true; };
  }, [file, color]);
  return <canvas ref={canvasRef} width={640} height={72} aria-label="Audio waveform preview" role="img" />;
}
