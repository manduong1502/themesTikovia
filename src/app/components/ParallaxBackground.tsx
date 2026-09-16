'use client';

import { useEffect, useRef } from 'react';

export default function ParallaxBackground() {
  const dotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = dotsRef?.current;
    if (!el) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          if (el) {
            el.style.transform = `translateY(${scrolled * 0.25}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <div ref={dotsRef} id="parallax-dots" aria-hidden="true" />;
}
