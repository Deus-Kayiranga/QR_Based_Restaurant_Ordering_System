import { useState } from 'react';
import { Lock, User, ChevronDown, Eye, EyeOff, Coffee, ArrowLeft, Shield, Check } from 'lucide-react';
import { UserRole } from '../../../data/mockData';
import { motion, AnimatePresence } from 'motion/react';

interface LoginPageProps {
  onLogin: (role: UserRole, userId: number) => void;
  onBack?: () => void;
}

const ROLE_OPTIONS: { value: UserRole; label: string; emoji: string; color: string; desc: string }[] = [
  { value: 'waiter',        label: 'Waiter',        emoji: '🤝', color: '#4169E1', desc: 'Table service & order management' },
  { value: 'kitchen_staff', label: 'Kitchen Staff',  emoji: '👨‍🍳', color: '#FF8C00', desc: 'Food preparation & KDS' },
  { value: 'bar_staff',     label: 'Bar Staff',      emoji: '☕', color: '#0288D1', desc: 'Drinks preparation & bar display' },
  { value: 'cashier',       label: 'Cashier',        emoji: '💳', color: '#228B22', desc: 'Payment processing & billing' },
  { value: 'manager',       label: 'Manager',        emoji: '📋', color: '#8B4513', desc: 'Operations & oversight' },
  { value: 'super_admin',   label: 'Super Admin',    emoji: '⚡', color: '#6B3410', desc: 'Full system access' },
];

const MOCK_USERS: Record<UserRole, { username: string; password: string; userId: number }> = {
  waiter:        { username: 'waiter',   password: 'waiter123',   userId: 3 },
  kitchen_staff: { username: 'kitchen',  password: 'kitchen123',  userId: 4 },
  bar_staff:     { username: 'bar',      password: 'bar123',      userId: 8 },
  cashier:       { username: 'cashier',  password: 'cashier123',  userId: 5 },
  manager:       { username: 'manager',  password: 'manager123',  userId: 2 },
  super_admin:   { username: 'admin',    password: 'admin123',    userId: 1 },
  customer:      { username: '',         password: '',             userId: 0 },
};

