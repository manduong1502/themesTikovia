'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import HeroInteractiveCanvas from './HeroInteractiveCanvas';

import { HeroContent } from '@/lib/content';

interface Props {
  hero?: HeroContent;
}

const defaultTrustedBy = ['Orbit SaaS', 'Velours Luxe', 'Launchpad', 'Codeforge', 'Atelier Studio'];

export default function HeroSection({ hero }: Props) {
  const heroRef = useRef<HTMLElement>(null);

  const eyebrow = hero?.eyebrow || 'NHÀ THIẾT KẾ GIAO DIỆN WEB · 24+ THEMES';
  const titleLine1 = hero?.titleLine1 || 'Giao diện';
  const titleLine2 = hero?.titleLine2 || 'nói lên thiết kế.';
  const titleLine3 = hero?.titleLine3 || 'Từng pixel.';
  const description = hero?.description || 'Giao diện web sẵn sàng triển khai cho nhiều ngành — được xây dựng để thể hiện phạm vi thiết kế, tư duy hệ thống và sự chú ý đến từng chi tiết.';
  const ctaPrimaryText = hero?.ctaPrimaryText || 'Xem Tất Cả Themes';
  const ctaPrimaryLink = hero?.ctaPrimaryLink || '#themes';
  const ctaSecondaryText = hero?.ctaSecondaryText || 'Liên Hệ Thiết Kế';
  const ctaSecondaryLink = hero?.ctaSecondaryLink || '#contact';
  const trustedBy = hero?.trustedBy && hero.trustedBy.length > 0 ? hero.trustedBy : defaultTrustedBy;
  const bgImage = hero?.bgImage || '/assets/images/hero_webdesign.jpg';

  useEffect(() => {
    const timer = setTimeout(() => {
      if (heroRef?.current) {
        heroRef?.current?.classList?.add('hero-revealed');
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-between overflow-hidden pt-36 md:pt-40 pb-20 bg-[#080c14] text-white"
      id="hero"
    >
      {/* Background 1: Dark Web Design Architecture Image */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <Image
          src={bgImage}
          alt="Web Design Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-right md:object-center opacity-75"
        />
        {/* Cinematic Vignette Overlay to highlight foreground typography */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080c14] via-[#080c14]/30 to-[#080c14]/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080c14] via-[#080c14]/65 to-transparent" />
      </div>

      {/* Background 2: Interactive 3D Wireframe Canvas */}
      <HeroInteractiveCanvas />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10 my-auto">
        {/* Eyebrow badge */}
        <div className="mb-8">
          <span className="text-reveal-wrapper">
            <span className="text-reveal-inner delay-1 inline-flex">
              <span className="badge-pill bg-amber-400/10 text-amber-300 border border-amber-400/30 backdrop-blur-md px-4 py-1.5 shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                {eyebrow}
              </span>
            </span>
          </span>
        </div>

        {/* Headline - Exact Original 3-Line Structure */}
        <div className="mb-8 max-w-5xl">
          <h1 className="font-display font-light leading-[1.08] tracking-tight">
            <span className="text-reveal-wrapper">
              <span
                className="text-reveal-inner delay-1 block text-white font-medium drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]"
                style={{ fontSize: 'clamp(3rem, 8.5vw, 7.5rem)' }}
              >
                {titleLine1}
              </span>
            </span>
            <span className="text-reveal-wrapper">
              <span
                className="text-reveal-inner delay-2 block gradient-text italic font-normal drop-shadow-[0_4px_30px_rgba(212,160,23,0.4)]"
                style={{ fontSize: 'clamp(3rem, 8.5vw, 7.5rem)' }}
              >
                {titleLine2}
              </span>
            </span>
            <span className="text-reveal-wrapper">
              <span
                className="text-reveal-inner delay-3 block text-white/90 drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]"
                style={{ fontSize: 'clamp(3rem, 8.5vw, 7.5rem)' }}
              >
                {titleLine3}
              </span>
            </span>
          </h1>
        </div>

        {/* Subtext + CTA */}
        <div className="flex flex-col md:flex-row md:items-center gap-8 mt-10 max-w-4xl">
          <p className="text-slate-300 text-lg leading-relaxed max-w-md font-normal drop-shadow-md">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <a
              href={ctaPrimaryLink}
              className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold px-8 py-4 text-sm rounded-xl shadow-[0_4px_25px_rgba(212,160,23,0.4)] hover:shadow-[0_6px_30px_rgba(212,160,23,0.6)] hover:scale-105 active:scale-95 transition-all duration-200 group"
            >
              <span>{ctaPrimaryText}</span>
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </a>
            <a
              href={ctaSecondaryLink}
              className="inline-flex items-center justify-center px-8 py-4 border border-white/20 hover:border-amber-300/60 text-white text-sm font-semibold rounded-xl hover:bg-white/10 backdrop-blur-md hover:scale-105 active:scale-95 transition-all duration-200"
            >
              {ctaSecondaryText}
            </a>
          </div>
        </div>

        {/* Social proof strip */}
        <div className="mt-16 pt-8 border-t border-white/15">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Themes nổi bật</p>
          <div className="flex flex-wrap gap-3">
            {trustedBy?.map((name) => (
              <span
                key={name}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-slate-300 hover:border-amber-400/40 hover:text-white transition-colors cursor-default backdrop-blur-sm shadow-sm"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom stats bar */}
      <div className="relative z-10 w-full mt-10 border-t border-white/15 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex flex-wrap justify-between items-center gap-4">
          <div className="flex gap-8 md:gap-14">
            {[
              { label: 'Themes Đã Xây Dựng', value: '24+' },
              { label: 'Danh Mục', value: '8' },
              { label: 'Demo Trực Tiếp', value: '24' },
            ]?.map((stat) => (
              <div key={stat?.label} className="flex items-center gap-3">
                <span className="text-xl font-bold text-white drop-shadow-sm">{stat?.value}</span>
                <span className="text-xs text-slate-400 font-medium">{stat?.label}</span>
              </div>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-2 text-slate-400 text-xs font-medium">
            <span>Cuộn để khám phá</span>
            <span className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center text-[10px] text-slate-300">↓</span>
          </div>
        </div>
      </div>
    </header>
  );
}
