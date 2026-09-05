import type { Metadata, Viewport } from 'next';
import './composition.css';

export const metadata: Metadata = {
  title: 'Казаки всего мира - Cossacks of the World',
  description: 'Международный цифровой центр казачества: история, люди, культура, музыка и память рода.',
  icons: { icon: '/favicon.png', shortcut: '/favicon.png', apple: '/favicon.png' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
