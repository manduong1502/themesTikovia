import React from 'react';
import AppImage from '@/components/ui/AppImage';
import { AboutContent } from '@/lib/content';

interface Props {
  about?: AboutContent;
}

const defaultSkills = [
  { name: 'Thiết Kế UI/UX & Nhận Diện', level: 98 },
  { name: 'Bố Cục Đa Thiết Bị (Responsive)', level: 100 },
  { name: 'Tối Ưu Cấu Trúc Chuẩn SEO', level: 96 },
  { name: 'Tốc Độ Tải Trang & Core Web Vitals', level: 95 },
  { name: 'Phát Triển Zalo Mini App & ZNS', level: 95 },
  { name: 'Kiến Trúc Hệ Thống & Bảo Mật', level: 94 },
];

const defaultTools = ['Next.js', 'React', 'Tailwind CSS', 'Zalo Mini App', 'TypeScript', 'Figma', 'Docker'];

export default function AboutSection({ about }: Props) {
  const title = about?.title || 'Tạo ra những trải nghiệm kỹ thuật số khiến khách hàng';
  const highlightText = about?.highlightText || 'tin tưởng ngay từ cái nhìn đầu tiên.';
  const rawParagraphs = about?.paragraphs || [];
  const paragraphs =
    rawParagraphs.length > 0 && !rawParagraphs[0]?.startsWith('Tôi thiết kế')
      ? rawParagraphs
      : [
          'Tikovia xây dựng các giao diện website và Zalo Mini App cân bằng giữa thẩm mỹ thương hiệu và hiệu quả chuyển đổi thực tế. Mỗi sản phẩm đều xuất phát từ bài toán kinh doanh cụ thể của từng ngành hàng.',
          'Quy trình của chúng tôi tập trung vào tốc độ tải trang, cấu trúc chuẩn SEO và trải nghiệm mượt mà trên điện thoại — giúp doanh nghiệp sở hữu nền tảng số chuyên nghiệp, dễ dàng quản trị và mở rộng.',
        ];
  const skills = about?.skills && about.skills.length > 0 ? about.skills : defaultSkills;
  const tools = about?.tools && about.tools.length > 0 ? about.tools : defaultTools;
  const studioImage =
    about?.studioImage ||
    'https://img.rocket.new/generatedImages/rocket_gen_img_137ddd9e4-1772074857584.png';
  const studioBadge = about?.studioBadge || 'Tikovia Digital Studio';

  return (
    <section id="about" className="py-24 border-t border-slate-100 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0">
          {/* Left — bio */}
          <div className="lg:col-span-5 lg:pr-16 flex flex-col justify-between">
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-light text-[#0D1B2A] tracking-tight leading-[1.08] mb-6 reveal reveal-delay-1">
                {title}{' '}
                <em className="text-amber-600 font-normal">{highlightText}</em>
              </h2>
              {paragraphs.map((p, idx) => (
                <p
                  key={idx}
                  className={`text-slate-500 text-base leading-relaxed mb-5 reveal reveal-delay-${Math.min(
                    idx + 2,
                    5
                  )}`}
                >
                  {p}
                </p>
              ))}
            </div>

            {/* Tools */}
            <div className="mt-10 reveal reveal-delay-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-4">
                Nền Tảng & Công Nghệ
              </span>
              <div className="flex flex-wrap gap-2">
                {tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:border-amber-300 hover:text-amber-700 transition-colors duration-200"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right — skills + image */}
          <div className="lg:col-span-7 lg:pl-16 lg:border-l border-slate-100">
            {/* Image */}
            <div className="relative mb-10 reveal">
              <div className="aspect-[16/7] overflow-hidden relative rounded-xl shadow-sm">
                <AppImage
                  src={studioImage}
                  alt="Không gian làm việc thiết kế studio"
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/15 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-lg text-[10px] font-semibold tracking-widest uppercase text-[#0D1B2A] shadow-sm">
                    {studioBadge}
                  </span>
                </div>
              </div>
            </div>

            {/* Skill bars */}
            <div className="space-y-4 reveal reveal-delay-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-5">
                Tiêu Chuẩn Triển Khai
              </span>
              {skills.map((skill, i) => (
                <div key={skill.name} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-slate-700 tracking-wide">
                      {skill.name}
                    </span>
                    <span className="text-xs font-bold text-[#0D1B2A] tabular-nums">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-200/70 rounded-full relative overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-[#0D1B2A] rounded-full transition-all duration-700"
                      style={{ width: `${skill.level}%`, transitionDelay: `${i * 80}ms` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
