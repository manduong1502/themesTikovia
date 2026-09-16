'use client';

import React, { useState, useRef } from 'react';
import { ThemeItem } from '@/lib/content';
import ImageUploader from './ImageUploader';

interface ThemeEditorProps {
  themes: ThemeItem[];
  onChange: (themes: ThemeItem[]) => void;
}

const ACCENT_COLORS = [
  { label: 'Xanh Dương', class: 'text-blue-500', bg: 'bg-blue-500' },
  { label: 'Hồng Đỏ', class: 'text-rose-500', bg: 'bg-rose-500' },
  { label: 'Xám Đậm', class: 'text-slate-500', bg: 'bg-slate-500' },
  { label: 'Vàng Đậm', class: 'text-yellow-600', bg: 'bg-yellow-600' },
  { label: 'Hổ Phách', class: 'text-amber-600', bg: 'bg-amber-600' },
  { label: 'Tím', class: 'text-violet-500', bg: 'bg-violet-500' },
  { label: 'Cam', class: 'text-orange-500', bg: 'bg-orange-500' },
  { label: 'Xanh Teal', class: 'text-teal-500', bg: 'bg-teal-500' },
  { label: 'Xanh Cyan', class: 'text-cyan-500', bg: 'bg-cyan-500' },
  { label: 'Ngọc Lục', class: 'text-emerald-500', bg: 'bg-emerald-500' },
  { label: 'Xanh Lá', class: 'text-green-500', bg: 'bg-green-500' },
  { label: 'Hồng Phấn', class: 'text-pink-500', bg: 'bg-pink-500' },
];

