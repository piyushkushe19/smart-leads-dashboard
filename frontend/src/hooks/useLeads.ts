import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsApi } from '@/api/leads.api';
import { LeadFilters, CreateLeadInput, UpdateLeadInput } from '@/types';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { ApiResponse } from '@/types';

export const LEADS_QUERY_KEY = 'leads';
export const STATS_QUERY_KEY = 'lead-stats';

export const useLeads = (filters: LeadFilters) => {
  return useQuery({
    queryKey: [LEADS_QUERY_KEY, filters],
    queryFn: () => leadsApi.getLeads(filters),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
};

export const useLeadById = (id: string) => {
  return useQuery({
    queryKey: [LEADS_QUERY_KEY, id],
    queryFn: () => leadsApi.getLeadById(id),
    enabled: !!id,
  });
};

export const useLeadStats = () => {
  return useQuery({
    queryKey: [STATS_QUERY_KEY],
    queryFn: () => leadsApi.getStats(),
    staleTime: 60_000,
  });
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiResponse | undefined;
    return data?.message ?? error.message;
  }
  return 'Something went wrong';
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLeadInput) => leadsApi.createLead(data),
    onSuccess: (res) => {
      void queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
      void queryClient.invalidateQueries({ queryKey: [STATS_QUERY_KEY] });
      toast.success(res.message ?? 'Lead created successfully');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLeadInput }) =>
      leadsApi.updateLead(id, data),
    onSuccess: (res) => {
      void queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
      void queryClient.invalidateQueries({ queryKey: [STATS_QUERY_KEY] });
      toast.success(res.message ?? 'Lead updated successfully');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useDeleteLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => leadsApi.deleteLead(id),
    onSuccess: (res) => {
      void queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
      void queryClient.invalidateQueries({ queryKey: [STATS_QUERY_KEY] });
      toast.success(res.message ?? 'Lead deleted successfully');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useExportCsv = () => {
  return useMutation({
    mutationFn: (filters: LeadFilters) => leadsApi.exportCsv(filters),
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('CSV exported successfully');
    },
    onError: () => {
      toast.error('Failed to export CSV');
    },
  });
};
