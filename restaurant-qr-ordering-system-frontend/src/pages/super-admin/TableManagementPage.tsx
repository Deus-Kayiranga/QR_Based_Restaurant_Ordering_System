import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tablesApi } from '../../api/tables';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { 
  Plus, 
  Users, 
  LayoutGrid, 
  Trash2, 
  Edit, 
  RefreshCw, 
  QrCode, 
  X, 
  Search,
  CheckCircle2,
  AlertCircle,
  MapPin,
  ChevronRight,
  Download,
  Share2,
  Zap,
  MoreHorizontal,
  Settings,
  Eye
} from 'lucide-react';
import { COLORS } from '../../styles/theme';
import { cn } from '../../utils/classNames';

export function TableManagementPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<any>(null);
  const [qrModalUrl, setQrModalUrl] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    tableNumber: '', 
    seatingCapacity: 4, 
    section: 'Main Hall'
  });

  const { data: tables, isLoading, refetch } = useQuery({
    queryKey: ['tables'],
    queryFn: () => tablesApi.getTables(),
  });

  const saveMutation = useMutation({
    mutationFn: (data: any) => editingTable ? tablesApi.updateTable(editingTable.tableId, data) : tablesApi.createTable(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      setIsModalOpen(false);
      setEditingTable(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: tablesApi.deleteTable,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tables'] })
  });

  const generateQrMutation = useMutation({
    mutationFn: tablesApi.generateQr,
    onSuccess: (data: any) => {
      if (typeof data === 'string' && data.startsWith('http')) {
        setQrModalUrl(data);
      }
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    }
  });

  const handleOpenEdit = (table: any) => {
    setEditingTable(table);
    setFormData({ 
      tableNumber: table.tableNumber, 
      seatingCapacity: table.seatingCapacity, 
      section: table.section || '' 
    });
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingTable(null);
    setFormData({ tableNumber: '', seatingCapacity: 4, section: 'Main Hall' });
    setIsModalOpen(true);
  };

  const filteredTables = (tables || []).filter((t: any) => 
    t.tableNumber.toLowerCase().includes(search.toLowerCase()) || 
    (t.section && t.section.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-fadeIn p-6 bg-[#FFF8F0] min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Global Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-14 h-14 bg-[#8B4513] rounded-[1.25rem] flex items-center justify-center text-white shadow-2xl border-4 border-white">
              <QrCode size={30} />
            </div>
            <h1 className="text-4xl font-black text-[#2C1810]" style={{ fontFamily: 'Playfair Display' }}>Infrastructure Hub</h1>
          </div>
          <p className="text-[#8B7355] font-medium text-lg">Orchestrate your restaurant's physical layout and digital ordering touchpoints.</p>
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
          <button 
            onClick={() => refetch()}
            className="w-14 h-14 bg-white border-2 border-[#E8D5C4] rounded-2xl flex items-center justify-center text-[#8B7355] hover:bg-[#F5E6D3] hover:text-[#2C1810] transition-all shadow-md active:scale-90"
          >
            <RefreshCw size={24} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={handleOpenAdd}
            className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-10 py-5 bg-[#2C1810] text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl shadow-[#2C1810]/30 active:scale-95"
          >
            <Plus size={20} />
            Deploy Station
          </button>
        </div>
      </div>

      {/* Control Center */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
         <div className="md:col-span-2 relative">
            <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#8B7355]" />
            <input 
              type="text" 
              placeholder="Search table matrix by identifier or area..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border-2 border-[#E8D5C4] rounded-[1.5rem] py-5 pl-16 pr-8 text-sm font-black outline-none focus:ring-8 focus:ring-[#8B4513]/5 transition-all placeholder:text-[#8B7355]/40"
            />
         </div>
         <div className="bg-white border-2 border-[#E8D5C4] rounded-[1.5rem] flex items-center justify-center gap-4 px-8 shadow-sm">
            <div className="flex -space-x-3">
               {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-[#F5E6D3] flex items-center justify-center text-[10px] font-black text-[#8B4513]">S{i}</div>)}
            </div>
            <div className="h-8 w-[2px] bg-[#E8D5C4] mx-2" />
            <div>
               <div className="text-[10px] font-black text-[#8B7355] uppercase tracking-widest">Total Active</div>
               <div className="text-xl font-black text-[#2C1810]">{tables?.length || 0} Units</div>
            </div>
         </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i => <LoadingSkeleton key={i} className="h-80 rounded-[3rem]" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredTables?.map((table: any) => (
            <div 
              key={table.tableId} 
              className="group relative bg-white rounded-[3rem] border-2 border-[#E8D5C4] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Card Header */}
              <div className="p-8 pb-4 flex justify-between items-start">
                 <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                       <span className="w-2 h-2 rounded-full bg-[#8B4513] animate-pulse" />
                       <span className="text-[10px] font-black text-[#8B7355] uppercase tracking-[0.2em]">Active Station</span>
                    </div>
                    <h3 className="text-5xl font-black text-[#2C1810]" style={{ fontFamily: 'Playfair Display' }}>{table.tableNumber}</h3>
                 </div>
                 <div className="flex gap-2">
                    <button 
                      onClick={() => handleOpenEdit(table)}
                      className="w-12 h-12 bg-[#FFF8F0] border-2 border-[#E8D5C4] rounded-2xl flex items-center justify-center text-[#8B7355] hover:bg-[#2C1810] hover:text-white transition-all active:scale-90"
                    >
                       <Edit size={20} />
                    </button>
                    <button className="w-12 h-12 bg-[#FFF8F0] border-2 border-[#E8D5C4] rounded-2xl flex items-center justify-center text-[#8B7355] hover:bg-red-500 hover:text-white transition-all active:scale-90">
                       <MoreHorizontal size={20} />
                    </button>
                 </div>
              </div>

              {/* Card Details */}
              <div className="px-8 py-6 space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#FFF8F0] p-4 rounded-3xl border border-[#E8D5C4]/50">
                       <div className="flex items-center gap-2 text-[#8B7355] mb-2">
                          <Users size={16} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Seating</span>
                       </div>
                       <div className="text-xl font-black text-[#2C1810]">{table.seatingCapacity} Guests</div>
                    </div>
                    <div className="bg-[#FFF8F0] p-4 rounded-3xl border border-[#E8D5C4]/50">
                       <div className="flex items-center gap-2 text-[#8B7355] mb-2">
                          <MapPin size={16} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Section</span>
                       </div>
                       <div className="text-xl font-black text-[#2C1810] truncate">{table.section || 'General'}</div>
                    </div>
                 </div>

                 {/* QR Code Section */}
                 <div className="bg-[#2C1810] rounded-[2rem] p-6 text-white flex items-center justify-between group/qr relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/qr:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                       <div className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-2">Point of Sale</div>
                       <div className="flex items-center gap-2">
                          <QrCode size={20} className="text-[#D2691E]" />
                          <span className="text-sm font-black tracking-wide">Digital Gateway</span>
                       </div>
                    </div>
                    <button 
                       onClick={() => table.qrCodeImageUrl ? setQrModalUrl(table.qrCodeImageUrl) : generateQrMutation.mutate(table.tableId)}
                       className="relative z-10 w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all active:scale-90 border border-white/10"
                    >
                       {generateQrMutation.isPending && generateQrMutation.variables === table.tableId ? (
                          <RefreshCw size={20} className="animate-spin" />
                       ) : table.qrCodeImageUrl ? (
                          <Eye size={20} />
                       ) : (
                          <Zap size={20} />
                       )}
                    </button>
                 </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-8 pt-2 flex gap-4">
                 <button 
                   onClick={() => { if(window.confirm('Archive this station?')) deleteMutation.mutate(table.tableId) }}
                   className="flex-1 py-4 bg-white border-2 border-red-100 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2"
                 >
                    <Trash2 size={16} />
                    Archive
                 </button>
                 <button className="flex-1 py-4 bg-white border-2 border-[#E8D5C4] text-[#2C1810] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#F5E6D3] transition-all active:scale-95 flex items-center justify-center gap-2">
                    <Settings size={16} />
                    Configure
                 </button>
              </div>

              {/* Aesthetic Trim */}
              <div className="h-2 bg-[#8B4513] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}

          {/* Add Table Empty Card */}
          <div 
            onClick={handleOpenAdd}
            className="group cursor-pointer bg-[#FFF8F0] border-4 border-dashed border-[#E8D5C4] rounded-[3rem] flex flex-col items-center justify-center py-20 text-center hover:border-[#8B4513]/30 hover:bg-white transition-all shadow-inner"
          >
             <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-[#E8D5C4] group-hover:text-[#8B4513] group-hover:scale-110 transition-all shadow-sm mb-6 border-2 border-[#E8D5C4]/20">
                <Plus size={48} />
             </div>
             <h4 className="text-2xl font-black text-[#2C1810]" style={{ fontFamily: 'Playfair Display' }}>Expand Capacity</h4>
             <p className="text-[#8B7355] mt-2 font-bold text-sm">Add a new station to your restaurant</p>
          </div>
        </div>
      )}

      {/* Modals are unchanged but updated for theme */}
      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#2C1810]/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[4rem] w-full max-w-xl overflow-hidden shadow-2xl animate-scaleIn border-8 border-white/20">
            <div className="p-10 border-b border-[#E8D5C4] flex justify-between items-center bg-[#FFF8F0]/50">
              <div>
                <h2 className="text-4xl font-black text-[#2C1810]" style={{ fontFamily: 'Playfair Display' }}>
                  {editingTable ? 'Station Tuning' : 'Initial Deployment'}
                </h2>
                <p className="text-xs font-black text-[#8B7355] uppercase tracking-[0.25em] mt-2">Resource Configuration</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-14 h-14 rounded-full bg-white border-2 border-[#E8D5C4] flex items-center justify-center text-[#8B7355] hover:text-[#2C1810] transition-all shadow-md active:scale-90">
                <X size={28} />
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(formData) }} className="p-12 space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-black text-[#8B7355] mb-3 uppercase tracking-[0.3em]">Identifier Code</label>
                  <input 
                    required autoFocus placeholder="e.g. T-X1"
                    value={formData.tableNumber} onChange={e => setFormData({...formData, tableNumber: e.target.value})} 
                    className="w-full px-8 py-5 rounded-3xl border-2 border-[#E8D5C4] bg-[#FFF8F0]/50 focus:bg-white focus:border-[#8B4513] focus:ring-8 focus:ring-[#8B4513]/5 outline-none text-lg font-black text-[#2C1810] transition-all" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-black text-[#8B7355] mb-3 uppercase tracking-[0.3em]">Guest Capacity</label>
                    <input 
                      required type="number" min="1" 
                      value={formData.seatingCapacity} onChange={e => setFormData({...formData, seatingCapacity: Number(e.target.value)})} 
                      className="w-full px-8 py-5 rounded-3xl border-2 border-[#E8D5C4] bg-[#FFF8F0]/50 focus:bg-white focus:border-[#8B4513] outline-none text-lg font-black text-[#2C1810] transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-[#8B7355] mb-3 uppercase tracking-[0.3em]">Deployment Area</label>
                    <input 
                      placeholder="e.g. Garden"
                      value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})} 
                      className="w-full px-8 py-5 rounded-3xl border-2 border-[#E8D5C4] bg-[#FFF8F0]/50 focus:bg-white focus:border-[#8B4513] outline-none text-lg font-black text-[#2C1810] transition-all" 
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-6 pt-6">
                <button 
                  type="button" onClick={() => setIsModalOpen(false)} 
                  className="flex-1 px-10 py-6 rounded-3xl border-2 border-[#E8D5C4] font-black text-xs uppercase tracking-widest text-[#2C1810] hover:bg-[#F5E6D3] transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button 
                  type="submit" disabled={saveMutation.isPending} 
                  className="flex-[2] px-10 py-6 rounded-3xl text-white font-black text-xs uppercase tracking-widest bg-[#2C1810] hover:bg-black transition-all shadow-2xl shadow-[#2C1810]/30 active:scale-95 disabled:opacity-50"
                >
                  {saveMutation.isPending ? 'Propagating...' : (editingTable ? 'Commit Updates' : 'Authorize Deployment')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {qrModalUrl && (
        <div className="fixed inset-0 bg-[#2C1810]/90 backdrop-blur-2xl z-[60] flex items-center justify-center p-4" onClick={() => setQrModalUrl(null)}>
          <div className="bg-white rounded-[5rem] p-16 max-w-lg w-full text-center shadow-2xl relative animate-scaleIn" onClick={e => e.stopPropagation()}>
            <button onClick={() => setQrModalUrl(null)} className="absolute top-10 right-10 w-14 h-14 rounded-full bg-[#FFF8F0] border-2 border-[#E8D5C4] flex items-center justify-center text-[#8B7355] hover:text-[#2C1810] transition-all"><X size={32} /></button>
            
            <div className="mb-12">
              <div className="w-24 h-24 bg-[#8B4513]/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
                <QrCode size={48} className="text-[#8B4513]" />
              </div>
              <h3 className="text-4xl font-black text-[#2C1810]" style={{ fontFamily: 'Playfair Display' }}>Digital Passport</h3>
              <p className="text-sm font-black text-[#8B7355] uppercase tracking-[0.3em] mt-3">Ready for Print Production</p>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border-4 border-dashed border-[#E8D5C4] inline-block mb-12 shadow-2xl">
              <img src={qrModalUrl} alt="Station QR Code" className="w-64 h-64 object-contain" />
            </div>

            <div className="flex flex-col gap-4">
              <a 
                href={qrModalUrl} download="station-passport.png" target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-3 w-full py-6 bg-[#2C1810] text-white font-black text-xs uppercase tracking-widest rounded-3xl hover:bg-black transition-all shadow-2xl active:scale-95"
              >
                <Download size={24} /> 
                Download Print Package
              </a>
              <button className="flex items-center justify-center gap-3 w-full py-6 bg-white border-2 border-[#E8D5C4] text-[#2C1810] font-black text-xs uppercase tracking-widest rounded-3xl hover:bg-[#F5E6D3] transition-all active:scale-95">
                <Share2 size={24} /> 
                Share Digital Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TableManagementPage;
