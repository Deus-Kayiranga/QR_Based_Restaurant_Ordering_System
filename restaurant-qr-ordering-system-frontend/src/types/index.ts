// Enums & Literal Types
export type UserRole = 'SUPER_ADMIN' | 'MANAGER' | 'CASHIER' | 'KITCHEN_STAFF' | 'BAR_STAFF' | 'WAITER';
export type OrderStatus = 'DRAFT' | 'PLACED' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
export type OrderItemStatus = 'PENDING' | 'PREPARING' | 'READY' | 'SERVED' | 'CANCELLED';
export type PaymentMethod = 'CASH' | 'MOMO' | 'AIRTEL_MONEY';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED';
export type StationType = 'KITCHEN' | 'BAR';
export type TableStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'BLOCKED';
export type BillStatus = 'OPEN' | 'READY' | 'PAID';
export type NotificationType = 'NEW_ORDER' | 'ORDER_READY' | 'ORDER_CANCELLED' | 'PAYMENT_RECEIVED' | 'WAITER_CALL' | 'SYSTEM_ALERT' | 'TABLE_STATUS_CHANGE';

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

// Auth
export interface LoginRequest { email: string; password: string; }
export interface RegisterRequest { 
  firstName: string; 
  lastName: string; 
  email: string; 
  phoneNumber: string; 
  password: string; 
  role: UserRole; 
}
export interface AuthResponse { 
  token: string; 
  tokenType: string; 
  userId: number; 
  email: string; 
  role: UserRole; 
  firstName: string; 
  lastName: string; 
}

// User
export interface User { 
  userId: number; 
  firstName: string; 
  lastName: string; 
  email: string; 
  phoneNumber: string; 
  role: UserRole; 
  isActive: boolean; 
  lastLoginAt?: string; 
  createdAt: string; 
}

// Menu
export interface MenuCategory { 
  categoryId: number; 
  categoryName: string; 
  description?: string; 
  displayOrder: number; 
  isActive: boolean; 
}

export interface MenuItem { 
  itemId: number; 
  categoryId: number; 
  categoryName?: string; 
  itemName: string; 
  description?: string; 
  price: number; 
  discountedPrice?: number; 
  imageUrl?: string; 
  destinationStation: StationType; 
  isAvailable: boolean; 
  isVegetarian: boolean; 
  isVegan: boolean; 
  isGlutenFree: boolean; 
  containsAllergens?: string; 
  displayOrder: number; 
  // STOCK MANAGEMENT
  trackStock?: boolean;
  stockQuantity?: number;
  minStockLevel?: number;
  currentStock?: number;
  initialStock?: number;
  minimumStockAlert?: number;
  stockUnit?: string;
  lastRestockedAt?: string;
}

// Table
export interface RestaurantTable { 
  tableId: number; 
  tableNumber: string; 
  qrCodeToken: string; 
  qrCodeImageUrl?: string; 
  seatingCapacity: number; 
  section?: string; 
  status: TableStatus; 
  isActive: boolean; 
}

// Session
export interface TableSession { 
  sessionToken: string; 
  tableNumber: string; 
  tableId: number; 
  customerCount: number; 
  isActive: boolean; 
  startedAt: string; 
}

// Order
export interface Order { 
  orderId: number; 
  tableId: number; 
  tableNumber: string; 
  table?: RestaurantTable; // Some APIs return the full table object
  customerSession: string; 
  assignedWaiterId?: number; 
  waiterName?: string;
  orderStatus: OrderStatus; 
  specialInstructions?: string; 
  subtotal: number; 
  taxAmount: number; 
  totalAmount: number; 
  items: OrderItem[]; 
  placedAt: string; 
  completedAt?: string; 
  timeSinceOrdered?: string;
  hasSpecialRequests?: boolean;
}

export interface OrderItem { 
  orderItemId: number; 
  menuItemId: number; 
  menuItem?: MenuItem;
  itemName: string; 
  quantity: number; 
  unitPrice: number; 
  itemStatus: OrderItemStatus; 
  specialNotes?: string; 
  destinationStation: StationType; 
  customizations: string[]; 
}

// Bill
export interface Bill { 
  billId: number; 
  billNumber: string; 
  orderId: number; 
  tableNumber: string; 
  items: OrderItem[]; 
  subtotal: number; 
  taxAmount: number; 
  totalAmount: number; 
  billStatus: BillStatus; 
  generatedAt: string; 
  paidAt?: string; 
}

// Payment
export interface Payment { 
  paymentId: number; 
  billId: number; 
  paymentMethod: PaymentMethod; 
  amount: number; 
  phoneNumber?: string; 
  transactionReference?: string; 
  paymentStatus: PaymentStatus; 
  processedBy?: number; 
  paymentDate: string; 
  receiptNumber?: string; 
}

// Notification
export interface Notification { 
  notificationId: number; 
  type: NotificationType; 
  title: string; 
  message: string; 
  referenceType?: string; 
  referenceId?: number; 
  isRead: boolean; 
  createdAt: string; 
}

export interface DashboardStats {
  todayRevenue: number;
  todayOrders: number;
  activeTables: number;
  staffOnDuty: number;
  pendingBills: number;
  totalMenuItems: number; 
  lowStockItems: number; 
  totalUsers: number;
}

export interface KitchenStats { 
  ordersReceived: number; 
  itemsPrepared: number; 
  completedReady: number; 
  pendingRemaining: number; 
  avgPrepTime: number; 
}

export interface StockAlert { 
  itemId: number; 
  itemName: string; 
  currentStock: number; 
  minimumStockAlert: number; 
  stockUnit: string; 
  station: StationType; 
}

// Cart (Frontend only)
export interface CartItem { 
  menuItem: MenuItem; 
  quantity: number; 
  specialNotes: string; 
  customizations: string[]; 
}

// QR Validation
export interface QRValidationRequest { tableNumber: string; token: string; }
export interface QRValidationResponse { 
  sessionToken: string; 
  tableNumber: string; 
  tableId: number; 
  seatingCapacity: number; 
}

// Order Request
export interface OrderRequest { 
  tableId: number; 
  sessionToken: string; 
  items: OrderItemRequest[]; 
  specialInstructions?: string; 
}

export interface OrderItemRequest { 
  menuItemId: number; 
  quantity: number; 
  specialNotes?: string; 
  customizations?: string[]; 
}

// Payment Requests
export interface CashPaymentRequest { billId: number; amountTendered: number; }
export interface MobileMoneyPaymentRequest { 
  billId: number; 
  phoneNumber: string; 
  amount: number; 
  transactionReference?: string; 
}

// Pagination
export interface PaginatedResponse<T> { 
  content: T[]; 
  totalElements: number; 
  totalPages: number; 
  currentPage: number; 
  pageSize: number; 
}

// Stock Movement
export interface StockMovement { 
  movementId: number; 
  itemId: number; 
  itemName: string; 
  quantityChanged: number; 
  reason: string; 
  performedBy: string; 
  createdAt: string; 
}

// Aliases for API responses
export type UserResponse = User;
export type MenuItemResponse = MenuItem;
export type MenuCategoryResponse = MenuCategory;
export type OrderResponse = Order;
export type BillResponse = Bill;
export type PaymentResponse = Payment;
export type KitchenOrderResponse = Order;
export type TableResponse = RestaurantTable;
export type OrderItemResponse = OrderItem;
export type DashboardResponse = DashboardStats;
export type NotificationResponse = Notification;
export type SessionResponse = QRValidationResponse;

