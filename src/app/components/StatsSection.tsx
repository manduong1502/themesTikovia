'use client';

import React, { useRef, useEffect, useState } from 'react';

import { StatsContent } from '@/lib/content';

interface Props {
  stats?: StatsContent;
}

const defaultStats = [
  { value: 24, suffix: '+', label: 'Themes Đã Thiết Kế', description: 'Trải rộng 8 danh mục ngành' },
  { value: 100, suffix: '%', label: 'Responsive', description: 'Mọi theme hoạt động trên tất cả thiết bị' },
  { value: 3, suffix: 'năm', label: 'Kinh Nghiệm', description: 'Xây dựng giao diện web chuẩn sản xuất' },
  { value: 18, suffix: '+', label: 'Demo Trực Tiếp', description: 'Có thể triển khai và khám phá ngay bây giờ' },
];

function AnimatedStat({ value, suffix, label, description, delay }: {
  value: number;
  suffix: string;
  label: string;
  description: string;
  delay: number;
}) {
  const [count, setCount] = useState(0);
  const [triggered, setTriggered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          setTriggered(true);
          const start = Date.now();
          const duration = 1200;
          const animate = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * value));
            if (progress < 1) requestAnimationFrame(animate);
            else setCount(value);
          };
          setTimeout(() => requestAnimationFrame(animate), delay);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, delay, triggered]);

  return (
    <div ref={ref} className="saas-card p-8 reveal flex flex-col gap-2">
      <div className="font-display leading-none tracking-tight text-[#0D1B2A]" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}>
        <span className="gradient-text">{count}</span>
        <span className="text-amber-400 text-2xl">{suffix}</span>
      </div>
      <div className="text-sm font-bold text-[#0D1B2A] mt-1">{label}</div>
      <div className="text-xs text-slate-400 leading-relaxed">{description}</div>
    </div>
  );
}

export default function StatsSection({ stats }: Props) {
  const badge = stats?.badge || 'Con Số';
  const statsList = stats?.stats && stats.stats.length > 0 ? stats.stats : defaultStats;

  return (
    <section className="py-24 border-t border-slate-100" id="stats">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-16 reveal">
          <span className="badge-pill bg-amber-50 text-amber-700 border border-amber-200">{badge}</span>
          <div className="h-px flex-1 bg-slate-100" />
        </div>

        {/* Headline */}
        <div className="mb-14 max-w-3xl reveal">
          <h2 className="font-display font-light tracking-tight leading-[1.08] text-[#0D1B2A]" style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)' }}>
            Mỗi theme được xây dựng có chủ đích —{' '}
            <span className="gradient-text italic">không lối tắt, không thỏa hiệp.</span>
          </h2>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {statsList.map((stat, i) => (
            <AnimatedStat key={stat.label} {...stat} delay={i * 150} />
          ))}
        </div>

        {/* Process strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 reveal reveal-delay-2">
          {[
            { step: '01', title: 'Bối Cảnh Trước Tiên', body: 'Nghiên cứu ngành, người dùng và bối cảnh cạnh tranh trước khi đưa ra bất kỳ quyết định thiết kế nào.' },
            { step: '02', title: 'Tư Duy Hệ Thống', body: 'Xây dựng hệ thống thiết kế — token, component, pattern — trước khi thiết kế từng trang riêng lẻ.' },
            { step: '03', title: 'Triển Khai & Cải Tiến', body: 'Triển khai demo trực tiếp. Tinh chỉnh dựa trên hành vi viewport thực tế, không chỉ xem trước trên Figma.' },
          ].map(({ step, title, body }) => (
            <div key={step} className="saas-card p-8 group">
              <div className="font-display text-4xl font-light text-slate-100 mb-4 group-hover:text-amber-100 transition-colors">
                {step}
              </div>
              <h3 className="text-sm font-bold text-[#0D1B2A] uppercase tracking-wider mb-3">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
