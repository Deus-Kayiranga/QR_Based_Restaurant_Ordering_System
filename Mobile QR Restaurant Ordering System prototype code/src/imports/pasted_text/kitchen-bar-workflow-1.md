can u design this workflow KITCHEN & BAR STAFF - COMPLETE WORKFLOW
Who Are They?
Staff Type	Station	What They Prepare
Kitchen Staff	Kitchen	Food items (Croissants, Waffles, Burgers, Salads, etc.)
Bar Staff	Bar	Drinks (Coffee, Tea, Juices, Cocktails, etc.)PART 1: HOW ITEMS ARE ROUTED TO KITCHEN vs BAR
When the Manager creates a menu item, they assign a destination_station:menu_items table:
┌──────────┬──────────────────────┬──────────┬─────────────────────┐
│ item_id  │ item_name            │ price    │ destination_station │
├──────────┼──────────────────────┼──────────┼─────────────────────┤
│ 1        │ Almond Croissant     │ 12,980   │ kitchen             │
│ 2        │ Smoke Tenderloin     │ 10,010   │ kitchen             │
│ 3        │ Belgian Waffle       │ 8,500    │ kitchen             │
│ 4        │ Chicken Sandwich     │ 9,800    │ kitchen             │
│ 5        │ Rwandan Coffee       │ 3,500    │ bar                 │
│ 6        │ Fresh Juice          │ 2,800    │ bar                 │
│ 7        │ Iced Latte           │ 4,200    │ bar                 │
│ 8        │ Mango Smoothie       │ 4,500    │ bar                 │
└──────────┴──────────────────────┴──────────┴─────────────────────┘When a customer places an order, the system automatically splits it:ORDER #057 from Table A5:

ITEMS ORDERED:
┌─────────────────────────────────────────────────┐
│  1x Almond Croissant (RWF 12,980)               │
│  1x Smoke Tenderloin (RWF 10,010)               │
│  1x Berry Cream Croissant (RWF 8,980)           │
│  2x Rwandan Coffee (RWF 7,000)                  │
│  1x Fresh Juice (RWF 2,800)                     │
└─────────────────────────────────────────────────┘

AUTOMATIC ROUTING:
┌─────────────────────────┐  ┌─────────────────────────┐
│  KITCHEN DISPLAY        │  │  BAR DISPLAY            │
│                         │  │                         │
│  📋 ORDER #057          │  │  🍸 ORDER #057          │
│  Table: A5              │  │  Table: A5              │
│                         │  │                         │
│  • Almond Croissant x1  │  │  • Rwandan Coffee x2    │
│  • Smoke Tenderloin x1  │  │  • Fresh Juice x1       │
│  • Berry Cream x1       │  │                         │
│                         │  │                         │
│  Total items: 3         │  │  Total items: 3         │
└─────────────────────────┘  └─────────────────────────┘PART 2: KITCHEN STAFF ACTIVITIES (Step by Step)
Activity 1: LOGIN & SEE KITCHEN DISPLAY1. Kitchen staff arrives at work
2. Opens /computer at kitchen station
3. Logs in with their credentials
4. System shows KITCHEN DISPLAY only (no food items from bar)
5. Sees all pending, preparing, and ready ordersActivity 2: VIEW NEW ORDERS QUEUEKITCHEN DISPLAY SCREEN:

┌──────────────────────────────────────────────────────────────┐
│  🔪 KITCHEN STATION          09:45 AM       5 NEW    [🔊]    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  [NEW]           [PREPARING]          [READY]                │
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐             │
│  │ ORDER #057 │  │ ORDER #056 │  │ ORDER #053 │             │
│  │ Table A5   │  │ Table B2   │  │ Table C1   │             │
│  │ ⏱ 2 min   │  │ ⏱ 15 min  │  │ ✅ Ready   │             │
│  │            │  │            │  │            │             │
│  │ 3 items:   │  │ 2 items:   │  │ 1 item:    │             │
│  │ □ Almond   │  │ □ Waffle x2│  │ ✓ Sandwich │             │
│  │ □ Smoke    │  │            │  │            │             │
│  │ □ Berry    │  │            │  │            │             │
│  │            │  │            │  │            │             │
│  │ [START]    │  │ [READY]    │  │ [SERVED?]  │             │
│  └────────────┘  └────────────┘  └────────────┘             │
│                                                              │
│  ┌────────────┐  ┌────────────┐                              │
│  │ ORDER #058 │  │ ORDER #055 │                              │
│  │ Table B1   │  │ Table A3   │                              │
│  │ ⏱ 1 min   │  │ ⏱ 18 min  │                              │
│  │            │  │            │                              │
│  │ 2 items:   │  │ 1 item:    │                              │
│  │ □ Pancake  │  │ □ Omelette │                              │
│  │ □ Eggs     │  │            │                              │
│  │            │  │            │                              │
│  │ [START]    │  │ [READY]    │                              │
│  └────────────┘  └────────────┘                              │
│                                                              │
└──────────────────────────────────────────────────────────────┘Activity 3: START PREPARING AN ORDERKitchen staff clicks [START] on ORDER #057:

