import React from 'react';
import ThemeGalleryClient from './ThemeGalleryClient';
import { ThemeItem } from '@/lib/content';

interface Props {
  themes?: ThemeItem[];
}

export default function ThemeGallery({ themes = [] }: Props) {
  return (
    <section id="themes" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Section header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 reveal">
        <div>
          <span className="badge-pill bg-amber-50 text-amber-700 border border-amber-200 mb-4 inline-flex">
            Bộ Sưu Tập Themes
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-light text-[#0D1B2A] tracking-tight leading-tight">
            Tất Cả Themes
          </h2>
        </div>
        <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
          Mỗi theme đều responsive hoàn toàn, sẵn sàng triển khai và có thể xem demo trực tiếp.
        </p>
      </div>

      <ThemeGalleryClient themes={themes} />
    </section>
  );
}
