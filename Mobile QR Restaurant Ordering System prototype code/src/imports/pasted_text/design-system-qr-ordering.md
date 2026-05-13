DESIGN SYSTEM PROMPT FOR FIGMA AI:

Create a complete mobile-first QR Restaurant Ordering System prototype for a Rwanda-based restaurant. 
Use a warm, modern bakery/café aesthetic inspired by the reference image. 
Design for ALL user roles with separate dashboards.

═══════════════════════════════════════════
GLOBAL DESIGN SYSTEM
═══════════════════════════════════════════

COLOR PALETTE:
- Primary: #8B4513 (Warm Saddle Brown - bakery warmth)
- Primary Dark: #6B3410 (Deep Brown - headers, active states)
- Secondary: #D2691E (Cinnamon Orange - buttons, highlights)
- Accent: #FFA500 (Warm Orange - badges, notifications)
- Background: #FFF8F0 (Warm Cream - main backgrounds)
- Card Background: #FFFFFF (White - cards, containers)
- Surface: #FFF0E0 (Light Peach - section backgrounds)
- Text Primary: #2C1810 (Dark Brown - headings, important text)
- Text Secondary: #8B7355 (Medium Brown - descriptions, secondary text)
- Text Light: #C4A882 (Light Brown - placeholder text)
- Success: #228B22 (Forest Green - confirmations, paid status)
- Warning: #FF8C00 (Dark Orange - pending states)
- Danger: #B22222 (Firebrick Red - cancellations, alerts)
- Border: #E8D5C4 (Light Beige - dividers, borders)
- Shadow: rgba(44, 24, 16, 0.08) (Soft brown shadow)
- Glass Effect: rgba(255, 248, 240, 0.85) with blur(12px)

TYPOGRAPHY:
- Heading Font: 'Playfair Display', serif (elegant headings)
- Body Font: 'Inter', sans-serif (clean readability)
- Accent Font: 'DM Serif Display', serif (special sections)
- Price Font: 'Inter', sans-serif (bold, clear)
- System Font: 'Inter', sans-serif
- Scale: 12px, 14px, 16px, 18px, 20px, 24px, 32px, 48px
- Font Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

SPACING SYSTEM:
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px

BORDER RADIUS:
- sm: 8px (inputs, small cards)
- md: 12px (cards, buttons)
- lg: 16px (modals, larger cards)
- xl: 24px (hero sections)
- full: 9999px (pills, badges)

SHADOWS:
- Card Shadow: 0 2px 12px rgba(44, 24, 16, 0.08)
- Elevated Shadow: 0 8px 24px rgba(44, 24, 16, 0.12)
- Nav Shadow: 0 2px 8px rgba(44, 24, 16, 0.06)
- Modal Shadow: 0 20px 60px rgba(44, 24, 16, 0.20)

ICONS: Use Feather Icons set with warm brown colors, 24px default size.

CURRENCY: All prices in RWF (Rwandan Francs). Format: RWF 12,500 or Frw 12,500

═══ GLOBAL COMPONENTS ═════════════════════

1. NAVIGATION BAR (HEADER)
- Height: 64px
- Background: White with soft shadow
- Left: Logo/Back button + Page title
- Center: Global search bar (expandable) with icon
- Right: Notification bell (with red badge if unread) + User avatar (circular, 40px)
- Bottom border: 1px #E8D5C4
- Sticky position top
- Z-index: 100

2. GLOBAL SEARCH BAR
- Expandable from icon in header
- Full-width overlay when active
- Background: rgba(255,248,240,0.95) with backdrop blur
- Search input with search icon, rounded-full border
- Recent searches shown below
- Category filters: "Menu Items", "Orders", "Tables", "Staff"
- Shows results in dropdown with image thumbnail + name + category
- Pressing Enter searches globally, clicking result navigates

3. BOTTOM NAVIGATION (Mobile)
- Height: 72px with safe area padding
- Background: White with top border
- 4-5 icon+label tabs (varies by role)
- Active tab: Primary color icon and label
- Inactive tab: Text Secondary color
- Badge support on icons

