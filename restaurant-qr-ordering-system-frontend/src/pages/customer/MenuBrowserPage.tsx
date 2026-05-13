import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, Heart, Plus, Leaf, Clock, ArrowRight, Sparkles, Flame,
  ChevronLeft, SlidersHorizontal, Sun, Coffee, Moon, Star, Beer,
  UtensilsCrossed, X, ChevronRight, Check
} from 'lucide-react';
import { useMenu, useCategories } from '../../hooks/useMenu';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/format';
import { cn } from '../../utils/classNames';
import type { MenuItem } from '../../types';
import { useNavigate } from 'react-router-dom';

const HERO_BG = 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2070&auto=format&fit=crop';

const TIME_FILTERS = [
  { id: 'all',     label: 'All Day',  icon: Star },
  { id: 'morning', label: 'Morning',  icon: Sun },
  { id: 'lunch',   label: 'Lunch',    icon: Coffee },
  { id: 'evening', label: 'Evening',  icon: Moon },
  { id: 'bar',     label: 'Bar',      icon: Beer },
];

const SORT_OPTIONS = [
  { id: 'default', label: 'Default' },
  { id: 'price_asc', label: 'Price: Low to High' },
  { id: 'price_desc', label: 'Price: High to Low' },
  { id: 'name', label: 'Name A–Z' },
];

const banners = [
  { id: 1, tag: 'Special Offer', title: 'Morning Freshness', desc: '20% off all freshly baked pastries before 10 AM.', grad: 'from-amber-500 to-orange-600', Icon: Sun },
  { id: 2, tag: 'Chef Special',  title: 'Smoked Tenderloin', desc: 'Try our new Smoked Tenderloin. Limited availability!', grad: 'from-rose-500 to-red-700', Icon: Flame },
  { id: 3, tag: 'Iced Delights', title: 'Signature Iced Latte', desc: 'Cool down with our signature Iced Latte series.', grad: 'from-teal-500 to-cyan-700', Icon: Sparkles },
];

