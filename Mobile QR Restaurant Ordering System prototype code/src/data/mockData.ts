// Mock Data for QR Restaurant Ordering System
// La Ta Bhore - Kigali, Rwanda

import { expandedMenuItems } from './expanded-menu';

export type UserRole = 'super_admin' | 'manager' | 'cashier' | 'kitchen_staff' | 'bar_staff' | 'waiter' | 'customer';

export type OrderStatus = 'draft' | 'placed' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type OrderItemStatus = 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
export type TableStatus = 'available' | 'occupied' | 'reserved' | 'blocked';
export type BillStatus = 'open' | 'ready' | 'paid';
export type PaymentMethod = 'cash' | 'momo' | 'airtel_money';
export type PaymentStatus = 'pending' | 'completed' | 'failed';
export type DestinationStation = 'kitchen' | 'bar';

export interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: UserRole;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
}

export interface RestaurantTable {
  table_id: number;
  table_number: string;
  qr_code_token: string;
  seating_capacity: number;
  section: string;
  status: TableStatus;
  is_active: boolean;
  position_x?: number;
  position_y?: number;
}

export interface MenuCategory {
  category_id: number;
  category_name: string;
  display_order: number;
  is_active: boolean;
  emoji?: string;
}

export interface MenuItem {
  item_id: number;
  category_id: number;
  item_name: string;
  description: string;
  price: number;
  image_url: string;
  destination_station: DestinationStation;
  is_available: boolean;
  is_vegetarian: boolean;
  contains_allergens: string;
  display_order: number;
  is_popular?: boolean;
  discount?: number | null;
}

