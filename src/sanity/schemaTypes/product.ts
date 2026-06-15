import {defineType, defineField} from 'sanity';

// Транслитерация укр→латиница для аккуратных адресов: «Перлинні дуги» → «perlynni-duhy».
const TRANSLIT: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'h', ґ: 'g', д: 'd', е: 'e', є: 'ie', ж: 'zh', з: 'z',
  и: 'y', і: 'i', ї: 'i', й: 'i', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p',
  р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh',
  щ: 'shch', ь: '', ю: 'iu', я: 'ia', "'": '', '’': ''
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .split('')
    .map((ch) => (ch in TRANSLIT ? TRANSLIT[ch] : ch))
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);
}

export const product = defineType({
  name: 'product',
  title: 'Виріб',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Назва', type: 'localeString', validation: (r) => r.required()}),
    defineField({name: 'slug', title: 'Slug (адреса)', type: 'slug', options: {source: 'title.uk', slugify}, validation: (r) => r.required()}),
    defineField({name: 'images', title: 'Фото', type: 'array', of: [{type: 'image', options: {hotspot: true}}], validation: (r) => r.required().min(1)}),
    defineField({name: 'video', title: 'Відео (URL, необов’язково)', type: 'url'}),
    defineField({name: 'category', title: 'Тип', type: 'string', options: {list: [
      {title: 'Каблучки', value: 'ring'},
      {title: 'Сережки', value: 'earrings'},
      {title: 'Кольє та підвіски', value: 'necklace'},
      {title: 'Браслети', value: 'bracelet'},
      {title: 'Ланцюжки', value: 'chain'},
      {title: 'Брошки', value: 'brooch'}
    ]}, validation: (r) => r.required()}),
    defineField({name: 'metal', title: 'Метал', type: 'string', options: {list: [
      {title: 'Біле золото', value: 'white'},
      {title: 'Жовте золото', value: 'yellow'},
      {title: 'Рожеве золото', value: 'rose'}
    ]}}),
    defineField({name: 'purity', title: 'Проба', type: 'string', options: {list: [
      {title: '585', value: '585'},
      {title: '750', value: '750'}
    ]}}),
    defineField({name: 'style', title: 'У стилі', type: 'string', options: {list: [
      {title: 'Класичні доми', value: 'classic'},
      {title: 'Сучасна класика', value: 'modern'},
      {title: 'Вінтаж', value: 'vintage'}
    ]}}),
    defineField({name: 'stones', title: 'Камені', type: 'array', of: [{type: 'string'}], options: {list: [
      {title: 'Природний діамант', value: 'natural'},
      {title: 'Лабораторний діамант', value: 'lab'}
    ]}}),
    defineField({name: 'description', title: 'Опис', type: 'localeText'}),
    defineField({name: 'details', title: 'Деталі (необов’язково)', type: 'localeText'}),
    defineField({name: 'featured', title: 'Показувати на головній', type: 'boolean', initialValue: false})
  ],
  preview: {
    select: {title: 'title.uk', media: 'images.0'},
    prepare({title, media}: {title?: string; media?: unknown}) {
      return {title: title || 'Без назви', media: media as never};
    }
  }
});