const MenuBrowserPage: React.FC = () => {
  const { addItem, cartCount, cartTotal } = useCart();
  const { data: categoriesRes } = useCategories();
  const { data: menuRes, isLoading } = useMenu();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<number | 'all'>('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [showSort, setShowSort] = useState(false);
  const [bannerIdx, setBannerIdx] = useState(0);
  const [addedId, setAddedId] = useState<number | null>(null);

  useEffect(() => {
    const t = setInterval(() => setBannerIdx(p => (p + 1) % banners.length), 5000);
    return () => clearInterval(t);
  }, []);

  const handleAdd = (item: any) => {
    addItem(item, 1, '', []);
    setAddedId(item.itemId);
    setTimeout(() => setAddedId(null), 1500);
  };

  const rawItems = useMemo(() => {
    if (!menuRes) return [];
    return Array.isArray(menuRes) ? menuRes : (menuRes as any).content ?? [];
  }, [menuRes]);

  const filteredItems = useMemo(() => {
    let items = [...rawItems];

    // Category filter — use String() to avoid type mismatch (number vs string from API)
    if (activeCategory !== 'all') {
      items = items.filter((i: any) => String(i.categoryId) === String(activeCategory));
    }

    // Bar time filter — only when no specific category is selected
    if (timeFilter === 'bar' && activeCategory === 'all') {
      items = items.filter((i: any) =>
        i.destinationStation === 'BAR' ||
        i.categoryName?.toLowerCase().includes('drink') ||
        i.categoryName?.toLowerCase().includes('beer') ||
        i.categoryName?.toLowerCase().includes('alcohol') ||
        i.categoryName?.toLowerCase().includes('cocktail') ||
        i.categoryName?.toLowerCase().includes('wine')
      );
    }

    // Search
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((i: any) =>
        i.itemName?.toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q) ||
        i.categoryName?.toLowerCase().includes(q)
      );
    }

    // Vegetarian filter
    if (isVegOnly) items = items.filter((i: any) => i.isVegetarian || i.isVegan);

    // Sort
    if (sortBy === 'price_asc')  items = [...items].sort((a: any, b: any) => a.price - b.price);
    if (sortBy === 'price_desc') items = [...items].sort((a: any, b: any) => b.price - a.price);
    if (sortBy === 'name')       items = [...items].sort((a: any, b: any) => a.itemName.localeCompare(b.itemName));

    return items;
  }, [rawItems, activeCategory, search, isVegOnly, timeFilter, sortBy]);

  const categories = Array.isArray(categoriesRes) ? categoriesRes : (categoriesRes as any)?.content ?? [];

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0d0d] text-white pb-36 selection:bg-primary/30">

      {/* Hero Header */}
      <div className="relative h-56 overflow-hidden">
        <img src={HERO_BG} alt="Azzurri Rwanda Restaurant" className="w-full h-full object-cover opacity-50 scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-[#0d0d0d]" />
        <div className="absolute inset-0 flex flex-col justify-between p-4 pt-safe">
          <div className="flex items-center justify-between mt-2">
            <button onClick={() => navigate(-1)} className="w-10 h-10 bg-black/40 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center">
              <ChevronLeft size={22} className="text-white" />
            </button>
            <div className="text-center">
              <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em]">Azzurri Rwanda Restaurant</p>
              <h1 className="text-xl font-black text-white tracking-widest" style={{ fontFamily: 'Playfair Display' }}>Our Menu</h1>
            </div>
            <div className="w-10" />
          </div>

          {/* Search bar inside hero */}
          <div className="flex items-center bg-black/50 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3 gap-3 mb-2 focus-within:border-primary transition-all">
            <Search size={18} className="text-white/50 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search dishes, drinks, categories..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium placeholder:text-white/40 text-white"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-white/40 hover:text-white">
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sticky filters */}
      <div className="sticky top-0 z-30 bg-[#0d0d0d]/95 backdrop-blur-xl border-b border-white/10 pt-3 pb-2 px-4 shadow-2xl">

        {/* Time-of-day filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3">
          {TIME_FILTERS.map(tf => {
            const Icon = tf.icon;
            return (
              <button
                key={tf.id}
                onClick={() => {
                  setTimeFilter(tf.id);
                  setActiveCategory('all'); // reset category when picking a time filter
                }}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap text-xs font-bold border transition-all duration-300 flex-shrink-0",
                  timeFilter === tf.id
                    ? "bg-primary text-white border-primary shadow-[0_0_15px_rgba(210,105,30,0.4)] scale-105"
                    : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10"
                )}
              >
                <Icon size={13} />
                {tf.label}
              </button>
            );
          })}
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3">
          <button
            onClick={() => { setActiveCategory('all'); setTimeFilter('all'); }}
            className={cn(
              "px-4 py-1.5 rounded-full whitespace-nowrap text-xs font-bold border transition-all flex-shrink-0",
              activeCategory === 'all' && timeFilter === 'all' ? "bg-white text-black border-white" : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10"
            )}
          >All</button>
          {categories.map((cat: any) => (
            <button
              key={cat.categoryId}
              onClick={() => {
                setActiveCategory(cat.categoryId);
                setTimeFilter('all'); // reset time filter when picking a category
              }}
              className={cn(
                "px-4 py-1.5 rounded-full whitespace-nowrap text-xs font-bold border transition-all flex-shrink-0",
                String(activeCategory) === String(cat.categoryId) ? "bg-white text-black border-white" : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10"
              )}
            >{cat.categoryName}</button>
          ))}
        </div>

        {/* Veg + Sort row */}
        <div className="flex items-center justify-between">
          <button onClick={() => setIsVegOnly(!isVegOnly)} className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all",
            isVegOnly ? "bg-green-600 text-white border-green-500" : "bg-white/5 text-white/50 border-white/10"
          )}>
            <Leaf size={12} /> Veg Only
          </button>
          <div className="flex items-center gap-2 text-xs text-white/50 font-medium">
            <span>{filteredItems.length} items</span>
            <button
              onClick={() => setShowSort(!showSort)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-bold transition-all",
                showSort ? "bg-primary text-white border-primary" : "bg-white/5 text-white/60 border-white/10"
              )}
            >
              <SlidersHorizontal size={13} /> Sort
            </button>
          </div>
        </div>

        {/* Sort dropdown */}
        {showSort && (
          <div className="mt-2 bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => { setSortBy(opt.id); setShowSort(false); }}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
              >
                <span className={sortBy === opt.id ? 'text-primary font-bold' : 'text-white/80'}>{opt.label}</span>
                {sortBy === opt.id && <Check size={14} className="text-primary" />}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 space-y-6">

        {/* Rotating Special Offer Banner */}
        <div className="relative h-44 rounded-[2rem] overflow-hidden shadow-2xl border border-white/10">
          {banners.map((b, i) => {
            const Icon = b.Icon;
            return (
              <div
                key={b.id}
                className={cn("absolute inset-0 bg-gradient-to-br transition-opacity duration-1000", b.grad, bannerIdx === i ? "opacity-100 z-10" : "opacity-0 z-0")}
              >
                <img src={HERO_BG} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay" />
                <div className="absolute inset-0 p-6 flex flex-col justify-center">
                  <span className="inline-block bg-black/30 backdrop-blur-md border border-white/20 px-3 py-1 rounded-lg text-[9px] font-black text-white uppercase tracking-widest w-fit mb-2">
                    {b.tag}
                  </span>
                  <h3 className="text-white text-2xl font-black drop-shadow-lg mb-1" style={{ fontFamily: 'Playfair Display' }}>{b.title}</h3>
                  <p className="text-white/80 text-xs leading-relaxed max-w-[220px]">{b.desc}</p>
                </div>
                <Icon size={80} className="absolute -right-4 -bottom-4 text-white/10" />
              </div>
            );
          })}
          {/* Dots */}
          <div className="absolute bottom-3 left-6 z-20 flex gap-1.5">
            {banners.map((_, i) => (
              <button key={i} onClick={() => setBannerIdx(i)}
                className={cn("h-1.5 rounded-full transition-all duration-500", bannerIdx === i ? "w-6 bg-white" : "w-1.5 bg-white/40")}
              />
            ))}
          </div>
        </div>

        {/* Chef's Special section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-black text-white text-base flex items-center gap-2">
              <Star size={16} className="text-primary" /> Chef's Special
            </h2>
            <button className="text-primary text-xs font-bold flex items-center gap-1">
              See all <ChevronRight size={12} />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {rawItems.slice(0, 5).map((item: any) => (
              <div key={item.itemId} className="flex-shrink-0 w-44 bg-white/5 rounded-[1.5rem] border border-white/10 overflow-hidden group hover:border-primary/40 transition-all">
                <div className="relative h-28 overflow-hidden">
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&auto=format&fit=crop'}
                    alt={item.itemName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <button
                    onClick={() => handleAdd(item)}
                    className="absolute bottom-2 right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg"
                  >
                    {addedId === item.itemId ? <Check size={14} className="text-white" /> : <Plus size={14} className="text-white" />}
                  </button>
                </div>
                <div className="p-3">
                  <p className="text-xs font-bold text-white line-clamp-1">{item.itemName}</p>
                  <p className="text-primary text-sm font-black mt-0.5">{formatCurrency(item.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Items */}
        <div>
          <h2 className="font-black text-white text-base mb-3 flex items-center gap-2">
            <UtensilsCrossed size={16} className="text-primary" />
            {activeCategory === 'all' ? 'All Menu Items' : categories.find((c: any) => c.categoryId === activeCategory)?.categoryName ?? 'Menu'}
          </h2>

          {isLoading ? (
            <div className="flex flex-col items-center py-16 gap-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest animate-pulse">Loading menu...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-white/5 rounded-[2rem] border border-white/10">
              <Search size={32} className="text-white/20 mx-auto mb-3" />
              <p className="text-white/60 font-bold">No items found</p>
              <p className="text-white/30 text-sm mt-1">Try a different search or filter</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item: any) => (
                <MenuCard key={item.itemId} item={item} onAdd={() => handleAdd(item)} justAdded={addedId === item.itemId} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Cart */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-4 right-4 z-50 animate-slideUp">
          <button
            onClick={() => navigate('../cart')}
            className="w-full bg-white text-black h-16 rounded-[2rem] shadow-[0_10px_40px_rgba(255,255,255,0.2)] flex items-center justify-between px-6 hover:scale-[1.02] active:scale-[0.98] transition-all border border-white/10 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="bg-black text-white rounded-xl px-3 py-1.5 font-black text-sm">{cartCount}</div>
              <span className="font-bold tracking-wide uppercase text-sm">View Order</span>
            </div>
            <div className="flex items-center gap-3 relative z-10">
              <span className="text-lg font-black">{formatCurrency(cartTotal)}</span>
              <div className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center">
                <ArrowRight size={16} />
              </div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

interface MenuCardProps {
  item: MenuItem;
  onAdd: () => void;
  justAdded: boolean;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, onAdd, justAdded }) => {
  const soldOut = Boolean((item as any).trackStock && (item as any).stockQuantity === 0);
  const lowStock = !soldOut && Boolean((item as any).trackStock && (item as any).stockQuantity < 10 && (item as any).stockQuantity > 0);

  return (
    <div className="flex gap-4 bg-white/5 p-4 rounded-[2rem] border border-white/10 hover:border-white/20 hover:bg-white/8 transition-all duration-300 backdrop-blur-md group">
      <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-black flex-shrink-0 shadow-inner">
        <img
          src={(item as any).imageUrl || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&auto=format&fit=crop'}
          alt={item.itemName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {((item as any).isVegetarian || (item as any).isVegan) && (
          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md border border-white/20 p-1 rounded-full">
            <Leaf size={10} className="text-green-400" />
          </div>
        )}
        {soldOut && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-[9px] font-black text-red-400 uppercase tracking-widest">Sold Out</span>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-white text-[15px] leading-tight line-clamp-1" style={{ fontFamily: 'Playfair Display' }}>
              {item.itemName}
            </h3>
            <button className="text-white/20 hover:text-rose-400 transition-colors flex-shrink-0">
              <Heart size={16} />
            </button>
          </div>
          <p className="text-[11px] text-white/40 line-clamp-2 mt-1 leading-relaxed">
            {item.description || 'Crafted with premium ingredients for the perfect taste.'}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1 text-[9px] font-bold text-white/30 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
              <Clock size={9} /> {(item as any).preparationTime ? `${(item as any).preparationTime} min` : 'Fresh'}
            </div>
            {(item as any).categoryName && (
              <div className="text-[9px] font-bold text-primary/70 bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md uppercase tracking-wide">
                {(item as any).categoryName}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-[18px] font-black text-primary">{formatCurrency(item.price)}</span>
            {lowStock && (
              <p className="text-[9px] font-bold text-red-400 animate-pulse mt-0.5 uppercase">
                Only {(item as any).stockQuantity} left
              </p>
            )}
          </div>
          <button
            disabled={soldOut}
            onClick={onAdd}
            className={cn(
              "w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg",
              soldOut
                ? "bg-white/5 text-white/20 cursor-not-allowed"
                : justAdded
                  ? "bg-green-500 text-white scale-110 shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                  : "bg-white text-black hover:bg-primary hover:text-white hover:shadow-[0_0_20px_rgba(210,105,30,0.6)] active:scale-90"
            )}
          >
            {justAdded ? <Check size={18} /> : <Plus size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuBrowserPage;
