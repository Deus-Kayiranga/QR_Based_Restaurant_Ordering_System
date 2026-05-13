import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForgotPassword } from '../../hooks/useForgotPassword';
import { Lock, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const { isLoading, error, handleForgotPassword, setError } = useForgotPassword();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter a valid email');
      return;
    }

    const success = await handleForgotPassword(email);
    if (success) {
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/verify-otp');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-3xl" />

      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg relative z-10 animate-fadeIn">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#FFF0E0] rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={24} color="#8B4513" />
          </div>
          <h1 className="text-2xl font-bold text-textPrimary mb-2" style={{ fontFamily: 'Playfair Display' }}>
            Forgot Password?
          </h1>
          <p className="text-sm text-textSecondary" style={{ fontFamily: 'Inter' }}>
            No worries, we'll send you a reset code
          </p>
        </div>

        {error && (
          <div className="bg-danger/10 text-danger text-sm p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        {isSuccess && (
          <div className="bg-success/10 text-success text-sm p-3 rounded-lg mb-6 text-center flex items-center justify-center gap-2">
            <CheckCircle2 size={16} />
            OTP sent to your email!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[13px] font-semibold text-textSecondary" style={{ fontFamily: 'Inter' }}>
              Email Address
            </label>
            <div className="relative group">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary" />
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full h-12 bg-white border border-border rounded-xl pl-12 pr-4 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || isSuccess}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || isSuccess || !email}
            className="w-full h-12 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold text-[15px] hover:opacity-90 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            style={{ fontFamily: 'Inter' }}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </div>
            ) : (
              'Send Reset Code'
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

export default ForgotPasswordPage;
