export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  MANAGER: 'MANAGER',
  CASHIER: 'CASHIER',
  KITCHEN_STAFF: 'KITCHEN_STAFF',
  BAR_STAFF: 'BAR_STAFF',
  WAITER: 'WAITER',
} as const;

export const ORDER_STATUS = {
  DRAFT: 'DRAFT',
  PLACED: 'PLACED',
  CONFIRMED: 'CONFIRMED',
  PREPARING: 'PREPARING',
  READY: 'READY',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export const PAYMENT_METHODS = {
  CASH: 'CASH',
  MOMO: 'MOMO',
  AIRTEL_MONEY: 'AIRTEL_MONEY',
} as const;

export const STATIONS = {
  KITCHEN: 'KITCHEN',
  BAR: 'BAR',
} as const;

export const TABLE_STATUSES = {
  AVAILABLE: 'AVAILABLE',
  OCCUPIED: 'OCCUPIED',
  RESERVED: 'RESERVED',
  BLOCKED: 'BLOCKED',
} as const;

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    VERIFY_OTP: '/auth/verify-otp',
    RESET_PASSWORD: '/auth/reset-password',
  },
  MENU: {
    CATEGORIES: '/menu/categories',
    ITEMS: '/menu/items',
  },
  TABLES: {
    BASE: '/tables',
    VALIDATE: '/qr/validate',
  },
  ORDERS: {
    BASE: '/orders',
    MY_ORDERS: '/orders/my',
    KITCHEN_QUEUE: '/orders/queue/kitchen',
    BAR_QUEUE: '/orders/queue/bar',
  },
  BILLS: {
    BASE: '/bills',
    PENDING: '/bills/pending',
  },
  PAYMENTS: {
    BASE: '/payments',
    SUMMARY: '/payments/summary',
  },
  NOTIFICATIONS: {
    BASE: '/notifications',
    UNREAD_COUNT: '/notifications/unread-count',
  },
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 10,
} as const;
