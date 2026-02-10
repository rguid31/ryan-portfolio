import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { getPersonalInfo } from '@/lib/masterReport';


export const metadata: Metadata = {
  title: 'Ryan Guidry | Technical Writer | Data Scientist | AI/ML Developer',
  description: 'Professional portfolio showcasing AI/ML projects, full-stack development, and technical writing expertise.',
  icons: {
    icon: '/favicon.ico',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const personal = getPersonalInfo();

  return (
    <html lang="en">
      <body className="font-sans">
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}