export const COLORS = {
  primary: '#8B4513',
  primaryDark: '#6B3410',
  secondary: '#D2691E',
  bg: '#FFF8F0',
  card: '#FFFFFF',
  textPrimary: '#2C1810',
  textSecondary: '#8B7355',
  border: '#E8D5C4',
  success: '#228B22',
  warning: '#FF8C00',
  danger: '#C62828',
} as const;

export const FONTS = {
  display: "'Playfair Display', serif",
  sans: "'Inter', sans-serif",
} as const;

export const SPACING = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
} as const;

export const SHADOWS = {
  sm: '0 1px 2px 0 rgba(44, 24, 16, 0.05)',
  md: '0 4px 6px -1px rgba(44, 24, 16, 0.1), 0 2px 4px -1px rgba(44, 24, 16, 0.06)',
  lg: '0 10px 15px -3px rgba(44, 24, 16, 0.1), 0 4px 6px -2px rgba(44, 24, 16, 0.05)',
  xl: '0 20px 25px -5px rgba(44, 24, 16, 0.1), 0 10px 10px -5px rgba(44, 24, 16, 0.04)',
} as const;

export type ThemeColors = typeof COLORS;
export type ThemeFonts = typeof FONTS;
export type ThemeSpacing = typeof SPACING;
export type ThemeShadows = typeof SHADOWS;
