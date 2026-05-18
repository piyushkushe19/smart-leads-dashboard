import React from 'react';
import { LeadStats, LeadStatus } from '@/types';
import { STATUS_COLORS } from '@/constants';
import { Skeleton } from '@/components/ui/Skeleton';

interface StatusDistributionProps {
  stats: LeadStats | undefined;
  isLoading: boolean;
}

const STATUS_ORDER = [LeadStatus.NEW, LeadStatus.CONTACTED, LeadStatus.QUALIFIED, LeadStatus.LOST];

export const StatusDistribution: React.FC<StatusDistributionProps> = ({
  stats,
  isLoading,
}) => {
  const total = stats?.total ?? 0;

  return (
    <div className="card p-6">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-5">
        Lead Pipeline
      </h3>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {STATUS_ORDER.map((status) => {
            const count = stats?.byStatus[status] ?? 0;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            const barColorMap: Record<LeadStatus, string> = {
              [LeadStatus.NEW]: 'bg-blue-500',
              [LeadStatus.CONTACTED]: 'bg-amber-500',
              [LeadStatus.QUALIFIED]: 'bg-emerald-500',
              [LeadStatus.LOST]: 'bg-red-500',
            };

            return (
              <div key={status}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className={`badge text-xs ${STATUS_COLORS[status]}`}>{status}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {count}
                    </span>
                    <span className="text-xs text-slate-400">{pct}%</span>
                  </div>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${barColorMap[status]}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
