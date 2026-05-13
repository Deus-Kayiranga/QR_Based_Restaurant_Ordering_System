import React, { useState } from 'react';
import { 
  AlertTriangle, 
  History,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useMenu } from '../../hooks/useMenu';
import { menuApi } from '../../api/menu';
import { cn } from '../../utils/classNames';

const StockManager: React.FC = () => {
  const { data: menuRes, isLoading, refetch } = useMenu();
  const items = Array.isArray(menuRes) ? menuRes : (menuRes as any)?.content || [];

  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const lowStockItems = items.filter((item: any) => item.trackStock && item.stockQuantity !== null && item.stockQuantity <= 10);

  const toggleAvailability = async (item: any) => {
    try {
      setUpdatingId(item.itemId);
      await menuApi.updateItem(item.itemId, { ...item, isAvailable: !item.isAvailable });
      refetch();
    } catch (error) {
      alert("Failed to update availability");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8 pb-10 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-textPrimary" style={{ fontFamily: 'Playfair Display' }}>Inventory Management</h2>
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <div className="bg-danger/5 border border-danger/20 rounded-[2.5rem] p-8">
          <div className="flex items-center gap-3 mb-6 text-danger">
            <AlertTriangle size={28} />
            <h3 className="text-xl font-bold">Critical Stock Alerts</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lowStockItems.map((item: any) => (
              <div key={item.itemId} className="bg-white p-6 rounded-3xl border border-danger/20 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-textPrimary">{item.itemName}</p>
                  <p className="text-[10px] font-bold text-danger uppercase tracking-widest mt-1">
                    Only {item.stockQuantity} Left
                  </p>
                </div>
                <button 
                  onClick={() => toggleAvailability(item)}
                  disabled={updatingId === item.itemId}
                  className={cn(
                    "font-bold text-[10px] uppercase tracking-widest px-4 py-2 rounded-xl transition-all",
                    item.isAvailable ? "bg-danger/10 text-danger hover:bg-danger hover:text-white" : "bg-success/10 text-success hover:bg-success hover:text-white"
                  )}
                >
                  {updatingId === item.itemId ? '...' : (item.isAvailable ? 'Mark Out of Stock' : 'Mark Available')}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Stock Table */}
      <div className="bg-white rounded-[2.5rem] border border-border overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h3 className="font-bold text-textPrimary">All Menu Items</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-textSecondary uppercase tracking-widest">
              <div className="w-3 h-3 bg-success rounded-full"></div> Available
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-textSecondary uppercase tracking-widest">
              <div className="w-3 h-3 bg-danger rounded-full"></div> Out of Stock
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-bg">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-textSecondary uppercase tracking-widest">Item Name</th>
                <th className="px-6 py-4 text-[10px] font-bold text-textSecondary uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-[10px] font-bold text-textSecondary uppercase tracking-widest">Stock Level</th>
                <th className="px-6 py-4 text-[10px] font-bold text-textSecondary uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-textSecondary uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                <tr><td colSpan={5} className="text-center py-10 text-textSecondary font-bold text-sm">Loading inventory...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-textSecondary font-bold text-sm">No items found.</td></tr>
              ) : items.map((item: any) => (
                <tr key={item.itemId} className="hover:bg-bg/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-textPrimary text-sm">{item.itemName}</td>
                  <td className="px-6 py-4 text-xs font-bold text-textSecondary">{item.category?.categoryName || item.categoryName || 'Uncategorized'}</td>
                  <td className="px-6 py-4">
                    {item.trackStock ? (
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "font-bold text-sm px-3 py-1 rounded-full",
                          (item.stockQuantity || 0) <= 10 ? "bg-danger/10 text-danger" : "bg-success/10 text-success"
                        )}>
                          {item.stockQuantity || 0}
                        </span>
                        <span className="text-[10px] text-textSecondary font-bold uppercase tracking-widest">Units</span>
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold text-textSecondary uppercase tracking-widest">Unlimited</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {item.isAvailable ? (
                         <><CheckCircle2 size={16} className="text-success" /> <span className="text-xs font-bold text-success uppercase tracking-widest">Available</span></>
                      ) : (
                         <><XCircle size={16} className="text-danger" /> <span className="text-xs font-bold text-danger uppercase tracking-widest">Unavailable</span></>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => toggleAvailability(item)}
                      disabled={updatingId === item.itemId}
                      className={cn(
                        "font-bold text-[10px] uppercase tracking-widest px-4 py-2 rounded-xl transition-all",
                        item.isAvailable ? "bg-danger/5 text-danger hover:bg-danger hover:text-white" : "bg-success/5 text-success hover:bg-success hover:text-white"
                      )}
                    >
                      {updatingId === item.itemId ? '...' : (item.isAvailable ? 'Disable' : 'Enable')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockManager;
