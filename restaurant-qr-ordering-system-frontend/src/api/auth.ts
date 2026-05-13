import { axiosInstance, unwrap } from './axiosInstance';
import type { 
  LoginRequest, 
  AuthResponse, 
  User, 
  RegisterRequest 
} from '../types';
import { API_ROUTES } from '../utils/constants';

export const authApi = {
  login: (data: LoginRequest) => {
    return unwrap<AuthResponse>(axiosInstance.post(API_ROUTES.AUTH.LOGIN, data));
  },
  
  register: (data: RegisterRequest) => {
    return unwrap<User>(axiosInstance.post(API_ROUTES.AUTH.REGISTER, data));
  },
  
  getMe: () => {
    return unwrap<User>(axiosInstance.get(API_ROUTES.AUTH.ME));
  },
  
  forgotPassword: async (email: string): Promise<void> => {
    await axiosInstance.post(API_ROUTES.AUTH.FORGOT_PASSWORD, { email });
  },
  
  verifyOtp: (email: string, otp: string) => {
    return unwrap<{token: string}>(axiosInstance.post(API_ROUTES.AUTH.VERIFY_OTP, { email, otp }));
  },
  
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await axiosInstance.post(API_ROUTES.AUTH.RESET_PASSWORD, { token, newPassword });
  },
};
