import { useLocation, useNavigate } from 'react-router-dom';
import type { BillResponse } from '../../types';
import { CashPaymentForm } from '../../components/cashier/CashPaymentForm';
import { MoMoPaymentForm } from '../../components/cashier/MoMoPaymentForm';
import { AirtelPaymentForm } from '../../components/cashier/AirtelPaymentForm';
import { useState } from 'react';
import { paymentsApi } from '../../api/payments';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { formatCurrency } from '../../utils/format';
import { CreditCard, Banknote, Smartphone, Receipt, ArrowLeft } from 'lucide-react';
import { cn } from '../../utils/classNames';

export function PaymentProcessingPage() {
  const loc = useLocation() as { state?: { bill?: BillResponse } };
  const nav = useNavigate();
  const bill = loc.state?.bill;
  const qc = useQueryClient();
  const [mode, setMode] = useState<'cash' | 'momo' | 'airtel'>('cash');
  const [tendered, setTendered] = useState('');
  const [phone, setPhone] = useState('');

  const cash = useMutation({
    mutationFn: () =>
      paymentsApi.payCash({ billId: bill!.billId, amountTendered: Number(tendered || 0) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payments'] });
      nav('/cashier/history');
    },
  });
  const momo = useMutation({
    mutationFn: () =>
      paymentsApi.payMoMo({
        billId: bill!.billId,
        phoneNumber: phone,
        amount: Number(bill?.totalAmount ?? 0),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payments'] });
      nav('/cashier/history');
    },
  });
  const airtel = useMutation({
    mutationFn: () =>
      paymentsApi.payAirtel({
        billId: bill!.billId,
        phoneNumber: phone,
        amount: Number(bill?.totalAmount ?? 0),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payments'] });
      nav('/cashier/history');
    },
  });

  if (!bill) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-24 h-24 bg-bg rounded-full flex items-center justify-center mb-6">
          <Receipt size={48} className="text-border" />
        </div>
        <h2 className="text-2xl font-bold text-textPrimary mb-2" style={{ fontFamily: 'Playfair Display' }}>
          No bill selected
        </h2>
        <p className="text-textSecondary mb-8">Select a bill from the pending bills queue to process payment.</p>
        <button 
          onClick={() => nav('/cashier/bills')}
          className="bg-primary text-white px-8 py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"
        >
          <ArrowLeft size={18} /> View Pending Bills
        </button>
      </div>
    );
  }

  const paymentModes = [
    { id: 'cash', label: 'Cash', icon: Banknote },
    { id: 'momo', label: 'MTN MoMo', icon: Smartphone },
    { id: 'airtel', label: 'Airtel Money', icon: Smartphone }
  ] as const;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => nav(-1)} className="p-3 bg-white border border-border rounded-2xl hover:bg-bg transition-colors">
          <ArrowLeft size={20} className="text-textPrimary" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-textPrimary" style={{ fontFamily: 'Playfair Display' }}>Process Payment</h2>
          <p className="text-sm font-bold text-textSecondary uppercase tracking-widest">Bill #{bill.billNumber ?? bill.billId}</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
        <div className="p-8 bg-primary text-white">
          <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Total Amount Due</p>
          <h1 className="text-5xl font-black">{formatCurrency(bill.totalAmount)}</h1>
          <div className="mt-4 inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase">
            Table {bill.tableNumber}
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div>
            <h3 className="text-sm font-bold text-textPrimary mb-4">Select Payment Method</h3>
            <div className="grid grid-cols-3 gap-4">
              {paymentModes.map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id as any)}
                    className={cn(
                      "p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all",
                      mode === m.id 
                        ? "border-primary bg-primary/5 text-primary" 
                        : "border-border bg-white text-textSecondary hover:border-border hover:bg-bg"
                    )}
                  >
                    <Icon size={24} />
                    <span className="text-xs font-bold uppercase tracking-widest">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-bg rounded-3xl p-6 border border-border">
            {mode === 'cash' && (
              <CashPaymentForm
                total={Number(bill.totalAmount)}
                tendered={tendered}
                onTendered={setTendered}
                onSubmit={() => cash.mutate()}
              />
            )}
            {mode === 'momo' && <MoMoPaymentForm phone={phone} onPhone={setPhone} onSubmit={() => momo.mutate()} />}
            {mode === 'airtel' && <AirtelPaymentForm phone={phone} onPhone={setPhone} onSubmit={() => airtel.mutate()} />}
          </div>
        </div>
      </div>
    </div>
  );
}
