'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Themes', href: '#themes' },
  { label: 'Giới Thiệu', href: '#about' },
  { label: 'Thống Kê', href: '#stats' },
  { label: 'Liên Hệ', href: '#contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Themes');

  const navContainerRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const isClickingRef = useRef(false);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [bubbleStyle, setBubbleStyle] = useState<{
    left: number;
    width: number;
    opacity: number;
  }>({ left: 0, width: 0, opacity: 0 });

  // Update liquid bubble indicator position using direct offset values (immune to scroll/subpixel jitter)
  const updateBubblePosition = useCallback((tabName: string) => {
    const activeEl = tabRefs.current.get(tabName);
    if (activeEl) {
      setBubbleStyle({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
        opacity: 1,
      });
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateBubblePosition(activeTab);
    }, 40);
    return () => clearTimeout(timer);
  }, [activeTab, updateBubblePosition]);

  // Window resize listener
  useEffect(() => {
    const handleResize = () => updateBubblePosition(activeTab);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTab, updateBubblePosition]);

  // Handle clicking a tab smoothly without scroll-spy fight
  const handleTabClick = (label: string) => {
    setActiveTab(label);
    isClickingRef.current = true;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => {
      isClickingRef.current = false;
    }, 850);
  };

  // ScrollSpy to automatically glide bubble to current section only during natural scroll
  useEffect(() => {
    const sectionIds = ['themes', 'about', 'stats', 'contact'];
    const sectionLabels: Record<string, string> = {
      themes: 'Themes',
      about: 'Giới Thiệu',
      stats: 'Thống Kê',
      contact: 'Liên Hệ',
    };

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);

          if (!isClickingRef.current) {
            const scrollPosition = window.scrollY + 240;
            for (let i = sectionIds.length - 1; i >= 0; i--) {
              const section = document.getElementById(sectionIds[i]);
              if (section) {
                const top = section.offsetTop;
                if (scrollPosition >= top) {
                  setActiveTab(sectionLabels[sectionIds[i]]);
                  break;
                }
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 bg-[#070d14]/95 backdrop-blur-2xl z-50 flex flex-col justify-center items-center transition-all duration-300 md:hidden ${
          menuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!menuOpen}
      >
        <button
          onClick={closeMenu}
          className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors"
          aria-label="Đóng menu"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center gap-8 text-center max-w-sm w-full px-6">
          {/* Logo */}
          <div className="relative flex items-center justify-center">
            <Image
              src="/assets/images/logo-horizontal.png"
              alt="Tikovia Agency"
              width={180}
              height={44}
              className="h-10 w-auto object-contain"
            />
          </div>

          <nav className="flex flex-col gap-4 w-full">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => {
                  handleTabClick(link.label);
                  closeMenu();
                }}
                className={`py-3.5 px-8 rounded-full text-lg font-bold tracking-wide transition-all duration-200 ${
                  activeTab === link.label
                    ? 'bg-white/20 text-white border border-white/30 shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href="#contact"
            onClick={closeMenu}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-black text-base font-bold tracking-wider rounded-full hover:from-amber-300 hover:to-amber-400 transition-all shadow-xl"
          >
            Thuê Tôi Ngay
            <ArrowUpRight className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Floating Header */}
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 pointer-events-none ${
          scrolled ? 'py-4' : 'py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between pointer-events-auto">
          {/* Left: Brand Logo (Horizontal logo, static, no hover scale, no text) */}
          <a
            href="/"
            className="flex items-center cursor-pointer select-none"
            aria-label="Trang chủ"
          >
            <Image
              src="/assets/images/logo-horizontal.png"
              alt="Tikovia Agency"
              width={180}
              height={44}
              className="h-8 sm:h-9 md:h-10 w-auto object-contain"
              priority
            />
          </a>

          {/* Center: Floating Pill Navigation with Liquid Bubble Indicator */}
          <nav
            ref={navContainerRef}
            className="relative hidden md:flex items-center p-1.5 rounded-full bg-black/50 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          >
            {/* Sliding Liquid Droplet / Bubble Pill - GPU Transform with Butter-Smooth Easing */}
            <div
              className="absolute top-1.5 bottom-1.5 left-0 rounded-full bg-white shadow-[0_2px_18px_rgba(255,255,255,0.4)] pointer-events-none will-change-transform transition-[transform,width,opacity] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
              style={{
                transform: `translate3d(${bubbleStyle.left}px, 0, 0)`,
                width: `${bubbleStyle.width}px`,
                opacity: bubbleStyle.opacity,
              }}
            >
              {/* Subtle inner liquid reflection */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white via-white to-slate-100 opacity-95" />
            </div>

            {navLinks.map((link) => {
              const isActive = activeTab === link.label;
              return (
                <a
                  key={link.label}
                  ref={(el) => {
                    if (el) tabRefs.current.set(link.label, el);
                    else tabRefs.current.delete(link.label);
                  }}
                  href={link.href}
                  onClick={() => handleTabClick(link.label)}
                  className={`relative z-10 px-5 py-2 rounded-full text-sm font-bold tracking-wide transition-colors duration-200 select-none ${
                    isActive
                      ? 'text-slate-950 font-extrabold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Arrow circular button */}
            <a
              href="#themes"
              aria-label="Khám phá themes"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:bg-amber-400 hover:scale-105 active:scale-95 transition-all duration-200 group"
            >
              <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            {/* Pill CTA button */}
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-white text-black font-bold text-sm sm:text-base tracking-wide shadow-xl hover:bg-amber-400 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Thuê Tôi
            </a>

            {/* Mobile hamburger menu toggle */}
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden w-11 h-11 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors shadow-lg"
              aria-label="Mở menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
