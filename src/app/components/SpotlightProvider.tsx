'use client';

import React, { useCallback } from 'react';

export default function SpotlightProvider({ children }: { children: React.ReactNode }) {
  // Ultra-lightweight event delegation for spotlight cards
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = (e.target as HTMLElement)?.closest<HTMLElement>('.spotlight-card');
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty('--mouse-x', `${x}px`);
    target.style.setProperty('--mouse-y', `${y}px`);
  }, []);

  return (
    <div onMouseMove={handleMouseMove}>
      {children}
    </div>
  );
}
