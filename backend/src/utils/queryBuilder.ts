import { FilterQuery } from 'mongoose';
import { ILeadDocument } from '../models/Lead';
import { LeadFilters, LeadStatus, LeadSource, SortOrder } from '../types';

export interface QueryResult {
  filter: FilterQuery<ILeadDocument>;
  sort: Record<string, 1 | -1>;
  skip: number;
  limit: number;
  page: number;
}

export const buildLeadQuery = (filters: LeadFilters): QueryResult => {
  const filter: FilterQuery<ILeadDocument> = {};
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(100, Math.max(1, filters.limit ?? 10));
  const skip = (page - 1) * limit;

  if (filters.status && Object.values(LeadStatus).includes(filters.status)) {
    filter.status = filters.status;
  }

  if (filters.source && Object.values(LeadSource).includes(filters.source)) {
    filter.source = filters.source;
  }

  if (filters.search && filters.search.trim()) {
    const searchRegex = new RegExp(filters.search.trim(), 'i');
    filter.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  const sort: Record<string, 1 | -1> =
    filters.sort === SortOrder.OLDEST
      ? { createdAt: 1 }
      : { createdAt: -1 };

  return { filter, sort, skip, limit, page };
};
