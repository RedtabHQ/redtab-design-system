import type { Config } from 'tailwindcss';
import { colors } from './src/tokens/colors';
import { spacing } from './src/tokens/spacing';
import { fontSize, fontWeight, lineHeight } from './src/tokens/typography';
import { shadows } from './src/tokens/shadows';

export default {
  content: ['./src/**/*.{ts,tsx}', './.storybook/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors,
      spacing,
      fontSize,
      fontWeight,
      lineHeight,
      boxShadow: shadows,
    },
  },
  plugins: [],
} satisfies Config;
