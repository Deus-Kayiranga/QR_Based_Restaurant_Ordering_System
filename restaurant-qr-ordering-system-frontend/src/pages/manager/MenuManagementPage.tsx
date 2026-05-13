import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  MoreVertical,
  Filter,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { useMenu, useCategories } from '../../hooks/useMenu';
import { formatCurrency } from '../../utils/format';
import { cn } from '../../utils/classNames';

const MenuManagementPage: React.FC = () => {
  const { data: categoriesRes } = useCategories();
  const { data: menuRes, isLoading } = useMenu();
  const [activeCategory, setActiveCategory] = useState<number | 'all'>('all');

  const categories = categoriesRes || [];
  const items = Array.isArray(menuRes) ? menuRes : (menuRes as any)?.content || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-textPrimary" style={{ fontFamily: 'Playfair Display' }}>Menu Management</h2>
        <button className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
          <Plus size={20} />
          Add New Item
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-border shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" />
          <input 
            type="text" 
            placeholder="Search menu items..." 
            className="w-full bg-bg border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto no-scrollbar">
          <button 
            onClick={() => setActiveCategory('all')}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all",
              activeCategory === 'all' ? "bg-primary text-white" : "bg-bg text-textSecondary"
            )}
          >
            All Categories
          </button>
          {categories.map(cat => (
            <button 
              key={cat.categoryId}
              onClick={() => setActiveCategory(cat.categoryId)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all",
                activeCategory === cat.categoryId ? "bg-primary text-white" : "bg-bg text-textSecondary"
              )}
            >
              {cat.categoryName}
            </button>
          ))}
        </div>
      </div>

      {/* Items Table/Grid */}
      <div className="bg-white rounded-[2.5rem] border border-border overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-bg border-b border-border">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-textSecondary uppercase tracking-widest">Item</th>
              <th className="px-6 py-4 text-[10px] font-bold text-textSecondary uppercase tracking-widest">Category</th>
              <th className="px-6 py-4 text-[10px] font-bold text-textSecondary uppercase tracking-widest">Price</th>
              <th className="px-6 py-4 text-[10px] font-bold text-textSecondary uppercase tracking-widest">Stock</th>
              <th className="px-6 py-4 text-[10px] font-bold text-textSecondary uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-textSecondary uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {isLoading ? (
              <tr><td colSpan={6} className="text-center py-10">Loading...</td></tr>
            ) : items.map((item: any) => (
              <tr key={item.itemId} className="hover:bg-bg/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-bg border border-border overflow-hidden flex-shrink-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-textSecondary/40">
                          <ImageIcon size={16} />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-textPrimary">{item.itemName}</p>
                      <p className="text-[10px] text-textSecondary uppercase">{item.destinationStation}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium text-textSecondary">{item.categoryName || 'General'}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-primary">{formatCurrency(item.price)}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-xs font-bold",
                      item.currentStock < 10 ? "text-danger" : "text-textPrimary"
                    )}>
                      {item.currentStock} {item.stockUnit}
                    </span>
                    {item.currentStock < item.minimumStockAlert && (
                      <AlertTriangle size={14} className="text-danger" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5",
                    item.isAvailable ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                  )}>
                    {item.isAvailable ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    {item.isAvailable ? 'Available' : 'Sold Out'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-bg rounded-lg text-textSecondary hover:text-primary transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2 hover:bg-danger/10 rounded-lg text-textSecondary hover:text-danger transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MenuManagementPage;
