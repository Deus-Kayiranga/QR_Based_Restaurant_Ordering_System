export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Validates Rwanda phone format (+2507...)
 */
export const validatePhone = (phone: string): boolean => {
  const re = /^\+2507[2389]\d{7}$/;
  return re.test(phone);
};

export const validateRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

export function validateRegisterStaff(data: any): string | null {
  if (!data.firstName?.trim()) return 'First name is required'
  if (!data.lastName?.trim()) return 'Last name is required'
  if (!validateEmail(data.email)) return 'Valid email is required'
  if (!validatePassword(data.password)) return 'Password must be at least 6 characters'
  return null
}
