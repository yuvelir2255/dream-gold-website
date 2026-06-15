import {defineType, defineField} from 'sanity';

export const localeString = defineType({
  name: 'localeString',
  title: 'Текст (укр/англ)',
  type: 'object',
  fields: [
    defineField({name: 'uk', title: 'Українська', type: 'string'}),
    defineField({name: 'en', title: 'English', type: 'string'})
  ]
});
