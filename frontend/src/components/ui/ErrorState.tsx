import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  description = 'An error occurred while loading data. Please try again.',
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl mb-4">
      <AlertTriangle className="w-10 h-10 text-red-500" />
    </div>
    <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-1">
      {title}
    </h3>
    <p className="text-sm text-slate-500 dark:text-slate-500 max-w-xs mb-6">
      {description}
    </p>
    {onRetry && (
      <Button variant="secondary" onClick={onRetry}>
        Try Again
      </Button>
    )}
  </div>
);
