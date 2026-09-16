'use client';

import React, { useState, useEffect, useRef } from 'react';

interface MediaFile {
  name: string;
  url: string;
  size: number;
  updatedAt: string;
}

export default function MediaManager() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/upload');
      const data = await res.json();
      if (data.success && Array.isArray(data.files)) {
        setFiles(data.files);
      }
    } catch (err) {
      console.error('Không thể tải danh sách tệp media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleUpload = async (file: File) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        await fetchFiles();
      } else {
        alert(data.error || 'Tải ảnh thất bại');
      }
    } catch (e: any) {
      alert(e.message || 'Lỗi kết nối khi tải ảnh');
    } finally {
      setIsUploading(false);
    }
  };

  const filtered = files.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-bold text-lg">
            📁
          </div>
          <div>
            <h2 className="text-base font-bold text-[#0D1B2A]">Kho Ảnh Tải Lên (/public/uploads)</h2>
            <p className="text-xs text-slate-400">
              Toàn bộ ảnh bạn tải lên từ trang Admin sẽ được lưu an toàn tại thư mục này
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Tìm theo tên file..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-xs px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-800 w-full sm:w-48"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 flex-shrink-0"
          >
            {isUploading ? 'Đang tải...' : '↑ Tải Ảnh Mới'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleUpload(e.target.files[0]);
              }
            }}
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs">
          Đang quét thư mục /uploads...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl p-8">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl mx-auto mb-3">
            🖼
          </div>
          <p className="text-xs font-bold text-slate-700">Chưa có tệp ảnh nào trong thư mục /uploads</p>
          <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
            Khi bạn tải ảnh lên ở mục Themes, Hero hoặc Bấm "Tải Ảnh Mới", ảnh sẽ lập tức xuất hiện ở đây.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((file) => (
            <div
              key={file.name}
              className="group border border-slate-200 rounded-xl overflow-hidden bg-slate-50 hover:shadow-md transition-all flex flex-col"
            >
              {/* 4:3 Aspect Image Preview */}
              <div className="relative aspect-[4/3] w-full bg-slate-200 overflow-hidden">
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(file.url)}
                    className="px-3 py-1.5 bg-white text-slate-900 font-bold rounded-lg text-[11px] shadow-sm hover:bg-amber-400 transition-colors"
                  >
                    {copiedUrl === file.url ? '✓ Đã Copy' : 'Sao chép link'}
                  </button>
                </div>
              </div>

              {/* Meta */}
              <div className="p-2.5 flex-1 flex flex-col justify-between">
                <p className="text-[11px] font-bold text-slate-800 truncate" title={file.name}>
                  {file.name}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                  <span>{formatSize(file.size)}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(file.url)}
                    className="text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
