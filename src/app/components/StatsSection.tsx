'use client';

import React, { useRef, useEffect, useState } from 'react';

import { StatsContent } from '@/lib/content';

interface Props {
  stats?: StatsContent;
}

const defaultStats = [
  { value: 24, suffix: '+', label: 'Giao Diện & Mini App', description: 'Đa dạng ngành nghề từ Spa, BĐS đến E-Commerce' },
  { value: 100, suffix: '%', label: 'Tối Ưu Di Động & SEO', description: 'Tốc độ tải trang vượt trội trên mọi thiết bị' },
  { value: 5, suffix: 'năm', label: 'Kinh Nghiệm Thực Chiến', description: 'Tư vấn, thiết kế và vận hành hệ thống số' },
  { value: 30, suffix: '+', label: 'Dự Án Đã Bàn Giao', description: 'Đồng hành cùng doanh nghiệp tăng trưởng bền vững' },
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
    <div ref={ref} className="saas-card p-7 reveal flex flex-col gap-1.5">
      <div className="font-display leading-none tracking-tight text-[#0D1B2A] tabular-nums" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)' }}>
        <span>{count}</span>
        <span className="text-amber-600 text-2xl ml-0.5">{suffix}</span>
      </div>
      <div className="text-sm font-bold text-[#0D1B2A] mt-2">{label}</div>
      <div className="text-xs text-slate-500 leading-relaxed">{description}</div>
    </div>
  );
}

export default function StatsSection({ stats }: Props) {
  const statsList = stats?.stats && stats.stats.length > 0 ? stats.stats : defaultStats;

  return (
    <section className="py-20 border-t border-slate-200/80" id="stats">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Headline */}
        <div className="mb-12 max-w-3xl reveal">
          <h2 className="font-display font-light tracking-tight leading-[1.12] text-[#0D1B2A]" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.85rem)' }}>
            Mỗi giải pháp được kiến tạo có chủ đích —{' '}
            <span className="italic text-amber-700">chuẩn mực thẩm mỹ & tối ưu chuyển đổi.</span>
          </h2>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsList.map((stat, i) => (
            <AnimatedStat key={stat.label} {...stat} delay={i * 150} />
          ))}
        </div>

        {/* Process strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 reveal reveal-delay-2">
          {[
            { step: '01', title: 'Phân Tích Mô Hình Kinh Doanh', body: 'Nghiên cứu đặc thù ngành hàng, hành vi khách hàng mục tiêu và lợi thế cạnh tranh trước khi phác thảo giao diện.' },
            { step: '02', title: 'Thiết Kế Hệ Thống Đồng Bộ', body: 'Xây dựng Design System riêng biệt cho thương hiệu — từ màu sắc, typography đến cấu trúc luồng đặt hàng/đặt lịch.' },
            { step: '03', title: 'Triển Khai & Tối Ưu Thực Tế', body: 'Kiểm thử hiệu năng thực tế trên mọi thiết bị di động, tích hợp Zalo Mini App/ZNS và bàn giao quản trị dễ dàng.' },
          ].map(({ step, title, body }) => (
            <div key={step} className="saas-card p-7 group">
              <div className="font-mono text-xs font-bold text-amber-700 mb-3 tracking-widest">
                BƯỚC {step}
              </div>
              <h3 className="text-base font-bold text-[#0D1B2A] mb-2">{title}</h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
