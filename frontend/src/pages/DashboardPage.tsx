import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  TrendingUp,
  Target,
  AlertCircle,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { StatusDistribution } from '@/components/dashboard/StatusDistribution';
import { SourceBreakdown } from '@/components/dashboard/SourceBreakdown';
import { useLeadStats } from '@/hooks/useLeads';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

const DashboardPage: React.FC = () => {
  const { data: statsRes, isLoading } = useLeadStats();
  const { user } = useAuth();
  const stats = statsRes?.data?.stats;

  const statCards = [
    {
      title: 'Total Leads',
      value: stats?.total ?? 0,
      subtitle: 'All time',
      icon: <Users className="w-5 h-5 text-brand-600 dark:text-brand-400" />,
      iconBg: 'bg-brand-100 dark:bg-brand-900/30',
    },
    {
      title: 'Qualified',
      value: stats?.byStatus['Qualified'] ?? 0,
      subtitle: 'Ready to convert',
      icon: <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    },
    {
      title: 'Contacted',
      value: stats?.byStatus['Contacted'] ?? 0,
      subtitle: 'In progress',
      icon: <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    },
    {
      title: 'Lost',
      value: stats?.byStatus['Lost'] ?? 0,
      subtitle: 'Need attention',
      icon: <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />,
      iconBg: 'bg-red-100 dark:bg-red-900/30',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Hello, {user?.name.split(' ')[0]} 👋
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Here&apos;s what&apos;s happening with your leads today.
          </p>
        </div>
        <Link to="/leads">
          <Button leftIcon={<Plus className="w-4 h-4" />}>
            Add Lead
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} isLoading={isLoading} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StatusDistribution stats={stats} isLoading={isLoading} />
        <SourceBreakdown stats={stats} isLoading={isLoading} />
      </div>

      {/* Quick actions */}
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            to="/leads"
            className="flex items-center justify-between p-4 rounded-xl bg-brand-600/10 border border-brand-600/20 hover:bg-brand-600/20 transition-colors group"
          >
            <div>
              <p className="text-sm font-medium text-brand-700 dark:text-brand-400">View All Leads</p>
              <p className="text-xs text-brand-600/60 dark:text-brand-500 mt-0.5">Browse and manage your pipeline</p>
            </div>
            <ArrowRight className="w-4 h-4 text-brand-600 dark:text-brand-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/leads?action=create"
            className="flex items-center justify-between p-4 rounded-xl bg-emerald-600/10 border border-emerald-600/20 hover:bg-emerald-600/20 transition-colors group"
          >
            <div>
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Create New Lead</p>
              <p className="text-xs text-emerald-600/60 dark:text-emerald-500 mt-0.5">Add a lead to your pipeline</p>
            </div>
            <Plus className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:rotate-90 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
