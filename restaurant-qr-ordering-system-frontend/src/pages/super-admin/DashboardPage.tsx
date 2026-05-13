import { useQuery } from '@tanstack/react-query'
import { staffApi } from '../../api/staff'
import { ordersApi } from '../../api/orders'
import { menuApi } from '../../api/menu'
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton'
import {
  LayoutDashboard, Users, QrCode, TrendingUp,
  Receipt, AlertTriangle, Package, ChefHat, 
  ArrowRight, Clock, CheckCircle2
} from 'lucide-react'
import { COLORS } from '../../styles/theme'
import { formatCurrency } from '../../utils/format'

const StatCard = ({ title, value, icon: Icon, trend, trendUp, subtitle, color }: any) => (
  <div className="bg-white rounded-2xl p-6 border shadow-sm transition-all hover:shadow-md hover:-translate-y-1" style={{ borderColor: COLORS.border }}>
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm font-semibold text-[#8B7355] mb-1">{title}</p>
        <h3 className="text-3xl font-black text-[#2C1810]" style={{ fontFamily: 'Playfair Display, serif' }}>{value}</h3>
      </div>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-opacity-10" style={{ backgroundColor: `${color}15` }}>
        <Icon size={24} color={color} />
      </div>
    </div>
    <div className="flex items-center gap-2">
      {trend && (
        <span className={`flex items-center gap-1 text-xs font-bold ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
          {trendUp ? '↑' : '↓'} {trend}
        </span>
      )}
      {subtitle && <span className="text-xs text-[#8B7355]">{subtitle}</span>}
    </div>
  </div>
)

export function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard', 'admin'],
    queryFn: () => staffApi.getAdminDashboard(),
  })

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['orders', 'recent'],
    queryFn: () => ordersApi.getAllOrders(0, 5),
  })

  const { data: lowStock, isLoading: stockLoading } = useQuery({
    queryKey: ['menu', 'low-stock'],
    queryFn: () => menuApi.getLowStockItems(),
  })

  if (statsLoading) return <div className="p-6"><LoadingSkeleton className="h-[200px]" /></div>

  const s = stats || {
    activeTables: 14,
    todayOrders: 47,
    todayRevenue: 425800,
    staffOnDuty: 8,
    pendingBills: 3,
    lowStockItems: 5,
    totalMenuItems: 24,
    totalUsers: 12
  } // Fallback if API returns empty

  return (
    <div className="max-w-7xl mx-auto space-y-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#2C1810]" style={{ fontFamily: 'Playfair Display, serif' }}>Dashboard Overview</h1>
          <p className="text-[#8B7355] mt-1">Welcome back, here's what's happening today.</p>
        </div>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Today's Revenue" value={formatCurrency(s.todayRevenue)} icon={TrendingUp} trend="12.5%" trendUp={true} subtitle="vs yesterday" color={COLORS.success} />
        <StatCard title="Active Tables" value={s.activeTables} icon={QrCode} subtitle="Currently occupied" color={COLORS.primary} />
        <StatCard title="Today's Orders" value={s.todayOrders} icon={Receipt} trend="4.2%" trendUp={true} subtitle="vs yesterday" color={COLORS.secondary} />
        <StatCard title="Staff On Duty" value={`${s.staffOnDuty}`} icon={Users} subtitle="Active sessions" color="#3B82F6" />
      </div>

      {/* Second Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Pending Bills" value={s.pendingBills} icon={Clock} subtitle="Awaiting payment" color="#F59E0B" />
        <StatCard title="Low Stock Items" value={s.lowStockItems} icon={AlertTriangle} subtitle="Needs restock" color={COLORS.danger} />
        <StatCard title="Menu Items" value={s.totalMenuItems} icon={ChefHat} subtitle="Total active items" color="#8B5CF6" />
        <StatCard title="Total Users" value={s.totalUsers} icon={LayoutDashboard} subtitle="Registered staff" color="#64748B" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pt-4">
        {/* Recent Orders Table */}
        <div className="xl:col-span-2 bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: COLORS.border }}>
          <div className="p-5 border-b flex justify-between items-center" style={{ borderColor: COLORS.border }}>
            <h2 className="text-lg font-bold text-[#2C1810]" style={{ fontFamily: 'Playfair Display, serif' }}>Recent Orders</h2>
            <button className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline">
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="overflow-x-auto">
            {ordersLoading ? (
               <div className="p-6"><LoadingSkeleton className="h-32" /></div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FFF8F0] border-b text-xs uppercase tracking-wider text-[#8B7355]" style={{ borderColor: COLORS.border }}>
                    <th className="px-5 py-3 font-semibold">Order ID</th>
                    <th className="px-5 py-3 font-semibold">Table</th>
                    <th className="px-5 py-3 font-semibold">Amount</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Time</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {ordersData?.content?.slice(0, 5).map((order: any) => (
                    <tr key={order.orderId} className="border-b last:border-0 hover:bg-[#FFF8F0]/50 transition-colors" style={{ borderColor: COLORS.border }}>
                      <td className="px-5 py-4 font-bold text-[#2C1810]">#{order.orderId.toString().padStart(3, '0')}</td>
                      <td className="px-5 py-4 font-semibold text-[#8B7355]">{order.tableNumber}</td>
                      <td className="px-5 py-4 font-black text-primary">{formatCurrency(order.totalAmount)}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          order.orderStatus === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
                          order.orderStatus === 'PREPARING' ? 'bg-orange-100 text-orange-700' : 
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[#8B7355]">{new Date(order.placedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                    </tr>
                  ))}
                  {(!ordersData?.content || ordersData.content.length === 0) && (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-[#8B7355]">No recent orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Column: Low Stock */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: COLORS.border }}>
            <div className="p-5 border-b flex justify-between items-center" style={{ borderColor: COLORS.border }}>
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} color={COLORS.danger} />
                <h2 className="text-lg font-bold text-[#2C1810]" style={{ fontFamily: 'Playfair Display, serif' }}>Low Stock Alerts</h2>
              </div>
            </div>
            <div className="p-0">
              {stockLoading ? (
                 <div className="p-6"><LoadingSkeleton className="h-32" /></div>
              ) : lowStock && lowStock.length > 0 ? (
                <div className="divide-y" style={{ borderColor: COLORS.border }}>
                  {lowStock.slice(0, 5).map((item: any) => (
                    <div key={item.itemId} className="p-4 flex items-center justify-between hover:bg-[#FFF8F0]/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                          <Package size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-[#2C1810] text-sm">{item.itemName}</p>
                          <p className="text-xs text-[#8B7355]">Min: {item.minimumStockAlert} {item.stockUnit}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-red-600 text-lg">{item.currentStock}</p>
                        <p className="text-[10px] uppercase font-bold text-red-400 tracking-wider">Remaining</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <CheckCircle2 size={32} className="mx-auto text-green-500 mb-3" />
                  <p className="font-bold text-[#2C1810]">All Stock Levels Good</p>
                  <p className="text-sm text-[#8B7355]">No items require restocking</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
