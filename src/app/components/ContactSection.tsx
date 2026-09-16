'use client';

import React, { useState } from 'react';
import { ContactContent } from '@/lib/content';

interface Props {
  contact?: ContactContent;
}

export default function ContactSection({ contact }: Props) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const badge = contact?.badge || 'Liên Hệ';
  const title = contact?.title || 'Hãy cùng tạo ra';
  const highlightText = contact?.highlightText || 'điều gì đó tuyệt vời.';
  const description = contact?.description || 'Sẵn sàng cho các vị trí toàn thời gian, dự án freelance và hợp tác thiết kế. Phản hồi trong vòng 24 giờ.';
  const email = contact?.email || 'contact@tikovia.vn';
  const status = contact?.status || 'Sẵn sàng nhận cơ hội mới';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 border-t border-slate-100 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-16 reveal">
          <span className="badge-pill bg-amber-50 text-amber-700 border border-amber-200">{badge}</span>
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
              <p className="text-slate-500 text-base leading-relaxed max-w-sm mb-10">
                {description}
              </p>

              {/* Contact details */}
              <div className="space-y-5">
                <div className="saas-card p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-600 text-base">✉</span>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-0.5">Email</div>
                    <a href={`mailto:${email}`} className="text-sm font-medium text-[#0D1B2A] hover:text-amber-600 transition-colors">
                      {email}
                    </a>
                  </div>
                </div>
                <div className="saas-card p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse block" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-0.5">Tình Trạng</div>
                    <span className="text-sm font-medium text-[#0D1B2A]">{status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel — form */}
          <div className="reveal reveal-delay-2">
            {submitted ? (
              <div className="saas-card p-12 flex flex-col items-center justify-center gap-5 text-center h-full min-h-[360px]">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                  <span className="text-amber-600 text-2xl">✓</span>
                </div>
                <div>
                  <h3 className="font-display text-2xl text-[#0D1B2A] mb-2">Đã nhận tin nhắn.</h3>
                  <p className="text-slate-500 text-sm">Tôi sẽ liên hệ lại trong vòng 24 giờ.</p>
                </div>
              </div>
            ) : (
              <div className="saas-card p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest block mb-2">
                      Tên Của Bạn
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Họ tên hoặc tên công ty"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#0D1B2A] placeholder-slate-300 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest block mb-2">
                      Địa Chỉ Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="email@cuaban.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#0D1B2A] placeholder-slate-300 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest block mb-2">
                      Tin Nhắn
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Hãy cho tôi biết về dự án hoặc cơ hội của bạn..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#0D1B2A] placeholder-slate-300 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#0D1B2A] text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-[#1a2e42] transition-colors duration-200 shadow-sm hover:shadow-md"
                  >
                    Gửi Tin Nhắn →
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
