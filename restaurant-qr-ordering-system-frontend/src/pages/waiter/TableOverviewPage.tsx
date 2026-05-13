import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWaiter } from '../../contexts/WaiterContext';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  CreditCard,
  ChefHat
} from 'lucide-react';
import { cn } from '../../utils/classNames';

const TableOverviewPage: React.FC = () => {
  const { myTables, myOrders, isLoading } = useWaiter();
  const navigate = useNavigate();

  const getTableStatus = (tableId: number) => {
    const activeOrder = myOrders.find(o => o.tableId === tableId);
    if (!activeOrder) return 'available';
    
    const hasReadyItems = activeOrder.items.some(i => i.itemStatus === 'READY');
    if (hasReadyItems) return 'ready';
    
    if (activeOrder.orderStatus === 'PLACED' || activeOrder.orderStatus === 'CONFIRMED' || activeOrder.orderStatus === 'PREPARING') {
      return 'preparing';
    }
    
    return 'occupied';
  };

  return (
    <div className="p-4 md:p-6 pb-24 space-y-8 animate-fadeIn">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary" style={{ fontFamily: 'Playfair Display' }}>My Tables</h1>
          <p className="text-textSecondary text-sm">Overview of your assigned section</p>
        </div>
        <div className="bg-white border border-border rounded-2xl px-4 py-2 text-right shadow-sm">
          <div className="text-[10px] font-bold text-textSecondary uppercase tracking-widest">Active Orders</div>
          <div className="text-xl font-black text-primary">{myOrders.length}</div>
        </div>
      </header>

      {isLoading && myTables.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-textSecondary font-bold uppercase tracking-widest text-xs">Loading Tables...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {myTables.map((table) => {
            const status = getTableStatus(table.tableId);
            const activeOrder = myOrders.find(o => o.tableId === table.tableId);
            
            return (
              <button
                key={table.tableId}
                onClick={() => navigate(`/waiter/tables/${table.tableId}`)}
                className={cn(
                  "relative aspect-square rounded-[2.5rem] border transition-all duration-300 flex flex-col items-center justify-center gap-3 group overflow-hidden shadow-sm",
                  status === 'available' && "bg-white border-success/30 text-success hover:bg-success/5 hover:border-success/50",
                  status === 'ready' && "bg-primary border-primary text-white shadow-[0_0_20px_rgba(210,105,30,0.3)] animate-pulse",
                  status === 'preparing' && "bg-white border-warning/30 text-warning hover:bg-warning/5",
                  status === 'occupied' && "bg-white border-border text-textSecondary"
                )}
              >
                <span className="text-3xl font-black relative z-10">{table.tableNumber}</span>
                
                <div className="flex flex-col items-center gap-1 relative z-10">
                  {status === 'available' && (
                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
                      <CheckCircle2 size={12} />
                      <span>Free</span>
                    </div>
                  )}
                  {status === 'ready' && (
                    <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-black/20 px-2 py-1 rounded-full">
                      <ChefHat size={12} />
                      <span>Ready!</span>
                    </div>
                  )}
                  {status === 'preparing' && (
                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
                      <Clock size={12} className="animate-spin-slow" />
                      <span>Prep</span>
                    </div>
                  )}
                  
                  <div className={cn(
                    "flex items-center gap-1 text-[10px] opacity-60 mt-1 font-medium",
                    status === 'ready' ? "text-white" : "text-textSecondary"
                  )}>
                    <Users size={10} />
                    <span>{table.seatingCapacity} Seats</span>
                  </div>
                </div>

                {activeOrder && (
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    <span className={cn(
                      "text-[8px] font-black uppercase tracking-tighter opacity-60",
                      status === 'ready' ? "text-white" : "text-textSecondary"
                    )}>#{activeOrder.orderId}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Quick Action Stats */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border border-border rounded-[2rem] p-6 flex flex-col gap-2 shadow-sm">
          <AlertCircle size={20} className="text-warning" />
          <div className="text-2xl font-black text-textPrimary">2</div>
          <div className="text-[10px] font-bold text-textSecondary uppercase tracking-widest">Calls for Assist</div>
        </div>
        <div className="bg-white border border-border rounded-[2rem] p-6 flex flex-col gap-2 shadow-sm">
          <CreditCard size={20} className="text-primary" />
          <div className="text-2xl font-black text-textPrimary">3</div>
          <div className="text-[10px] font-bold text-textSecondary uppercase tracking-widest">Bill Requests</div>
        </div>
      </div>
    </div>
  );
};

export default TableOverviewPage;
