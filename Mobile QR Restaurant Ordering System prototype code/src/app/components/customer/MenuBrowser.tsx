import { useState, useEffect, useRef } from "react";
import {
  ShoppingBag, Search, Heart, Star, Plus, Minus,
  Flame, Leaf, ChevronDown, X, ArrowRight,
  Coffee, Check, AlertCircle, Bell, Clock,
  UtensilsCrossed, Sparkles, Users, Wine,
  Sunrise, Salad, Fish, Pizza,
} from "lucide-react";
import { mockMenuItems, mockCategories, formatCurrency, MenuItem } from "../../../data/mockData";

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialNotes: string;
}

interface MenuBrowserProps {
  tableNumber: string;
  onViewCart: (items: CartItem[]) => void;
}

const COLORS = {
  primary: "#8B4513",
  primaryDark: "#6B3410",
  secondary: "#D2691E",
  bg: "#FFF8F0",
  card: "#FFFFFF",
  textPrimary: "#2C1810",
  textSecondary: "#8B7355",
  border: "#E8D5C4",
  success: "#228B22",
  gold: "#D4A017",
};

const CATEGORY_ICONS: Record<string, typeof Coffee> = {
  'Rwandan Specialties': Sparkles,
  'Burgers': UtensilsCrossed,
  'Grilled Meats': Flame,
  'Chicken Dishes': UtensilsCrossed,
  'Rice & Sides': UtensilsCrossed,
  'Salads & Vegetables': Leaf,
  'Bralirwa Beers': Coffee,
  'Soft Drinks': Coffee,
  'Fresh Juices': Coffee,
  'Breakfast': Sunrise,
  'Wines': Wine,
  'Chinese Cuisine': UtensilsCrossed,
  'Italian Cuisine': Pizza,
  'Japanese Cuisine': UtensilsCrossed,
  'Seafood': Fish,
  'Premium Meats': Flame,
  'Healthy Options': Salad,
};

const promos = [
  {
    id: 1,
    title: "Today's Special",
    sub: "Croissant Bundle",
    body: "Order any 3 croissants and save 20% — only RWF 8,500",
    cta: "Order Now",
    gradient: ["#8B4513", "#D2691E"],
  },
  {
    id: 2,
    title: "Breakfast Deal",
    sub: "Morning Combo",
    body: "Coffee + Croissant together — only RWF 4,500",
    cta: "Add Combo",
    gradient: ["#5C3317", "#8B4513"],
  },
  {
    id: 3,
    title: "Happy Hour",
    sub: "4PM — 6PM Daily",
    body: "All drinks 15% off during happy hour",
    cta: "See Drinks",
    gradient: ["#B85C2A", "#E07B00"],
  },
];