4. SIDE NAVIGATION (Desktop)
- Width: 260px (collapsible to 72px)
- Background: Primary Dark (#6B3410)
- Logo area at top
- Navigation links with icons
- Active link: Accent background with left border indicator
- Collapse toggle at bottom
- User profile section at bottom

5. STATUS BADGES
- Success (green): "Active", "Completed", "Paid", "Available"
- Warning (orange): "Pending", "Preparing", "Occupied", "Ready"
- Danger (red): "Cancelled", "Blocked", "Failed"
- Info (blue/gray): "Draft", "Reserved"
- Shape: Rounded-full pill
- Size: Small text with padding 4px 12px

6. CARDS (MENU/ORDER/TABLE CARDS)
- Background: White
- Border radius: 12px
- Shadow: Card Shadow
- Hover: Elevated Shadow + slight scale(1.02) transition
- Image area with 8px top corners
- Content padding: 16px
- Action buttons at bottom
- Optional: Glass effect variant for featured items

7. BUTTONS
- Primary Button: Background #D2691E, white text, border-radius 12px
- Secondary Button: Border #D2691E, transparent background, #D2691E text
- Ghost Button: No border, #8B4513 text
- Danger Button: Background #B22222, white text
- Success Button: Background #228B22, white text
- Sizes: sm(32px), md(40px), lg(48px)
- Loading state: Spinner + disabled
- Full-width mobile buttons (min 48px touch target)

8. MODALS/SHEETS
- Bottom sheet on mobile (slide up from bottom)
- Centered modal on desktop
- Background: White with 16px border-radius
- Overlay: rgba(44,24,16,0.5) with backdrop blur
- Close button top right
- Title + description
- Action buttons at bottom
- Max height: 80vh, scrollable content

9. NOTIFICATION TOAST
- Top-right corner
- Slide in animation
- Icon + message + timestamp
- Colored left border (green/orange/red)
- Auto dismiss after 5 seconds
- Swipe to dismiss on mobile

10. TABLES/DATA GRIDS
- Alternating row colors (#FFF8F0 / White)
- Headers with bold text, Primary Dark background
- Hover state on rows
- Sortable column headers
- Pagination at bottom
- Responsive: Collapses to cards on mobile

11. EMPTY STATES
- Centered illustration/icon
- Friendly message
- Optional CTA button
- Warm illustration style

12. LOADING STATES
- Skeleton screens matching card layouts
- Shimmer animation
- Progress bars for multi-step processes

═══ ROLE-BASED LAYOUT RULES ══════════════

EACH USER ROLE HAS UNIQUE LAYOUT:

SUPER ADMIN: Desktop-first with full side navigation
           + Mobile responsive with bottom nav

MANAGER: Desktop-first with side navigation
        + Mobile bottom nav

CASHIER: Tablet/Desktop optimized
        + Simple mobile layout

KITCHEN STAFF: Tablet landscape (Kitchen Display System)
              + High contrast for visibility

WAITER: Mobile-first (tablet in hand)
       + Quick actions, large touch targets

CUSTOMER: Mobile-only PWA (Progressive Web App)
         + No navigation bar, just back button
         + Full-screen immersive experience

═══════════════════════════════════════════
PAGE DESIGNS FOR EACH ROLE
═══════════════════════════════════════════

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. CUSTOMER PWA (Mobile Only - 390x844)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PAGE 1.1: TABLE SCAN & WELCOME
- Full-screen warm gradient background (#FFF8F0 to #FFF0E0)
- Restaurant logo centered at top (120px from top)
- Restaurant name: "La Ta Bhore" in Playfair Display, 32px
- Subtitle: "Scan to discover our menu" in Inter, 16px
- Animated QR scanner frame (rounded square with corner brackets)
- Or Divider: "— or enter table code —"
- Table code input: 6 large individual character boxes
- "Enter" button below
- Bottom text: "Powered by QR Ordering System" with small logo

PAGE 1.2: MENU BROWSER (Reference Image Style)
- Sticky header: "Welcome, Menu" in Playfair Display, 24px
- Subtitle: "Discover whatever you need easily" in Inter, 14px, Text Secondary
- Horizontal scrolling category pills (Signature, Croissant, Waffle, Coffee, Ice Cream)
  - Active pill: Primary background, white text
  - Inactive pill: White background, Primary border
- Search icon in header
- Menu items in 2-column grid OR single column cards:
  
  Each Menu Card:
  - Large image (height 180px, object-cover)
  - Item name: Playfair Display, 18px, Text Primary
  - Description: Inter, 13px, Text Secondary (2 lines max)
  - Price: Inter Bold, 16px, Primary color (RWF format)
  - Quantity: "/ 3 pcs" in lighter text
  - "Add" button: Secondary style, "+" icon, rounded-full
  
- Selected items floating cart button at bottom
  - Shows item count badge
  - Shows running total
  - "View Cart" text
  - Background: Primary Dark with slight transparency

PAGE 1.3: ITEM DETAIL MODAL
- Bottom sheet sliding up
- Large item image at top
- Item name, description, allergens
- Price prominently displayed
- Quantity selector (+ and - buttons with number)
- Customization options (checkboxes for add-ons with prices)
- Special instructions text area
- "Add to Order - RWF X,XXX" button (full width, Primary)
- "Cancel" link below

PAGE 1.4: CART / ORDER SUMMARY
- Full page: "Your Order" header
- Table number indicator badge
- List of ordered items:
  - Item image (small thumbnail, 64px)
  - Item name + customizations listed
  - Quantity controls
  - Item subtotal
  - Swipe to delete
- Order special instructions text area
- Subtotal, Discount, Tax breakdown (Reference Image Style)
  - Subtotals section with light background card
  - Each line: Label left, Amount right
  - Divider lines
  - Total in bold, larger text, Primary color
- "Place Order - RWF 34,860" primary button (full width)
- Back to menu link

PAGE 1.5: ORDER TRACKING
- Full page: "Order Status" header
- Order number prominently displayed (#055)
- Status timeline (vertical stepper):
  - ✓ Confirmed (green checkmark)
  - ● Preparing (orange, animated pulse)
  - ○ Ready (gray)
  - ○ Served (gray)
- Estimated time: "Estimated 15-20 minutes"
- Ordered items list (collapsed, expandable)
- Current bill total displayed
- "Call Waiter" button (secondary, icon)
- "View Bill" button (outline)
- "Pay Now" button (primary, only appears when order is "Ready" or later)

PAGE 1.6: BILL & PAYMENT
- Full page: "Your Bill" header
- Restaurant name and order number
- Table number
- Itemized list (same as cart)
- Subtotal: RWF 37,610
- Discount: -RWF 5,000 (highlighted in green)
- Tax: RWF 2,250
- Total: RWF 34,860 (bold, large, Primary Dark)
- Payment method info text
- "Request to Pay" primary button
- "Pay with Cash to Waiter" secondary button
- After payment: Success animation with receipt preview

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. WAITER DASHBOARD (Mobile-First 390x844)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PAGE 2.1: WAITER HOME - TABLE OVERVIEW
- Header: "Bonjour, Jean Paul" + date + shift info
- Global search bar (search tables, orders)
- Stats row (horizontal scroll cards):
  - Active Tables: count with table icon
  - Orders Pending: count with clock icon
  - Ready to Serve: count with bell icon
  - Ready to Pay: count with money icon
- Table Grid (main area):
  - Each table shown as a card
  - Table number large and centered
  - Color-coded status indicator:
    - Green: Available (empty)
    - Orange: Occupied (has order)
    - Blue: Ready (food ready to serve)
    - Red: Needs attention (calling waiter, ready to pay)
  - Small icons showing: Has order? Has ready items? Calling waiter?
  - Tap to expand order details
- Bottom Navigation:
  - Tables (active, grid icon)
  - Orders (list icon)
  - Notifications (bell with badge)
  - Profile (user icon)

PAGE 2.2: TABLE DETAIL VIEW
- Header: "Table 5" + back button + table status badge
- Customer session info (started 45 min ago, 3 customers)
- Active orders list:
  - Order #055
  - Status: "Preparing" badge
  - Items list with individual status
  - Action: "View Full Order" button
- Quick Actions bar:
  - "Add Item" button
  - "Call Manager" button
  - "Mark Served" button
- Order timeline (simple vertical list of events)

PAGE 2.3: ORDER DETAIL VIEW
- Order number header
- Customer session info
- Each item with:
  - Name + quantity
  - Customizations listed
  - Item status badge (pending/preparing/ready/served)
  - If ready: "Mark as Served" button (green)
  - If preparing: Progress indicator
- Order total
- Activity log (last 5 actions)
- "View Bill" button at bottom

PAGE 2.4: NOTIFICATIONS PANEL
- Full page with tabs: "All", "Orders", "Ready", "Calls"
- Each notification card:
  - Icon (type-based)
  - Title: "Table 5 - Order Ready"
  - Message: "2 items ready for serving"
  - Timestamp: "2 min ago"
  - Tap to navigate to relevant table/order
- Swipe to dismiss
- "Mark All Read" button

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. KITCHEN STAFF DASHBOARD (Tablet 1024x768)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PAGE 3.1: KITCHEN DISPLAY SYSTEM (KDS)
- Dark mode theme for kitchen environment:
  - Background: #1A1A1A (dark gray)
  - Cards: #2D2D2D
  - Text: #FFFFFF primary, #B0B0B0 secondary
  - High contrast for visibility
- Header bar:
  - "Kitchen Display" title
  - Current time (digital clock, large)
  - Station indicator: "KITCHEN"
  - Pending count badge (large, orange)
  - Settings gear icon
- Order Queue (main area) - Cards arranged in columns by status:
  
  Column 1: NEW (pending)
  Column 2: PREPARING
  Column 3: READY
  
  Each Order Card:
  - Large order number (#055)
  - Table number
  - Timer since order placed ("12:34 ago")
  - Red border that intensifies as time increases
  - Items list:
    - Item name, quantity
    - Customizations (highlighted if special)
    - Special notes (red text if urgent)
  - "Start Preparing" button → moves to Column 2
  - "Mark Ready" button → moves to Column 3
  - Timer showing time in current column
  
- Bottom bar:
  - Items completed today counter
  - Average prep time
  - "Mark All Ready" batch button

PAGE 3.2: ITEM 86 (OUT OF STOCK)
- Modal overlay
- Select menu item from dropdown
- Confirm: "Mark as Unavailable?"
- Notify Manager option (toggle)
- "Confirm" button (danger/red)
- Success toast: "Item marked unavailable. Manager notified."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. CASHIER DASHBOARD (Tablet 1024x768)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PAGE 4.1: CASHIER HOME - PENDING BILLS
- Header: "Cashier Terminal" + current date/time + shift info
- Stats bar:
  - Pending Bills: count
  - Today's Total: RWF amount
  - Cash Payments: RWF amount
  - Mobile Money: RWF amount
- Bills Queue (main area):
  - Cards showing tables ready to pay
  - Sorted by request time (oldest first)
  - Each card:
    - Table number + order number
    - Total amount (large, bold)
    - Time waiting ("Requested 5 min ago")
    - "Process Payment" button (primary)
- Search bar to find specific bill
- Tabs: "Pending" | "Paid Today" | "All Bills"
- Bottom Navigation:
  - Bills (active)
  - History
  - Shift
  - Profile

PAGE 4.2: PAYMENT PROCESSING SCREEN
- Order/Bill summary on left:
  - Items list
  - Subtotal, tax, total
- Payment section on right:
  - Payment Method Selection (large buttons with icons):
    - "Cash" (banknote icon)
    - "MoMo" (MTN Mobile Money logo/icon)
    - "Airtel Money" (Airtel logo/icon)
  
  CASH SELECTED:
  - Amount tendered input
  - Quick amount buttons (RWF 35,000, RWF 40,000, RWF 50,000)
  - Change due calculation (auto-computed)
  - "Complete Payment" button
  
  MOMO SELECTED:
  - Phone number input (07X XXX XXXX format)
  - Amount to charge (auto-filled)
  - "Send Payment Request" button
  - Transaction reference input field
  - "Verify & Confirm" button
  
  AIRTEL MONEY SELECTED:
  - Same as MoMo but Airtel branded
  
- Success screen after payment:
  - Green checkmark animation
  - Receipt preview
  - Options: "Print Receipt", "Send SMS", "Done"

PAGE 4.3: PAYMENT HISTORY
- Date filter at top (Today, Yesterday, This Week, Custom)
- Search by order number or table
- List/Table of completed payments:
  - Time, Order #, Table, Amount, Method, Status
- Tap to view receipt details
- Daily totals summary at bottom

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. MANAGER DASHBOARD (Desktop 1440x900)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PAGE 5.1: MANAGER OVERVIEW DASHBOARD
- Sidebar Navigation (260px, Primary Dark background):
  - Logo at top: "La Ta Bhore" in white Playfair Display
  - Navigation items with icons:
    - 📊 Dashboard (active)
    - 🍽️ Menu Management
    - 📋 Orders
    - 🪑 Tables
    - 💰 Billing & Payments
    - 👥 Staff
    - 🔔 Notifications
    - ⚙️ Settings
  - User profile at bottom with logout
  
- Main Content Area:
  - Header with page title "Dashboard" + date + global search
  
  - Stats Grid (4 cards in row):
    - Active Tables: 12/20 (60% occupancy)
    - Orders Today: 47
    - Revenue Today: RWF 425,800
    - Pending Bills: 3
  
  - Real-time Floor Plan (interactive):
    - Visual table layout with status colors
    - Hover for table details
    - Click to view active orders
  
  - Recent Orders Feed:
    - Timeline of last 10 orders
    - Each with: time, table, order #, total, status
  
  - Quick Actions: "Add Menu Item", "View Reports", "Manage Staff"

PAGE 5.2: MENU MANAGEMENT
- Header: "Menu Management" + "Add Category" + "Add Item" buttons
- Search and filter bar
- Category tabs/sections
- Menu items in grid or list view:
  - Each item card with:
    - Image (160px)
    - Name, description, price
    - Station badge (Kitchen/Bar)
    - Availability toggle (switch)
    - Edit button, Delete button
- "Add New Item" FAB button (bottom right)
- Modal for adding/editing items:
  - Name, Description, Price (RWF)
  - Category dropdown
  - Image upload
  - Station selection (Kitchen/Bar)
  - Dietary tags (Vegetarian, Vegan, Gluten-free)
  - Allergens input
  - Availability toggle
  - Save/Cancel

PAGE 5.3: TABLE MANAGEMENT
- Header: "Table Management" + "Add Table" button
- Floor plan editor (drag and drop tables):
  - Grid background
  - Table items can be dragged to position
  - Each table shows: number, capacity, QR icon
- Table list view (alternative):
  - Table number, Section, Capacity, Status
  - Actions: Edit, Generate QR Code, Block/Unblock
- QR Code generation modal:
  - Select table
  - "Generate QR Code" button
  - Preview QR code
  - Download/Print options

PAGE 5.4: STAFF MANAGEMENT
- Header: "Staff Management" + "Add Staff" button
- Staff list in table format:
  - Name, Email, Role, Status, Last Login
  - Actions: Edit, Deactivate, Reset Password
- Role badges with colors
- Add/Edit Staff Modal:
  - First Name, Last Name
  - Email, Phone
  - Role dropdown
  - Initial password (or auto-generate)
  - Save/Cancel

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. SUPER ADMIN DASHBOARD (Desktop 1440x900)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PAGE 6.1: SUPER ADMIN OVERVIEW
- Similar to Manager Dashboard but with additional controls:
  - Restaurant Settings (name, address, tax rate, currency)
  - System Configuration
  - All Manager capabilities plus:
    - View all managers
    - System logs
    - Backup controls
- Stats show ALL locations/data
- "System Health" widget showing API status, database status

PAGE 6.2: RESTAURANT CONFIGURATION
- Restaurant name, address, contact
- Tax rate setting (percentage)
- Currency: RWF (locked for Rwanda)
- Opening/Closing hours
- Logo upload
- Save settings button

═══ ADDITIONAL GLOBAL FEATURES ═══════════

1. REAL-TIME UPDATES
- All dashboards should show "Last updated: X seconds ago"
- Refresh indicators
- WebSocket connection status indicator (green dot)

2. RESPONSIVE BREAKPOINTS
- Mobile: 320px - 767px (Bottom navigation)
- Tablet: 768px - 1023px (Collapsed sidebar + bottom nav)
- Desktop: 1024px+ (Full sidebar navigation)

3. ACCESSIBILITY
- High contrast mode toggle
- Large touch targets (minimum 44px)
- Screen reader friendly labels
- Focus indicators on all interactive elements

4. ANIMATIONS
- Page transitions: Fade + slight slide (200ms)
- Card hover: Subtle scale (1.02) with shadow increase
- Button press: Scale down to 0.97
- Loading: Skeleton shimmer
- Success: Checkmark animation
- Modal: Scale up from 0.95 with fade

5. COLOR-CODED STATUS SYSTEM (Consistent across all dashboards)
- 🟢 Green: Active, Available, Completed, Paid, Served
- 🟠 Orange: Preparing, Pending, Occupied
- 🔴 Red: Cancelled, Blocked, Failed, Needs Attention
- 🔵 Blue: Ready, In Progress, Assigned
- ⚪ Gray: Draft, Inactive, Idle

═══ KEY UI MICRO-INTERACTIONS ════════════

1. PULL-TO-REFRESH on all list views
2. INFINITE SCROLL for long lists
3. SWIPE ACTIONS on cards (complete, dismiss)
4. LONG PRESS for quick actions context menu
5. HAPTIC FEEDBACK indicators for mobile
6. TOAST MESSAGES for confirmations
7. SKELETON LOADING for all async content
8. EMPTY STATES with helpful CTAs

═══════════════════════════════════════════
END OF DESIGN PROMPT
═══════════════════════════════════════════

Generate this complete system design with:
- All pages listed above
- All components specified
- Consistent design system application
- Realistic sample data
- Rwanda Franc (RWF) currency throughout
- Warm, modern bakery aesthetic
- Responsive layouts for all screen sizes
- Export as interactive prototype with clickable navigation