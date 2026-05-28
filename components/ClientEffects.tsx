"use client";

import { useEffect } from "react";

interface WaveRing {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
  lineWidth: number;
}

export default function ClientEffects() {
  useEffect(() => {
    // ── Canvas wave effect on click ───────────────
    const canvas = document.createElement("canvas");
    canvas.id = "wave-canvas";
    Object.assign(canvas.style, {
      position: "fixed",
      inset: "0",
      pointerEvents: "none",
      zIndex: "99999",
      width: "100%",
      height: "100%",
    });
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d")!;
    const rings: WaveRing[] = [];
    let animId: number;
    let dpr = window.devicePixelRatio || 1;

    function resize() {
      dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    function spawnWave(x: number, y: number) {
      // Three layered concentric rings — each at different speeds
      rings.push(
        { x, y, radius: 0, maxRadius: 95,  alpha: 0.55, speed: 2.6, lineWidth: 1.8 },
        { x, y, radius: 0, maxRadius: 62,  alpha: 0.72, speed: 4.0, lineWidth: 1.3 },
        { x, y, radius: 0, maxRadius: 36,  alpha: 0.90, speed: 5.8, lineWidth: 0.9 },
      );
    }

    function draw() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = rings.length - 1; i >= 0; i--) {
        const r = rings[i];
        r.radius += r.speed;
        // Fade out proportional to expansion
        r.alpha *= 0.96;

        if (r.radius >= r.maxRadius || r.alpha <= 0.01) {
          rings.splice(i, 1);
          continue;
        }

        const progress = r.radius / r.maxRadius;
        // Blend: burgundy (#9B1B30) → steel (#4e6f85) as ring expands
        const red   = Math.round(155 - (155 -  78) * progress);
        const green = Math.round( 27 + (111 -  27) * progress);
        const blue  = Math.round( 48 + (133 -  48) * progress);

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${red},${green},${blue},${r.alpha.toFixed(3)})`;
        ctx.lineWidth = r.lineWidth * (1 - progress * 0.5);
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    }
    draw();

    function onClick(e: MouseEvent) {
      spawnWave(e.clientX, e.clientY);
    }

    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener("click", onClick);
      window.removeEventListener("resize", resize);
      canvas.remove();
    };
  }, []);

  return null;
}
