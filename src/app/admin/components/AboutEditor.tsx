'use client';

import React, { useState } from 'react';
import { AboutContent, SkillItem } from '@/lib/content';
import ImageUploader from './ImageUploader';

interface AboutEditorProps {
  about: AboutContent;
  onChange: (about: AboutContent) => void;
}

export default function AboutEditor({ about, onChange }: AboutEditorProps) {
  const [newTool, setNewTool] = useState('');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState(85);

  const handleChange = (field: keyof AboutContent, value: any) => {
    onChange({
      ...about,
      [field]: value,
    });
  };

  const handleParagraphChange = (index: number, text: string) => {
    const updated = [...(about.paragraphs || [])];
    updated[index] = text;
    handleChange('paragraphs', updated);
  };

  const handleAddParagraph = () => {
    handleChange('paragraphs', [...(about.paragraphs || []), 'Nội dung đoạn văn mới...']);
  };

  const handleRemoveParagraph = (index: number) => {
    handleChange(
      'paragraphs',
      (about.paragraphs || []).filter((_, i) => i !== index)
    );
  };

  const handleSkillChange = (index: number, field: keyof SkillItem, value: any) => {
    const updated = [...(about.skills || [])];
    updated[index] = { ...updated[index], [field]: value };
    handleChange('skills', updated);
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    handleChange('skills', [
      ...(about.skills || []),
      { name: newSkillName.trim(), level: Number(newSkillLevel) },
    ]);
    setNewSkillName('');
    setNewSkillLevel(85);
  };

  const handleRemoveSkill = (index: number) => {
    handleChange(
      'skills',
      (about.skills || []).filter((_, i) => i !== index)
    );
  };

  const handleAddTool = () => {
    if (!newTool.trim()) return;
    if (!(about.tools || []).includes(newTool.trim())) {
      handleChange('tools', [...(about.tools || []), newTool.trim()]);
    }
    setNewTool('');
  };

  const handleRemoveTool = (tool: string) => {
    handleChange(
      'tools',
      (about.tools || []).filter((t) => t !== tool)
    );
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-bold text-lg">
          👤
        </div>
        <div>
          <h2 className="text-base font-bold text-[#0D1B2A]">Phần Giới Thiệu & Kỹ Năng (About)</h2>
          <p className="text-xs text-slate-400">
            Chỉnh sửa tiểu sử, ảnh studio thiết kế, danh sách kỹ năng chuyên môn và các công cụ sử dụng
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Bio info */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Huy hiệu phần (Badge)
              </label>
              <input
                type="text"
                value={about.badge}
                onChange={(e) => handleChange('badge', e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Huy hiệu trên ảnh Studio
              </label>
              <input
                type="text"
                value={about.studioBadge}
                onChange={(e) => handleChange('studioBadge', e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tiêu đề chính
            </label>
            <input
              type="text"
              value={about.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Từ in nghiêng đổi màu nổi bật
            </label>
            <input
              type="text"
              value={about.highlightText}
              onChange={(e) => handleChange('highlightText', e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800"
            />
          </div>

          {/* Paragraphs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700">Các đoạn văn mô tả</label>
              <button
                type="button"
                onClick={handleAddParagraph}
                className="text-xs font-semibold text-amber-600 hover:text-amber-700"
              >
                + Thêm đoạn văn
              </button>
            </div>
            {(about.paragraphs || []).map((para, i) => (
              <div key={i} className="relative group">
                <textarea
                  rows={3}
                  value={para}
                  onChange={(e) => handleParagraphChange(i, e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveParagraph(i)}
                  className="absolute top-2 right-2 text-slate-400 hover:text-red-600 text-xs px-1.5 py-0.5 rounded bg-white shadow-sm"
                  title="Xóa đoạn này"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Tools */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Công cụ & Công nghệ</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {(about.tools || []).map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-700 flex items-center gap-1.5"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTool(t)}
                    className="text-slate-400 hover:text-red-600 text-xs font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Thêm công cụ (ví dụ: React, Figma...)"
                value={newTool}
                onChange={(e) => setNewTool(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTool();
                  }
                }}
                className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-800 flex-1"
              />
              <button
                type="button"
                onClick={handleAddTool}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-lg"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>

        {/* Right: Studio image & Skill bars */}
        <div className="space-y-6">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <ImageUploader
              label="Ảnh Không Gian Làm Việc Studio"
              aspectRatio="16/7"
              value={about.studioImage}
              onChange={(url) => handleChange('studioImage', url)}
              helperText="Tải ảnh lên folder /uploads để hiển thị trong mục giới thiệu studio bên phải."
            />
          </div>

          {/* Skills */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700">
                Năng Lực Cốt Lõi & Tỷ Lệ (%)
              </label>
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {(about.skills || []).map((skill, index) => (
                <div
                  key={index}
                  className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3"
                >
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                    className="flex-1 text-xs px-2.5 py-1 border border-slate-200 rounded-lg bg-white text-slate-800 font-medium"
                  />
                  <div className="flex items-center gap-1 w-20">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={skill.level}
                      onChange={(e) => handleSkillChange(index, 'level', Number(e.target.value))}
                      className="w-14 text-xs px-2 py-1 border border-slate-200 rounded-lg bg-white text-slate-800 text-center font-bold"
                    />
                    <span className="text-xs text-slate-400 font-bold">%</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(index)}
                    className="text-slate-400 hover:text-red-600 text-xs px-1.5 py-1 rounded hover:bg-red-50"
                    title="Xóa kỹ năng này"
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>

            {/* Add skill row */}
            <div className="flex items-center gap-2 p-2 bg-amber-50/60 rounded-xl border border-amber-200/80">
              <input
                type="text"
                placeholder="Tên kỹ năng mới..."
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="flex-1 text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-800"
              />
              <input
                type="number"
                min={0}
                max={100}
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(Number(e.target.value))}
                className="w-16 text-xs px-2 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-800 text-center"
              />
              <span className="text-xs text-slate-500 font-bold">%</span>
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shadow-sm"
              >
                + Thêm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