export interface Order {
  order_id: number;
  table_id: number;
  customer_session: string;
  assigned_waiter_id: number | null;
  order_status: OrderStatus;
  special_instructions: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  placed_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface OrderItem {
  order_item_id: number;
  order_id: number;
  menu_item_id: number;
  quantity: number;
  unit_price: number;
  item_status: OrderItemStatus;
  special_notes: string;
  destination_station: DestinationStation;
  created_at: string;
}

export interface Bill {
  bill_id: number;
  order_id: number;
  bill_number: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  bill_status: BillStatus;
  generated_at: string;
  paid_at: string | null;
}

export interface Payment {
  payment_id: number;
  bill_id: number;
  payment_method: PaymentMethod;
  amount: number;
  phone_number: string | null;
  transaction_reference: string | null;
  payment_status: PaymentStatus;
  processed_by: number | null;
  payment_date: string;
  table_number?: string;
  order_id?: number;
}

export interface TableSession {
  session_id: number;
  table_id: number;
  session_token: string;
  customer_count: number;
  is_active: boolean;
  started_at: string;
  ended_at: string | null;
}

export interface Notification {
  notification_id: number;
  type: 'order_ready' | 'new_order' | 'payment_request' | 'call_waiter' | 'system';
  title: string;
  message: string;
  table_id?: number;
  order_id?: number;
  is_read: boolean;
  created_at: string;
  target_role: UserRole;
}

// MOCK USERS
export const mockUsers: User[] = [
  {
    user_id: 1,
    first_name: 'Emmanuel',
    last_name: 'Mugisha',
    email: 'emmanuel@latabhore.rw',
    phone_number: '+250788123456',
    role: 'super_admin',
    is_active: true,
    last_login_at: '2026-05-01T08:00:00',
    created_at: '2026-01-01T00:00:00'
  },
  {
    user_id: 2,
    first_name: 'Aline',
    last_name: 'Uwase',
    email: 'aline@latabhore.rw',
    phone_number: '+250788234567',
    role: 'manager',
    is_active: true,
    last_login_at: '2026-05-01T07:30:00',
    created_at: '2026-01-15T00:00:00'
  },
  {
    user_id: 3,
    first_name: 'Jean Paul',
    last_name: 'Nkurunziza',
    email: 'jeanpaul@latabhore.rw',
    phone_number: '+250788345678',
    role: 'waiter',
    is_active: true,
    last_login_at: '2026-05-01T06:00:00',
    created_at: '2026-02-01T00:00:00'
  },
  {
    user_id: 4,
    first_name: 'Clarisse',
    last_name: 'Imanishimwe',
    email: 'clarisse@latabhore.rw',
    phone_number: '+250788456789',
    role: 'kitchen_staff',
    is_active: true,
    last_login_at: '2026-05-01T05:30:00',
    created_at: '2026-02-10T00:00:00'
  },
  {
    user_id: 5,
    first_name: 'Patrick',
    last_name: 'Habimana',
    email: 'patrick@latabhore.rw',
    phone_number: '+250788567890',
    role: 'cashier',
    is_active: true,
    last_login_at: '2026-05-01T07:00:00',
    created_at: '2026-02-20T00:00:00'
  },
  {
    user_id: 6,
    first_name: 'Marie',
    last_name: 'Keza',
    email: 'marie@latabhore.rw',
    phone_number: '+250788678901',
    role: 'waiter',
    is_active: true,
    last_login_at: '2026-05-01T06:30:00',
    created_at: '2026-03-01T00:00:00'
  },
  {
    user_id: 7,
    first_name: 'David',
    last_name: 'Nsabimana',
    email: 'david@latabhore.rw',
    phone_number: '+250788789012',
    role: 'kitchen_staff',
    is_active: false,
    last_login_at: '2026-04-28T09:00:00',
    created_at: '2026-03-15T00:00:00'
  },
];

// MOCK RESTAURANT TABLES
export const mockTables: RestaurantTable[] = [
  { table_id: 1, table_number: 'T1', qr_code_token: 'x7K9mP2v', seating_capacity: 2, section: 'Window', status: 'available', is_active: true, position_x: 80, position_y: 80 },
  { table_id: 2, table_number: 'T2', qr_code_token: 'R8nQ4wL6', seating_capacity: 4, section: 'Window', status: 'occupied', is_active: true, position_x: 220, position_y: 80 },
  { table_id: 3, table_number: 'T3', qr_code_token: 'J5hF1kM3', seating_capacity: 4, section: 'Center', status: 'available', is_active: true, position_x: 360, position_y: 80 },
  { table_id: 4, table_number: 'T4', qr_code_token: 'B9vN7pX2', seating_capacity: 6, section: 'Center', status: 'occupied', is_active: true, position_x: 80, position_y: 220 },
  { table_id: 5, table_number: 'T5', qr_code_token: 'C4tL8qW1', seating_capacity: 2, section: 'Corner', status: 'occupied', is_active: true, position_x: 220, position_y: 220 },
  { table_id: 6, table_number: 'T6', qr_code_token: 'D6mE3rZ9', seating_capacity: 4, section: 'Terrace', status: 'available', is_active: true, position_x: 360, position_y: 220 },
  { table_id: 7, table_number: 'T7', qr_code_token: 'A1sY5nH7', seating_capacity: 8, section: 'Private', status: 'reserved', is_active: true, position_x: 80, position_y: 360 },
  { table_id: 8, table_number: 'T8', qr_code_token: 'G3wU6bK4', seating_capacity: 2, section: 'Terrace', status: 'blocked', is_active: false, position_x: 220, position_y: 360 },
];

// MOCK MENU CATEGORIES - Expanded with International Cuisine
export const mockCategories: MenuCategory[] = [
  { category_id: 1, category_name: 'Rwandan Specialties', display_order: 1, is_active: true, emoji: '🍛' },
  { category_id: 2, category_name: 'Burgers', display_order: 2, is_active: true, emoji: '🍔' },
  { category_id: 3, category_name: 'Grilled Meats', display_order: 3, is_active: true, emoji: '🥩' },
  { category_id: 4, category_name: 'Chicken Dishes', display_order: 4, is_active: true, emoji: '🍗' },
  { category_id: 5, category_name: 'Rice & Sides', display_order: 5, is_active: true, emoji: '🍚' },
  { category_id: 6, category_name: 'Salads & Vegetables', display_order: 6, is_active: true, emoji: '🥗' },
  { category_id: 7, category_name: 'Bralirwa Beers', display_order: 7, is_active: true, emoji: '🍺' },
  { category_id: 8, category_name: 'Soft Drinks', display_order: 8, is_active: true, emoji: '🥤' },
  { category_id: 9, category_name: 'Fresh Juices', display_order: 9, is_active: true, emoji: '🧃' },
  { category_id: 10, category_name: 'Breakfast', display_order: 10, is_active: true, emoji: '🌅' },
  { category_id: 11, category_name: 'Wines', display_order: 11, is_active: true, emoji: '🍷' },
  { category_id: 12, category_name: 'Chinese Cuisine', display_order: 12, is_active: true, emoji: '🥢' },
  { category_id: 13, category_name: 'Italian Cuisine', display_order: 13, is_active: true, emoji: '🍝' },
  { category_id: 14, category_name: 'Japanese Cuisine', display_order: 14, is_active: true, emoji: '🍣' },
  { category_id: 15, category_name: 'Seafood', display_order: 15, is_active: true, emoji: '🐟' },
  { category_id: 16, category_name: 'Premium Meats', display_order: 16, is_active: true, emoji: '🥓' },
  { category_id: 17, category_name: 'Healthy Options', display_order: 17, is_active: true, emoji: '🥬' },
];

// MOCK MENU ITEMS - Expanded International Menu (85+ items across 17 categories)
export const mockMenuItems: MenuItem[] = expandedMenuItems;

// MOCK ORDERS
export const mockOrders: Order[] = [
  {
    order_id: 55, table_id: 2, customer_session: 'SESSION-T2-001',
    assigned_waiter_id: 3, order_status: 'preparing',
    special_instructions: 'Extra napkins please',
    subtotal: 16300, tax_amount: 2934, total_amount: 19234,
    placed_at: '2026-05-01T08:30:00', completed_at: null, created_at: '2026-05-01T08:25:00'
  },
  {
    order_id: 56, table_id: 4, customer_session: 'SESSION-T4-002',
    assigned_waiter_id: 3, order_status: 'ready',
    special_instructions: '',
    subtotal: 37900, tax_amount: 6822, total_amount: 44722,
    placed_at: '2026-05-01T08:15:00', completed_at: null, created_at: '2026-05-01T08:10:00'
  },
  {
    order_id: 57, table_id: 5, customer_session: 'SESSION-T5-003',
    assigned_waiter_id: 3, order_status: 'placed',
    special_instructions: '',
    subtotal: 14000, tax_amount: 2520, total_amount: 16520,
    placed_at: '2026-05-01T08:45:00', completed_at: null, created_at: '2026-05-01T08:40:00'
  },
  {
    order_id: 52, table_id: 1, customer_session: 'SESSION-T1-004',
    assigned_waiter_id: 6, order_status: 'completed',
    special_instructions: '',
    subtotal: 18480, tax_amount: 3326, total_amount: 21806,
    placed_at: '2026-05-01T07:00:00', completed_at: '2026-05-01T07:45:00', created_at: '2026-05-01T06:55:00'
  },
  {
    order_id: 53, table_id: 3, customer_session: 'SESSION-T3-005',
    assigned_waiter_id: 6, order_status: 'completed',
    special_instructions: '',
    subtotal: 9500, tax_amount: 1710, total_amount: 11210,
    placed_at: '2026-05-01T07:15:00', completed_at: '2026-05-01T07:50:00', created_at: '2026-05-01T07:10:00'
  },
  {
    order_id: 54, table_id: 6, customer_session: 'SESSION-T6-006',
    assigned_waiter_id: 3, order_status: 'completed',
    special_instructions: 'Allergy: nuts',
    subtotal: 14000, tax_amount: 2520, total_amount: 16520,
    placed_at: '2026-05-01T07:30:00', completed_at: '2026-05-01T08:20:00', created_at: '2026-05-01T07:25:00'
  },
];

// MOCK ORDER ITEMS - Updated for Expanded Menu
export const mockOrderItems: OrderItem[] = [
  // Order 55 - Table T2 (Isombe, Primus x2, Cassava Chips)
  { order_item_id: 1, order_id: 55, menu_item_id: 1, quantity: 1, unit_price: 8500, item_status: 'preparing', special_notes: '', destination_station: 'kitchen', created_at: '2026-05-01T08:30:00' },
  { order_item_id: 2, order_id: 55, menu_item_id: 28, quantity: 2, unit_price: 2500, item_status: 'ready', special_notes: '', destination_station: 'bar', created_at: '2026-05-01T08:30:00' },
  { order_item_id: 3, order_id: 55, menu_item_id: 23, quantity: 1, unit_price: 2800, item_status: 'preparing', special_notes: '', destination_station: 'kitchen', created_at: '2026-05-01T08:30:00' },
  // Order 56 - Table T4 (Classic Burger x2, Mützig x3, Fried Chicken)
  { order_item_id: 4, order_id: 56, menu_item_id: 6, quantity: 2, unit_price: 9500, item_status: 'ready', special_notes: '', destination_station: 'kitchen', created_at: '2026-05-01T08:15:00' },
  { order_item_id: 5, order_id: 56, menu_item_id: 29, quantity: 3, unit_price: 2800, item_status: 'ready', special_notes: '', destination_station: 'bar', created_at: '2026-05-01T08:15:00' },
  { order_item_id: 6, order_id: 56, menu_item_id: 18, quantity: 1, unit_price: 10500, item_status: 'ready', special_notes: '', destination_station: 'kitchen', created_at: '2026-05-01T08:15:00' },
  // Order 57 - Table T5 (Rwandan Pilau x2, Coca-Cola, Fresh Passion Juice)
  { order_item_id: 7, order_id: 57, menu_item_id: 19, quantity: 2, unit_price: 4500, item_status: 'pending', special_notes: '', destination_station: 'kitchen', created_at: '2026-05-01T08:45:00' },
  { order_item_id: 8, order_id: 57, menu_item_id: 34, quantity: 1, unit_price: 1500, item_status: 'pending', special_notes: '', destination_station: 'bar', created_at: '2026-05-01T08:45:00' },
  { order_item_id: 9, order_id: 57, menu_item_id: 39, quantity: 1, unit_price: 3500, item_status: 'pending', special_notes: '', destination_station: 'bar', created_at: '2026-05-01T08:45:00' },
];

// MOCK BILLS
export const mockBills: Bill[] = [
  {
    bill_id: 1, order_id: 56, bill_number: 'BILL-20260501-056',
    subtotal: 37900, tax_amount: 6822, total_amount: 44722,
    bill_status: 'ready', generated_at: '2026-05-01T08:50:00', paid_at: null
  },
  {
    bill_id: 2, order_id: 52, bill_number: 'BILL-20260501-052',
    subtotal: 18480, tax_amount: 3326, total_amount: 21806,
    bill_status: 'paid', generated_at: '2026-05-01T07:40:00', paid_at: '2026-05-01T07:45:00'
  },
  {
    bill_id: 3, order_id: 53, bill_number: 'BILL-20260501-053',
    subtotal: 9500, tax_amount: 1710, total_amount: 11210,
    bill_status: 'paid', generated_at: '2026-05-01T07:45:00', paid_at: '2026-05-01T07:52:00'
  },
  {
    bill_id: 4, order_id: 54, bill_number: 'BILL-20260501-054',
    subtotal: 14000, tax_amount: 2520, total_amount: 16520,
    bill_status: 'paid', generated_at: '2026-05-01T08:15:00', paid_at: '2026-05-01T08:22:00'
  },
];

// MOCK PAYMENTS
export const mockPayments: Payment[] = [
  {
    payment_id: 1, bill_id: 2, payment_method: 'cash', amount: 21806,
    phone_number: null, transaction_reference: null, payment_status: 'completed',
    processed_by: 5, payment_date: '2026-05-01T07:45:00', table_number: 'T1', order_id: 52
  },
  {
    payment_id: 2, bill_id: 3, payment_method: 'momo', amount: 11210,
    phone_number: '+250788111222', transaction_reference: 'MTN-20260501-XK7', payment_status: 'completed',
    processed_by: 5, payment_date: '2026-05-01T07:52:00', table_number: 'T3', order_id: 53
  },
  {
    payment_id: 3, bill_id: 4, payment_method: 'airtel_money', amount: 16520,
    phone_number: '+250733333444', transaction_reference: 'ATL-20260501-ZW9', payment_status: 'completed',
    processed_by: 5, payment_date: '2026-05-01T08:22:00', table_number: 'T6', order_id: 54
  },
];

// MOCK TABLE SESSIONS
export const mockTableSessions: TableSession[] = [
  { session_id: 128, table_id: 2, session_token: 'cust_abc123xyz', customer_count: 3, is_active: true, started_at: '2026-05-01T08:20:00', ended_at: null },
  { session_id: 129, table_id: 4, session_token: 'cust_def456uvw', customer_count: 4, is_active: true, started_at: '2026-05-01T08:05:00', ended_at: null },
  { session_id: 130, table_id: 5, session_token: 'cust_ghi789rst', customer_count: 2, is_active: true, started_at: '2026-05-01T08:35:00', ended_at: null },
  { session_id: 125, table_id: 1, session_token: 'cust_jkl012mno', customer_count: 2, is_active: false, started_at: '2026-05-01T06:50:00', ended_at: '2026-05-01T07:50:00' },
];

// MOCK NOTIFICATIONS
export const mockNotifications: Notification[] = [
  { notification_id: 1, type: 'order_ready', title: 'Table T4 - Order Ready', message: '3 items ready for serving at Table T4', table_id: 4, order_id: 56, is_read: false, created_at: '2026-05-01T08:50:00', target_role: 'waiter' },
  { notification_id: 2, type: 'new_order', title: 'New Order - Table T5', message: 'Order #57 has been placed at Table T5', table_id: 5, order_id: 57, is_read: false, created_at: '2026-05-01T08:45:00', target_role: 'waiter' },
  { notification_id: 3, type: 'payment_request', title: 'Payment Request - Table T4', message: 'Customer at Table T4 requesting bill', table_id: 4, order_id: 56, is_read: false, created_at: '2026-05-01T08:48:00', target_role: 'cashier' },
  { notification_id: 4, type: 'call_waiter', title: 'Waiter Called - Table T2', message: 'Customer at Table T2 is calling for assistance', table_id: 2, is_read: true, created_at: '2026-05-01T08:32:00', target_role: 'waiter' },
  { notification_id: 5, type: 'system', title: 'Item Out of Stock', message: 'Spinach Feta Croissant marked as unavailable', is_read: false, created_at: '2026-05-01T08:00:00', target_role: 'manager' },
];

// HELPER FUNCTIONS
export const getUserById = (userId: number): User | undefined => {
  return mockUsers.find(u => u.user_id === userId);
};

export const getTableById = (tableId: number): RestaurantTable | undefined => {
  return mockTables.find(t => t.table_id === tableId);
};

export const getMenuItemById = (itemId: number): MenuItem | undefined => {
  return mockMenuItems.find(i => i.item_id === itemId);
};

export const getCategoryById = (catId: number): MenuCategory | undefined => {
  return mockCategories.find(c => c.category_id === catId);
};

export const getOrderItemsForOrder = (orderId: number): OrderItem[] => {
  return mockOrderItems.filter(oi => oi.order_id === orderId);
};

export const getOrdersForTable = (tableId: number): Order[] => {
  return mockOrders.filter(o => o.table_id === tableId);
};

export const formatCurrency = (amount: number | undefined | null): string => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return 'RWF 0';
  }
  return `RWF ${amount.toLocaleString('en-RW')}`;
};

export const generateQRToken = (): string => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

export const getQRCodeURL = (table: RestaurantTable): string => {
  return `https://la-ta-bhore.com/order?table=${table.table_number}&token=${table.qr_code_token}`;
};