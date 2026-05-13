import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWaiter } from '../../contexts/WaiterContext';
import { 
  ChevronLeft, 
  Clock, 
  CheckCircle2, 
  ChefHat,
  UtensilsCrossed,
  Receipt,
  MessageSquare
} from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import { cn } from '../../utils/classNames';

const TableDetailPage: React.FC = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const navigate = useNavigate();
  const { myTables, myOrders, markAsServed } = useWaiter();
  const [isServing, setIsServing] = useState<number | null>(null);

  const table = myTables.find(t => t.tableId === Number(tableId));
  const activeOrder = myOrders.find(o => o.tableId === Number(tableId));

  if (!table) return <div className="p-8 text-center text-textSecondary">Table not found</div>;

  const handleServe = async (orderId: number, itemId: number) => {
    try {
      setIsServing(itemId);
      await markAsServed(orderId, itemId);
    } catch (error) {
      alert('Failed to mark as served');
    } finally {
      setIsServing(null);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-bg text-textPrimary animate-fadeIn">
      {/* Header */}
      <header className="p-4 md:p-6 flex items-center justify-between border-b border-border bg-white/80 backdrop-blur-xl sticky top-0 z-30 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-bg rounded-full transition-colors">
          <ChevronLeft size={24} className="text-textPrimary" />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-black tracking-widest uppercase text-textPrimary" style={{ fontFamily: 'Playfair Display' }}>Table {table.tableNumber}</h1>
          <p className="text-[10px] font-bold text-textSecondary uppercase tracking-[0.2em]">Session #{activeOrder?.orderId || 'Empty'}</p>
        </div>
        <div className="w-10" />
      </header>

      <div className="p-4 md:p-6 space-y-6 pb-32 overflow-y-auto flex-1">
        {!activeOrder ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-6">
            <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center border border-border shadow-sm">
              <UtensilsCrossed size={36} className="text-border" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2 text-textPrimary" style={{ fontFamily: 'Playfair Display' }}>No Active Order</h3>
              <p className="text-textSecondary text-sm max-w-xs mx-auto">This table is currently available for new customers.</p>
            </div>
            <button className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all">
              Manual Order
            </button>
          </div>
        ) : (
          <>
            {/* Status Summary */}
            <div className="bg-white border border-border rounded-[2rem] p-6 space-y-4 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-textSecondary text-sm font-medium">Order Status</span>
                <span className={cn(
                  "px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                  activeOrder.orderStatus === 'READY' ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : "bg-bg border-border text-textSecondary"
                )}>
                  {activeOrder.orderStatus}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-textSecondary text-sm font-medium">Total Amount</span>
                <span className="text-2xl font-black text-primary">{formatCurrency(activeOrder.totalAmount)}</span>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-textSecondary ml-2">Order Items</h3>
              {activeOrder.items.map((item) => (
                <div key={item.orderItemId} className="bg-white border border-border rounded-[2rem] p-5 flex items-center gap-4 group transition-all hover:border-primary/30 shadow-sm">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-bg flex-shrink-0 border border-border">
                    <img src={item.menuItem?.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-[15px] text-textPrimary truncate pr-2">{item.menuItem?.itemName}</h4>
                      <span className="text-textSecondary text-[12px] font-bold">x{item.quantity}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-2">
                      {item.itemStatus === 'PENDING' && (
                        <span className="text-[9px] font-bold uppercase tracking-widest text-textSecondary flex items-center gap-1">
                          <Clock size={10} /> Pending
                        </span>
                      )}
                      {item.itemStatus === 'PREPARING' && (
                        <span className="text-[9px] font-bold uppercase tracking-widest text-warning flex items-center gap-1">
                          <Clock size={10} className="animate-spin-slow" /> Preparing
                        </span>
                      )}
                      {item.itemStatus === 'READY' && (
                        <span className="text-[9px] font-black uppercase tracking-widest text-success flex items-center gap-1 animate-pulse">
                          <ChefHat size={10} /> Ready
                        </span>
                      )}
                      {item.itemStatus === 'SERVED' && (
                        <span className="text-[9px] font-bold uppercase tracking-widest text-primary flex items-center gap-1">
                          <CheckCircle2 size={10} /> Served
                        </span>
                      )}
                    </div>
                  </div>

                  {item.itemStatus === 'READY' && (
                    <button 
                      onClick={() => handleServe(activeOrder.orderId, item.orderItemId)}
                      disabled={isServing === item.orderItemId}
                      className="bg-success text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-success/20 active:scale-95 transition-all disabled:opacity-50"
                    >
                      {isServing === item.orderItemId ? '...' : 'Serve'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Floating Quick Actions */}
      {activeOrder && (
        <div className="fixed bottom-6 left-6 right-6 flex gap-4 z-40 max-w-md mx-auto">
          <button className="flex-1 bg-white border border-border text-textPrimary h-16 rounded-[1.5rem] flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-bg shadow-lg">
            <MessageSquare size={20} className="text-textSecondary" />
            <span className="text-xs font-black uppercase tracking-widest">Instructions</span>
          </button>
          <button 
            onClick={() => navigate(`/waiter/bill/${activeOrder.orderId}`)}
            className="flex-1 bg-primary text-white h-16 rounded-[1.5rem] flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(210,105,30,0.3)] active:scale-95 transition-all"
          >
            <Receipt size={20} />
            <span className="text-xs font-black uppercase tracking-widest">View Bill</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default TableDetailPage;
