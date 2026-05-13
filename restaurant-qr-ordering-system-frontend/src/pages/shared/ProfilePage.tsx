import React from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Camera, 
  Key, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { COLORS } from '../../styles/theme';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-10">
      <h2 className="text-3xl font-bold text-textPrimary" style={{ fontFamily: 'Playfair Display' }}>My Profile</h2>

      {/* Profile Header */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-border shadow-sm flex flex-col items-center text-center">
        <div className="relative group mb-6">
          <div className="w-32 h-32 bg-primary/5 rounded-[2.5rem] border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
            <User size={64} className="text-primary" />
          </div>
          <button className="absolute -bottom-2 -right-2 bg-primary text-white p-2.5 rounded-2xl shadow-lg hover:scale-110 transition-transform">
            <Camera size={20} />
          </button>
        </div>
        
        <h3 className="text-2xl font-bold text-textPrimary">{user?.firstName} {user?.lastName}</h3>
        <p className="text-sm font-bold text-primary uppercase tracking-widest mt-1">{user?.role.replace('_', ' ')}</p>
        
        <div className="mt-8 grid grid-cols-2 gap-4 w-full">
          <div className="bg-bg rounded-2xl p-4">
            <p className="text-[10px] font-bold text-textSecondary uppercase tracking-widest mb-1">Joined Date</p>
            <p className="text-sm font-bold text-textPrimary">March 12, 2026</p>
          </div>
          <div className="bg-bg rounded-2xl p-4">
            <p className="text-[10px] font-bold text-textSecondary uppercase tracking-widest mb-1">Status</p>
            <p className="text-sm font-bold text-success">Active Member</p>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-[2.5rem] p-4 border border-border shadow-sm divide-y divide-border/50">
        <button className="w-full p-4 flex items-center justify-between group hover:bg-bg/50 rounded-t-[2rem] transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-bg rounded-xl flex items-center justify-center text-textSecondary group-hover:text-primary transition-colors">
              <Mail size={20} />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-textPrimary">Email Address</p>
              <p className="text-xs text-textSecondary">{user?.email}</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-textSecondary" />
        </button>

        <button className="w-full p-4 flex items-center justify-between group hover:bg-bg/50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-bg rounded-xl flex items-center justify-center text-textSecondary group-hover:text-primary transition-colors">
              <Phone size={20} />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-textPrimary">Phone Number</p>
              <p className="text-xs text-textSecondary">+250 78x xxx xxx</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-textSecondary" />
        </button>

        <button className="w-full p-4 flex items-center justify-between group hover:bg-bg/50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-bg rounded-xl flex items-center justify-center text-textSecondary group-hover:text-primary transition-colors">
              <Key size={20} />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-textPrimary">Security Settings</p>
              <p className="text-xs text-textSecondary">Update your password</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-textSecondary" />
        </button>

        <button 
          onClick={logout}
          className="w-full p-4 flex items-center justify-between group hover:bg-danger/5 rounded-b-[2rem] transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-danger/10 rounded-xl flex items-center justify-center text-danger">
              <LogOut size={20} />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-danger">Sign Out</p>
              <p className="text-xs text-danger/60">Log out of your account</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
