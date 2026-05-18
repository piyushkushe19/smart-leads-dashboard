import { Lead, ILeadDocument } from '../models/Lead';
import { AppError } from '../utils/AppError';
import { LeadFilters, PaginatedResponse, PaginationMeta } from '../types';
import { buildLeadQuery } from '../utils/queryBuilder';
import { generateCsv } from '../utils/csvExport';

interface CreateLeadInput {
  name: string;
  email: string;
  status?: string;
  source: string;
  createdBy: string;
}

interface UpdateLeadInput {
  name?: string;
  email?: string;
  status?: string;
  source?: string;
}

export const createLead = async (input: CreateLeadInput): Promise<ILeadDocument> => {
  const lead = await Lead.create({
    name: input.name,
    email: input.email.toLowerCase(),
    status: input.status,
    source: input.source,
    createdBy: input.createdBy,
  });
  return lead.populate('createdBy', 'name email');
};

export const getLeads = async (
  filters: LeadFilters
): Promise<PaginatedResponse<ILeadDocument>> => {
  const { filter, sort, skip, limit, page } = buildLeadQuery(filters);

  const [leads, total] = await Promise.all([
    Lead.find(filter)
      .populate('createdBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Lead.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  const pagination: PaginationMeta = {
    total,
    page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };

  return { items: leads as unknown as ILeadDocument[], pagination };
};

export const getLeadById = async (id: string): Promise<ILeadDocument> => {
  const lead = await Lead.findById(id).populate('createdBy', 'name email');
  if (!lead) {
    throw new AppError('Lead not found', 404);
  }
  return lead;
};

export const updateLead = async (
  id: string,
  input: UpdateLeadInput
): Promise<ILeadDocument> => {
  const lead = await Lead.findByIdAndUpdate(
    id,
    { $set: input },
    { new: true, runValidators: true }
  ).populate('createdBy', 'name email');

  if (!lead) {
    throw new AppError('Lead not found', 404);
  }

  return lead;
};

export const deleteLead = async (id: string): Promise<void> => {
  const lead = await Lead.findByIdAndDelete(id);
  if (!lead) {
    throw new AppError('Lead not found', 404);
  }
};

export const exportLeadsCsv = async (filters: LeadFilters): Promise<string> => {
  const { filter, sort } = buildLeadQuery({ ...filters, limit: 10000, page: 1 });

  const leads = await Lead.find(filter).sort(sort).lean();
  return generateCsv(leads as unknown as ILeadDocument[]);
};

export const getLeadStats = async (): Promise<Record<string, unknown>> => {
  const [statusStats, sourceStats, total] = await Promise.all([
    Lead.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Lead.aggregate([{ $group: { _id: '$source', count: { $sum: 1 } } }]),
    Lead.countDocuments(),
  ]);

  return {
    total,
    byStatus: statusStats.reduce((acc: Record<string, number>, item: { _id: string; count: number }) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
    bySource: sourceStats.reduce((acc: Record<string, number>, item: { _id: string; count: number }) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
  };
};
