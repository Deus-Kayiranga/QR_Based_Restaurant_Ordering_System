import React from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  CreditCard, 
  Wallet,
  Download,
  Share2
} from 'lucide-react';
import { useOrder } from '../../hooks/useOrders';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency, formatDate } from '../../utils/format';

const BillPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const { orderId: paramOrderId } = useParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId') || paramOrderId;
  const { data: orderRes, isLoading } = useOrder(orderId ? parseInt(orderId, 10) : 0);

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#111111]">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 font-bold text-white uppercase tracking-widest text-xs animate-pulse">Loading bill...</p>
    </div>
  );
  
  const order = orderRes;
  if (!order) return <div className="p-10 text-center bg-[#111111] text-white min-h-screen">Order not found</div>;

  const { pathname } = window.location;
  const isCustomerRoute = pathname.startsWith('/t/');
  const isStaffRoute = pathname.includes('/waiter/') || pathname.includes('/manager/') || pathname.includes('/admin/') || pathname.includes('/cashier/');
  
  // If we are on a customer route (/t/...), we are NOT staff for UI purposes (show pay buttons)
  // even if the user logged in as staff previously in this browser session.
  const isStaff = !isCustomerRoute && (isStaffRoute || (!!user && ['WAITER', 'CASHIER', 'MANAGER', 'SUPER_ADMIN', 'BAR_STAFF', 'KITCHEN_STAFF'].includes(user.role)));

  return (
    <div className="flex flex-col min-h-screen bg-[#111111] text-white pb-32">
      <div className="bg-black/60 backdrop-blur-xl px-4 py-4 border-b border-white/10 flex items-center gap-4 sticky top-0 z-30 shadow-2xl">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-white" />
        </button>
        <h1 className="text-xl font-bold text-white tracking-wide uppercase">{isStaff ? 'Bill Review' : 'Payment Details'}</h1>
      </div>

      <div className="p-6">
        {/* Bill Visual */}
        <div className="bg-white/5 border-x border-t border-white/10 rounded-t-[2rem] p-8 relative overflow-hidden backdrop-blur-md shadow-2xl">
          {/* Decorative glowing orb */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
          
          {/* Restaurant Info */}
          <div className="text-center mb-8 relative z-10">
            <h2 className="text-3xl font-black text-white drop-shadow-md mb-1" style={{ fontFamily: 'Playfair Display' }}>Azzurri Rwanda Restaurant</h2>
            <p className="text-[10px] text-white/50 uppercase tracking-[0.2em] mt-1 font-bold">Kigali, Rwanda • TIN: 102938475</p>
            <div className="w-16 h-[1px] bg-white/20 mx-auto mt-5"></div>
          </div>

          {/* Metadata */}
          <div className="flex justify-between text-[11px] font-bold text-primary uppercase mb-8 tracking-widest bg-primary/10 border border-primary/20 px-4 py-2 rounded-xl">
            <span>#INV-{order.orderId.toString().padStart(4, '0')}</span>
            <span className="text-white/80">{formatDate(order.placedAt)}</span>
          </div>

          {/* Items */}
          <div className="space-y-5 mb-8 relative z-10">
            {order.items.map((item) => (
              <div key={item.orderItemId} className="flex justify-between items-start text-sm group">
                <span className="flex-1 pr-4 text-white/90 font-medium">
                  <span className="font-black text-white bg-white/10 px-2 py-0.5 rounded mr-3 text-xs">{item.quantity}x</span>
                  {item.itemName}
                </span>
                <span className="font-bold text-white group-hover:text-primary transition-colors">{formatCurrency(item.unitPrice * item.quantity)}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-dashed border-white/20 pt-6 space-y-3 relative z-10">
            <div className="flex justify-between text-sm">
              <span className="text-white/60 font-bold tracking-wide">Subtotal</span>
              <span className="font-bold text-white">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60 font-bold tracking-wide">VAT (18%)</span>
              <span className="font-bold text-white">{formatCurrency(order.taxAmount)}</span>
            </div>
            <div className="flex justify-between items-end pt-5 mt-5 border-t border-white/10">
              <div>
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest block mb-1">Total Amount Due</span>
                <span className="text-lg font-black text-white uppercase tracking-tighter">{isStaff ? 'Total Bill' : 'Amount to Pay'}</span>
              </div>
              <span className="text-4xl font-black text-primary drop-shadow-[0_0_15px_rgba(210,105,30,0.5)]">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Decorative Scalloped Edge */}
        <div className="h-4 bg-white/5 backdrop-blur-md border-x border-white/10" style={{ clipPath: 'polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)' }}></div>

        {/* Quick Actions */}
        <div className="flex justify-center gap-8 mt-8">
          <button className="flex flex-col items-center gap-3 group">
            <div className="w-14 h-14 bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10 shadow-lg group-hover:bg-primary group-hover:border-primary transition-all group-hover:scale-110">
              <Download size={22} className="text-white group-hover:text-black transition-colors" />
            </div>
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest group-hover:text-white transition-colors">PDF</span>
          </button>
          <button className="flex flex-col items-center gap-3 group">
            <div className="w-14 h-14 bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10 shadow-lg group-hover:bg-primary group-hover:border-primary transition-all group-hover:scale-110">
              <Share2 size={22} className="text-white group-hover:text-black transition-colors" />
            </div>
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest group-hover:text-white transition-colors">Share</span>
          </button>
        </div>
      </div>

      {/* Payment Action Bar - Only for Customers */}
      {!isStaff && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 bg-gradient-to-t from-black via-black/90 to-transparent pt-12 pb-8 z-40 safe-bottom">
          <button 
            onClick={() => navigate(`../pay?orderId=${order.orderId}`)}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-[0_0_30px_rgba(210,105,30,0.4)] flex items-center justify-center gap-3 active:scale-[0.98] transition-all hover:bg-orange-600 hover:shadow-[0_0_40px_rgba(210,105,30,0.6)]"
          >
            Proceed to Payment · {formatCurrency(order.totalAmount)}
            <CreditCard size={22} />
          </button>
          <button 
            onClick={() => navigate(`../pay?orderId=${order.orderId}&method=CASH`)}
            className="w-full mt-5 text-white/50 font-bold text-xs uppercase tracking-widest text-center flex items-center justify-center gap-2 hover:text-white transition-colors"
          >
            <Wallet size={16} />
            Pay with Cash at Counter
          </button>
        </div>
      )}
    </div>
  );
};

export default BillPage;
