import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../../api/dashboard';
import { menuApi } from '../../api/menu';
import { 
  Beer, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  AlertTriangle,
  Package,
  GlassWater,
  Activity
} from 'lucide-react';

const BarDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [barData, lowStockData] = await Promise.all([
        dashboardApi.getBarStats(),
        menuApi.getLowStockItems()
      ]);
      setStats(barData);
      setLowStockCount(lowStockData.length);
    } catch (error) {
      console.error('Failed to fetch bar stats', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading && !stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 bg-[#FAF7F2] min-h-full animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#2C1810] uppercase tracking-tighter" style={{ fontFamily: 'Playfair Display' }}>
            Bar Performance
          </h1>
          <p className="text-[#8B7355] font-medium text-sm flex items-center gap-2 mt-1">
            <Activity size={14} /> Live Bar Logistics • {(new Date()).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Drinks Today" 
          value={stats?.todayDrinks || 0} 
          icon={<GlassWater size={24} />} 
          color="#6F4E37"
          label="Beverages Served"
        />
        <StatCard 
          title="Pending Drinks" 
          value={stats?.placed || 0} 
          icon={<Clock size={24} />} 
          color="#D97706"
          label="Orders in Queue"
        />
        <StatCard 
          title="Stock Alerts" 
          value={lowStockCount} 
          icon={<AlertTriangle size={24} />} 
          color="#DC2626"
          label="Items Below Minimum"
        />
        <StatCard 
          title="In Preparation" 
          value={stats?.preparing || 0} 
          icon={<TrendingUp size={24} />} 
          color="#16A34A"
          label="Currently Mixing"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Stock Status Card */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-[#E8D5C4] shadow-sm flex flex-col justify-center items-center text-center space-y-4">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
                <Package size={32} />
            </div>
            <div>
                <h3 className="text-xl font-black text-[#2C1810]">Stock Management</h3>
                <p className="text-[#8B7355] text-sm max-w-xs mx-auto mt-2">
                    Monitor your inventory levels and restock items to ensure service never stops.
                </p>
            </div>
            <button className="bg-secondary text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-secondary/20 hover:scale-105 transition-all">
                Manage Bar Stock
            </button>
        </div>

        {/* Quick Insights */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-[#E8D5C4] shadow-sm space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#8B7355]">Top Moving Items Today</h3>
            <div className="space-y-4">
                <TopItem name="Primus Beer" count={12} total={34} />
                <TopItem name="Fresh Mango Juice" count={8} total={34} />
                <TopItem name="Rwandan Coffee" count={5} total={34} />
            </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: number | string; icon: React.ReactNode; color: string; label: string }> = ({ title, value, icon, color, label }) => (
  <div className="bg-white rounded-[2.5rem] p-6 border border-[#E8D5C4] shadow-sm hover:shadow-md transition-all group">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: `${color}10`, color }}>
        {icon}
      </div>
      <div className="text-3xl font-black text-[#2C1810]">{value}</div>
    </div>
    <div>
      <h3 className="text-[10px] font-black uppercase tracking-widest text-[#8B7355] mb-1">{title}</h3>
      <p className="text-xs font-medium text-[#2C1810]/60">{label}</p>
    </div>
  </div>
);

const TopItem: React.FC<{ name: string; count: number; total: number }> = ({ name, count, total }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E8D5C4] flex items-center justify-center text-[10px] font-black">
            {count}
        </div>
        <span className="text-sm font-bold text-[#2C1810]">{name}</span>
    </div>
    <div className="text-[10px] font-black text-[#8B7355] uppercase">
        {Math.round((count/total) * 100)}% of sales
    </div>
  </div>
);

export default BarDashboard;
