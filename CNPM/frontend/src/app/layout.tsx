import type { Metadata, Viewport } from 'next';
import { AppProviders } from '@/providers/AppProviders';
import './globals.css';

export const metadata: Metadata = {
  title: 'MediSafe Clone | Quản lý & Nhắc nhở Uống Thuốc Trí Tuệ',
  description: 'Ứng dụng nhắc nhở và theo dõi lịch uống thuốc cá nhân thông minh, bảo vệ sức khỏe gia đình bạn.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MediSafe',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0284c7',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full">
      <body className="h-full antialiased bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100 selection:bg-sky-500 selection:text-white">
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
