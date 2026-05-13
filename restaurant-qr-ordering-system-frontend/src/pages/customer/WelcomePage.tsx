import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { tablesApi } from '../../api/tables';
import { useTableSession } from '../../contexts/TableSessionContext';
import { useCart } from '../../hooks/useCart';
import { 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Utensils, 
  ArrowRight, 
  Sparkles, 
  LogIn,
  QrCode,
  MapPin,
  ChevronRight,
  Search,
  Clock
} from 'lucide-react';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { cn } from '../../utils/classNames';

const WelcomePage: React.FC = () => {
  const { tableNumber: urlTableParam } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { startSession, tableNumber: activeTable } = useTableSession();
  const { setTableInfo } = useCart();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tableData, setTableData] = useState<{ id: number; number: string } | null>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [search, setSearch] = useState('');
  const [isHovering, setIsHovering] = useState(false);

  const tokenParam = searchParams.get('token');

  // Fetch all tables for the "Selection" mode
  const { data: tables = [] } = useQuery({
    queryKey: ['tables-public'],
    queryFn: () => tablesApi.getTables(),
    retry: false,
    staleTime: 30_000,
  });

  const filteredTables = tables.filter((t) => {
    const tableNum = String(t.tableNumber || '').toLowerCase();
    const section = String(t.section || '').toLowerCase();
    const searchLower = search.toLowerCase();
    return tableNum.includes(searchLower) || section.includes(searchLower);
  });

  useEffect(() => {
    const validateTable = async () => {
      if (!urlTableParam) {
        setLoading(false);
        return;
      }

      try {
        const validationData = await tablesApi.validateQR({ 
          tableNumber: urlTableParam, 
          token: tokenParam || 'default-token'
        });

        setTableData({ 
          id: validationData.tableId, 
          number: validationData.tableNumber 
        });
        startSession(
          validationData.tableId, 
          validationData.tableNumber, 
          validationData.sessionToken
        );
        setTableInfo(validationData.tableId, validationData.sessionToken);
      } catch (err: any) {
        setError(err.message || 'Verification failed. This table might not be active.');
      } finally {
        setLoading(false);
      }
    };

    validateTable();
  }, [urlTableParam, tokenParam, startSession, setTableInfo]);

  const handleStartOrdering = () => {
    navigate('menu');
  };

  const handleSelectTable = (table: any) => {
    navigate(`/t/${table.tableNumber}?token=${table.qrCodeToken}`);
  };

  const handleScan = () => {
     const token = prompt('Enter Table QR Token:');
     if (token) navigate(`/t/A1?token=${token}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#1A1A1A] text-white p-6 text-center">
        <div className="relative w-20 h-20 mb-8">
          <div className="absolute inset-0 border-4 border-primary/30 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <Utensils size={24} className="absolute inset-0 m-auto text-primary animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold mb-2 tracking-wide" style={{ fontFamily: 'Playfair Display' }}>
          Initializing Concierge
        </h2>
        <p className="text-white/50 font-medium tracking-widest uppercase text-xs">Azzurri Rwanda Restaurant</p>
      </div>
    );
  }

  // --- SEATED MODE (Table Identified) ---
  if (urlTableParam && tableData) {
    return (
      <div className="relative flex flex-col min-h-screen bg-black overflow-hidden selection:bg-primary/30">
        <div className="absolute top-4 right-4 z-50">
          <Link to="/login" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-bold uppercase tracking-wider transition-all">
            <LogIn size={14} /> Staff Login
          </Link>
        </div>
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2070&auto=format&fit=crop" alt="" className="w-full h-full object-cover opacity-60 scale-105 animate-[slowZoom_20s_ease-in-out_infinite_alternate]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-end p-6 pb-12 w-full max-w-lg mx-auto">
          <div className="absolute top-12 left-0 right-0 flex flex-col items-center animate-slideDown">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center mb-4">
              <Utensils size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-wide" style={{ fontFamily: 'Playfair Display' }}>Azzurri Rwanda Restaurant</h1>
            <div className="tracking-[0.3em] uppercase text-[10px] font-bold text-white/60 mt-2">Fine Dining experience</div>
          </div>

          <div className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-8 shadow-2xl animate-slideUp">
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 bg-success/20 border border-success/30 px-4 py-1.5 rounded-full backdrop-blur-md">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="font-bold text-[11px] text-white uppercase tracking-widest">Table {tableData.number} Active</span>
              </div>
            </div>

            <div className="text-center mb-8">
              <p className="text-white/60 text-sm font-medium mb-1 uppercase tracking-widest">Welcome to your table</p>
              <h3 className="text-5xl font-bold text-white" style={{ fontFamily: 'Playfair Display' }}>Enjoy your stay</h3>
            </div>
            
            <div className="bg-black/20 rounded-3xl p-6 border border-white/5">
              <p className="text-xs font-bold text-white/60 mb-4 text-center uppercase tracking-widest">Number of Guests</p>
              <div className="flex items-center justify-center gap-6">
                <button onClick={() => setGuestCount(Math.max(1, guestCount - 1))} className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white">-</button>
                <div className="flex flex-col items-center min-w-[4rem]">
                  <span className="text-4xl font-bold text-white">{guestCount}</span>
                  <Users size={14} className="text-white/40" />
                </div>
                <button onClick={() => setGuestCount(guestCount + 1)} className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white">+</button>
              </div>
            </div>
          </div>

          <div className="w-full mt-6 animate-slideUp delay-100">
            <button onClick={handleStartOrdering} className="w-full overflow-hidden bg-primary text-white h-16 rounded-[2rem] font-bold text-lg shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
              Explore Menu <ArrowRight size={22} />
            </button>
            <button onClick={() => navigate('/welcome')} className="w-full mt-6 py-2 text-white/30 hover:text-white font-medium text-xs tracking-wide uppercase">Wrong Table? Change Seat</button>
          </div>
        </div>
      </div>
    );
  }

  // --- DISCOVERY MODE (Selection) ---
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop" alt="" className="w-full h-full object-cover opacity-40 scale-110 animate-[slowZoom_30s_linear_infinite_alternate]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen p-6 md:p-12 max-w-5xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-center md:items-end gap-8">
           <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-4 mb-6">
                 <div className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center">
                    <Utensils size={32} className="text-white" />
                 </div>
                 <h1 className="text-4xl font-black text-white" style={{ fontFamily: 'Playfair Display' }}>Azzurri Rwanda Restaurant</h1>
              </div>
              <p className="text-white/80 text-xl font-medium">Welcome to our digital concierge.</p>
              <p className="text-white/40 mt-1 uppercase tracking-[0.3em] text-[10px] font-bold">Please select your table to begin ordering</p>
           </div>
           <Link to="/login" className="bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md px-6 py-3 rounded-2xl text-white text-xs font-bold uppercase tracking-widest transition-all">Staff Access</Link>
        </header>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 animate-slideUp">
           <div className="relative flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40" size={20} />
              <input 
                type="text" 
                placeholder="Find your table (e.g. T1, B1)..." 
                className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-5 pl-16 pr-8 text-white font-bold focus:bg-white/10 focus:border-primary/50 transition-all outline-none backdrop-blur-md"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>
           <button onClick={handleScan} className="bg-primary text-white px-10 py-5 rounded-[2rem] font-bold flex items-center justify-center gap-3 shadow-2xl hover:scale-105 transition-all">
              <QrCode size={20} /> Scan Table QR
           </button>
        </div>

        {/* Table Selection Grid */}
        <div className="flex-1 animate-fadeIn delay-200">
           {error && (
              <div className="bg-danger/20 border border-danger/30 p-6 rounded-3xl mb-8 flex items-center gap-4 text-white">
                 <AlertCircle className="text-danger" />
                 <p className="font-bold">{error}</p>
              </div>
           )}
           
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredTables?.map((table: any) => (
                <button 
                  key={table.tableId}
                  onClick={() => handleSelectTable(table)}
                  className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 text-center hover:bg-white/10 hover:border-primary/40 transition-all duration-300 flex flex-col items-center gap-4"
                >
                  <div className="w-14 h-14 bg-black/40 rounded-2xl flex items-center justify-center text-white/40 group-hover:text-primary transition-colors">
                     <MapPin size={28} />
                  </div>
                  <div>
                     <div className="text-3xl font-black text-white" style={{ fontFamily: 'Playfair Display' }}>{table.tableNumber}</div>
                     <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-1">Section {table.section}</div>
                  </div>
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mt-2",
                    table.status === 'AVAILABLE' ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'
                  )}>
                    {table.status}
                  </div>
                </button>
              ))}
           </div>
        </div>

        <footer className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center text-white/30 text-[10px] font-bold uppercase tracking-widest">
           <div className="flex items-center gap-4">
              <Clock size={14} /> 
              <span>Operational Hours: 08:00 - 23:00</span>
           </div>
           <div className="flex gap-6">
              <Sparkles size={14} className="text-primary" />
              <span>Explore Seasonal Menu</span>
           </div>
        </footer>
      </div>

      <style>{`
        @keyframes slowZoom {
          0% { transform: scale(1.05); }
          100% { transform: scale(1.2); }
        }
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(-30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slideUp { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slideDown { animation: slideDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fadeIn { animation: fadeIn 1s ease-out forwards; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
      `}</style>
    </div>
  );
};

export default WelcomePage;
