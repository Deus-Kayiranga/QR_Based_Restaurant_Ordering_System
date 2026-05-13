import React, { useState } from 'react';
import { useTableSession } from '../../contexts/TableSessionContext';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag,
  MessageSquare,
  ChevronRight,
  Info
} from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/format';
import { ordersApi } from '../../api/orders';
import { cn } from '../../utils/classNames';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { isSessionActive } = useTableSession();
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    cartTotal, 
    cartSubtotal, 
    cartTax,
    tableId,
    sessionToken,
    clearCart
  } = useCart();

  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlaceOrder = async () => {
    if (!tableId || !sessionToken) {
      setError('Session expired. Please scan the QR code again or go back to the table page.');
      return;
    }

    const attemptOrder = async (token: string) => {
      const orderData = {
        tableId,
        sessionToken: token,
        specialInstructions,
        items: items.map(item => ({
          menuItemId: item.menuItem.itemId,
          quantity: item.quantity,
          specialNotes: item.specialNotes,
          customizations: item.customizations
        }))
      };
      const response = await ordersApi.placeOrder(orderData);
      clearCart();
      navigate(`../track/${response.orderId}`);
    };

    try {
      setIsPlacingOrder(true);
      setError(null);
      await attemptOrder(sessionToken);
    } catch (err: any) {
      const msg: string = err?.response?.data?.message || err?.message || '';
      // Session expired on backend — re-validate table to get a fresh session
      if (msg.toLowerCase().includes('session') && msg.toLowerCase().includes('inactive')) {
        try {
          const { tablesApi } = await import('../../api/tables');
          const tableNum = sessionStorage.getItem('tableNumber') || '';
          const token = sessionStorage.getItem('qrToken') || '';
          const fresh = await tablesApi.validateQR({ tableNumber: tableNum, token });
          sessionStorage.setItem('sessionToken', fresh.sessionToken);
          await attemptOrder(fresh.sessionToken);
        } catch {
          setError('Your session has expired. Please go back and re-select your table.');
        }
      } else {
        setError(msg || 'Connection error. Please try again.');
      }
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Session closed (e.g. after payment) — show recovery screen
  if (!isSessionActive) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#111111] p-8 text-center">
        <div className="w-24 h-24 bg-orange-500/10 border border-orange-500/30 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={44} className="text-orange-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'Playfair Display' }}>
          Session Ended
        </h2>
        <p className="text-white/50 mb-2 max-w-xs font-medium">
          Your table session has closed (usually after payment). To order again, please go back and select your table.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-8 w-full max-w-sm bg-primary text-white py-4 rounded-2xl font-bold shadow-[0_0_20px_rgba(210,105,30,0.4)] flex items-center justify-center gap-3 hover:bg-orange-600 transition-all"
        >
          <ArrowLeft size={20} />
          Go to Table Selection
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center bg-[#111111]">
        <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.05)]">
          <ShoppingBag size={56} className="text-white/20" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'Playfair Display' }}>
          Your cart is empty
        </h2>
        <p className="text-white/50 mb-10 max-w-xs font-medium">Add some delicious items from our menu to start your order.</p>
        <button 
          onClick={() => navigate('../menu')}
          className="w-full max-w-sm bg-white text-black py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-3 hover:scale-105 transition-transform"
        >
          <ArrowLeft size={20} />
          Browse Menu 
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#111111] text-white">
      {/* Header */}
      <div className="bg-black/60 backdrop-blur-xl px-4 py-4 border-b border-white/10 flex items-center gap-4 sticky top-0 z-30 shadow-2xl">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-white" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white tracking-widest uppercase">Your Order</h1>
        </div>
        <div className="bg-primary/20 text-primary px-4 py-1.5 rounded-full text-xs font-black border border-primary/30 shadow-[0_0_10px_rgba(210,105,30,0.2)]">
          Table {tableId}
        </div>
      </div>

      <div className="p-4 space-y-6 pb-48">
        {/* Cart Items List */}
        <div className="bg-white/5 rounded-[2rem] overflow-hidden border border-white/10 shadow-xl backdrop-blur-md">
          {items.map((item, index) => (
            <div 
              key={item.menuItem.itemId}
              className={cn(
                "p-5 flex gap-4 transition-all duration-300 hover:bg-white/5",
                index !== items.length - 1 ? "border-b border-white/5" : ""
              )}
            >
              <img 
                src={item.menuItem.imageUrl || 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&q=80&w=300'} 
                alt={item.menuItem.itemName}
                className="w-20 h-20 rounded-2xl object-cover border border-white/10 shadow-inner"
              />
              
              <div className="flex-1 flex flex-col justify-between py-1">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-white text-[16px] leading-tight drop-shadow-md" style={{ fontFamily: 'Playfair Display' }}>
                    {item.menuItem.itemName}
                  </h3>
                  <button 
                    onClick={() => removeItem(item.menuItem.itemId)}
                    className="text-white/20 hover:text-rose-500 transition-colors active:scale-90"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                {item.customizations.length > 0 && (
                  <p className="text-[10px] text-white/50 mt-1 uppercase tracking-wider font-bold">
                    {item.customizations.join(' • ')}
                  </p>
                )}

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center bg-black/40 rounded-xl p-1 border border-white/10">
                    <button 
                      onClick={() => updateQuantity(item.menuItem.itemId, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors text-white"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.menuItem.itemId, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors text-white"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="font-black text-primary text-[17px] drop-shadow-[0_0_10px_rgba(210,105,30,0.5)]">
                    {formatCurrency(item.menuItem.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Instructions */}
        <div className="bg-white/5 rounded-[2rem] p-5 border border-white/10 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-3 mb-4 text-white">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/5">
              <MessageSquare size={16} className="text-white/80" />
            </div>
            <h3 className="font-bold text-sm tracking-wide uppercase">Special Instructions</h3>
          </div>
          <textarea 
            placeholder="Any allergies or special requests?"
            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary text-white placeholder:text-white/30 min-h-[100px] resize-none"
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
          />
        </div>

        {/* Bill Breakdown */}
        <div className="bg-white/5 rounded-[2rem] p-6 border border-white/10 shadow-xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
          
          <h3 className="font-bold text-white mb-6 tracking-wide uppercase text-sm">Order Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-white/60 font-medium">Subtotal</span>
              <span className="font-bold text-white/90">{formatCurrency(cartSubtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60 font-medium">Tax (18% VAT)</span>
              <span className="font-bold text-white/90">{formatCurrency(cartTax)}</span>
            </div>
            <div className="pt-4 border-t border-dashed border-white/20 flex justify-between items-end">
              <div>
                <span className="font-bold text-white/90 text-sm block">Total Amount</span>
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Including Taxes</span>
              </div>
              <span className="text-3xl font-black text-primary drop-shadow-[0_0_15px_rgba(210,105,30,0.6)]">{formatCurrency(cartTotal)}</span>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-danger/20 border border-danger/30 p-4 rounded-2xl flex gap-3 text-white backdrop-blur-md animate-pulse">
            <Info size={20} className="text-danger flex-shrink-0" />
            <p className="text-sm font-bold tracking-wide">{error}</p>
          </div>
        )}
      </div>

      {/* Place Order Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-gradient-to-t from-black via-black/90 to-transparent pt-12 pb-8 px-6 z-40 safe-bottom border-t border-white/5 backdrop-blur-sm">
        <button 
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder}
          className="w-full bg-white text-black py-4 rounded-2xl font-bold text-lg shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-between px-8 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 hover:bg-gray-100"
        >
          {isPlacingOrder ? (
            <div className="flex items-center gap-3 mx-auto">
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : (
            <>
              <span className="uppercase tracking-widest text-sm font-black">Place Order</span>
              <div className="flex items-center gap-3">
                <span className="h-6 w-px bg-black/20"></span>
                <span className="font-black text-xl">{formatCurrency(cartTotal)}</span>
                <ChevronRight size={20} />
              </div>
            </>
          )}
        </button>
        <button 
          onClick={() => navigate('../menu')}
          className="w-full mt-5 text-white/50 font-bold text-xs uppercase tracking-[0.2em] text-center hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={14} /> Add more items
        </button>
      </div>
    </div>
  );
};

export default CartPage;
