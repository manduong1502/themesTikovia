import React from 'react';
import ThemeGalleryClient from './ThemeGalleryClient';
import { ThemeItem } from '@/lib/content';

interface Props {
  themes?: ThemeItem[];
}

export default function ThemeGallery({ themes = [] }: Props) {
  return (
    <section id="themes" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <ThemeGalleryClient themes={themes} />
    </section>
  );
}
