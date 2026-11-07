'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  Layers,
  LayoutTemplate,
  Smartphone,
  Award,
  Search,
  ArrowUpRight,
  Images,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  Check,
  Building2,
} from 'lucide-react';
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

type FilterType = 'all' | 'template' | 'miniapp' | 'client';

export default function ThemeGalleryClient({ themes }: Props) {
  const [activeType, setActiveType] = useState<FilterType>('all');
  const [activeCategory, setActiveCategory] = useState<string>('Tất Cả');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  // Refs for sliding indicator on the 4 main tabs
  const mainTabRefs = useRef<Map<FilterType, HTMLButtonElement>>(new Map());
  const [tabIndicator, setTabIndicator] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
    ready: boolean;
  }>({ left: 0, top: 0, width: 0, height: 0, ready: false });

  const updateMainTabIndicator = useCallback((type: FilterType) => {
    const el = mainTabRefs.current.get(type);
    if (el) {
      setTabIndicator({
        left: el.offsetLeft,
        top: el.offsetTop,
        width: el.offsetWidth,
        height: el.offsetHeight,
        ready: true,
      });
    }
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => updateMainTabIndicator(activeType));
    return () => cancelAnimationFrame(raf);
  }, [activeType, updateMainTabIndicator]);

  useEffect(() => {
    const handleResize = () => updateMainTabIndicator(activeType);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeType, updateMainTabIndicator]);

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
      } else if (hash === '#mini-app') {
        setActiveType('miniapp');
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
    let miniapp = 0;
    let client = 0;
    themes.forEach((t) => {
      if (t.type === 'client') {
        client++;
      } else if (t.type === 'miniapp') {
        miniapp++;
      } else {
        template++;
      }
    });
    return {
      all: themes.length,
      template,
      miniapp,
      client,
    };
  }, [themes]);

  // Keep category pills stable across all tabs to prevent vertical layout jumping
  const categories = useMemo(() => {
    const uniqueCats = new Set<string>();
    themes.forEach((t) => {
      if (t.category && t.category.trim()) {
        uniqueCats.add(t.category.trim());
      }
    });
    return ['Tất Cả', ...Array.from(uniqueCats)];
  }, [themes]);

  // Filter themes based on activeType, activeCategory & searchQuery
  const filteredThemes = useMemo(() => {
    return themes.filter((theme) => {
      const itemType = theme.type || 'template';
      const matchType = activeType === 'all' || itemType === activeType;

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

      return matchType && matchCategory && matchSearch;
    });
  }, [themes, activeType, activeCategory, searchQuery]);

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
        title: 'Dự Án Đã Triển Khai',
        subtitle:
          'Các hệ thống website thực tế do đội ngũ Tikovia trực tiếp thiết kế UI/UX, lập trình và bàn giao vận hành cho đối tác.',
      };
    }
    if (activeType === 'miniapp') {
      return {
        title: 'Giải Pháp Zalo Mini App',
        subtitle:
          'Ứng dụng đặt lịch, tích điểm thành viên, bán hàng và gửi thông báo ZNS tự động ngay trên nền tảng Zalo.',
      };
    }
    if (activeType === 'template') {
      return {
        title: 'Kho Giao Diện Mẫu',
        subtitle:
          'Giao diện dựng sẵn chuẩn UX/UI và cấu trúc SEO, tùy biến linh hoạt theo nhận diện thương hiệu riêng với thời gian triển khai nhanh.',
      };
    }
    return {
      title: 'Kho Giao Diện & Dự Án Thực Tế',
      subtitle:
        'Khám phá bộ sưu tập giao diện web dựng sẵn, ứng dụng Zalo Mini App và các dự án thực tế đã triển khai cho khách hàng.',
    };
  }, [activeType]);

  const tabItems: {
    key: FilterType;
    label: string;
    count: number;
    Icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { key: 'all', label: 'Tất Cả', count: counts.all, Icon: Layers },
    { key: 'template', label: 'Theme Mẫu', count: counts.template, Icon: LayoutTemplate },
    { key: 'miniapp', label: 'Zalo Mini App', count: counts.miniapp, Icon: Smartphone },
    { key: 'client', label: 'Dự Án Thực Tế', count: counts.client, Icon: Award },
  ];

  return (
    <div>
      {/* Section Header — Editorial typography, no redundant kicker pill */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div key={`title-${activeType}`} className="smooth-content-swap">
          <h2 className="font-display text-4xl md:text-5xl font-light text-[#0D1B2A] tracking-tight leading-tight">
            {headerInfo.title}
          </h2>
        </div>
        <p
          key={`sub-${activeType}`}
          className="text-slate-500 text-sm max-w-md leading-relaxed smooth-content-swap"
        >
          {headerInfo.subtitle}
        </p>
      </div>

      {/* Unified Control Bar: Segmented Type Tabs + Search Input */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
        {/* Segmented Pill Switcher */}
        <div className="relative grid grid-cols-2 sm:inline-flex sm:flex-wrap items-center p-1.5 rounded-2xl bg-slate-100 border border-slate-200/80">
          {/* Sliding Active Background Pill */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 rounded-xl bg-[#0D1B2A] shadow-sm transition-[transform,width,height,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
            style={{
              transform: `translate3d(${tabIndicator.left}px, ${tabIndicator.top}px, 0)`,
              width: `${tabIndicator.width}px`,
              height: `${tabIndicator.height}px`,
              opacity: tabIndicator.ready ? 1 : 0,
            }}
          />

          {tabItems.map(({ key, label, count, Icon }) => {
            const isActive = activeType === key;
            return (
              <button
                key={key}
                ref={(el) => {
                  if (el) mainTabRefs.current.set(key, el);
                }}
                type="button"
                onClick={() => setActiveType(key)}
                className={`relative z-10 flex items-center justify-center sm:justify-start gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors duration-200 ${
                  isActive ? 'text-white' : 'text-slate-600 hover:text-[#0D1B2A]'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 transition-colors duration-200 ${
                    isActive ? 'text-amber-400' : 'text-slate-400'
                  }`}
                />
                <span>{label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold tabular-nums transition-colors duration-200 ${
                    isActive
                      ? 'bg-white/15 text-amber-300'
                      : 'bg-slate-200/70 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative w-full lg:w-72 flex-shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc ngành nghề..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#0D1B2A] placeholder-slate-400 focus:bg-white focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all duration-200"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Xóa tìm kiếm"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-10 pb-6 border-b border-slate-100">
        {categories.map((cat) => {
          const isCatActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isCatActive
                  ? 'bg-[#0D1B2A] text-white font-semibold shadow-sm'
                  : 'bg-white border border-slate-200/90 text-slate-600 hover:border-slate-300 hover:text-[#0D1B2A]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Themes Grid — Stable min-height + smooth staggered card entrance */}
      <div className="min-h-[380px]">
        {filteredThemes.length === 0 ? (
          <div
            key={`empty-${activeType}-${activeCategory}`}
            className="text-center py-16 saas-card p-8 gallery-card-enter"
          >
            <p className="text-slate-500 text-sm">
              {activeType === 'miniapp' && counts.miniapp === 0
                ? 'Hiện chưa có mẫu Zalo Mini App nào trong danh mục này.'
                : activeType === 'client' && counts.client === 0
                ? 'Hiện chưa có dự án khách hàng nào trong danh mục này.'
                : 'Không tìm thấy giao diện hoặc dự án phù hợp với bộ lọc hiện tại.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveType('all');
                setActiveCategory('Tất Cả');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-slate-100 text-[#0D1B2A] font-semibold rounded-lg text-xs hover:bg-slate-200 transition-colors"
            >
              Xem toàn bộ danh sách
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredThemes.map((theme, idx) => {
              const isClient = theme.type === 'client';
              const isMiniApp = theme.type === 'miniapp';
              return (
                <div
                  key={`${activeType}-${activeCategory}-${theme.id}`}
                  style={{ animationDelay: `${Math.min(idx * 35, 210)}ms` }}
                  onClick={() => {
                    setSelectedTheme(theme);
                    setCurrentImageIndex(0);
                  }}
                  className="spotlight-card saas-card gallery-card-enter group cursor-pointer overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Image area — Clean, minimal overlays so artwork shines */}
                    <div className="theme-img-wrap relative aspect-[4/3] w-full bg-slate-100 overflow-hidden rounded-t-[calc(var(--radius)-1px)]">
                      <AppImage
                        src={theme.image}
                        alt={theme.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />

                      {/* Subtle dark gradient on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] flex items-end justify-between p-4">
                        <span className="text-xs font-medium text-white bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5">
                          <span>{isClient ? 'Xem dự án' : 'Xem chi tiết'}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </div>

                      {/* Top-left subtle status pill ONLY when needed to distinguish type */}
                      {(activeType === 'all' || isClient || isMiniApp) && (
                        <div className="absolute top-3 left-3 z-10">
                          {isClient ? (
                            <span className="px-2.5 py-1 bg-[#0D1B2A]/90 text-white backdrop-blur-md rounded-md text-[10px] font-semibold tracking-wide shadow-sm inline-flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              Dự Án Thực Tế
                            </span>
                          ) : isMiniApp ? (
                            <span className="px-2.5 py-1 bg-[#0D1B2A]/90 text-white backdrop-blur-md rounded-md text-[10px] font-semibold tracking-wide shadow-sm inline-flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                              Zalo Mini App
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-white/90 text-[#0D1B2A] backdrop-blur-md rounded-md text-[10px] font-semibold tracking-wide shadow-sm">
                              Theme Mẫu
                            </span>
                          )}
                        </div>
                      )}

                      {/* Multi-image count indicator */}
                      {theme.images && theme.images.length > 1 && (
                        <div className="absolute bottom-3 right-3 z-10">
                          <span className="px-2 py-1 bg-black/65 backdrop-blur-sm rounded-md text-[10px] font-medium text-white shadow-sm inline-flex items-center gap-1 tabular-nums">
                            <Images className="w-3 h-3" />
                            <span>{theme.images.length}</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 pb-4">
                      {/* Category + tag row */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          {theme.category}
                        </span>
                        <span className={`text-xs font-semibold ${theme.accentColor}`}>
                          {theme.tag}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-[#0D1B2A] mb-1.5 leading-snug group-hover:text-amber-600 transition-colors duration-200">
                        {theme.title}
                      </h3>

                      {/* Optional Client Name */}
                      {isClient && theme.clientName && (
                        <div className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>Đối tác: {theme.clientName}</span>
                        </div>
                      )}

                      {/* Description */}
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                        {theme.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0D1B2A] group-hover:text-amber-600 transition-colors duration-200">
                      <span>
                        {isClient
                          ? 'Xem Dự Án Thực Tế'
                          : isMiniApp
                          ? 'Xem Giải Pháp Mini App'
                          : 'Xem Chi Tiết & Demo'}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>

                    <span className="text-[11px] font-medium text-slate-400 tabular-nums">
                      {theme.year}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Theme Detail Modal */}
      {selectedTheme && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm modal-backdrop-anim"
          onClick={() => setSelectedTheme(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 relative modal-dialog-anim max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal close button */}
            <button
              onClick={() => setSelectedTheme(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-black/55 text-white hover:bg-black/80 backdrop-blur-md transition-colors shadow-md"
              aria-label="Đóng"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Image with 4:3 aspect ratio & Smooth Crossfade Gallery Slider */}
            <div className="relative aspect-[4/3] w-full bg-slate-100 flex-shrink-0 group/slider overflow-hidden">
              <div key={currentImageIndex} className="absolute inset-0 smooth-content-swap">
                <AppImage
                  src={activeImages[currentImageIndex] || selectedTheme.image}
                  alt={`${selectedTheme.alt || selectedTheme.title} - Ảnh ${currentImageIndex + 1}`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Slider Left Arrow */}
              {activeImages.length > 1 && (
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/55 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all duration-200 shadow-lg active:scale-95"
                  aria-label="Ảnh trước"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {/* Slider Right Arrow */}
              {activeImages.length > 1 && (
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/55 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all duration-200 shadow-lg active:scale-95"
                  aria-label="Ảnh tiếp theo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}

              {/* Counter badge */}
              {activeImages.length > 1 && (
                <div className="absolute bottom-3 right-3 z-10">
                  <span className="px-3 py-1 bg-black/70 backdrop-blur-md rounded-lg text-xs font-semibold text-white shadow-sm tabular-nums">
                    {currentImageIndex + 1} / {activeImages.length}
                  </span>
                </div>
              )}

              {/* Top-left Type indicator */}
              <div className="absolute top-4 left-4 z-10">
                {selectedTheme.type === 'client' ? (
                  <span className="px-3 py-1 bg-[#0D1B2A]/90 text-white backdrop-blur-md rounded-lg text-xs font-semibold shadow-sm inline-flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Dự Án Đã Triển Khai
                  </span>
                ) : selectedTheme.type === 'miniapp' ? (
                  <span className="px-3 py-1 bg-[#0D1B2A]/90 text-white backdrop-blur-md rounded-lg text-xs font-semibold shadow-sm inline-flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    Giải Pháp Zalo Mini App
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-white/95 text-[#0D1B2A] backdrop-blur-md rounded-lg text-xs font-semibold shadow-sm">
                    Giao Diện Mẫu Có Sẵn
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail selector strip if multiple images */}
            {activeImages.length > 1 && (
              <div className="flex gap-2.5 px-6 py-3 bg-slate-50 overflow-x-auto border-b border-slate-100 flex-shrink-0">
                {activeImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-14 aspect-[4/3] rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all duration-200 ${
                      currentImageIndex === idx
                        ? 'border-[#0D1B2A] ring-2 ring-slate-300 shadow-sm scale-105'
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
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-md">
                    {selectedTheme.category}
                  </span>
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                    {selectedTheme.tag}
                  </span>
                </div>
                <span className="text-xs font-medium text-slate-400 tabular-nums">
                  Năm thực hiện: {selectedTheme.year}
                </span>
              </div>

              <h3 className="font-display text-2xl md:text-3xl font-light text-[#0D1B2A] mb-2">
                {selectedTheme.title}
              </h3>

              {selectedTheme.type === 'client' && selectedTheme.clientName && (
                <div className="mb-3 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100 text-xs font-semibold text-[#0D1B2A]">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Khách hàng / Đối tác: {selectedTheme.clientName}</span>
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
                    {selectedTheme.type === 'client'
                      ? 'Dự Án Thực Tế'
                      : selectedTheme.type === 'miniapp'
                      ? 'Zalo Mini App'
                      : 'Theme Mẫu Có Sẵn'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Nền Tảng
                  </div>
                  <div className="text-xs font-bold text-[#0D1B2A] mt-0.5">
                    {selectedTheme.type === 'miniapp' ? 'Zalo App & Mobile' : '100% Responsive'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Tiêu Chuẩn
                  </div>
                  <div className="text-xs font-bold text-emerald-700 mt-0.5 inline-flex items-center justify-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>{selectedTheme.type === 'miniapp' ? 'ZNS / OA Ready' : 'Chuẩn SEO'}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
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
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-sm hover:shadow transition-all duration-200 text-center"
                    >
                      <span>
                        {selectedTheme.type === 'client'
                          ? 'Xem Website Thực Tế'
                          : selectedTheme.type === 'miniapp'
                          ? 'Trải Nghiệm Mini App'
                          : 'Xem Demo Trực Tiếp'}
                      </span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  );
                })()}

                <a
                  href="#contact"
                  onClick={() => {
                    if (typeof window !== 'undefined' && selectedTheme?.title) {
                      window.dispatchEvent(
                        new CustomEvent('tikovia:select-theme', { detail: selectedTheme.title })
                      );
                    }
                    setSelectedTheme(null);
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#0D1B2A] text-white font-semibold text-sm hover:bg-[#1a2e42] transition-colors shadow-sm text-center"
                >
                  <span>
                    {selectedTheme.type === 'client'
                      ? 'Làm Website Tương Tự'
                      : selectedTheme.type === 'miniapp'
                      ? 'Tư Vấn Mini App Này'
                      : 'Yêu Cầu Tùy Biến Mẫu Này'}
                  </span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
