import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, LeadFilters, LeadStatus, LeadSource, SortOrder } from '../types';
import * as leadService from '../services/lead.service';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';

export const createLead = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
    if (!req.user) throw new AppError('Not authenticated', 401);

    const { name, email, status, source } = req.body as {
      name: string;
      email: string;
      status?: string;
      source: string;
    };

    const lead = await leadService.createLead({
      name,
      email,
      status,
      source,
      createdBy: req.user.id,
    });

    return sendSuccess(res, 'Lead created successfully', { lead }, 201);
  }
);

export const getLeads = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
    const query = req.query as Record<string, string>;

    const filters: LeadFilters = {
      status: query.status as LeadStatus | undefined,
      source: query.source as LeadSource | undefined,
      search: query.search,
      sort: query.sort as SortOrder | undefined,
      page: query.page ? parseInt(query.page, 10) : 1,
      limit: query.limit ? parseInt(query.limit, 10) : 10,
    };

    const result = await leadService.getLeads(filters);

    return sendSuccess(res, 'Leads retrieved successfully', result);
  }
);

export const getLeadById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
    const lead = await leadService.getLeadById(req.params.id);
    return sendSuccess(res, 'Lead retrieved successfully', { lead });
  }
);

export const updateLead = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
    const { name, email, status, source } = req.body as {
      name?: string;
      email?: string;
      status?: string;
      source?: string;
    };

    const lead = await leadService.updateLead(req.params.id, {
      name,
      email,
      status,
      source,
    });

    return sendSuccess(res, 'Lead updated successfully', { lead });
  }
);

export const deleteLead = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
    await leadService.deleteLead(req.params.id);
    return sendSuccess(res, 'Lead deleted successfully');
  }
);

export const exportCsv = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
    const query = req.query as Record<string, string>;

    const filters: LeadFilters = {
      status: query.status as LeadStatus | undefined,
      source: query.source as LeadSource | undefined,
      search: query.search,
      sort: query.sort as SortOrder | undefined,
    };

    const csv = await leadService.exportLeadsCsv(filters);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
    res.status(200).send(csv);
  }
);

export const getStats = asyncHandler(
  async (_req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
    const stats = await leadService.getLeadStats();
    return sendSuccess(res, 'Stats retrieved successfully', { stats });
  }
);
