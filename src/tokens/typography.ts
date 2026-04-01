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

export const typography: {
  h1: { fontSize: string; fontWeight: number; lineHeight: number };
  h2: { fontSize: string; fontWeight: number; lineHeight: number };
  h3: { fontSize: string; fontWeight: number; lineHeight: number };
  h4: { fontSize: string; fontWeight: number; lineHeight: number };
  h5: { fontSize: string; fontWeight: number; lineHeight: number };
  h6: { fontSize: string; fontWeight: number; lineHeight: number };
  body: { fontSize: string; fontWeight: number; lineHeight: number };
  caption: { fontSize: string; fontWeight: number; lineHeight: number };
} = {
  h1: { fontSize: '60px', fontWeight: 700, lineHeight: 1.2 },
  h2: { fontSize: '48px', fontWeight: 700, lineHeight: 1.2 },
  h3: { fontSize: '36px', fontWeight: 700, lineHeight: 1.2 },
  h4: { fontSize: '30px', fontWeight: 600, lineHeight: 1.2 },
  h5: { fontSize: '24px', fontWeight: 600, lineHeight: 1.2 },
  h6: { fontSize: '20px', fontWeight: 600, lineHeight: 1.2 },
  body: { fontSize: '16px', fontWeight: 400, lineHeight: 1.5 },
  caption: { fontSize: '14px', fontWeight: 400, lineHeight: 1.5 },
};

export type TypographyToken = typeof typography;
