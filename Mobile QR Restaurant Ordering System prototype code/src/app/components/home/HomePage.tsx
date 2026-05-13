import { useState } from 'react';
import { Camera, Coffee, LogIn, ChevronRight, Scan, User, Shield } from 'lucide-react';
import { motion } from 'motion/react';

interface HomePageProps {
  onScanComplete: (tableNumber: string) => void;
  onStaffLogin: () => void;
}

export function HomePage({ onScanComplete, onStaffLogin }: HomePageProps) {
  const [showScanner, setShowScanner] = useState(false);
  const [manualTableInput, setManualTableInput] = useState('');

  const handleScanSimulation = () => {
    // Simulate scanning a QR code - in production this would use device camera
    const simulatedTable = 'T2';
    onScanComplete(simulatedTable);
  };

  const handleManualEntry = () => {
    if (manualTableInput.trim()) {
      onScanComplete(manualTableInput.toUpperCase());
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{
      background: 'linear-gradient(135deg, #2C1810 0%, #3E1A0A 50%, #2C1810 100%)',
      fontFamily: "'DM Sans', sans-serif"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes float { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(-12px); } }
        @keyframes pulse-ring { 0% { transform:scale(0.95); opacity:0.7; } 50% { transform:scale(1.05); opacity:0.4; } 100% { transform:scale(0.95); opacity:0.7; } }
        @keyframes shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }
        .float-anim { animation: float 4s ease-in-out infinite; }
        .pulse-ring { animation: pulse-ring 2s ease-in-out infinite; }
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{
              background: 'linear-gradient(135deg, #D2691E, #8B4513)'
            }}>
              <Coffee className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                La Ta Bhore
              </h1>
              <p className="text-xs text-[#C4A882]">Fine Dining · Kigali, Rwanda</p>
            </div>
          </div>

          <button
            onClick={onStaffLogin}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all border border-white/20 font-semibold"
          >
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Staff Portal</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left Side - Welcome Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-[#D2691E]/20 border border-[#D2691E]/30 rounded-full px-4 py-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-[#D2691E] animate-pulse" />
                <span className="text-sm font-bold text-[#FFD700]">Open Now · 07:00 - 22:00</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                Welcome to<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#D2691E]">
                  La Ta Bhore
                </span>
              </h1>

              <p className="text-xl text-[#C4A882] mb-4">
                Experience seamless dining with our QR table ordering system
              </p>

              <p className="text-[#8B7355] mb-8 max-w-lg">
                Simply scan the QR code on your table, browse our menu, and place your order.
                Your food will be prepared fresh and delivered right to your table.
              </p>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { label: '80+ Dishes', icon: Coffee },
                  { label: 'Fast Service', icon: ChevronRight },
                  { label: 'Easy Payment', icon: User },
                ].map((feature, i) => (
                  <motion.div
                    key={feature.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
                  >
                    <feature.icon className="w-6 h-6 text-[#D2691E] mb-2" />
                    <p className="text-sm font-semibold text-white">{feature.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Side - Scanner */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="relative">
                {/* Decorative rings */}
                <div className="absolute inset-0 rounded-[3rem] pulse-ring" style={{
                  background: 'radial-gradient(circle, rgba(210,105,30,0.2) 0%, transparent 70%)'
                }} />

                {/* Main scanner card */}
                <div className="relative bg-white rounded-[2.5rem] shadow-[0_30px_90px_rgba(0,0,0,0.4)] p-8 max-w-md border border-[#E8D5C4]">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-[#2C1810] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Start Your Order
                    </h2>
                    <p className="text-sm text-[#8B7355]">Scan QR code at your table</p>
                  </div>

                  {!showScanner ? (
                    <div className="space-y-4">
                      {/* Scanner Visual */}
                      <div className="relative bg-[#FFF8F0] rounded-3xl p-8 border-2 border-dashed border-[#D2691E]/30 min-h-[280px] flex flex-col items-center justify-center">
                        <div className="float-anim mb-4">
                          <div className="w-32 h-32 rounded-3xl flex items-center justify-center" style={{
                            background: 'linear-gradient(135deg, #D2691E, #8B4513)'
                          }}>
                            <Camera className="w-16 h-16 text-white" />
                          </div>
                        </div>
                        <p className="text-center text-sm font-semibold text-[#8B4513] mb-2">
                          Point your camera at the QR code
                        </p>
                        <p className="text-center text-xs text-[#8B7355]">
                          on your table to begin
                        </p>
                      </div>

                      {/* Scan Button */}
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleScanSimulation}
                        className="w-full py-4 rounded-2xl font-bold text-white text-lg shadow-[0_8px_24px_rgba(139,69,19,0.4)] hover:shadow-[0_12px_32px_rgba(139,69,19,0.5)] transition-all flex items-center justify-center gap-3"
                        style={{ background: 'linear-gradient(135deg, #8B4513, #D2691E)' }}
                      >
                        <Scan className="w-6 h-6" />
                        Scan QR Code
                        <ChevronRight className="w-5 h-5" />
                      </motion.button>

                      {/* Divider */}
                      <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-[#E8D5C4]"></div>
                        </div>
                        <div className="relative flex justify-center">
                          <span className="px-4 bg-white text-xs font-semibold text-[#8B7355]">OR</span>
                        </div>
                      </div>

                      {/* Manual Entry */}
                      <div>
                        <label className="block text-sm font-bold text-[#2C1810] mb-2">
                          Enter Table Number
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={manualTableInput}
                            onChange={(e) => setManualTableInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleManualEntry()}
                            placeholder="e.g., T2"
                            className="flex-1 px-4 py-3 border-2 border-[#E8D5C4] rounded-xl focus:outline-none focus:border-[#8B4513] text-[#2C1810] font-semibold placeholder:text-[#C4A882]"
                          />
                          <button
                            onClick={handleManualEntry}
                            disabled={!manualTableInput.trim()}
                            className="px-6 py-3 bg-[#8B4513] text-white rounded-xl font-bold hover:bg-[#6B3410] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Go
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#E8D5C4] border-t-[#8B4513] mb-4"></div>
                      <p className="text-[#8B7355]">Opening camera...</p>
                    </div>
                  )}

                  {/* Info */}
                  <div className="mt-6 pt-6 border-t border-[#E8D5C4]">
                    <div className="flex items-start gap-3 bg-[#FFF8F0] rounded-xl p-4">
                      <Coffee className="w-5 h-5 text-[#8B4513] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-[#2C1810] mb-1">New here?</p>
                        <p className="text-xs text-[#8B7355]">
                          Find the QR code sticker on your table. It looks like a square black-and-white pattern.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[#C4A882] text-sm">
              <Coffee className="w-4 h-4" />
              <span>La Ta Bhore Restaurant Management System</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-[#C4A882] hover:text-white transition-colors">About</a>
              <a href="#" className="text-[#C4A882] hover:text-white transition-colors">Menu</a>
              <a href="#" className="text-[#C4A882] hover:text-white transition-colors">Contact</a>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#228B22] animate-pulse" />
              <span className="text-xs text-[#228B22] font-semibold">All Systems Online</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
