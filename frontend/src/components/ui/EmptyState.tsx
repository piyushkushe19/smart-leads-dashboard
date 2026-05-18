import React from 'react';
import { Users } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No results found',
  description = 'Try adjusting your filters or search query.',
  action,
  icon,
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-2xl mb-4 text-slate-400">
      {icon ?? <Users className="w-10 h-10" />}
    </div>
    <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-1">
      {title}
    </h3>
    <p className="text-sm text-slate-500 dark:text-slate-500 max-w-xs mb-6">
      {description}
    </p>
    {action}
  </div>
);
