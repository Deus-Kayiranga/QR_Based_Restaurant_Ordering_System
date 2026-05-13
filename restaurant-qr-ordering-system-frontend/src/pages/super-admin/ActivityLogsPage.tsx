import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { auditApi, type AuditLog } from '../../api/audit';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { 
  Shield, 
  Search, 
  Filter, 
  History, 
  Clock, 
  User, 
  Layers, 
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Lock,
  Package,
  ShoppingCart,
  Zap,
  Download
} from 'lucide-react';
import { format } from 'date-fns';
import { COLORS } from '../../styles/theme';
import { cn } from '../../utils/classNames';

export const ActivityLogsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('ALL');

  const { data: logs, isLoading, error } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: () => auditApi.getLogs(),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const filteredLogs = logs?.filter(log => {
    const matchSearch = log.details.toLowerCase().includes(search.toLowerCase()) || 
                        log.performedBy.toLowerCase().includes(search.toLowerCase()) ||
                        log.action.toLowerCase().includes(search.toLowerCase());
    const matchModule = moduleFilter === 'ALL' || log.module === moduleFilter;
    return matchSearch && matchModule;
  });

  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'AUTH': return Lock;
      case 'MENU': return Package;
      case 'ORDERS': return ShoppingCart;
      case 'SYSTEM': return Zap;
      default: return History;
    }
  };

  const getModuleColor = (module: string) => {
    switch (module) {
      case 'AUTH': return 'text-[#C62828] bg-[#C62828]/10';
      case 'MENU': return 'text-[#8B4513] bg-[#8B4513]/10';
      case 'ORDERS': return 'text-[#228B22] bg-[#228B22]/10';
      case 'SYSTEM': return 'text-[#2B6CB0] bg-[#2B6CB0]/10';
      default: return 'text-[#8B7355] bg-[#8B7355]/10';
    }
  };

  return (
    <div className="space-y-10 animate-fadeIn pb-20 p-6 bg-[#FFF8F0] min-h-screen">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
           <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-[#2C1810] rounded-2xl flex items-center justify-center text-white shadow-xl">
                 <Shield size={28} />
              </div>
              <h1 className="text-4xl font-black text-[#2C1810]" style={{ fontFamily: 'Playfair Display' }}>System Audit Trail</h1>
           </div>
           <p className="text-[#8B7355] font-medium text-lg max-w-2xl">A forensic record of all administrative and operational maneuvers within the Azzurri Rwanda Restaurant ecosystem.</p>
        </div>
        <button className="flex items-center gap-3 px-8 py-4 bg-white border-2 border-[#E8D5C4] text-[#2C1810] rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-[#F5E6D3] transition-all shadow-sm active:scale-95">
           <Download size={18} />
           Export Ledger
        </button>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Total Events', value: logs?.length || 0, icon: History },
           { label: 'Security Ops', value: logs?.filter(l => l.module === 'AUTH').length || 0, icon: Lock },
           { label: 'Menu Edits', value: logs?.filter(l => l.module === 'MENU').length || 0, icon: Package },
           { label: 'System Tasks', value: logs?.filter(l => l.module === 'SYSTEM').length || 0, icon: Zap },
         ].map((stat, i) => (
           <div key={i} className="bg-white border-2 border-[#E8D5C4] rounded-[2.5rem] p-6 flex items-center gap-5 shadow-sm">
              <div className="w-12 h-12 bg-[#FFF8F0] rounded-2xl flex items-center justify-center text-[#8B4513] border border-[#E8D5C4]/50">
                 <stat.icon size={22} />
              </div>
              <div>
                 <div className="text-[10px] font-black text-[#8B7355] uppercase tracking-widest">{stat.label}</div>
                 <div className="text-2xl font-black text-[#2C1810]">{stat.value}</div>
              </div>
           </div>
         ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-[2.5rem] p-6 border-2 border-[#E8D5C4] shadow-sm flex flex-col md:flex-row gap-6 items-center">
         <div className="relative flex-1 w-full">
            <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#8B7355]" />
            <input 
              type="text" 
              placeholder="Filter by action, user, or details..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#FFF8F0] border-2 border-[#E8D5C4] rounded-3xl py-4 pl-16 pr-8 text-sm font-black outline-none focus:bg-white focus:border-[#8B4513] transition-all placeholder:text-[#8B7355]/40"
            />
         </div>
         <div className="flex items-center gap-3 bg-[#FFF8F0] p-2 rounded-3xl border border-[#E8D5C4]">
            {['ALL', 'AUTH', 'MENU', 'ORDERS', 'SYSTEM'].map(m => (
              <button 
                key={m}
                onClick={() => setModuleFilter(m)}
                className={cn(
                  "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                  moduleFilter === m ? "bg-[#2C1810] text-white shadow-lg" : "text-[#8B7355] hover:text-[#2C1810]"
                )}
              >
                {m}
              </button>
            ))}
         </div>
      </div>

      {/* Log Feed */}
      <div className="bg-white rounded-[3.5rem] border-2 border-[#E8D5C4] overflow-hidden shadow-sm">
         {isLoading ? (
           <div className="p-10 space-y-4">
              {[1,2,3,4,5].map(i => <LoadingSkeleton key={i} className="h-20 rounded-2xl" />)}
           </div>
         ) : error ? (
           <div className="p-20 text-center flex flex-col items-center justify-center gap-6">
              <div className="w-20 h-20 bg-[#C62828]/10 rounded-full flex items-center justify-center text-[#C62828]">
                 <AlertCircle size={40} />
              </div>
              <div>
                 <h3 className="text-2xl font-black text-[#2C1810]" style={{ fontFamily: 'Playfair Display' }}>API Sync Failure</h3>
                 <p className="text-[#8B7355] font-bold mt-2">The auditing engine could not be reached. Retrying connection...</p>
              </div>
           </div>
         ) : filteredLogs?.length === 0 ? (
           <div className="p-20 text-center">
              <h3 className="text-xl font-bold text-[#8B7355]">No matching records found.</h3>
           </div>
         ) : (
           <div className="divide-y-2 divide-[#FFF8F0]">
              {filteredLogs?.map((log) => {
                const Icon = getModuleIcon(log.module);
                const colorClass = getModuleColor(log.module);
                return (
                  <div key={log.logId} className="group p-8 hover:bg-[#FFF8F0] transition-colors flex flex-col md:flex-row md:items-center gap-8">
                     {/* Timestamp */}
                     <div className="w-40 flex-shrink-0">
                        <div className="flex items-center gap-2 text-[#8B7355] mb-1">
                           <Clock size={14} />
                           <span className="text-[11px] font-black uppercase tracking-widest">{format(new Date(log.timestamp), 'HH:mm:ss')}</span>
                        </div>
                        <div className="text-sm font-black text-[#2C1810]">{format(new Date(log.timestamp), 'MMM dd, yyyy')}</div>
                     </div>

                     {/* Action Icon */}
                     <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110", colorClass)}>
                        <Icon size={24} />
                     </div>

                     {/* Details */}
                     <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-3">
                           <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-current opacity-70">
                              {log.action}
                           </span>
                           <span className="text-[10px] font-black text-[#8B7355] uppercase tracking-widest">
                              Module: {log.module}
                           </span>
                        </div>
                        <p className="text-lg font-black text-[#2C1810] leading-tight">{log.details}</p>
                     </div>

                     {/* User Attribution */}
                     <div className="flex flex-col items-start md:items-end gap-2 bg-[#FFF8F0] group-hover:bg-white p-4 rounded-2.5xl border border-[#E8D5C4]/40 transition-colors">
                        <div className="flex items-center gap-3">
                           <div className="text-right">
                              <p className="text-sm font-black text-[#2C1810]">{log.performedBy}</p>
                              <p className="text-[10px] font-black text-[#8B4513] uppercase tracking-widest">{log.userRole}</p>
                           </div>
                           <div className="w-10 h-10 rounded-xl bg-white border border-[#E8D5C4] flex items-center justify-center text-[#2C1810]">
                              <User size={18} />
                           </div>
                        </div>
                     </div>
                  </div>
                );
              })}
           </div>
         )}
      </div>
    </div>
  );
};

export default ActivityLogsPage;
