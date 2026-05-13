import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { staffApi } from '../../api/staff'
import { authApi } from '../../api/auth'
import { PageHeader } from '../../components/common/PageHeader'
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton'
import { Search, Plus, MoreVertical, CheckCircle2, XCircle, UserPlus, Filter, X } from 'lucide-react'
import { COLORS } from '../../styles/theme'
import type { UserRole } from '../../types'

export function StaffManagementPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('ALL')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phoneNumber: '', role: 'WAITER' as UserRole, password: ''
  })

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => staffApi.getAllUsers(),
  })

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setIsModalOpen(false)
      resetForm()
    }
  })

  const updateMutation = useMutation({
    mutationFn: (data: any) => staffApi.updateUser(data.id, data.body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setIsModalOpen(false)
      resetForm()
    }
  })

  const deactivateMutation = useMutation({
    mutationFn: staffApi.deactivateUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
  })

  const activateMutation = useMutation({
    mutationFn: staffApi.activateUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
  })

  const resetForm = () => {
    setFormData({ firstName: '', lastName: '', email: '', phoneNumber: '', role: 'WAITER', password: '' })
    setEditingUser(null)
  }

  const handleOpenEdit = (user: any) => {
    setEditingUser(user)
    setFormData({
      firstName: user.firstName, lastName: user.lastName, email: user.email,
      phoneNumber: user.phoneNumber || '', role: user.role, password: ''
    })
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingUser) {
      updateMutation.mutate({ id: editingUser.userId, body: formData })
    } else {
      registerMutation.mutate(formData)
    }
  }

  const filteredUsers = users?.filter((u: any) => {
    const matchesSearch = u.firstName.toLowerCase().includes(search.toLowerCase()) || 
                          u.lastName.toLowerCase().includes(search.toLowerCase()) || 
                          u.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter
    const matchesStatus = statusFilter === 'ALL' || (statusFilter === 'ACTIVE' ? u.isActive : !u.isActive)
    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <div className="max-w-7xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#2C1810]" style={{ fontFamily: 'Playfair Display, serif' }}>Staff Management</h1>
          <p className="text-[#8B7355] mt-1">Manage system users and their permissions</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-opacity shadow-sm"
          style={{ backgroundColor: COLORS.primary }}
        >
          <UserPlus size={18} /> Add Staff Member
        </button>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: COLORS.border }}>
        {/* Filters */}
        <div className="p-5 border-b border-[#E8D5C4] flex flex-wrap gap-4 items-center bg-[#FFF8F0]/30">
          <div className="flex items-center gap-2 bg-white border border-[#E8D5C4] rounded-xl px-3 py-2 flex-1 min-w-[250px] shadow-sm focus-within:border-primary transition-colors">
            <Search size={16} className="text-[#8B7355]" />
            <input 
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..." 
              className="bg-transparent border-none focus:ring-0 outline-none text-sm w-full text-[#2C1810]"
            />
          </div>
          
          <div className="flex items-center gap-2 bg-white border border-[#E8D5C4] rounded-xl px-3 py-2 shadow-sm">
            <Filter size={16} className="text-[#8B7355]" />
            <select 
              value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent border-none text-sm font-semibold text-[#2C1810] focus:outline-none"
            >
              <option value="ALL">All Roles</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="CASHIER">Cashier</option>
              <option value="KITCHEN_STAFF">Kitchen Staff</option>
              <option value="BAR_STAFF">Bar Staff</option>
              <option value="WAITER">Waiter</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white border border-[#E8D5C4] rounded-xl px-3 py-2 shadow-sm">
            <select 
              value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none text-sm font-semibold text-[#2C1810] focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
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
                  <th className="px-6 py-4 font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredUsers?.map((user: any) => (
                  <tr key={user.userId} className="border-b last:border-0 hover:bg-[#FFF8F0]/50 transition-colors" style={{ borderColor: COLORS.border }}>
                    <td className="px-6 py-4 font-bold text-[#8B7355]">#{user.userId}</td>
                    <td className="px-6 py-4 font-bold text-[#2C1810]">{user.firstName} {user.lastName}</td>
                    <td className="px-6 py-4 text-[#8B7355]">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-800">
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.isActive ? (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-green-600"><CheckCircle2 size={14} /> Active</span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-red-500"><XCircle size={14} /> Inactive</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenEdit(user)} className="text-xs font-bold text-primary hover:underline px-2 py-1">Edit</button>
                        {user.isActive ? (
                          <button onClick={() => deactivateMutation.mutate(user.userId)} className="text-xs font-bold text-red-500 hover:underline px-2 py-1">Deactivate</button>
                        ) : (
                          <button onClick={() => activateMutation.mutate(user.userId)} className="text-xs font-bold text-green-600 hover:underline px-2 py-1">Activate</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {(!filteredUsers || filteredUsers.length === 0) && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <p className="font-bold text-[#2C1810] mb-1">No staff members found</p>
                      <p className="text-sm text-[#8B7355]">Try adjusting your search or filters.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[#E8D5C4] flex justify-between items-center bg-[#FFF8F0]">
              <h2 className="text-xl font-bold text-[#2C1810]" style={{ fontFamily: 'Playfair Display, serif' }}>
                {editingUser ? 'Edit Staff Member' : 'Add New Staff Member'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#8B7355] hover:text-[#2C1810]">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#8B7355] mb-1.5 uppercase tracking-wider">First Name</label>
                  <input required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5C4] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8B7355] mb-1.5 uppercase tracking-wider">Last Name</label>
                  <input required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5C4] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-[#8B7355] mb-1.5 uppercase tracking-wider">Email Address</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5C4] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm" />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8B7355] mb-1.5 uppercase tracking-wider">Phone Number</label>
                <input required value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5C4] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm" />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8B7355] mb-1.5 uppercase tracking-wider">Role</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as UserRole})} className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5C4] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm bg-white">
                  <option value="MANAGER">Manager</option>
                  <option value="CASHIER">Cashier</option>
                  <option value="KITCHEN_STAFF">Kitchen Staff</option>
                  <option value="BAR_STAFF">Bar Staff</option>
                  <option value="WAITER">Waiter</option>
                </select>
              </div>

              {!editingUser && (
                <div>
                  <label className="block text-xs font-bold text-[#8B7355] mb-1.5 uppercase tracking-wider">Password</label>
                  <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5C4] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm" />
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 rounded-xl border border-[#E8D5C4] font-bold text-[#2C1810] hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={registerMutation.isPending || updateMutation.isPending} className="flex-1 px-4 py-3 rounded-xl text-white font-bold bg-primary hover:bg-primaryDark transition-colors shadow-md flex justify-center items-center">
                  {registerMutation.isPending || updateMutation.isPending ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Save Staff Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default StaffManagementPage
