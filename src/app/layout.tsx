import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'GreenScope — Platform Pemantauan & Aksi Konservasi Pesisir dan Hutan Tropis',
  description: 'Inovasi WebGIS & Computer Vision AI untuk pemantauan degradasi lingkungan pesisir dan hutan tropis serta mobilisasi aksi restorasi terukur.',
  keywords: ['Konservasi', 'Mangrove', 'Pesisir', 'Bengkulu', 'Hutan Tropis', 'Gemini AI', 'WebGIS', 'GreenScope'],
  authors: [{ name: 'Sufyan Tsaury' }],
  icons: {
    icon: '/mascot-scopey.jpg',
    apple: '/mascot-scopey.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        {/* Leaflet CSS CDN for proper map tile rendering */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
        <Navbar />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
