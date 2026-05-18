import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ErrorState } from '@/components/ui/ErrorState';
import { LeadTable } from '@/components/leads/LeadTable';
import { LeadFilters } from '@/components/leads/LeadFilters';
import { LeadForm } from '@/components/leads/LeadForm';
import { LeadDetailModal } from '@/components/leads/LeadDetailModal';
import {
  useLeads,
  useCreateLead,
  useUpdateLead,
  useDeleteLead,
  useExportCsv,
} from '@/hooks/useLeads';
import { useDebounce } from '@/hooks/useDebounce';
import { Lead, LeadFilters as LeadFiltersType, SortOrder, CreateLeadInput, UpdateLeadInput } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { DEBOUNCE_DELAY } from '@/constants';

const DEFAULT_FILTERS: LeadFiltersType = {
  sort: SortOrder.LATEST,
  page: 1,
  limit: 10,
};

const LeadsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAdmin } = useAuth();

  const [filters, setFilters] = useState<LeadFiltersType>(DEFAULT_FILTERS);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, DEBOUNCE_DELAY);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);

  const activeFilters = { ...filters, search: debouncedSearch || undefined };
  const { data, isLoading, isError, refetch } = useLeads(activeFilters);
  const createLead = useCreateLead();
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();
  const exportCsv = useExportCsv();

  // Sync ?action=create from URL
  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      setIsCreateOpen(true);
      searchParams.delete('action');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  // Sync debounced search resets pagination
  useEffect(() => {
    setFilters((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearch]);

  const handleFiltersChange = useCallback((partial: Partial<LeadFiltersType>) => {
    setFilters((prev) => ({ ...prev, ...partial, page: 1 }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSearchInput('');
  }, []);

  const handleCreateSubmit = async (data: CreateLeadInput) => {
    await createLead.mutateAsync(data);
    setIsCreateOpen(false);
  };

  const handleEditSubmit = async (data: UpdateLeadInput) => {
    if (!editingLead) return;
    await updateLead.mutateAsync({ id: editingLead._id, data });
    setEditingLead(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingLead) return;
    await deleteLead.mutateAsync(deletingLead._id);
    setDeletingLead(null);
  };

  const handleExport = () => {
    exportCsv.mutate(activeFilters);
  };

  const leads = data?.data?.items ?? [];
  const pagination = data?.data?.pagination;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {pagination ? `${pagination.total} total leads` : 'Loading...'}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {isAdmin && (
            <Button
              variant="secondary"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={handleExport}
              isLoading={exportCsv.isPending}
              size="sm"
            >
              Export CSV
            </Button>
          )}
          <Button
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsCreateOpen(true)}
            size="sm"
          >
            Add Lead
          </Button>
        </div>
      </div>

      {/* Filters */}
      <LeadFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClear={handleClearFilters}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
      />

      {/* Table */}
      <div className="card overflow-hidden">
        {isError ? (
          <ErrorState onRetry={() => void refetch()} />
        ) : (
          <>
            <LeadTable
              leads={leads}
              isLoading={isLoading}
              onEdit={setEditingLead}
              onDelete={setDeletingLead}
              onView={setViewingLead}
            />
            {pagination && (
              <div className="border-t border-slate-100 dark:border-slate-800">
                <Pagination
                  pagination={pagination}
                  onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add New Lead"
      >
        <LeadForm
          onSubmit={(data) => void handleCreateSubmit(data as CreateLeadInput)}
          isLoading={createLead.isPending}
          onCancel={() => setIsCreateOpen(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingLead}
        onClose={() => setEditingLead(null)}
        title="Edit Lead"
      >
        <LeadForm
          lead={editingLead ?? undefined}
          onSubmit={(data) => void handleEditSubmit(data as UpdateLeadInput)}
          isLoading={updateLead.isPending}
          onCancel={() => setEditingLead(null)}
        />
      </Modal>

      {/* View Modal */}
      <LeadDetailModal
        lead={viewingLead}
        isOpen={!!viewingLead}
        onClose={() => setViewingLead(null)}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deletingLead}
        onClose={() => setDeletingLead(null)}
        onConfirm={() => void handleDeleteConfirm()}
        isLoading={deleteLead.isPending}
        title="Delete Lead"
        description={`Are you sure you want to delete "${deletingLead?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default LeadsPage;
