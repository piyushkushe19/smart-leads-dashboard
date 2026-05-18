import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge, SourceBadge } from '@/components/ui/Badge';
import { Lead } from '@/types';
import { Calendar, Mail, User, Tag } from 'lucide-react';

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

const DetailRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
    <div className="mt-0.5 text-slate-400 flex-shrink-0">{icon}</div>
    <div>
      <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">{label}</p>
      <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{value}</div>
    </div>
  </div>
);

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  isOpen,
  onClose,
}) => {
  if (!lead) return null;

  const createdAt = new Date(lead.createdAt).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lead Details" size="md">
      <div className="space-y-1">
        <DetailRow
          icon={<User className="w-4 h-4" />}
          label="Full Name"
          value={lead.name}
        />
        <DetailRow
          icon={<Mail className="w-4 h-4" />}
          label="Email Address"
          value={
            <a href={`mailto:${lead.email}`} className="text-brand-600 dark:text-brand-400 hover:underline">
              {lead.email}
            </a>
          }
        />
        <DetailRow
          icon={<Tag className="w-4 h-4" />}
          label="Status"
          value={<StatusBadge status={lead.status} />}
        />
        <DetailRow
          icon={<Tag className="w-4 h-4" />}
          label="Source"
          value={<SourceBadge source={lead.source} />}
        />
        <DetailRow
          icon={<User className="w-4 h-4" />}
          label="Created By"
          value={`${lead.createdBy.name} (${lead.createdBy.email})`}
        />
        <DetailRow
          icon={<Calendar className="w-4 h-4" />}
          label="Created At"
          value={createdAt}
        />
      </div>
    </Modal>
  );
};
