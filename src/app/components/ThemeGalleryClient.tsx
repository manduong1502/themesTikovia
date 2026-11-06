'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
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
        badge: 'Dự Án Thực Tế · Đã Kiểm Chứng',
        badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        title: 'Dự Án Đã Làm Cho Khách',
        subtitle:
          'Những website & hệ thống thực tế do Tikovia trực tiếp thiết kế, phát triển và bàn giao vận hành cho đối tác.',
        bannerBg: 'bg-emerald-50/90 border-emerald-200/80 text-emerald-900',
        bannerIconBg: 'bg-emerald-600 text-white',
        bannerIcon: '✓',
        bannerStrong: 'Bảo chứng chất lượng:',
        bannerText:
          'Đây là các dự án thực tế do đội ngũ Tikovia trực tiếp tư vấn, thiết kế và bàn giao cho khách hàng vận hành.',
        bannerCta: 'Tư vấn dự án riêng →',
        bannerCtaClass: 'text-emerald-700 hover:text-emerald-950',
      };
    }
    if (activeType === 'miniapp') {
      return {
        badge: 'Zalo Mini App & Ứng Dụng Tiện Ích',
        badgeStyle: 'bg-blue-50 text-blue-700 border-blue-200',
        title: 'Kho Mẫu Zalo Mini App',
        subtitle:
          'Giải pháp đặt lịch, bán hàng, tích điểm thành viên & CSKH tự động ngay trên Zalo mà không cần tải thêm ứng dụng.',
        bannerBg: 'bg-blue-50/90 border-blue-200/80 text-blue-900',
        bannerIconBg: 'bg-blue-600 text-white',
        bannerIcon: '📱',
        bannerStrong: 'Tiếp cận 75+ triệu người dùng Zalo:',
        bannerText:
          'Khách hàng mở Mini App chỉ với 1 chạm hoặc quét QR — tích hợp sẵn thông báo ZNS, giỏ hàng và quản trị tập trung.',
        bannerCta: 'Nhận tư vấn Mini App →',
        bannerCtaClass: 'text-blue-700 hover:text-blue-950',
      };
    }
    if (activeType === 'template') {
      return {
        badge: 'Kho Giao Diện Dựng Sẵn',
        badgeStyle: 'bg-amber-50 text-amber-700 border-amber-200',
        title: 'Kho Theme Mẫu Có Sẵn',
        subtitle:
          'Mẫu giao diện chuẩn UX/UI & SEO, sẵn sàng tùy biến theo thương hiệu riêng và triển khai nhanh chóng.',
        bannerBg: 'bg-amber-50/80 border-amber-200/70 text-amber-900',
        bannerIconBg: 'bg-amber-500 text-slate-950',
        bannerIcon: '⚡',
        bannerStrong: 'Tiết kiệm thời gian & chi phí:',
        bannerText:
          'Chọn mẫu ưng ý và đội ngũ Tikovia sẽ tùy biến màu sắc, logo, tính năng theo đúng thương hiệu của bạn.',
        bannerCta: 'Nhận báo giá theo mẫu →',
        bannerCtaClass: 'text-amber-800 hover:text-amber-950',
      };
    }
    return {
      badge: 'Bộ Sưu Tập & Hồ Sơ Năng Lực',
      badgeStyle: 'bg-amber-50 text-amber-700 border-amber-200',
      title: 'Theme Mẫu, Mini App & Dự Án',
      subtitle:
        'Khám phá kho giao diện web dựng sẵn, giải pháp Zalo Mini App và các dự án thực tế đã triển khai cho khách hàng.',
      bannerBg: 'bg-slate-100/90 border-slate-200/80 text-slate-700',
      bannerIconBg: 'bg-[#0D1B2A] text-amber-400',
      bannerIcon: '✨',
      bannerStrong: 'Giải pháp số toàn diện:',
      bannerText:
        'Chọn nhanh từ Kho Theme Mẫu Web, trải nghiệm Zalo Mini App hoặc tham khảo các Dự Án Thực Tế đã bàn giao.',
      bannerCta: 'Nhận tư vấn miễn phí →',
      bannerCtaClass: 'text-[#0D1B2A] hover:text-amber-700',
    };
  }, [activeType]);

  const indicatorBgClass = useMemo(() => {
    if (activeType === 'client') return 'bg-emerald-950 ring-1 ring-emerald-400/50';
    if (activeType === 'miniapp') return 'bg-blue-950 ring-1 ring-blue-400/50';
    return 'bg-[#0D1B2A] ring-1 ring-amber-400/40';
  }, [activeType]);

  return (
    <div>
      {/* Section Header — Smooth crossfade without height jump */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div key={`title-${activeType}`} className="smooth-content-swap">
          <span
            className={`badge-pill border mb-4 inline-flex transition-colors duration-300 ${headerInfo.badgeStyle}`}
          >
            {headerInfo.badge}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-light text-[#0D1B2A] tracking-tight leading-tight">
            {headerInfo.title}
          </h2>
        </div>
        <p
          key={`sub-${activeType}`}
          className="text-slate-500 text-sm max-w-sm leading-relaxed smooth-content-swap"
        >
          {headerInfo.subtitle}
        </p>
      </div>

      {/* Main Segmented Switcher (4 Tabs) with GPU Sliding Pill Indicator */}
      <div className="mb-8">
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 p-2 rounded-2xl bg-slate-100/90 border border-slate-200/80">
          {/* Sliding Active Background Pill */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute top-0 left-0 rounded-xl shadow-md transition-[transform,width,height,background-color,opacity] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${indicatorBgClass}`}
            style={{
              transform: `translate3d(${tabIndicator.left}px, ${tabIndicator.top}px, 0)`,
              width: `${tabIndicator.width}px`,
              height: `${tabIndicator.height}px`,
              opacity: tabIndicator.ready ? 1 : 0,
            }}
          />

          {/* Tab 1: Tất Cả */}
          <button
            ref={(el) => {
              if (el) mainTabRefs.current.set('all', el);
            }}
            type="button"
            onClick={() => setActiveType('all')}
            className={`relative z-10 flex items-center justify-between px-3.5 py-3.5 rounded-xl text-left transition-colors duration-300 ${
              activeType === 'all' ? 'text-white' : 'text-slate-700 hover:text-[#0D1B2A]'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-base flex-shrink-0">✨</span>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold leading-tight truncate">
                  Tất Cả Hiển Thị
                </div>
                <div
                  className={`text-[11px] mt-0.5 truncate transition-colors duration-300 ${
                    activeType === 'all' ? 'text-slate-300' : 'text-slate-400'
                  }`}
                >
                  Web, Mini App & Dự án
                </div>
              </div>
            </div>
            <span
              className={`ml-2 px-2 py-0.5 rounded-full text-xs font-extrabold flex-shrink-0 transition-colors duration-300 ${
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
            ref={(el) => {
              if (el) mainTabRefs.current.set('template', el);
            }}
            type="button"
            onClick={() => setActiveType('template')}
            className={`relative z-10 flex items-center justify-between px-3.5 py-3.5 rounded-xl text-left transition-colors duration-300 ${
              activeType === 'template' ? 'text-white' : 'text-slate-700 hover:text-[#0D1B2A]'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-base flex-shrink-0">🎨</span>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold leading-tight truncate">
                  Theme Mẫu Có Sẵn
                </div>
                <div
                  className={`text-[11px] mt-0.5 truncate transition-colors duration-300 ${
                    activeType === 'template' ? 'text-amber-300' : 'text-slate-400'
                  }`}
                >
                  Chọn mẫu & triển khai nhanh
                </div>
              </div>
            </div>
            <span
              className={`ml-2 px-2 py-0.5 rounded-full text-xs font-extrabold flex-shrink-0 transition-colors duration-300 ${
                activeType === 'template'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {counts.template}
            </span>
          </button>

          {/* Tab 3: Mini App */}
          <button
            ref={(el) => {
              if (el) mainTabRefs.current.set('miniapp', el);
            }}
            type="button"
            onClick={() => setActiveType('miniapp')}
            className={`relative z-10 flex items-center justify-between px-3.5 py-3.5 rounded-xl text-left transition-colors duration-300 ${
              activeType === 'miniapp' ? 'text-white' : 'text-slate-700 hover:text-[#0D1B2A]'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-base flex-shrink-0">📱</span>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold leading-tight truncate">
                  Zalo Mini App
                </div>
                <div
                  className={`text-[11px] mt-0.5 truncate transition-colors duration-300 ${
                    activeType === 'miniapp' ? 'text-blue-300' : 'text-slate-400'
                  }`}
                >
                  Đặt lịch, tích điểm & bán hàng
                </div>
              </div>
            </div>
            <span
              className={`ml-2 px-2 py-0.5 rounded-full text-xs font-extrabold flex-shrink-0 transition-colors duration-300 ${
                activeType === 'miniapp'
                  ? 'bg-blue-400 text-slate-950'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {counts.miniapp}
            </span>
          </button>

          {/* Tab 4: Dự Án Đã Làm Cho Khách */}
          <button
            ref={(el) => {
              if (el) mainTabRefs.current.set('client', el);
            }}
            type="button"
            onClick={() => setActiveType('client')}
            className={`relative z-10 flex items-center justify-between px-3.5 py-3.5 rounded-xl text-left transition-colors duration-300 ${
              activeType === 'client' ? 'text-white' : 'text-slate-700 hover:text-[#0D1B2A]'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-base flex-shrink-0">🏆</span>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold leading-tight truncate">
                  Dự Án Đã Làm
                </div>
                <div
                  className={`text-[11px] mt-0.5 truncate transition-colors duration-300 ${
                    activeType === 'client' ? 'text-emerald-300' : 'text-slate-400'
                  }`}
                >
                  Khách hàng thực tế · Uy tín
                </div>
              </div>
            </div>
            <span
              className={`ml-2 px-2 py-0.5 rounded-full text-xs font-extrabold flex-shrink-0 transition-colors duration-300 ${
                activeType === 'client'
                  ? 'bg-emerald-400 text-slate-950'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {counts.client}
            </span>
          </button>
        </div>

        {/* Always-mounted Contextual Trust / Info Banner (prevents layout jump!) */}
        <div
          className={`mt-3 px-4 py-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${headerInfo.bannerBg}`}
        >
          <div className="flex items-center gap-2.5">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 transition-colors duration-300 ${headerInfo.bannerIconBg}`}
            >
              {headerInfo.bannerIcon}
            </span>
            <span>
              <strong>{headerInfo.bannerStrong}</strong> {headerInfo.bannerText}
            </span>
          </div>
          <a
            href="#contact"
            className={`font-bold underline whitespace-nowrap transition-colors duration-200 ${headerInfo.bannerCtaClass}`}
          >
            {headerInfo.bannerCta}
          </a>
        </div>
      </div>

      {/* Category filter & Search bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isCatActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isCatActive
                    ? 'bg-[#0D1B2A] text-white shadow-sm scale-[1.02]'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-amber-300 hover:text-[#0D1B2A]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="w-full md:w-64 flex-shrink-0">
          <input
            type="text"
            placeholder="Tìm kiếm giao diện, mini app..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-[#0D1B2A] placeholder-slate-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all duration-200"
          />
        </div>
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
                ? 'Hiện chưa có mẫu Zalo Mini App nào được thêm vào mục này.'
                : activeType === 'client' && counts.client === 0
                ? 'Hiện chưa có dự án khách hàng nào được đánh dấu trong mục này.'
                : 'Không tìm thấy giao diện hoặc dự án phù hợp với bộ lọc hiện tại.'}
            </p>
            <button
              type="button"
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
                  className={`spotlight-card saas-card gallery-card-enter group cursor-pointer overflow-hidden ${
                    isClient
                      ? 'ring-1 ring-emerald-500/20 hover:ring-emerald-500/50'
                      : isMiniApp
                      ? 'ring-1 ring-blue-500/20 hover:ring-blue-500/50'
                      : ''
                  }`}
                >
                  {/* Image area */}
                  <div className="theme-img-wrap relative aspect-[4/3] w-full bg-slate-50 overflow-hidden rounded-t-[calc(var(--radius)-1px)]">
                    <AppImage
                      src={theme.image}
                      alt={theme.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                    {/* Subtle overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] flex items-end p-4">
                      <span className="text-xs font-semibold text-white bg-black/65 backdrop-blur-md px-3 py-1.5 rounded-lg">
                        {isClient
                          ? 'Xem chi tiết dự án thực tế'
                          : isMiniApp
                          ? 'Xem chi tiết & trải nghiệm Mini App'
                          : 'Nhấp để xem chi tiết & demo'}
                      </span>
                    </div>

                    {/* Top-left Type Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      {isClient ? (
                        <span className="px-2.5 py-1 bg-emerald-950/90 text-emerald-300 border border-emerald-400/40 backdrop-blur-md rounded-md text-[10px] font-bold shadow-sm inline-flex items-center gap-1">
                          <span>🏆</span> Dự Án Khách Hàng
                        </span>
                      ) : isMiniApp ? (
                        <span className="px-2.5 py-1 bg-blue-950/90 text-blue-300 border border-blue-400/40 backdrop-blur-md rounded-md text-[10px] font-bold shadow-sm inline-flex items-center gap-1">
                          <span>📱</span> Zalo Mini App
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
                      <span className={`text-xs font-semibold ${theme.accentColor}`}>
                        {theme.tag}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-[#0D1B2A] mb-1.5 leading-snug group-hover:text-amber-600 transition-colors duration-200">
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
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors duration-200 group/link ${
                          isClient
                            ? 'text-emerald-700 hover:text-emerald-800'
                            : isMiniApp
                            ? 'text-blue-700 hover:text-blue-800'
                            : 'text-amber-700 hover:text-amber-800'
                        }`}
                      >
                        {isClient
                          ? 'Xem Dự Án Thực Tế'
                          : isMiniApp
                          ? 'Xem Chi Tiết Mini App'
                          : 'Xem Chi Tiết & Demo'}
                        <span className="transition-transform duration-200 group-hover/link:translate-x-0.5">
                          →
                        </span>
                      </button>
                      {isClient ? (
                        <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                          <span>✓</span> Đã Bàn Giao
                        </span>
                      ) : isMiniApp ? (
                        <span className="text-[11px] font-semibold text-blue-600 flex items-center gap-1">
                          <span>⚡</span> Mở Trên Zalo
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-slate-400">
                          Sẵn Sàng Triển Khai
                        </span>
                      )}
                    </div>
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm modal-backdrop-anim"
          onClick={() => setSelectedTheme(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 relative modal-dialog-anim max-h-[92vh] flex flex-col"
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
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all duration-200 shadow-lg active:scale-95 text-sm"
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all duration-200 shadow-lg active:scale-95 text-sm"
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

              {/* Top-left Type indicator */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                {selectedTheme.type === 'client' ? (
                  <span className="px-3 py-1 bg-emerald-950/90 text-emerald-300 border border-emerald-400/40 backdrop-blur-md rounded-lg text-[11px] font-bold shadow-sm inline-flex items-center gap-1.5">
                    <span>🏆</span> Dự Án Đã Làm Cho Khách
                  </span>
                ) : selectedTheme.type === 'miniapp' ? (
                  <span className="px-3 py-1 bg-blue-950/90 text-blue-300 border border-blue-400/40 backdrop-blur-md rounded-lg text-[11px] font-bold shadow-sm inline-flex items-center gap-1.5">
                    <span>📱</span> Zalo Mini App
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
                    className={`relative w-14 aspect-[4/3] rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all duration-200 ${
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
                    Hiệu Năng
                  </div>
                  <div className="text-xs font-bold text-emerald-600 mt-0.5">
                    {selectedTheme.type === 'miniapp' ? 'Tích Hợp ZNS / OA' : 'Chuẩn Cấu Trúc SEO'}
                  </div>
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
                      className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 text-center ${
                        selectedTheme.type === 'client'
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white'
                          : selectedTheme.type === 'miniapp'
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white'
                          : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950'
                      }`}
                    >
                      <span>
                        {selectedTheme.type === 'client'
                          ? 'Xem Website Thực Tế'
                          : selectedTheme.type === 'miniapp'
                          ? 'Trải Nghiệm Mini App'
                          : 'Xem Demo Trực Tiếp'}
                      </span>
                      <span>↗</span>
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
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-[#0D1B2A] text-white font-semibold text-sm hover:bg-[#1a2e42] transition-colors shadow-sm text-center"
                >
                  {selectedTheme.type === 'client'
                    ? 'Làm Website Tương Tự →'
                    : selectedTheme.type === 'miniapp'
                    ? 'Tư Vấn Làm Mini App Này →'
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
