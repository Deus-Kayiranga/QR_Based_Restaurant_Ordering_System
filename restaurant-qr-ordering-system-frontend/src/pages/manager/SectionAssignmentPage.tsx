import React, { useState, useEffect } from 'react';
import { sectionsApi, type SectionAssignment } from '../../api/sections';
import { staffApi } from '../../api/staff';
import type { User } from '../../types';
import { 
  Users, 
  Map, 
  Plus, 
  Trash2, 
  UserPlus,
  LayoutGrid,
  ShieldCheck,
  X,
  MapPin,
  ChevronRight,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { cn } from '../../utils/classNames';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';

const SectionAssignmentPage: React.FC = () => {
  const [assignments, setAssignments] = useState<SectionAssignment[]>([]);
  const [waiters, setWaiters] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  
  const [newSection, setNewSection] = useState('');
  const [selectedWaiter, setSelectedWaiter] = useState<number | ''>('');

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [assigns, users] = await Promise.all([
        sectionsApi.getAll(),
        staffApi.getAll()
      ]);
      setAssignments(assigns);
      setWaiters(users.filter(u => u.role === 'WAITER'));
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSection || !selectedWaiter) return;
    
    try {
      await sectionsApi.assign(newSection, Number(selectedWaiter));
      setNewSection('');
      setSelectedWaiter('');
      setShowAdd(false);
      fetchData();
    } catch (error) {
      alert('Failed to assign waiter');
    }
  };

  const handleRemove = async (id: number) => {
    if (!window.confirm('Are you sure you want to remove this assignment?')) return;
    try {
      await sectionsApi.remove(id);
      fetchData();
    } catch (error) {
      alert('Failed to remove assignment');
    }
  };

  return (
    <div className="space-y-10 animate-fadeIn pb-20 p-6 bg-[#FFF8F0] min-h-screen">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
           <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-[#2C1810] rounded-2xl flex items-center justify-center text-white shadow-xl">
                 <Map size={28} />
              </div>
              <h1 className="text-4xl font-black text-[#2C1810]" style={{ fontFamily: 'Playfair Display' }}>Station Architecture</h1>
           </div>
           <p className="text-[#8B7355] font-medium text-lg max-w-2xl">Orchestrate floor coverage and map your service staff to specific operational zones.</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-[#2C1810] text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 shadow-xl shadow-[#2C1810]/20 hover:bg-black transition-all active:scale-95"
        >
          <Plus size={20} />
          Define New Zone
        </button>
      </header>

      {/* Overview Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Active Zones', value: assignments.length, icon: Layers, color: 'text-[#8B4513]', bg: 'bg-[#8B4513]/5' },
          { label: 'Waiters Assigned', value: [...new Set(assignments.map(a => a.waiter.userId))].length, icon: Users, color: 'text-[#228B22]', bg: 'bg-[#228B22]/5' },
          { label: 'Floor Coverage', value: '100%', icon: ShieldCheck, color: 'text-[#2B6CB0]', bg: 'bg-[#2B6CB0]/5' },
        ].map((s, i) => (
          <div key={i} className="bg-white border-2 border-[#E8D5C4] rounded-[2.5rem] p-8 flex items-center gap-6 shadow-sm group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className={cn("w-16 h-16 rounded-3xl flex items-center justify-center border-2 border-transparent transition-transform group-hover:scale-110 shadow-sm", s.bg, s.color.replace('text-', 'border-').replace(']', '/20]'))}>
              <s.icon size={28} className={s.color} />
            </div>
            <div>
              <div className="text-[10px] font-black text-[#8B7355] uppercase tracking-[0.25em] mb-1">{s.label}</div>
              <div className="text-3xl font-black text-[#2C1810]">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Zone Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          [1,2,3,4,5,6].map(i => <LoadingSkeleton key={i} className="h-64 rounded-[3rem]" />)
        ) : assignments.length === 0 ? (
          <div className="col-span-full py-24 text-center bg-white rounded-[4rem] border-4 border-dashed border-[#E8D5C4] flex flex-col items-center justify-center group hover:bg-[#FFF8F0] transition-colors cursor-pointer" onClick={() => setShowAdd(true)}>
            <div className="w-24 h-24 bg-[#FFF8F0] rounded-full flex items-center justify-center text-[#E8D5C4] mb-6 group-hover:scale-110 transition-transform">
              <MapPin size={48} />
            </div>
            <h3 className="text-2xl font-black text-[#2C1810]" style={{ fontFamily: 'Playfair Display' }}>No Zones Defined</h3>
            <p className="text-[#8B7355] mt-2 font-bold">Initialize your restaurant's floor plan to begin service.</p>
          </div>
        ) : (
          assignments.map((a) => (
            <div key={a.assignmentId} className="group relative bg-white rounded-[3rem] border-2 border-[#E8D5C4] p-8 flex flex-col hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 p-6 flex gap-2 translate-y-[-100%] group-hover:translate-y-0 transition-transform duration-300">
                <button 
                  onClick={() => handleRemove(a.assignmentId)}
                  className="w-10 h-10 bg-[#C62828]/10 text-[#C62828] rounded-2xl flex items-center justify-center hover:bg-[#C62828] hover:text-white transition-all shadow-sm"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="flex items-center gap-5 mb-8">
                <div className="w-14 h-14 bg-[#FFF8F0] rounded-[1.25rem] flex items-center justify-center border-2 border-[#E8D5C4] text-[#8B4513] group-hover:bg-[#2C1810] group-hover:text-white transition-all duration-500">
                  <MapPin size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#2C1810] tracking-tight" style={{ fontFamily: 'Playfair Display' }}>{a.sectionName}</h3>
                  <div className="text-[10px] font-black text-[#8B7355] uppercase tracking-[0.2em] opacity-60">Designated Area</div>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                 <div className="bg-[#FFF8F0] rounded-[2rem] p-6 border border-[#E8D5C4]/50 flex items-center gap-5">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-[#E8D5C4]/30 flex items-center justify-center text-[#8B4513]">
                       <Users size={20} />
                    </div>
                    <div>
                       <div className="text-[9px] font-black text-[#8B7355] uppercase tracking-widest mb-0.5">Assigned Lead</div>
                       <div className="font-black text-[#2C1810] text-lg">{a.waiter.firstName} {a.waiter.lastName}</div>
                    </div>
                 </div>
              </div>

              <div className="mt-8 pt-6 border-t-2 border-[#FFF8F0] flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#228B22] animate-pulse" />
                    <span className="text-[10px] font-black text-[#228B22] uppercase tracking-[0.2em]">Active Patrol</span>
                 </div>
                 <button className="text-[#8B7355] hover:text-[#2C1810] transition-colors p-2">
                    <ArrowRight size={20} />
                 </button>
              </div>

              {/* Aesthetic Footer */}
              <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[#8B4513] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))
        )}
      </div>

      {/* Add Assignment Modal Overlay */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#2C1810]/80 backdrop-blur-md" onClick={() => setShowAdd(false)} />
          <div className="bg-white w-full max-w-lg rounded-[4rem] border-8 border-white/20 relative z-10 overflow-hidden animate-scaleIn shadow-2xl">
            <div className="p-10 border-b border-[#E8D5C4] bg-[#FFF8F0]/50 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-black text-[#2C1810]" style={{ fontFamily: 'Playfair Display' }}>Deploy Station</h2>
                <p className="text-xs font-black text-[#8B7355] uppercase tracking-[0.25em] mt-2">Staff-to-Zone Mapping</p>
              </div>
              <button onClick={() => setShowAdd(false)} className="w-12 h-12 rounded-full bg-white border-2 border-[#E8D5C4] flex items-center justify-center text-[#8B7355] hover:text-[#2C1810] transition-all"><X size={24} /></button>
            </div>

            <form onSubmit={handleAssign} className="p-12 space-y-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-[#8B7355] uppercase tracking-[0.3em] ml-2">Zone Identifier</label>
                  <div className="relative">
                    <MapPin size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#8B7355]" />
                    <input 
                      type="text" 
                      placeholder="e.g. Garden Terrace, VIP Hall" 
                      className="w-full bg-[#FFF8F0] border-2 border-[#E8D5C4] rounded-3xl py-5 pl-16 pr-8 text-[#2C1810] font-black focus:bg-white focus:border-[#8B4513] transition-all outline-none"
                      value={newSection}
                      onChange={(e) => setNewSection(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-[#8B7355] uppercase tracking-[0.3em] ml-2">Assign Service Lead</label>
                  <div className="relative">
                    <Users size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#8B7355]" />
                    <select 
                      className="w-full bg-[#FFF8F0] border-2 border-[#E8D5C4] rounded-3xl py-5 pl-16 pr-8 text-[#2C1810] font-black focus:bg-white focus:border-[#8B4513] transition-all outline-none appearance-none cursor-pointer"
                      value={selectedWaiter}
                      onChange={(e) => setSelectedWaiter(e.target.value)}
                      required
                    >
                      <option value="" disabled>Select Staff Member...</option>
                      {waiters.map(w => (
                        <option key={w.userId} value={w.userId}>
                          {w.firstName} {w.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="pt-6 flex gap-6">
                <button 
                  type="button" 
                  onClick={() => setShowAdd(false)}
                  className="flex-1 px-8 py-5 rounded-[1.5rem] border-2 border-[#E8D5C4] font-black text-xs uppercase tracking-widest text-[#8B7355] hover:bg-[#F5E6D3] transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-[2] bg-[#2C1810] text-white px-8 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-[#2C1810]/30 hover:bg-black transition-all active:scale-95"
                >
                  Commit Mapping
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionAssignmentPage;
