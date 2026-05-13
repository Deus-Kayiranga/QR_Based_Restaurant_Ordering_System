/**
 * Utility for conditional Tailwind classes
 * Merges class names and removes falsy values
 */
export const cn = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};
