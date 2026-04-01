export const fontSize = {
  xs: '12px',
  sm: '14px',
  base: '16px',
  lg: '18px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '30px',
  '4xl': '36px',
  '5xl': '48px',
  '6xl': '60px',
} as const;

export const fontWeight = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;

export const typography = {
  h1: { fontSize: '60px' as const, fontWeight: 700 as const, lineHeight: 1.2 as const },
  h2: { fontSize: '48px' as const, fontWeight: 700 as const, lineHeight: 1.2 as const },
  h3: { fontSize: '36px' as const, fontWeight: 700 as const, lineHeight: 1.2 as const },
  h4: { fontSize: '30px' as const, fontWeight: 600 as const, lineHeight: 1.2 as const },
  h5: { fontSize: '24px' as const, fontWeight: 600 as const, lineHeight: 1.2 as const },
  h6: { fontSize: '20px' as const, fontWeight: 600 as const, lineHeight: 1.2 as const },
  body: { fontSize: '16px' as const, fontWeight: 400 as const, lineHeight: 1.5 as const },
  caption: { fontSize: '14px' as const, fontWeight: 400 as const, lineHeight: 1.5 as const },
} as const;

export type TypographyToken = typeof typography;
