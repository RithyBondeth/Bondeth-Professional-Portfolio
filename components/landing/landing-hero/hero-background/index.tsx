"use client";

import { useEffect, useRef } from "react";

interface IParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

const PARTICLE_COUNT = 90;
const MAX_CONNECT_DIST = 140;
const POINTER_DIST = 170;
const PARTICLE_COLOR = "96, 165, 250"; // blue-400 rgb
const POINTER_COLOR = "34, 211, 238"; // primary cyan rgb

/**
 * Animated particle-network canvas rendered behind the hero content.
 *
 * Behaviour contract:
 * - Reduced motion → one static frame is drawn, then the loop never runs.
 * - The loop pauses while the hero is offscreen or the tab is hidden.
 * - Rendering is capped at 2× devicePixelRatio.
 * - Desktop pointers gently attract nearby particles, which link to the
 *   cursor with cyan threads.
 */
export default function HeroBackground() {
  /* ---------------------------------- Utils --------------------------------- */
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = false;
    let w = 0;
    let h = 0;
    const particles: IParticle[] = [];
    const pointer = { x: -1e4, y: -1e4, active: false };

    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawn() {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: Math.random() * 1.2 + 0.4,
          opacity: Math.random() * 0.4 + 0.2,
        });
      }
    }

    function drawFrame(advance: boolean) {
      ctx!.clearRect(0, 0, w, h);

      // Connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_CONNECT_DIST) {
            const alpha = (1 - dist / MAX_CONNECT_DIST) * 0.12;
            ctx!.beginPath();
            ctx!.strokeStyle = `rgba(${PARTICLE_COLOR}, ${alpha})`;
            ctx!.lineWidth = 0.8;
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.stroke();
          }
        }
      }

      // Dots
      for (const p of particles) {
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${PARTICLE_COLOR}, ${p.opacity})`;
        ctx!.fill();

        // Tiny glow ring on larger dots
        if (p.radius > 1.2) {
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(${PARTICLE_COLOR}, 0.04)`;
          ctx!.fill();
        }

        if (!advance) continue;

        // Pointer interaction: a gentle pull toward the cursor plus a cyan
        // thread while inside the influence radius.
        if (pointer.active) {
          const pdx = pointer.x - p.x;
          const pdy = pointer.y - p.y;
          const pdist = Math.sqrt(pdx * pdx + pdy * pdy);
          if (pdist < POINTER_DIST && pdist > 0.001) {
            const pull = ((POINTER_DIST - pdist) / POINTER_DIST) * 0.012;
            p.vx += (pdx / pdist) * pull;
            p.vy += (pdy / pdist) * pull;
            ctx!.beginPath();
            ctx!.strokeStyle = `rgba(${POINTER_COLOR}, ${
              (1 - pdist / POINTER_DIST) * 0.18
            })`;
            ctx!.lineWidth = 0.7;
            ctx!.moveTo(p.x, p.y);
            ctx!.lineTo(pointer.x, pointer.y);
            ctx!.stroke();
          }
        }

        // Move (with a soft speed cap so pointer pulls never launch a particle)
        p.vx = Math.max(-0.8, Math.min(0.8, p.vx));
        p.vy = Math.max(-0.8, Math.min(0.8, p.vy));
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
      }
    }

    function loop() {
      drawFrame(true);
      raf = requestAnimationFrame(loop);
    }

    function start() {
      if (running || reduceMq.matches) return;
      running = true;
      raf = requestAnimationFrame(loop);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    resize();
    spawn();

    if (reduceMq.matches) {
      // Static constellation — texture without motion.
      drawFrame(false);
    } else {
      start();
    }

    // Pause while offscreen / tab hidden — no reason to burn frames.
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !document.hidden) start();
      else stop();
    });
    io.observe(canvas);
    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    // React to the user flipping their motion preference live.
    const onReduceChange = () => {
      if (reduceMq.matches) {
        stop();
        drawFrame(false);
      } else {
        start();
      }
    };
    reduceMq.addEventListener("change", onReduceChange);

    // Pointer tracking (desktop only) — listen on the section so the canvas
    // never needs pointer-events of its own.
    const host = canvas.parentElement;
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };
    if (finePointer && host) {
      host.addEventListener("pointermove", onMove, { passive: true });
      host.addEventListener("pointerleave", onLeave, { passive: true });
    }

    const ro = new ResizeObserver(() => {
      resize();
      spawn();
      if (reduceMq.matches) drawFrame(false);
    });
    ro.observe(canvas);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMq.removeEventListener("change", onReduceChange);
      if (finePointer && host) {
        host.removeEventListener("pointermove", onMove);
        host.removeEventListener("pointerleave", onLeave);
      }
    };
  }, []);

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden
    />
  );
}
