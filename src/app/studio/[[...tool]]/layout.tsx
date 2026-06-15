// Студия — нелокализованный маршрут, поэтому свой <html>/<body> здесь.
export default function StudioLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body style={{margin: 0}}>{children}</body>
    </html>
  );
}
