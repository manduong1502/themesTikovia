'use client';

import React from 'react';
import { LeadItem } from '@/lib/leads';

interface LeadsManagerProps {
  leads: LeadItem[];
  onRefresh: () => void;
}

export default function LeadsManager({ leads, onRefresh }: LeadsManagerProps) {
  const handleToggleStatus = async (lead: LeadItem) => {
    const nextStatus = lead.status === 'new' ? 'contacted' : 'new';
    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: lead.id, status: nextStatus }),
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (e) {
      console.error('Lỗi cập nhật trạng thái:', e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa thông tin liên hệ này?')) return;
    try {
      const res = await fetch(`/api/leads?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (e) {
      console.error('Lỗi xóa liên hệ:', e);
    }
  };

  const newCount = leads.filter((l) => l.status === 'new').length;

  return (
    <div className="space-y-6">
      {/* Header Box */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-lg">
            📥
          </div>
          <div>
            <h2 className="text-base font-bold text-[#0D1B2A]">
              Danh Sách Khách Hàng Liên Hệ & Đặt Thiết Kế
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tổng cộng <strong>{leads.length}</strong> yêu cầu ({' '}
              <span className="text-amber-600 font-bold">{newCount} yêu cầu mới</span> chưa xử lý )
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors self-start sm:self-auto"
        >
          ↻ Làm mới danh sách
        </button>
      </div>

      {/* Leads List */}
      {leads.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-2">
          <div className="text-3xl">📭</div>
          <h3 className="text-sm font-bold text-[#0D1B2A]">Chưa có khách hàng nào gửi yêu cầu</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Khi khách hàng điền Form Liên Hệ hoặc bấm &ldquo;Yêu Cầu Tùy Biến Theme&rdquo; ngoài trang chủ, thông tin SĐT/Zalo và nhu cầu sẽ hiển thị ngay tại đây.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => {
            const isNew = lead.status === 'new';
            const cleanPhone = lead.phone.replace(/[^0-9+]/g, '');
            const dateStr = new Date(lead.createdAt).toLocaleString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={lead.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isNew
                    ? 'bg-white border-amber-300 shadow-sm ring-1 ring-amber-200/60'
                    : 'bg-slate-50/70 border-slate-200'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {isNew ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase tracking-wide">
                          ● Mới nhận
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          ✓ Đã liên hệ tư vấn
                        </span>
                      )}

                      <span className="text-sm font-bold text-[#0D1B2A]">{lead.name}</span>

                      <span className="text-xs text-slate-400">• {dateStr}</span>
                    </div>

                    {/* Phone / Zalo & Email */}
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <a
                        href={`tel:${cleanPhone}`}
                        className="inline-flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-lg transition-colors"
                      >
                        <span>📞</span> {lead.phone}
                      </a>

                      <a
                        href={`https://zalo.me/${cleanPhone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1 rounded-lg transition-colors"
                      >
                        <span>💬</span> Nhắn Zalo
                      </a>

                      {lead.email && (
                        <a
                          href={`mailto:${lead.email}`}
                          className="text-slate-600 hover:text-[#0D1B2A] underline"
                        >
                          ✉ {lead.email}
                        </a>
                      )}
                    </div>

                    {/* Interested Theme */}
                    {lead.themeInterest && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900">
                        <span>🎨</span> Quan tâm mẫu/dự án: <strong>{lead.themeInterest}</strong>
                      </div>
                    )}

                    {/* Message */}
                    <p className="text-xs text-slate-700 bg-slate-100/80 p-3 rounded-xl border border-slate-200/60 leading-relaxed whitespace-pre-line">
                      {lead.message}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col items-center md:items-end gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(lead)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                        isNew
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-sm'
                          : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {isNew ? '✓ Đánh dấu Đã Tư Vấn' : 'Đặt lại Chưa Xử Lý'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(lead.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
                    >
                      🗑 Xóa
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
