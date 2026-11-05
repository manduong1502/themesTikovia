'use client';

import React, { useCallback, useRef } from 'react';

export default function SpotlightProvider({ children }: { children: React.ReactNode }) {
  const rafRef = useRef<number | null>(null);

  // RAF-throttled event delegation for spotlight cards — prevents synchronous reflow jank
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const clientX = e.clientX;
    const clientY = e.clientY;
    const target = (e.target as HTMLElement)?.closest<HTMLElement>('.spotlight-card');
    if (!target) return;

    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      const rect = target.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      target.style.setProperty('--mouse-x', `${x}px`);
      target.style.setProperty('--mouse-y', `${y}px`);
      rafRef.current = null;
    });
  }, []);

  return <div onMouseMove={handleMouseMove}>{children}</div>;
}
