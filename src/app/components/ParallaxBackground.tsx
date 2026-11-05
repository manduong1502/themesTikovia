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
            el.style.transform = `translate3d(0, ${scrolled * 0.2}px, 0)`;
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
