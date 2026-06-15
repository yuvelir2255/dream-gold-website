import {defineType, defineField} from 'sanity';

export const product = defineType({
  name: 'product',
  title: 'Виріб',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Назва', type: 'localeString', validation: (r) => r.required()}),
    defineField({name: 'slug', title: 'Slug (адреса)', type: 'slug', options: {source: 'title.uk'}, validation: (r) => r.required()}),
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
