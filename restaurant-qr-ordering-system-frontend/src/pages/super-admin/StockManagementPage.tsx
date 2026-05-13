import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuApi } from '../../api/menu';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { 
  Search, 
  Filter, 
  AlertTriangle, 
  PackagePlus, 
  Plus, 
  Package, 
  CheckCircle2, 
  X,
  History,
  TrendingDown,
  ArrowUpRight,
  ChevronRight,
  Info,
  Layers,
  ArrowRight,
  CameraOff
} from 'lucide-react';
import { COLORS } from '../../styles/theme';
import { cn } from '../../utils/classNames';
import { formatCurrency } from '../../utils/format';

export function StockManagementPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [stationFilter, setStationFilter] = useState('ALL');
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [stockToAdd, setStockToAdd] = useState(0);

  const { data: itemsRes, isLoading } = useQuery({
    queryKey: ['items'],
    queryFn: () => menuApi.getItems(),
    refetchInterval: 10000, // Refresh every 10 seconds to show automatic stock changes
  });

  const { data: lowStockItems } = useQuery({
    queryKey: ['menu', 'low-stock'],
    queryFn: () => menuApi.getLowStockItems(),
  });

  const items = Array.isArray(itemsRes) ? itemsRes : (itemsRes as any)?.content || [];

  const updateStockMutation = useMutation({
    mutationFn: (data: { id: number, add: number }) => menuApi.updateStock(data.id, data.add),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['menu', 'low-stock'] });
      setIsRestockModalOpen(false);
      setStockToAdd(0);
      setSelectedItem(null);
    }
  });

  const filteredItems = items?.filter((i: any) => {
    const matchSearch = i.itemName.toLowerCase().includes(search.toLowerCase()) || 
                        (i.categoryName && i.categoryName.toLowerCase().includes(search.toLowerCase()));
    const matchStation = stationFilter === 'ALL' || i.destinationStation === stationFilter;
    return matchSearch && matchStation;
  });

  const getStockStatus = (current: number, min: number) => {
    const currentVal = current ?? 0;
    const minVal = min ?? 10;
    if (currentVal <= 0) return { label: 'Out of Stock', color: 'text-[#C62828]', bg: 'bg-[#C62828]/5', border: 'border-[#C62828]/20' };
    if (currentVal <= minVal) return { label: 'Low Stock', color: 'text-[#D2691E]', bg: 'bg-[#D2691E]/5', border: 'border-[#D2691E]/20' };
    return { label: 'In Stock', color: 'text-[#228B22]', bg: 'bg-[#228B22]/5', border: 'border-[#228B22]/20' };
  };

  const handleRestock = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem && stockToAdd > 0) {
      updateStockMutation.mutate({ id: selectedItem.itemId, add: stockToAdd });
    }
  };

  return (
    <div className="space-y-10 animate-fadeIn pb-20 p-6 bg-[#FFF8F0] min-h-screen">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
           <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-[#2C1810] rounded-2xl flex items-center justify-center text-white shadow-xl">
                 <Package size={28} />
              </div>
              <h1 className="text-4xl font-black text-[#2C1810]" style={{ fontFamily: 'Playfair Display' }}>Inventory Matrix</h1>
           </div>
           <p className="text-[#8B7355] font-medium text-lg max-w-2xl">Monitor product levels, track stock depletion, and orchestrate replenishment.</p>
        </div>
        <button className="flex items-center gap-3 px-8 py-4 bg-[#2C1810] text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-[#2C1810]/20 active:scale-95">
           <History size={18} />
           Audit History
        </button>
      </header>

      {/* Critical Alerts Bar */}
      {lowStockItems && lowStockItems.length > 0 && (
        <div className="bg-[#C62828]/5 border-2 border-[#C62828]/20 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
             <AlertTriangle size={120} className="text-[#C62828]" />
          </div>
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-[#C62828] shadow-lg border border-[#C62828]/10 animate-pulse">
              <AlertTriangle size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-[#2C1810]" style={{ fontFamily: 'Playfair Display' }}>Supply Chain Alert</h3>
              <p className="text-[#C62828] font-bold uppercase tracking-widest text-xs mt-1">{lowStockItems.length} items require immediate replenishment</p>
            </div>
          </div>
          <div className="flex-1 flex flex-wrap gap-3 relative z-10">
            {lowStockItems.slice(0, 4).map((item: any) => (
              <div key={item.itemId} className="bg-white px-5 py-2.5 rounded-2xl border border-[#C62828]/20 flex items-center gap-3 shadow-sm hover:border-[#C62828]/40 transition-colors">
                <span className="text-xs font-black text-[#2C1810]">{item.itemName}</span>
                <span className="text-[10px] font-black bg-[#C62828] text-white px-2 py-0.5 rounded-lg">{item.stockQuantity} {item.stockUnit}</span>
              </div>
            ))}
            {lowStockItems.length > 4 && (
               <div className="bg-[#2C1810] text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                 +{lowStockItems.length - 4} more
               </div>
            )}
          </div>
        </div>
      )}

      {/* Control Strip */}
      <div className="bg-white rounded-[2.5rem] p-6 border-2 border-[#E8D5C4] shadow-sm flex flex-col md:flex-row gap-6 items-center">
         <div className="relative flex-1 w-full">
            <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#8B7355]" />
            <input 
              type="text" 
              placeholder="Search inventory matrix..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#FFF8F0] border-2 border-[#E8D5C4] rounded-3xl py-4 pl-16 pr-8 text-sm font-black outline-none focus:bg-white focus:border-[#8B4513] transition-all placeholder:text-[#8B7355]/40"
            />
         </div>
         <div className="flex items-center gap-3 bg-[#FFF8F0] p-2 rounded-3xl border border-[#E8D5C4]">
            {['ALL', 'KITCHEN', 'BAR'].map(s => (
              <button 
                key={s}
                onClick={() => setStationFilter(s)}
                className={cn(
                  "px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                  stationFilter === s ? "bg-[#2C1810] text-white shadow-lg" : "text-[#8B7355] hover:text-[#2C1810]"
                )}
              >
                {s}
              </button>
            ))}
         </div>
      </div>

      {/* Main Inventory Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1,2,3,4,5,6,7,8].map(i => <LoadingSkeleton key={i} className="h-64 rounded-[3rem]" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredItems?.map((item: any) => {
            const status = getStockStatus(item.stockQuantity, item.minStockLevel);
            return (
              <div 
                key={item.itemId} 
                className="group relative bg-white rounded-[3rem] border-2 border-[#E8D5C4] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col"
              >
                {/* Item Image */}
                <div className="h-48 overflow-hidden relative bg-bg">
                   {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.itemName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                   ) : (
                      <div className="w-full h-full flex items-center justify-center text-border">
                         <CameraOff size={48} />
                      </div>
                   )}
                   <div className="absolute top-4 left-4">
                      <div className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-lg backdrop-blur-md", status.bg.replace('bg-', 'bg-white/'), status.color, status.border)}>
                        {status.label}
                      </div>
                   </div>
                   <div className="absolute bottom-4 right-4">
                      <div className="text-[10px] font-black text-white uppercase tracking-widest bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                        {item.destinationStation}
                      </div>
                   </div>
                </div>

                {/* Info Header */}
                <div className="p-8 pb-4">
                  <h3 className="text-2xl font-black text-[#2C1810] leading-tight min-h-[3rem] line-clamp-2" style={{ fontFamily: 'Playfair Display' }}>{item.itemName}</h3>
                  <p className="text-[10px] font-black text-[#8B7355] uppercase tracking-widest mt-1 opacity-60">{item.categoryName || 'Uncategorized'}</p>
                </div>

                {/* Level Progress */}
                <div className="px-8 py-6 space-y-4 flex-1">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                       <span className="text-4xl font-black text-[#2C1810]">{item.stockQuantity ?? 0}</span>
                       <span className="ml-2 text-sm font-black text-[#8B7355] uppercase tracking-widest">{item.stockUnit || 'Units'}</span>
                    </div>
                    <div className="text-right">
                       <div className="text-[9px] font-black text-[#8B7355] uppercase tracking-widest opacity-50 mb-1">Alert Trigger</div>
                       <div className="text-sm font-black text-[#2C1810]">{item.minStockLevel ?? 10} {item.stockUnit || 'Units'}</div>
                    </div>
                  </div>
                  <div className="h-2.5 bg-[#FFF8F0] rounded-full overflow-hidden border border-[#E8D5C4]/30">
                    <div 
                      className={cn("h-full rounded-full transition-all duration-1000", (item.stockQuantity ?? 0) <= (item.minStockLevel ?? 10) ? 'bg-[#C62828]' : 'bg-[#228B22]')} 
                      style={{ width: `${Math.min(100, ((item.stockQuantity ?? 0) / ((item.minStockLevel ?? 10) * 3)) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="p-8 pt-2">
                   <button 
                     onClick={() => { setSelectedItem(item); setIsRestockModalOpen(true); }}
                     className="w-full py-4 bg-[#2C1810] text-white rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] hover:bg-black transition-all active:scale-95 shadow-xl shadow-[#2C1810]/10 flex items-center justify-center gap-2"
                   >
                     <PackagePlus size={18} />
                     Replenish Stock
                   </button>
                </div>

                {/* Hover Glow */}
                <div className={cn("h-2 w-full opacity-0 group-hover:opacity-100 transition-opacity", item.currentStock <= item.minimumStockAlert ? 'bg-[#C62828]' : 'bg-[#228B22]')} />
              </div>
            );
          })}
        </div>
      )}

      {/* Restock Modal */}
      {isRestockModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-[#2C1810]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[4rem] w-full max-w-lg overflow-hidden shadow-2xl animate-scaleIn border-8 border-white/20">
            <div className="p-10 border-b border-[#E8D5C4] flex justify-between items-center bg-[#FFF8F0]/50">
              <div>
                <h2 className="text-4xl font-black text-[#2C1810]" style={{ fontFamily: 'Playfair Display' }}>Inventory Tuning</h2>
                <p className="text-xs font-black text-[#8B7355] uppercase tracking-[0.25em] mt-2">Resource Replenishment</p>
              </div>
              <button onClick={() => setIsRestockModalOpen(false)} className="w-14 h-14 rounded-full bg-white border-2 border-[#E8D5C4] flex items-center justify-center text-[#8B7355] hover:text-[#2C1810] transition-all shadow-md active:scale-90">
                <X size={28} />
              </button>
            </div>
            
            <form onSubmit={handleRestock} className="p-12 space-y-10">
              <div className="flex flex-col items-center text-center space-y-4">
                 <div className="w-32 h-32 rounded-[3rem] overflow-hidden border-4 border-[#FFF8F0] shadow-xl">
                    {selectedItem.imageUrl ? (
                       <img src={selectedItem.imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                       <div className="w-full h-full bg-[#8B4513]/10 flex items-center justify-center text-[#8B4513]">
                          <PackagePlus size={48} />
                       </div>
                    )}
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-[#2C1810] leading-tight">{selectedItem.itemName}</h3>
                    <p className="text-[#8B7355] font-bold text-sm">Currently holding {selectedItem.stockQuantity ?? 0} {selectedItem.stockUnit}</p>
                 </div>
              </div>

              <div className="bg-[#FFF8F0] p-10 rounded-[3rem] border-2 border-[#E8D5C4] space-y-6">
                <label className="block text-[11px] font-black text-[#8B7355] mb-2 uppercase tracking-[0.3em] text-center">Batch Quantity to Add</label>
                <div className="flex items-center justify-center gap-8">
                  <button type="button" onClick={() => setStockToAdd(s => Math.max(0, s - 1))} className="w-16 h-16 rounded-3xl bg-white border-2 border-[#E8D5C4] flex items-center justify-center text-[#2C1810] text-3xl font-black hover:bg-black hover:text-white transition-all active:scale-90 shadow-sm">-</button>
                  <input 
                    type="number" min="0" required
                    value={stockToAdd} onChange={e => setStockToAdd(Number(e.target.value))}
                    className="w-32 bg-transparent border-none text-center font-black text-6xl text-[#2C1810] outline-none focus:ring-0" 
                  />
                  <button type="button" onClick={() => setStockToAdd(s => s + 1)} className="w-16 h-16 rounded-3xl bg-[#2C1810] flex items-center justify-center text-white text-3xl font-black hover:bg-black transition-all active:scale-90 shadow-xl shadow-[#2C1810]/20">+</button>
                </div>
                <div className="flex items-center justify-center gap-3 pt-4 border-t border-[#E8D5C4]/50">
                   <span className="text-[10px] font-black text-[#8B7355] uppercase tracking-widest">Projected Level</span>
                   <ArrowRight size={16} className="text-[#8B4513]" />
                   <span className="text-lg font-black text-[#228B22]">{(selectedItem.stockQuantity ?? 0) + stockToAdd} {selectedItem.stockUnit}</span>
                </div>
              </div>
              
              <button 
                disabled={stockToAdd <= 0 || updateStockMutation.isPending} 
                type="submit" 
                className="w-full py-6 rounded-[2rem] text-white font-black text-xs uppercase tracking-widest bg-[#2C1810] hover:bg-black transition-all shadow-2xl shadow-[#2C1810]/30 active:scale-95 disabled:opacity-50"
              >
                {updateStockMutation.isPending ? 'Propagating Updates...' : 'Authorize Replenishment'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StockManagementPage;
