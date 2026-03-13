import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AdminSidebar } from '@/components/admin-sidebar';
import './globals.css';

const headingFont = Geist({
  variable: '--font-heading',
  subsets: ['latin'],
});

const monoFont = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'LuxStay Admin',
  description: 'Admin panel for services and bookings.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${headingFont.variable} ${monoFont.variable}`}
        suppressHydrationWarning
      >
        <div className="admin-root">
          <AdminSidebar />
          <div className="admin-content">{children}</div>
        </div>
      </body>
    </html>
  );
}
