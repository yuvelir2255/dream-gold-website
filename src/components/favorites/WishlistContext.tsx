'use client';

import {createContext, useCallback, useContext, useEffect, useState} from 'react';

// Хранилище «Избранного» без бэкенда — список id изделий в localStorage браузера.
// Гидрация-безопасно: на сервере и при первом рендере клиента список пуст ([]),
// реальные данные читаем уже ПОСЛЕ монтирования (useEffect) — без mismatch.

const STORAGE_KEY = 'dg_wishlist';

interface WishlistValue {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  count: number;
  hydrated: boolean;
}

const WishlistCtx = createContext<WishlistValue | null>(null);

export function WishlistProvider({children}: {children: React.ReactNode}) {
  const [ids, setIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Читаем сохранённое только в браузере, после монтирования.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setIds(parsed.filter((x) => typeof x === 'string'));
        }
      }
    } catch {
      // битый JSON / нет доступа — просто стартуем с пустого
    }
    setHydrated(true);
  }, []);

  // Сохраняем при каждом изменении (после гидрации).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // приватный режим и т.п. — молча игнорируем
    }
  }, [ids, hydrated]);

  const toggle = useCallback((id: string) => {
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return (
    <WishlistCtx.Provider value={{ids, has, toggle, count: ids.length, hydrated}}>
      {children}
    </WishlistCtx.Provider>
  );
}

export function useWishlist(): WishlistValue {
  const ctx = useContext(WishlistCtx);
  if (!ctx) {
    // Безопасный фолбек, если провайдер не подключён
    return {ids: [], has: () => false, toggle: () => {}, count: 0, hydrated: false};
  }
  return ctx;
}