export function LoginPage({ onLogin, onBack }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>('waiter');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const mockUser = MOCK_USERS[selectedRole];
    if (username === mockUser.username && password === mockUser.password) {
      setSuccess(true);
      setTimeout(() => onLogin(selectedRole, mockUser.userId), 800);
    } else {
      setError('Invalid credentials. Check the demo credentials below.');
      setLoading(false);
    }
  };

  const quickFill = () => {
    setUsername(MOCK_USERS[selectedRole].username);
    setPassword(MOCK_USERS[selectedRole].password);
    setError('');
  };

  const selectedRoleData = ROLE_OPTIONS.find(r => r.value === selectedRole)!;

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.5s ease both; }
        .fade-up-1 { animation-delay: 0.05s; }
        .fade-up-2 { animation-delay: 0.1s; }
        .fade-up-3 { animation-delay: 0.15s; }
        .fade-up-4 { animation-delay: 0.2s; }
      `}</style>

      {/* Left Panel */}
      <div className="hidden lg:flex w-[420px] flex-shrink-0 flex-col relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #2C1205 0%, #3E1A0A 40%, #6B3410 100%)' }}>
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #D2691E, transparent)' }} />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #FFA500, transparent)' }} />

        <div className="relative flex-1 flex flex-col justify-between p-10">
          {/* Logo */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-[#D2691E] flex items-center justify-center">
                <Coffee className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white text-xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>Azzurri Rwanda</h1>
                <p className="text-[#C4A882] text-xs">Kigali, Rwanda</p>
              </div>
            </div>
          </div>

          {/* Middle content */}
          <div>
            <h2 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              Staff<br />Management<br />Portal
            </h2>
            <p className="text-[#C4A882] mb-8 leading-relaxed">
              Secure access to the Azzurri Rwanda Restaurant Operations System. Choose your role and sign in.
            </p>

            {/* Roles preview */}
            <div className="space-y-2">
              {ROLE_OPTIONS.map((r, i) => (
                <div key={r.value}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${selectedRole === r.value ? 'bg-white/15 border border-white/20' : 'opacity-50'}`}
                  onClick={() => { setSelectedRole(r.value); setUsername(''); setPassword(''); setError(''); }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white flex-shrink-0" style={{ background: r.color }}>
                    {r.label.slice(0, 1)}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-semibold">{r.label}</p>
                    <p className="text-[#C4A882] text-xs">{r.desc}</p>
                  </div>
                  {selectedRole === r.value && <div className="w-2 h-2 rounded-full" style={{ background: r.color }} />}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div>
            <p className="text-[#C4A882] text-xs">Azzurri Rwanda Restaurant System</p>
            <p className="text-[#8B5E3A] text-xs">Azzurri Rwanda Restaurant System v2.0</p>
          </div>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="flex-1 bg-[#FFF8F0] flex flex-col">
        {/* Back button */}
        {onBack && (
          <div className="p-6 pb-0">
            <button onClick={onBack}
              className="flex items-center gap-2 text-[#8B7355] hover:text-[#8B4513] transition-colors font-semibold text-sm group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Restaurant
            </button>
          </div>
        )}

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#8B4513] flex items-center justify-center">
                  <Coffee className="w-5 h-5 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-[#2C1810]" style={{ fontFamily: 'Playfair Display, serif' }}>Azzurri Rwanda</h1>
              <p className="text-[#8B7355] text-sm mt-1">Restaurant Management System</p>
            </div>

            <div className="mb-6 fade-up fade-up-1">
              <h2 className="text-3xl font-bold text-[#2C1810]" style={{ fontFamily: 'Playfair Display, serif' }}>Sign In</h2>
              <p className="text-[#8B7355] mt-1">Welcome back! Access your dashboard.</p>
            </div>

            <AnimatePresence mode="wait">
              {success ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-[#228B22] flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Check className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#2C1810]">Welcome!</h3>
                  <p className="text-[#8B7355] mt-2">Redirecting to {selectedRoleData.label} dashboard...</p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleLogin} className="space-y-4">
                  {/* Role Selector */}
                  <div className="fade-up fade-up-2">
                    <label className="block text-sm font-bold text-[#2C1810] mb-1.5">Select Your Role</label>
                    <div className="relative">
                      <button type="button" onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="w-full bg-white border-2 border-[#E8D5C4] rounded-xl px-4 py-3.5 flex items-center justify-between hover:border-[#8B4513] transition-all shadow-sm">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{selectedRoleData.emoji}</span>
                          <div className="text-left">
                            <p className="font-bold text-[#2C1810]">{selectedRoleData.label}</p>
                            <p className="text-xs text-[#8B7355]">{selectedRoleData.desc}</p>
                          </div>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-[#8B7355] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {dropdownOpen && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                              className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-[#E8D5C4] rounded-xl shadow-[0_10px_30px_rgba(44,24,16,0.12)] overflow-hidden z-20">
                              {ROLE_OPTIONS.map(role => (
                                <button key={role.value} type="button"
                                  onClick={() => { setSelectedRole(role.value); setDropdownOpen(false); setError(''); setUsername(''); setPassword(''); }}
                                  className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-[#FFF8F0] transition-colors"
                                  style={{ background: selectedRole === role.value ? '#FFF8F0' : 'white' }}>
                                  <span className="text-2xl">{role.emoji}</span>
                                  <div className="flex-1 text-left">
                                    <p className="font-bold text-[#2C1810]">{role.label}</p>
                                    <p className="text-xs text-[#8B7355]">{role.desc}</p>
                                  </div>
                                  {selectedRole === role.value && (
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white" style={{ background: role.color }}>
                                      <Check className="w-3 h-3" />
                                    </div>
                                  )}
                                </button>
                              ))}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Username */}
                  <div className="fade-up fade-up-3">
                    <label className="block text-sm font-bold text-[#2C1810] mb-1.5">Username</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C4A882]" />
                      <input type="text" value={username}
                        onChange={e => { setUsername(e.target.value); setError(''); }}
                        placeholder={`e.g. ${MOCK_USERS[selectedRole].username}`}
                        className="w-full bg-white border-2 border-[#E8D5C4] rounded-xl px-4 py-3.5 pl-11 text-[#2C1810] placeholder:text-[#C4A882] focus:outline-none focus:border-[#8B4513] focus:ring-4 focus:ring-[#8B4513]/10 transition-all shadow-sm" required />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="fade-up fade-up-3">
                    <label className="block text-sm font-bold text-[#2C1810] mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C4A882]" />
                      <input type={showPassword ? 'text' : 'password'} value={password}
                        onChange={e => { setPassword(e.target.value); setError(''); }}
                        placeholder="Enter your password"
                        className="w-full bg-white border-2 border-[#E8D5C4] rounded-xl px-4 py-3.5 pl-11 pr-12 text-[#2C1810] placeholder:text-[#C4A882] focus:outline-none focus:border-[#8B4513] focus:ring-4 focus:ring-[#8B4513]/10 transition-all shadow-sm" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C4A882] hover:text-[#8B7355] transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                        className="bg-red-50 border-2 border-red-200 rounded-xl px-4 py-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                        <p className="text-sm font-semibold text-red-700">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <div className="fade-up fade-up-4">
                    <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      disabled={loading}
                      className="w-full py-4 rounded-xl font-bold text-white text-lg shadow-[0_8px_20px_rgba(139,69,19,0.3)] hover:shadow-[0_12px_30px_rgba(139,69,19,0.4)] transition-all disabled:opacity-70"
                      style={{ background: loading ? '#C4A882' : 'linear-gradient(135deg, #8B4513, #D2691E)' }}>
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Signing in...
                        </div>
                      ) : (
                        `Sign In → ${selectedRoleData.label}`
                      )}
                    </motion.button>
                  </div>

                  {/* Quick fill */}
                  <button type="button" onClick={quickFill}
                    className="w-full py-2 text-sm text-[#8B7355] font-semibold hover:text-[#8B4513] transition-colors">
                    Auto-fill Demo Credentials
                  </button>

                  {/* Demo credentials */}
                  <div className="bg-white border border-[#E8D5C4] rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-[#8B4513]" />
                      <p className="text-xs font-bold text-[#8B4513]">Demo Credentials</p>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {ROLE_OPTIONS.map(role => (
                        <p key={role.value} className="text-xs text-[#8B7355]">
                          <span className="font-semibold">{role.label}:</span>{' '}
                          {MOCK_USERS[role.value].username} / {MOCK_USERS[role.value].password}
                        </p>
                      ))}
                    </div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}