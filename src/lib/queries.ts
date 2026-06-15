import {groq} from 'next-sanity';

export const ALL_PRODUCTS = groq`*[_type == "product"]|order(_createdAt desc){
  _id, title, slug, images, category, metal, purity, style, featured
}`;

export const PRODUCT_BY_SLUG = groq`*[_type == "product" && slug.current == $slug][0]{
  _id, title, slug, images, video, category, metal, purity, style, stones, description, details
}`;

export const FEATURED_PRODUCTS = groq`*[_type == "product" && featured == true]|order(_createdAt desc)[0...3]{
  _id, title, slug, images, category
}`;
