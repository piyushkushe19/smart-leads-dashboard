import React from 'react';
import { LeadStats, LeadSource } from '@/types';
import { SOURCE_COLORS } from '@/constants';
import { Skeleton } from '@/components/ui/Skeleton';

interface SourceBreakdownProps {
  stats: LeadStats | undefined;
  isLoading: boolean;
}

const SOURCE_ICONS: Record<LeadSource, string> = {
  [LeadSource.WEBSITE]: '🌐',
  [LeadSource.INSTAGRAM]: '📸',
  [LeadSource.REFERRAL]: '🤝',
};

export const SourceBreakdown: React.FC<SourceBreakdownProps> = ({ stats, isLoading }) => {
  const total = stats?.total ?? 0;

  return (
    <div className="card p-6">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-5">
        Lead Sources
      </h3>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
              <Skeleton className="h-4 w-8" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {Object.values(LeadSource).map((source) => {
            const count = stats?.bySource[source] ?? 0;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;

            return (
              <div key={source} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl flex-shrink-0">
                  {SOURCE_ICONS[source]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`badge text-xs ${SOURCE_COLORS[source]}`}>{source}</span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {count}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-brand-500 transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
