import apiClient from './axios';
import { ApiResponse, User, UserRole } from '@/types';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthData {
  user: User;
  token: string;
}

export const authApi = {
  register: async (data: RegisterInput): Promise<ApiResponse<AuthData>> => {
    const res = await apiClient.post<ApiResponse<AuthData>>('/auth/register', data);
    return res.data;
  },

  login: async (data: LoginInput): Promise<ApiResponse<AuthData>> => {
    const res = await apiClient.post<ApiResponse<AuthData>>('/auth/login', data);
    return res.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const res = await apiClient.post<ApiResponse>('/auth/logout');
    return res.data;
  },

  getProfile: async (): Promise<ApiResponse<{ user: User }>> => {
    const res = await apiClient.get<ApiResponse<{ user: User }>>('/auth/profile');
    return res.data;
  },
};
