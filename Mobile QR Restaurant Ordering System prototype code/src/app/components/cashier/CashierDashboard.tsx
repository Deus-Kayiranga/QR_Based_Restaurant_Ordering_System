import { useState, useEffect } from 'react';
import { CreditCard, Smartphone, Banknote, CheckCircle, Clock, Search, Receipt, TrendingUp, User, LogOut, Printer, Send, BarChart2, List, Home, X, Bell, ArrowLeft, AlertCircle, Download, FileText, DollarSign, Wallet, Phone } from 'lucide-react';
import { mockBills, mockOrders, mockPayments, mockOrderItems, getTableById, getMenuItemById, formatCurrency, Bill, PaymentMethod } from '../../../data/mockData';
import { StaffLayout } from '../layouts/StaffLayout';
import { motion, AnimatePresence } from 'motion/react';

type CashierTab = 'pending' | 'paid' | 'history' | 'summary';
type CashierView = 'list' | 'payment' | 'success';
type PaymentStep = 'select_method' | 'enter_details' | 'verify';

interface ExtendedBill extends Bill {
  paymentMethod?: PaymentMethod;
  tableNumber?: string;
  waitingMinutes?: number;
}

interface Notification {
  id: number;
  type: 'new_bill' | 'payment_confirmed' | 'reminder';
  message: string;
  time: string;
  bill_id?: number;
  amount?: number;
  table?: string;
}

