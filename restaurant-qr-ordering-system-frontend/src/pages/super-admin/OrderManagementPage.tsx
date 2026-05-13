import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ordersApi } from '../../api/orders'
import { tablesApi } from '../../api/tables'
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton'
import { Search, Eye, X, Filter, RefreshCw } from 'lucide-react'
import { COLORS } from '../../styles/theme'
import { formatCurrency } from '../../utils/format'

export function OrderManagementPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [tableFilter, setTableFilter] = useState('ALL')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [page, setPage] = useState(0)

  const { data: ordersData, isLoading: ordersLoading, refetch } = useQuery({
    queryKey: ['orders', 'all', page],
    queryFn: () => ordersApi.getAllOrders(page, 10),
  })

  const { data: tables } = useQuery({
    queryKey: ['tables'],
    queryFn: () => tablesApi.getTables(),
  })

  const { data: orderDetails, isLoading: detailsLoading } = useQuery({
    queryKey: ['order', selectedOrder?.orderId],
    queryFn: () => ordersApi.getOrder(selectedOrder.orderId),
    enabled: !!selectedOrder,
  })

  // Local filtering since backend getAllOrders might not support all filters natively
  // In a real app, these would be passed to the API
  const filteredOrders = ordersData?.content?.filter((o: any) => {
    const matchStatus = statusFilter === 'ALL' || o.orderStatus === statusFilter
    const matchTable = tableFilter === 'ALL' || o.tableNumber === tableFilter
    const matchSearch = o.orderId.toString().includes(search) || o.tableNumber.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchTable && matchSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-200'
      case 'PREPARING': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'READY': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="max-w-7xl mx-auto pb-12" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#2C1810]" style={{ fontFamily: 'Playfair Display, serif' }}>Order Management</h1>
          <p className="text-[#8B7355] mt-1">View and track all restaurant orders</p>
        </div>
        <button 
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8D5C4] text-[#8B7355] rounded-xl font-bold hover:bg-[#FFF8F0] shadow-sm"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: COLORS.border }}>
        {/* Filters */}
        <div className="p-5 border-b border-[#E8D5C4] flex flex-wrap gap-4 items-center bg-[#FFF8F0]/30">
          <div className="flex items-center gap-2 bg-white border border-[#E8D5C4] rounded-xl px-3 py-2 flex-1 min-w-[200px] shadow-sm">
            <Search size={16} className="text-[#8B7355]" />
            <input 
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order # or table..." 
              className="bg-transparent border-none focus:ring-0 outline-none text-sm w-full text-[#2C1810]"
            />
          </div>
          
          <div className="flex items-center gap-2 bg-white border border-[#E8D5C4] rounded-xl px-3 py-2 shadow-sm">
            <Filter size={16} className="text-[#8B7355]" />
            <select 
              value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none text-sm font-semibold text-[#2C1810] focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="PLACED">Placed</option>
              <option value="PREPARING">Preparing</option>
              <option value="READY">Ready</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white border border-[#E8D5C4] rounded-xl px-3 py-2 shadow-sm">
            <select 
              value={tableFilter} onChange={(e) => setTableFilter(e.target.value)}
              className="bg-transparent border-none text-sm font-semibold text-[#2C1810] focus:outline-none"
            >
              <option value="ALL">All Tables</option>
              {tables?.map(t => <option key={t.tableId} value={t.tableNumber}>Table {t.tableNumber}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {ordersLoading ? (
            <div className="p-6"><LoadingSkeleton className="h-64" /></div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFF8F0] border-b text-xs uppercase tracking-wider text-[#8B7355]" style={{ borderColor: COLORS.border }}>
                  <th className="px-6 py-4 font-semibold">Order #</th>
                  <th className="px-6 py-4 font-semibold">Table</th>
                  <th className="px-6 py-4 font-semibold">Items</th>
                  <th className="px-6 py-4 font-semibold">Total</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Placed At</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredOrders?.map((order: any) => (
                  <tr key={order.orderId} className="border-b last:border-0 hover:bg-[#FFF8F0]/50 transition-colors" style={{ borderColor: COLORS.border }}>
                    <td className="px-6 py-4 font-bold text-[#2C1810]">#{order.orderId.toString().padStart(3, '0')}</td>
                    <td className="px-6 py-4 font-semibold text-[#8B7355]">{order.tableNumber}</td>
                    <td className="px-6 py-4 text-[#8B7355]">{order.items?.length || 0} items</td>
                    <td className="px-6 py-4 font-black" style={{ color: COLORS.primary }}>{formatCurrency(order.totalAmount)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 border rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#8B7355]">{new Date(order.placedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setSelectedOrder(order)} className="flex items-center justify-end gap-1 text-xs font-bold text-primary hover:underline ml-auto">
                        <Eye size={14} /> View
                      </button>
                    </td>
                  </tr>
                ))}
                {(!filteredOrders || filteredOrders.length === 0) && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-[#8B7355]">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination */}
        {ordersData?.totalPages > 1 && (
          <div className="p-4 border-t flex justify-between items-center bg-[#FFF8F0]/30" style={{ borderColor: COLORS.border }}>
            <span className="text-xs font-bold text-[#8B7355]">Page {page + 1} of {ordersData.totalPages}</span>
            <div className="flex gap-2">
              <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 rounded-lg border text-xs font-bold disabled:opacity-50" style={{ borderColor: COLORS.border, color: COLORS.primary }}>Prev</button>
              <button disabled={page >= ordersData.totalPages - 1} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 rounded-lg border text-xs font-bold disabled:opacity-50" style={{ borderColor: COLORS.border, color: COLORS.primary }}>Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-[#E8D5C4] flex justify-between items-center bg-[#FFF8F0]">
              <div>
                <h2 className="text-xl font-bold text-[#2C1810]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Order #{selectedOrder.orderId.toString().padStart(3, '0')}
                </h2>
                <p className="text-sm font-semibold text-[#8B7355]">Table {selectedOrder.tableNumber}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-[#8B7355]"><X size={20} /></button>
            </div>
            
            <div className="p-6">
              {detailsLoading ? (
                <LoadingSkeleton className="h-40" />
              ) : orderDetails ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-[#8B7355] uppercase tracking-wider font-bold mb-1">Status</p>
                      <span className={`px-2.5 py-1 border rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(orderDetails.orderStatus)}`}>
                        {orderDetails.orderStatus}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#8B7355] uppercase tracking-wider font-bold mb-1">Placed Time</p>
                      <p className="text-sm font-bold text-[#2C1810]">{new Date(orderDetails.placedAt).toLocaleTimeString()}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-[#8B7355] uppercase tracking-wider font-bold mb-3">Items</p>
                    <div className="space-y-3">
                      {orderDetails.items?.map((item: any) => (
                        <div key={item.orderItemId} className="flex justify-between items-center border-b pb-2 last:border-0" style={{ borderColor: COLORS.border }}>
                          <div>
                            <p className="font-bold text-[#2C1810] text-sm">{item.quantity}x {item.itemName}</p>
                            {item.specialNotes && <p className="text-xs text-[#8B7355]">Note: {item.specialNotes}</p>}
                          </div>
                          <div className="text-right">
                            <p className="font-black" style={{ color: COLORS.primary }}>{formatCurrency(item.unitPrice * item.quantity)}</p>
                            <span className="text-[10px] font-bold text-gray-500 uppercase">{item.itemStatus}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#FFF8F0] p-4 rounded-xl border" style={{ borderColor: COLORS.border }}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#8B7355] font-bold">Subtotal</span>
                      <span className="text-[#2C1810] font-bold">{formatCurrency(orderDetails.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-3">
                      <span className="text-[#8B7355] font-bold">Tax (18%)</span>
                      <span className="text-[#2C1810] font-bold">{formatCurrency(orderDetails.taxAmount)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t" style={{ borderColor: COLORS.border }}>
                      <span className="font-black text-[#2C1810]">Total</span>
                      <span className="font-black text-xl" style={{ color: COLORS.primary }}>{formatCurrency(orderDetails.totalAmount)}</span>
                    </div>
                  </div>
                  
                  {orderDetails.specialInstructions && (
                    <div className="p-3 bg-gray-50 rounded-xl border text-sm text-[#8B7355]" style={{ borderColor: COLORS.border }}>
                      <span className="font-bold text-[#2C1810]">Instructions:</span> {orderDetails.specialInstructions}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-center text-red-500 py-4">Failed to load details.</p>
              )}
            </div>
            <div className="p-4 border-t bg-gray-50 text-right" style={{ borderColor: COLORS.border }}>
              <button onClick={() => setSelectedOrder(null)} className="px-5 py-2.5 rounded-xl border bg-white font-bold text-[#2C1810] hover:bg-gray-50" style={{ borderColor: COLORS.border }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
