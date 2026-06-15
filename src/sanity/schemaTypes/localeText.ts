import {defineType, defineField} from 'sanity';

export const localeText = defineType({
  name: 'localeText',
  title: 'Текст багаторядковий (укр/англ)',
  type: 'object',
  fields: [
    defineField({name: 'uk', title: 'Українська', type: 'text'}),
    defineField({name: 'en', title: 'English', type: 'text'})
  ]
});
