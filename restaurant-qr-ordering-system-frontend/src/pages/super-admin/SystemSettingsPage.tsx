import { useState } from 'react'
import { Store, Settings, DollarSign, Bell, CheckCircle2, Save } from 'lucide-react'
import { COLORS } from '../../styles/theme'

export function SystemSettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  const [settings, setSettings] = useState({
    restaurantName: 'Azzurri Rwanda Restaurant',
    phone: '+250 788 123 456',
    address: 'Kigali, Rwanda',
    currency: 'RWF',
    taxRate: 18,
    serviceCharge: 0,
    enableWaiterCalls: true,
    enableMobileMoney: true,
    enableCashPayments: true,
  })

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }, 1000)
  }

  return (
    <div className="max-w-4xl mx-auto pb-12" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#2C1810]" style={{ fontFamily: 'Playfair Display, serif' }}>System Settings</h1>
          <p className="text-[#8B7355] mt-1">Configure global restaurant settings and features</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Restaurant Details */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: COLORS.border }}>
          <div className="p-5 border-b flex items-center gap-2 bg-[#FFF8F0]/50" style={{ borderColor: COLORS.border }}>
            <Store size={20} className="text-primary" />
            <h2 className="text-lg font-bold text-[#2C1810]">Restaurant Details</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#8B7355] mb-1.5 uppercase">Restaurant Name</label>
              <input required value={settings.restaurantName} onChange={e => setSettings({...settings, restaurantName: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5C4] focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all bg-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#8B7355] mb-1.5 uppercase">Contact Phone</label>
              <input required value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5C4] focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all bg-white" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#8B7355] mb-1.5 uppercase">Physical Address</label>
              <input required value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5C4] focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all bg-white" />
            </div>
          </div>
        </div>

        {/* Financial Settings */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: COLORS.border }}>
          <div className="p-5 border-b flex items-center gap-2 bg-[#FFF8F0]/50" style={{ borderColor: COLORS.border }}>
            <DollarSign size={20} className="text-primary" />
            <h2 className="text-lg font-bold text-[#2C1810]">Financial & Tax</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#8B7355] mb-1.5 uppercase">Currency Symbol</label>
              <input required value={settings.currency} onChange={e => setSettings({...settings, currency: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5C4] focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all bg-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#8B7355] mb-1.5 uppercase">Tax Rate (%)</label>
              <input required type="number" min="0" max="100" value={settings.taxRate} onChange={e => setSettings({...settings, taxRate: Number(e.target.value)})} className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5C4] focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all bg-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#8B7355] mb-1.5 uppercase">Service Charge (%)</label>
              <input required type="number" min="0" max="100" value={settings.serviceCharge} onChange={e => setSettings({...settings, serviceCharge: Number(e.target.value)})} className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5C4] focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all bg-white" />
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: COLORS.border }}>
          <div className="p-5 border-b flex items-center gap-2 bg-[#FFF8F0]/50" style={{ borderColor: COLORS.border }}>
            <Settings size={20} className="text-primary" />
            <h2 className="text-lg font-bold text-[#2C1810]">Feature Toggles</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border border-[#E8D5C4] hover:bg-gray-50 transition-colors">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Bell size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-[#2C1810]">Waiter Call System</h4>
                  <p className="text-sm text-[#8B7355]">Allow customers to call waiters from their table QR session.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={settings.enableWaiterCalls} onChange={e => setSettings({...settings, enableWaiterCalls: e.target.checked})} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl border border-[#E8D5C4] hover:bg-gray-50 transition-colors">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                  <DollarSign size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-[#2C1810]">Mobile Money Payments</h4>
                  <p className="text-sm text-[#8B7355]">Accept MTN MoMo and Airtel Money directly on the customer bill page.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={settings.enableMobileMoney} onChange={e => setSettings({...settings, enableMobileMoney: e.target.checked})} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl border border-[#E8D5C4] hover:bg-gray-50 transition-colors">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                  <DollarSign size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-[#2C1810]">Cash Payments</h4>
                  <p className="text-sm text-[#8B7355]">Allow customers to request paying by cash via waiter.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={settings.enableCashPayments} onChange={e => setSettings({...settings, enableCashPayments: e.target.checked})} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-end gap-4 pt-4">
          {showSuccess && (
            <span className="flex items-center gap-1.5 text-green-600 font-bold animate-in fade-in slide-in-from-right-4">
              <CheckCircle2 size={18} /> Settings Saved
            </span>
          )}
          <button 
            type="submit" disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primaryDark transition-colors shadow-sm disabled:opacity-70"
            style={{ backgroundColor: COLORS.primary }}
          >
            {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

      </form>
    </div>
  )
}
