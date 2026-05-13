import { useState } from 'react';
import { authApi } from '../api/auth';
import { useNavigate } from 'react-router-dom';

export const useForgotPassword = () => {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleForgotPassword = async (emailInput: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.forgotPassword(emailInput);
      setEmail(emailInput);
      sessionStorage.setItem('resetEmail', emailInput);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email not found. Please check and try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (emailInput: string, otp: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.verifyOtp(emailInput, otp);
      sessionStorage.setItem('resetToken', response.token);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid code. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (newPassword: string) => {
    setIsLoading(true);
    setError(null);
    const token = sessionStorage.getItem('resetToken');
    if (!token) {
      setError('Session expired. Please start over.');
      return false;
    }
    
    try {
      await authApi.resetPassword(token, newPassword);
      sessionStorage.removeItem('resetEmail');
      sessionStorage.removeItem('resetToken');
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    isLoading,
    error,
    handleForgotPassword,
    handleVerifyOtp,
    handleResetPassword,
    setError,
  };
};
