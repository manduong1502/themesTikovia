import React from 'react';
import Image from 'next/image';
import { FooterContent } from '@/lib/content';

interface Props {
  footer?: FooterContent;
}

const defaultLinks = [
  { label: 'Themes', href: '#themes' },
  { label: 'Giới Thiệu', href: '#about' },
  { label: 'Liên Hệ', href: '#contact' },
];

export default function Footer({ footer }: Props) {
  const brandName = footer?.brandName || 'Tikovia';
  const tagline = footer?.tagline || 'Tinh tế trong từng pixel.';
  const logoUrl = footer?.logoUrl || '/assets/images/cropped-tikovia_logo.png';
  const copyright = footer?.copyright || '© 2026 Tikovia';
  const links = footer?.links && footer.links.length > 0 ? footer.links : defaultLinks;

  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left — logo + tagline */}
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 flex-shrink-0">
            <Image
              src={logoUrl}
              alt={`${brandName} logo`}
              fill
              className="object-contain"
            />
          </div>
          <div>
            <span className="text-sm font-bold text-[#0D1B2A] hidden sm:block">
              {brandName}
            </span>
            <span className="text-xs text-slate-400 hidden sm:block mt-0.5">
              {tagline}
            </span>
          </div>
        </div>

        {/* Right — links + copyright */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
          <div className="flex items-center gap-5">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-medium text-slate-500 hover:text-[#0D1B2A] transition-colors duration-150"
              >
                {link.label}
              </a>
            ))}
            <a href="#" className="text-xs font-medium text-slate-500 hover:text-[#0D1B2A] transition-colors duration-150">
              Quyền Riêng Tư
            </a>
            <a href="/admin" className="text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors duration-150 flex items-center gap-1">
              ⚙ Quản Trị
            </a>
          </div>
          <span className="text-xs text-slate-300">
            {copyright}
          </span>
        </div>
      </div>
    </footer>
  );
}
