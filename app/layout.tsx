import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { cn } from '@/lib/utils';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

// Primary Font
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});


export const metadata: Metadata = {
  title: 'Ryan Guidry | Technical Writer | Data Scientist | AI/ML Developer',
  description: 'Professional portfolio showcasing AI/ML projects, full-stack development, and technical writing expertise.',
  icons: {
    icon: '/favicon.ico',
    apple: '/logo.png', // Assuming existing logo for now
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.variable,
        GeistMono.variable
      )}>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}