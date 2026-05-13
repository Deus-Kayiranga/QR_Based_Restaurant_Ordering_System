import React from 'react';
import { Bell, User, Menu, Search, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { COLORS } from '../../styles/theme';

interface HeaderProps {
  onMenuClick?: () => void;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, title }) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  return (
    <header
      className="h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30"
      style={{
        background: 'rgba(255,248,240,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${COLORS.border}`,
        boxShadow: '0 2px 8px rgba(44,24,16,0.06)',
      }}
    >
      {/* Left — hamburger + title */}
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl transition-colors"
            style={{ color: COLORS.textPrimary }}
            onMouseEnter={e => (e.currentTarget.style.background = COLORS.bg)}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <Menu size={22} />
          </button>
        )}
        <h1
          className="text-base font-bold hidden sm:block"
          style={{ color: COLORS.textPrimary, fontFamily: "'Playfair Display', serif" }}
        >
          {title}
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5">
        {/* Search */}
        <div
          className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl transition-all"
          style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}` }}
        >
          <Search size={15} style={{ color: COLORS.textSecondary }} />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none focus:ring-0 text-sm w-36 outline-none"
            style={{ color: COLORS.textPrimary }}
          />
        </div>

        {/* Notifications */}
        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2 rounded-xl transition-colors"
          title="Notifications"
          onMouseEnter={e => (e.currentTarget.style.background = COLORS.bg)}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <Bell size={20} style={{ color: COLORS.textPrimary }} />
          {unreadCount > 0 && (
            <span
              className="absolute top-1.5 right-1.5 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full"
              style={{ background: COLORS.danger, border: `2px solid ${COLORS.bg}` }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Divider */}
        <div className="w-px h-6 mx-1" style={{ background: COLORS.border }} />

        {/* User Info */}
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl transition-colors"
          onMouseEnter={e => (e.currentTarget.style.background = COLORS.bg)}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${COLORS.primary}15`, border: `1px solid ${COLORS.primary}30` }}
          >
            <User size={16} style={{ color: COLORS.primary }} />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold leading-tight" style={{ color: COLORS.textPrimary }}>
              {user?.firstName} {user?.lastName}
            </p>
            <span
              className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
              style={{ background: `${COLORS.secondary}20`, color: COLORS.secondary }}
            >
              {user?.role?.replace(/_/g, ' ')}
            </span>
          </div>
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          title="Sign Out"
          className="p-2 rounded-xl transition-colors"
          onMouseEnter={e => (e.currentTarget.style.background = `${COLORS.danger}10`)}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <LogOut size={18} style={{ color: COLORS.textSecondary }} />
        </button>
      </div>
    </header>
  );
};

export default Header;
