export const CATEGORIES = ['ring','earrings','necklace','bracelet','chain','brooch'] as const;
export const METALS = ['white','yellow','rose'] as const;
export const PURITIES = ['585','750'] as const;
export const STYLES = ['classic','modern','vintage'] as const;
export type Category = typeof CATEGORIES[number];
export type Metal = typeof METALS[number];
export type Purity = typeof PURITIES[number];
export type Style = typeof STYLES[number];