export default function ThemeEditor({ themes, onChange }: ThemeEditorProps) {
  const [selectedId, setSelectedId] = useState<number>(themes[0]?.id || 1);
  const [searchTerm, setSearchTerm] = useState('');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isAlbumUploading, setIsAlbumUploading] = useState(false);
  const albumFileRef = useRef<HTMLInputElement>(null);

  const selectedTheme = themes.find((t) => t.id === selectedId) || themes[0];

  const handleUpdateCurrent = (field: keyof ThemeItem, value: any) => {
    if (!selectedTheme) return;
    const updated = themes.map((t) => {
      if (t.id === selectedTheme.id) {
        return { ...t, [field]: value };
      }
      return t;
    });
    onChange(updated);
  };

  const handleAddNewTheme = () => {
    const nextId = themes.length > 0 ? Math.max(...themes.map((t) => t.id)) + 1 : 1;
    const newTheme: ThemeItem = {
      id: nextId,
      title: `Giao diện Mới #${nextId}`,
      category: 'SaaS / Bảng Điều Khiển',
      description: 'Mô tả chi tiết về giao diện mới chuẩn bị ra mắt, tối ưu SEO và responsive hoàn hảo.',
      tag: 'Mới Ra Mắt',
      year: new Date().getFullYear().toString(),
      image: '/assets/images/no_image.png',
      alt: 'Hình ảnh đại diện cho theme mới',
      demoUrl: '#',
      accentColor: 'text-amber-600',
    };
    const updated = [newTheme, ...themes];
    onChange(updated);
    setSelectedId(nextId);
  };

  const handleDeleteTheme = (id: number) => {
    if (themes.length <= 1) {
      alert('Phải giữ lại ít nhất một giao diện.');
      return;
    }
    if (confirm('Bạn có chắc chắn muốn xóa giao diện này không?')) {
      const updated = themes.filter((t) => t.id !== id);
      onChange(updated);
      if (selectedId === id) {
        setSelectedId(updated[0]?.id || 1);
      }
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= themes.length) return;
    const newThemes = [...themes];
    const temp = newThemes[index];
    newThemes[index] = newThemes[targetIndex];
    newThemes[targetIndex] = temp;
    onChange(newThemes);
  };

  const currentImages = selectedTheme
    ? selectedTheme.images && selectedTheme.images.length > 0
      ? selectedTheme.images
      : selectedTheme.image
      ? [selectedTheme.image]
      : []
    : [];

  const handleUpdateImages = (newImages: string[]) => {
    if (!selectedTheme) return;
    const updated = themes.map((t) => {
      if (t.id === selectedTheme.id) {
        return {
          ...t,
          images: newImages,
          image: newImages[0] || t.image || '',
        };
      }
      return t;
    });
    onChange(updated);
  };

  const handleAddImage = (url: string) => {
    if (!url) return;
    handleUpdateImages([...currentImages, url]);
  };

  const handleRemoveImage = (index: number) => {
    if (currentImages.length <= 1) {
      alert('Phải giữ lại ít nhất 1 hình ảnh cho sản phẩm.');
      return;
    }
    const filtered = currentImages.filter((_, i) => i !== index);
    handleUpdateImages(filtered);
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const target = currentImages[index];
    const rest = currentImages.filter((_, i) => i !== index);
    handleUpdateImages([target, ...rest]);
  };

  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentImages.length) return;
    const updated = [...currentImages];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    handleUpdateImages(updated);
  };

  const handleUploadAlbumFile = async (file: File) => {
    if (!file) return;
    setIsAlbumUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        handleAddImage(data.url);
      } else {
        alert(data.error || 'Tải ảnh thất bại');
      }
    } catch (e: any) {
      alert(e.message || 'Lỗi kết nối khi tải ảnh');
    } finally {
      setIsAlbumUploading(false);
    }
  };

  const filteredThemes = themes.filter(
    (t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-bold text-lg">
            🎨
          </div>
          <div>
            <h2 className="text-base font-bold text-[#0D1B2A]">Danh sách Theme Cards (Tỉ lệ 4:3)</h2>
            <p className="text-xs text-slate-400">
              Tổng cộng {themes.length} card đang hiển thị trên trang chủ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Tìm kiếm theme..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-xs px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-400 text-slate-800 w-full sm:w-48"
          />
          <button
            type="button"
            onClick={handleAddNewTheme}
            className="px-4 py-2 bg-[#0D1B2A] hover:bg-[#1b2a3a] text-white font-semibold text-xs rounded-xl shadow-sm transition-all duration-150 flex-shrink-0 flex items-center gap-1.5"
          >
            <span>+</span> Thêm Theme Mới
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Cards list */}
        <div className="lg:col-span-5 space-y-3 max-h-[720px] overflow-y-auto pr-1">
          {filteredThemes.map((theme, index) => {
            const isSelected = selectedTheme?.id === theme.id;
            const themeImgCount = (theme.images && theme.images.length > 0) ? theme.images.length : (theme.image ? 1 : 0);
            return (
              <div
                key={theme.id}
                onClick={() => setSelectedId(theme.id)}
                className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer flex items-center gap-3.5 ${
                  isSelected
                    ? 'border-amber-400 bg-amber-50/50 shadow-sm ring-1 ring-amber-300'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {/* 4:3 Thumbnail */}
                <div className="relative w-20 aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                  {theme.image ? (
                    <img
                      src={theme.image}
                      alt={theme.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                      Chưa có
                    </div>
                  )}
                  {themeImgCount > 1 && (
                    <span className="absolute bottom-1 right-1 px-1 py-0.2 bg-black/70 text-white rounded text-[9px] font-bold">
                      {themeImgCount} ảnh
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide truncate">
                      {theme.category}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {theme.year}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#0D1B2A] truncate">{theme.title}</h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{theme.tag}</p>
                </div>

                {/* Order buttons */}
                <div className="flex flex-col gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMove(index, 'up')}
                    className="w-5 h-5 flex items-center justify-center rounded bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30 text-[10px]"
                    title="Lên trên"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    disabled={index === themes.length - 1}
                    onClick={() => handleMove(index, 'down')}
                    className="w-5 h-5 flex items-center justify-center rounded bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30 text-[10px]"
                    title="Xuống dưới"
                  >
                    ▼
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right column: Edit details & Image Album Uploader */}
        <div className="lg:col-span-7">
          {selectedTheme ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                    Đang chỉnh sửa: ID #{selectedTheme.id}
                  </span>
                  <h3 className="text-lg font-bold text-[#0D1B2A]">{selectedTheme.title}</h3>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteTheme(selectedTheme.id)}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs rounded-xl border border-red-200 transition-colors"
                >
                  🗑 Xóa Card Này
                </button>
              </div>

              {/* Multi-Image Album Section with 4:3 Aspect Ratio */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                  <div>
                    <h4 className="text-xs font-bold text-[#0D1B2A] flex items-center gap-1.5">
                      <span>🖼</span> Album Hình Ảnh Theme (Chuẩn Tỉ Lệ 4:3)
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Đang có {currentImages.length} ảnh. Người dùng khi xem chi tiết sẽ có nút chuyển qua lại giữa các hình này.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 self-start sm:self-auto">
                    Ảnh đầu tiên là Ảnh Bìa
                  </span>
                </div>

                {/* List of current images */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {currentImages.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className={`group relative aspect-[4/3] rounded-xl overflow-hidden border-2 bg-slate-200 flex flex-col justify-between ${
                        idx === 0
                          ? 'border-amber-500 shadow-sm ring-1 ring-amber-300'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`Ảnh ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Cover badge */}
                      {idx === 0 ? (
                        <div className="absolute top-1.5 left-1.5 z-10">
                          <span className="px-2 py-0.5 bg-amber-500 text-slate-950 rounded text-[9px] font-bold shadow-sm">
                            ★ Ảnh Bìa
                          </span>
                        </div>
                      ) : (
                        <div className="absolute top-1.5 left-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => handleSetPrimary(idx)}
                            className="px-2 py-0.5 bg-black/70 hover:bg-amber-500 hover:text-black text-white rounded text-[9px] font-bold shadow-sm transition-colors"
                            title="Đặt ảnh này làm ảnh bìa card"
                          >
                            Đặt làm bìa
                          </button>
                        </div>
                      )}

                      {/* Actions overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveImage(idx, 'left')}
                            className="w-6 h-6 rounded bg-white/80 hover:bg-white text-black text-xs font-bold disabled:opacity-30 flex items-center justify-center"
                            title="Chuyển sang trái"
                          >
                            ◀
                          </button>
                          <button
                            type="button"
                            disabled={idx === currentImages.length - 1}
                            onClick={() => handleMoveImage(idx, 'right')}
                            className="w-6 h-6 rounded bg-white/80 hover:bg-white text-black text-xs font-bold disabled:opacity-30 flex items-center justify-center"
                            title="Chuyển sang phải"
                          >
                            ▶
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="w-6 h-6 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center"
                            title="Xóa ảnh này"
                          >
                            ✕
                          </button>
                        </div>
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimary(idx)}
                            className="text-[10px] text-amber-300 font-bold hover:underline"
                          >
                            Đặt làm ảnh chính
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Upload or Add new image to album */}
                <div className="pt-3 border-t border-slate-200/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-700">
                      + Tải Thêm Ảnh Mới Vào Album (Tỉ Lệ 4:3)
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Tự động lưu vào /public/uploads
                    </span>
                  </div>

                  {/* Upload file dropzone */}
                  <div
                    onClick={() => albumFileRef.current?.click()}
                    className="p-4 border-2 border-dashed border-slate-300 hover:border-amber-400 bg-white hover:bg-amber-50/30 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-3 text-center"
                  >
                    <div className="w-9 h-9 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-bold text-base flex-shrink-0">
                      ↑
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-700">
                        {isAlbumUploading ? 'Đang lưu ảnh vào /uploads...' : 'Bấm vào đây để chọn tệp ảnh từ máy tính'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Hỗ trợ JPG, PNG, WEBP, SVG (Ảnh sẽ hiển thị chuẩn tỉ lệ 4:3)
                      </p>
                    </div>
                  </div>

                  <input
                    ref={albumFileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleUploadAlbumFile(e.target.files[0]);
                      }
                    }}
                  />

                  {/* Direct URL input with Add button */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Hoặc dán link ảnh trực tiếp (/uploads/... hoặc https://...)"
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (customImageUrl.trim()) {
                            handleAddImage(customImageUrl.trim());
                            setCustomImageUrl('');
                          }
                        }
                      }}
                      className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-amber-400 text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customImageUrl.trim()) {
                          handleAddImage(customImageUrl.trim());
                          setCustomImageUrl('');
                        }
                      }}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-lg transition-colors flex-shrink-0"
                    >
                      + Thêm Ảnh
                    </button>
                  </div>
                </div>
              </div>

              {/* Form fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tiêu đề Theme
                  </label>
                  <input
                    type="text"
                    value={selectedTheme.title}
                    onChange={(e) => handleUpdateCurrent('title', e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Danh mục (Category)
                  </label>
                  <input
                    type="text"
                    value={selectedTheme.category}
                    onChange={(e) => handleUpdateCurrent('category', e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Thẻ Tag nổi bật (e.g. Chế Độ Tối, Sang Trọng)
                  </label>
                  <input
                    type="text"
                    value={selectedTheme.tag}
                    onChange={(e) => handleUpdateCurrent('tag', e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Năm phát hành
                  </label>
                  <input
                    type="text"
                    value={selectedTheme.year}
                    onChange={(e) => handleUpdateCurrent('year', e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200 text-slate-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mô tả ngắn
                  </label>
                  <textarea
                    rows={3}
                    value={selectedTheme.description}
                    onChange={(e) => handleUpdateCurrent('description', e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Liên kết Demo (URL)
                  </label>
                  <input
                    type="text"
                    value={selectedTheme.demoUrl}
                    onChange={(e) => handleUpdateCurrent('demoUrl', e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Văn bản thay thế ảnh (Alt Text)
                  </label>
                  <input
                    type="text"
                    value={selectedTheme.alt}
                    onChange={(e) => handleUpdateCurrent('alt', e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200 text-slate-800"
                  />
                </div>

                {/* Accent Color picker */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Màu điểm nhấn của thẻ Tag: <span className={selectedTheme.accentColor}>{selectedTheme.tag}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ACCENT_COLORS.map((col) => (
                      <button
                        key={col.class}
                        type="button"
                        onClick={() => handleUpdateCurrent('accentColor', col.class)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                          selectedTheme.accentColor === col.class
                            ? 'border-amber-500 bg-amber-50 text-slate-900 font-bold ring-1 ring-amber-400'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${col.bg}`} />
                        {col.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
              Vui lòng chọn một theme bên trái để chỉnh sửa.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
