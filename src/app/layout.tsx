import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Fraunces, Manrope } from 'next/font/google';
import '../styles/tailwind.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '900'],
  variable: '--font-fraunces',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://themes.tikovia.vn'),
  title: 'Kho Giao Diện Mẫu Tikovia — Thiết Kế Website Đa Ngành Chuẩn SEO',
  description:
    'Bộ sưu tập mẫu giao diện website & landing page cao cấp, chuẩn SEO, tối ưu trải nghiệm người dùng cho mọi ngành nghề được thiết kế và phát triển bởi Tikovia.',
  keywords: [
    'giao diện website',
    'kho theme website',
    'thiết kế web tikovia',
    'mẫu landing page đẹp',
    'theme web chuẩn seo',
    'tikovia themes',
    'tikovia.vn',
  ],
  authors: [{ name: 'Tikovia', url: 'https://tikovia.vn' }],
  creator: 'Tikovia',
  openGraph: {
    title: 'Kho Giao Diện Mẫu Tikovia — Thiết Kế Website Đa Ngành Chuẩn SEO',
    description:
      'Bộ sưu tập mẫu giao diện website & landing page cao cấp, chuẩn SEO, tối ưu trải nghiệm người dùng cho mọi ngành nghề được thiết kế và phát triển bởi Tikovia.',
    url: 'https://themes.tikovia.vn',
    siteName: 'Tikovia Themes',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/assets/images/cropped-tikovia_logo.png',
        width: 1200,
        height: 630,
        alt: 'Tikovia Themes — Kho Giao Diện Website',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kho Giao Diện Mẫu Tikovia — Thiết Kế Website Đa Ngành Chuẩn SEO',
    description:
      'Bộ sưu tập mẫu giao diện website & landing page cao cấp, chuẩn SEO, tối ưu trải nghiệm người dùng cho mọi ngành nghề được thiết kế và phát triển bởi Tikovia.',
    images: ['/assets/images/cropped-tikovia_logo.png'],
  },
  icons: {
    icon: [
      { url: '/assets/images/cropped-tikovia_logo.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/assets/images/cropped-tikovia_logo.png', type: 'image/png' },
    ],
    shortcut: ['/assets/images/cropped-tikovia_logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${fraunces.variable} ${manrope.variable}`} suppressHydrationWarning>
      <body className={manrope.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
