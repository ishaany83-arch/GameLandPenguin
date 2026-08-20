import React, { useEffect, useRef } from 'react';

interface SnowfallEffectProps {
  density?: number;
  className?: string;
}

interface Snowflake {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  speedX: number;
  opacity: number;
  swaySpeed: number;
  swayOffset: number;
  vx: number;
  vy: number;
}

export const SnowfallEffect: React.FC<SnowfallEffectProps> = ({ density = 40, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const snowflakes: Snowflake[] = [];

    const initSnowflakes = (w: number, h: number) => {
      snowflakes.length = 0;
      const count = Math.max(20, Math.floor((w * h) / 10000) * (density / 30));
      for (let i = 0; i < count; i++) {
        snowflakes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          radius: Math.random() * 2.5 + 1.5, // 1.5px to 4px
          speedY: Math.random() * 0.8 + 0.4,
          speedX: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.3,
          swaySpeed: Math.random() * 0.02 + 0.005,
          swayOffset: Math.random() * Math.PI * 2,
          vx: 0,
          vy: 0,
        });
      }
    };

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth || window.innerWidth;
      height = parent.clientHeight || window.innerHeight;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      if (snowflakes.length === 0) {
        initSnowflakes(width, height);
      }
    };

    resizeCanvas();

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      let clientX = -1000;
      let clientY = -1000;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      mouseRef.current = {
        x: clientX - rect.left,
        y: clientY - rect.top,
        active: true,
      };
    };

    const handlePointerLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseleave', handlePointerLeave);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      const mouseRadius = 130; // Radius of interaction
      const maxRepulsionForce = 2.8;

      for (let i = 0; i < snowflakes.length; i++) {
        const flake = snowflakes[i];

        // Swaying motion
        flake.swayOffset += flake.swaySpeed;
        const sway = Math.sin(flake.swayOffset) * 0.4;

        // Damping velocity
        flake.vx *= 0.91;
        flake.vy *= 0.91;

        // Mouse repulsion physics
        if (mouse.active) {
          const dx = flake.x - mouse.x;
          const dy = flake.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouseRadius && dist > 0) {
            const force = (1 - dist / mouseRadius) * maxRepulsionForce;
            const nx = dx / dist;
            const ny = dy / dist;

            flake.vx += nx * force * 0.8;
            flake.vy += ny * force * 0.8;
          }
        }

        // Position updates
        flake.x += flake.speedX + sway + flake.vx;
        flake.y += flake.speedY + flake.vy;

        // Wrap around canvas bounds
        if (flake.y > height + 10) {
          flake.y = -10;
          flake.x = Math.random() * width;
          flake.vx = 0;
          flake.vy = 0;
        } else if (flake.y < -10) {
          flake.y = height + 10;
        }

        if (flake.x > width + 10) {
          flake.x = -10;
        } else if (flake.x < -10) {
          flake.x = width + 10;
        }

        // Draw snowflake particle with glowing halo
        ctx.save();
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224, 242, 254, ${flake.opacity})`;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerLeave);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 opacity-75 ${className}`}
    />
  );
};
