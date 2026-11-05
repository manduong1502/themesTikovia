'use client';

import { useEffect } from 'react';

export default function ScrollRevealInit() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
    );

    let rafId: number | null = null;
    const observeElements = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        document.querySelectorAll('.reveal:not(.active)').forEach((el) => {
          observer.observe(el);
        });
        rafId = null;
      });
    };

    observeElements();

    // Watch for dynamically added DOM elements with .reveal (throttled via rAF)
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    if (document.body) {
      mutationObserver.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
