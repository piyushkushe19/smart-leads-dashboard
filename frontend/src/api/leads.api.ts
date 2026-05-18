import apiClient from './axios';
import {
  ApiResponse,
  Lead,
  LeadFilters,
  PaginatedResponse,
  LeadStats,
  CreateLeadInput,
  UpdateLeadInput,
} from '@/types';

const buildParams = (filters: LeadFilters): Record<string, string> => {
  const params: Record<string, string> = {};
  if (filters.status) params.status = filters.status;
  if (filters.source) params.source = filters.source;
  if (filters.search) params.search = filters.search;
  if (filters.sort) params.sort = filters.sort;
  if (filters.page) params.page = String(filters.page);
  if (filters.limit) params.limit = String(filters.limit);
  return params;
};

export const leadsApi = {
  getLeads: async (
    filters: LeadFilters
  ): Promise<ApiResponse<PaginatedResponse<Lead>>> => {
    const res = await apiClient.get<ApiResponse<PaginatedResponse<Lead>>>('/leads', {
      params: buildParams(filters),
    });
    return res.data;
  },

  getLeadById: async (id: string): Promise<ApiResponse<{ lead: Lead }>> => {
    const res = await apiClient.get<ApiResponse<{ lead: Lead }>>(`/leads/${id}`);
    return res.data;
  },

  createLead: async (data: CreateLeadInput): Promise<ApiResponse<{ lead: Lead }>> => {
    const res = await apiClient.post<ApiResponse<{ lead: Lead }>>('/leads', data);
    return res.data;
  },

  updateLead: async (
    id: string,
    data: UpdateLeadInput
  ): Promise<ApiResponse<{ lead: Lead }>> => {
    const res = await apiClient.put<ApiResponse<{ lead: Lead }>>(`/leads/${id}`, data);
    return res.data;
  },

  deleteLead: async (id: string): Promise<ApiResponse> => {
    const res = await apiClient.delete<ApiResponse>(`/leads/${id}`);
    return res.data;
  },

  exportCsv: async (filters: LeadFilters): Promise<Blob> => {
    const res = await apiClient.get('/leads/export', {
      params: buildParams(filters),
      responseType: 'blob',
    });
    return res.data as Blob;
  },

  getStats: async (): Promise<ApiResponse<{ stats: LeadStats }>> => {
    const res = await apiClient.get<ApiResponse<{ stats: LeadStats }>>('/leads/stats');
    return res.data;
  },
};
