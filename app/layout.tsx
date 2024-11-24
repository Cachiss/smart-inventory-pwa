import './globals.css';

import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  title: 'Smart Inventory PWA',
  description:
    'Una aplicación de inventario para pequeñas y medianas empresas para gestionar sus productos y ventas.',
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen w-full flex-col">{children}</body>
      <Analytics />
    </html>
  );
}
