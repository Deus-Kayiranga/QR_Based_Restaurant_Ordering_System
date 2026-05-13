import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { billsApi } from '../../api/bills'
import { paymentsApi } from '../../api/payments'
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton'
import { Search, Filter, Download, Receipt, Wallet, CreditCard, Banknote, Clock } from 'lucide-react'
import { COLORS } from '../../styles/theme'
import { formatCurrency } from '../../utils/format'

export function BillingManagementPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [methodFilter, setMethodFilter] = useState('ALL')
  const [page, setPage] = useState(0)

  const { data: billsData, isLoading } = useQuery({
    queryKey: ['bills', 'all', page],
    queryFn: () => billsApi.getBills({ page, size: 10 } as any),
  })

  const { data: paymentsSummary } = useQuery({
    queryKey: ['payments', 'summary'],
    queryFn: () => paymentsApi.getTodaySummary(),
  })

  const filteredBills = billsData?.content?.filter((b: any) => {
    const matchStatus = statusFilter === 'ALL' || b.billStatus === statusFilter
    // Assuming method is attached to bill if paid
    const matchSearch = b.billNumber.toLowerCase().includes(search.toLowerCase()) || 
                        b.orderId.toString().includes(search)
    return matchStatus && matchSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-green-100 text-green-700 border-green-200'
      case 'OPEN': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'READY': return 'bg-orange-100 text-orange-700 border-orange-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const exportCSV = () => {
    // Basic CSV export
    const headers = ['Bill Number', 'Order ID', 'Table', 'Subtotal', 'Tax', 'Total', 'Status', 'Date']
    const rows = filteredBills?.map((b: any) => [
      b.billNumber, b.orderId, b.tableNumber, b.subtotal, b.taxAmount, b.totalAmount, b.billStatus, b.generatedAt
    ]) || []
    
    const csvContent = [headers.join(','), ...rows.map((r: any) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `billing_report_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <div className="max-w-7xl mx-auto pb-12" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#2C1810]" style={{ fontFamily: 'Playfair Display, serif' }}>Billing & Invoices</h1>
          <p className="text-[#8B7355] mt-1">Manage restaurant transactions and payments</p>
        </div>
        <button 
          onClick={exportCSV}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-opacity shadow-sm"
          style={{ backgroundColor: COLORS.primary }}
        >
          <Download size={18} /> Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-2xl p-6 border shadow-sm" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-[#8B7355] uppercase tracking-wider mb-1">Today's Revenue</p>
              <h3 className="text-2xl font-black text-[#2C1810]" style={{ fontFamily: 'Playfair Display, serif' }}>
                {formatCurrency((paymentsSummary as any)?.totalRevenue || 0)}
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border shadow-sm" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Banknote size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-[#8B7355] uppercase tracking-wider mb-1">Cash Payments</p>
              <h3 className="text-2xl font-black text-[#2C1810]" style={{ fontFamily: 'Playfair Display, serif' }}>
                {formatCurrency((paymentsSummary as any)?.cashTotal || 0)}
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border shadow-sm" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <CreditCard size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-[#8B7355] uppercase tracking-wider mb-1">Mobile Money</p>
              <h3 className="text-2xl font-black text-[#2C1810]" style={{ fontFamily: 'Playfair Display, serif' }}>
                {formatCurrency((paymentsSummary as any)?.momoTotal || 0)}
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border shadow-sm" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-[#8B7355] uppercase tracking-wider mb-1">Pending Amount</p>
              <h3 className="text-2xl font-black text-[#2C1810]" style={{ fontFamily: 'Playfair Display, serif' }}>
                {formatCurrency((paymentsSummary as any)?.pendingTotal || 0)}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: COLORS.border }}>
        {/* Filters */}
        <div className="p-5 border-b border-[#E8D5C4] flex flex-wrap gap-4 items-center bg-[#FFF8F0]/30">
          <div className="flex items-center gap-2 bg-white border border-[#E8D5C4] rounded-xl px-3 py-2 flex-1 min-w-[200px] shadow-sm">
            <Search size={16} className="text-[#8B7355]" />
            <input 
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search bill number or order ID..." 
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
              <option value="OPEN">Open</option>
              <option value="READY">Ready for Payment</option>
              <option value="PAID">Paid</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-6"><LoadingSkeleton className="h-64" /></div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFF8F0] border-b text-xs uppercase tracking-wider text-[#8B7355]" style={{ borderColor: COLORS.border }}>
                  <th className="px-6 py-4 font-semibold">Bill No.</th>
                  <th className="px-6 py-4 font-semibold">Order ID</th>
                  <th className="px-6 py-4 font-semibold">Table</th>
                  <th className="px-6 py-4 font-semibold">Total Amount</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredBills?.map((bill: any) => (
                  <tr key={bill.billId} className="border-b last:border-0 hover:bg-[#FFF8F0]/50 transition-colors" style={{ borderColor: COLORS.border }}>
                    <td className="px-6 py-4 font-bold text-[#2C1810]">{bill.billNumber}</td>
                    <td className="px-6 py-4 font-bold text-[#8B7355]">#{bill.orderId}</td>
                    <td className="px-6 py-4 text-[#8B7355]">{bill.tableNumber}</td>
                    <td className="px-6 py-4 font-black" style={{ color: COLORS.primary }}>{formatCurrency(bill.totalAmount)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 border rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(bill.billStatus)}`}>
                        {bill.billStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#8B7355]">{new Date(bill.generatedAt).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      {bill.billStatus === 'PAID' && (
                        <button className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#FFF8F0] border text-primary hover:bg-primary hover:text-white transition-colors" style={{ borderColor: COLORS.border }}>
                          <Receipt size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {(!filteredBills || filteredBills.length === 0) && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-[#8B7355]">No bills found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination */}
        {billsData?.totalPages > 1 && (
          <div className="p-4 border-t flex justify-between items-center bg-[#FFF8F0]/30" style={{ borderColor: COLORS.border }}>
            <span className="text-xs font-bold text-[#8B7355]">Page {page + 1} of {billsData.totalPages}</span>
            <div className="flex gap-2">
              <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 rounded-lg border text-xs font-bold disabled:opacity-50" style={{ borderColor: COLORS.border, color: COLORS.primary }}>Prev</button>
              <button disabled={page >= billsData.totalPages - 1} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 rounded-lg border text-xs font-bold disabled:opacity-50" style={{ borderColor: COLORS.border, color: COLORS.primary }}>Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
