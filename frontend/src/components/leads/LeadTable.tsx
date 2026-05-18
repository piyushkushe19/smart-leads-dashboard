import React from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react';
import { Lead } from '@/types';
import { StatusBadge, SourceBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuth } from '@/context/AuthContext';

interface LeadTableProps {
  leads: Lead[];
  isLoading: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onView: (lead: Lead) => void;
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  isLoading,
  onEdit,
  onDelete,
  onView,
}) => {
  const { isAdmin } = useAuth();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800">
            {['Name', 'Email', 'Status', 'Source', 'Created', 'Actions'].map((h) => (
              <th
                key={h}
                className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? [...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)
            : leads.map((lead) => (
                <tr
                  key={lead._id}
                  className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-800 dark:text-slate-200">
                      {lead.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {lead.email}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="px-4 py-3">
                    <SourceBadge source={lead.source} />
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">
                    {formatDate(lead.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(lead)}
                        className="p-1.5"
                        aria-label="View lead"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(lead)}
                        className="p-1.5"
                        aria-label="Edit lead"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(lead)}
                          className="p-1.5 hover:text-red-500 dark:hover:text-red-400"
                          aria-label="Delete lead"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>

      {!isLoading && leads.length === 0 && (
        <EmptyState
          description="No leads match your current filters. Try adjusting the search or filters."
        />
      )}
    </div>
  );
};
