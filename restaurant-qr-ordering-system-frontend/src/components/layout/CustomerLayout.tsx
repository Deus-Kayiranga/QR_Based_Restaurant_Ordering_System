import React from 'react';
import { Outlet } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { ShoppingCart, HelpCircle, UtensilsCrossed, History } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const CustomerLayout: React.FC = () => {
  const { cartCount } = useCart();
  const location = useLocation();

  const isCartPage = location.pathname.includes('/cart');
  const isMenuPage = location.pathname.includes('/menu');
  const isWelcomePage = location.pathname.includes('/welcome') || (location.pathname.startsWith('/t/') && !location.pathname.includes('/', 3));

  return (
    <div className="min-h-screen bg-[#111111] flex flex-col max-w-md mx-auto relative shadow-2xl border-x border-white/5 overflow-hidden">
      {/* Mobile-first PWA Header */}
      {!isWelcomePage && (
        <header className="h-16 bg-black/60 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40 px-6 flex items-center justify-between">
          <Link to="menu" className="flex items-center gap-3 active:scale-95 transition-transform">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(210,105,30,0.3)]">
              <UtensilsCrossed size={18} color="white" />
            </div>
            <span className="font-bold text-white tracking-widest uppercase text-sm" style={{ fontFamily: 'Playfair Display' }}>
              Azzurri
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/40">
              <HelpCircle size={22} />
            </button>
            
            {!isCartPage && (
              <Link to="cart" className="p-2 hover:bg-white/10 rounded-full transition-colors relative text-white">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-primary text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-[#111111] shadow-lg">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto animate-fadeIn relative">
        {/* Dynamic background glow */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative z-10">
          <Outlet />
        </div>
      </main>

      {/* Customer Tab Bar (Mobile) */}
      {!isWelcomePage && !isCartPage && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-black/80 backdrop-blur-2xl border-t border-white/10 px-8 py-4 flex items-center justify-between z-40 safe-bottom shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          <Link to="menu" className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${isMenuPage ? 'text-primary scale-110 drop-shadow-[0_0_10px_rgba(210,105,30,0.5)]' : 'text-white/30'}`}>
            <UtensilsCrossed size={22} />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Menu</span>
          </Link>
          
          <Link to="cart" className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${isCartPage ? 'text-primary scale-110' : 'text-white/30'} relative`}>
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-primary text-white text-[9px] font-black px-1.5 h-4 flex items-center justify-center rounded-full border-2 border-black">
                {cartCount}
              </span>
            )}
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Cart</span>
          </Link>

          <Link to="track/0" className="flex flex-col items-center gap-1.5 transition-all duration-300 text-white/30 hover:text-white/60">
            <History size={22} />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Orders</span>
          </Link>
        </nav>
      )}
    </div>
  );
};

export default CustomerLayout;
