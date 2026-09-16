'use client';

import React, { useState, useMemo } from 'react';
import AppImage from '@/components/ui/AppImage';

export interface Theme {
  id: number;
  title: string;
  category: string;
  description: string;
  tag: string;
  year: string;
  image: string;
  images?: string[];
  alt: string;
  demoUrl: string;
  accentColor: string;
}

interface Props {
  themes: Theme[];
}

export default function ThemeGalleryClient({ themes }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('Tất Cả');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  // Extract unique high-level categories
  const categories = useMemo(() => {
    return ['Tất Cả', 'SaaS / Bảng Điều Khiển', 'Thương Mại Điện Tử', 'Portfolio', 'Agency', 'Startup'];
  }, []);

  // Filter themes based on active category & search
  const filteredThemes = useMemo(() => {
    return themes.filter((theme) => {
      const matchCategory =
        activeCategory === 'Tất Cả' ||
        theme.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
        (activeCategory === 'SaaS / Bảng Điều Khiển' && theme.category.includes('SaaS')) ||
        (activeCategory === 'Portfolio' && (theme.category.includes('Portfolio') || theme.category.includes('Studio')));

      const matchSearch =
        searchQuery.trim() === '' ||
        theme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        theme.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        theme.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        theme.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [themes, activeCategory, searchQuery]);

  const activeImages = useMemo(() => {
    if (!selectedTheme) return [];
    if (selectedTheme.images && selectedTheme.images.length > 0) {
      return selectedTheme.images;
    }
    return selectedTheme.image ? [selectedTheme.image] : [];
  }, [selectedTheme]);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeImages.length <= 1) return;
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : activeImages.length - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeImages.length <= 1) return;
    setCurrentImageIndex((prev) => (prev < activeImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <div>
      {/* Category filter & Search bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10 reveal">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-[#0D1B2A] text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-amber-300 hover:text-[#0D1B2A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="w-full md:w-64">
          <input
            type="text"
            placeholder="Tìm kiếm theme..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-[#0D1B2A] placeholder-slate-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
          />
        </div>
      </div>

      {/* Themes Grid */}
      {filteredThemes.length === 0 ? (
        <div className="text-center py-16 saas-card p-8">
          <p className="text-slate-500 text-sm">Không tìm thấy theme phù hợp với bộ lọc hiện tại.</p>
          <button
            onClick={() => {
              setActiveCategory('Tất Cả');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 bg-amber-50 text-amber-700 font-semibold rounded-lg text-xs hover:bg-amber-100 transition-colors"
          >
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredThemes.map((theme) => (
            <div
              key={theme.id}
              onClick={() => {
                setSelectedTheme(theme);
                setCurrentImageIndex(0);
              }}
              className="spotlight-card saas-card group cursor-pointer overflow-hidden transition-all duration-300 animate-in fade-in zoom-in-95"
            >
              {/* Image area */}
              <div className="theme-img-wrap relative aspect-[4/3] w-full bg-slate-50 overflow-hidden rounded-t-[calc(var(--radius)-1px)]">
                <AppImage
                  src={theme.image}
                  alt={theme.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                />
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-xs font-semibold text-white bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg">
                    Nhấp để xem chi tiết
                  </span>
                </div>
                {/* Multi-image indicator badge if more than 1 image */}
                {theme.images && theme.images.length > 1 && (
                  <div className="absolute bottom-3 right-3 z-10">
                    <span className="px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded-md text-[10px] font-semibold text-white shadow-sm flex items-center gap-1">
                      <span>🖼</span> {theme.images.length} ảnh
                    </span>
                  </div>
                )}
                {/* Year badge */}
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-md text-[10px] font-semibold text-slate-600 shadow-sm">
                    {theme.year}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Category + tag row */}
                <div className="flex items-center justify-between mb-3">
                  <span className="badge-pill bg-slate-50 text-slate-600 border border-slate-100">
                    {theme.category}
                  </span>
                  <span className={`text-xs font-semibold ${theme.accentColor}`}>{theme.tag}</span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-[#0D1B2A] mb-2 leading-snug group-hover:text-amber-600 transition-colors">
                  {theme.title}
                </h3>

                {/* Description */}
                <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
                  {theme.description}
                </p>

                {/* CTA */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors group/link"
                  >
                    Xem Chi Tiết & Demo
                    <span className="transition-transform duration-200 group-hover/link:translate-x-0.5">→</span>
                  </button>
                  <span className="text-[11px] font-medium text-slate-400">Next.js 15 Ready</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Theme Detail Modal */}
      {selectedTheme && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedTheme(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal close button */}
            <button
              onClick={() => setSelectedTheme(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/75 backdrop-blur-md transition-colors text-sm shadow-md"
              aria-label="Đóng"
            >
              ✕
            </button>

            {/* Modal Image with 4:3 aspect ratio & Gallery Slider */}
            <div className="relative aspect-[4/3] w-full bg-slate-100 flex-shrink-0 group/slider">
              <AppImage
                src={activeImages[currentImageIndex] || selectedTheme.image}
                alt={`${selectedTheme.alt || selectedTheme.title} - Ảnh ${currentImageIndex + 1}`}
                fill
                className="object-cover"
                priority
              />

              {/* Slider Left Arrow */}
              {activeImages.length > 1 && (
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-lg active:scale-95 text-sm"
                  aria-label="Ảnh trước"
                >
                  ◀
                </button>
              )}

              {/* Slider Right Arrow */}
              {activeImages.length > 1 && (
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-lg active:scale-95 text-sm"
                  aria-label="Ảnh tiếp theo"
                >
                  ▶
                </button>
              )}

              {/* Counter badge */}
              {activeImages.length > 1 && (
                <div className="absolute bottom-3 right-3 z-10">
                  <span className="px-3 py-1 bg-black/70 backdrop-blur-md rounded-lg text-xs font-semibold text-white shadow-sm">
                    {currentImageIndex + 1} / {activeImages.length}
                  </span>
                </div>
              )}

              {/* 4:3 Ratio indicator */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-semibold text-white shadow-sm uppercase tracking-wider">
                  Chuẩn 4:3
                </span>
              </div>
            </div>

            {/* Thumbnail selector strip if multiple images */}
            {activeImages.length > 1 && (
              <div className="flex gap-2.5 px-6 py-2.5 bg-slate-50 overflow-x-auto border-b border-slate-100 flex-shrink-0">
                {activeImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-14 aspect-[4/3] rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                      currentImageIndex === idx
                        ? 'border-amber-500 ring-2 ring-amber-300 shadow-sm scale-105'
                        : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <AppImage src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Modal Content */}
            <div className="p-6 md:p-8 overflow-y-auto flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="badge-pill bg-amber-50 text-amber-700 border border-amber-200">
                    {selectedTheme.category}
                  </span>
                  <span className="badge-pill bg-slate-50 text-slate-600 border border-slate-200">
                    {selectedTheme.tag}
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-400">Năm phát hành: {selectedTheme.year}</span>
              </div>

              <h3 className="font-display text-2xl md:text-3xl font-light text-[#0D1B2A] mb-3">
                {selectedTheme.title}
              </h3>

              <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6">
                {selectedTheme.description}
              </p>

              {/* Specs */}
              <div className="grid grid-cols-3 gap-3 mb-6 p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Độ Tương Thích</div>
                  <div className="text-xs font-bold text-[#0D1B2A] mt-0.5">100% Responsive</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Khung Nền Tảng</div>
                  <div className="text-xs font-bold text-[#0D1B2A] mt-0.5">Next.js 15 + Tailwind</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tối Ưu SEO</div>
                  <div className="text-xs font-bold text-green-600 mt-0.5">Chuẩn 100 Điểm</div>
                </div>
              </div>

              {/* Actions with "Xem Demo" button */}
              <div className="flex flex-col sm:flex-row gap-3 justify-end items-stretch sm:items-center pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTheme(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors text-center"
                >
                  Đóng
                </button>

                {/* Demo button */}
                {(() => {
                  const rawUrl = selectedTheme.demoUrl?.trim();
                  if (!rawUrl || rawUrl === '#') return null;
                  const formattedUrl = rawUrl.startsWith('http://') || rawUrl.startsWith('https://') ? rawUrl : `https://${rawUrl}`;
                  return (
                    <a
                      href={formattedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all text-center"
                    >
                      <span>Xem Demo Trực Tiếp</span>
                      <span>↗</span>
                    </a>
                  );
                })()}

                <a
                  href="#contact"
                  onClick={() => setSelectedTheme(null)}
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-[#0D1B2A] text-white font-semibold text-sm hover:bg-[#1a2e42] transition-colors shadow-sm text-center"
                >
                  Yêu Cầu Tùy Biến Theme Này →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
