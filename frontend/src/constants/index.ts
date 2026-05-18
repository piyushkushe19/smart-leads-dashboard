import { LeadStatus, LeadSource, SortOrder } from '@/types';

export const LEAD_STATUS_OPTIONS = Object.values(LeadStatus);
export const LEAD_SOURCE_OPTIONS = Object.values(LeadSource);
export const SORT_OPTIONS = Object.values(SortOrder);

export const STATUS_COLORS: Record<LeadStatus, string> = {
  [LeadStatus.NEW]: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  [LeadStatus.CONTACTED]: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  [LeadStatus.QUALIFIED]: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  [LeadStatus.LOST]: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export const SOURCE_COLORS: Record<LeadSource, string> = {
  [LeadSource.WEBSITE]: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  [LeadSource.INSTAGRAM]: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  [LeadSource.REFERRAL]: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
};

export const ITEMS_PER_PAGE = 10;
export const DEBOUNCE_DELAY = 400;
