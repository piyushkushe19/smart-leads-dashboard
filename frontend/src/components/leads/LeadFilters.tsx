import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { LeadFilters as LeadFiltersType, LeadStatus, LeadSource, SortOrder } from '@/types';
import { LEAD_STATUS_OPTIONS, LEAD_SOURCE_OPTIONS } from '@/constants';

interface LeadFiltersProps {
  filters: LeadFiltersType;
  onFiltersChange: (filters: Partial<LeadFiltersType>) => void;
  onClear: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

const statusOptions = [
  { value: '', label: 'All Statuses' },
  ...LEAD_STATUS_OPTIONS.map((s) => ({ value: s, label: s })),
];

const sourceOptions = [
  { value: '', label: 'All Sources' },
  ...LEAD_SOURCE_OPTIONS.map((s) => ({ value: s, label: s })),
];

const sortOptions = [
  { value: SortOrder.LATEST, label: 'Newest First' },
  { value: SortOrder.OLDEST, label: 'Oldest First' },
];

const hasActiveFilters = (filters: LeadFiltersType, search: string): boolean =>
  !!(filters.status || filters.source || search || filters.sort === SortOrder.OLDEST);

export const LeadFilters: React.FC<LeadFiltersProps> = ({
  filters,
  onFiltersChange,
  onClear,
  searchValue,
  onSearchChange,
}) => {
  const active = hasActiveFilters(filters, searchValue);

  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-3">
        <SlidersHorizontal className="w-4 h-4 text-slate-400" />
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Filters
        </span>
        {active && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="ml-auto text-xs text-slate-400 hover:text-red-500"
            leftIcon={<X className="w-3 h-3" />}
          >
            Clear all
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Input
          placeholder="Search name or email..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          rightIcon={
            searchValue ? (
              <button
                onClick={() => onSearchChange('')}
                className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : null
          }
        />

        <Select
          options={statusOptions}
          value={filters.status ?? ''}
          onChange={(e) =>
            onFiltersChange({ status: (e.target.value as LeadStatus) || undefined })
          }
        />

        <Select
          options={sourceOptions}
          value={filters.source ?? ''}
          onChange={(e) =>
            onFiltersChange({ source: (e.target.value as LeadSource) || undefined })
          }
        />

        <Select
          options={sortOptions}
          value={filters.sort ?? SortOrder.LATEST}
          onChange={(e) =>
            onFiltersChange({ sort: e.target.value as SortOrder })
          }
        />
      </div>
    </div>
  );
};
