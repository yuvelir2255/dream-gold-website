'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import Reveal from '@/components/ui/Reveal';
import ProductCard, {type ProductCardData} from './ProductCard';
import {CATEGORIES, METALS, PURITIES, STYLES} from '@/lib/catalogOptions';

interface CatalogFiltersProps {
  products: ProductCardData[];
  locale: string;
}

// Тип одного варианта в группе фильтра
interface FilterOption {
  value: string;
  label: string;
}

// Пилюля выбора фильтра.
// Активная — сплошное золото; неактивная — хайрлайн-контур, золотится по ховеру.
function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`cursor-pointer rounded-full px-4 py-1.5 font-body text-[13px] tracking-wide transition-all duration-300 ${
        active
          ? 'bg-gold text-dark shadow-sm shadow-gold/30'
          : 'border border-line text-muted hover:border-gold/60 hover:text-charcoal'
      }`}
    >
      {children}
    </button>
  );
}

// Группа фильтров: золотая разрядка-лейбл + ряд пилюль.
function FilterGroup({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: FilterOption[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <span className="flex shrink-0 items-center gap-2 font-body text-[10px] uppercase tracking-[0.3em] text-gold sm:w-28">
        <span aria-hidden="true" className="h-px w-4 bg-gold/50" />
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <FilterPill
            key={opt.value}
            active={selected === opt.value}
            onClick={() => onSelect(selected === opt.value ? 'all' : opt.value)}
          >
            {opt.label}
          </FilterPill>
        ))}
      </div>
    </div>
  );
}

export default function CatalogFilters({products, locale}: CatalogFiltersProps) {
  const t = useTranslations('catalog');

  // Состояние активных фильтров
  const [category, setCategory] = useState('all');
  const [metal, setMetal] = useState('all');
  const [purity, setPurity] = useState('all');
  const [style, setStyle] = useState('all');

  // Опция «Усі / All»
  const allOption: FilterOption = {value: 'all', label: t('filters.all')};

  // Группы фильтров с переводами
  const categoryOptions: FilterOption[] = [
    allOption,
    ...CATEGORIES.map((c) => ({value: c, label: t(`options.category.${c}`)})),
  ];
  const metalOptions: FilterOption[] = [
    allOption,
    ...METALS.map((m) => ({value: m, label: t(`options.metal.${m}`)})),
  ];
  const purityOptions: FilterOption[] = [
    allOption,
    ...PURITIES.map((p) => ({value: p, label: t(`options.purity.${p}`)})),
  ];
  const styleOptions: FilterOption[] = [
    allOption,
    ...STYLES.map((s) => ({value: s, label: t(`options.style.${s}`)})),
  ];

  // Фильтрация: продукт проходит, если все активные фильтры совпадают
  const filtered = products.filter((p) => {
    const prod = p as ProductCardData & {metal?: string; purity?: string; style?: string};
    if (category !== 'all' && prod.category !== category) return false;
    if (metal !== 'all' && prod.metal !== metal) return false;
    if (purity !== 'all' && prod.purity !== purity) return false;
    if (style !== 'all' && prod.style !== style) return false;
    return true;
  });

  // Есть ли активный фильтр (для показа кнопки «Скинути»)
  const hasActiveFilter =
    category !== 'all' || metal !== 'all' || purity !== 'all' || style !== 'all';

  const resetAll = () => {
    setCategory('all');
    setMetal('all');
    setPurity('all');
    setStyle('all');
  };

  // Найти метку категории для карточки
  const getCategoryLabel = (cat?: string): string => {
    if (!cat) return '';
    const found = categoryOptions.find((o) => o.value === cat);
    return found?.label ?? '';
  };

  return (
    <div>
      {/* Панель фильтров: стеклянный эффект — полупрозрачный фон + backdrop-blur,
          тонкая золотая рамка, липкая под шапкой. */}
      <Reveal>
        <div className="sticky top-24 z-10 rounded-sm border border-line bg-cream/75 p-6 shadow-[0_10px_40px_-28px_rgba(31,27,22,0.4)] backdrop-blur-md sm:p-7">
          <div className="space-y-5">
            <FilterGroup
              label={t('filters.category')}
              options={categoryOptions}
              selected={category}
              onSelect={setCategory}
            />
            <div className="h-px w-full bg-line/70" />
            <FilterGroup
              label={t('filters.metal')}
              options={metalOptions}
              selected={metal}
              onSelect={setMetal}
            />
            <div className="h-px w-full bg-line/70" />
            <FilterGroup
              label={t('filters.purity')}
              options={purityOptions}
              selected={purity}
              onSelect={setPurity}
            />
            <div className="h-px w-full bg-line/70" />
            <FilterGroup
              label={t('filters.style')}
              options={styleOptions}
              selected={style}
              onSelect={setStyle}
            />
          </div>
        </div>
      </Reveal>

      {/* Строка результатов: счётчик слева + сброс справа */}
      <div className="mb-8 mt-8 flex items-center justify-between border-b border-line pb-4">
        <span className="font-body text-[11px] uppercase tracking-[0.28em] text-muted">
          {t('count', {count: filtered.length})}
        </span>
        {hasActiveFilter && (
          <button
            type="button"
            onClick={resetAll}
            className="group inline-flex cursor-pointer items-center gap-2 font-body text-[11px] uppercase tracking-[0.24em] text-muted transition-colors duration-300 hover:text-gold-deep"
          >
            <span
              aria-hidden="true"
              className="text-base leading-none text-gold transition-transform duration-300 group-hover:rotate-90"
            >
              +
            </span>
            {t('filters.reset')}
          </button>
        )}
      </div>

      {/* Сетка карточек */}
      {filtered.length === 0 ? (
        <p className="py-20 text-center font-body text-sm font-light leading-relaxed text-muted">
          {t('empty')}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {filtered.map((product, i) => (
            <Reveal key={product._id} delay={(i % 3) * 0.08}>
              <ProductCard
                product={product}
                locale={locale}
                categoryLabel={getCategoryLabel(product.category)}
              />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
