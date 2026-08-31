import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Казаки всего мира — Cossacks of the World',
  description: 'Международный цифровой центр казачества: история, люди, культура, музыка и память рода.',
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
