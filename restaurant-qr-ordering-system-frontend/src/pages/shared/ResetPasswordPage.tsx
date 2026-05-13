import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForgotPassword } from '../../hooks/useForgotPassword';
import { Key, ArrowLeft, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { isLoading, error, handleResetPassword, setError } = useForgotPassword();
  const navigate = useNavigate();

  const token = sessionStorage.getItem('resetToken');

  useEffect(() => {
    if (!token) {
      navigate('/forgot-password');
    }
  }, [token, navigate]);

  const reqs = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'At least 1 uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'At least 1 lowercase letter', met: /[a-z]/.test(password) },
    { label: 'At least 1 number', met: /[0-9]/.test(password) },
    { label: 'At least 1 special character', met: /[^A-Za-z0-9]/.test(password) }
  ];

  const metCount = reqs.filter(r => r.met).length;
  const isPasswordValid = metCount === reqs.length;
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  let strengthColor = 'bg-border';
  if (metCount > 0) {
    if (metCount <= 1) strengthColor = 'bg-danger';
    else if (metCount <= 3) strengthColor = 'bg-warning';
    else if (metCount === 4) strengthColor = 'bg-[#E3B505]'; // Yellow
    else strengthColor = 'bg-success';
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid || !passwordsMatch) return;

    const success = await handleResetPassword(password);
    if (success) {
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg text-center animate-fadeIn border border-success/20">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={32} className="text-success" />
          </div>
          <h2 className="text-2xl font-bold text-textPrimary mb-2" style={{ fontFamily: 'Playfair Display' }}>
            Password Reset Successful!
          </h2>
          <p className="text-sm text-textSecondary mb-8">
            Your password has been successfully updated.
          </p>
          <div className="text-xs font-semibold text-textSecondary animate-pulse">
            Redirecting to login...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-3xl" />

      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg relative z-10 animate-fadeIn">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#FFF0E0] rounded-full flex items-center justify-center mx-auto mb-4">
            <Key size={24} color="#8B4513" />
          </div>
          <h1 className="text-2xl font-bold text-textPrimary mb-2" style={{ fontFamily: 'Playfair Display' }}>
            Create New Password
          </h1>
          <p className="text-sm text-textSecondary" style={{ fontFamily: 'Inter' }}>
            Your identity is verified! Set your new password.
          </p>
        </div>

        {error && (
          <div className="bg-danger/10 text-danger text-sm p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[13px] font-semibold text-textSecondary" style={{ fontFamily: 'Inter' }}>
              New Password
            </label>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                className="w-full h-12 bg-white border border-border rounded-xl pl-4 pr-12 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-textSecondary hover:text-textPrimary"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {password && (
              <div className="mt-3 animate-fadeIn">
                <div className="h-1.5 w-full bg-border rounded-full overflow-hidden mb-3">
                  <div className={`h-full transition-all duration-300 ${strengthColor}`} style={{ width: `${(metCount / 5) * 100}%` }} />
                </div>
                <ul className="space-y-1 text-xs text-textSecondary">
                  {reqs.map((req, i) => (
                    <li key={i} className="flex items-center gap-2">
                      {req.met ? <CheckCircle2 size={12} className="text-success" /> : <div className="w-3 h-3 border border-border rounded-sm" />}
                      <span className={req.met ? 'text-success' : ''}>{req.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-semibold text-textSecondary" style={{ fontFamily: 'Inter' }}>
              Confirm Password
            </label>
            <div className="relative group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                className="w-full h-12 bg-white border border-border rounded-xl pl-4 pr-12 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-textSecondary hover:text-textPrimary"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {confirmPassword && (
              <div className="mt-2 text-xs flex items-center gap-1 animate-fadeIn">
                {passwordsMatch ? (
                  <span className="text-success flex items-center gap-1"><CheckCircle2 size={12} /> Passwords match</span>
                ) : (
                  <span className="text-danger flex items-center gap-1"><XCircle size={12} /> Passwords do not match</span>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !isPasswordValid || !passwordsMatch}
            className="w-full h-12 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold text-[15px] hover:opacity-90 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            style={{ fontFamily: 'Inter' }}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Resetting...
              </div>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-textSecondary hover:text-primary transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
