import { useState } from 'react';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, ChevronRight, Tag, Coffee, Leaf, AlertCircle } from 'lucide-react';
import { MenuItem, formatCurrency } from '../../../data/mockData';
import { motion, AnimatePresence } from 'motion/react';

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialNotes: string;
}

interface CartViewProps {
  cartItems: CartItem[];
  tableNumber: string;
  onBack: () => void;
  onPlaceOrder: (items: CartItem[], specialInstructions: string) => void;
  onUpdateCart: (items: CartItem[]) => void;
}

export function CartView({ cartItems, tableNumber, onBack, onPlaceOrder, onUpdateCart }: CartViewProps) {
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [placing, setPlacing] = useState(false);

  const updateQuantity = (itemId: number, delta: number) => {
    const updated = cartItems.map(item => {
      if (item.menuItem.item_id === itemId) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0);
    onUpdateCart(updated);
  };

  const removeItem = (itemId: number) => {
    onUpdateCart(cartItems.filter(item => item.menuItem.item_id !== itemId));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;
  const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0);

  const handlePlaceOrder = async () => {
    setPlacing(true);
    await new Promise(r => setTimeout(r, 700));
    onPlaceOrder(cartItems, specialInstructions);
  };

  return (
    <div className="min-h-screen" style={{ background: '#FFF8F0', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        .cart-item { transition: all 0.2s ease; }
        .cart-item:hover { transform: translateY(-1px); }
        .qty-btn { transition: all 0.15s ease; }
        .qty-btn:active { transform: scale(0.9); }
      `}</style>

      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E8D5C4] shadow-sm">
        <div className="max-w-lg mx-auto px-5 h-14 flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 rounded-xl bg-[#FFF8F0] border border-[#E8D5C4] flex items-center justify-center hover:border-[#8B4513] transition-colors">
            <ArrowLeft className="w-4 h-4 text-[#8B4513]" />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-[#2C1810]" style={{ fontFamily: 'Playfair Display, serif', fontSize: 18 }}>
              Your Order
            </h1>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#8B4513]/10 border border-[#8B4513]/20">
            <ShoppingBag className="w-3.5 h-3.5 text-[#8B4513]" />
            <span className="text-xs font-bold text-[#8B4513]">Table {tableNumber}</span>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-5 pb-36">

        {/* Items count banner */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-[#8B7355]">{totalItems} item{totalItems !== 1 ? 's' : ''} in your order</p>
          <button onClick={onBack} className="text-xs font-bold text-[#8B4513] underline underline-offset-2">
            Add More Items
          </button>
        </div>

        {/* Cart Items */}
        <div className="space-y-3 mb-5">
          <AnimatePresence>
            {cartItems.map((item, idx) => (
              <motion.div
                key={item.menuItem.item_id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16, height: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.2 }}
                className="cart-item bg-white rounded-2xl overflow-hidden border border-[#E8D5C4]/60 shadow-sm"
              >
                <div className="flex gap-3 p-3">
                  {/* Image */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={item.menuItem.image_url}
                      alt={item.menuItem.item_name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    {item.menuItem.destination_station === 'bar' && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center">
                        <Coffee className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-bold text-[#2C1810] text-sm leading-snug">{item.menuItem.item_name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {item.menuItem.is_vegetarian && (
                            <div className="flex items-center gap-0.5">
                              <Leaf className="w-2.5 h-2.5 text-[#228B22]" />
                              <span className="text-[9px] text-[#228B22] font-bold">Veg</span>
                            </div>
                          )}
                          {item.menuItem.contains_allergens !== 'None' && (
                            <div className="flex items-center gap-0.5">
                              <AlertCircle className="w-2.5 h-2.5 text-[#E07B00]" />
                              <span className="text-[9px] text-[#E07B00] font-semibold">{item.menuItem.contains_allergens.split(',')[0]}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.menuItem.item_id)}
                        className="w-7 h-7 rounded-full bg-red-50 border border-red-100 flex items-center justify-center hover:bg-red-100 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2.5">
                      <p className="font-black text-sm text-[#8B4513]">{formatCurrency(item.menuItem.price * item.quantity)}</p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.menuItem.item_id, -1)}
                          className="qty-btn w-7 h-7 rounded-full border-2 border-[#D2691E] text-[#D2691E] flex items-center justify-center hover:bg-[#FFF0E0]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-black text-[#2C1810] text-sm w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.menuItem.item_id, 1)}
                          className="qty-btn w-7 h-7 rounded-full bg-[#D2691E] text-white flex items-center justify-center hover:bg-[#8B4513]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {item.menuItem.price < subtotal && (
                      <p className="text-[10px] text-[#C4A882] mt-0.5">
                        {formatCurrency(item.menuItem.price)} each
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {cartItems.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#E8D5C4] flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="w-8 h-8 text-[#C4A882]" />
              </div>
              <p className="font-bold text-[#2C1810]">Your cart is empty</p>
              <button onClick={onBack} className="mt-3 text-sm font-bold text-[#8B4513] underline">
                Browse Menu
              </button>
            </div>
          )}
        </div>

        {/* Special Instructions */}
        <div className="bg-white rounded-2xl p-4 mb-5 border border-[#E8D5C4]">
          <label className="flex items-center gap-2 text-sm font-bold text-[#2C1810] mb-2">
            <Tag className="w-4 h-4 text-[#D2691E]" /> Special Instructions
          </label>
          <textarea
            value={specialInstructions}
            onChange={e => setSpecialInstructions(e.target.value)}
            placeholder="Any special requests? (e.g., no sugar, extra napkins, allergy notes...)"
            className="w-full px-3 py-2.5 rounded-xl border border-[#E8D5C4] focus:outline-none focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/10 resize-none text-sm text-[#2C1810] placeholder:text-[#C4A882] transition-all"
            rows={3}
          />
        </div>

        {/* Order Summary */}
        {cartItems.length > 0 && (
          <div className="bg-white rounded-2xl p-4 mb-5 border border-[#E8D5C4]">
            <h3 className="font-bold text-[#2C1810] mb-3">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#8B7355]">Subtotal ({totalItems} items)</span>
                <span className="text-[#2C1810] font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#8B7355]">VAT / Tax (18%)</span>
                <span className="text-[#2C1810] font-semibold">{formatCurrency(tax)}</span>
              </div>
              <div className="border-t border-[#E8D5C4] my-2" />
              <div className="flex justify-between">
                <span className="font-bold text-[#2C1810]">Total Amount</span>
                <span className="font-black text-[#8B4513] text-lg">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom CTA */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#E8D5C4] px-5 py-4 z-50">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-between mb-3 text-sm">
              <span className="text-[#8B7355]">{totalItems} items</span>
              <span className="font-black text-[#8B4513] text-base">{formatCurrency(total)}</span>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={placing || cartItems.length === 0}
              className="w-full py-4 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #8B4513, #D2691E)', boxShadow: '0 6px 20px rgba(139,69,19,0.35)' }}
            >
              {placing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Placing Order...
                </div>
              ) : (
                <>
                  Place Order <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