1. Order moves from NEW → PREPARING column
2. Timer changes from "Order placed" to "Preparing for: 0:00"
3. Kitchen staff sees all 3 items listed
4. Allergen warnings displayed prominently:
   ⚠️ Almond Croissant - Contains: Nuts, Dairy
   ⚠️ Smoke Tenderloin - Contains: Gluten, Dairy
   ⚠️ Berry Cream - Contains: Dairy, Gluten
5. Any special notes shown:
   "Customer note: Extra almonds on croissant please"Activity 4: MARK ITEMS AS READYWhen all items for ORDER #057 are cooked:

1. Kitchen staff clicks [MARK READY]
2. Order moves from PREPARING → READY column
3. System automatically sends NOTIFICATION to:
   ┌──────────────────────────────────────────────┐
   │  📱 NOTIFICATION → WAITER (David):            │
   │  "Table A5 - Order #057 is ready!             │
   │   3 items ready to serve"                     │
   │                                              │
   │  📱 NOTIFICATION → CUSTOMER (Table A5):       │
   │  "Your order is ready! Waiter will serve      │
   │   shortly"                                    │
   └──────────────────────────────────────────────┘Activity 5: KNOW TOTAL ITEMS PREPAREDKITCHEN STAFF sees a counter at bottom of screen:

┌──────────────────────────────────────────────────────────────┐
│  📊 TODAY'S STATS                                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ Orders   │ │ Items    │ │ Completed│ │ Pending  │        │
│  │ Received │ │ Prepared │ │ Ready ✅ │ │ Remaining│        │
│  │         │ │         │ │         │ │         │        │
│  │   47     │ │   89     │ │   72     │ │   17     │        │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
│                                                              │
│  ⏱ Average Prep Time: 12 minutes                            │
│  🕐 Busiest Hour: 12:00 PM - 1:00 PM (23 items)              │
└──────────────────────────────────────────────────────────────┘PART 3: BAR STAFF ACTIVITIES (Same Flow, Different Items)BAR DISPLAY SCREEN (same layout, different items):

┌──────────────────────────────────────────────────────────────┐
│  🍸 BAR STATION              09:45 AM        3 NEW    [🔊]   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  [NEW]           [PREPARING]          [READY]                │
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐             │
│  │ ORDER #057 │  │ ORDER #058 │  │ ORDER #055 │             │
│  │ Table A5   │  │ Table B1   │  │ Table A3   │             │
│  │ ⏱ 3 min   │  │ ⏱ 8 min   │  │ ✅ Ready   │             │
│  │            │  │            │  │            │             │
│  │ 3 items:   │  │ 2 items:   │  │ 2 items:   │             │
│  │ □ Coffee x2│  │ □ Juice x2 │  │ ✓ Latte x2 │             │
│  │ □ Juice x1 │  │            │  │            │             │
│  │            │  │            │  │            │             │
│  │ [START]    │  │ [READY]    │  │ [SERVED?]  │             │
│  └────────────┘  └────────────┘  └────────────┘             │
│                                                              │
│  ┌────────────┐                                              │
│  │ ORDER #059 │                                              │
│  │ Table A4   │                                              │
│  │ ⏱ 1 min   │                                              │
│  │            │                                              │
│  │ 1 item:    │                                              │
│  │ □ Smoothie │                                              │
│  │            │                                              │
│  │ [START]    │                                              │
│  └────────────┘                                              │
│                                                              │
│  📊 TODAY: 34 Orders | 56 Drinks | 48 Ready | 8 Pending      │
└──────────────────────────────────────────────────────────────┘PART 4: HOW KITCHEN/BAR STAFF KNOW TOTAL ITEMS
Method 1: Real-Time Dashboard Counter
The KDS screen always shows live counters at the bottom:┌──────────────────────────────────────────────────────────────┐
│  BOTTOM STATUS BAR (always visible)                          │
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐             │
│  │ 📥 RECEIVED │  │ ✅ COMPLETED│  │ ⏳ PENDING  │             │
│  │  Today      │  │  Today     │  │  Now       │             │
│  │   47        │  │   42       │  │   5        │             │
│  └────────────┘  └────────────┘  └────────────┘             │
│                                                              │
│  🕐 Current Avg Prep Time: 12 min                            │
└──────────────────────────────────────────────────────────────┘Method 2: Order History View
Kitchen staff can tap "History" tab to see all completed orders:ORDER HISTORY - KITCHEN (Today, May 1, 2026):

