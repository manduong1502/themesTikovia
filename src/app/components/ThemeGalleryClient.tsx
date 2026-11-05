'use client';

import React, { useState, useMemo, useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';
import { ThemeType } from '@/lib/content';

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
  type?: ThemeType;
  clientName?: string;
}

interface Props {
  themes: Theme[];
}

type FilterType = 'all' | 'template' | 'client';

export default function ThemeGalleryClient({ themes }: Props) {
  const [activeType, setActiveType] = useState<FilterType>('all');
  const [activeCategory, setActiveCategory] = useState<string>('Tất Cả');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  // Listen for custom navigation events or URL hash to switch tab directly
  useEffect(() => {
    const handleCustomFilter = (e: Event) => {
      const customEvent = e as CustomEvent<FilterType>;
      if (customEvent.detail) {
        setActiveType(customEvent.detail);
        setActiveCategory('Tất Cả');
      }
    };

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#du-an-khach') {
        setActiveType('client');
        setActiveCategory('Tất Cả');
      } else if (hash === '#theme-mau') {
        setActiveType('template');
        setActiveCategory('Tất Cả');
      }
    };

    handleHashChange();
    window.addEventListener('tikovia:filter-type', handleCustomFilter);
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('tikovia:filter-type', handleCustomFilter);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Counts for each type
  const counts = useMemo(() => {
    let template = 0;
    let client = 0;
    themes.forEach((t) => {
      if (t.type === 'client') {
        client++;
      } else {
        template++;
      }
    });
    return {
      all: themes.length,
      template,
      client,
    };
  }, [themes]);

  // Themes filtered by main type tab first
  const typeFilteredThemes = useMemo(() => {
    if (activeType === 'all') return themes;
    return themes.filter((t) => {
      const itemType = t.type || 'template';
      return itemType === activeType;
    });
  }, [themes, activeType]);

  // Dynamically extract unique categories from the active type subset
  const categories = useMemo(() => {
    const uniqueCats = new Set<string>();
    typeFilteredThemes.forEach((t) => {
      if (t.category && t.category.trim()) {
        uniqueCats.add(t.category.trim());
      }
    });
    return ['Tất Cả', ...Array.from(uniqueCats)];
  }, [typeFilteredThemes]);

  // Reset category if it no longer exists when switching type tab
  useEffect(() => {
    if (activeCategory !== 'Tất Cả' && !categories.includes(activeCategory)) {
      setActiveCategory('Tất Cả');
    }
  }, [categories, activeCategory]);

  // Filter themes based on active category & search
  const filteredThemes = useMemo(() => {
    return typeFilteredThemes.filter((theme) => {
      const matchCategory =
        activeCategory === 'Tất Cả' ||
        theme.category.toLowerCase() === activeCategory.toLowerCase() ||
        theme.category.toLowerCase().includes(activeCategory.toLowerCase());

      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        q === '' ||
        theme.title.toLowerCase().includes(q) ||
        theme.description.toLowerCase().includes(q) ||
        theme.tag.toLowerCase().includes(q) ||
        theme.category.toLowerCase().includes(q) ||
        (theme.clientName && theme.clientName.toLowerCase().includes(q));

      return matchCategory && matchSearch;
    });
  }, [typeFilteredThemes, activeCategory, searchQuery]);

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

  const headerInfo = useMemo(() => {
    if (activeType === 'client') {
      return {
        badge: 'Dự Án Thực Tế · Đã Kiểm Chứng',
        badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        title: 'Dự Án Đã Làm Cho Khách',
        subtitle:
          'Những website & hệ thống thực tế do Tikovia trực tiếp thiết kế, phát triển và bàn giao vận hành cho đối tác.',
      };
    }
    if (activeType === 'template') {
      return {
        badge: 'Kho Giao Diện Dựng Sẵn',
        badgeStyle: 'bg-amber-50 text-amber-700 border-amber-200',
        title: 'Kho Theme Mẫu Có Sẵn',
        subtitle:
          'Mẫu giao diện chuẩn UX/UI & SEO, sẵn sàng tùy biến theo thương hiệu riêng và triển khai nhanh chóng.',
      };
    }
    return {
      badge: 'Bộ Sưu Tập & Hồ Sơ Năng Lực',
      badgeStyle: 'bg-amber-50 text-amber-700 border-amber-200',
      title: 'Theme Mẫu & Dự Án Khách Hàng',
      subtitle:
        'Khám phá kho giao diện mẫu dựng sẵn hoặc xem trực tiếp các dự án thực tế chúng tôi đã triển khai cho khách hàng.',
    };
  }, [activeType]);

  return (
    <div>
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 reveal">
        <div>
          <span className={`badge-pill border mb-4 inline-flex ${headerInfo.badgeStyle}`}>
            {headerInfo.badge}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-light text-[#0D1B2A] tracking-tight leading-tight">
            {headerInfo.title}
          </h2>
        </div>
        <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
          {headerInfo.subtitle}
        </p>
      </div>

      {/* Main Segmented Switcher: Tất Cả vs Theme Mẫu vs Dự Án Đã Làm Cho Khách */}
      <div className="mb-8 reveal">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-2 rounded-2xl bg-slate-100/90 border border-slate-200/80">
          {/* Tab 1: Tất Cả */}
          <button
            type="button"
            onClick={() => {
              setActiveType('all');
              setActiveCategory('Tất Cả');
            }}
            className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-left transition-all duration-200 ${
              activeType === 'all'
                ? 'bg-[#0D1B2A] text-white shadow-md ring-1 ring-slate-900'
                : 'bg-white/70 hover:bg-white text-slate-700 border border-transparent hover:border-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">✨</span>
              <div>
                <div className="text-xs sm:text-sm font-bold leading-tight">Tất Cả Hiển Thị</div>
                <div
                  className={`text-[11px] mt-0.5 ${
                    activeType === 'all' ? 'text-slate-300' : 'text-slate-400'
                  }`}
                >
                  Theme mẫu & dự án thực tế
                </div>
              </div>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                activeType === 'all'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-slate-200/80 text-slate-600'
              }`}
            >
              {counts.all}
            </span>
          </button>

          {/* Tab 2: Theme Mẫu */}
          <button
            type="button"
            onClick={() => {
              setActiveType('template');
              setActiveCategory('Tất Cả');
            }}
            className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-left transition-all duration-200 ${
              activeType === 'template'
                ? 'bg-[#0D1B2A] text-white shadow-md ring-1 ring-amber-400/50'
                : 'bg-white/70 hover:bg-white text-slate-700 border border-transparent hover:border-amber-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">🎨</span>
              <div>
                <div className="text-xs sm:text-sm font-bold leading-tight">Theme Mẫu Có Sẵn</div>
                <div
                  className={`text-[11px] mt-0.5 ${
                    activeType === 'template' ? 'text-amber-300' : 'text-slate-400'
                  }`}
                >
                  Chọn mẫu & triển khai nhanh
                </div>
              </div>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                activeType === 'template'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {counts.template}
            </span>
          </button>

          {/* Tab 3: Dự Án Đã Làm Cho Khách */}
          <button
            type="button"
            onClick={() => {
              setActiveType('client');
              setActiveCategory('Tất Cả');
            }}
            className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-left transition-all duration-200 ${
              activeType === 'client'
                ? 'bg-emerald-950 text-white shadow-md ring-1 ring-emerald-400/50'
                : 'bg-white/70 hover:bg-white text-slate-700 border border-transparent hover:border-emerald-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">🏆</span>
              <div>
                <div className="text-xs sm:text-sm font-bold leading-tight">
                  Dự Án Đã Làm Cho Khách
                </div>
                <div
                  className={`text-[11px] mt-0.5 ${
                    activeType === 'client' ? 'text-emerald-300' : 'text-slate-400'
                  }`}
                >
                  Khách hàng thực tế · Uy tín
                </div>
              </div>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                activeType === 'client'
                  ? 'bg-emerald-400 text-slate-950'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {counts.client}
            </span>
          </button>
        </div>

        {/* Contextual Trust / Info Banner */}
        {activeType === 'client' && (
          <div className="mt-3 px-4 py-3 rounded-xl bg-emerald-50/90 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-emerald-900 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                ✓
              </span>
              <span>
                <strong>Bảo chứng chất lượng:</strong> Đây là các dự án thực tế do đội ngũ Tikovia trực tiếp tư vấn, thiết kế và bàn giao cho khách hàng vận hành.
              </span>
            </div>
            <a
              href="#contact"
              className="font-bold text-emerald-700 hover:text-emerald-900 underline whitespace-nowrap"
            >
              Tư vấn dự án riêng →
            </a>
          </div>
        )}

        {activeType === 'template' && (
          <div className="mt-3 px-4 py-3 rounded-xl bg-amber-50/80 border border-amber-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-900 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                ⚡
              </span>
              <span>
                <strong>Tiết kiệm thời gian & chi phí:</strong> Chọn mẫu ưng ý và đội ngũ Tikovia sẽ tùy biến màu sắc, logo, tính năng theo đúng thương hiệu của bạn.
              </span>
            </div>
            <a
              href="#contact"
              className="font-bold text-amber-800 hover:text-amber-950 underline whitespace-nowrap"
            >
              Nhận báo giá theo mẫu →
            </a>
          </div>
        )}
      </div>

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
            placeholder="Tìm kiếm giao diện, dự án..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-[#0D1B2A] placeholder-slate-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
          />
        </div>
      </div>

      {/* Themes Grid */}
      {filteredThemes.length === 0 ? (
        <div className="text-center py-16 saas-card p-8">
          <p className="text-slate-500 text-sm">
            {activeType === 'client' && counts.client === 0
              ? 'Hiện chưa có dự án khách hàng nào được đánh dấu trong mục này.'
              : 'Không tìm thấy giao diện hoặc dự án phù hợp với bộ lọc hiện tại.'}
          </p>
          <button
            onClick={() => {
              setActiveType('all');
              setActiveCategory('Tất Cả');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 bg-amber-50 text-amber-700 font-semibold rounded-lg text-xs hover:bg-amber-100 transition-colors"
          >
            Xem tất cả danh sách
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredThemes.map((theme) => {
            const isClient = theme.type === 'client';
            return (
              <div
                key={theme.id}
                onClick={() => {
                  setSelectedTheme(theme);
                  setCurrentImageIndex(0);
                }}
                className={`spotlight-card saas-card group cursor-pointer overflow-hidden transition-all duration-300 animate-in fade-in zoom-in-95 ${
                  isClient ? 'ring-1 ring-emerald-500/20 hover:ring-emerald-500/50' : ''
                }`}
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-xs font-semibold text-white bg-black/65 backdrop-blur-md px-3 py-1.5 rounded-lg">
                      {isClient ? 'Xem chi tiết dự án thực tế' : 'Nhấp để xem chi tiết & demo'}
                    </span>
                  </div>

                  {/* Top-left Type Badge: Dự Án Khách Hàng vs Theme Mẫu */}
                  <div className="absolute top-3 left-3 z-10">
                    {isClient ? (
                      <span className="px-2.5 py-1 bg-emerald-950/90 text-emerald-300 border border-emerald-400/40 backdrop-blur-md rounded-md text-[10px] font-bold shadow-sm inline-flex items-center gap-1">
                        <span>🏆</span> Dự Án Khách Hàng
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-slate-900/80 text-amber-300 border border-amber-400/30 backdrop-blur-md rounded-md text-[10px] font-bold shadow-sm inline-flex items-center gap-1">
                        <span>🎨</span> Theme Mẫu
                      </span>
                    )}
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
                  <h3 className="text-base font-bold text-[#0D1B2A] mb-1.5 leading-snug group-hover:text-amber-600 transition-colors">
                    {theme.title}
                  </h3>

                  {/* Optional Client Name badge */}
                  {isClient && theme.clientName && (
                    <div className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/70">
                      <span>🤝</span> Đối tác: {theme.clientName}
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
                    {theme.description}
                  </p>

                  {/* CTA */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors group/link ${
                        isClient
                          ? 'text-emerald-700 hover:text-emerald-800'
                          : 'text-amber-700 hover:text-amber-800'
                      }`}
                    >
                      {isClient ? 'Xem Dự Án Thực Tế' : 'Xem Chi Tiết & Demo'}
                      <span className="transition-transform duration-200 group-hover/link:translate-x-0.5">
                        →
                      </span>
                    </button>
                    {isClient ? (
                      <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                        <span>✓</span> Đã Bàn Giao
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-400">Sẵn Sàng Triển Khai</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
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

              {/* Top-left Type & Ratio indicator */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                {selectedTheme.type === 'client' ? (
                  <span className="px-3 py-1 bg-emerald-950/90 text-emerald-300 border border-emerald-400/40 backdrop-blur-md rounded-lg text-[11px] font-bold shadow-sm inline-flex items-center gap-1.5">
                    <span>🏆</span> Dự Án Đã Làm Cho Khách
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-slate-900/85 text-amber-300 border border-amber-400/30 backdrop-blur-md rounded-lg text-[11px] font-bold shadow-sm inline-flex items-center gap-1.5">
                    <span>🎨</span> Theme Mẫu Có Sẵn
                  </span>
                )}
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
                <span className="text-xs font-semibold text-slate-400">
                  Năm thực hiện: {selectedTheme.year}
                </span>
              </div>

              <h3 className="font-display text-2xl md:text-3xl font-light text-[#0D1B2A] mb-2">
                {selectedTheme.title}
              </h3>

              {selectedTheme.type === 'client' && selectedTheme.clientName && (
                <div className="mb-3 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                  <span>🤝</span> Khách hàng / Đối tác: {selectedTheme.clientName}
                </div>
              )}

              <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6">
                {selectedTheme.description}
              </p>

              {/* Specs */}
              <div className="grid grid-cols-3 gap-3 mb-6 p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Phân Loại
                  </div>
                  <div className="text-xs font-bold text-[#0D1B2A] mt-0.5">
                    {selectedTheme.type === 'client' ? 'Dự Án Thực Tế' : 'Theme Mẫu Có Sẵn'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Độ Tương Thích
                  </div>
                  <div className="text-xs font-bold text-[#0D1B2A] mt-0.5">100% Responsive</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Tối Ưu SEO
                  </div>
                  <div className="text-xs font-bold text-emerald-600 mt-0.5">Chuẩn Cấu Trúc</div>
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

                {/* Demo / Live site button */}
                {(() => {
                  const rawUrl = selectedTheme.demoUrl?.trim();
                  if (!rawUrl || rawUrl === '#') return null;
                  const formattedUrl =
                    rawUrl.startsWith('http://') || rawUrl.startsWith('https://')
                      ? rawUrl
                      : `https://${rawUrl}`;
                  return (
                    <a
                      href={formattedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all text-center ${
                        selectedTheme.type === 'client'
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white'
                          : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950'
                      }`}
                    >
                      <span>
                        {selectedTheme.type === 'client'
                          ? 'Xem Website Thực Tế'
                          : 'Xem Demo Trực Tiếp'}
                      </span>
                      <span>↗</span>
                    </a>
                  );
                })()}

                <a
                  href="#contact"
                  onClick={() => setSelectedTheme(null)}
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-[#0D1B2A] text-white font-semibold text-sm hover:bg-[#1a2e42] transition-colors shadow-sm text-center"
                >
                  {selectedTheme.type === 'client'
                    ? 'Làm Website Tương Tự →'
                    : 'Yêu Cầu Tùy Biến Theme Này →'}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
