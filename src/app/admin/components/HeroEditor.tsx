'use client';

import React, { useState } from 'react';
import { HeroContent } from '@/lib/content';
import ImageUploader from './ImageUploader';

interface HeroEditorProps {
  hero: HeroContent;
  onChange: (hero: HeroContent) => void;
}

export default function HeroEditor({ hero, onChange }: HeroEditorProps) {
  const [newTag, setNewTag] = useState('');

  const handleChange = (field: keyof HeroContent, value: any) => {
    onChange({
      ...hero,
      [field]: value,
    });
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    const currentTags = hero.trustedBy || [];
    if (!currentTags.includes(newTag.trim())) {
      handleChange('trustedBy', [...currentTags, newTag.trim()]);
    }
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleChange(
      'trustedBy',
      (hero.trustedBy || []).filter((t) => t !== tagToRemove)
    );
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-bold text-lg">
          ⚡
        </div>
        <div>
          <h2 className="text-base font-bold text-[#0D1B2A]">Phần Hero Banner (Đầu Trang)</h2>
          <p className="text-xs text-slate-400">
            Chỉnh sửa tiêu đề chính 3 dòng, ảnh nền cinematic, văn bản giới thiệu và các nút kêu gọi hành động
          </p>
        </div>
      </div>

      {/* Hero Background Image */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
        <ImageUploader
          label="Ảnh Nền Hero (Background)"
          aspectRatio="16/9"
          value={hero.bgImage || '/assets/images/hero_webdesign.jpg'}
          onChange={(url) => handleChange('bgImage', url)}
          helperText="Ảnh nền sẽ được tải vào folder /uploads và hiển thị với lớp phủ cinematic gradient làm nổi bật chữ phía trước."
        />
      </div>

      {/* Text inputs */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Huy hiệu đầu đề (Eyebrow Badge)
          </label>
          <input
            type="text"
            value={hero.eyebrow}
            onChange={(e) => handleChange('eyebrow', e.target.value)}
            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200 text-slate-800"
          />
        </div>

        {/* 3 Title lines */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Dòng Tiêu Đề 1 (Trắng)
            </label>
            <input
              type="text"
              value={hero.titleLine1}
              onChange={(e) => handleChange('titleLine1', e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-amber-400 text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Dòng Tiêu Đề 2 (Gradient Vàng)
            </label>
            <input
              type="text"
              value={hero.titleLine2}
              onChange={(e) => handleChange('titleLine2', e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-amber-400 text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Dòng Tiêu Đề 3 (Trắng mờ)
            </label>
            <input
              type="text"
              value={hero.titleLine3}
              onChange={(e) => handleChange('titleLine3', e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-amber-400 text-slate-800"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Đoạn văn mô tả Hero
          </label>
          <textarea
            rows={3}
            value={hero.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200 text-slate-800"
          />
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/60 space-y-2">
            <h4 className="text-xs font-bold text-amber-900">Nút Kêu Gọi Chính (CTA 1)</h4>
            <div>
              <label className="block text-[11px] text-slate-500 mb-0.5">Chữ hiển thị</label>
              <input
                type="text"
                value={hero.ctaPrimaryText}
                onChange={(e) => handleChange('ctaPrimaryText', e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 mb-0.5">Liên kết (Link)</label>
              <input
                type="text"
                value={hero.ctaPrimaryLink}
                onChange={(e) => handleChange('ctaPrimaryLink', e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-800"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-800">Nút Kêu Gọi Phụ (CTA 2)</h4>
            <div>
              <label className="block text-[11px] text-slate-500 mb-0.5">Chữ hiển thị</label>
              <input
                type="text"
                value={hero.ctaSecondaryText}
                onChange={(e) => handleChange('ctaSecondaryText', e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 mb-0.5">Liên kết (Link)</label>
              <input
                type="text"
                value={hero.ctaSecondaryLink}
                onChange={(e) => handleChange('ctaSecondaryLink', e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Trusted By / Highlights */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Danh sách "Themes nổi bật" hiển thị ở chân Hero
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {(hero.trustedBy || []).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 flex items-center gap-1.5"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-slate-400 hover:text-red-600 transition-colors text-sm font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 max-w-sm">
            <input
              type="text"
              placeholder="Thêm tên theme nổi bật..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              className="text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-amber-400 text-slate-800 flex-1"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-lg transition-colors"
            >
              Thêm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