export function MenuBrowser({ tableNumber, onViewCart }: MenuBrowserProps) {
  const [activeCategory, setActiveCategory] = useState("Popular");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [favorites, setFavorites] = useState<Record<number, boolean>>({});
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [addedId, setAddedId] = useState<number | null>(null);
  const [quickView, setQuickView] = useState<MenuItem | null>(null);
  const [filterVeg, setFilterVeg] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [sortOpen, setSortOpen] = useState(false);
  const [promoIdx, setPromoIdx] = useState(0);
  const [guestCount, setGuestCount] = useState(2);
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const [waiterCalled, setWaiterCalled] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const allCategories = ["Popular", ...mockCategories.map(c => c.category_name)];

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = mockMenuItems.find(i => i.item_id === +id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const addToCart = (id: number) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setAddedId(id);
    setTimeout(() => setAddedId(null), 1800);
  };

  const removeFromCart = (id: number) => {
    setCart(prev => {
      const next = { ...prev };
      if (next[id] > 1) next[id]--;
      else delete next[id];
      return next;
    });
  };

  const toggleFav = (id: number) => setFavorites(prev => ({ ...prev, [id]: !prev[id] }));

  const handleCallWaiter = () => {
    setWaiterCalled(true);
    setTimeout(() => setWaiterCalled(false), 4000);
  };

  const handleViewCart = () => {
    const items: CartItem[] = Object.entries(cart)
      .map(([id, qty]) => {
        const item = mockMenuItems.find(i => i.item_id === +id);
        if (!item) return null;
        return { menuItem: item, quantity: qty, specialNotes: "" };
      })
      .filter((item): item is CartItem => item !== null);
    onViewCart(items);
  };

  let displayed = mockMenuItems.filter(item => {
    if (activeCategory === "Popular") return item.is_popular;
    const cat = mockCategories.find(c => c.category_name === activeCategory);
    if (cat && item.category_id !== cat.category_id) return false;
    if (search && !item.item_name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterVeg && !item.is_vegetarian) return false;
    return true;
  });

  if (sortBy === "price_asc") displayed = [...displayed].sort((a, b) => a.price - b.price);
  if (sortBy === "price_desc") displayed = [...displayed].sort((a, b) => b.price - a.price);

  useEffect(() => {
    const t = setInterval(() => setPromoIdx(i => (i + 1) % promos.length), 4500);
    return () => clearInterval(t);
  }, []);

  const cartItems = Object.entries(cart)
    .map(([id, qty]) => {
      const item = mockMenuItems.find(i => i.item_id === +id);
      if (!item) return null;
      return { item, qty };
    })
    .filter((entry): entry is { item: MenuItem; qty: number } => entry !== null);

  return (
    <div
      style={{
        background: COLORS.bg,
        fontFamily: "'DM Sans', sans-serif",
        minHeight: "100vh",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .scroll-hide::-webkit-scrollbar { display: none; }
        .scroll-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .menu-card { transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .menu-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(44,24,16,0.14); }
        .menu-card:active { transform: scale(0.97); }
        .btn-press:active { transform: scale(0.92); }
        @keyframes slideUp { from { transform: translateY(100%); opacity:0; } to { transform: translateY(0); opacity:1; } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .fade-in { animation: fadeIn 0.28s ease forwards; }
        .cart-slide { animation: slideUp 0.28s ease; }
        .promo-dot { transition: all 0.3s ease; }
      `}</style>

      <div className="max-w-[1100px] mx-auto min-h-screen flex flex-col">

        {/* ── TOP HEADER ── */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8D5C4] shadow-sm">
          <div className="px-6 py-3">
            <div className="flex items-center justify-between gap-4">
              {/* Brand */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #8B4513, #D2691E)' }}>
                  <Coffee className="w-4.5 h-4.5 text-white" size={18} />
                </div>
                <div>
                  <h1 className="font-bold text-[#2C1810] leading-tight" style={{ fontFamily: 'Playfair Display, serif', fontSize: 17 }}>
                    La Ta Bhore
                  </h1>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#228B22]" />
                    <span className="text-[10px] text-[#8B7355]">Open · Table {tableNumber}</span>
                  </div>
                </div>
              </div>

              {/* Search bar */}
              <div
                className="flex-1 max-w-sm flex items-center gap-2 rounded-xl px-3 h-10 border transition-all"
                style={{
                  background: searchFocused ? '#fff' : COLORS.bg,
                  borderColor: searchFocused ? COLORS.primary : COLORS.border,
                  boxShadow: searchFocused ? `0 0 0 3px rgba(139,69,19,0.1)` : 'none',
                }}
              >
                <Search size={14} color={searchFocused ? COLORS.primary : COLORS.textSecondary} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Search menu..."
                  className="flex-1 border-none outline-none bg-transparent text-sm"
                  style={{ color: COLORS.textPrimary, fontFamily: 'inherit' }}
                />
                {search && (
                  <button onClick={() => setSearch('')} className="text-[#C4A882] hover:text-[#8B7355]">
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Right actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Guest count */}
                <button
                  onClick={() => setShowGuestPicker(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-semibold transition-all hover:border-[#8B4513]"
                  style={{ background: COLORS.bg, borderColor: COLORS.border, color: COLORS.textPrimary }}
                >
                  <Users size={13} color={COLORS.secondary} />
                  {guestCount}
                </button>

                {/* Call waiter */}
                <button
                  onClick={handleCallWaiter}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-semibold transition-all"
                  style={{
                    background: waiterCalled ? COLORS.success : COLORS.bg,
                    borderColor: waiterCalled ? COLORS.success : COLORS.border,
                    color: waiterCalled ? '#fff' : COLORS.textSecondary,
                  }}
                >
                  <Bell size={13} color={waiterCalled ? '#fff' : COLORS.secondary} />
                  <span className="hidden sm:inline">{waiterCalled ? 'Called!' : 'Waiter'}</span>
                </button>

                {/* Cart */}
                {cartCount > 0 && (
                  <button
                    onClick={() => setShowCart(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 relative"
                    style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`, boxShadow: '0 4px 14px rgba(139,69,19,0.35)' }}
                  >
                    <ShoppingBag size={14} />
                    <span>{cartCount}</span>
                    <span className="hidden sm:inline">· {formatCurrency(cartTotal)}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Category Pills */}
          <div className="px-6 pb-3">
            <div ref={categoryScrollRef} className="scroll-hide flex gap-2 overflow-x-auto">
              {allCategories.map(cat => {
                const CatIcon = CATEGORY_ICONS[cat] || UtensilsCrossed;
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setSearch(''); }}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full whitespace-nowrap text-xs font-bold flex-shrink-0 transition-all"
                    style={{
                      background: isActive ? COLORS.primary : '#fff',
                      color: isActive ? '#fff' : COLORS.textSecondary,
                      border: `1.5px solid ${isActive ? COLORS.primary : COLORS.border}`,
                      boxShadow: isActive ? '0 3px 10px rgba(139,69,19,0.28)' : 'none',
                    }}
                  >
                    <CatIcon size={11} />
                    {cat === 'Popular' ? 'Popular' : cat}
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* ── MAIN CONTENT ── */}
        <div className="flex-1 px-6 py-5">

          {/* Promo Banner */}
          <div className="relative rounded-2xl overflow-hidden mb-6 h-[120px]"
            style={{ background: `linear-gradient(135deg, ${promos[promoIdx].gradient[0]}, ${promos[promoIdx].gradient[1]})` }}>
            {/* Decorative circles */}
            <div className="absolute right-0 top-0 w-40 h-40 rounded-full opacity-10" style={{ background: '#fff', transform: 'translate(30%, -30%)' }} />
            <div className="absolute right-8 bottom-0 w-24 h-24 rounded-full opacity-8" style={{ background: '#fff', transform: 'translateY(40%)' }} />

            <div className="absolute inset-0 flex items-center px-7 justify-between">
              <div>
                <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mb-1">{promos[promoIdx].title}</p>
                <p className="font-bold text-white text-xl mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>{promos[promoIdx].sub}</p>
                <p className="text-white/80 text-xs">{promos[promoIdx].body}</p>
              </div>
              <button className="flex items-center gap-2 bg-white/20 border border-white/30 rounded-xl px-4 py-2 text-white text-xs font-bold hover:bg-white/30 transition-all flex-shrink-0">
                {promos[promoIdx].cta} <ArrowRight size={11} />
              </button>
            </div>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {promos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPromoIdx(i)}
                  className="promo-dot h-1.5 rounded-full"
                  style={{
                    width: i === promoIdx ? 20 : 6,
                    background: i === promoIdx ? '#fff' : 'rgba(255,255,255,0.4)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Filter / Sort Bar */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[#8B7355]">
                {displayed.length} item{displayed.length !== 1 ? 's' : ''}
                {activeCategory !== 'Popular' && <span className="ml-1">in {activeCategory}</span>}
              </span>
              <button
                onClick={() => setFilterVeg(v => !v)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all"
                style={{
                  background: filterVeg ? COLORS.success : '#fff',
                  borderColor: filterVeg ? COLORS.success : COLORS.border,
                  color: filterVeg ? '#fff' : COLORS.textSecondary,
                }}
              >
                <Leaf size={11} />
                Veg Only
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => setSortOpen(o => !o)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all hover:border-[#8B4513]"
                style={{ background: '#fff', borderColor: COLORS.border, color: COLORS.textPrimary }}
              >
                Sort: {sortBy === 'popular' ? 'Popular' : sortBy === 'price_asc' ? 'Price Low' : 'Price High'}
                <ChevronDown size={12} />
              </button>
              {sortOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 bg-white border border-[#E8D5C4] rounded-xl shadow-lg overflow-hidden z-20 w-44">
                    {[['popular', 'Popular First'], ['price_asc', 'Price: Low to High'], ['price_desc', 'Price: High to Low']].map(([val, label]) => (
                      <button
                        key={val}
                        onClick={() => { setSortBy(val); setSortOpen(false); }}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-[#FFF8F0]"
                        style={{ color: sortBy === val ? COLORS.primary : COLORS.textSecondary }}
                      >
                        {sortBy === val && <Check size={11} />}
                        {label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Item Grid */}
          {displayed.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-6">
              {displayed.map((item, idx) => {
                const inCart = cart[item.item_id] || 0;
                const isFav = favorites[item.item_id];
                const justAdded = addedId === item.item_id;
                const soldOut = !item.is_available;

                return (
                  <div
                    key={item.item_id}
                    className="menu-card fade-in bg-white rounded-2xl overflow-hidden border"
                    style={{
                      borderColor: inCart > 0 ? COLORS.primary : 'rgba(232,213,196,0.6)',
                      animationDelay: `${idx * 0.04}s`,
                      boxShadow: inCart > 0 ? `0 0 0 2px ${COLORS.primary}20` : '0 2px 10px rgba(44,24,16,0.06)',
                    }}
                  >
                    {/* Image */}
                    <div
                      className="relative cursor-pointer"
                      style={{ height: 140 }}
                      onClick={() => !soldOut && setQuickView(item)}
                    >
                      <img
                        src={item.image_url}
                        alt={item.item_name}
                        className="w-full h-full object-cover"
                        style={{ filter: soldOut ? 'grayscale(0.7) brightness(0.65)' : 'none' }}
                      />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.22) 100%)' }} />

                      {soldOut && (
                        <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.42)' }}>
                          <span className="bg-white/95 rounded-full px-3 py-1 text-xs font-black text-[#2C1810]">Unavailable</span>
                        </div>
                      )}

                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {item.is_popular && (
                          <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black text-white" style={{ background: '#FF6B35' }}>
                            <Flame size={8} /> Hot
                          </span>
                        )}
                        {item.discount && (
                          <span className="rounded-full px-2 py-0.5 text-[9px] font-black text-white" style={{ background: COLORS.success }}>
                            -{item.discount}%
                          </span>
                        )}
                        {item.destination_station === 'bar' && (
                          <span className="flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white bg-sky-500">
                            <Coffee size={7} /> Bar
                          </span>
                        )}
                      </div>

                      {/* Fav */}
                      <button
                        onClick={e => { e.stopPropagation(); toggleFav(item.item_id); }}
                        className="btn-press absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center border-none"
                        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                      >
                        <Heart size={12} fill={isFav ? '#e74c3c' : 'none'} color={isFav ? '#e74c3c' : COLORS.textSecondary} />
                      </button>

                      {/* In-cart badge */}
                      {inCart > 0 && (
                        <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full text-white text-xs font-black flex items-center justify-center"
                          style={{ background: COLORS.primary }}>
                          {inCart}
                        </div>
                      )}
                    </div>

                    {/* Body */}
                    <div className="p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Star size={9} fill={COLORS.gold} color={COLORS.gold} />
                        <span className="text-[10px] font-bold text-[#8B7355]">4.8</span>
                        {item.is_vegetarian && <Leaf size={9} color={COLORS.success} />}
                      </div>

                      <p className="font-bold text-[#2C1810] mb-0.5 leading-snug line-clamp-2" style={{ fontSize: 13 }}>
                        {item.item_name}
                      </p>
                      <p className="text-[11px] text-[#8B7355] mb-2.5 line-clamp-1">{item.description}</p>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-black text-sm" style={{ color: COLORS.primary }}>{formatCurrency(item.price)}</p>
                          {item.discount && (
                            <p className="text-[10px] text-[#C4A882] line-through">
                              {formatCurrency(Math.round(item.price / (1 - item.discount / 100)))}
                            </p>
                          )}
                        </div>

                        {inCart === 0 ? (
                          <button
                            onClick={() => !soldOut && addToCart(item.item_id)}
                            disabled={soldOut}
                            className="btn-press w-8 h-8 rounded-full flex items-center justify-center border-none transition-all"
                            style={{
                              background: soldOut ? '#ddd' : justAdded ? COLORS.success : COLORS.primary,
                              cursor: soldOut ? 'not-allowed' : 'pointer',
                              boxShadow: soldOut ? 'none' : '0 4px 12px rgba(139,69,19,0.35)',
                            }}
                          >
                            {justAdded ? <Check size={15} color="#fff" /> : <Plus size={15} color="#fff" />}
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => removeFromCart(item.item_id)}
                              className="btn-press w-7 h-7 rounded-full flex items-center justify-center border"
                              style={{ background: COLORS.bg, borderColor: COLORS.border }}
                            >
                              <Minus size={11} color={COLORS.primary} />
                            </button>
                            <span className="text-sm font-black min-w-[18px] text-center" style={{ color: COLORS.primary }}>{inCart}</span>
                            <button
                              onClick={() => addToCart(item.item_id)}
                              className="btn-press w-7 h-7 rounded-full flex items-center justify-center border-none"
                              style={{ background: COLORS.primary }}
                            >
                              <Plus size={11} color="#fff" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-[#E8D5C4] flex items-center justify-center mx-auto mb-4">
                <Search size={24} color={COLORS.textSecondary} />
              </div>
              <p className="font-bold text-[#2C1810] mb-1">No items found</p>
              <p className="text-sm text-[#8B7355]">Try a different search or category</p>
              <button
                onClick={() => { setSearch(''); setActiveCategory('Popular'); setFilterVeg(false); }}
                className="mt-4 px-5 py-2 rounded-xl text-sm font-semibold text-white"
                style={{ background: COLORS.primary }}
              >
                Show All Items
              </button>
            </div>
          )}
        </div>

        {/* ── FLOATING CART BUTTON (mobile / when no sidebar cart) ── */}
        {cartCount > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 cart-slide">
            <button
              onClick={handleViewCart}
              className="flex items-center gap-4 px-6 py-4 rounded-2xl text-white font-bold shadow-2xl"
              style={{
                background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                boxShadow: '0 10px 32px rgba(139,69,19,0.45)',
                minWidth: 280,
              }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                  <ShoppingBag size={15} />
                </div>
                <span className="text-sm">{cartCount} item{cartCount > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-base font-black">{formatCurrency(cartTotal)}</span>
                <ArrowRight size={16} />
              </div>
            </button>
          </div>
        )}
      </div>

      {/* ── QUICK VIEW MODAL ── */}
      {quickView && (
        <div
          onClick={() => setQuickView(null)}
          className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl overflow-hidden"
            style={{ maxHeight: '90vh', overflowY: 'auto' }}
          >
            <div className="relative">
              <img
                src={quickView.image_url}
                alt={quickView.item_name}
                className="w-full object-cover"
                style={{ height: 220 }}
              />
              <button
                onClick={() => setQuickView(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center"
              >
                <X size={16} color={COLORS.textSecondary} />
              </button>
              {quickView.is_popular && (
                <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black text-white" style={{ background: '#FF6B35' }}>
                  <Flame size={9} /> Popular
                </div>
              )}
            </div>
            <div className="p-5 pb-8">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-xl text-[#2C1810]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {quickView.item_name}
                </h3>
                <button onClick={() => toggleFav(quickView.item_id)} className="flex-shrink-0 mt-1">
                  <Heart size={18} fill={favorites[quickView.item_id] ? '#e74c3c' : 'none'} color={favorites[quickView.item_id] ? '#e74c3c' : '#C4A882'} />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1">
                  <Star size={12} fill={COLORS.gold} color={COLORS.gold} />
                  <span className="text-xs font-bold text-[#8B7355]">4.8 rating</span>
                </div>
                {quickView.is_vegetarian && (
                  <div className="flex items-center gap-1">
                    <Leaf size={11} color={COLORS.success} />
                    <span className="text-xs text-[#228B22] font-semibold">Vegetarian</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock size={11} color={COLORS.textSecondary} />
                  <span className="text-xs text-[#8B7355]">{quickView.destination_station === 'bar' ? '3–5 min' : '8–15 min'}</span>
                </div>
              </div>

              <p className="text-sm text-[#8B7355] mb-4 leading-relaxed">{quickView.description}</p>

              {quickView.contains_allergens !== 'None' && (
                <div className="flex items-start gap-2 bg-[#FFF8E1] border border-[#FFD966] rounded-xl px-3 py-2.5 mb-4">
                  <AlertCircle size={14} color="#E07B00" className="flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[#E07B00] font-semibold">Contains: {quickView.contains_allergens}</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-black" style={{ color: COLORS.primary }}>{formatCurrency(quickView.price)}</p>
                  {quickView.discount && (
                    <p className="text-xs text-[#C4A882] line-through">
                      {formatCurrency(Math.round(quickView.price / (1 - quickView.discount / 100)))}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => { addToCart(quickView.item_id); setQuickView(null); }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm"
                  style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})` }}
                >
                  <Plus size={15} /> Add to Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── GUEST PICKER MODAL ── */}
      {showGuestPicker && (
        <div
          onClick={() => setShowGuestPicker(false)}
          className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white w-full sm:max-w-xs rounded-t-2xl sm:rounded-2xl p-6 pb-10 sm:pb-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-[#2C1810]" style={{ fontFamily: 'Playfair Display, serif' }}>Guests at Table</h3>
              <button onClick={() => setShowGuestPicker(false)}>
                <X size={18} color={COLORS.textSecondary} />
              </button>
            </div>
            <div className="flex items-center justify-center gap-6 mb-6">
              <button
                onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                className="w-11 h-11 rounded-full flex items-center justify-center border-2 font-bold text-xl"
                style={{ borderColor: COLORS.border, color: COLORS.primary }}
              >
                <Minus size={18} />
              </button>
              <div className="text-center">
                <span className="text-4xl font-black" style={{ color: COLORS.primary }}>{guestCount}</span>
                <p className="text-xs text-[#8B7355] mt-1">guests</p>
              </div>
              <button
                onClick={() => setGuestCount(Math.min(12, guestCount + 1))}
                className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-xl"
                style={{ background: COLORS.primary }}
              >
                <Plus size={18} />
              </button>
            </div>
            <button
              onClick={() => setShowGuestPicker(false)}
              className="w-full py-3 rounded-xl text-white font-bold text-sm"
              style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})` }}
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {/* ── CART SIDE SHEET ── */}
      {showCart && (
        <div
          onClick={() => setShowCart(false)}
          className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center sm:justify-end"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white w-full sm:w-96 h-full sm:h-auto sm:max-h-[90vh] rounded-t-2xl sm:rounded-l-2xl sm:rounded-r-none overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8D5C4]">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} color={COLORS.primary} />
                <h3 className="font-bold text-[#2C1810]">Your Order</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: COLORS.primary }}>
                  {cartCount}
                </span>
              </div>
              <button onClick={() => setShowCart(false)}>
                <X size={18} color={COLORS.textSecondary} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {cartItems.map(({ item, qty }) => (
                <div key={item.item_id} className="flex items-center gap-3 bg-[#FFF8F0] rounded-xl p-3">
                  <img src={item.image_url} alt={item.item_name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#2C1810] text-sm truncate">{item.item_name}</p>
                    <p className="text-xs font-bold" style={{ color: COLORS.primary }}>{formatCurrency(item.price * qty)}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => removeFromCart(item.item_id)}
                      className="w-6 h-6 rounded-full flex items-center justify-center border"
                      style={{ borderColor: COLORS.border }}
                    >
                      <Minus size={10} color={COLORS.primary} />
                    </button>
                    <span className="text-sm font-bold text-[#2C1810] min-w-[16px] text-center">{qty}</span>
                    <button
                      onClick={() => addToCart(item.item_id)}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white"
                      style={{ background: COLORS.primary }}
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-[#E8D5C4]">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[#8B7355]">Subtotal</span>
                <span className="font-semibold text-[#2C1810]">{formatCurrency(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-[#8B7355]">Tax (18%)</span>
                <span className="font-semibold text-[#2C1810]">{formatCurrency(Math.round(cartTotal * 0.18))}</span>
              </div>
              <div className="flex justify-between font-black mb-4">
                <span className="text-[#2C1810]">Total</span>
                <span style={{ color: COLORS.primary }}>{formatCurrency(Math.round(cartTotal * 1.18))}</span>
              </div>
              <button
                onClick={() => { setShowCart(false); handleViewCart(); }}
                className="w-full py-3.5 rounded-xl text-white font-bold flex items-center justify-center gap-2"
                style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`, boxShadow: '0 6px 20px rgba(139,69,19,0.35)' }}
              >
                <ArrowRight size={16} /> Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenuBrowser;