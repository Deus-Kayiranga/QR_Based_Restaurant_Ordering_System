import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Utensils } from 'lucide-react'

export function OrderEntryPage() {
  const [params] = useSearchParams()
  const nav = useNavigate()
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    const table = params.get('table')?.trim()
    const token = params.get('token')?.trim()
    if (!table || !token) {
      setErr('Missing table or token. Scan a valid QR code.')
      return
    }
    nav(`/t/${encodeURIComponent(table)}?token=${encodeURIComponent(token)}`, { replace: true })
  }, [params, nav])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2070&auto=format&fit=crop')] opacity-20 object-cover scale-110 blur-sm"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
      
      <div className="relative z-10 flex flex-col items-center animate-slideDown">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
          <Utensils className="h-10 w-10 text-white animate-pulse" />
        </div>
        
        <h1 className="text-4xl font-black text-white tracking-wide shadow-black drop-shadow-2xl mb-2" style={{ fontFamily: 'Playfair Display' }}>
          Azzurri Rwanda Restaurant
        </h1>
        
        <div className="flex items-center gap-2 mt-1 text-white/60 mb-8">
          <span className="w-8 h-[1px] bg-white/30"></span>
          <span className="tracking-[0.3em] uppercase text-[10px] font-bold">Fine Dining</span>
          <span className="w-8 h-[1px] bg-white/30"></span>
        </div>

        {err ? (
          <div className="mt-4 bg-danger/20 border border-danger/30 text-white px-6 py-3 rounded-xl backdrop-blur-md">
            <p className="text-sm font-bold tracking-widest uppercase">{err}</p>
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-xs font-bold text-white/50 uppercase tracking-widest animate-pulse">Preparing your table</p>
          </div>
        )}
      </div>
    </div>
  )
}
