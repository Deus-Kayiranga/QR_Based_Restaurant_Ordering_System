import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationsApi } from '../../api/notifications'
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton'
import { Bell, CheckCircle2, Clock, AlertTriangle, Coffee, DollarSign, UtensilsCrossed, Trash2, Check } from 'lucide-react'
import { COLORS } from '../../styles/theme'

export function NotificationsPage() {
  const qc = useQueryClient()
  const { data: notifications, isLoading } = useQuery({ 
    queryKey: ['notifications'], 
    queryFn: () => notificationsApi.getNotifications() 
  })
  
  const mark = useMutation({
    mutationFn: (id: number) => notificationsApi.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })

  const markAll = useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'NEW_ORDER': return <UtensilsCrossed size={18} className="text-orange-600" />
      case 'ORDER_READY': return <CheckCircle2 size={18} className="text-green-600" />
      case 'ORDER_CANCELLED': return <AlertTriangle size={18} className="text-red-600" />
      case 'PAYMENT_RECEIVED': return <DollarSign size={18} className="text-blue-600" />
      case 'WAITER_CALL': return <Bell size={18} className="text-purple-600" />
      case 'SYSTEM_ALERT': return <AlertTriangle size={18} className="text-yellow-600" />
      default: return <Bell size={18} className="text-[#8B7355]" />
    }
  }

  const getNotificationBg = (type: string) => {
    switch(type) {
      case 'NEW_ORDER': return 'bg-orange-50'
      case 'ORDER_READY': return 'bg-green-50'
      case 'ORDER_CANCELLED': return 'bg-red-50'
      case 'PAYMENT_RECEIVED': return 'bg-blue-50'
      case 'WAITER_CALL': return 'bg-purple-50'
      case 'SYSTEM_ALERT': return 'bg-yellow-50'
      default: return 'bg-gray-50'
    }
  }

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0

  return (
    <div className="max-w-3xl mx-auto pb-12" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF8F0] border border-[#E8D5C4] flex items-center justify-center text-primary relative">
            <Bell size={24} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-black text-[#2C1810]" style={{ fontFamily: 'Playfair Display, serif' }}>Notifications</h1>
            <p className="text-[#8B7355] mt-1">Stay updated with system alerts and activities</p>
          </div>
        </div>
        
        {unreadCount > 0 && (
          <button 
            onClick={() => markAll.mutate()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8D5C4] text-[#8B7355] rounded-xl font-bold hover:bg-[#FFF8F0] shadow-sm transition-colors text-sm"
          >
            <Check size={16} /> Mark all read
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: COLORS.border }}>
        {isLoading ? (
          <div className="p-6 space-y-4">
            <LoadingSkeleton className="h-20" /><LoadingSkeleton className="h-20" /><LoadingSkeleton className="h-20" />
          </div>
        ) : notifications && notifications.length > 0 ? (
          <div className="divide-y" style={{ borderColor: COLORS.border }}>
            {notifications.map((n: any) => (
              <div 
                key={n.notificationId} 
                className={`p-5 flex items-start gap-4 transition-colors hover:bg-gray-50 ${!n.isRead ? 'bg-[#FFF8F0]/30' : 'bg-white'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getNotificationBg(n.type)}`}>
                  {getNotificationIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-bold text-sm ${!n.isRead ? 'text-[#2C1810]' : 'text-gray-700'}`}>
                      {n.title}
                    </h3>
                    <span className="flex items-center gap-1 text-xs text-[#8B7355] whitespace-nowrap">
                      <Clock size={12} /> {new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <p className={`text-sm ${!n.isRead ? 'text-[#2C1810]' : 'text-gray-500'}`}>
                    {n.message}
                  </p>
                  
                  {n.referenceType && n.referenceId && (
                    <div className="mt-2 text-xs font-bold text-primary uppercase tracking-wider">
                      Reference: {n.referenceType} #{n.referenceId}
                    </div>
                  )}
                </div>
                
                {!n.isRead && (
                  <button
                    onClick={() => mark.mutate(n.notificationId)}
                    className="flex-shrink-0 p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                    title="Mark as read"
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#E8D5C4]">
              <Bell size={32} />
            </div>
            <p className="font-bold text-lg text-[#2C1810]">All caught up!</p>
            <p className="text-[#8B7355]">You have no new notifications.</p>
          </div>
        )}
      </div>
    </div>
  )
}
