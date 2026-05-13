import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTables } from '../../hooks/useTables';
import { 
  Users, 
  LayoutGrid, 
  MoreVertical, 
  ExternalLink, 
  MapPin,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  Info
} from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import { cn } from '../../utils/classNames';
import { COLORS } from '../../styles/theme';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';

const STATUS_COLORS = {
  AVAILABLE: { bg: 'bg-[#F0FFF4]', text: 'text-[#228B22]', border: 'border-[#C6F6D5]' },
  OCCUPIED: { bg: 'bg-[#FFF5F5]', text: 'text-[#C53030]', border: 'border-[#FED7D7]' },
  RESERVED: { bg: 'bg-[#EBF8FF]', text: 'text-[#2B6CB0]', border: 'border-[#BEE3F8]' },
  CLEANING: { bg: 'bg-[#FFFFF0]', text: 'text-[#B7791F]', border: 'border-[#FEFCBF]' },
};

export function TablesStatusPage() {
  const navigate = useNavigate();
  const { data: tables, isLoading, refetch } = useTables();
  const [search, setSearch] = useState('');
  const [activeSection, setActiveSection] = useState('All');

  const sections = ['All', ...new Set((tables || []).map(t => t.section).filter(Boolean))];
  
  const filteredTables = tables?.filter(t => {
    const matchesSearch = t.tableNumber.toLowerCase().includes(search.toLowerCase()) || 
                          (t.section?.toLowerCase().includes(search.toLowerCase()));
    const matchesSection = activeSection === 'All' || t.section === activeSection;
    return matchesSearch && matchesSection;
  });

  const stats = {
    total: tables?.length || 0,
    occupied: tables?.filter(t => t.status === 'OCCUPIED').length || 0,
    available: tables?.filter(t => t.status === 'AVAILABLE').length || 0,
    reserved: tables?.filter(t => t.status === 'RESERVED').length || 0,
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-20 p-6 bg-[#FFF8F0] min-h-screen">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-[#2C1810]" style={{ fontFamily: 'Playfair Display' }}>Floor Overview</h1>
          <p className="text-[#8B7355] font-medium text-lg">Real-time status of your restaurant's seating capacity.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => refetch()}
            className="p-4 bg-white border border-[#E8D5C4] rounded-2xl hover:bg-[#F5E6D3] transition-all active:scale-95 shadow-md flex items-center gap-2 font-bold text-[#2C1810]"
          >
            <RefreshCw size={20} className="text-[#8B4513]" />
            Refresh
          </button>
          <div className="bg-[#8B4513]/10 border border-[#8B4513]/20 rounded-2xl px-5 py-3 flex items-center gap-3">
            <div className="w-3 h-3 bg-[#8B4513] rounded-full animate-pulse" />
            <span className="text-sm font-black text-[#8B4513] uppercase tracking-widest">Live Monitoring</span>
          </div>
        </div>
      </header>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Stations', value: stats.total, icon: LayoutGrid, color: 'text-[#8B4513]', bg: 'bg-white', border: 'border-[#E8D5C4]' },
          { label: 'Live Occupancy', value: stats.occupied, icon: AlertCircle, color: 'text-[#C62828]', bg: 'bg-[#C62828]/5', border: 'border-[#C62828]/10' },
          { label: 'Ready Tables', value: stats.available, icon: CheckCircle2, color: 'text-[#228B22]', bg: 'bg-[#228B22]/5', border: 'border-[#228B22]/10' },
          { label: 'Booked / Reserved', value: stats.reserved, icon: Users, color: 'text-[#2B6CB0]', bg: 'bg-[#2B6CB0]/5', border: 'border-[#2B6CB0]/10' },
        ].map((s, i) => (
          <div key={i} className={cn(
            "p-7 rounded-[2.5rem] border-2 shadow-sm flex items-center gap-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group",
            s.bg, s.border
          )}>
            <div className={cn(
              "w-16 h-16 rounded-3xl bg-white flex items-center justify-center shadow-lg border border-border/50 group-hover:scale-110 transition-transform duration-500",
              s.color
            )}>
              <s.icon size={28} />
            </div>
            <div>
              <div className="text-[10px] font-black text-[#8B7355] uppercase tracking-[0.2em] mb-1.5 opacity-70">{s.label}</div>
              <div className="text-4xl font-black text-[#2C1810] leading-none tabular-nums">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-6 items-center bg-white p-5 rounded-[2.5rem] border border-[#E8D5C4] shadow-sm">
        <div className="relative flex-1 w-full">
          <Search size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8B7355]" />
          <input 
            type="text" 
            placeholder="Filter by table number or area..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#FFF8F0]/50 border border-[#E8D5C4] rounded-2xl py-4 pl-14 pr-6 text-base font-medium focus:ring-4 focus:ring-[#8B4513]/10 outline-none transition-all placeholder:text-[#8B7355]/50"
          />
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar scroll-smooth">
          {sections.map(s => (
            <button
              key={s}
              onClick={() => setActiveSection(s)}
              className={cn(
                "px-7 py-4 rounded-2xl text-sm font-black whitespace-nowrap transition-all border shadow-sm uppercase tracking-widest",
                activeSection === s 
                  ? "bg-[#2C1810] border-[#2C1810] text-white shadow-lg" 
                  : "bg-white border-[#E8D5C4] text-[#8B7355] hover:border-[#8B4513]/50"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1,2,3,4,5,6,7,8].map(i => <LoadingSkeleton key={i} className="h-64 rounded-[3rem]" />)}
        </div>
      ) : filteredTables?.length === 0 ? (
        <div className="text-center py-24 bg-white border border-[#E8D5C4] rounded-[4rem] shadow-sm">
          <div className="w-24 h-24 bg-[#FFF8F0] rounded-full flex items-center justify-center mx-auto mb-6 text-[#E8D5C4]">
            <LayoutGrid size={48} />
          </div>
          <h3 className="text-2xl font-black text-[#2C1810]" style={{ fontFamily: 'Playfair Display' }}>No tables match your criteria</h3>
          <p className="text-[#8B7355] mt-2 font-medium">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredTables?.map((table) => (
            <div 
              key={table.tableId}
              className={cn(
                "group relative bg-white rounded-[3rem] border-2 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2",
                table.status === 'OCCUPIED' ? "border-[#C62828]/20" : "border-[#E8D5C4]"
              )}
            >
              {/* Status Header */}
              <div className={cn(
                "px-8 py-5 flex justify-between items-center border-b transition-colors",
                table.status === 'AVAILABLE' ? "bg-[#228B22]/5 border-[#228B22]/10" : 
                table.status === 'OCCUPIED' ? "bg-[#C62828]/5 border-[#C62828]/10" : "bg-[#8B4513]/5 border-[#8B4513]/10"
              )}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center font-black text-2xl text-[#2C1810] shadow-sm border border-[#E8D5C4]/50">
                    {table.tableNumber}
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-[#8B7355] uppercase tracking-widest leading-none mb-1">Section</div>
                    <div className="text-sm font-bold text-[#2C1810] leading-none">{table.section || 'General'}</div>
                  </div>
                </div>
                <div className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm",
                  table.status === 'AVAILABLE' ? "bg-white border-[#228B22]/20 text-[#228B22]" : 
                  table.status === 'OCCUPIED' ? "bg-white border-[#C62828]/20 text-[#C62828]" : 
                  "bg-white border-[#8B4513]/20 text-[#8B4513]"
                )}>
                  {table.status}
                </div>
              </div>

              {/* Body */}
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[#8B7355]">
                      <Users size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Capacity</span>
                    </div>
                    <div className="text-lg font-black text-[#2C1810]">{table.seatingCapacity} Seats</div>
                  </div>
                  <div className="flex flex-col gap-1 text-right">
                    <div className="flex items-center gap-2 text-[#8B7355] justify-end">
                      <Clock size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Est. Wait</span>
                    </div>
                    <div className="text-lg font-black text-[#2C1810]">{table.status === 'OCCUPIED' ? '45m' : '0m'}</div>
                  </div>
                </div>

                {table.status === 'OCCUPIED' ? (
                  <div className="bg-[#C62828]/5 rounded-3xl p-5 border border-[#C62828]/10 space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-20">
                      <AlertCircle size={40} className="text-[#C62828]" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-[#C62828] uppercase tracking-[0.15em]">Live Order</span>
                      <span className="text-[10px] font-bold text-[#8B7355] tracking-widest bg-white px-2 py-0.5 rounded-full shadow-sm">ID: #8392</span>
                    </div>
                    <div>
                      <div className="text-base font-black text-[#2C1810] mb-1 truncate">Premium Steak + Red Wine</div>
                      <div className="flex items-center gap-2 text-xs text-[#8B7355] font-bold">
                        <div className="w-1.5 h-1.5 bg-[#C62828] rounded-full animate-pulse" />
                        Serving in Progress
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#FFF8F0] rounded-3xl p-8 border-2 border-dashed border-[#E8D5C4] flex flex-col items-center justify-center text-center group-hover:border-[#8B4513]/30 transition-colors">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#E8D5C4] mb-3 shadow-sm group-hover:text-[#8B4513]/50 transition-colors">
                      <CheckCircle2 size={24} />
                    </div>
                    <p className="text-[10px] font-black text-[#8B7355] uppercase tracking-[0.25em]">Station Ready</p>
                  </div>
                )}

                <div className="pt-2 flex gap-3">
                  <button 
                    onClick={() => navigate(`/waiter/tables/${table.tableId}`)}
                    className="flex-[2] bg-[#2C1810] text-white py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] hover:bg-black transition-all active:scale-95 shadow-xl shadow-[#2C1810]/20 flex items-center justify-center gap-2"
                  >
                    Manage Table
                    <ChevronRight size={16} />
                  </button>
                  <button className="flex-1 bg-white border-2 border-[#E8D5C4] rounded-[1.5rem] text-[#8B7355] hover:text-[#8B4513] hover:border-[#8B4513]/30 transition-all active:scale-95 flex items-center justify-center">
                    <Info size={20} />
                  </button>
                </div>
              </div>

              {/* Hover Effect Decoration */}
              <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[#8B4513] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TablesStatusPage;
