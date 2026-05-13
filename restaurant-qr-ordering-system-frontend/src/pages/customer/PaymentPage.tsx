import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Smartphone, 
  Banknote,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Phone
} from 'lucide-react';
import { useOrder } from '../../hooks/useOrders';
import { paymentsApi } from '../../api/payments';
import { formatCurrency } from '../../utils/format';
import { cn } from '../../utils/classNames';

const PaymentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId');
  const { data: orderRes } = useOrder(orderId ? parseInt(orderId, 10) : 0);

  const [method, setMethod] = useState<'MOMO' | 'AIRTEL' | 'CASH' | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const order = orderRes;

  const handlePayment = async () => {
    if (!method || !order) return;

    setIsProcessing(true);
    
    try {
      await paymentsApi.processMobilePayment({
        billId: order.orderId,
        paymentMethod: method === 'AIRTEL' ? 'AIRTEL_MONEY' : method,
        amount: order.totalAmount,
        phoneNumber: phoneNumber || 'CASH_PAYMENT'
      });
      
      setIsSuccess(true);
      setTimeout(() => {
        navigate(`../receipt?orderId=${order.orderId}`);
      }, 2000);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#111111] p-10 text-center animate-fadeIn text-white">
        <div className="w-24 h-24 bg-success rounded-[2rem] flex items-center justify-center mb-8 animate-slideUp shadow-[0_0_50px_rgba(34,197,94,0.3)]">
          <CheckCircle2 size={48} color="white" />
        </div>
        <h2 className="text-4xl font-black text-white mb-3" style={{ fontFamily: 'Playfair Display' }}>Payment Successful!</h2>
        <p className="text-white/60 mb-10 max-w-xs text-sm font-medium">Thank you for your visit. Your digital receipt is ready.</p>
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-success animate-[progress_2s_ease-in-out] shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
        </div>
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
        <h1 className="text-xl font-bold text-white uppercase tracking-wide">Checkout</h1>
      </div>

      <div className="p-6 space-y-8 flex-1 pb-32">
        {/* Amount Section */}
        <div className="text-center py-6 bg-white/5 border border-white/10 rounded-[2rem] shadow-xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <p className="text-xs font-black text-white/50 uppercase tracking-widest mb-2">Total Payable</p>
            <h2 className="text-5xl font-black text-primary drop-shadow-[0_0_15px_rgba(210,105,30,0.5)]">{formatCurrency(order?.totalAmount || 0)}</h2>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-4">
          <p className="text-xs font-bold text-white/50 uppercase tracking-widest px-2">Select Payment Method</p>
          
          <button 
            onClick={() => setMethod('MOMO')}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-[1.5rem] border transition-all duration-300 backdrop-blur-md",
              method === 'MOMO' ? "bg-white/10 border-[#FFCC00] shadow-[0_0_20px_rgba(255,204,0,0.2)]" : "bg-white/5 border-white/10 hover:bg-white/10"
            )}
          >
            <div className="w-14 h-14 bg-[#FFCC00] rounded-2xl flex items-center justify-center shadow-inner">
              <Smartphone size={24} color="black" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-white text-[15px]">MTN Mobile Money</h3>
              <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest mt-0.5">Fast & Secure Payment</p>
            </div>
            <div className={cn(
              "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
              method === 'MOMO' ? "border-[#FFCC00] bg-[#FFCC00]" : "border-white/20"
            )}>
              {method === 'MOMO' && <CheckCircle2 size={14} color="black" />}
            </div>
          </button>

          <button 
            onClick={() => setMethod('AIRTEL')}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-[1.5rem] border transition-all duration-300 backdrop-blur-md",
              method === 'AIRTEL' ? "bg-white/10 border-[#ED1C24] shadow-[0_0_20px_rgba(237,28,36,0.2)]" : "bg-white/5 border-white/10 hover:bg-white/10"
            )}
          >
            <div className="w-14 h-14 bg-[#ED1C24] rounded-2xl flex items-center justify-center shadow-inner">
              <Smartphone size={24} color="white" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-white text-[15px]">Airtel Money</h3>
              <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest mt-0.5">Instant Confirmation</p>
            </div>
            <div className={cn(
              "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
              method === 'AIRTEL' ? "border-[#ED1C24] bg-[#ED1C24]" : "border-white/20"
            )}>
              {method === 'AIRTEL' && <CheckCircle2 size={14} color="white" />}
            </div>
          </button>

          <button 
            onClick={() => setMethod('CASH')}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-[1.5rem] border transition-all duration-300 backdrop-blur-md",
              method === 'CASH' ? "bg-white/10 border-primary shadow-[0_0_20px_rgba(210,105,30,0.2)]" : "bg-white/5 border-white/10 hover:bg-white/10"
            )}
          >
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-inner">
              <Banknote size={24} color="white" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-white text-[15px]">Pay with Cash</h3>
              <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest mt-0.5">Call Waiter to Table</p>
            </div>
            <div className={cn(
              "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
              method === 'CASH' ? "border-primary bg-primary" : "border-white/20"
            )}>
              {method === 'CASH' && <CheckCircle2 size={14} color="white" />}
            </div>
          </button>
        </div>

        {/* Input for Mobile Money */}
        {(method === 'MOMO' || method === 'AIRTEL') && (
          <div className="space-y-3 animate-fadeIn bg-white/5 border border-white/10 rounded-[2rem] p-5 backdrop-blur-md">
            <p className="text-[11px] font-bold text-white/80 uppercase tracking-widest">Enter Phone Number</p>
            <div className="relative">
              <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input 
                type="tel" 
                placeholder="+250 78x xxx xxx"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 font-bold text-white focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-white/30 transition-all"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="bg-success/10 border border-success/20 rounded-[1.5rem] p-5 flex gap-4 text-success backdrop-blur-md">
          <ShieldCheck size={24} className="flex-shrink-0" />
          <p className="text-xs font-bold leading-relaxed tracking-wide">
            Your transaction is secured with end-to-end encryption. No financial data is stored on our servers.
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 bg-gradient-to-t from-black via-black/90 to-transparent pt-12 pb-8 z-40 safe-bottom">
        <button 
          onClick={handlePayment}
          disabled={!method || isProcessing || ((method === 'MOMO' || method === 'AIRTEL') && !phoneNumber)}
          className="w-full bg-white text-black py-4 rounded-2xl font-bold text-lg shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50 hover:bg-gray-100"
        >
          {isProcessing ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : method === 'CASH' ? (
            "Request Bill"
          ) : (
            <>
              Confirm Payment
              <ChevronRight size={20} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
