'use client';

import React from 'react';
import { ContactContent, FooterContent, FooterLink } from '@/lib/content';
import ImageUploader from './ImageUploader';

interface ContactFooterEditorProps {
  contact: ContactContent;
  footer: FooterContent;
  onContactChange: (contact: ContactContent) => void;
  onFooterChange: (footer: FooterContent) => void;
}

export default function ContactFooterEditor({
  contact,
  footer,
  onContactChange,
  onFooterChange,
}: ContactFooterEditorProps) {
  const handleContactChange = (field: keyof ContactContent, value: any) => {
    onContactChange({
      ...contact,
      [field]: value,
    });
  };

  const handleFooterChange = (field: keyof FooterContent, value: any) => {
    onFooterChange({
      ...footer,
      [field]: value,
    });
  };

  const handleLinkChange = (index: number, field: keyof FooterLink, value: string) => {
    const updated = [...(footer.links || [])];
    updated[index] = { ...updated[index], [field]: value };
    handleFooterChange('links', updated);
  };

  const handleAddLink = () => {
    const newLink: FooterLink = { label: 'Liên Kết Mới', href: '#' };
    handleFooterChange('links', [...(footer.links || []), newLink]);
  };

  const handleRemoveLink = (index: number) => {
    handleFooterChange(
      'links',
      (footer.links || []).filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-6">
      {/* Contact Section Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-bold text-lg">
            📞
          </div>
          <div>
            <h2 className="text-base font-bold text-[#0D1B2A]">Phần Liên Hệ (Contact)</h2>
            <p className="text-xs text-slate-400">
              Thông tin liên hệ, email nhận phản hồi và trạng thái nhận dự án
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Huy hiệu phần (Badge)
            </label>
            <input
              type="text"
              value={contact.badge}
              onChange={(e) => handleContactChange('badge', e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email liên hệ hiển thị
            </label>
            <input
              type="email"
              value={contact.email}
              onChange={(e) => handleContactChange('email', e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800 font-medium text-amber-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tiêu đề chính
            </label>
            <input
              type="text"
              value={contact.title}
              onChange={(e) => handleContactChange('title', e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Từ in nghiêng đổi màu nổi bật
            </label>
            <input
              type="text"
              value={contact.highlightText}
              onChange={(e) => handleContactChange('highlightText', e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Trạng thái khả dụng (Status)
            </label>
            <input
              type="text"
              value={contact.status}
              onChange={(e) => handleContactChange('status', e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mô tả ngắn kêu gọi liên hệ
            </label>
            <textarea
              rows={2}
              value={contact.description}
              onChange={(e) => handleContactChange('description', e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Footer Section Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-lg">
            ⚓
          </div>
          <div>
            <h2 className="text-base font-bold text-[#0D1B2A]">Phần Chân Trang (Footer)</h2>
            <p className="text-xs text-slate-400">
              Logo, tên thương hiệu, khẩu hiệu, bản quyền và các liên kết dưới chân trang
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tên thương hiệu (Brand Name)
              </label>
              <input
                type="text"
                value={footer.brandName}
                onChange={(e) => handleFooterChange('brandName', e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Khẩu hiệu (Tagline)
              </label>
              <input
                type="text"
                value={footer.tagline}
                onChange={(e) => handleFooterChange('tagline', e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Dòng bản quyền (Copyright)
              </label>
              <input
                type="text"
                value={footer.copyright}
                onChange={(e) => handleFooterChange('copyright', e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-4">
            {/* Logo Uploader */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <ImageUploader
                label="Logo Chân Trang"
                aspectRatio="square"
                value={footer.logoUrl}
                onChange={(url) => handleFooterChange('logoUrl', url)}
                helperText="Upload file logo PNG/SVG vuông để hiển thị chân trang"
              />
            </div>

            {/* Links */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-700">Liên Kết Footer</label>
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="text-xs font-semibold text-amber-600 hover:text-amber-700"
                >
                  + Thêm liên kết
                </button>
              </div>

              <div className="space-y-2">
                {(footer.links || []).map((link, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Nhãn"
                      value={link.label}
                      onChange={(e) => handleLinkChange(index, 'label', e.target.value)}
                      className="w-1/2 text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-800"
                    />
                    <input
                      type="text"
                      placeholder="Liên kết (#... hoặc https://)"
                      value={link.href}
                      onChange={(e) => handleLinkChange(index, 'href', e.target.value)}
                      className="w-1/2 text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveLink(index)}
                      className="text-slate-400 hover:text-red-600 text-xs px-1.5 py-1 rounded"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
