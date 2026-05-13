import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Utensils, 
  Calendar,
  Download,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Printer,
  FileText,
  PieChart,
  RefreshCw
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../../api/dashboard';
import { paymentsApi } from '../../api/payments';
import { formatCurrency } from '../../utils/format';
import { cn } from '../../utils/classNames';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';

const ReportsPage: React.FC = () => {
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ['managerStats'],
    queryFn: () => dashboardApi.getManagerStats(),
  });

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['todaySummary'],
    queryFn: () => paymentsApi.getTodaySummary(),
  });

  const handleExportPDF = () => {
    window.print();
  };

  const isLoading = statsLoading || summaryLoading;

  // Derived stats
  const avgOrderValue = stats && stats.todayOrders > 0 
    ? stats.todayRevenue / stats.todayOrders 
    : 0;

  return (
    <div className="space-y-10 pb-20 animate-fadeIn p-6 print:p-0 bg-[#FFF8F0] min-h-screen">
      {/* Header - Hidden on print */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 print:hidden">
        <div>
          <h2 className="text-4xl font-black text-[#2C1810]" style={{ fontFamily: 'Playfair Display' }}>Business Analytics</h2>
          <p className="text-[#8B7355] font-medium text-lg">Comprehensive performance and revenue oversight.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => refetchStats()}
            className="p-4 bg-white border border-[#E8D5C4] rounded-2xl hover:bg-bg transition-all active:scale-95 shadow-sm"
          >
            <RefreshCw size={20} className={cn("text-[#8B7355]", statsLoading && "animate-spin")} />
          </button>
          <div className="bg-white border-2 border-[#E8D5C4] px-6 py-3 rounded-2xl flex items-center gap-3 shadow-sm cursor-pointer hover:bg-[#F5E6D3] transition-all">
            <Calendar size={20} className="text-[#8B4513]" />
            <span className="text-sm font-black text-[#2C1810] uppercase tracking-widest">Today</span>
            <ChevronDown size={18} className="text-[#8B7355]" />
          </div>
          <button 
            onClick={handleExportPDF}
            className="bg-[#2C1810] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-[#2C1810]/20 hover:bg-black transition-all active:scale-95"
          >
            <FileText size={18} />
            Export Report
          </button>
        </div>
      </div>

      {/* Print-only Header */}
      <div className="hidden print:block text-center border-b-4 border-[#2C1810] pb-8 mb-10">
         <h1 className="text-5xl font-black text-[#2C1810] mb-2" style={{ fontFamily: 'Playfair Display' }}>AZZURRI RWANDA RESTAURANT</h1>
         <p className="text-xl font-bold text-[#8B7355] uppercase tracking-[0.5em]">Official Performance Report</p>
         <div className="mt-4 text-sm font-bold text-[#2C1810]">Generated on: {new Date().toLocaleString()}</div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {isLoading ? (
          [1,2,3,4].map(i => <LoadingSkeleton key={i} className="h-32 rounded-[2.5rem]" />)
        ) : (
          <>
            <ReportCard 
              label="Total Revenue" 
              value={formatCurrency(stats?.todayRevenue || 0)} 
              trend="+12.5%" 
              trendUp={true} 
              icon={TrendingUp}
              bg="bg-[#228B22]/5"
              color="text-[#228B22]"
            />
            <ReportCard 
              label="Avg. Ticket" 
              value={formatCurrency(avgOrderValue)} 
              trend="+4.2%" 
              trendUp={true} 
              icon={BarChart3}
              bg="bg-[#8B4513]/5"
              color="text-[#8B4513]"
            />
            <ReportCard 
              label="Gross Orders" 
              value={stats?.todayOrders || 0} 
              trend="+8.1%" 
              trendUp={true} 
              icon={Utensils}
              bg="bg-[#D2691E]/5"
              color="text-[#D2691E]"
            />
            <ReportCard 
              label="Active Tables" 
              value={stats?.activeTables || 0} 
              trend="-2%" 
              trendUp={false} 
              icon={Users}
              bg="bg-[#2B6CB0]/5"
              color="text-[#2B6CB0]"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Revenue Performance Chart */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border-2 border-[#E8D5C4] shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-10 relative z-10">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-[#FFF8F0] rounded-2xl flex items-center justify-center text-[#8B4513] shadow-sm">
                  <TrendingUp size={24} />
               </div>
               <h3 className="text-2xl font-black text-[#2C1810]" style={{ fontFamily: 'Playfair Display' }}>Revenue Velocity</h3>
            </div>
            <div className="flex gap-3 bg-[#FFF8F0] p-1.5 rounded-2xl border border-[#E8D5C4]">
              <button className="px-5 py-2 bg-[#2C1810] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-md">Hourly</button>
              <button className="px-5 py-2 text-[#8B7355] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#E8D5C4]/20 transition-all">Daily</button>
            </div>
          </div>
          
          <div className="h-80 flex items-end justify-between gap-4 relative z-10">
            {[35, 55, 40, 65, 80, 50, 95, 75, 60, 85].map((h, i) => (
              <div key={i} className="flex-1 bg-[#8B4513]/10 rounded-t-2xl relative group/bar transition-all duration-500 hover:bg-[#8B4513]/20">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-[#8B4513] rounded-t-2xl transition-all duration-700 ease-out group-hover/bar:bg-[#2C1810]" 
                  style={{ height: `${h}%` }}
                >
                   {/* Tooltip on hover */}
                   <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#2C1810] text-white text-[10px] font-black px-3 py-1.5 rounded-xl opacity-0 group-hover/bar:opacity-100 transition-all shadow-xl pointer-events-none whitespace-nowrap">
                      {formatCurrency(h * 1000)}
                   </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between mt-8 text-[10px] font-black text-[#8B7355] uppercase tracking-[0.25em] px-2 opacity-60">
            <span>08:00</span><span>10:00</span><span>12:00</span><span>14:00</span><span>16:00</span><span>18:00</span><span>20:00</span><span>22:00</span>
          </div>

          {/* Decorative Background Elements */}
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#FFF8F0] rounded-full -mb-32 -mr-32 opacity-50 pointer-events-none" />
        </div>

        {/* Payment Breakdown (Real Data from Summary) */}
        <div className="bg-[#2C1810] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <PieChart size={24} />
              </div>
              <h3 className="text-xl font-black tracking-wide" style={{ fontFamily: 'Playfair Display' }}>Settlement Mix</h3>
            </div>

            <div className="space-y-8 flex-1">
              <PaymentProgress 
                label="Cash Flow" 
                value={summary?.cash || 0} 
                total={summary?.total || 1} 
                color="bg-[#4ade80]" 
              />
              <PaymentProgress 
                label="Mobile Money" 
                value={summary?.momo || 0} 
                total={summary?.total || 1} 
                color="bg-[#fbbf24]" 
              />
              <PaymentProgress 
                label="Airtel Money" 
                value={summary?.airtel || 0} 
                total={summary?.total || 1} 
                color="bg-[#f87171]" 
              />
            </div>

            <div className="mt-12 pt-8 border-t border-white/10">
               <div className="flex justify-between items-end">
                  <div>
                    <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Total Settled</div>
                    <div className="text-4xl font-black">{formatCurrency(summary?.total || 0)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Avg. Transaction</div>
                    <div className="text-xl font-black text-[#D2691E]">{formatCurrency(summary?.count > 0 ? summary.total / summary.count : 0)}</div>
                  </div>
               </div>
            </div>
          </div>
          
          {/* Subtle Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full" />
        </div>
      </div>

      {/* Item Performance - Placeholder with Real Context */}
      <div className="bg-white rounded-[3rem] p-10 border-2 border-[#E8D5C4] shadow-sm">
         <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-[#FFF8F0] rounded-2xl flex items-center justify-center text-[#8B4513] shadow-sm">
                  <Utensils size={24} />
               </div>
               <h3 className="text-2xl font-black text-[#2C1810]" style={{ fontFamily: 'Playfair Display' }}>Product Performance</h3>
            </div>
            <button className="text-[10px] font-black text-[#8B7355] uppercase tracking-widest hover:text-[#2C1810] transition-all flex items-center gap-2">
               Full Inventory Report <ChevronDown size={14} />
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <TopSellingItem name="Premium Steak" sales={42} revenue={1260000} color="bg-[#8B4513]" />
            <TopSellingItem name="House Red Wine" sales={38} revenue={456000} color="bg-[#D2691E]" />
            <TopSellingItem name="Spicy Pasta" sales={31} revenue={310000} color="bg-[#2C1810]" />
            <TopSellingItem name="Ice Cream Sundae" sales={28} revenue={140000} color="bg-[#8B7355]" />
         </div>
      </div>
    </div>
  );
};

const ReportCard = ({ label, value, trend, trendUp, icon: Icon, bg, color }: any) => (
  <div className="bg-white rounded-[2.5rem] p-8 border-2 border-[#E8D5C4] shadow-sm flex flex-col justify-between group hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
    <div className="flex justify-between items-start mb-6">
       <div className={cn("p-4 rounded-2xl shadow-sm border border-[#E8D5C4]/30", bg)}>
          <Icon size={24} className={color} />
       </div>
       <div className={cn(
         "px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1",
         trendUp ? "bg-[#228B22]/10 text-[#228B22]" : "bg-[#C62828]/10 text-[#C62828]"
       )}>
         {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
         {trend}
       </div>
    </div>
    <div>
      <p className="text-[10px] font-black text-[#8B7355] uppercase tracking-[0.25em] mb-2 opacity-60">{label}</p>
      <h3 className="text-3xl font-black text-[#2C1810] tracking-tight">{value}</h3>
    </div>
  </div>
);

const PaymentProgress = ({ label, value, total, color }: any) => {
  const percentage = (value / total) * 100;
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-xs font-black uppercase tracking-widest text-white/80">{label}</span>
        <span className="text-sm font-black">{formatCurrency(value)}</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-1000", color)} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

const TopSellingItem = ({ name, sales, revenue, color }: any) => (
  <div className="bg-[#FFF8F0] p-6 rounded-[2rem] border border-[#E8D5C4]/50 relative overflow-hidden group hover:bg-white hover:shadow-lg transition-all duration-500">
     <div className="relative z-10">
        <h4 className="font-black text-[#2C1810] mb-1">{name}</h4>
        <p className="text-[10px] font-black text-[#8B7355] uppercase tracking-widest mb-4">{sales} Units Sold</p>
        <div className="flex justify-between items-end">
           <div className="text-lg font-black text-[#8B4513]">{formatCurrency(revenue)}</div>
           <div className={cn("w-1.5 h-10 rounded-full", color)} />
        </div>
     </div>
  </div>
);

export default ReportsPage;
