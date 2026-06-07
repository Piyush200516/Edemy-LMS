// src/app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import ThemeProviderWrapper from '@/providers/ThemeProvider';
import QueryProviderWrapper from '@/providers/QueryProvider';
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'LMS Platform',
  description: 'Premium Learning Management System',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-background text-text min-h-screen">
        <ThemeProviderWrapper>
          <QueryProviderWrapper>{children}</QueryProviderWrapper>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
