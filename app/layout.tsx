import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WebCheck360 - Kostenloser Website-Check',
  description: 'Analysieren Sie Ihre Website in 60 Sekunden. Performance, SEO, Mobile UX und mehr.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
