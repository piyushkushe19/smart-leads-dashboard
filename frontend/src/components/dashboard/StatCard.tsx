import React from 'react';
import { clsx } from 'clsx';
import { CardSkeleton } from '@/components/ui/Skeleton';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  iconBg: string;
  trend?: {
    value: number;
    label: string;
  };
  isLoading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconBg,
  isLoading,
}) => {
  if (isLoading) return <CardSkeleton />;

  return (
    <div className="card p-6 hover:shadow-md dark:hover:shadow-slate-900/50 transition-all duration-200 animate-slide-up">
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <div className={clsx('p-2.5 rounded-xl', iconBg)}>{icon}</div>
      </div>
      <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
        {value}
      </p>
      {subtitle && (
        <p className="text-xs text-slate-500 dark:text-slate-500">{subtitle}</p>
      )}
    </div>
  );
};
