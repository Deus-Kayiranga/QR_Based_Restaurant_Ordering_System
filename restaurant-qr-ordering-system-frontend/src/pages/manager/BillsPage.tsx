import React, { useState } from 'react';
import { usePendingBills } from '../../hooks/usePayments';
import { useQuery } from '@tanstack/react-query';
import { paymentsApi } from '../../api/payments';
import { PageHeader } from '../../components/common/PageHeader';
import { formatCurrency, formatDate } from '../../utils/format';
import { 
  Receipt, 
  Search, 
  Filter, 
  ArrowUpRight, 
  DollarSign, 
  Clock, 
  CreditCard,
  Banknote,
  Smartphone,
  ChevronRight,
  Download,
  Calendar,
  TrendingUp,
  PieChart,
  ArrowRight,
  Info,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../../utils/classNames';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';

export function BillsPage() {
  const { data: pendingRes, isLoading: pendingLoading } = usePendingBills();
  const { data: summaryRes } = useQuery({
    queryKey: ['todaySummary'],
    queryFn: () => paymentsApi.getTodaySummary(),
  });

  const [search, setSearch] = useState('');

  const pendingBills = (pendingRes || []).filter(b => 
    b.tableNumber?.toLowerCase().includes(search.toLowerCase()) ||
    b.billNumber?.toLowerCase().includes(search.toLowerCase())
  );
  
  const summary = summaryRes || { total: 0, cash: 0, momo: 0, airtel: 0, count: 0 };

  return (
    <div className="space-y-10 animate-fadeIn pb-20 p-6 bg-[#FFF8F0] min-h-screen">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-[#2C1810] rounded-2xl flex items-center justify-center text-white shadow-xl">
              <Receipt size={28} />
            </div>
            <h1 className="text-4xl font-black text-[#2C1810]" style={{ fontFamily: 'Playfair Display' }}>Financial Console</h1>
          </div>
          <p className="text-[#8B7355] font-medium text-lg max-w-2xl">Manage real-time transactions, monitor pending settlements, and analyze revenue streams.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-[#E8D5C4] text-[#2C1810] rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-[#F5E6D3] transition-all shadow-md active:scale-95">
            <Calendar size={18} className="text-[#8B4513]" />
            Past 24 Hours
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-[#2C1810] text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-[#2C1810]/20 active:scale-95">
            <Download size={18} />
            Export Data
          </button>
        </div>
      </header>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Today's Gross", value: formatCurrency(summary.total), icon: TrendingUp, color: 'text-[#228B22]', bg: 'bg-[#228B22]/5', sub: '+12.4% vs yesterday' },
          { label: 'Pending Volume', value: pendingBills.length, icon: Clock, color: 'text-[#D2691E]', bg: 'bg-[#D2691E]/5', sub: 'Awaiting settlement' },
          { label: 'Success Rate', value: '98.2%', icon: PieChart, color: 'text-[#2B6CB0]', bg: 'bg-[#2B6CB0]/5', sub: 'Transaction health' },
          { label: 'Avg. Ticket', value: formatCurrency(summary.count > 0 ? summary.total / summary.count : 0), icon: DollarSign, color: 'text-[#8B4513]', bg: 'bg-[#8B4513]/5', sub: 'Per table average' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-[2.5rem] p-8 border-2 border-[#E8D5C4] shadow-sm flex flex-col justify-between group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className={cn("p-4 rounded-2xl transition-transform group-hover:scale-110 shadow-sm border border-[#E8D5C4]/30", s.bg)}>
                <s.icon className={s.color} size={28} />
              </div>
              <div className="bg-[#FFF8F0] p-2 rounded-full text-[#8B7355] hover:text-[#2C1810] transition-colors cursor-pointer">
                <ArrowUpRight size={18} />
              </div>
            </div>
            <div>
              <div className="text-[10px] font-black text-[#8B7355] uppercase tracking-[0.2em] mb-2">{s.label}</div>
              <div className="text-3xl font-black text-[#2C1810] mb-2">{s.value}</div>
              <div className="text-xs font-bold text-[#8B7355]/60 flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-[#8B4513]/30 rounded-full" />
                {s.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Settlement Queue */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between bg-white p-6 rounded-[2rem] border-2 border-[#E8D5C4] shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#D2691E]/10 rounded-xl flex items-center justify-center text-[#D2691E]">
                <Clock size={20} />
              </div>
              <h2 className="text-2xl font-black text-[#2C1810]" style={{ fontFamily: 'Playfair Display' }}>Pending Settlement</h2>
            </div>
            
            <div className="relative w-64 hidden sm:block">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B7355]" />
              <input 
                type="text" 
                placeholder="Search tables..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#FFF8F0] border border-[#E8D5C4] rounded-xl py-2.5 pl-12 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-[#8B4513]/20 transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
            {pendingLoading ? (
              [1,2,3,4].map(i => <LoadingSkeleton key={i} className="h-28 rounded-[2.5rem]" />)
            ) : pendingBills.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-[#E8D5C4] rounded-[3rem] p-20 text-center shadow-inner">
                <div className="w-20 h-20 bg-[#228B22]/5 rounded-full flex items-center justify-center mx-auto mb-6 text-[#228B22]">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-black text-[#2C1810]">All Cleared</h3>
                <p className="text-[#8B7355] mt-2 font-medium">All active tables have been successfully settled.</p>
              </div>
            ) : (
              pendingBills.map((bill) => (
                <div key={bill.billId} className="bg-white rounded-[2.5rem] border-2 border-[#E8D5C4] p-6 flex items-center justify-between hover:shadow-xl hover:border-[#8B4513]/20 transition-all group relative overflow-hidden">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-[#2C1810]/5 rounded-3xl flex flex-col items-center justify-center border-2 border-[#E8D5C4] group-hover:bg-[#2C1810] group-hover:border-[#2C1810] transition-all duration-300">
                      <span className="text-[9px] font-black text-[#8B7355] uppercase leading-none mb-1 group-hover:text-white/50 transition-colors">Table</span>
                      <span className="text-2xl font-black text-[#2C1810] leading-none group-hover:text-white transition-colors">{bill.tableNumber}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-[#8B7355] uppercase tracking-[0.2em]">Transaction Record</span>
                        <span className="px-2 py-0.5 bg-[#FFF8F0] text-[9px] font-black text-[#8B4513] rounded border border-[#E8D5C4]">BILL #{bill.billNumber?.slice(-6) || bill.billId}</span>
                      </div>
                      <div className="text-2xl font-black text-[#2C1810]">{formatCurrency(Number(bill.totalAmount))}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <div className="text-[10px] font-black text-[#8B7355] uppercase tracking-widest mb-1">Status</div>
                      <div className="flex items-center gap-2 justify-end">
                        <div className="w-2 h-2 bg-[#D2691E] rounded-full animate-pulse" />
                        <span className="text-xs font-black text-[#D2691E] uppercase tracking-widest">{bill.billStatus}</span>
                      </div>
                    </div>
                    <button className="w-12 h-12 rounded-2xl bg-[#FFF8F0] border border-[#E8D5C4] flex items-center justify-center text-[#2C1810] hover:bg-[#2C1810] hover:text-white transition-all shadow-sm active:scale-90">
                      <ChevronRight size={24} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Breakdown Panel */}
        <div className="space-y-8">
          <div className="bg-[#2C1810] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
             {/* Decorative glow */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/10 transition-colors duration-700" />
             
             <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <PieChart size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black tracking-wide" style={{ fontFamily: 'Playfair Display' }}>Payment Mix</h2>
                    <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">Revenue Streams</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {[
                    { label: 'Physical Cash', value: summary.cash, icon: Banknote, color: 'text-[#4ade80]', bg: 'bg-white/10' },
                    { label: 'Mobile Money', value: summary.momo, icon: Smartphone, color: 'text-[#fbbf24]', bg: 'bg-white/10' },
                    { label: 'Airtel Money', value: summary.airtel, icon: CreditCard, color: 'text-[#f87171]', bg: 'bg-white/10' },
                  ].map((m, i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className={cn("p-2.5 rounded-xl", m.bg)}>
                            <m.icon size={18} className={m.color} />
                          </div>
                          <span className="text-xs font-black tracking-widest uppercase text-white/90">{m.label}</span>
                        </div>
                        <span className="text-sm font-black tracking-tighter">{formatCurrency(m.value)}</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full transition-all duration-1000", m.color.replace('text-', 'bg-'))} 
                          style={{ width: `${summary.total > 0 ? (m.value / summary.total) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-white/10 flex justify-between items-end">
                   <div>
                     <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Total Collected</p>
                     <p className="text-4xl font-black">{formatCurrency(summary.total)}</p>
                   </div>
                   <div className="bg-white text-[#2C1810] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer shadow-lg">
                      View Details
                      <ArrowRight size={14} />
                   </div>
                </div>
             </div>
          </div>

          {/* Quick Insights */}
          <div className="bg-white rounded-[3rem] p-8 border-2 border-[#E8D5C4] shadow-sm">
             <h3 className="text-lg font-black text-[#2C1810] mb-6 flex items-center gap-2" style={{ fontFamily: 'Playfair Display' }}>
               <Info size={20} className="text-[#8B4513]" />
               Smart Insights
             </h3>
             <div className="space-y-4">
               <div className="bg-[#FFF8F0] p-4 rounded-2xl border border-[#E8D5C4]/50 flex gap-4">
                 <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#8B4513] shadow-sm flex-shrink-0">
                   <TrendingUp size={18} />
                 </div>
                 <p className="text-xs font-bold text-[#8B7355] leading-relaxed">
                   Peak transaction volume detected between <span className="text-[#2C1810]">12:30 PM - 2:00 PM</span>. Consider adding extra cashier support.
                 </p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BillsPage;
