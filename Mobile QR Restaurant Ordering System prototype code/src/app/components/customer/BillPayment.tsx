import { useState } from 'react';
import {
  ArrowLeft, Check, CreditCard, Smartphone, Banknote,
  ChevronRight, Coffee, Receipt, Printer, Share2,
} from 'lucide-react';
import { formatCurrency, Order, OrderItem, mockMenuItems, PaymentMethod } from '../../../data/mockData';
import { motion, AnimatePresence } from 'motion/react';

interface BillPaymentProps {
  order: Order;
  orderItems: OrderItem[];
  onBack: () => void;
  onPaymentComplete: () => void;
}

type PayStep = 'summary' | 'method' | 'details' | 'processing' | 'success';

export function BillPayment({ order, orderItems, onBack, onPaymentComplete }: BillPaymentProps) {
  const [step, setStep] = useState<PayStep>('summary');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cashTendered, setCashTendered] = useState('');

  const subtotal = order.subtotal;
  const tax = order.tax_amount;
  const total = order.total_amount;

  const handlePay = async () => {
    setStep('processing');
    await new Promise(r => setTimeout(r, 2000));
    setStep('success');
    setTimeout(() => onPaymentComplete(), 3500);
  };

  const PAYMENT_METHODS = [
    {
      id: 'momo' as PaymentMethod,
      name: 'MTN Mobile Money',
      sub: 'Pay via MTN MoMo (+250 7XX)',
      icon: Smartphone,
      bg: '#FFCB05',
      iconColor: '#000',
      badge: 'MTN',
      badgeBg: '#FFCB05',
    },
    {
      id: 'airtel_money' as PaymentMethod,
      name: 'Airtel Money',
      sub: 'Pay via Airtel (+250 7XX)',
      icon: Smartphone,
      bg: '#ED1C24',
      iconColor: '#fff',
      badge: 'Airtel',
      badgeBg: '#ED1C24',
    },
    {
      id: 'cash' as PaymentMethod,
      name: 'Cash Payment',
      sub: 'Waiter will collect payment',
      icon: Banknote,
      bg: '#228B22',
      iconColor: '#fff',
      badge: 'Cash',
      badgeBg: '#228B22',
    },
  ];

  // ── SUCCESS SCREEN ──
  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-5" style={{ background: '#FFF8F0', fontFamily: "'DM Sans', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 w-full max-w-sm text-center border border-[#E8D5C4] shadow-lg"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-5 text-white"
            style={{ background: 'linear-gradient(135deg, #228B22, #34A853)', boxShadow: '0 12px 32px rgba(34,139,34,0.4)' }}
          >
            <Check className="w-12 h-12" />
          </motion.div>

          <h2 className="font-bold text-[#2C1810] mb-1" style={{ fontFamily: 'Playfair Display, serif', fontSize: 24 }}>
            Payment Successful!
          </h2>
          <p className="text-[#8B7355] mb-6">Thank you for dining at La Ta Bhore</p>

          <div className="bg-[#FFF8F0] rounded-2xl p-5 mb-5 border border-[#E8D5C4]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4 text-[#D2691E]" />
                <span className="text-sm font-bold text-[#2C1810]">La Ta Bhore</span>
              </div>
              <span className="text-xs text-[#8B7355]">Order #{order.order_id}</span>
            </div>
            <p className="text-3xl font-black text-[#8B4513] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
              {formatCurrency(total)}
            </p>
            <p className="text-xs text-[#8B7355]">
              {paymentMethod === 'momo' ? 'Paid via MTN MoMo' :
               paymentMethod === 'airtel_money' ? 'Paid via Airtel Money' : 'Paid with Cash'}
            </p>
          </div>

          <div className="flex gap-2 mb-4">
            <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#E8D5C4] text-[#8B7355] text-xs font-semibold hover:border-[#8B4513] transition-colors">
              <Printer className="w-3.5 h-3.5" /> Receipt
            </button>
            <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#E8D5C4] text-[#8B7355] text-xs font-semibold hover:border-[#8B4513] transition-colors">
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
          </div>

          <p className="text-xs text-[#C4A882]">Redirecting to menu in a moment...</p>
        </motion.div>
      </div>
    );
  }

  // ── PROCESSING ──
  if (step === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center p-5" style={{ background: '#FFF8F0', fontFamily: "'DM Sans', sans-serif" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 w-full max-w-sm text-center border border-[#E8D5C4] shadow-lg"
        >
          <div className="w-20 h-20 rounded-full border-4 border-[#E8D5C4] border-t-[#8B4513] rounded-full animate-spin mx-auto mb-5" />
          <h3 className="font-bold text-[#2C1810] mb-2" style={{ fontFamily: 'Playfair Display, serif', fontSize: 20 }}>
            Processing Payment
          </h3>
          <p className="text-sm text-[#8B7355]">
            {paymentMethod === 'cash' ? 'Notifying waiter...' :
             paymentMethod === 'momo' ? 'Sending MTN MoMo request...' : 'Sending Airtel request...'}
          </p>
          <p className="text-xs text-[#C4A882] mt-2">{formatCurrency(total)}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#FFF8F0', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        .pay-method { transition: all 0.18s ease; }
        .pay-method:hover { transform: translateY(-2px); }
        .pay-method:active { transform: scale(0.98); }
      `}</style>

      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E8D5C4] shadow-sm">
        <div className="max-w-lg mx-auto px-5 h-14 flex items-center gap-3">
          <button
            onClick={step === 'method' || step === 'details' ? () => setStep(step === 'details' ? 'method' : 'summary') : onBack}
            className="w-9 h-9 rounded-xl bg-[#FFF8F0] border border-[#E8D5C4] flex items-center justify-center hover:border-[#8B4513] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#8B4513]" />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-[#2C1810]" style={{ fontFamily: 'Playfair Display, serif', fontSize: 18 }}>
              {step === 'summary' ? 'Your Bill' : step === 'method' ? 'Payment Method' : 'Payment Details'}
            </h1>
          </div>
          <div className="flex items-center gap-1 bg-[#FFF8F0] border border-[#E8D5C4] rounded-full px-3 py-1">
            {['summary', 'method', 'details'].map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`w-2 h-2 rounded-full transition-all ${
                  ['summary', 'method', 'details'].indexOf(step) >= i ? 'bg-[#8B4513]' : 'bg-[#E8D5C4]'
                }`} />
                {i < 2 && <div className="w-4 h-px bg-[#E8D5C4] mx-0.5" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-5 pb-36">

        {/* ── STEP 1: BILL SUMMARY ── */}
        {step === 'summary' && (
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
            {/* Restaurant branding */}
            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-2" style={{ background: 'linear-gradient(135deg, #8B4513, #D2691E)' }}>
                <Coffee className="w-6 h-6 text-white" />
              </div>
              <h2 className="font-bold text-[#2C1810]" style={{ fontFamily: 'Playfair Display, serif', fontSize: 18 }}>La Ta Bhore</h2>
              <p className="text-xs text-[#8B7355]">Kigali, Rwanda · Order #{order.order_id}</p>
            </div>

            {/* Items */}
            <div className="bg-white rounded-2xl p-5 mb-4 border border-[#E8D5C4] shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Receipt className="w-4 h-4 text-[#D2691E]" />
                <h3 className="font-bold text-[#2C1810]">Items Ordered</h3>
              </div>
              <div className="space-y-3">
                {orderItems.map(oi => {
                  const mi = mockMenuItems.find(m => m.item_id === oi.menu_item_id);
                  if (!mi) return null;
                  return (
                    <div key={oi.order_item_id} className="flex items-center gap-3">
                      <img src={mi.image_url} alt={mi.item_name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#2C1810] text-sm truncate">{mi.item_name}</p>
                        <p className="text-xs text-[#8B7355]">×{oi.quantity} · {formatCurrency(oi.unit_price)} each</p>
                      </div>
                      <p className="font-bold text-[#8B4513] text-sm flex-shrink-0">
                        {formatCurrency(oi.unit_price * oi.quantity)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-dashed border-[#E8D5C4] mt-4 pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8B7355]">Subtotal</span>
                  <span className="text-[#2C1810] font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8B7355]">VAT / Tax (18%)</span>
                  <span className="text-[#2C1810] font-semibold">{formatCurrency(tax)}</span>
                </div>
                <div className="border-t border-[#E8D5C4] pt-2 flex justify-between items-center">
                  <span className="font-bold text-[#2C1810]">Total</span>
                  <span className="font-black text-[#8B4513] text-xl" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep('method')}
              className="w-full py-4 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all active:scale-98"
              style={{ background: 'linear-gradient(135deg, #8B4513, #D2691E)', boxShadow: '0 6px 20px rgba(139,69,19,0.3)' }}
            >
              <CreditCard className="w-5 h-5" />
              Choose Payment Method
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* ── STEP 2: PAYMENT METHOD ── */}
        {step === 'method' && (
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}>
            <p className="text-sm text-[#8B7355] mb-5">
              Choose how you want to pay <span className="font-bold text-[#8B4513]">{formatCurrency(total)}</span>
            </p>

            <div className="space-y-3 mb-6">
              {PAYMENT_METHODS.map(method => {
                const Icon = method.icon;
                const selected = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className="pay-method w-full p-4 rounded-2xl border-2 text-left flex items-center gap-4 transition-all"
                    style={{
                      borderColor: selected ? '#8B4513' : '#E8D5C4',
                      background: selected ? '#FFF0E0' : '#fff',
                    }}
                  >
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: method.bg + '20' }}>
                      <Icon className="w-7 h-7" style={{ color: method.bg }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-[#2C1810] text-sm">{method.name}</p>
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded text-white" style={{ background: method.badgeBg }}>
                          {method.badge}
                        </span>
                      </div>
                      <p className="text-xs text-[#8B7355] mt-0.5">{method.sub}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      selected ? 'border-[#8B4513] bg-[#8B4513]' : 'border-[#E8D5C4]'
                    }`}>
                      {selected && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setStep('details')}
              disabled={!paymentMethod}
              className="w-full py-4 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #8B4513, #D2691E)', boxShadow: paymentMethod ? '0 6px 20px rgba(139,69,19,0.3)' : 'none' }}
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* ── STEP 3: PAYMENT DETAILS ── */}
        {step === 'details' && paymentMethod && (
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}>
            {/* Selected method indicator */}
            {(() => {
              const m = PAYMENT_METHODS.find(m => m.id === paymentMethod)!;
              const Icon = m.icon;
              return (
                <div className="flex items-center gap-3 bg-white rounded-2xl p-4 mb-5 border border-[#E8D5C4]">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: m.bg + '20' }}>
                    <Icon className="w-6 h-6" style={{ color: m.bg }} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[#2C1810] text-sm">{m.name}</p>
                    <p className="text-xs text-[#8B7355]">{m.sub}</p>
                  </div>
                  <p className="font-black text-[#8B4513]" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {formatCurrency(total)}
                  </p>
                </div>
              );
            })()}

            {/* Form fields */}
            {(paymentMethod === 'momo' || paymentMethod === 'airtel_money') && (
              <div className="bg-white rounded-2xl p-5 mb-5 border border-[#E8D5C4] space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#2C1810] mb-2">Phone Number</label>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-2 px-3 py-3 bg-[#FFF8F0] border border-[#E8D5C4] rounded-xl flex-shrink-0">
                      <span className="text-sm font-bold text-[#2C1810]">+250</span>
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                      placeholder="7XX XXX XXX"
                      className="flex-1 px-4 py-3 rounded-xl border border-[#E8D5C4] focus:outline-none focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/10 text-sm text-[#2C1810] placeholder:text-[#C4A882] transition-all"
                    />
                  </div>
                </div>
                <div className="bg-[#FFF8E1] border border-[#FFD966] rounded-xl px-3 py-2.5 text-xs text-[#856404]">
                  A push notification will be sent to your phone. Approve the payment request to complete your order.
                </div>
              </div>
            )}

            {paymentMethod === 'cash' && (
              <div className="bg-white rounded-2xl p-5 mb-5 border border-[#E8D5C4] space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#2C1810] mb-2">Cash Amount (Optional)</label>
                  <div className="flex gap-2">
                    <div className="flex items-center px-3 py-3 bg-[#FFF8F0] border border-[#E8D5C4] rounded-xl flex-shrink-0">
                      <span className="text-xs font-bold text-[#8B7355]">RWF</span>
                    </div>
                    <input
                      type="number"
                      value={cashTendered}
                      onChange={e => setCashTendered(e.target.value)}
                      placeholder={total.toString()}
                      className="flex-1 px-4 py-3 rounded-xl border border-[#E8D5C4] focus:outline-none focus:border-[#8B4513] text-sm text-[#2C1810] placeholder:text-[#C4A882] transition-all"
                    />
                  </div>
                  {cashTendered && parseInt(cashTendered) > total && (
                    <p className="text-xs text-[#228B22] font-semibold mt-1.5 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Change: {formatCurrency(parseInt(cashTendered) - total)}
                    </p>
                  )}
                </div>
                <div className="bg-[#E8F5E9] border border-[#228B22]/20 rounded-xl px-3 py-2.5 text-xs text-[#1B5E20]">
                  Your waiter will come to your table to collect the cash payment.
                </div>
              </div>
            )}

            {/* Total */}
            <div className="bg-[#FFF0E0] border border-[#D2691E]/20 rounded-2xl p-4 mb-5 flex items-center justify-between">
              <span className="font-bold text-[#2C1810]">Amount to Pay</span>
              <span className="font-black text-[#8B4513] text-2xl" style={{ fontFamily: 'Playfair Display, serif' }}>
                {formatCurrency(total)}
              </span>
            </div>

            <button
              onClick={handlePay}
              disabled={
                (paymentMethod === 'momo' || paymentMethod === 'airtel_money')
                  ? !phoneNumber || phoneNumber.length < 9
                  : false
              }
              className="w-full py-4 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: paymentMethod === 'cash' ? 'linear-gradient(135deg, #228B22, #34A853)' : 'linear-gradient(135deg, #8B4513, #D2691E)', boxShadow: '0 6px 20px rgba(139,69,19,0.3)' }}
            >
              {paymentMethod === 'cash' ? (
                <><Banknote className="w-5 h-5" /> Request Waiter</>
              ) : (
                <><Smartphone className="w-5 h-5" /> Pay {formatCurrency(total)}</>
              )}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
