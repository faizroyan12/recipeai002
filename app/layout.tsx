import './globals.css';

export const metadata = {
  title: 'AI Recipe Studio',
  description: 'Generator resep masakan berbasis AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}