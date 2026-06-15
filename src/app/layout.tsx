// Корневой layout-«пропускатель».
// Тег <html>/<body> рендерится во вложенных layout'ах:
// [locale]/layout.tsx (локализованные страницы) и studio/[[...tool]]/layout.tsx (студия).
// Это официальный подход next-intl для смешивания локализованных и нелокализованных маршрутов.
export default function RootLayout({children}: {children: React.ReactNode}) {
  return children;
}
