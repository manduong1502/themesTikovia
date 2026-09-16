'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  aspectRatio?: '4/3' | '16/9' | '16/7' | 'square' | 'auto';
  label?: string;
  helperText?: string;
}

export default function ImageUploader({
  value,
  onChange,
  aspectRatio = '4/3',
  label,
  helperText,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Vui lòng chọn tệp định dạng ảnh (JPG, PNG, WEBP, GIF, SVG).');
      return;
    }

    // Check size (< 15MB)
    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('Kích thước ảnh quá lớn. Vui lòng chọn tệp nhỏ hơn 15MB.');
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Tải ảnh lên thất bại');
      }

      onChange(data.url);
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi kết nối khi tải ảnh');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case '4/3':
        return 'aspect-[4/3]';
      case '16/9':
        return 'aspect-[16/9]';
      case '16/7':
        return 'aspect-[16/7]';
      case 'square':
        return 'aspect-square';
      default:
        return 'aspect-[4/3] min-h-[180px]';
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-slate-700">{label}</label>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] font-medium text-amber-600 hover:text-amber-700 transition-colors"
          >
            {showUrlInput ? 'Ẩn nhập link ảnh' : 'Hoặc nhập link trực tiếp'}
          </button>
        </div>
      )}

      {/* Direct URL input if toggled */}
      {showUrlInput && (
        <div className="mb-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Nhập đường dẫn ảnh (/uploads/... hoặc https://...)"
            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200 transition-all text-slate-800"
          />
        </div>
      )}

      {/* Image Preview or Upload Dropzone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative w-full ${getAspectClass()} rounded-xl overflow-hidden border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center ${
          isDragging
            ? 'border-amber-500 bg-amber-50/60 scale-[1.01]'
            : value
            ? 'border-slate-200 bg-slate-900 group'
            : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-amber-400'
        }`}
      >
        {value ? (
          <>
            <Image
              src={value}
              alt="Xem trước ảnh"
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Overlay controls */}
            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 p-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs shadow-md transition-transform active:scale-95 flex items-center gap-1.5"
              >
                <span>📷</span> Thay ảnh khác
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                className="px-3 py-1 bg-red-600/80 hover:bg-red-600 text-white font-medium rounded-lg text-[11px] backdrop-blur-sm transition-colors"
              >
                Xóa ảnh
              </button>
              <div className="text-[10px] text-white/80 max-w-[200px] truncate text-center bg-black/40 px-2 py-0.5 rounded mt-1">
                {value}
              </div>
            </div>

            {/* Ratio badge */}
            <div className="absolute top-2 left-2 z-10">
              <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md text-white rounded text-[10px] font-semibold tracking-wider uppercase">
                Tỉ lệ {aspectRatio}
              </span>
            </div>
          </>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer p-6 text-center flex flex-col items-center justify-center gap-2 w-full h-full"
          >
            <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 text-xl shadow-sm">
              ↑
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700">Kéo thả ảnh vào đây hoặc bấm để chọn tệp</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Tự động lưu vào thư mục /uploads (Tỉ lệ {aspectRatio})</p>
            </div>
          </div>
        )}

        {/* Uploading Spinner Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-white z-20 gap-2">
            <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-medium text-amber-300">Đang lưu vào folder /uploads...</span>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
          }
        }}
      />

      {/* Helper text or error */}
      {errorMessage ? (
        <p className="text-[11px] text-red-600 font-medium flex items-center gap-1">
          <span>⚠️</span> {errorMessage}
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
}
