import { useState } from 'react';
import {
  Plus, Edit, Trash2, Search, X, Check, Eye, EyeOff, Shield, Users, Coffee
} from 'lucide-react';
import { User, UserRole, mockUsers as initialUsers } from '../../../data/mockData';

interface StaffManagementProps {
  isAdmin: boolean;
}

interface StaffForm {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: UserRole;
  password: string;
}

const defaultForm: StaffForm = {
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  role: 'waiter',
  password: '',
};

const ROLE_OPTIONS: { value: UserRole; label: string; color: string; desc: string }[] = [
  { value: 'waiter', label: 'Waiter', color: '#4169E1', desc: 'Table service & order management' },
  { value: 'kitchen_staff', label: 'Kitchen Staff', color: '#FF8C00', desc: 'Food preparation & KDS' },
  { value: 'bar_staff', label: 'Bar Staff', color: '#0288D1', desc: 'Drinks preparation' },
  { value: 'cashier', label: 'Cashier', color: '#228B22', desc: 'Payment processing & billing' },
  { value: 'manager', label: 'Manager', color: '#8B4513', desc: 'Operations management' },
  { value: 'super_admin', label: 'Super Admin', color: '#6B3410', desc: 'Full system access' },
];

export function StaffManagement({ isAdmin }: StaffManagementProps) {
  const [staff, setStaff] = useState<User[]>(initialUsers.filter(u => u.role !== 'customer'));
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [staffForm, setStaffForm] = useState<StaffForm>(defaultForm);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filteredStaff = staff.filter(user => {
    const matchesSearch =
      user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const openAddModal = () => {
    setEditingUser(null);
    setStaffForm(defaultForm);
    setShowModal(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setStaffForm({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number,
      role: user.role,
      password: '',
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!staffForm.first_name || !staffForm.last_name || !staffForm.email || !staffForm.phone_number) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingUser) {
      // Update existing user
      setStaff(prev => prev.map(u => u.user_id === editingUser.user_id
        ? {
            ...u,
            first_name: staffForm.first_name,
            last_name: staffForm.last_name,
            email: staffForm.email,
            phone_number: staffForm.phone_number,
            role: staffForm.role,
          }
        : u
      ));
      showToast(`${staffForm.first_name} ${staffForm.last_name} updated successfully!`);
    } else {
      // Add new user
      const newUser: User = {
        user_id: Math.max(...staff.map(s => s.user_id)) + 1,
        first_name: staffForm.first_name,
        last_name: staffForm.last_name,
        email: staffForm.email,
        phone_number: staffForm.phone_number,
        role: staffForm.role,
        is_active: true,
        last_login_at: null,
        created_at: new Date().toISOString(),
      };
      setStaff(prev => [...prev, newUser]);
      showToast(`${staffForm.first_name} ${staffForm.last_name} added successfully!`);
    }

    setShowModal(false);
    setEditingUser(null);
  };

  const handleDelete = (user: User) => {
    if (confirm(`Are you sure you want to delete ${user.first_name} ${user.last_name}?`)) {
      setStaff(prev => prev.filter(u => u.user_id !== user.user_id));
      showToast(`${user.first_name} ${user.last_name} deleted`);
    }
  };

  const toggleActive = (userId: number) => {
    setStaff(prev => prev.map(u => u.user_id === userId ? { ...u, is_active: !u.is_active } : u));
  };

  const getRoleConfig = (role: UserRole) => ROLE_OPTIONS.find(r => r.value === role);

  const stats = {
    total: staff.length,
    active: staff.filter(u => u.is_active).length,
    byRole: ROLE_OPTIONS.map(r => ({
      role: r.value,
      label: r.label,
      color: r.color,
      count: staff.filter(u => u.role === r.value).length,
    })).filter(r => r.count > 0),
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-[#228b22] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 font-semibold">
          <Check className="w-4 h-4" />
          {toast}
        </div>
      )}

      {/* Header Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-[#e8d5c4]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#fff8f0] flex items-center justify-center">
              <Users className="w-6 h-6 text-[#8b4513]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#2c1810]">{stats.total}</p>
              <p className="text-xs text-[#8b7355]">Total Staff</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#e8d5c4]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#e8f5e9] flex items-center justify-center">
              <Check className="w-6 h-6 text-[#228b22]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#228b22]">{stats.active}</p>
              <p className="text-xs text-[#8b7355]">Active</p>
            </div>
          </div>
        </div>
        {stats.byRole.slice(0, 2).map(({ role, label, color, count }) => (
          <div key={role} className="bg-white rounded-xl p-4 border border-[#e8d5c4]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: color + '20' }}>
                <Coffee className="w-6 h-6" style={{ color }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#2c1810]">{count}</p>
                <p className="text-xs text-[#8b7355]">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-4 py-3 border border-[#e8d5c4]">
          <Search className="w-5 h-5 text-[#8b7355]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="flex-1 bg-transparent outline-none text-[#2c1810] placeholder:text-[#c4a882]"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
          className="bg-white rounded-xl px-4 py-3 border border-[#e8d5c4] text-[#2c1810] font-semibold outline-none cursor-pointer"
        >
          <option value="all">All Roles</option>
          {ROLE_OPTIONS.map(r => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
        <button
          onClick={openAddModal}
          className="bg-[#d2691e] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#8b4513] transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Add Staff
        </button>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(44,24,16,0.08)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e8d5c4] bg-[#fff8f0]">
              <th className="text-left py-4 px-5 text-sm font-bold text-[#8b7355]">Name</th>
              <th className="text-left py-4 px-5 text-sm font-bold text-[#8b7355]">Contact</th>
              <th className="text-left py-4 px-5 text-sm font-bold text-[#8b7355]">Role</th>
              <th className="text-left py-4 px-5 text-sm font-bold text-[#8b7355]">Status</th>
              <th className="text-left py-4 px-5 text-sm font-bold text-[#8b7355]">Last Login</th>
              <th className="text-left py-4 px-5 text-sm font-bold text-[#8b7355]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-[#8b7355]">
                  No staff members found
                </td>
              </tr>
            ) : (
              filteredStaff.map(user => {
                const roleConfig = getRoleConfig(user.role);
                return (
                  <tr key={user.user_id} className="border-b border-[#f5f0ea] hover:bg-[#fff8f0] transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                          style={{ background: roleConfig?.color || '#8b7355' }}
                        >
                          {user.first_name[0]}{user.last_name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-[#2c1810]">{user.first_name} {user.last_name}</p>
                          <p className="text-xs text-[#8b7355]">ID: {user.user_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <p className="text-sm text-[#2c1810]">{user.email}</p>
                      <p className="text-xs text-[#8b7355]">{user.phone_number}</p>
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white"
                        style={{ background: roleConfig?.color || '#8b7355' }}
                      >
                        {roleConfig?.label || user.role}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <button
                        onClick={() => toggleActive(user.user_id)}
                        className={`w-12 h-6 rounded-full transition-colors flex items-center ${
                          user.is_active ? 'bg-[#228b22]' : 'bg-[#d1d5db]'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                          user.is_active ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </td>
                    <td className="py-4 px-5 text-sm text-[#8b7355]">
                      {user.last_login_at
                        ? new Date(user.last_login_at).toLocaleDateString()
                        : 'Never'}
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 text-[#4169e1] hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-[#e8d5c4] px-6 py-4 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-[#2c1810]" style={{ fontFamily: 'Playfair Display, serif' }}>
                {editingUser ? 'Edit Staff Member' : 'Add New Staff Member'}
              </h3>
              <button onClick={() => { setShowModal(false); setEditingUser(null); }} className="text-[#8b7355] hover:text-[#2c1810]">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#2c1810] mb-2">First Name *</label>
                  <input
                    value={staffForm.first_name}
                    onChange={(e) => setStaffForm({ ...staffForm, first_name: e.target.value })}
                    className="w-full px-4 py-3 border border-[#e8d5c4] rounded-xl focus:outline-none focus:border-[#8b4513]"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#2c1810] mb-2">Last Name *</label>
                  <input
                    value={staffForm.last_name}
                    onChange={(e) => setStaffForm({ ...staffForm, last_name: e.target.value })}
                    className="w-full px-4 py-3 border border-[#e8d5c4] rounded-xl focus:outline-none focus:border-[#8b4513]"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#2c1810] mb-2">Email *</label>
                <input
                  type="email"
                  value={staffForm.email}
                  onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e8d5c4] rounded-xl focus:outline-none focus:border-[#8b4513]"
                  placeholder="john.doe@latabhore.rw"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#2c1810] mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={staffForm.phone_number}
                  onChange={(e) => setStaffForm({ ...staffForm, phone_number: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e8d5c4] rounded-xl focus:outline-none focus:border-[#8b4513]"
                  placeholder="+250 7XX XXX XXX"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#2c1810] mb-2">Role *</label>
                <div className="grid grid-cols-2 gap-3">
                  {ROLE_OPTIONS.filter(r => isAdmin || !['super_admin', 'manager'].includes(r.value)).map(role => (
                    <button
                      key={role.value}
                      onClick={() => setStaffForm({ ...staffForm, role: role.value })}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        staffForm.role === role.value
                          ? 'border-[#8b4513] bg-[#fff8f0]'
                          : 'border-[#e8d5c4] hover:border-[#c4a882]'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                          style={{ background: role.color }}
                        >
                          {role.label[0]}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-sm text-[#2c1810]">{role.label}</p>
                        </div>
                        {staffForm.role === role.value && (
                          <Check className="w-5 h-5 text-[#228b22]" />
                        )}
                      </div>
                      <p className="text-xs text-[#8b7355]">{role.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              {!editingUser && (
                <div>
                  <label className="block text-sm font-bold text-[#2c1810] mb-2">Initial Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={staffForm.password}
                      onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                      className="w-full px-4 py-3 pr-12 border border-[#e8d5c4] rounded-xl focus:outline-none focus:border-[#8b4513]"
                      placeholder="Enter initial password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b7355]"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="sticky bottom-0 bg-white border-t border-[#e8d5c4] px-6 py-4 flex gap-3">
              <button
                onClick={() => { setShowModal(false); setEditingUser(null); }}
                className="flex-1 border-2 border-[#e8d5c4] text-[#8b7355] py-3 rounded-xl font-semibold hover:border-[#8b4513] hover:text-[#2c1810] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-[#d2691e] text-white py-3 rounded-xl font-bold hover:bg-[#8b4513] transition-colors"
              >
                {editingUser ? 'Update Staff' : 'Add Staff'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