export function CashierDashboard({ onLogout }: { onLogout?: () => void }) {
  const [navTab, setNavTab] = useState('bills');
  const [activeTab, setActiveTab] = useState<CashierTab>('pending');
  const [view, setView] = useState<CashierView>('list');
  const [selectedBill, setSelectedBill] = useState<ExtendedBill | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [paymentStep, setPaymentStep] = useState<PaymentStep>('select_method');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cashTendered, setCashTendered] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [search, setSearch] = useState('');
  const [bills, setBills] = useState(mockBills);
  const [payments, setPayments] = useState(mockPayments);
  const [completedBill, setCompletedBill] = useState<ExtendedBill | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, type: 'new_bill', message: 'Table A5 requested payment', time: 'Just now', bill_id: 1, amount: 33198, table: 'A5' },
    { id: 2, type: 'new_bill', message: 'Table B2 requested payment', time: '2 min ago', bill_id: 2, amount: 22500, table: 'B2' },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'verified' | 'failed'>('idle');

  // Calculate statistics
  const pendingBills = bills.filter(b => b.bill_status === 'ready');
  const paidBills = bills.filter(b => b.bill_status === 'paid');
  const todayTotal = payments.reduce((sum, p) => sum + p.amount, 0);
  const cashTotal = payments.filter(p => p.payment_method === 'cash').reduce((sum, p) => sum + p.amount, 0);
  const momoTotal = payments.filter(p => p.payment_method === 'momo').reduce((sum, p) => sum + p.amount, 0);
  const airtelTotal = payments.filter(p => p.payment_method === 'airtel_money').reduce((sum, p) => sum + p.amount, 0);
  const cashCount = payments.filter(p => p.payment_method === 'cash').length;
  const momoCount = payments.filter(p => p.payment_method === 'momo').length;
  const airtelCount = payments.filter(p => p.payment_method === 'airtel_money').length;
  const avgBill = payments.length > 0 ? todayTotal / payments.length : 0;
  const largestBill = payments.length > 0 ? Math.max(...payments.map(p => p.amount)) : 0;
  const smallestBill = payments.length > 0 ? Math.min(...payments.map(p => p.amount)) : 0;

  const calculateChange = () => {
    if (!selectedBill || !cashTendered) return 0;
    return Math.max(0, parseFloat(cashTendered) - selectedBill.total_amount);
  };

  const canProceedToNextStep = () => {
    if (paymentStep === 'select_method') return !!paymentMethod;
    if (paymentStep === 'enter_details') {
      if (paymentMethod === 'cash') return !!cashTendered && parseFloat(cashTendered) >= (selectedBill?.total_amount || 0);
      if (paymentMethod === 'momo' || paymentMethod === 'airtel_money') return !!phoneNumber && phoneNumber.length >= 10;
    }
    if (paymentStep === 'verify') {
      if (paymentMethod === 'cash') return true;
      return verificationStatus === 'verified';
    }
    return false;
  };

  const handleVerifyTransaction = () => {
    setVerificationStatus('verifying');
    setTimeout(() => {
      setVerificationStatus('verified');
    }, 1500);
  };

  const handleProcessPayment = () => {
    if (!selectedBill) return;
    const updatedBill = { ...selectedBill, bill_status: 'paid' as const, paid_at: new Date().toISOString(), paymentMethod: paymentMethod! };
    setBills(prev => prev.map(b => b.bill_id === selectedBill.bill_id ? updatedBill : b));
    setCompletedBill({ ...updatedBill, tableNumber: getTableById(mockOrders.find(o => o.order_id === selectedBill.order_id)?.table_id || 0)?.table_number });
    const newPayment = {
      payment_id: payments.length + 100,
      bill_id: selectedBill.bill_id,
      payment_method: paymentMethod!,
      amount: selectedBill.total_amount,
      phone_number: phoneNumber || null,
      transaction_reference: transactionRef || `${paymentMethod === 'momo' ? 'MPESA' : paymentMethod === 'airtel_money' ? 'ATM' : 'CASH'}${Date.now()}`,
      payment_status: 'completed' as const,
      processed_by: 5,
      payment_date: new Date().toISOString(),
      table_number: getTableById(mockOrders.find(o => o.order_id === selectedBill.order_id)?.table_id || 0)?.table_number,
      order_id: selectedBill.order_id,
    };
    setPayments(prev => [...prev, newPayment]);
    setView('success');
  };

  const handleDone = () => {
    setView('list');
    setSelectedBill(null);
    setPaymentMethod(null);
    setPaymentStep('select_method');
    setPhoneNumber('');
    setCashTendered('');
    setTransactionRef('');
    setCompletedBill(null);
    setVerificationStatus('idle');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedBill(null);
    setPaymentMethod(null);
    setPaymentStep('select_method');
    setPhoneNumber('');
    setCashTendered('');
    setTransactionRef('');
    setVerificationStatus('idle');
  };

  const navItems = [
    { id: 'bills', label: 'Bills', icon: Receipt, badge: pendingBills.length },
    { id: 'summary', label: 'Summary', icon: BarChart2 },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: notifications.length },
  ];

  // Number to words converter for RWF
  const numberToWords = (num: number): string => {
    if (num === 0) return 'Zero';
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + ones[num % 10] : '');
    if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 !== 0 ? ' ' + numberToWords(num % 100) : '');
    if (num < 1000000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 !== 0 ? ' ' + numberToWords(num % 1000) : '');
    return num.toLocaleString();
  };

  // SUCCESS SCREEN
  if (view === 'success' && completedBill) {
    const order = mockOrders.find(o => o.order_id === completedBill.order_id);
    const table = order ? getTableById(order.table_id) : null;
    const orderItems = order ? mockOrderItems.filter(oi => oi.order_id === order.order_id) : [];
    const receiptNumber = `R-${String(completedBill.bill_id).padStart(3, '0')}`;
    const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    return (
      <div className="min-h-screen bg-[#fff8f0] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-lg w-full"
        >
          {/* Success Animation */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-24 h-24 bg-gradient-to-br from-[#228b22] to-[#34a853] rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_8px_32px_rgba(34,139,34,0.4)]"
            >
              <CheckCircle className="w-14 h-14 text-white" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-[#2c1810] mb-2"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Payment Successful!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-[#8b7355]"
            >
              Transaction completed successfully
            </motion.p>
          </div>

          {/* Receipt */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-[0_12px_48px_rgba(44,24,16,0.2)] overflow-hidden"
          >
            {/* Receipt Header */}
            <div className="bg-gradient-to-br from-[#8b4513] to-[#d2691e] text-white p-6 text-center">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                <Receipt className="w-7 h-7 text-[#8b4513]" />
              </div>
              <h3 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>LA TA BHORE</h3>
              <p className="text-sm text-white/90">KG 123 St, Kigali, Rwanda</p>
              <p className="text-sm text-white/90">Tel: +250 788 123 456</p>
              <p className="text-xs text-white/70 mt-2">TIN: 123456789</p>
            </div>

            {/* Receipt Body */}
            <div className="p-6">
              <div className="border-b-2 border-dashed border-[#e8d5c4] pb-4 mb-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-[#8b7355] font-semibold uppercase">Receipt #</p>
                    <p className="font-bold text-[#2c1810]">{receiptNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#8b7355] font-semibold uppercase">Date & Time</p>
                    <p className="font-bold text-[#2c1810]">May 1, 2026</p>
                    <p className="font-bold text-[#2c1810]">{currentTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#8b7355] font-semibold uppercase">Cashier</p>
                    <p className="font-bold text-[#2c1810]">Patrick</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#8b7355] font-semibold uppercase">Table</p>
                    <p className="font-bold text-[#2c1810]">{table?.table_number}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs font-bold text-[#8b7355] uppercase tracking-wide mb-3">Order #{order?.order_id} — Items:</p>
                <div className="space-y-2">
                  {orderItems.map(oi => {
                    const mi = getMenuItemById(oi.menu_item_id);
                    return (
                      <div key={oi.order_item_id} className="flex justify-between text-sm">
                        <span className="text-[#8b7355]">
                          <span className="font-bold text-[#2c1810]">{oi.quantity}×</span> {mi?.item_name}
                        </span>
                        <span className="font-bold text-[#2c1810]">{formatCurrency(oi.unit_price * oi.quantity)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t-2 border-dashed border-[#e8d5c4] pt-4 space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8b7355]">Subtotal:</span>
                  <span className="font-semibold text-[#2c1810]">{formatCurrency(completedBill.subtotal)}</span>
                </div>
                {completedBill.discount_amount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8b7355]">Discount:</span>
                    <span className="font-semibold text-[#b22222]">-{formatCurrency(completedBill.discount_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-[#8b7355]">Tax (18%):</span>
                  <span className="font-semibold text-[#2c1810]">{formatCurrency(completedBill.tax_amount)}</span>
                </div>
              </div>

              <div className="bg-[#e8f5e9] border-2 border-[#228b22] rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-[#228b22]">TOTAL:</span>
                  <span className="text-3xl font-black text-[#228b22]">{formatCurrency(completedBill.total_amount)}</span>
                </div>
              </div>

              <div className="border-t-2 border-dashed border-[#e8d5c4] pt-4 space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-[#8b7355]">Method:</span>
                  <span className="font-bold text-[#2c1810] capitalize">
                    {completedBill.paymentMethod === 'cash' && '💵 Cash'}
                    {completedBill.paymentMethod === 'momo' && '📱 MTN MoMo'}
                    {completedBill.paymentMethod === 'airtel_money' && '📱 Airtel Money'}
                  </span>
                </div>
                {(completedBill.paymentMethod === 'momo' || completedBill.paymentMethod === 'airtel_money') && (
                  <div className="flex justify-between">
                    <span className="text-sm text-[#8b7355]">Ref:</span>
                    <span className="font-mono text-xs font-bold text-[#2c1810]">{transactionRef || (completedBill.paymentMethod === 'momo' ? 'MPESA2026...' : 'ATM2026...')}</span>
                  </div>
                )}
                {completedBill.paymentMethod === 'cash' && cashTendered && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#8b7355]">Cash Tendered:</span>
                      <span className="font-bold text-[#2c1810]">{formatCurrency(parseFloat(cashTendered))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#8b7355]">Change:</span>
                      <span className="font-bold text-[#228b22]">{formatCurrency(calculateChange())}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-[#8b7355]">Status:</span>
                  <span className="font-bold text-[#228b22]">PAID ✅</span>
                </div>
              </div>

              <div className="border-t-2 border-dashed border-[#e8d5c4] pt-4 text-center">
                <p className="text-sm text-[#8b7355] mb-1">Thank you for dining at</p>
                <p className="text-lg font-bold text-[#2c1810]" style={{ fontFamily: 'Playfair Display, serif' }}>La Ta Bhore!</p>
                <p className="text-sm text-[#8b7355] mt-1">Come again soon! 🥐☕</p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 space-y-3"
          >
            <div className="grid grid-cols-3 gap-3">
              <button className="flex flex-col items-center justify-center gap-2 bg-white border-2 border-[#e8d5c4] text-[#8b7355] py-4 rounded-xl font-semibold hover:bg-[#fff8f0] hover:border-[#8b4513] transition-all">
                <Printer className="w-6 h-6" />
                <span className="text-xs">Print</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-2 bg-white border-2 border-[#e8d5c4] text-[#8b7355] py-4 rounded-xl font-semibold hover:bg-[#fff8f0] hover:border-[#8b4513] transition-all">
                <Send className="w-6 h-6" />
                <span className="text-xs">SMS</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-2 bg-white border-2 border-[#e8d5c4] text-[#8b7355] py-4 rounded-xl font-semibold hover:bg-[#fff8f0] hover:border-[#8b4513] transition-all">
                <Download className="w-6 h-6" />
                <span className="text-xs">PDF</span>
              </button>
            </div>
            <button
              onClick={handleDone}
              className="w-full bg-gradient-to-r from-[#8b4513] to-[#d2691e] text-white py-4 rounded-xl font-bold text-lg hover:shadow-[0_8px_24px_rgba(139,69,19,0.4)] transition-all"
            >
              ✅ Done — Next Customer
            </button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // PAYMENT PROCESSING SCREEN
  if (view === 'payment' && selectedBill) {
    const order = mockOrders.find(o => o.order_id === selectedBill.order_id);
    const table = order ? getTableById(order.table_id) : null;
    const orderItems = order ? mockOrderItems.filter(oi => oi.order_id === order.order_id) : [];

    return (
      <div className="min-h-screen bg-[#fff8f0]">
        {/* Header */}
        <div className="bg-white shadow-[0_2px_8px_rgba(44,24,16,0.06)] px-6 py-4 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={handleBackToList} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#fff8f0] transition-colors text-[#8b7355]">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-[#2c1810]" style={{ fontFamily: 'Playfair Display, serif' }}>Process Payment</h1>
                <p className="text-sm text-[#8b7355]">Bill #{selectedBill.bill_number} · Table {table?.table_number} · Order #{order?.order_id}</p>
              </div>
            </div>
            <button onClick={handleBackToList} className="text-[#8b7355] hover:text-[#b22222] transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 grid lg:grid-cols-5 gap-6">
          {/* Left: Bill Summary (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl p-6 shadow-[0_4px_16px_rgba(44,24,16,0.12)]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b4513] to-[#d2691e] flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-[#2c1810]" style={{ fontFamily: 'Playfair Display, serif' }}>Bill Summary</h2>
              </div>

              <div className="space-y-2 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8b7355] font-semibold">Table:</span>
                  <span className="font-bold text-[#2c1810]">{table?.table_number}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8b7355] font-semibold">Order:</span>
                  <span className="font-bold text-[#2c1810]">#{order?.order_id}</span>
                </div>
              </div>

              <div className="border-t border-[#e8d5c4] pt-4 mb-4">
                <p className="text-xs font-bold text-[#8b7355] uppercase tracking-wide mb-3">Items:</p>
                <div className="space-y-2.5">
                  {orderItems.map(oi => {
                    const mi = getMenuItemById(oi.menu_item_id);
                    return (
                      <div key={oi.order_item_id} className="flex justify-between">
                        <span className="text-sm text-[#8b7355]">
                          <span className="font-bold text-[#2c1810]">{oi.quantity}×</span> {mi?.item_name}
                        </span>
                        <span className="font-bold text-[#2c1810]">{formatCurrency(oi.unit_price * oi.quantity)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t-2 border-[#e8d5c4] pt-4 space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-[#8b7355]">Subtotal</span>
                  <span className="font-semibold text-[#2c1810]">{formatCurrency(selectedBill.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8b7355]">Tax (18%)</span>
                  <span className="font-semibold text-[#2c1810]">{formatCurrency(selectedBill.tax_amount)}</span>
                </div>
                <div className="border-t-2 border-[#8b4513] pt-3 flex justify-between items-center">
                  <span className="text-lg font-bold text-[#2c1810]">GRAND TOTAL</span>
                  <div className="text-right">
                    <p className="text-3xl font-black text-[#8b4513]">{formatCurrency(selectedBill.total_amount)}</p>
                    <p className="text-[10px] text-[#8b7355] mt-1">({numberToWords(selectedBill.total_amount)} Rwandan Francs)</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 bg-[#fff8f0] border-l-4 border-[#ff8c00] rounded-lg p-3 flex gap-2">
                <AlertCircle className="w-5 h-5 text-[#ff8c00] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-[#ff8c00]">Cashier Note:</p>
                  <p className="text-xs text-[#8b7355] mt-1">Verify total amount before processing payment</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Payment Methods (3 cols) */}
          <div className="lg:col-span-3">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl p-6 shadow-[0_4px_16px_rgba(44,24,16,0.12)]">
              <h2 className="text-xl font-bold text-[#2c1810] mb-5" style={{ fontFamily: 'Playfair Display, serif' }}>Select Payment Method</h2>

              <div className="grid gap-4 mb-6">
                {[
                  { method: 'cash' as PaymentMethod, icon: Banknote, label: 'CASH', sublabel: 'Pay with cash', color: '#228b22', bg: 'linear-gradient(135deg, #228b22, #34a853)' },
                  { method: 'momo' as PaymentMethod, icon: Smartphone, label: 'MTN MOMO', sublabel: 'Pay with MoMo', color: '#ffcb05', bg: 'linear-gradient(135deg, #ffcb05, #ffd700)' },
                  { method: 'airtel_money' as PaymentMethod, icon: Smartphone, label: 'AIRTEL MONEY', sublabel: 'Pay with Airtel', color: '#ed1c24', bg: 'linear-gradient(135deg, #ed1c24, #ff4444)' },
                ].map(({ method, icon: Icon, label, sublabel, bg }) => (
                  <motion.button
                    key={method}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setPaymentMethod(method); setPaymentStep('enter_details'); }}
                    className={`p-5 rounded-xl border-3 transition-all flex items-center gap-4 ${
                      paymentMethod === method
                        ? 'border-[#d2691e] bg-[#fff0e0] shadow-[0_0_0_4px_rgba(210,105,30,0.1)]'
                        : 'border-[#e8d5c4] hover:border-[#d2691e] hover:bg-[#fff8f0]'
                    }`}
                  >
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg" style={{ background: bg }}>
                      <Icon className="w-8 h-8" style={{ color: method === 'momo' ? '#1a1a1a' : '#fff' }} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-lg font-black text-[#2c1810]">{label}</p>
                      <p className="text-sm text-[#8b7355]">{sublabel}</p>
                    </div>
                    {paymentMethod === method && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <CheckCircle className="w-8 h-8 text-[#228b22]" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {/* CASH PAYMENT */}
                {paymentMethod === 'cash' && paymentStep === 'enter_details' && (
                  <motion.div
                    key="cash-details"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="border-t-2 border-[#e8d5c4] pt-6 space-y-5"
                  >
                    <div className="bg-[#e8f5e9] border-2 border-[#228b22]/20 rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Banknote className="w-5 h-5 text-[#228b22]" />
                        <p className="text-sm font-bold text-[#228b22]">Cash Payment</p>
                      </div>
                      <p className="text-3xl font-black text-[#228b22]">Amount Due: {formatCurrency(selectedBill.total_amount)}</p>
                      <p className="text-xs text-[#8b7355] mt-1">({numberToWords(selectedBill.total_amount)} Rwandan Francs)</p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[#2c1810] mb-2">Amount Tendered (Cash given by customer):</label>
                      <input
                        type="number"
                        value={cashTendered}
                        onChange={e => setCashTendered(e.target.value)}
                        placeholder="0"
                        className="w-full px-5 py-4 rounded-xl border-2 border-[#e8d5c4] focus:outline-none focus:border-[#228b22] text-2xl font-black text-[#2c1810]"
                      />
                    </div>

                    <div>
                      <p className="text-xs font-bold text-[#8b7355] uppercase tracking-wide mb-2">Quick Amount Buttons:</p>
                      <div className="grid grid-cols-4 gap-2">
                        {[selectedBill.total_amount, 35000, 40000, 50000].map((amt) => (
                          <button
                            key={amt}
                            onClick={() => setCashTendered(amt.toString())}
                            className="py-3 bg-[#fff0e0] text-[#8b4513] rounded-xl font-bold hover:bg-[#d2691e] hover:text-white transition-all shadow-sm hover:shadow-md text-sm"
                          >
                            RWF {(amt / 1000).toFixed(0)}K
                          </button>
                        ))}
                      </div>
                    </div>

                    {cashTendered && parseFloat(cashTendered) >= selectedBill.total_amount && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#e8f5e9] rounded-xl p-5 border-2 border-[#228b22]"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-lg font-bold text-[#228b22]">Change Due:</span>
                          <span className="text-4xl font-black text-[#228b22]">{formatCurrency(calculateChange())}</span>
                        </div>
                        <p className="text-xs text-[#8b7355]">({formatCurrency(parseFloat(cashTendered))} - {formatCurrency(selectedBill.total_amount)})</p>
                      </motion.div>
                    )}

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleBackToList}
                        className="flex-1 py-4 border-2 border-[#e8d5c4] text-[#8b7355] rounded-xl font-bold hover:border-[#8b4513] hover:text-[#2c1810] transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleProcessPayment}
                        disabled={!cashTendered || parseFloat(cashTendered) < selectedBill.total_amount}
                        className="flex-1 py-4 bg-[#228b22] text-white rounded-xl font-black text-lg hover:bg-[#1a6b1a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_4px_16px_rgba(34,139,34,0.4)]"
                      >
                        ✓ Confirm Cash Payment
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* MOMO/AIRTEL PAYMENT */}
                {(paymentMethod === 'momo' || paymentMethod === 'airtel_money') && paymentStep === 'enter_details' && (
                  <motion.div
                    key="mobile-details"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="border-t-2 border-[#e8d5c4] pt-6 space-y-5"
                  >
                    <div className={`rounded-xl p-5 border-2 ${paymentMethod === 'momo' ? 'bg-[#ffcb05]/10 border-[#ffcb05]/30' : 'bg-[#ed1c24]/10 border-[#ed1c24]/30'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Smartphone className="w-5 h-5" style={{ color: paymentMethod === 'momo' ? '#1a1a1a' : '#ed1c24' }} />
                        <p className="text-sm font-bold" style={{ color: paymentMethod === 'momo' ? '#1a1a1a' : '#ed1c24' }}>
                          {paymentMethod === 'momo' ? 'MTN Mobile Money' : 'Airtel Money'} Payment
                        </p>
                      </div>
                      <p className="text-2xl font-black" style={{ color: paymentMethod === 'momo' ? '#1a1a1a' : '#ed1c24' }}>
                        Amount to Charge: {formatCurrency(selectedBill.total_amount)}
                      </p>
                    </div>

                    <div className="bg-[#fff8f0] border border-[#e8d5c4] rounded-xl p-4">
                      <p className="text-xs font-bold text-[#8b4513] mb-2">— METHOD 1: Send Payment Request —</p>
                      <p className="text-xs text-[#8b7355] mb-3">Customer will receive a prompt on their phone</p>
                      <div>
                        <label className="block text-sm font-bold text-[#2c1810] mb-2">Customer Phone Number:</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8b7355]" />
                          <input
                            type="tel"
                            value={phoneNumber}
                            onChange={e => setPhoneNumber(e.target.value)}
                            placeholder="+250 788 123 456"
                            className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-[#e8d5c4] focus:outline-none focus:border-[#8b4513] text-lg font-semibold"
                          />
                        </div>
                      </div>
                      {phoneNumber && phoneNumber.length >= 10 && (
                        <button
                          onClick={() => {
                            setPaymentStep('verify');
                            handleVerifyTransaction();
                          }}
                          className="w-full mt-3 py-3 rounded-xl font-bold text-white transition-all"
                          style={{ background: paymentMethod === 'momo' ? '#ffcb05' : '#ed1c24', color: paymentMethod === 'momo' ? '#1a1a1a' : '#fff' }}
                        >
                          Send Payment Request to Customer
                        </button>
                      )}
                    </div>

                    <div className="text-center">
                      <p className="text-sm font-bold text-[#8b7355]">— OR —</p>
                    </div>

                    <div className="bg-[#fff8f0] border border-[#e8d5c4] rounded-xl p-4">
                      <p className="text-xs font-bold text-[#8b4513] mb-2">— METHOD 2: Enter Transaction Reference —</p>
                      <p className="text-xs text-[#8b7355] mb-3">(Customer already paid and shows you reference)</p>
                      <div>
                        <label className="block text-sm font-bold text-[#2c1810] mb-2">Transaction Reference:</label>
                        <input
                          type="text"
                          value={transactionRef}
                          onChange={e => setTransactionRef(e.target.value)}
                          placeholder={paymentMethod === 'momo' ? 'MPESA20260501T094500' : 'ATM20260501T094500'}
                          className="w-full px-4 py-3 rounded-xl border-2 border-[#e8d5c4] focus:outline-none focus:border-[#8b4513] text-lg font-mono"
                        />
                      </div>
                      {transactionRef && (
                        <button
                          onClick={() => {
                            setPaymentStep('verify');
                            handleVerifyTransaction();
                          }}
                          className="w-full mt-3 py-3 bg-[#228b22] text-white rounded-xl font-bold hover:bg-[#1a6b1a] transition-colors"
                        >
                          Verify Transaction
                        </button>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleBackToList}
                        className="flex-1 py-4 border-2 border-[#e8d5c4] text-[#8b7355] rounded-xl font-bold hover:border-[#8b4513] hover:text-[#2c1810] transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* VERIFICATION STEP */}
                {(paymentMethod === 'momo' || paymentMethod === 'airtel_money') && paymentStep === 'verify' && (
                  <motion.div
                    key="verification"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="border-t-2 border-[#e8d5c4] pt-6 space-y-5"
                  >
                    {verificationStatus === 'verifying' && (
                      <div className="bg-[#fff8f0] rounded-xl p-8 text-center">
                        <div className="w-16 h-16 border-4 border-[#e8d5c4] border-t-[#d2691e] rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-lg font-bold text-[#2c1810]">Verifying transaction...</p>
                        <p className="text-sm text-[#8b7355] mt-2">Please wait</p>
                      </div>
                    )}

                    {verificationStatus === 'verified' && (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-[#e8f5e9] border-2 border-[#228b22] rounded-xl p-6"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-full bg-[#228b22] flex items-center justify-center">
                            <CheckCircle className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <p className="text-lg font-black text-[#228b22]">Transaction Verified!</p>
                            <p className="text-sm text-[#8b7355]">Payment details confirmed</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-[#8b7355]">Amount:</span>
                            <span className="font-bold text-[#2c1810]">{formatCurrency(selectedBill.total_amount)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#8b7355]">From:</span>
                            <span className="font-bold text-[#2c1810]">{phoneNumber || '+250 788 123 456'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#8b7355]">Reference:</span>
                            <span className="font-mono font-bold text-[#2c1810]">{transactionRef || (paymentMethod === 'momo' ? 'MPESA20260501T094500' : 'ATM20260501T094500')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#8b7355]">Time:</span>
                            <span className="font-bold text-[#2c1810]">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}, May 1, 2026</span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleBackToList}
                        className="flex-1 py-4 border-2 border-[#e8d5c4] text-[#8b7355] rounded-xl font-bold hover:border-[#8b4513] hover:text-[#2c1810] transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleProcessPayment}
                        disabled={verificationStatus !== 'verified'}
                        className={`flex-1 py-4 rounded-xl font-black text-lg transition-all shadow-[0_4px_16px_rgba(34,139,34,0.4)] ${
                          verificationStatus === 'verified'
                            ? 'bg-[#228b22] text-white hover:bg-[#1a6b1a]'
                            : 'bg-[#e8d5c4] text-[#c4a882] cursor-not-allowed'
                        }`}
                      >
                        ✓ Confirm {paymentMethod === 'momo' ? 'MoMo' : 'Airtel'} Payment
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // MAIN LIST VIEW
  return (
    <StaffLayout
      role="cashier"
      userName="Patrick Habimana"
      activeTab={navTab}
      setActiveTab={setNavTab}
      navItems={navItems}
      onLogout={onLogout || (() => {})}
    >
    <div className="min-h-screen bg-[#fff8f0]">
      {/* Header */}
      <div className="bg-white shadow-[0_2px_8px_rgba(44,24,16,0.06)] px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#2c1810]" style={{ fontFamily: 'Playfair Display, serif' }}>Cashier Terminal</h1>
            <p className="text-sm text-[#8b7355]">Friday, May 1, 2026 · Morning Shift · Patrick Habimana</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Revenue Tracker - Always Visible */}
            <div className="hidden lg:flex items-center gap-3 bg-[#e8f5e9] border border-[#228b22]/20 rounded-xl px-4 py-2">
              <DollarSign className="w-5 h-5 text-[#228b22]" />
              <div>
                <p className="text-[10px] text-[#8b7355] font-bold uppercase">Today's Total</p>
                <p className="text-xl font-black text-[#228b22]">{formatCurrency(todayTotal)}</p>
              </div>
            </div>
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-[#fff8f0] hover:bg-white transition-colors text-[#8b7355]"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#ff8c00] text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-[0_12px_48px_rgba(44,24,16,0.18)] border border-[#e8d5c4] overflow-hidden z-20"
                    >
                      <div className="bg-gradient-to-r from-[#8b4513] to-[#d2691e] text-white px-4 py-3">
                        <h3 className="font-bold">🔔 Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map(notif => (
                          <div key={notif.id} className="border-b border-[#e8d5c4] p-4 hover:bg-[#fff8f0] transition-colors">
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-2 ${notif.type === 'new_bill' ? 'bg-[#ff8c00]' : 'bg-[#228b22]'}`} />
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-[#2c1810]">{notif.message}</p>
                                {notif.amount && <p className="text-xs font-bold text-[#8b4513] mt-1">{formatCurrency(notif.amount)}</p>}
                                <p className="text-xs text-[#8b7355] mt-1">{notif.time}</p>
                              </div>
                              {notif.type === 'new_bill' && notif.bill_id && (
                                <button
                                  onClick={() => {
                                    const bill = bills.find(b => b.bill_id === notif.bill_id);
                                    if (bill) {
                                      setSelectedBill(bill);
                                      setView('payment');
                                      setShowNotifications(false);
                                    }
                                  }}
                                  className="text-xs bg-[#d2691e] text-white px-3 py-1 rounded-lg font-bold hover:bg-[#8b4513] transition-colors"
                                >
                                  Process
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-2 text-[#228b22]">
              <div className="w-2 h-2 rounded-full bg-[#228b22] animate-pulse" />
              <span className="text-sm font-semibold hidden sm:inline">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Tracker Bar - Always Visible */}
      <div className="max-w-7xl mx-auto px-6 pt-6 pb-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#8b4513] to-[#d2691e] rounded-2xl p-5 shadow-[0_8px_32px_rgba(139,69,19,0.3)]"
        >
          <p className="text-white/80 text-sm font-bold uppercase tracking-wide mb-3">💰 Today's Revenue Tracker</p>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "💵 CASH", value: cashTotal, count: cashCount, color: "bg-white/20" },
              { label: "📱 MOMO", value: momoTotal, count: momoCount, color: "bg-white/20" },
              { label: "📱 AIRTEL", value: airtelTotal, count: airtelCount, color: "bg-white/20" },
              { label: "💰 GRAND TOTAL", value: todayTotal, count: payments.length, color: "bg-white" },
            ].map(({ label, value, count, color }) => (
              <div key={label} className={`${color} rounded-xl p-4 ${color === 'bg-white' ? 'border-2 border-white/40' : ''}`}>
                <p className={`text-xs font-bold uppercase tracking-wide mb-1 ${color === 'bg-white' ? 'text-[#8b4513]' : 'text-white/70'}`}>{label}</p>
                <p className={`text-2xl font-black mb-1 ${color === 'bg-white' ? 'text-[#8b4513]' : 'text-white'}`}>
                  {formatCurrency(value)}
                </p>
                <p className={`text-xs font-semibold ${color === 'bg-white' ? 'text-[#8b7355]' : 'text-white/60'}`}>
                  {count} payment{count !== 1 ? 's' : ''}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Pending Bills", value: pendingBills.length, color: "#ff8c00", icon: Clock, sublabel: "Awaiting payment" },
            { label: "Bills Processed", value: paidBills.length, color: "#228b22", icon: CheckCircle, sublabel: "Completed today" },
            { label: "Average Bill", value: formatCurrency(avgBill), color: "#8b4513", icon: TrendingUp, sublabel: "Per transaction" },
            { label: "Largest Bill", value: formatCurrency(largestBill), color: "#d2691e", icon: Receipt, sublabel: "Today's highest" },
          ].map(({ label, value, color, icon: Icon, sublabel }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-5 shadow-[0_2px_12px_rgba(44,24,16,0.08)] hover:shadow-[0_4px_20px_rgba(44,24,16,0.12)] transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: color + '15' }}>
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[#8b7355] font-semibold">{label}</p>
                  <p className="text-[10px] text-[#c4a882]">{sublabel}</p>
                </div>
              </div>
              <p className="font-black text-[#2c1810] text-2xl">{typeof value === 'number' && value < 100 ? value : value}</p>
            </motion.div>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 bg-white rounded-xl border border-[#e8d5c4] px-4 py-3 mb-4 shadow-[0_1px_4px_rgba(44,24,16,0.04)]">
          <Search className="w-5 h-5 text-[#8b7355]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by table, bill number, or order..." className="flex-1 bg-transparent outline-none text-sm text-[#2c1810] placeholder:text-[#c4a882]" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'pending', label: `Pending`, count: pendingBills.length, icon: Clock, color: '#ff8c00' },
            { id: 'paid', label: `Paid Today`, count: paidBills.length, icon: CheckCircle, color: '#228b22' },
            { id: 'history', label: 'Payment History', icon: List, color: '#8b4513' },
            { id: 'summary', label: "Today's Summary", icon: BarChart2, color: '#d2691e' },
          ].map(({ id, label, count, icon: Icon, color }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as CashierTab)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                activeTab === id
                  ? 'bg-gradient-to-r from-[#8b4513] to-[#d2691e] text-white shadow-[0_4px_16px_rgba(139,69,19,0.3)]'
                  : 'bg-white text-[#8b7355] border-2 border-[#e8d5c4] hover:border-[#8b4513]'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
              {count !== undefined && (
                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-black ${
                  activeTab === id ? 'bg-white/20 text-white' : 'bg-[#fff0e0] text-[#8b4513]'
                }`}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* PENDING BILLS */}
        {activeTab === 'pending' && (
          <div className="space-y-4">
            {pendingBills.filter(b => !search || b.bill_number.toLowerCase().includes(search.toLowerCase()) || getTableById(mockOrders.find(o => o.order_id === b.order_id)?.table_id || 0)?.table_number.toLowerCase().includes(search.toLowerCase())).map((bill, idx) => {
              const order = mockOrders.find(o => o.order_id === bill.order_id);
              const table = order ? getTableById(order.table_id) : null;
              const waitingMinutes = Math.floor(Math.random() * 10) + 1; // Mock waiting time
              const orderItems = order ? mockOrderItems.filter(oi => oi.order_id === order.order_id) : [];
              return (
                <motion.div
                  key={bill.bill_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`bg-white rounded-xl p-6 shadow-[0_2px_12px_rgba(44,24,16,0.08)] hover:shadow-[0_8px_32px_rgba(44,24,16,0.15)] transition-all border-2 ${
                    waitingMinutes > 7 ? 'border-[#ff8c00]' : 'border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      {/* Table Badge */}
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8b4513] to-[#d2691e] flex items-center justify-center shadow-lg">
                          <span className="text-white font-black text-xl">{table?.table_number}</span>
                        </div>
                        {waitingMinutes > 7 && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#ff8c00] rounded-full flex items-center justify-center animate-pulse">
                            <span className="text-white text-xs font-black">!</span>
                          </div>
                        )}
                      </div>

                      {/* Bill Details */}
                      <div>
                        <p className="text-xl font-bold text-[#2c1810]" style={{ fontFamily: 'Playfair Display, serif' }}>
                          Table {table?.table_number}
                        </p>
                        <p className="text-sm text-[#8b7355] mt-1">
                          Order #{order?.order_id} · Bill {bill.bill_number}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className={`flex items-center gap-1 ${waitingMinutes > 7 ? 'text-[#ff8c00]' : 'text-[#8b7355]'}`}>
                            <Clock className="w-4 h-4" />
                            <span className="text-xs font-bold">Waiting {waitingMinutes} min</span>
                          </div>
                          <div className="flex items-center gap-1 text-[#8b7355]">
                            <Receipt className="w-4 h-4" />
                            <span className="text-xs font-semibold">{orderItems.length} items</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Amount & Action */}
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xs text-[#8b7355] font-bold uppercase tracking-wide mb-1">Total Amount</p>
                        <p className="text-4xl font-black text-[#8b4513]">{formatCurrency(bill.total_amount)}</p>
                        <p className="text-[10px] text-[#c4a882] mt-1">({numberToWords(bill.total_amount).slice(0, 30)}...)</p>
                      </div>
                      <button
                        onClick={() => { setSelectedBill(bill); setView('payment'); }}
                        className="bg-gradient-to-r from-[#d2691e] to-[#ff8c00] text-white px-8 py-4 rounded-xl font-black hover:shadow-[0_8px_24px_rgba(210,105,30,0.4)] transition-all text-sm"
                      >
                        PROCESS →
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            {pendingBills.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-16 text-center shadow-[0_4px_20px_rgba(44,24,16,0.12)]"
              >
                <div className="w-24 h-24 bg-[#e8f5e9] rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-14 h-14 text-[#228b22]" />
                </div>
                <h3 className="text-2xl font-bold text-[#2c1810] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  All Clear!
                </h3>
                <p className="text-[#8b7355]">No pending bills at the moment</p>
                <p className="text-sm text-[#c4a882] mt-2">New bills will appear here automatically</p>
              </motion.div>
            )}
          </div>
        )}

        {/* PAID TODAY */}
        {activeTab === 'paid' && (
          <div className="space-y-3">
            {paidBills.map(bill => {
              const order = mockOrders.find(o => o.order_id === bill.order_id);
              const table = order ? getTableById(order.table_id) : null;
              const payment = payments.find(p => p.bill_id === bill.bill_id);
              return (
                <div key={bill.bill_id} className="bg-white rounded-xl p-5 shadow-[0_2px_12px_rgba(44,24,16,0.08)] flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#228b22]/10 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-[#228b22]" />
                    </div>
                    <div>
                      <p className="font-bold text-[#2c1810]">Table {table?.table_number} — Order #{order?.order_id}</p>
                      <p className="text-sm text-[#8b7355]">{bill.bill_number} · Paid at {bill.paid_at ? new Date(bill.paid_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-[#228b22] text-xl">{formatCurrency(bill.total_amount)}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#228b22]/10 text-[#228b22] font-semibold capitalize">{payment?.payment_method?.replace('_', ' ') || 'cash'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* HISTORY */}
        {activeTab === 'history' && (
          <div>
            <div className="bg-white rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(44,24,16,0.08)]">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#fff8f0] border-b border-[#e8d5c4]">
                    {['Time', 'Order #', 'Table', 'Amount', 'Method', 'Status'].map(h => (
                      <th key={h} className="text-left py-3 px-5 text-sm font-bold text-[#8b7355]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p.payment_id} className="border-b border-[#f5f0ea] hover:bg-[#fff8f0] transition-colors">
                      <td className="py-3 px-5 text-sm text-[#8b7355]">{new Date(p.payment_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="py-3 px-5 text-sm font-semibold text-[#2c1810]">#{p.order_id}</td>
                      <td className="py-3 px-5 text-sm text-[#2c1810]">{p.table_number}</td>
                      <td className="py-3 px-5 text-sm font-bold text-[#8b4513]">{formatCurrency(p.amount)}</td>
                      <td className="py-3 px-5">
                        <span className={`text-xs px-2 py-1 rounded-full font-bold capitalize ${p.payment_method === 'cash' ? 'bg-[#228b22]/10 text-[#228b22]' : p.payment_method === 'momo' ? 'bg-[#ffcb05]/20 text-[#8b6e00]' : 'bg-[#ed1c24]/10 text-[#ed1c24]'}`}>
                          {p.payment_method.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-5"><span className="text-xs px-2 py-1 rounded-full bg-[#228b22] text-white font-bold">completed</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TODAY'S SUMMARY */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            {/* Revenue Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(44,24,16,0.12)]"
            >
              <h3 className="text-xl font-bold text-[#2c1810] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                💰 Revenue Breakdown
              </h3>
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Pie Chart Representation */}
                <div className="flex items-center justify-center">
                  <div className="relative w-64 h-64">
                    {/* Simple pie chart representation */}
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      {/* Cash - Green */}
                      <circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke="#228b22"
                        strokeWidth="40"
                        strokeDasharray={`${(cashTotal / todayTotal) * 502} 502`}
                        transform="rotate(-90 100 100)"
                      />
                      {/* MoMo - Yellow */}
                      <circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke="#ffcb05"
                        strokeWidth="40"
                        strokeDasharray={`${(momoTotal / todayTotal) * 502} 502`}
                        strokeDashoffset={`-${(cashTotal / todayTotal) * 502}`}
                        transform="rotate(-90 100 100)"
                      />
                      {/* Airtel - Red */}
                      <circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke="#ed1c24"
                        strokeWidth="40"
                        strokeDasharray={`${(airtelTotal / todayTotal) * 502} 502`}
                        strokeDashoffset={`-${((cashTotal + momoTotal) / todayTotal) * 502}`}
                        transform="rotate(-90 100 100)"
                      />
                      <circle cx="100" cy="100" r="55" fill="white" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <p className="text-xs text-[#8b7355] font-bold uppercase">Total</p>
                      <p className="text-xl font-black text-[#8b4513]">{formatCurrency(todayTotal)}</p>
                    </div>
                  </div>
                </div>

                {/* Legend & Breakdown */}
                <div className="space-y-4">
                  {[
                    { label: "Cash", value: cashTotal, count: cashCount, color: "#228b22", percent: Math.round((cashTotal / todayTotal) * 100) },
                    { label: "MTN MoMo", value: momoTotal, count: momoCount, color: "#ffcb05", percent: Math.round((momoTotal / todayTotal) * 100) },
                    { label: "Airtel Money", value: airtelTotal, count: airtelCount, color: "#ed1c24", percent: Math.round((airtelTotal / todayTotal) * 100) },
                  ].map(({ label, value, count, color, percent }) => (
                    <div key={label} className="bg-[#fff8f0] rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full" style={{ background: color }} />
                          <span className="font-bold text-[#2c1810]">{label}</span>
                        </div>
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-white text-[#8b7355]">{percent}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-[#2c1810]">{formatCurrency(value)}</span>
                        <span className="text-sm text-[#8b7355]">{count} payment{count !== 1 ? 's' : ''}</span>
                      </div>
                      {/* Progress bar */}
                      <div className="mt-2 h-2 bg-white rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${percent}%`, background: color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Hourly Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(44,24,16,0.12)]"
            >
              <h3 className="text-xl font-bold text-[#2c1810] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                📈 Hourly Breakdown
              </h3>
              <div className="space-y-3">
                {[
                  { hour: "08:00 AM", amount: 85000, bars: 12 },
                  { hour: "09:00 AM", amount: 145000, bars: 20 },
                  { hour: "10:00 AM", amount: 110000, bars: 15 },
                  { hour: "11:00 AM", amount: 65000, bars: 9 },
                  { hour: "12:00 PM", amount: 20800, bars: 3, current: true },
                ].map(({ hour, amount, bars, current }) => (
                  <div key={hour} className="flex items-center gap-4">
                    <span className={`text-sm font-bold w-24 ${current ? 'text-[#d2691e]' : 'text-[#8b7355]'}`}>{hour}</span>
                    <div className="flex-1 bg-[#fff8f0] rounded-lg overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(bars / 20) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className={`h-8 rounded-lg flex items-center justify-end pr-3 ${current ? 'bg-gradient-to-r from-[#d2691e] to-[#ff8c00]' : 'bg-gradient-to-r from-[#8b4513] to-[#d2691e]'}`}
                      >
                        <span className="text-sm font-bold text-white">{formatCurrency(amount)}</span>
                      </motion.div>
                    </div>
                    {current && <span className="text-xs font-bold text-[#ff8c00] bg-[#fff0e0] px-2 py-1 rounded-full">In Progress</span>}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Stats Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Shift Totals */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(44,24,16,0.12)]"
              >
                <h3 className="text-lg font-bold text-[#2c1810] mb-4 flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-[#d2691e]" />
                  Shift Statistics
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Total Transactions", value: payments.length },
                    { label: "Average Bill", value: formatCurrency(avgBill) },
                    { label: "Largest Bill", value: formatCurrency(largestBill) },
                    { label: "Smallest Bill", value: formatCurrency(smallestBill) },
                    { label: "Cash Float Used", value: formatCurrency(cashTotal) },
                    { label: "Mobile Money Total", value: formatCurrency(momoTotal + airtelTotal) },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center py-2 border-b border-[#f5f0ea] last:border-0">
                      <span className="text-sm text-[#8b7355] font-semibold">{label}</span>
                      <span className="font-black text-[#2c1810]">{value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Shift Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(44,24,16,0.12)]"
              >
                <h3 className="text-lg font-bold text-[#2c1810] mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#d2691e]" />
                  Shift Information
                </h3>
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-[#8b4513] to-[#d2691e] rounded-xl p-4 text-white">
                    <p className="text-xs text-white/70 uppercase tracking-wide mb-1">Cashier on Duty</p>
                    <p className="text-xl font-bold">Patrick Habimana</p>
                    <p className="text-sm text-white/80 mt-2">Employee ID: #005</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#8b7355]">Shift Start</span>
                      <span className="font-bold text-[#2c1810]">07:00 AM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#8b7355]">Current Time</span>
                      <span className="font-bold text-[#2c1810]">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#8b7355]">Shift Duration</span>
                      <span className="font-bold text-[#2c1810]">5 hours</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-[#e8d5c4]">
                      <span className="text-sm text-[#8b7355]">Estimated End</span>
                      <span className="font-bold text-[#2c1810]">03:00 PM</span>
                    </div>
                  </div>
                  <button className="w-full mt-4 py-3 bg-[#fff8f0] border-2 border-[#e8d5c4] text-[#8b4513] rounded-xl font-bold hover:bg-[#fff0e0] hover:border-[#8b4513] transition-all">
                    <FileText className="w-4 h-4 inline mr-2" />
                    Export Shift Report
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
    </StaffLayout>
  );
}
