import {defineConfig} from 'sanity';
import {structureTool} from 'sanity/structure';
import {visionTool} from '@sanity/vision';
import {schemaTypes} from './src/sanity/schemaTypes';
import {projectId, dataset} from './src/sanity/env';

export default defineConfig({
  name: 'default',
  title: 'Dream Gold',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [structureTool(), visionTool()],
  schema: {types: schemaTypes}
});
