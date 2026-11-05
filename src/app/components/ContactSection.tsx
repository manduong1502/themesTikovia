'use client';

import React, { useState, useEffect } from 'react';
import { ContactContent } from '@/lib/content';

interface Props {
  contact?: ContactContent;
}

export default function ContactSection({ contact }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    themeInterest: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const badge = contact?.badge || 'Liên Hệ Tư Vấn';
  const title = contact?.title || 'Bắt đầu xây dựng';
  const highlightText = contact?.highlightText || 'website chuyên nghiệp.';
  const description =
    contact?.description && !contact.description.includes('toàn thời gian')
      ? contact.description
      : 'Đội ngũ Tikovia sẵn sàng tư vấn giải pháp giao diện, tính năng và tối ưu SEO phù hợp nhất với ngân sách doanh nghiệp của bạn. Phản hồi nhanh trong 30 phút.';
  const email = contact?.email || 'contact@tikovia.vn';
  const phone = contact?.phone || '';
  const zalo = contact?.zalo || phone;
  const status =
    contact?.status && !contact.status.includes('cơ hội mới')
      ? contact.status
      : 'Sẵn sàng tiếp nhận & triển khai dự án mới';

  // Listen for theme selection from ThemeGalleryClient modal
  useEffect(() => {
    const handleSelectTheme = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setSubmitted(false);
        setFormData((prev) => ({
          ...prev,
          themeInterest: customEvent.detail,
        }));
      }
    };
    window.addEventListener('tikovia:select-theme', handleSelectTheme);
    return () => window.removeEventListener('tikovia:select-theme', handleSelectTheme);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
        setFormData({ name: '', phone: '', email: '', themeInterest: '', message: '' });
      } else {
        setErrorMsg(data.error || 'Vui lòng kiểm tra lại thông tin.');
      }
    } catch {
      setErrorMsg('Không thể kết nối máy chủ. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const cleanZalo = zalo ? zalo.replace(/[^0-9]/g, '') : '';
  const cleanPhone = phone ? phone.replace(/[^0-9+]/g, '') : '';

  return (
    <>
      <section id="contact" className="py-24 border-t border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Section label */}
          <div className="flex items-center gap-4 mb-16 reveal">
            <span className="badge-pill bg-amber-50 text-amber-700 border border-amber-200">
              {badge}
            </span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left panel */}
            <div className="flex flex-col justify-between reveal">
              <div>
                <h2 className="font-display text-4xl md:text-5xl font-light text-[#0D1B2A] tracking-tight leading-[1.08] mb-6">
                  {title}{' '}
                  <em className="gradient-text not-italic">{highlightText}</em>
                </h2>
                <p className="text-slate-500 text-base leading-relaxed max-w-md mb-10">
                  {description}
                </p>

                {/* Contact details */}
                <div className="space-y-4">
                  {phone && (
                    <div className="saas-card p-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-emerald-600 text-base">📞</span>
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-0.5">
                            Hotline / Zalo Tư Vấn
                          </div>
                          <a
                            href={`tel:${cleanPhone}`}
                            className="text-sm font-bold text-[#0D1B2A] hover:text-emerald-600 transition-colors"
                          >
                            {phone}
                          </a>
                        </div>
                      </div>
                      {cleanZalo && (
                        <a
                          href={`https://zalo.me/${cleanZalo}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm"
                        >
                          Chat Zalo ↗
                        </a>
                      )}
                    </div>
                  )}

                  <div className="saas-card p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-amber-600 text-base">✉</span>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-0.5">
                        Email Doanh Nghiệp
                      </div>
                      <a
                        href={`mailto:${email}`}
                        className="text-sm font-medium text-[#0D1B2A] hover:text-amber-600 transition-colors"
                      >
                        {email}
                      </a>
                    </div>
                  </div>

                  <div className="saas-card p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse block" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-0.5">
                        Trạng Thái Hỗ Trợ
                      </div>
                      <span className="text-sm font-medium text-[#0D1B2A]">{status}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right panel — form */}
            <div className="reveal reveal-delay-2">
              {submitted ? (
                <div className="saas-card p-10 flex flex-col items-center justify-center gap-5 text-center h-full min-h-[380px]">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                    <span className="text-emerald-600 text-2xl font-bold">✓</span>
                  </div>
                  <div className="space-y-2 max-w-sm">
                    <h3 className="font-display text-2xl text-[#0D1B2A]">
                      Đã nhận yêu cầu tư vấn!
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Thông tin của bạn đã được chuyển đến đội ngũ <strong>Tikovia</strong>. Chúng tôi sẽ liên hệ lại qua SĐT/Zalo của bạn trong thời gian sớm nhất.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                  >
                    Gửi thêm yêu cầu khác
                  </button>
                </div>
              ) : (
                <div className="saas-card p-8">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {formData.themeInterest && (
                      <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900">
                        <span className="truncate">
                          🎨 Mẫu / Dự án quan tâm: <strong>{formData.themeInterest}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, themeInterest: '' })}
                          className="text-amber-700 hover:text-amber-950 font-bold px-1"
                          title="Bỏ chọn mẫu"
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-2">
                          Họ Tên / Đơn Vị <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Nguyễn Văn A / Công ty..."
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#0D1B2A] placeholder-slate-400 focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all text-sm"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-2">
                          Số Điện Thoại / Zalo <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="0909 xxx xxx"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#0D1B2A] placeholder-slate-400 focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-2">
                        Email (Tùy chọn)
                      </label>
                      <input
                        type="email"
                        placeholder="email@congty.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#0D1B2A] placeholder-slate-400 focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-2">
                        Nhu Cầu Thiết Kế / Ghi Chú
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Mô tả ngành nghề, mẫu giao diện bạn thích hoặc tính năng cần tư vấn..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#0D1B2A] placeholder-slate-400 focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all text-sm resize-none"
                      />
                    </div>

                    {errorMsg && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
                        ⚠️ {errorMsg}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[#0D1B2A] text-white py-3.5 rounded-xl text-sm font-bold hover:bg-[#1a2e42] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60"
                    >
                      {submitting ? 'Đang gửi yêu cầu...' : 'Nhận Tư Vấn & Báo Giá Ngay →'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Floating Quick Action Buttons (Bottom Right) */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
        {cleanZalo && (
          <a
            href={`https://zalo.me/${cleanZalo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <span>💬</span>
            <span>Chat Zalo</span>
          </a>
        )}
        {cleanPhone ? (
          <a
            href={`tel:${cleanPhone}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <span>📞</span>
            <span>Gọi Ngay</span>
          </a>
        ) : (
          <a
            href="#contact"
            className="flex items-center gap-2 px-4 py-3 rounded-full bg-[#0D1B2A] hover:bg-slate-800 text-amber-400 border border-amber-400/30 text-xs font-bold shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <span>💬</span>
            <span>Tư Vấn Nhanh</span>
          </a>
        )}
      </div>
    </>
  );
}
