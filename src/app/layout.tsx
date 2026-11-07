import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../styles/tailwind.css';

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
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