┌────────┬────────┬──────────────────────────────┬──────────┬──────────┐
│ Order# │ Table  │ Items Prepared                │ Time     │ Status   │
├────────┼────────┼──────────────────────────────┼──────────┼──────────┤
│ #057   │ A5     │ 3 items (Croissant x3)       │ 09:45 AM │ ✅ Ready │
│ #056   │ B2     │ 2 items (Waffle x2)          │ 09:30 AM │ ✅ Ready │
│ #055   │ A3     │ 1 item (Omelette)            │ 09:15 AM │ ✅ Ready │
│ #054   │ C1     │ 4 items (Burger, Fries...)   │ 09:00 AM │ ✅ Ready │
│ #053   │ A1     │ 2 items (Salad, Soup)        │ 08:45 AM │ ✅ Ready │
│ #052   │ B3     │ 3 items (Pancakes...)        │ 08:30 AM │ ✅ Ready │
├────────┴────────┴──────────────────────────────┴──────────┴──────────┤
│  TOTAL TODAY: 42 orders completed | 89 items prepared                 │
└──────────────────────────────────────────────────────────────────────┘Method 3: Item-Specific Count
Kitchen can see which items are most ordered:POPULAR ITEMS TODAY - KITCHEN:

┌──────────────────────────────────────────────────────────────┐
│  MOST PREPARED ITEMS TODAY                                   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │ 1. Almond Brown Sugar Croissant     ████████████  18 │    │
│  │ 2. Smoke Tenderloin Croissant       ██████████    15 │    │
│  │ 3. Belgian Waffle                   █████████     14 │    │
│  │ 4. Berry Whipped Cream Croissant    ████████      12 │    │
│  │ 5. Chicken Sandwich                 ██████        10 │    │
│  │ 6. Basic Croissant                  █████          8 │    │
│  │ 7. Omelette                         ████           7 │    │
│  │ 8. Pancakes                         ███            5 │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  TOTAL ITEMS PREPARED TODAY: 89                              │
└──────────────────────────────────────────────────────────────┘Method 4: Notification Alerts
Kitchen staff gets notified when:

New orders arrive (with sound alert)

Order has been waiting too long (>15 min, turns red)

Waiter marks items as served

Manager marks item as unavailable (86'd)NOTIFICATION CENTER - KITCHEN:

┌──────────────────────────────────────────────┐
│  🔔 NOTIFICATIONS                            │
│                                              │
│  🆕 09:45 - NEW ORDER #057                   │
│      Table A5 | 3 items                      │
│      Almond Croissant, Smoke Tenderloin...   │
│                                              │
│  ⚠️ 09:40 - ORDER #054 WAITING!              │
│      Table B3 | Prepping for 22 minutes      │
│      Please prioritize!                      │
│                                              │
│  ✅ 09:35 - ORDER #053 SERVED                │
│      Table C1 | Waiter marked as served      │
│                                              │
│  🚫 09:30 - ITEM UNAVAILABLE                 │
│      "Almond Croissant" marked as 86'd       │
│      by Manager Marie                        │
└──────────────────────────────────────────────┘PART 5: COMPLETE KITCHEN/BAR WORKFLOW SUMMARY┌─────────────────────────────────────────────────────────────────────┐
│                    KITCHEN/BAR STAFF WORKFLOW                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  STEP 1: LOGIN                                                       │
│  Staff logs in → System shows only their station (Kitchen OR Bar)   │
│                                                                      │
│  STEP 2: MONITOR NEW ORDERS                                         │
│  Orders auto-appear in "NEW" column                                 │
│  Sound alert plays for each new order                               │
│  Timer starts counting immediately                                  │
│                                                                      │
│  STEP 3: REVIEW ORDER DETAILS                                       │
│  See all items, quantities, customizations, allergens               │
│  See special notes from customers                                   │
│  See table number for coordination                                  │
│                                                                      │
│  STEP 4: START PREPARING                                            │
│  Click [START] or [START ALL]                                       │
│  Order moves to "PREPARING" column                                  │
│  Timer shows how long it's been preparing                           │
│                                                                      │
│  STEP 5: COMPLETE & MARK READY                                      │
│  When all items cooked/made, click [MARK READY]                     │
│  Order moves to "READY" column                                      │
│  AUTOMATIC NOTIFICATION sent to:                                    │
│    → Waiter: "Table A5 order ready"                                 │
│    → Customer: "Your order is ready!"                               │
│                                                                      │
│  STEP 6: WAITER PICKS UP & SERVES                                   │
│  Waiter sees notification, collects food/drinks                     │
│  Waiter marks items as "Served"                                     │
│  Order disappears from READY column                                 │
│  Counter updates: "Completed Today: +1"                             │
│                                                                      │
│  STEP 7: TRACK STATS                                                │
│  Bottom bar shows live counters:                                    │
│  • Orders Received Today                                            │
│  • Items Prepared Today                                             │
│  • Currently Pending                                                │
│  • Average Prep Time                                                │
│                                                                      │
│  STEP 8: HANDLE EXCEPTIONS                                          │
│  • Item out of stock → Mark as "86'd" (unavailable)                │
│  • Order taking too long → System alerts with red warning          │
│  • Special request → Coordinate with waiter via notification        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘This is the complete Kitchen/Bar Staff system. They always know:

How many orders they have (total counter)

How many items they've prepared (completed counter)

What's pending (items still in NEW or PREPARING)

What's popular (helps with prep/stock)

How fast they're working (average prep time)