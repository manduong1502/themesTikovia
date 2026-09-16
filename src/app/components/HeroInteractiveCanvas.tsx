'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

export default function HeroInteractiveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Mouse tracking with smooth interpolation
    let mouseX = width * 0.75;
    let mouseY = height * 0.45;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Generate floating particle nodes
    const particleCount = 45;
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: width * 0.4 + Math.random() * (width * 0.55),
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.6 + 0.2,
      });
    }

    // 3D Isometric Wireframe Box Drawer
    const drawIsometricBox = (
      cx: number,
      cy: number,
      w: number,
      h: number,
      d: number,
      rotX: number,
      rotY: number,
      alpha: number
    ) => {
      ctx.save();
      ctx.translate(cx, cy);

      // Perspective projection
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const project = (x: number, y: number, z: number) => {
        const x1 = x * cosY - z * sinY;
        const z1 = z * cosY + x * sinY;
        const y1 = y * cosX - z1 * sinX;
        return { px: x1, py: y1 };
      };

      const hw = w / 2;
      const hh = h / 2;
      const hd = d / 2;

      const vertices = [
        project(-hw, -hh, -hd),
        project(hw, -hh, -hd),
        project(hw, hh, -hd),
        project(-hw, hh, -hd),
        project(-hw, -hh, hd),
        project(hw, -hh, hd),
        project(hw, hh, hd),
        project(-hw, hh, hd),
      ];

      const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0], // front
        [4, 5], [5, 6], [6, 7], [7, 4], // back
        [0, 4], [1, 5], [2, 6], [3, 7], // connectors
      ];

      ctx.strokeStyle = `rgba(212, 160, 23, ${alpha})`;
      ctx.lineWidth = 1.2;
      ctx.shadowColor = '#D4A017';
      ctx.shadowBlur = 8;

      edges.forEach(([i, j]) => {
        ctx.beginPath();
        ctx.moveTo(vertices[i].px, vertices[i].py);
        ctx.lineTo(vertices[j].px, vertices[j].py);
        ctx.stroke();
      });

      // Internal layout grid lines for web design wireframe look
      ctx.strokeStyle = `rgba(245, 206, 98, ${alpha * 0.45})`;
      ctx.lineWidth = 0.8;
      ctx.shadowBlur = 0;

      // Header wireframe bar
      const topBarL = project(-hw + 8, -hh + 12, hd);
      const topBarR = project(hw - 8, -hh + 12, hd);
      ctx.beginPath();
      ctx.moveTo(topBarL.px, topBarL.py);
      ctx.lineTo(topBarR.px, topBarR.py);
      ctx.stroke();

      // Content divider
      const midL = project(-hw + 8, 4, hd);
      const midR = project(0, 4, hd);
      ctx.beginPath();
      ctx.moveTo(midL.px, midL.py);
      ctx.lineTo(midR.px, midR.py);
      ctx.stroke();

      ctx.restore();
    };

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      const normX = (mouseX / width - 0.5) * 2;
      const normY = (mouseY / height - 0.5) * 2;

      // 1. Draw floating wireframe web design UI boxes on the right
      const rightCenterX = width > 768 ? width * 0.72 : width * 0.5;
      const rightCenterY = height * 0.45;

      // Main UI wireframe card
      drawIsometricBox(
        rightCenterX + normX * 15,
        rightCenterY + Math.sin(time * 0.8) * 12 + normY * 10,
        180,
        120,
        16,
        0.35 + normY * 0.15,
        -0.45 + normX * 0.2 + Math.sin(time * 0.4) * 0.06,
        0.55
      );

      // Secondary floating dashboard card
      drawIsometricBox(
        rightCenterX + 110 + normX * 22,
        rightCenterY - 90 + Math.cos(time * 0.7) * 14 + normY * 15,
        140,
        90,
        12,
        0.25 + normY * 0.12,
        -0.55 + normX * 0.25,
        0.4
      );

      // Small widget card
      drawIsometricBox(
        rightCenterX - 100 + normX * 10,
        rightCenterY + 110 + Math.sin(time * 0.9 + 1) * 10 + normY * 8,
        120,
        80,
        10,
        0.4 + normY * 0.1,
        -0.35 + normX * 0.15,
        0.35
      );

      // 2. Draw connecting particle network
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < width * 0.35 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.fillStyle = `rgba(245, 206, 98, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 90) {
            ctx.strokeStyle = `rgba(212, 160, 23, ${(1 - dist / 90) * 0.25})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-1 pointer-events-none w-full h-full"
      aria-hidden="true"
    />
  );
}
