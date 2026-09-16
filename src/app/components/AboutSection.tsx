import React from 'react';
import AppImage from '@/components/ui/AppImage';
import { AboutContent } from '@/lib/content';

interface Props {
  about?: AboutContent;
}

const defaultSkills = [
  { name: 'Thiết Kế UI/UX', level: 95 },
  { name: 'Bố Cục Responsive', level: 98 },
  { name: 'Hệ Thống Typography', level: 90 },
  { name: 'Chuyển Động & Hoạt Ảnh', level: 85 },
  { name: 'Hệ Thống Thiết Kế', level: 88 },
  { name: 'Lập Trình Frontend', level: 80 },
];

const defaultTools = ['Figma', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'GSAP', 'Webflow', 'Adobe CC'];

export default function AboutSection({ about }: Props) {
  const badge = about?.badge || 'Giới Thiệu';
  const title = about?.title || 'Tạo ra những trải nghiệm kỹ thuật số khiến người dùng';
  const highlightText = about?.highlightText || 'nhìn lại lần thứ hai.';
  const paragraphs = about?.paragraphs || [
    'Tôi thiết kế các giao diện web cân bằng giữa tác động thị giác và sự rõ ràng về chức năng. Mỗi theme trong portfolio này bắt đầu từ một brief thực tế — một ngành cụ thể, một vấn đề người dùng cụ thể — và được xây dựng theo tiêu chuẩn sản xuất.',
    'Cách tiếp cận của tôi: hiểu bối cảnh trước khi chạm vào canvas. Kết quả là những theme cảm thấy gắn liền với ngành của chúng thay vì là các template chung chung với lớp sơn mới.',
  ];
  const skills = about?.skills && about.skills.length > 0 ? about.skills : defaultSkills;
  const tools = about?.tools && about.tools.length > 0 ? about.tools : defaultTools;
  const studioImage = about?.studioImage || 'https://img.rocket.new/generatedImages/rocket_gen_img_137ddd9e4-1772074857584.png';
  const studioBadge = about?.studioBadge || 'Studio Thiết Kế';

  return (
    <section id="about" className="py-24 border-t border-slate-100 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-16 reveal">
          <span className="badge-pill bg-amber-50 text-amber-700 border border-amber-200">{badge}</span>
          <div className="h-px flex-1 bg-slate-100" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0">
          {/* Left — bio */}
          <div className="lg:col-span-5 lg:pr-16 flex flex-col justify-between">
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-light text-[#0D1B2A] tracking-tight leading-[1.08] mb-6 reveal reveal-delay-1">
                {title}{' '}
                <em className="gradient-text not-italic">{highlightText}</em>
              </h2>
              {paragraphs.map((p, idx) => (
                <p key={idx} className={`text-slate-500 text-base leading-relaxed mb-5 reveal reveal-delay-${Math.min(idx + 2, 5)}`}>
                  {p}
                </p>
              ))}
            </div>

            {/* Tools */}
            <div className="mt-10 reveal reveal-delay-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-4">Công Cụ & Stack</span>
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
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-semibold tracking-widest uppercase text-amber-700 shadow-sm">
                    {studioBadge}
                  </span>
                </div>
              </div>
            </div>

            {/* Skill bars */}
            <div className="space-y-4 reveal reveal-delay-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-5">Năng Lực Cốt Lõi</span>
              {skills.map((skill, i) => (
                <div key={skill.name} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-slate-700 tracking-wide">
                      {skill.name}
                    </span>
                    <span className="text-xs font-bold text-amber-600">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full relative overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-700"
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
