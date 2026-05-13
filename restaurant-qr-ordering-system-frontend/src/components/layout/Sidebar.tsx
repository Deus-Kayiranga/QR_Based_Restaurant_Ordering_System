import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Users,
  TableProperties,
  Receipt,
  ChefHat,
  Beer,
  Settings,
  LogOut,
  X,
  ClipboardList,
  BarChart3,
  History,
  Package,
  Shield,
  Bell,
  User,
  FileText,
  CreditCard,
  Coffee,
  ChevronDown,
  ChevronRight,
  Map,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { COLORS } from '../../styles/theme';

export interface NavItem {
  to: string;
  label: string;
  icon: any;
}

export interface SidebarProps {
  items?: NavItem[];
  role?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavGroup {
  label: string;
  items: { path: string; icon: any; label: string }[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose = () => {} }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expandedGroups, setExpandedGroups] = useState<string[]>([
    'Management', 'Operations', 'Analytics', 'Restaurant', 'System', 'My Work', 'Billing', 'Account'
  ]);

  const toggleGroup = (label: string) => {
    setExpandedGroups(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  const getNavGroups = (): NavGroup[] => {
    switch (user?.role) {
      case 'SUPER_ADMIN':
        return [
          {
            label: 'main',
            items: [
              { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            ],
          },
          {
            label: 'Management',
            items: [
              { path: '/admin/staff', icon: Users, label: 'Staff Management' },
              { path: '/admin/menu', icon: UtensilsCrossed, label: 'Menu Management' },
              { path: '/admin/orders', icon: ClipboardList, label: 'Order Management' },
              { path: '/admin/billing', icon: Receipt, label: 'Billing Management' },
              { path: '/admin/stock', icon: Package, label: 'Stock Management' },
            ],
          },
          {
            label: 'Restaurant',
            items: [
              { path: '/admin/tables', icon: TableProperties, label: 'Table Management' },
            ],
          },
          {
            label: 'System',
            items: [
              { path: '/admin/settings', icon: Settings, label: 'System Settings' },
              { path: '/admin/logs', icon: FileText, label: 'Activity Logs' },
            ],
          },
          {
            label: 'Account',
            items: [
              { path: '/profile', icon: User, label: 'My Profile' },
              { path: '/notifications', icon: Bell, label: 'Notifications' },
              { path: '/change-password', icon: Shield, label: 'Change Password' },
            ],
          },
        ];

      case 'MANAGER':
        return [
          {
            label: 'main',
            items: [
              { path: '/manager/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            ],
          },
          {
            label: 'Operations',
            items: [
              { path: '/manager/menu', icon: UtensilsCrossed, label: 'Menu Management' },
              { path: '/manager/orders', icon: ClipboardList, label: 'Orders' },
              { path: '/manager/tables', icon: TableProperties, label: 'Tables Status' },
              { path: '/manager/assignments', icon: Map, label: 'Assignments' },
              { path: '/manager/stock', icon: Package, label: 'Stock' },
              { path: '/manager/bills', icon: Receipt, label: 'Bills' },
            ],
          },
          {
            label: 'Analytics',
            items: [
              { path: '/manager/reports', icon: BarChart3, label: 'Reports' },
            ],
          },
          {
            label: 'Account',
            items: [
              { path: '/profile', icon: User, label: 'My Profile' },
              { path: '/notifications', icon: Bell, label: 'Notifications' },
            ],
          },
        ];

      case 'CASHIER':
        return [
          {
            label: 'main',
            items: [
              { path: '/cashier/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            ],
          },
          {
            label: 'Billing',
            items: [
              { path: '/cashier/bills', icon: Receipt, label: 'Pending Bills' },
              { path: '/cashier/pay', icon: CreditCard, label: 'Process Payment' },
              { path: '/cashier/history', icon: History, label: 'Payment History' },
              { path: '/cashier/shift', icon: Coffee, label: 'Shift Summary' },
            ],
          },
          {
            label: 'Account',
            items: [
              { path: '/profile', icon: User, label: 'My Profile' },
              { path: '/notifications', icon: Bell, label: 'Notifications' },
            ],
          },
        ];

      case 'KITCHEN_STAFF':
        return [
          {
            label: 'main',
            items: [
              { path: '/kitchen/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
              { path: '/kitchen/line', icon: ChefHat, label: 'Kitchen Line' },
            ],
          },
          {
            label: 'Account',
            items: [
              { path: '/profile', icon: User, label: 'My Profile' },
              { path: '/notifications', icon: Bell, label: 'Notifications' },
            ],
          },
        ];

      case 'BAR_STAFF':
        return [
          {
            label: 'main',
            items: [
              { path: '/bar/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
              { path: '/bar/line', icon: Beer, label: 'Bar Line' },
              { path: '/bar/stock', icon: Package, label: 'Stock Manager' },
            ],
          },
          {
            label: 'Account',
            items: [
              { path: '/profile', icon: User, label: 'My Profile' },
              { path: '/notifications', icon: Bell, label: 'Notifications' },
            ],
          },
        ];

      case 'WAITER':
        return [
          {
            label: 'main',
            items: [
              { path: '/waiter/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            ],
          },
          {
            label: 'My Work',
            items: [
              { path: '/waiter/tables', icon: TableProperties, label: 'My Tables' },
              { path: '/waiter/orders', icon: ClipboardList, label: 'My Orders' },
            ],
          },
          {
            label: 'Account',
            items: [
              { path: '/profile', icon: User, label: 'My Profile' },
              { path: '/notifications', icon: Bell, label: 'Notifications' },
            ],
          },
        ];

      default:
        return [];
    }
  };

  const groups = getNavGroups();
  const roleLabel = user?.role?.replace(/_/g, ' ') || 'Staff';

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(44, 24, 16, 0.5)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 w-[260px] z-50 flex flex-col
          transform transition-transform duration-300 ease-in-out 
          lg:translate-x-0 lg:static lg:h-full lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ background: COLORS.card, borderRight: `1px solid ${COLORS.border}`, boxShadow: '4px 0 20px rgba(44,24,16,0.08)' }}
      >
        {/* Logo + Role Header */}
        <div style={{ background: `linear-gradient(145deg, ${COLORS.primary}, ${COLORS.secondary})` }} className="px-5 pt-6 pb-5 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                <UtensilsCrossed size={22} color="white" />
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Azzurri Rwanda
                </p>
                <p className="text-[10px] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.65)' }}>Restaurant</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-xl transition-colors"
              style={{ background: 'rgba(255,255,255,0.15)' }}
            >
              <X size={18} color="white" />
            </button>
          </div>

          {/* User Info card */}
          <button
            className="w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
            onClick={() => { navigate('/profile'); onClose(); }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.25)' }}>
              <User size={18} color="white" />
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[10px] uppercase tracking-wider truncate" style={{ color: 'rgba(255,255,255,0.65)' }}>{roleLabel}</p>
            </div>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 no-scrollbar">
          {groups.map((group) => (
            <div key={group.label} className="mb-2">
              {/* Section header — collapsible for non-main groups */}
              {group.label !== 'main' && (
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center justify-between px-2 py-1.5 mb-1 rounded-lg transition-colors hover:opacity-80"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: COLORS.textSecondary }}>
                    {group.label}
                  </span>
                  {expandedGroups.includes(group.label)
                    ? <ChevronDown size={12} style={{ color: COLORS.textSecondary }} />
                    : <ChevronRight size={12} style={{ color: COLORS.textSecondary }} />
                  }
                </button>
              )}

              {/* Nav items */}
              {(group.label === 'main' || expandedGroups.includes(group.label)) && (
                <div className="space-y-0.5">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path.endsWith('dashboard') || item.path === '/profile' || item.path === '/notifications'}
                      onClick={() => window.innerWidth < 1024 && onClose()}
                      className="block"
                    >
                      {({ isActive }) => (
                        <div
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer"
                          style={
                            isActive
                              ? {
                                  background: COLORS.primary,
                                  color: 'white',
                                  boxShadow: `0 4px 12px ${COLORS.primary}40`,
                                }
                              : {
                                  color: COLORS.textPrimary,
                                }
                          }
                          onMouseEnter={e => {
                            if (!isActive) (e.currentTarget as HTMLDivElement).style.background = COLORS.bg;
                          }}
                          onMouseLeave={e => {
                            if (!isActive) (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                          }}
                        >
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
                            style={
                              isActive
                                ? { background: 'rgba(255,255,255,0.2)' }
                                : { background: COLORS.bg }
                            }
                          >
                            <item.icon
                              size={16}
                              style={{ color: isActive ? 'white' : COLORS.primary }}
                            />
                          </div>
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Divider + Logout */}
        <div className="flex-shrink-0 p-3" style={{ borderTop: `1px solid ${COLORS.border}` }}>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group"
            style={{ color: COLORS.danger }}
            onMouseEnter={e => (e.currentTarget.style.background = '#C6282810')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#C6282810' }}>
              <LogOut size={16} style={{ color: COLORS.danger }} />
            </div>
            <span className="text-sm font-semibold">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
