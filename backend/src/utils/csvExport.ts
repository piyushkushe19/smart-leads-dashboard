import { ILeadDocument } from '../models/Lead';

export const generateCsv = (leads: ILeadDocument[]): string => {
  const headers = ['Name', 'Email', 'Status', 'Source', 'Created At'];

  const rows = leads.map((lead) => [
    `"${lead.name.replace(/"/g, '""')}"`,
    `"${lead.email.replace(/"/g, '""')}"`,
    `"${lead.status}"`,
    `"${lead.source}"`,
    `"${new Date(lead.createdAt).toISOString()}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

  return csvContent;
};
