import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForgotPassword } from '../../hooks/useForgotPassword';
import { Shield, ArrowLeft, CheckCircle2 } from 'lucide-react';

const VerifyOtpPage: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [timer, setTimer] = useState(60);
  const [isSuccess, setIsSuccess] = useState(false);
  const [shake, setShake] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { isLoading, error, handleVerifyOtp, handleForgotPassword, setError } = useForgotPassword();
  const navigate = useNavigate();
  
  const email = sessionStorage.getItem('resetEmail') || '';

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [email, navigate]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    if (pastedData.some(isNaN as any)) return;

    const newOtp = [...otp];
    pastedData.forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
    
    // Focus last filled input
    const lastFilledIndex = Math.min(pastedData.length - 1, 5);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const otpString = otp.join('');
    if (otpString.length !== 6) return;

    const success = await handleVerifyOtp(email, otpString);
    if (success) {
      setIsSuccess(true);
      setTimeout(() => navigate('/reset-password'), 1500);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    const success = await handleForgotPassword(email);
    if (success) {
      setTimer(60);
      setOtp(Array(6).fill(''));
    }
  };

  const maskEmail = (email: string) => {
    const [name, domain] = email.split('@');
    if (!name || !domain) return email;
    return `${name.substring(0, 3)}******@${domain}`;
  };

  const isComplete = otp.every(val => val !== '');

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-3xl" />

      <div className={`w-full max-w-md bg-white rounded-2xl p-8 shadow-lg relative z-10 animate-fadeIn ${shake ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#FFF0E0] rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={24} color="#8B4513" />
          </div>
          <h1 className="text-2xl font-bold text-textPrimary mb-2" style={{ fontFamily: 'Playfair Display' }}>
            Verify Your Email
          </h1>
          <p className="text-sm text-textSecondary" style={{ fontFamily: 'Inter' }}>
            Enter the 6-digit code sent to
          </p>
          <p className="text-[13px] font-semibold text-textPrimary mt-1">
            {email} {/* In production, use maskEmail(email) */}
          </p>
        </div>

        {error && !shake && (
          <div className="bg-danger/10 text-danger text-sm p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <div className="flex justify-between gap-2 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={isLoading || isSuccess}
              className={`w-12 h-[52px] rounded-xl text-center text-[22px] font-bold border transition-all
                ${isSuccess ? 'border-success bg-success/5 text-success' : 
                  error && shake ? 'border-danger text-danger' : 
                  digit ? 'border-primary' : 'border-border'}
                focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
              `}
              style={{ fontFamily: 'Inter' }}
            />
          ))}
        </div>

        <div className="text-center mb-6">
          {timer > 0 ? (
            <p className="text-sm text-textSecondary">
              Resend code in 0:{timer.toString().padStart(2, '0')}
            </p>
          ) : (
            <p className="text-sm text-textSecondary">
              Didn't receive code?{' '}
              <button onClick={handleResend} className="text-secondary font-semibold hover:underline">
                Resend
              </button>
            </p>
          )}
        </div>

        <button
          onClick={() => handleSubmit()}
          disabled={isLoading || isSuccess || !isComplete}
          className="w-full h-12 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold text-[15px] hover:opacity-90 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          style={{ fontFamily: 'Inter' }}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Verifying...
            </div>
          ) : isSuccess ? (
             <CheckCircle2 size={20} />
          ) : (
            'Verify Code'
          )}
        </button>

        <div className="mt-8 text-center">
          <Link
            to="/forgot-password"
            className="inline-flex items-center gap-2 text-textSecondary hover:text-primary transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Change email address
          </Link>
        </div>
      </div>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
        }
      `}</style>
    </div>
  );
};

export default VerifyOtpPage;
