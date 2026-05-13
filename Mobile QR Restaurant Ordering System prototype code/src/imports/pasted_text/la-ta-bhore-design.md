═══════════════════════════════════════════════════════════════
MASTER FIGMA AI PROMPT
QR RESTAURANT ORDERING SYSTEM - LA TA BHORE
ALL SCREENS - ALL USER ROLES
═══════════════════════════════════════════════════════════════

Generate a complete restaurant ordering system design for "La Ta Bhore" 
restaurant in Rwanda. Currency: RWF (Rwandan Francs).
Design modern, warm bakery aesthetic. Generate ALL pages for ALL user roles.

═══════════════════════════════════════════════════════════════
GLOBAL DESIGN SYSTEM
═══════════════════════════════════════════════════════════════

COLORS:
- Primary: #8B4513 (Warm Brown)
- Primary Dark: #6B3410 (Deep Brown)  
- Primary Light: #A0522D (Sienna)
- Secondary: #D2691E (Cinnamon Orange)
- Accent: #FFA500 (Orange)
- Background: #FFF8F0 (Warm Cream)
- Card BG: #FFFFFF
- Surface: #FFF0E0 (Light Peach)
- Text Primary: #2C1810 (Dark Brown)
- Text Secondary: #8B7355 (Medium Brown)
- Text Light: #B8A088 (Light Brown)
- Success: #228B22 (Green)
- Warning: #FF8C00 (Orange)
- Danger: #C62828 (Red)
- Info: #1565C0 (Blue)
- Border: #E8D5C4 (Beige)
- Sidebar BG: #3E1A0A (Very Dark Brown)
- Sidebar Hover: #4A2512
- Sidebar Active: #D2691E
- Header BG: #FFFFFF
- Shadow: rgba(44,24,16,0.08)

TYPOGRAPHY:
- Headings: 'Playfair Display', serif (24px, 20px, 18px, 16px)
- Body: 'Inter', sans-serif (14px, 13px, 12px)
- Prices: 'Inter', bold (16px, 18px)
- Sidebar Labels: 'Inter', medium (14px)

SPACING: xs(4px) sm(8px) md(16px) lg(24px) xl(32px) 2xl(48px)
BORDER RADIUS: sm(6px) md(10px) lg(14px) xl(20px) full(9999px)
SHADOW: Card(0_2px_12px_rgba), Elevated(0_8px_24px_rgba), Modal(0_16px_48px_rgba)

ICONS: Lucide Icons / Feather Icons, 20px in sidebar, 24px in headers
CURRENCY FORMAT: RWF 12,500 (use exactly this format)

═══════════════════════════════════════════════════════════════
LAYOUT STRUCTURE FOR DASHBOARD PAGES (Desktop 1440x900)
═══════════════════════════════════════════════════════════════

LAYOUT:
┌──────────┬─────────────────────────────────────────────┐
│          │  HEADER BAR (64px, white, shadow)            │
│          │  [Logo] [Page Title] [Search] [🔔] [👤]     │
│          ├─────────────────────────────────────────────│
│ SIDEBAR  │                                             │
│          │                                             │
│ 260px    │  MAIN CONTENT AREA                          │
│ Dark     │  (scrollable)                               │
│ Brown    │                                             │
│          │                                             │
│ Logo     │  - Stats Cards Row                          │
│ Nav      │  - Data Tables / Cards Grid                 │
│ Items    │  - Charts / Lists                           │
│          │                                             │
│          │                                             │
│          │                                             │
│ User     │                                             │
│ Profile  │                                             │
└──────────┴─────────────────────────────────────────────┘

