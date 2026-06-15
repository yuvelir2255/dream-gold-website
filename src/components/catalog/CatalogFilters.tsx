'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
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

// Кнопка выбора фильтра
function FilterButton({
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
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full border text-sm font-body transition-colors duration-200 ${
        active
          ? 'bg-gold border-gold text-cream'
          : 'border-line text-muted hover:border-gold hover:text-charcoal'
      }`}
    >
      {children}
    </button>
  );
}

// Группа фильтров (одна строка с кнопками)
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
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-body uppercase tracking-widest text-muted mr-1 min-w-[4rem]">
        {label}
      </span>
      {options.map((opt) => (
        <FilterButton
          key={opt.value}
          active={selected === opt.value}
          onClick={() => onSelect(selected === opt.value ? 'all' : opt.value)}
        >
          {opt.label}
        </FilterButton>
      ))}
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

  // Найти метку категории для карточки
  const getCategoryLabel = (cat?: string): string => {
    if (!cat) return '';
    const found = categoryOptions.find((o) => o.value === cat);
    return found?.label ?? '';
  };

  return (
    <div>
      {/* Панель фильтров */}
      <div className="mb-10 space-y-3 rounded-sm border border-line bg-cream p-5">
        <FilterGroup
          label={t('filters.category')}
          options={categoryOptions}
          selected={category}
          onSelect={setCategory}
        />
        <FilterGroup
          label={t('filters.metal')}
          options={metalOptions}
          selected={metal}
          onSelect={setMetal}
        />
        <FilterGroup
          label={t('filters.purity')}
          options={purityOptions}
          selected={purity}
          onSelect={setPurity}
        />
        <FilterGroup
          label={t('filters.style')}
          options={styleOptions}
          selected={style}
          onSelect={setStyle}
        />
      </div>

      {/* Сетка карточек */}
      {filtered.length === 0 ? (
        <p className="py-16 text-center font-body text-muted">{t('empty')}</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              locale={locale}
              categoryLabel={getCategoryLabel(product.category)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
