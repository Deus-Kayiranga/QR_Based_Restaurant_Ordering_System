import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Download, 
  Share2, 
  Home, 
  Star,
  MessageSquare
} from 'lucide-react';
import { useOrder } from '../../hooks/useOrders';
import { formatCurrency, formatDate } from '../../utils/format';

const ReceiptPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId');
  const { data: orderRes } = useOrder(orderId ? parseInt(orderId, 10) : 0);

  const order = orderRes;

  return (
    <div className="flex flex-col min-h-screen bg-[#111111] text-white">
      <div className="flex-1 p-6 flex flex-col items-center">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-success rounded-[2rem] flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(34,197,94,0.3)] animate-bounce-slow mt-8">
          <CheckCircle size={48} color="white" />
        </div>

        <h1 className="text-4xl font-black text-white mb-3" style={{ fontFamily: 'Playfair Display' }}>Payment Received!</h1>
        <p className="text-white/60 text-center mb-10 max-w-[280px] font-medium leading-relaxed">
          A copy of your receipt has been generated and sent to your email.
        </p>

        {/* Digital Receipt Card */}
        <div className="w-full bg-white/5 rounded-[2rem] border border-white/10 shadow-2xl p-8 space-y-8 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
          
          <div className="text-center border-b border-white/10 pb-6 relative z-10">
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] mb-1">Receipt Number</p>
            <p className="text-xl font-black text-white tracking-wider">#RCP-{order?.orderId.toString().padStart(5, '0')}</p>
          </div>

          <div className="grid grid-cols-2 gap-y-6 text-sm relative z-10">
            <div>
              <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] mb-1">Date & Time</p>
              <p className="font-bold text-white/90">{formatDate(new Date())}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] mb-1">Payment Method</p>
              <p className="font-black text-primary">MTN MoMo</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] mb-1">Table</p>
              <p className="font-bold text-white/90">{order?.tableNumber || 'A1'}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] mb-1">Total Paid</p>
              <p className="font-black text-primary text-lg drop-shadow-[0_0_10px_rgba(210,105,30,0.5)]">{formatCurrency(order?.totalAmount || 0)}</p>
            </div>
          </div>

          <div className="bg-black/40 border border-white/10 rounded-xl p-4 flex items-center justify-between relative z-10">
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Transaction ID</span>
            <span className="text-xs font-mono font-bold text-white/90 tracking-wider">MO-728192039</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full grid grid-cols-2 gap-4 mt-8">
          <button className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-4 rounded-[1.5rem] font-bold text-sm text-white hover:bg-white/10 transition-colors backdrop-blur-md">
            <Download size={18} />
            Download
          </button>
          <button className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-4 rounded-[1.5rem] font-bold text-sm text-white hover:bg-white/10 transition-colors backdrop-blur-md">
            <Share2 size={18} />
            Share
          </button>
        </div>

        {/* Feedback Section */}
        <div className="mt-12 w-full text-center bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-md">
          <p className="text-sm font-bold text-white mb-5 uppercase tracking-widest">How was your experience?</p>
          <div className="flex justify-center gap-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} className="text-white/20 hover:text-warning transition-all hover:scale-110 active:scale-95">
                <Star size={36} fill={star <= 4 ? "currentColor" : "none"} className={star <= 4 ? "text-warning drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" : ""} />
              </button>
            ))}
          </div>
          <button className="mt-6 text-primary font-bold text-xs flex items-center justify-center gap-2 mx-auto uppercase tracking-widest hover:text-orange-500 transition-colors">
            <MessageSquare size={16} />
            Leave a comment
          </button>
        </div>
      </div>

      {/* Done Button */}
      <div className="p-6 safe-bottom">
        <button 
          onClick={() => navigate('../')}
          className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-[0_0_30px_rgba(210,105,30,0.4)] flex items-center justify-center gap-3 active:scale-[0.98] transition-all hover:bg-orange-600"
        >
          <Home size={22} />
          Back to Welcome
        </button>
      </div>
    </div>
  );
};

export default ReceiptPage;
