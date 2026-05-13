1. SUPER ADMIN (Restaurant Owner)
Activity	Description	Related Tables
Create Staff Accounts	Register all users (Managers, Cashiers, Kitchen Staff, Waiters) with their roles	users
Manage Staff Accounts	Activate/deactivate accounts, reset passwords	users
Configure Restaurant Settings	Set restaurant name, address, tax rate, currency	System settings (add later)
Create & Manage Tables	Add tables, assign table numbers, generate QR codes, assign sections	restaurant_tables
View All Orders	Monitor all orders across all tables in real-time	orders, order_items
View Activity Logs	Check all order activities and system events	order_activity_log
View All Notifications	See system-wide notifications	notifications
Dashboard View: System overview, all tables status, staff list, configuration panel.

2. MANAGER (Operational Supervisor)
Activity	Description	Related Tables
Manage Menu Categories	Create, edit, delete menu categories (Starters, Mains, Drinks)	menu_categories
Manage Menu Items	Add new items, update prices, descriptions, images, assign to kitchen/bar	menu_items
Toggle Item Availability	Mark items available/unavailable (e.g., "Sold Out")	menu_items
View All Tables	Monitor all table statuses (available/occupied) in real-time	restaurant_tables, table_sessions
View All Active Orders	See all orders across all tables with their status	orders, order_items
Assign Waiters to Tables	Manually assign or reassign waiters to specific tables (if needed)	orders (update assigned_waiter_id)
View All Bills	Monitor billing status across all tables	bills
View Payment Reports	Check daily payment summaries	payments
Receive Notifications	Get alerted for new orders, issues, or system alerts	notifications
Dashboard View: Floor plan view, all active orders, menu management panel, payment overview.

3. CASHIER (Payment Handler)
Activity	Description	Related Tables
View Pending Bills	See all bills marked as "ready" for payment	bills
Process Payments	Accept cash, MoMo, or Airtel Money payments	payments
Confirm Mobile Money	Enter transaction reference from MoMo/Airtel to verify	payments
Mark Orders as Paid	When payment completes, the system auto-updates order status	orders, bills
Handle Cash Payments	Record cash received, calculate change	payments
Receive Payment Notifications	Get notified when customers request to pay	notifications
Dashboard View: List of tables ready to pay, payment processing screen, daily payment history.

4. KITCHEN STAFF (Food Preparer)
Activity	Description	Related Tables
View Kitchen Orders Queue	See all order items routed to "kitchen" station in real-time	order_items (filtered by destination_station = 'kitchen')
Update Item Status	Change status: pending → preparing → ready	order_items
Mark Items as Ready	Notify waiters that food is ready for serving	order_items, notifications
Mark Items Unavailable	If ingredients run out, mark menu items unavailable	menu_items
View Order Details	See special notes/customizations for each item	order_items, item_customizations
Receive New Order Alerts	Get notified when new food orders come in	notifications
Dashboard View (Kitchen Display System - KDS): Only kitchen items, ordered by time, color-coded by status.

5. WAITER (Table Manager)
Activity	Description	Related Tables
View Assigned Tables	See all tables assigned to them with status indicators	restaurant_tables, orders
View Table Orders	Monitor orders for their assigned tables	orders, order_items
Receive Order Notifications	Get alerted when customers at their tables place orders	notifications
Monitor Order Status	Track when kitchen/bar marks items as ready	order_items
Receive Ready Notifications	Get notified when food/drinks are ready to serve	notifications
Mark Items as Served	Update item status to "served" after delivery	order_items
View Order Activity	Check the history of order changes	order_activity_log
View Active Sessions	Know which tables have active customers	table_sessions
Dashboard View: Table grid with color codes (occupied, ordered, ready), order details panel.

6. CUSTOMER (The Diner - External User)
Activity	Description	Related Tables
Scan Table QR Code	Opens the menu PWA, creates a session for that table	table_sessions
Browse Menu	View categories and items with images, descriptions, prices	menu_categories, menu_items
Select Items	Choose items, add customizations (extra cheese, no onions)	menu_items, item_customizations
Place Order	Submit order to the system	orders, order_items
Track Order Status	Watch real-time status: Confirmed → Preparing → Ready → Served	orders, order_items
Receive Status Updates	See when items are being prepared or ready	Real-time via notifications (system-triggered)
Request Waiter	Tap "Call Waiter" button for assistance	notifications (creates notification for waiter)
View Bill	See running total of their order	bills
Request to Pay	Tap "Pay Bill" to notify cashier	bills, notifications
Customer View (PWA - No Login Required): Menu browser, cart, order tracker, bill viewer.