import React, { useState, useEffect } from 'react';
import { menuApi } from '../../api/menu';
import type { MenuItem } from '../../types';
import { 
  Package, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  History,
  Search,
  Filter,
  ArrowUpRight,
  RefreshCw,
  LayoutGrid,
  TrendingUp
} from 'lucide-react';
import { cn } from '../../utils/classNames';

const BarStockPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [restockAmount, setRestockAmount] = useState(0);

  const fetchData = async () => {
    try {
      const data = await menuApi.getMenu();
      const barItems = data.filter(item => 
        item.destinationStation === 'BAR' || 
        item.destinationStation?.toString() === 'BAR'
      );
      setMenuItems(barItems);
    } catch (error) {
      console.error('Failed to fetch bar stock', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRestock = async () => {
    if (!selectedItem || restockAmount <= 0) return;
    try {
      await menuApi.updateStock(selectedItem.itemId, (selectedItem.stockQuantity || 0) + restockAmount);
      setIsRestockModalOpen(false);
      setSelectedItem(null);
      setRestockAmount(0);
      fetchData();
    } catch (error) {
      console.error('Failed to restock item', error);
    }
  };

  const filteredItems = menuItems.filter(item => 
    item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockItems = menuItems.filter(item => item.trackStock && (item.stockQuantity || 0) <= (item.minStockLevel || 10));

  return (
    <div className="p-6 md:p-8 space-y-8 bg-[#FFF8F0] min-h-full animate-fadeIn text-[#2C1810]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-[#8B4513] rounded-2xl flex items-center justify-center shadow-lg shadow-[#8B4513]/20">
            <Package size={30} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter text-[#2C1810]" style={{ fontFamily: 'Playfair Display' }}>
              Bar Inventory
            </h1>
            <p className="text-[#8B7355] font-medium text-xs flex items-center gap-2 mt-1 uppercase tracking-widest">
              <History size={14} className="text-[#D2691E]" /> Real-time Stock Tracking
            </p>
          </div>
        </div>
        <button 
            onClick={fetchData}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-[#E8D5C4] rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#8B7355] hover:bg-[#FAF7F2] transition-all shadow-sm"
        >
            <RefreshCw size={14} /> Sync Database
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-[#E8D5C4] p-6 rounded-[2rem] flex items-center justify-between shadow-sm">
              <div>
                  <p className="text-[10px] font-black text-[#8B7355] uppercase tracking-[0.2em] mb-1">Total SKUs</p>
                  <p className="text-3xl font-black text-[#2C1810]">{menuItems.length}</p>
              </div>
              <div className="w-12 h-12 bg-[#FFF8F0] rounded-2xl flex items-center justify-center text-[#8B7355]">
                  <LayoutGrid size={24} />
              </div>
          </div>
          <div className="bg-white border border-[#E8D5C4] p-6 rounded-[2rem] flex items-center justify-between shadow-sm">
              <div>
                  <p className="text-[10px] font-black text-[#8B7355] uppercase tracking-[0.2em] mb-1">Low Stock</p>
                  <p className="text-3xl font-black text-red-600">{lowStockItems.length}</p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 border border-red-100">
                  <AlertTriangle size={24} />
              </div>
          </div>
          <div className="bg-white border border-[#E8D5C4] p-6 rounded-[2rem] flex items-center justify-between shadow-sm">
              <div>
                  <p className="text-[10px] font-black text-[#8B7355] uppercase tracking-[0.2em] mb-1">Stock Health</p>
                  <p className="text-3xl font-black text-green-600">94%</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 border border-green-100">
                  <TrendingUp size={24} />
              </div>
          </div>
      </div>

      {/* Main Stock Table */}
      <div className="bg-white rounded-[2.5rem] border border-[#E8D5C4] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#E8D5C4] flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1 max-w-md">
                 <h3 className="text-sm font-black uppercase tracking-[0.1em] text-[#2C1810]">Inventory List</h3>
                 <p className="text-[10px] text-[#8B7355] font-bold uppercase tracking-widest mt-0.5">Manage beverage stock levels</p>
            </div>
            <div className="flex items-center gap-4">
                <button className="p-4 bg-[#FFF8F0] border border-[#E8D5C4] rounded-2xl text-[#8B7355] hover:bg-white transition-all">
                    <Filter size={20} />
                </button>
                <div className="h-10 w-px bg-[#E8D5C4] mx-2" />
                <button className="flex items-center gap-2 px-8 py-4 bg-[#8B4513] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#8B4513]/20 hover:scale-105 transition-all">
                    <ArrowUpRight size={16} /> Inventory Report
                </button>
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-[#FFF8F0]">
                    <tr className="text-[10px] font-black uppercase tracking-widest text-[#8B7355] border-b border-[#E8D5C4]">
                        <th className="px-10 py-6">Product Item</th>
                        <th className="px-10 py-6">Category</th>
                        <th className="px-10 py-6 text-center">In Stock</th>
                        <th className="px-10 py-6 text-center">Minimum</th>
                        <th className="px-10 py-6">Level Status</th>
                        <th className="px-10 py-6 text-right">Inventory Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#FFF8F0]">
                    {filteredItems.map((item) => {
                        const isLow = item.trackStock && (item.stockQuantity || 0) <= (item.minStockLevel || 10);
                        return (
                            <tr key={item.itemId} className="hover:bg-[#FFF8F0]/50 transition-colors group">
                                <td className="px-10 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-[#FFF8F0] border border-[#E8D5C4] overflow-hidden flex items-center justify-center shrink-0">
                                            {item.imageUrl ? <img src={item.imageUrl} alt="" className="w-full h-full object-cover" /> : <Package size={22} className="text-[#8B7355]" />}
                                        </div>
                                        <div>
                                            <span className="text-[15px] font-bold text-[#2C1810] block leading-tight">{item.itemName}</span>
                                            <span className="text-[10px] text-[#8B7355] uppercase tracking-widest font-black mt-0.5 block">SKU-{item.itemId}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-6">
                                    <span className="px-3 py-1.5 bg-[#FFF8F0] rounded-lg text-[10px] font-black text-[#8B7355] uppercase border border-[#E8D5C4]">{item.categoryName || 'Beverages'}</span>
                                </td>
                                <td className="px-10 py-6 text-center">
                                    <span className={cn(
                                        "text-xl font-black",
                                        isLow ? "text-red-600" : "text-[#8B4513]"
                                    )}>{item.stockQuantity || 0}</span>
                                </td>
                                <td className="px-10 py-6 text-center text-xs font-bold text-[#8B7355]">{item.minStockLevel || 10}</td>
                                <td className="px-10 py-6">
                                    {isLow ? (
                                        <div className="flex items-center gap-2 text-red-600 font-black text-[10px] uppercase bg-red-50 px-3 py-1.5 rounded-full border border-red-100 w-fit">
                                            <AlertTriangle size={14} className="animate-pulse" /> Critical
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-green-600 font-black text-[10px] uppercase bg-green-50 px-3 py-1.5 rounded-full border border-green-100 w-fit">
                                            <CheckCircle2 size={14} /> Healthy
                                        </div>
                                    )}
                                </td>
                                <td className="px-10 py-6 text-right">
                                    <button 
                                        onClick={() => { setSelectedItem(item); setIsRestockModalOpen(true); }}
                                        className="inline-flex items-center gap-2 px-5 py-3 bg-white border border-[#E8D5C4] rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#8B7355] hover:bg-[#8B4513] hover:text-white hover:border-[#8B4513] transition-all shadow-sm active:scale-95"
                                    >
                                        Adjust Stock <Plus size={16} />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
      </div>

      {/* Restock Modal */}
      {isRestockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#2C1810]/60 backdrop-blur-sm" onClick={() => setIsRestockModalOpen(false)} />
            <div className="relative bg-white rounded-[3rem] w-full max-w-md p-10 shadow-2xl border border-[#E8D5C4] animate-scaleUp">
                <div className="text-center space-y-3 mb-10">
                    <div className="w-20 h-20 bg-[#FFF8F0] rounded-[2rem] flex items-center justify-center text-[#8B4513] mx-auto mb-6 border border-[#E8D5C4]">
                        <Package size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-[#2C1810] uppercase tracking-tighter" style={{ fontFamily: 'Playfair Display' }}>
                        Inventory Update
                    </h2>
                    <p className="text-[#8B7355] text-sm font-medium uppercase tracking-widest leading-relaxed">Adjusting quantities for <br/><span className="text-[#8B4513] font-black">{selectedItem?.itemName}</span></p>
                </div>

                <div className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-[#8B7355] uppercase tracking-[0.2em] ml-2">Units to Add</label>
                        <input 
                            type="number" 
                            value={restockAmount}
                            onChange={(e) => setRestockAmount(parseInt(e.target.value) || 0)}
                            className="w-full px-8 py-6 bg-[#FFF8F0] border border-[#E8D5C4] rounded-[2rem] text-3xl font-black text-[#8B4513] text-center focus:outline-none focus:ring-4 focus:ring-[#8B4513]/10"
                            placeholder="0"
                            autoFocus
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 pt-4">
                        <button 
                            onClick={handleRestock}
                            className="w-full py-6 bg-[#8B4513] text-white rounded-[2rem] text-xs font-black uppercase tracking-widest shadow-xl shadow-[#8B4513]/20 hover:bg-[#6B3410] active:scale-95 transition-all"
                        >
                            Confirm Update
                        </button>
                        <button 
                            onClick={() => setIsRestockModalOpen(false)}
                            className="w-full py-4 text-[#8B7355] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-[#2C1810] transition-all"
                        >
                            Discard Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default BarStockPage;
