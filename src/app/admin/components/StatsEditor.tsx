'use client';

import React from 'react';
import { StatsContent, StatItem } from '@/lib/content';

interface StatsEditorProps {
  stats: StatsContent;
  onChange: (stats: StatsContent) => void;
}

export default function StatsEditor({ stats, onChange }: StatsEditorProps) {
  const handleChange = (field: keyof StatsContent, value: any) => {
    onChange({
      ...stats,
      [field]: value,
    });
  };

  const handleStatChange = (index: number, field: keyof StatItem, value: any) => {
    const updated = [...(stats.stats || [])];
    updated[index] = { ...updated[index], [field]: value };
    handleChange('stats', updated);
  };

  const handleAddStat = () => {
    const newStat: StatItem = {
      value: 10,
      suffix: '+',
      label: 'Chỉ Số Mới',
      description: 'Mô tả chi tiết chỉ số này',
    };
    handleChange('stats', [...(stats.stats || []), newStat]);
  };

  const handleRemoveStat = (index: number) => {
    handleChange(
      'stats',
      (stats.stats || []).filter((_, i) => i !== index)
    );
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-bold text-lg">
            📊
          </div>
          <div>
            <h2 className="text-base font-bold text-[#0D1B2A]">Phần Thống Kê (Stats)</h2>
            <p className="text-xs text-slate-400">
              Chỉnh sửa các con số ấn tượng, nhãn và mô tả ngắn
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddStat}
          className="px-3.5 py-2 bg-[#0D1B2A] hover:bg-[#1a2d40] text-white font-semibold text-xs rounded-xl shadow-sm transition-colors"
        >
          + Thêm Chỉ Số
        </button>
      </div>

      <div className="max-w-xs">
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Huy hiệu phần (Badge)
        </label>
        <input
          type="text"
          value={stats.badge}
          onChange={(e) => handleChange('badge', e.target.value)}
          className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800"
        />
      </div>

      {/* Grid of stats items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(stats.stats || []).map((item, index) => (
          <div
            key={index}
            className="p-5 rounded-2xl border border-slate-200 bg-slate-50 relative group space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Chỉ số #{index + 1}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveStat(index)}
                className="text-slate-400 hover:text-red-600 text-xs px-2 py-0.5 rounded bg-white shadow-sm transition-colors"
              >
                Xóa
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Giá trị số
                </label>
                <input
                  type="number"
                  value={item.value}
                  onChange={(e) => handleStatChange(index, 'value', Number(e.target.value))}
                  className="w-full text-sm font-bold px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-[#0D1B2A]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Ký tự sau số (+, %, năm...)
                </label>
                <input
                  type="text"
                  value={item.suffix}
                  onChange={(e) => handleStatChange(index, 'suffix', e.target.value)}
                  className="w-full text-sm font-bold px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-amber-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Nhãn tiêu đề
              </label>
              <input
                type="text"
                value={item.label}
                onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                className="w-full text-xs font-semibold px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-[#0D1B2A]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Mô tả ngắn
              </label>
              <input
                type="text"
                value={item.description}
                onChange={(e) => handleStatChange(index, 'description', e.target.value)}
                className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-600"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
