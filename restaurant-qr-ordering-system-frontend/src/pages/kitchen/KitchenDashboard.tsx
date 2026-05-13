import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../../api/dashboard';
import { 
  ChefHat, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  AlertCircle,
  LayoutDashboard,
  Timer,
  UtensilsCrossed
} from 'lucide-react';
import { COLORS } from '../../styles/theme';

const KitchenDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const data = await dashboardApi.getKitchenStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch kitchen stats', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading && !stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 bg-[#FAF7F2] min-h-full animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#2C1810] uppercase tracking-tighter" style={{ fontFamily: 'Playfair Display' }}>
            Kitchen Analytics
          </h1>
          <p className="text-[#8B7355] font-medium text-sm flex items-center gap-2 mt-1">
            <Clock size={14} /> Live Station Status • {(new Date()).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Orders Today" 
          value={stats?.todayTotal || 0} 
          icon={<TrendingUp size={24} />} 
          color="#6F4E37"
          label="Orders Sent to Kitchen"
        />
        <StatCard 
          title="Currently Preparing" 
          value={stats?.preparing || 0} 
          icon={<Timer size={24} />} 
          color="#D97706"
          label="In the Process of Cooking"
        />
        <StatCard 
          title="Items Ready" 
          value={stats?.ready || 0} 
          icon={<CheckCircle2 size={24} />} 
          color="#16A34A"
          label="Waiting for Waiter Pickup"
        />
        <StatCard 
          title="New Arrivals" 
          value={stats?.placed || 0} 
          icon={<AlertCircle size={24} />} 
          color="#DC2626"
          label="Pending Immediate Action"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Visualization */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-[#E8D5C4] shadow-sm">
            <h3 className="text-sm font-black text-[#2C1810] uppercase tracking-widest mb-6 flex items-center gap-2">
                <ChefHat size={18} /> Daily Performance Distribution
            </h3>
            <div className="space-y-6">
                <ProgressItem label="Order Fulfillment Rate" value={85} color="#6F4E37" />
                <ProgressItem label="Kitchen Preparation Speed" value={72} color="#D97706" />
                <ProgressItem label="Service Quality Score" value={94} color="#16A34A" />
            </div>
        </div>

        {/* Quick Actions / Tips */}
        <div className="bg-[#6F4E37] rounded-[2.5rem] p-8 text-white shadow-xl shadow-[#6F4E37]/20 flex flex-col justify-between">
            <div>
                <h3 className="text-sm font-black uppercase tracking-widest opacity-60 mb-6">Station Tip</h3>
                <p className="text-lg font-bold leading-relaxed">
                    Remember to mark items as <span className="text-[#E8D5C4]">PREPARING</span> as soon as you start cooking. This keeps the waiter informed!
                </p>
            </div>
            <div className="mt-8 pt-8 border-t border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                        <UtensilsCrossed size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase opacity-60">Avg Prep Time</p>
                        <p className="text-lg font-black">12.4 mins</p>
                    </div>
                </div>
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

const ProgressItem: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <span className="text-[11px] font-black uppercase tracking-widest text-[#8B7355]">{label}</span>
      <span className="text-xs font-black" style={{ color }}>{value}%</span>
    </div>
    <div className="w-full h-2 bg-[#FAF7F2] rounded-full overflow-hidden border border-[#E8D5C4]">
      <div 
        className="h-full rounded-full transition-all duration-1000" 
        style={{ width: `${value}%`, background: color }}
      />
    </div>
  </div>
);

export default KitchenDashboard;
