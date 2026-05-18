import React from 'react';
import { clsx } from 'clsx';
import { LeadStatus, LeadSource } from '@/types';
import { STATUS_COLORS, SOURCE_COLORS } from '@/constants';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, className }) => (
  <span className={clsx('badge', className)}>{children}</span>
);

interface StatusBadgeProps {
  status: LeadStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => (
  <Badge className={STATUS_COLORS[status]}>{status}</Badge>
);

interface SourceBadgeProps {
  source: LeadSource;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ source }) => (
  <Badge className={SOURCE_COLORS[source]}>{source}</Badge>
);
