import { useState, ReactNode } from 'react';
import { LogOut, Bell, ChevronDown, Search, Settings, Coffee } from 'lucide-react';
import { UserRole } from '../../../data/mockData';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

interface StaffLayoutProps {
  role: UserRole;
  userName: string;
  userInitials?: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  navItems: NavItem[];
  children: ReactNode;
  onLogout: () => void;
  pageTitle?: string;
  unreadCount?: number;
}

const ROLE_META: Record<string, { label: string; color: string; badge: string }> = {
  waiter:       { label: 'Waiter',       color: '#4169E1', badge: 'bg-blue-100 text-blue-700' },
  kitchen_staff:{ label: 'Kitchen Staff',color: '#FF8C00', badge: 'bg-orange-100 text-orange-700' },
  bar_staff:    { label: 'Bar Staff',    color: '#0288D1', badge: 'bg-sky-100 text-sky-700' },
  cashier:      { label: 'Cashier',      color: '#228B22', badge: 'bg-green-100 text-green-700' },
  manager:      { label: 'Manager',      color: '#8B4513', badge: 'bg-amber-100 text-amber-700' },
  super_admin:  { label: 'Super Admin',  color: '#D2691E', badge: 'bg-red-100 text-red-700' },
};

export function StaffLayout({
  role, userName, userInitials: userInitialsProp, activeTab, setActiveTab,
  navItems, children, onLogout, pageTitle = '', unreadCount = 0,
}: StaffLayoutProps) {
  const userInitials = userInitialsProp || userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const meta = ROLE_META[role] || ROLE_META.waiter;
  const [searchVal, setSearchVal] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'DM Sans', sans-serif", background: '#F5EFE8' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .sidebar-nav-item { transition: all 0.18s ease; }
        .sidebar-nav-item:hover { background: #4A2512 !important; }
        .sidebar-active { background: #D2691E !important; border-left: 3px solid #FFA500 !important; }
        .content-area::-webkit-scrollbar { width: 6px; }
        .content-area::-webkit-scrollbar-track { background: transparent; }
        .content-area::-webkit-scrollbar-thumb { background: #E8D5C4; border-radius: 3px; }
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        .slide-down { animation: slideDown 0.2s ease; }
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside className="w-64 flex-shrink-0 flex flex-col fixed left-0 top-0 h-screen z-50 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #3E1A0A 0%, #2C1205 100%)' }}>

        {/* Logo */}
        <div className="px-5 py-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(210,105,30,0.25)' }}>
              <Coffee className="w-5 h-5 text-[#FFA500]" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                La Ta Bhore
              </h1>
              <p className="text-[11px]" style={{ color: '#B8A088' }}>Management System</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`sidebar-nav-item w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left relative border-l-3 border-transparent ${isActive ? 'sidebar-active' : ''}`}
                style={{ color: isActive ? '#fff' : '#C4A882' }}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-sm flex-1">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white min-w-[22px] text-center"
                    style={{ background: '#C62828' }}>
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile + Logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl mb-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: meta.color }}>
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{userName}</p>
              <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${meta.badge}`}>
                {meta.label}
              </span>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group"
            style={{ color: '#C4A882' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(198,40,40,0.15)'; (e.currentTarget as HTMLElement).style.color = '#ff6b6b'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#C4A882'; }}
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN AREA ── */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">

        {/* Header Bar */}
        <header className="h-16 bg-white border-b border-[#E8D5C4] flex items-center px-6 gap-4 sticky top-0 z-40 shadow-sm">
          <h2 className="text-lg font-bold text-[#2C1810] flex-shrink-0" style={{ fontFamily: 'Playfair Display, serif' }}>
            {pageTitle}
          </h2>

          {/* Search */}
          <div className="flex-1 max-w-md mx-auto hidden lg:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C4A882]" />
              <input
                type="text"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Search..."
                className="w-full bg-[#FFF8F0] border border-[#E8D5C4] rounded-xl pl-9 pr-4 py-2 text-sm text-[#2C1810] placeholder:text-[#C4A882] focus:outline-none focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/10 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Notifications */}
            <button className="relative w-9 h-9 rounded-xl bg-[#FFF8F0] border border-[#E8D5C4] flex items-center justify-center hover:border-[#8B4513] transition-colors">
              <Bell className="w-4 h-4 text-[#8B7355]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C62828] rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Settings */}
            <button className="w-9 h-9 rounded-xl bg-[#FFF8F0] border border-[#E8D5C4] flex items-center justify-center hover:border-[#8B4513] transition-colors">
              <Settings className="w-4 h-4 text-[#8B7355]" />
            </button>

            {/* User Avatar */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-[#FFF8F0] border border-[#E8D5C4] hover:border-[#8B4513] transition-colors"
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: meta.color }}>
                  {userInitials}
                </div>
                <span className="text-sm font-semibold text-[#2C1810] hidden xl:block">{userName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#8B7355]" />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-[#E8D5C4] shadow-[0_8px_24px_rgba(44,24,16,0.12)] overflow-hidden slide-down z-50">
                  <div className="px-4 py-3 border-b border-[#E8D5C4]">
                    <p className="font-semibold text-sm text-[#2C1810]">{userName}</p>
                    <p className="text-xs text-[#8B7355] capitalize">{meta.label}</p>
                  </div>
                  <button
                    onClick={() => { setShowUserMenu(false); onLogout(); }}
                    className="w-full px-4 py-3 flex items-center gap-2 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 content-area overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}