'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SiteContent } from '@/lib/content';
import { LeadItem } from '@/lib/leads';
import ThemeEditor from './components/ThemeEditor';
import HeroEditor from './components/HeroEditor';
import AboutEditor from './components/AboutEditor';
import StatsEditor from './components/StatsEditor';
import ContactFooterEditor from './components/ContactFooterEditor';
import MediaManager from './components/MediaManager';
import LeadsManager from './components/LeadsManager';

type TabKey = 'themes' | 'leads' | 'hero' | 'about' | 'stats' | 'contact' | 'media';

export default function AdminPage() {
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [content, setContent] = useState<SiteContent | null>(null);
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('themes');

  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch('/api/leads');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.leads)) {
          setLeads(json.leads);
        }
      }
    } catch (e) {
      console.error('Lỗi tải danh sách khách liên hệ:', e);
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [contentRes] = await Promise.all([fetch('/api/content'), fetchLeads()]);
      const json = await contentRes.json();
      if (json.success && json.data) {
        setContent(json.data);
      }
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu site-content:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchLeads]);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth');
        const data = await res.json();
        if (data.authenticated) {
          setAuthenticated(true);
          fetchAllData();
        } else {
          setLoading(false);
        }
      } catch {
        setLoading(false);
      } finally {
        setAuthChecked(true);
      }
    }
    checkAuth();
  }, [fetchAllData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAuthenticated(true);
        setPasswordInput('');
        fetchAllData();
      } else {
        setLoginError(data.error || 'Mật khẩu không đúng');
      }
    } catch {
      setLoginError('Không thể kết nối máy chủ');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    setAuthenticated(false);
  };

  const handleUpdate = (updatedPartial: Partial<SiteContent>) => {
    if (!content) return;
    setContent({
      ...content,
      ...updatedPartial,
    });
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!content) return;
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      const data = await res.json();

      if (res.status === 401) {
        setAuthenticated(false);
        throw new Error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
      }

      if (res.ok && data.success) {
        setHasChanges(false);
        setSaveMessage({ type: 'success', text: 'Đã lưu toàn bộ nội dung vào site-content.json thành công!' });
      } else {
        throw new Error(data.error || 'Lỗi khi lưu');
      }
    } catch (err: any) {
      setSaveMessage({ type: 'error', text: err.message || 'Không thể lưu nội dung' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(null), 4000);
    }
  };

  if (!authChecked || (authenticated && (loading || !content))) {
    return (
      <div className="min-h-screen bg-[#080c14] flex flex-col items-center justify-center text-white gap-4">
        <div className="w-12 h-12 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-300 font-medium">Đang tải cấu hình trang quản trị...</p>
      </div>
    );
  }

  // Login Gate
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center p-4 text-white">
        <div className="w-full max-w-md bg-[#0f1724] border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="relative w-12 h-12">
              <Image
                src="/assets/images/cropped-tikovia_logo.png"
                alt="Tikovia"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Đăng Nhập Quản Trị Tikovia</h1>
              <p className="text-xs text-slate-400 mt-1">
                Vui lòng nhập mật khẩu quản trị để chỉnh sửa nội dung & xem khách hàng liên hệ
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Mật khẩu Quản trị
              </label>
              <input
                type="password"
                required
                autoFocus
                placeholder="Nhập mật khẩu admin..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-[#080c14] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs font-semibold text-red-300">
                ⚠️ {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm shadow-lg transition-all"
            >
              {loggingIn ? 'Đang kiểm tra...' : 'Đăng Nhập Quản Trị →'}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-white/10">
            <Link href="/" className="text-xs text-slate-400 hover:text-amber-400 transition-colors">
              ← Quay về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!content) return null;

  const newLeadsCount = leads.filter((l) => l.status === 'new').length;

  const tabs: { key: TabKey; label: string; icon: string; badge?: string | number }[] = [
    { key: 'themes', label: 'Theme & Dự Án', icon: '🎨', badge: content.themes?.length },
    {
      key: 'leads',
      label: 'Khách Liên Hệ',
      icon: '📥',
      badge: newLeadsCount > 0 ? `${newLeadsCount} mới` : leads.length,
    },
    { key: 'hero', label: 'Hero Banner', icon: '⚡' },
    { key: 'about', label: 'Giới Thiệu & Kỹ Năng', icon: '👤' },
    { key: 'stats', label: 'Thống Kê', icon: '📊', badge: content.stats?.stats?.length },
    { key: 'contact', label: 'Liên Hệ & Footer', icon: '📞' },
    { key: 'media', label: 'Kho Ảnh Uploads', icon: '📁' },
  ];

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-slate-900 pb-24 font-sans">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#080c14] text-white border-b border-white/10 shadow-lg backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-8 h-8 flex-shrink-0">
                <Image
                  src="/assets/images/cropped-tikovia_logo.png"
                  alt="Tikovia"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-sm font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  Tikovia Admin
                </span>
                <span className="block text-[10px] text-amber-400/80 font-medium">
                  Quản lý nội dung, dự án & khách hàng
                </span>
              </div>
            </Link>

            {/* Changes indicator */}
            {hasChanges ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-semibold border border-amber-400/30">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Có thay đổi chưa lưu
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-medium border border-emerald-500/30">
                ✓ Đã đồng bộ JSON
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white border border-white/20 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-1.5"
            >
              <span>Xem Website</span>
              <span>↗</span>
            </Link>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 ${
                hasChanges
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 scale-105 shadow-amber-500/20'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              }`}
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <span>💾</span>
                  <span>Lưu Thay Đổi</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              title="Đăng xuất khỏi Admin"
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-red-300 hover:bg-white/5 border border-white/10 transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/5 overflow-x-auto">
          <nav className="flex space-x-2 py-2 min-w-max">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    isActive
                      ? 'bg-white/15 text-white shadow-sm ring-1 ring-white/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        tab.key === 'leads' && newLeadsCount > 0
                          ? 'bg-emerald-400 text-slate-950'
                          : isActive
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-white/10 text-slate-300'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Notification Toast */}
      {saveMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div
            className={`px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold border ${
              saveMessage.type === 'success'
                ? 'bg-[#0D1B2A] text-white border-amber-400/40 shadow-amber-950/20'
                : 'bg-red-950 text-white border-red-500'
            }`}
          >
            <span>{saveMessage.type === 'success' ? '🎉' : '⚠️'}</span>
            <span>{saveMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {activeTab === 'themes' && (
          <ThemeEditor
            themes={content.themes || []}
            onChange={(updatedThemes) => handleUpdate({ themes: updatedThemes })}
          />
        )}

        {activeTab === 'leads' && (
          <LeadsManager leads={leads} onRefresh={fetchLeads} />
        )}

        {activeTab === 'hero' && (
          <HeroEditor
            hero={content.hero}
            onChange={(updatedHero) => handleUpdate({ hero: updatedHero })}
          />
        )}

        {activeTab === 'about' && (
          <AboutEditor
            about={content.about}
            onChange={(updatedAbout) => handleUpdate({ about: updatedAbout })}
          />
        )}

        {activeTab === 'stats' && (
          <StatsEditor
            stats={content.stats}
            onChange={(updatedStats) => handleUpdate({ stats: updatedStats })}
          />
        )}

        {activeTab === 'contact' && (
          <ContactFooterEditor
            contact={content.contact}
            footer={content.footer}
            onContactChange={(updatedContact) => handleUpdate({ contact: updatedContact })}
            onFooterChange={(updatedFooter) => handleUpdate({ footer: updatedFooter })}
          />
        )}

        {activeTab === 'media' && <MediaManager />}
      </main>
    </div>
  );
}