SIDEBAR (260px width, #3E1A0A background):
- Top: Restaurant Logo "La Ta Bhore" in Playfair Display, white, 24px
        Below logo: Small "Management System" text in #B8A088, 11px
- Navigation items with icons + labels
- Active item: #D2691E background with 3px left border #FFA500
- Inactive item: Transparent, text #C4A882
- Hover: #4A2512 background
- Bottom: User avatar (44px circle) + name + role badge + logout icon
- Collapse toggle button at very bottom

HEADER BAR (64px height, white, shadow):
- Left: Page title (dynamic based on current page)
- Center: Global search bar (expandable, 400px max)
- Right section:
  - Notification bell icon with red badge (if unread)
  - User avatar small (36px) with dropdown
  - Settings gear icon

═══════════════════════════════════════════════════════════════
PAGES BY USER ROLE
═══════════════════════════════════════════════════════════════

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ROLE 1: SUPER ADMIN (Restaurant Owner)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SIDEBAR NAVIGATION ITEMS:
┌────────────────────────────┐
│  🏠  Dashboard             │ (active)
│  👥  Staff Management      │
│  🪑  Table Management      │
│  🍽️  Menu Overview         │
│  📋  All Orders             │
│  💰  Billing & Payments     │
│  📊  Reports                │
│  ⚙️  System Settings        │
│  🔔  Notifications          │
│  📜  Activity Logs          │
│                            │
│  ────────────────────────  │
│  👤 Jean Baptiste          │
│     Super Admin            │
│     [Logout]               │
└────────────────────────────┘

PAGE 1.1: SUPER ADMIN DASHBOARD
Header Title: "Dashboard Overview"
Content:
- Welcome greeting: "Bonjour, Jean Baptiste 👋" in Playfair Display 24px
- Date: "Friday, May 1, 2026" in text secondary

- STATS ROW (4 cards):
  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
  │ 🟢 Active    │ │ 📋 Today's   │ │ 💰 Revenue   │ │ 👥 Staff     │
  │ Tables       │ │ Orders       │ │ Today        │ │ On Duty      │
  │             │ │             │ │             │ │             │
  │ 14/20       │ │ 47          │ │ RWF 425,800 │ │ 8/12        │
  │ 70% Occup.  │ │ ↑12% vs yesterday│ │ ↑8%         │ │             │
  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘

- TWO COLUMN LAYOUT BELOW:
  
  LEFT COLUMN (60%):
  ┌─────────────────────────────────────┐
  │ 📊 Revenue Overview (Chart)         │
  │ [Bar chart showing daily revenue]   │
  │ Last 7 days: Mon RWF 380K,          │
  │ Tue RWF 410K, Wed RWF 395K,         │
  │ Thu RWF 450K, Fri RWF 425K,         │
  │ Sat RWF 520K, Sun RWF 480K          │
  └─────────────────────────────────────┘

  ┌─────────────────────────────────────┐
  │ 🪑 Table Status Overview            │
  │ [Floor plan grid with colored dots] │
  │ 🟢 Available: 6 tables              │
  │ 🟠 Occupied: 12 tables              │
  │ 🔵 Reserved: 2 tables               │
  │ 🔴 Blocked: 0 tables                │
  └─────────────────────────────────────┘

  RIGHT COLUMN (40%):
  ┌─────────────────────────────────────┐
  │ 📋 Recent Orders Feed               │
  │ ┌─────────────────────────────┐     │
  │ │ #057 Table A5  RWF 34,860  │     │
  │ │ Preparing · 5 min ago       │     │
  │ └─────────────────────────────┘     │
  │ ┌─────────────────────────────┐     │
  │ │ #056 Table B2  RWF 22,500  │     │
  │ │ Completed · 12 min ago      │     │
  │ └─────────────────────────────┘     │
  │ ┌─────────────────────────────┐     │
  │ │ #055 Table A3  RWF 18,900  │     │
  │ │ Ready · 3 min ago           │     │
  │ └─────────────────────────────┘     │
  │ [View All Orders →]                 │
  └─────────────────────────────────────┘

  ┌─────────────────────────────────────┐
  │ 🔔 System Alerts                    │
  │ ⚠️ Table B5 session expired         │
  │ ✅ Backup completed successfully    │
  │ 📝 New staff account created        │
  └─────────────────────────────────────┘

PAGE 1.2: STAFF MANAGEMENT
Header Title: "Staff Management"
Top Right: [+ Add Staff Member] button (Primary #D2691E)

- SEARCH & FILTER BAR:
  [🔍 Search staff...] [Role: All ▼] [Status: All ▼]

- STAFF TABLE:
┌────┬──────────────┬─────────────────┬──────────┬────────┬──────────┬────────┐
│ ID │ Name         │ Email           │ Role     │ Status │ Last Login│ Actions│
├────┼──────────────┼─────────────────┼──────────┼────────┼──────────┼────────┤
│ 1  │ Jean Baptiste│ admin@latabhore │ Super    │ 🟢     │ Today     │ ⋮ Edit│
│    │              │ .rw             │ Admin    │ Active  │ 08:30 AM  │ Delete│
├────┼──────────────┼─────────────────┼──────────┼────────┼──────────┼────────┤
│ 2  │ Marie Claire │ marie@latabhore │ Manager  │ 🟢     │ Today     │ ⋮     │
│    │              │ .rw             │          │ Active  │ 07:45 AM  │       │
├────┼──────────────┼─────────────────┼──────────┼────────┼──────────┼────────┤
│ 3  │ Patrick      │ patrick@latabhore│ Cashier │ 🟢     │ Today     │ ⋮     │
│    │              │ .rw             │          │ Active  │ 08:00 AM  │       │
├────┼──────────────┼─────────────────┼──────────┼────────┼──────────┼────────┤
│ 4  │ Alice        │ alice@latabhore │ Kitchen  │ 🟢     │ Today     │ ⋮     │
│    │              │ .rw             │ Staff    │ Active  │ 06:30 AM  │       │
├────┼──────────────┼─────────────────┼──────────┼────────┼──────────┼────────┤
│ 5  │ David        │ david@latabhore │ Waiter   │ 🟡     │ Yesterday │ ⋮     │
│    │              │ .rw             │          │ On Break│ 10:00 PM  │       │
├────┼──────────────┼─────────────────┼──────────┼────────┼──────────┼────────┤
│ 6  │ Grace        │ grace@latabhore │ Waiter   │ 🔴     │ Apr 28    │ ⋮     │
│    │              │ .rw             │          │ Inactive│           │       │
└────┴──────────────┴─────────────────┴──────────┴────────┴──────────┴────────┘

- Pagination: [←] [1] [2] [3] [→]  Showing 1-6 of 12 staff

ADD/EDIT STAFF MODAL (overlay):
┌──────────────────────────────────────┐
│  Add New Staff Member           [✕] │
├──────────────────────────────────────┤
│                                      │
│  First Name: [_______________]       │
│  Last Name:  [_______________]       │
│  Email:      [_______________]       │
│  Phone:      [+250___________]       │
│  Role:       [Select Role ▼]         │
│              Super Admin             │
│              Manager                 │
│              Cashier                 │
│              Kitchen Staff           │
│              Waiter                  │
│  Password:   [_______________]       │
│              [Generate Random]       │
│                                      │
│  [Cancel]        [Save Staff]        │
└──────────────────────────────────────┘

PAGE 1.3: TABLE MANAGEMENT
Header Title: "Table Management"
Top Right: [+ Add Table] [🏛️ Floor Plan View] [📋 List View]

- FLOOR PLAN VIEW (active tab):
  ┌──────────────────────────────────────────────────────────┐
  │  🏛️ Restaurant Floor Plan                                 │
  │                                                          │
  │  ┌─ WINDOW ──────────────────────────────────────────┐   │
  │  │                                                    │   │
  │  │  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐          │   │
  │  │  │  A1  │  │  A2  │  │  A3  │  │  A4  │          │   │
  │  │  │ 🟢 4 │  │ 🟠 4 │  │ 🟢 4 │  │ 🟠 4 │          │   │
  │  │  └──────┘  └──────┘  └──────┘  └──────┘          │   │
  │  │                                                    │   │
  │  │  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐          │   │
  │  │  │  B1  │  │  B2  │  │  B3  │  │  B4  │          │   │
  │  │  │ 🟠 2 │  │ 🟢 6 │  │ 🟠 4 │  │ 🔵 4 │          │   │
  │  │  └──────┘  └──────┘  └──────┘  └──────┘          │   │
  │  │                                                    │   │
  │  │           ┌──────┐  ┌──────┐  ┌──────┐            │   │
  │  │           │  C1  │  │  C2  │  │  C3  │            │   │
  │  │           │ 🟢 8 │  │ 🟠 6 │  │ 🟢 4 │            │   │
  │  │           └──────┘  └──────┘  └──────┘            │   │
  │  │                                                    │   │
  │  │              ┌──────────┐                          │   │
  │  │              │   BAR    │                          │   │
  │  │              └──────────┘                          │   │
  │  └────────────────────────────────────────────────────┘   │
  │                                                          │
  │  Legend: 🟢 Available  🟠 Occupied  🔵 Reserved  🔴 Blocked│
  └──────────────────────────────────────────────────────────┘

- When clicking a table card, show popup:
  ┌─────────────────────────┐
  │ Table A2                │
  │ Section: Main Hall      │
  │ Capacity: 4 persons     │
  │ Status: 🟠 Occupied     │
  │ Current Order: #057     │
  │ Session: Active (32 min)│
  │                         │
  │ [View Order] [Edit]     │
  │ [Generate QR Code]      │
  │ [Block Table]           │
  └─────────────────────────┘

- QR CODE GENERATION MODAL:
  ┌──────────────────────────────────────┐
  │  Generate QR Code for Table A2       │
  ├──────────────────────────────────────┤
  │                                      │
  │    ┌────────────────────┐            │
  │    │                    │            │
  │    │    QR CODE HERE    │            │
  │    │    (with logo)     │            │
  │    │                    │            │
  │    └────────────────────┘            │
  │                                      │
  │  URL: la-ta-bhore.com/order?table=A2 │
  │       &token=x7K9mP2vR8nQ4wL6       │
  │                                      │
  │  Size: [Small] [Medium] [Large]      │
  │  Format: [PNG] [SVG] [PDF]           │
  │                                      │
  │  [Download] [Print] [Email]          │
  └──────────────────────────────────────┘

PAGE 1.4: SYSTEM SETTINGS
Header Title: "System Settings"

- SETTINGS SECTIONS:

SECTION 1: Restaurant Information
┌──────────────────────────────────────┐
│ 🏪 Restaurant Details                │
│                                      │
│ Restaurant Name: [La Ta Bhore______] │
│ Address:         [KG 123 St, Kigali] │
│ Phone:           [+250 788 123 456_] │
│ Email:           [info@latabhore.rw] │
│ Website:         [latabhore.rw_____] │
│ Logo:            [Upload Logo] [🖼]  │
└──────────────────────────────────────┘

SECTION 2: Financial Settings
┌──────────────────────────────────────┐
│ 💰 Financial Configuration           │
│                                      │
│ Currency:      [RWF ▼] (locked)     │
│ Tax Rate (%):  [18_____]            │
│ Service Charge:[0______]            │
│ Decimal Places:[0 ▼] (no decimals)  │
│                                      │
│ Display Format: RWF 12,500           │
└──────────────────────────────────────┘

SECTION 3: Operational Settings
┌──────────────────────────────────────┐
│ ⚙️ Operations                        │
│                                      │
│ Opening Time:   [07:00 ▼]           │
│ Closing Time:   [22:00 ▼]           │
│ Auto Session    [4 hours ▼]         │
│ Expiry:                              │
│ Max Orders      [50_____]           │
│ Per Table/Day:                       │
│ Enable Customer [✓] Yes             │
│ Registration:                        │
└──────────────────────────────────────┘

[Save All Settings] button at bottom

PAGE 1.5: ACTIVITY LOGS
Header Title: "Activity Logs"

- FILTERS:
  [Date Range: Today ▼] [User: All ▼] [Action: All ▼] [Severity: All ▼]

- LOGS TABLE:
┌──────┬──────────┬──────────┬──────────────────────────┬──────────┬──────────┐
│ Time │ User     │ Action   │ Details                  │ Entity   │ Severity │
├──────┼──────────┼──────────┼──────────────────────────┼──────────┼──────────┤
│09:45 │Patrick   │PAYMENT   │Processed payment RWF     │Order #057│ ℹ️ Info  │
│      │Cashier   │RECEIVED  │34,860 via MoMo for Tbl A5│          │          │
├──────┼──────────┼──────────┼──────────────────────────┼──────────┼──────────┤
│09:30 │Alice     │STATUS    │Marked items as Ready     │Order #057│ ℹ️ Info  │
│      │Kitchen   │CHANGE    │2 items for Table A5      │          │          │
├──────┼──────────┼──────────┼──────────────────────────┼──────────┼──────────┤
│09:15 │Marie     │APPROVAL  │Approved void request     │Change    │ ⚠️ Warning│
│      │Manager   │          │for Table B2 (RWF 5,000)  │Req #012  │          │
├──────┼──────────┼──────────┼──────────────────────────┼──────────┼──────────┤
│09:00 │Jean B.   │LOGIN     │Super Admin logged in     │User #1   │ ℹ️ Info  │
│      │Super Adm │          │from IP 192.168.1.100     │          │          │
└──────┴──────────┴──────────┴──────────────────────────┴──────────┴──────────┘

- [Export Logs] [Clear Filters] buttons

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ROLE 2: MANAGER (Operational Supervisor)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SIDEBAR NAVIGATION ITEMS:
┌────────────────────────────┐
│  📊  Dashboard             │ (active)
│  🍽️  Menu Management       │
│  📋  Orders                │
│  🪑  Table Status           │
│  💰  Bills & Payments       │
│  📈  Reports                │
│  🔔  Notifications          │
│                            │
│  ────────────────────────  │
│  👤 Marie Claire           │
│     Manager                │
│     [Logout]               │
└────────────────────────────┘

PAGE 2.1: MANAGER DASHBOARD
Header Title: "Manager Dashboard"
Content:
- "Bonjour, Marie Claire 👋" greeting
- Date and shift info: "Morning Shift · 07:00 - 15:00"

- STATS ROW (4 cards):
  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
  │ Active       │ │ Pending      │ │ Ready to     │ │ Revenue      │
  │ Tables       │ │ Orders       │ │ Serve        │ │ Today        │
  │ 12/20       │ │ 8            │ │ 3            │ │ RWF 425,800 │
  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘

- REAL-TIME FLOOR PLAN (interactive):
  Same floor plan as Super Admin but focused on active orders
  Click table to see order details and assign waiter

- RECENT ORDER REQUESTS:
  Cards showing orders needing attention

PAGE 2.2: MENU MANAGEMENT (⭐ KEY PAGE)
Header Title: "Menu Management"
Top Right: [+ Add Category] [+ Add Item]

- CATEGORY TABS (horizontal):
  [All] [🥐 Croissant] [🧇 Waffle] [☕ Coffee] [🍦 Ice Cream] [🥤 Drinks]

- MENU ITEMS GRID (3 columns):
  ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐
  │ [Image: Croissant]   │ │ [Image: Waffle]      │ │ [Image: Coffee]      │
  │                      │ │                      │ │                      │
  │ Almond Brown Sugar   │ │ Belgian Waffle       │ │ Rwandan Single Origin│
  │ Croissant            │ │ with Berries         │ │ Coffee               │
  │                      │ │                      │ │                      │
  │ RWF 12,980           │ │ RWF 8,500            │ │ RWF 3,500            │
  │ 🏷️ Kitchen           │ │ 🏷️ Kitchen           │ │ 🏷️ Bar               │
  │ 🟢 Available         │ │ 🟢 Available         │ │ 🟢 Available         │
  │ 🥬 Vegetarian        │ │ 🥬 Vegetarian        │ │ 🌱 Vegan             │
  │                      │ │                      │ │                      │
  │ [Edit] [Toggle] [🗑] │ │ [Edit] [Toggle] [🗑] │ │ [Edit] [Toggle] [🗑] │
  └──────────────────────┘ └──────────────────────┘ └──────────────────────┘

ADD/EDIT ITEM MODAL:
┌──────────────────────────────────────────────┐
│  Add New Menu Item                      [✕]  │
├──────────────────────────────────────────────┤
│                                              │
│  Item Name:    [________________________]    │
│  Category:     [Select Category ▼]           │
│  Description:  [________________________]    │
│                [________________________]    │
│  Price (RWF):  [__________]                  │
│  Discount %:   [__________] (optional)       │
│                                              │
│  Image:        [📷 Upload Image]             │
│                [🖼 Preview area]              │
│                                              │
│  Destination:  ○ Kitchen  ○ Bar              │
│                                              │
│  Dietary Tags: ☐ Vegetarian                  │
│                ☐ Vegan                       │
│                ☐ Gluten-Free                 │
│                                              │
│  Allergens:    [Nuts, Dairy, Eggs________]  │
│                                              │
│  Display Order:[0_____]                      │
│  Available:    [●] Yes  ○ No                 │
│                                              │
│  [Cancel]                    [Save Item]     │
└──────────────────────────────────────────────┘

PAGE 2.3: ORDERS MANAGEMENT
Header Title: "Orders"
- FILTERS: [Status: All ▼] [Table: All ▼] [Date: Today ▼]

- ORDERS TABLE:
┌────────┬────────┬──────────┬──────────────┬──────────┬────────┐
│ Order# │ Table  │ Items    │ Total        │ Status   │ Action │
├────────┼────────┼──────────┼──────────────┼──────────┼────────┤
│ #057   │ A5     │ 3 items  │ RWF 34,860   │ Preparing│ [View] │
│ #056   │ B2     │ 2 items  │ RWF 22,500   │ Ready    │ [View] │
│ #055   │ A3     │ 1 item   │ RWF 18,900   │ Completed│ [View] │
│ #054   │ C1     │ 4 items  │ RWF 45,200   │ Placed   │ [View] │
└────────┴────────┴──────────┴──────────────┴──────────┴────────┘

PAGE 2.4: BILLS & PAYMENTS
Header Title: "Bills & Payments"
- TABS: [Pending] [Paid Today] [All Bills]

- PENDING BILLS CARDS:
  ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
  │ 🧾 Bill #B-057      │ │ 🧾 Bill #B-058      │ │ 🧾 Bill #B-059      │
  │ Table: A5           │ │ Table: A2           │ │ Table: B3           │
  │ Order: #057         │ │ Order: #058         │ │ Order: #059         │
  │                     │ │                     │ │                     │
  │ Total:              │ │ Total:              │ │ Total:              │
  │ RWF 34,860          │ │ RWF 18,500          │ │ RWF 22,000          │
  │                     │ │                     │ │                     │
  │ Waiting: 5 min      │ │ Waiting: 12 min     │ │ Waiting: 2 min      │
  │ [View Details]      │ │ [View Details]      │ │ [View Details]      │
  └─────────────────────┘ └─────────────────────┘ └─────────────────────┘

PAGE 2.5: REPORTS
Header Title: "Reports & Analytics"
- Date range picker
- Sales chart (bar/line)
- Top selling items
- Revenue by category (pie chart)
- Export buttons [PDF] [Excel] [CSV]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ROLE 3: CASHIER (Payment Handler)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAYOUT: Cashier uses larger screen (Tablet 1024px or Desktop)
Simple sidebar, focused on payment processing

SIDEBAR NAVIGATION ITEMS:
┌────────────────────────────┐
│  💰  Pending Bills          │ (active - shows count badge)
│  📋  Payment History        │
│  📊  Today's Summary        │
│  🔔  Notifications          │
│                            │
│  ────────────────────────  │
│  👤 Patrick                │
│     Cashier                │
│     [Logout]               │
└────────────────────────────┘

PAGE 3.1: CASHIER HOME - PENDING BILLS
Header Title: "Pending Bills for Payment"
Stats: Today's Total: RWF 425,800 | Cash: RWF 150,000 | MoMo: RWF 200,000 | Airtel: RWF 75,800

- BILLS QUEUE (Cards in grid, sorted by wait time):
  ┌──────────────────────────────┐ ┌──────────────────────────────┐
  │ 🧾 Bill #B-057               │ │ 🧾 Bill #B-058               │
  │ Table: A5 | Order: #057      │ │ Table: A2 | Order: #058      │
  │ ─────────────────────────── │ │ ─────────────────────────── │
  │ Items:                       │ │ Items:                       │
  │ • Almond Croissant x1        │ │ • Belgian Waffle x2          │
  │ • Smoke Tenderloin x1       │ │ • Coffee x1                  │
  │ • Berry Cream Croissant x1  │ │                              │
  │ ─────────────────────────── │ │ ─────────────────────────── │
  │ Subtotal: RWF 37,610         │ │ Subtotal: RWF 17,000         │
  │ Discount: -RWF 5,000         │ │ Tax (18%): +RWF 3,060        │
  │ Tax (18%): +RWF 2,250        │ │ ─────────────────────────── │
  │ ─────────────────────────── │ │ Total: RWF 20,060            │
  │ TOTAL: RWF 34,860            │ │                              │
  │ ─────────────────────────── │ │ ⏱ Waiting: 12 minutes        │
  │ ⏱ Waiting: 5 minutes        │ │                              │
  │                              │ │ [Process Payment]            │
  │ [Process Payment]            │ │                              │
  └──────────────────────────────┘ └──────────────────────────────┘

PAGE 3.2: PAYMENT PROCESSING SCREEN (Full page)
Header: "Process Payment - Bill #B-057 (Table A5)"

- SPLIT SCREEN LAYOUT (Two columns):

LEFT SIDE (Bill Summary):
┌──────────────────────────────────────┐
│  BILL SUMMARY                        │
│  ──────────────────────────────────  │
│  Items:                              │
│  1x Almond Brown Sugar Croissant     │
│     RWF 12,980                       │
│  1x Smoke Tenderloin Slice Croissant │
│     RWF 10,010                       │
│  1x Berry Whipped Cream Croissant   │
│     RWF 8,980                        │
│  ──────────────────────────────────  │
│  Subtotal:            RWF 31,970    │
│  Discount (12%):     -RWF 3,836     │
│  Subtotal after disc: RWF 28,134    │
│  Tax (18%):          +RWF 5,064     │
│  ──────────────────────────────────  │
│  GRAND TOTAL:         RWF 33,198    │
│                                      │
│  Customer: 3 guests at Table A5      │
└──────────────────────────────────────┘

RIGHT SIDE (Payment Methods):
┌──────────────────────────────────────┐
│  SELECT PAYMENT METHOD               │
│                                      │
│  ┌──────────────────────────────┐    │
│  │ 💵 CASH                      │    │
│  │    Pay with cash              │    │
│  └──────────────────────────────┘    │
│  ┌──────────────────────────────┐    │
│  │ 📱 MTN MoMo                  │    │
│  │    Pay with Mobile Money      │    │
│  └──────────────────────────────┘    │
│  ┌──────────────────────────────┐    │
│  │ 📱 Airtel Money              │    │
│  │    Pay with Airtel Money      │    │
│  └──────────────────────────────┘    │
│                                      │
│  ──────────────────────────────────  │
│  PAYMENT DETAILS:                    │
│                                      │
│  [Depends on selection above]        │
└──────────────────────────────────────┘

CASH PAYMENT VIEW (when Cash selected):
┌──────────────────────────────────────┐
│  CASH PAYMENT                        │
│                                      │
│  Amount Due: RWF 33,198              │
│                                      │
│  Amount Tendered:                    │
│  [_____________] RWF                 │
│                                      │
│  Quick Amounts:                      │
│  [RWF 33,198] [RWF 35,000]          │
│  [RWF 40,000] [RWF 50,000]          │
│                                      │
│  Change Due:      RWF 1,802          │
│  (Auto-calculated)                   │
│                                      │
│  Notes: [________________]           │
│                                      │
│  [Cancel]    [Confirm Cash Payment]  │
└──────────────────────────────────────┘

MOMO PAYMENT VIEW (when MoMo selected):
┌──────────────────────────────────────┐
│  MTN MOBILE MONEY PAYMENT            │
│                                      │
│  Amount to Charge: RWF 33,198        │
│                                      │
│  Customer Phone Number:              │
│  [+250] [7XX XXX XXX]               │
│                                      │
│  [Send Payment Request]              │
│                                      │
│  ── OR ──                            │
│                                      │
│  Transaction Reference:              │
│  [________________________]         │
│  (Customer provides from their phone)│
│                                      │
│  [Verify Transaction]                │
│                                      │
│  Status: ⏳ Waiting for confirmation │
│  → 🟢 Transaction Verified!          │
│                                      │
│  [Cancel]       [Confirm Payment]    │
└──────────────────────────────────────┘

AIRTELL MONEY VIEW: (Same structure as MoMo but Airtel branded in red)

PAYMENT SUCCESS OVERLAY:
┌──────────────────────────────────────┐
│                                      │
│         ✅ Payment Successful!       │
│                                      │
│    ┌──────────────────────┐          │
│    │   RECEIPT PREVIEW    │          │
│    │                      │          │
│    │ La Ta Bhore          │          │
│    │ KG 123 St, Kigali    │          │
│    │ ─────────────────── │          │
│    │ Receipt: #R-057      │          │
│    │ Date: May 1, 2026    │          │
│    │ Time: 09:45 AM       │          │
│    │ Table: A5            │          │
│    │ Order: #057          │          │
│    │ ─────────────────── │          │
│    │ Total: RWF 33,198    │          │
│    │ Method: MoMo         │          │
│    │ Status: PAID         │          │
│    │ ─────────────────── │          │
│    │ Thank you!           │          │
│    └──────────────────────┘          │
│                                      │
│  [Print Receipt]  [Send via SMS]     │
│  [Done - Back to Bills]              │
└──────────────────────────────────────┘

PAGE 3.3: PAYMENT HISTORY
Header Title: "Payment History"
- DATE FILTER: [Today ▼]
- SEARCH: [🔍 Search by Order # or Table]

- PAYMENTS TABLE:
┌──────┬──────────┬────────┬──────────────┬──────────┬──────────┬────────┐
│ Time │ Receipt# │ Order  │ Table        │ Amount   │ Method   │ Status │
├──────┼──────────┼────────┼──────────────┼──────────┼──────────┼────────┤
│09:45 │ R-057    │ #057   │ A5           │ 33,198   │ MoMo     │ ✅     │
│09:30 │ R-056    │ #056   │ B2           │ 22,500   │ Cash     │ ✅     │
│09:15 │ R-055    │ #055   │ A3           │ 18,900   │ Airtel   │ ✅     │
│09:00 │ R-054    │ #054   │ C1           │ 45,200   │ Cash     │ ✅     │
└──────┴──────────┴────────┴──────────────┴──────────┴──────────┴────────┘

- Daily Totals Below:
  Cash: RWF 150,000 | MoMo: RWF 200,000 | Airtel: RWF 75,800
  Total: RWF 425,800 | Transactions: 24

PAGE 3.4: TODAY'S SUMMARY
Header Title: "Today's Summary - May 1, 2026"
- Large stats cards
- Payment breakdown pie chart
- Transaction timeline

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ROLE 4: KITCHEN STAFF (Food Preparer)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAYOUT: Kitchen Display System (KDS) - Tablet Landscape 1024px
Dark theme for kitchen environment visibility!
Full screen, no sidebar (or minimal sidebar)

COLORS (Dark Theme):
- Background: #1A1A1A
- Card BG: #2D2D2D
- Text: #FFFFFF
- Text Secondary: #B0B0B0
- Accent: #FF8C00 (Orange)
- Success: #4CAF50
- Danger: #EF5350
- Border: #404040
- Timer Warning: #FF5252 (when order exceeds time)

HEADER BAR (64px, #252525):
- Left: "🔪 Kitchen Display" title
- Center: Digital clock showing "09:45:32 AM" (real-time)
- Station badge: "KITCHEN STATION" in orange badge
- Right: Pending count badge "5 NEW" in orange, speaker icon, settings

PAGE 4.1: KITCHEN DISPLAY SYSTEM (KDS)

- THREE COLUMN KANBAN BOARD LAYOUT:

┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  NEW ORDERS     │ │  PREPARING      │ │  READY          │
│  (3)            │ │  (4)            │ │  (2)            │
├─────────────────┤ ├─────────────────┤ ├─────────────────┤

│ ┌─────────────┐ │ │ ┌─────────────┐ │ │ ┌─────────────┐ │
│ │ ORDER #057  │ │ │ │ ORDER #056  │ │ │ │ ORDER #053  │ │
│ │ Table: A5   │ │ │ │ Table: B2   │ │ │ │ Table: C1   │ │
│ │ ⏱ 05:32 ago │ │ │ │ ⏱ 12:15 ago │ │ │ │ ⏱ 22:40 ago │ │
│ │             │ │ │ │             │ │ │ │             │ │
│ │ ITEMS:      │ │ │ │ ITEMS:      │ │ │ │ ITEMS:      │ │
│ │ □ 1x Almond │ │ │ │ □ 2x Belgian│ │ │ │ ☑ 1x Chicken│ │
│ │   Croissant │ │ │ │   Waffle    │ │ │ │   Sandwich  │ │
│ │ □ 1x Smoke  │ │ │ │             │ │ │ │             │ │
│ │   Tenderloin│ │ │ │ NOTES:      │ │ │ │ ✓ READY!    │ │
│ │ □ 1x Berry  │ │ │ │ Extra syrup │ │ │ │ [Served]    │ │
│ │   Cream     │ │ │ │             │ │ │ └─────────────┘ │
│ │             │ │ │ │ [Mark Ready]│ │ │                 │
│ │ ALLERGENS:  │ │ │ └─────────────┘ │ │ ┌─────────────┐ │
│ │ ⚠️ Nuts!    │ │ │                 │ │ │ ORDER #052  │ │
│ │ ⚠️ Dairy!   │ │ │ ┌─────────────┐ │ │ │ Table: A1   │ │
│ │             │ │ │ │ ORDER #055  │ │ │ │ ⏱ 28:15 ago │ │
│ │ [Start All] │ │ │ │ Table: A3   │ │ │ │             │ │
│ │ [Start      │ │ │ │ ⏱ 15:30 ago │ │ │ │ ☑ 2x Eggs   │ │
│ │  Individual]│ │ │ │             │ │ │ │   Benedict  │ │
│ └─────────────┘ │ │ │ □ 1x Omelet │ │ │ │             │ │
│                 │ │ │             │ │ │ │ ✓ READY!    │ │
│ ┌─────────────┐ │ │ │ [Mark Ready]│ │ │ │ [Served]    │ │
│ │ ORDER #058  │ │ │ └─────────────┘ │ │ └─────────────┘ │
│ │ Table: B1   │ │ │                 │ │                 │
│ │ ⏱ 02:10 ago │ │ │ ┌─────────────┐ │ │                 │
│ │             │ │ │ │ ORDER #054  │ │ │                 │
│ │ ITEMS:      │ │ │ │ Table: B3   │ │ │                 │
│ │ □ 3x Pancake│ │ │ │ ⏱ 18:45 ago │ │ │                 │
│ │ □ 1x Eggs   │ │ │ │             │ │ │                 │
│ │             │ │ │ │ □ 1x Burger │ │ │                 │
│ │ [Start All] │ │ │ │ □ 1x Fries  │ │ │                 │
│ └─────────────┘ │ │ │             │ │ │                 │
│                 │ │ │ [Mark Ready]│ │ │                 │
│ ┌─────────────┐ │ │ └─────────────┘ │ │                 │
│ │ ORDER #059  │ │ │                 │ │                 │
│ │ Table: A4   │ │ │                 │ │                 │
│ │ ⏱ 01:05 ago │ │ │                 │ │                 │
│ │             │ │ │                 │ │                 │
│ │ □ 1x Salad  │ │ │                 │ │                 │
│ │ □ 1x Soup   │ │ │                 │ │                 │
│ │             │ │ │                 │ │                 │
│ │ [Start All] │ │ │                 │ │                 │
│ └─────────────┘ │ │                 │ │                 │
└─────────────────┘ └─────────────────┘ └─────────────────┘

ORDER CARD DETAILS:
- Order number LARGE and BOLD
- Table number clearly visible
- TIMER showing time since order placed (RED if >15 min)
- Items listed with checkboxes
- Allergen warnings in RED if present
- Special notes highlighted in orange
- "Start All" button (orange) → moves card to PREPARING column
- "Mark Ready" button (green) → moves card to READY column
- Cards in NEW column have subtle red border that intensifies with time

BOTTOM BAR:
┌──────────────────────────────────────────────────────────────┐
│ ✅ Completed Today: 42  │ ⏱ Avg Prep Time: 12 min  │ [🔊 Sound] │
└──────────────────────────────────────────────────────────────┘

PAGE 4.2: BAR STATION VIEW (Same layout, different color)
- Badge: "🍸 BAR STATION" in blue
- Only shows drink orders
- Same kanban layout

PAGE 4.3: ITEM UNAVAILABLE (86) MODAL
┌──────────────────────────────────────┐
│  Mark Item as Unavailable (86)       │
├──────────────────────────────────────┤
│                                      │
│  Select Item:                        │
│  [Search menu item... ▼]             │
│                                      │
│  Selected: Almond Brown Sugar        │
│            Croissant                 │
│                                      │
│  Reason: [Out of almonds today_]    │
│                                      │
│  Notify Manager: [✓] Yes            │
│                                      │
│  ⚠️ This will hide item from menu    │
│     immediately for all customers    │
│                                      │
│  [Cancel]      [Mark Unavailable]    │
└──────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ROLE 5: WAITER (Table Manager)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAYOUT: Mobile-first (Tablet 768px or Mobile 390px)
Waiter carries tablet or uses phone

MOBILE LAYOUT (390px width):
┌──────────────────────────────┐
│  HEADER (56px)               │
│  "👤 David"  [🔔] [⋮]       │
├──────────────────────────────┤
│                              │
│  MAIN CONTENT                │
│  (scrollable)                │
│                              │
├──────────────────────────────┤
│  BOTTOM NAV (64px)           │
│  🪑Tables 📋Orders 🔔Alerts 👤│
└──────────────────────────────┘

PAGE 5.1: WAITER HOME - TABLE OVERVIEW
Header: "My Tables" with waiter name "David"

- STATS ROW (horizontal scroll):
  [🟢 Available: 6] [🟠 My Tables: 5] [🔔 Ready: 3] [💰 Pay: 1]

- TABLE GRID (2 columns, large cards):
  ┌──────────────────┐ ┌──────────────────┐
  │                  │ │                  │
  │    TABLE A2      │ │    TABLE A5      │
  │    ┌────────┐    │ │    ┌────────┐    │
  │    │  🟠    │    │ │    │  🔔    │    │
  │    │ Active │    │ │    │ Ready! │    │
  │    └────────┘    │ │    └────────┘    │
  │                  │ │                  │
  │  👥 3 guests     │ │  👥 4 guests     │
  │  📋 Order #058   │ │  📋 Order #057   │
  │  ⏱ 25 min ago   │ │  ⏱ 35 min ago   │
  │  🟠 Preparing    │ │  🔵 Ready to     │
  │                  │ │     Serve!       │
  │  [View Order]    │ │  [Serve Now]     │
  └──────────────────┘ └──────────────────┘

  ┌──────────────────┐ ┌──────────────────┐
  │    TABLE B2      │ │    TABLE A3      │
  │    ┌────────┐    │ │    ┌────────┐    │
  │    │  💰    │    │ │    │  🟠    │    │
  │    │ Pay    │    │ │    │ Active │    │
  │    └────────┘    │ │    └────────┘    │
  │                  │ │                  │
  │  👥 2 guests     │ │  👥 2 guests     │
  │  📋 Order #056   │ │  📋 Order #055   │
  │  💰 Ready to Pay │ │  ⏱ 45 min ago   │
  │  RWF 22,500      │ │  ✅ All Served   │
  │                  │ │                  │
  │  [View Bill]     │ │  [View Order]    │
  └──────────────────┘ └──────────────────┘

COLOR CODING:
- 🟢 Green border: Available/Empty table
- 🟠 Orange border: Occupied, order in progress
- 🔵 Blue border + bell: Order ready to serve
- 💰 Gold border + money: Customer wants to pay
- 🔴 Red border: Customer called waiter / needs attention

PAGE 5.2: TABLE DETAIL VIEW
Header: "← Table A5" with status badge "Ready to Serve"

- SESSION INFO:
  ┌──────────────────────────────────────┐
  │ 👥 3 Guests  │ ⏱ Active 35 min       │
  │ Session #128 │ Started 09:10 AM       │
  └──────────────────────────────────────┘

- ACTIVE ORDER:
  ┌──────────────────────────────────────┐
  │  ORDER #057                          │
  │  Status: 🔵 Ready to Serve           │
  │  ──────────────────────────────────  │
  │  ☑ 1x Almond Brown Sugar Croissant   │
  │     Status: ✅ Ready                  │
  │     [Mark Served] [View Details]      │
  │                                      │
  │  ☑ 1x Smoke Tenderloin Croissant     │
  │     Status: ✅ Ready                  │
  │     [Mark Served] [View Details]      │
  │                                      │
  │  ☑ 1x Berry Whipped Cream Croissant  │
  │     Status: ✅ Ready                  │
  │     [Mark Served] [View Details]      │
  │  ──────────────────────────────────  │
  │  Total: RWF 34,860                   │
  └──────────────────────────────────────┘

- QUICK ACTIONS:
  [Mark All Served] [Call Manager] [View Bill]

- ORDER ACTIVITY:
  ┌──────────────────────────────────────┐
  │ 09:40 - Kitchen: All items ready     │
  │ 09:25 - Kitchen: Preparing started   │
  │ 09:15 - System: Order confirmed      │
  │ 09:10 - Customer: Order placed       │
  └──────────────────────────────────────┘

PAGE 5.3: ORDERS LIST
Header: "All My Orders"
- FILTER: [Active] [Ready] [Completed]

- ORDER CARDS (same as table view but list format)
  Each card shows: Order #, Table, Items count, Total, Status, Time

PAGE 5.4: NOTIFICATIONS
Header: "Notifications"
- TABS: [All] [Orders] [Ready] [Waiter Calls]

- NOTIFICATION CARDS:
  ┌──────────────────────────────────────┐
  │ 🔔 NOW    Table A5 - Order Ready!    │
  │           All 3 items ready to serve │
  │           [Go to Table →]            │
  ├──────────────────────────────────────┤
  │ 🛎️ 5 min  Table B2 - Customer wants  │
  │    ago    to pay bill                │
  │           Amount: RWF 22,500         │
  │           [View Bill →]              │
  ├──────────────────────────────────────┤
  │ 👋 12 min Table A3 - Waiter called   │
  │    ago    "More water please"        │
  │           [Dismiss] [Resolved]       │
  └──────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ROLE 6: CUSTOMER PWA (Mobile Browser)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAYOUT: Mobile only (390x844)
Full screen, no sidebar, no bottom nav
Just content + floating cart button

PAGE 6.1: QR SCAN LANDING
(Already designed in previous prompt - use that)

PAGE 6.2: MENU BROWSER
(Already designed in previous prompt - use that)

PAGE 6.3: CART VIEW
Header: "← Your Order" with Table A5 badge
- List of items with quantity controls
- Special instructions text area
- Subtotal, Discount, Tax, Total breakdown
- "Place Order - RWF 34,860" button

PAGE 6.4: ORDER TRACKING
Header: "← Order #057"
- Status stepper: Confirmed → Preparing → Ready → Served
- Estimated time
- Items list
- "Call Waiter" button
- "View Bill" button

PAGE 6.5: BILL VIEW
Header: "← Your Bill"
- Itemized list
- Totals breakdown
- "Pay Now" button

═══════════════════════════════════════════════════════════════
GENERATION INSTRUCTIONS
═══════════════════════════════════════════════════════════════

Generate this system in this order:

1. FIRST: Super Admin Dashboard + all 5 sub-pages
2. SECOND: Manager Dashboard + all 5 sub-pages  
3. THIRD: Cashier Dashboard + all 4 sub-pages
4. FOURTH: Kitchen KDS + Bar Station
5. FIFTH: Waiter Mobile Dashboard + all 4 sub-pages
6. SIXTH: Customer Menu Browser (use previous design)

For each role:
- Generate the main dashboard first
- Then generate each sub-page
- Include the sidebar with correct navigation items
- Show realistic mock data
- Use RWF currency throughout
- Apply warm bakery aesthetic for admin/staff
- Use dark theme for kitchen KDS only

TOTAL SCREENS TO GENERATE:
- Super Admin: 5 pages
- Manager: 5 pages
- Cashier: 4 pages  
- Kitchen: 2 pages (KDS + Bar)
- Waiter: 4 pages
- Customer: 4 pages
────────────────────
TOTAL: ~24 screens

═══════════════════════════════════════════════════════════════
END OF MASTER PROMPT
═══════════════════════════════════════════════════════════════