import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { localStorageService } from '../../services/localStorageService';
import { COLORS } from '../../styles/theme';
import { 
  UtensilsCrossed, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login({ email, password });
      
      // Get the user from localStorageService because state might not have updated yet
      const savedUserJson = localStorageService.getUserSnapshot();
      const savedUser = savedUserJson ? JSON.parse(savedUserJson) : {};
      const role = savedUser.role;

      if (from !== '/') {
        navigate(from, { replace: true });
        return;
      }

      // Role-based redirection
      switch (role) {
        case 'SUPER_ADMIN':
          navigate('/admin/dashboard', { replace: true });
          break;
        case 'MANAGER':
          navigate('/manager/dashboard', { replace: true });
          break;
        case 'KITCHEN_STAFF':
          navigate('/kitchen/dashboard', { replace: true });
          break;
        case 'BAR_STAFF':
          navigate('/bar', { replace: true });
          break;
        case 'CASHIER':
          navigate('/cashier/dashboard', { replace: true });
          break;
        case 'WAITER':
          navigate('/waiter/dashboard', { replace: true });
          break;
        default:
          navigate('/', { replace: true });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-3xl" />

      {/* Back to Home Button */}
      <Link 
        to="/welcome" 
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-textSecondary hover:text-primary transition-colors bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full font-medium text-sm shadow-sm z-50 border border-white"
      >
        <ArrowLeft size={16} />
        Back to Menu
      </Link>

      <div className="w-full max-w-md animate-fadeIn">
        {/* Branding */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20 rotate-3">
            <UtensilsCrossed size={40} color="white" />
          </div>
          <h1 className="text-4xl font-bold text-primary mb-2" style={{ fontFamily: 'Playfair Display' }}>
            Azzurri Rwanda Restaurant
          </h1>
          <p className="text-textSecondary font-medium tracking-wide uppercase text-xs">Staff Portal Access</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-primary/5 border border-border/50 relative z-10">
          <h2 className="text-2xl font-bold text-textPrimary mb-8">Sign In</h2>

          {error && (
            <div className="bg-danger/10 border border-danger/20 p-4 rounded-2xl flex items-start gap-3 text-danger mb-6 animate-pulse">
              <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium leading-snug">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-textSecondary uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary group-focus-within:text-primary transition-colors" />
                <input 
                  type="email" 
                  required
                  placeholder="name@azzurrirwanda.rw"
                  className="w-full bg-bg border-none rounded-2xl py-4 pl-12 pr-4 font-medium text-textPrimary focus:ring-2 focus:ring-primary/20 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-textSecondary uppercase tracking-widest">Password</label>
                <Link to="/forgot-password" className="text-xs font-bold text-primary hover:underline">Forgot Password?</Link>
              </div>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary group-focus-within:text-primary transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="••••••••"
                  className="w-full bg-bg border-none rounded-2xl py-4 pl-12 pr-12 font-medium text-textPrimary focus:ring-2 focus:ring-primary/20 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-textSecondary hover:text-textPrimary"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In to Dashboard
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-textSecondary">
              Need access? Contact your system administrator.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center flex items-center justify-center gap-6 text-textSecondary/40 font-bold text-[10px] tracking-[0.2em] uppercase">
          <span>Secure Login</span>
          <span className="w-1.5 h-1.5 bg-textSecondary/20 rounded-full" />
          <span>V 1.0.0</span>
          <span className="w-1.5 h-1.5 bg-textSecondary/20 rounded-full" />
          <span>© 2026 Azzurri Rwanda Restaurant</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
