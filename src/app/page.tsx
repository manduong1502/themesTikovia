import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/app/components/HeroSection';
import ThemeGallery from '@/app/components/ThemeGallery';
import AboutSection from '@/app/components/AboutSection';
import StatsSection from '@/app/components/StatsSection';
import ContactSection from '@/app/components/ContactSection';
import ScrollRevealInit from '@/app/components/ScrollRevealInit';
import ParallaxBackground from '@/app/components/ParallaxBackground';
import SpotlightProvider from '@/app/components/SpotlightProvider';
import { getSiteContent } from '@/lib/content';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const content = await getSiteContent();

  return (
    <>
      <ParallaxBackground />
      <div className="grid-bg" aria-hidden="true" />
      <div className="noise-overlay" aria-hidden="true" />

      <div className="relative z-10 min-h-screen bg-white">
        <Header />

        <SpotlightProvider>
          <main>
            <HeroSection hero={content?.hero} />
            <ThemeGallery themes={content?.themes} />
            <AboutSection about={content?.about} />
            <StatsSection stats={content?.stats} />
            <ContactSection contact={content?.contact} />
          </main>
        </SpotlightProvider>

        <Footer footer={content?.footer} />
      </div>

      <ScrollRevealInit />
    </>
  );
}
