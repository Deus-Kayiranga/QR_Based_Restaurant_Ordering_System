import { useState } from 'react';
import { Coffee, Users, Plus, Minus, ArrowRight, Check, MapPin, Clock, Phone } from 'lucide-react';
import { motion } from 'motion/react';

interface WelcomeLandingProps {
  tableNumber: string;
  onContinue: (guestCount: number) => void;
  onCallWaiter?: () => void;
}

export function WelcomeLanding({ tableNumber, onContinue, onCallWaiter }: WelcomeLandingProps) {
  const [guestCount, setGuestCount] = useState(2);
  const [isVerified, setIsVerified] = useState(true);

  const handleContinue = () => {
    onContinue(guestCount);
  };

  const incrementGuests = () => setGuestCount(prev => Math.min(prev + 1, 20));
  const decrementGuests = () => setGuestCount(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen flex flex-col" style={{
      background: 'linear-gradient(135deg, #FFF8F0 0%, #FFE8CC 50%, #FFF8F0 100%)',
      fontFamily: "'DM Sans', sans-serif"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes float { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(-8px); } }
        @keyframes pulse-ring { 0% { transform:scale(1); opacity:0.5; } 100% { transform:scale(1.3); opacity:0; } }
        .float-anim { animation: float 3s ease-in-out infinite; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E8D5C4] shadow-sm">
        <div className="max-w-md mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#8B4513] flex items-center justify-center">
              <Coffee className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm text-[#2C1810]" style={{ fontFamily: 'Playfair Display, serif' }}>
                La Ta Bhore
              </h1>
              <p className="text-[9px] text-[#8B7355]">Kigali, Rwanda</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-[#E8F5E9] border border-[#228B22]/20 rounded-full px-2.5 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#228B22] animate-pulse" />
            <span className="text-[10px] font-bold text-[#228B22]">Open Now</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Logo Section */}
            <div className="text-center mb-6">
              <div className="float-anim inline-block">
                <div className="w-24 h-24 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-[0_12px_32px_rgba(139,69,19,0.2)]"
                  style={{ background: 'linear-gradient(135deg, #8B4513, #D2691E)' }}>
                  <Coffee className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-[#2C1810] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Welcome to La Ta Bhore
              </h1>
              <div className="flex items-center justify-center gap-1.5 text-[#8B7355]">
                <MapPin className="w-3.5 h-3.5" />
                <p className="text-sm">KG 123 St, Kigali</p>
              </div>
            </div>

            {/* Table Verification Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(44,24,16,0.12)] p-6 mb-4 border border-[#E8D5C4]"
            >
              {/* Table Number */}
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#E8D5C4]">
                <div>
                  <p className="text-xs font-bold text-[#C4A882] uppercase tracking-wide mb-1">Your Table</p>
                  <p className="text-3xl font-bold text-[#2C1810]" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {tableNumber}
                  </p>
                </div>
                {isVerified && (
                  <div className="flex items-center gap-2 bg-[#E8F5E9] border border-[#228B22]/20 rounded-xl px-3 py-2">
                    <Check className="w-4 h-4 text-[#228B22]" />
                    <span className="text-xs font-bold text-[#228B22]">Verified</span>
                  </div>
                )}
              </div>

              {/* Guest Count Selector */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-[#2C1810] mb-3">
                  <Users className="w-4 h-4 inline mr-1.5" />
                  How many guests?
                </label>
                <div className="flex items-center justify-center gap-4 bg-[#FFF8F0] rounded-xl p-4 border-2 border-[#E8D5C4]">
                  <button
                    onClick={decrementGuests}
                    disabled={guestCount <= 1}
                    className="w-12 h-12 rounded-xl bg-white border-2 border-[#E8D5C4] flex items-center justify-center text-[#8B4513] hover:border-[#8B4513] hover:bg-[#8B4513] hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <div className="flex-1 text-center">
                    <p className="text-4xl font-bold text-[#2C1810]" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {guestCount}
                    </p>
                    <p className="text-xs text-[#8B7355] mt-1">
                      {guestCount === 1 ? 'Guest' : 'Guests'}
                    </p>
                  </div>
                  <button
                    onClick={incrementGuests}
                    disabled={guestCount >= 20}
                    className="w-12 h-12 rounded-xl bg-white border-2 border-[#E8D5C4] flex items-center justify-center text-[#8B4513] hover:border-[#8B4513] hover:bg-[#8B4513] hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Continue Button */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContinue}
                className="w-full py-4 rounded-xl font-bold text-white text-base shadow-[0_4px_16px_rgba(139,69,19,0.3)] hover:shadow-[0_6px_20px_rgba(139,69,19,0.4)] transition-all flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #8B4513, #D2691E)' }}
              >
                <Coffee className="w-5 h-5" />
                View Our Menu
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-[#E8D5C4] text-center">
                <Clock className="w-5 h-5 text-[#8B4513] mx-auto mb-1.5" />
                <p className="text-xs font-bold text-[#2C1810]">Open Daily</p>
                <p className="text-[10px] text-[#8B7355]">07:00 - 22:00</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-[#E8D5C4] text-center">
                <Coffee className="w-5 h-5 text-[#8B4513] mx-auto mb-1.5" />
                <p className="text-xs font-bold text-[#2C1810]">Full Menu</p>
                <p className="text-[10px] text-[#8B7355]">80+ Items</p>
              </div>
            </div>

            {/* Need Help */}
            <div className="text-center">
              <p className="text-sm text-[#8B7355] mb-2">Need assistance?</p>
              <button
                onClick={onCallWaiter}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-[#E8D5C4] text-[#8B4513] rounded-xl text-sm font-semibold hover:border-[#8B4513] hover:bg-[#FFF8F0] transition-all"
              >
                <Phone className="w-4 h-4" />
                Call Waiter
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-[#E8D5C4] py-4">
        <div className="max-w-md mx-auto px-6 text-center">
          <p className="text-xs text-[#C4A882]">
            Tap "View Our Menu" to start ordering
          </p>
        </div>
      </div>
    </div>
  );
}
