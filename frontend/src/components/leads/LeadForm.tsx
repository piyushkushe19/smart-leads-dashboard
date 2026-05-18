import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { LeadStatus, LeadSource, Lead } from '@/types';
import { LEAD_STATUS_OPTIONS, LEAD_SOURCE_OPTIONS } from '@/constants';

const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  status: z.nativeEnum(LeadStatus).optional(),
  source: z.nativeEnum(LeadSource, { required_error: 'Source is required' }),
});

type LeadFormValues = z.infer<typeof leadSchema>;

interface LeadFormProps {
  lead?: Lead;
  onSubmit: (data: LeadFormValues) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

const statusOptions = LEAD_STATUS_OPTIONS.map((s) => ({ value: s, label: s }));
const sourceOptions = LEAD_SOURCE_OPTIONS.map((s) => ({ value: s, label: s }));

export const LeadForm: React.FC<LeadFormProps> = ({
  lead,
  onSubmit,
  isLoading,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: lead
      ? { name: lead.name, email: lead.email, status: lead.status, source: lead.source }
      : { status: LeadStatus.NEW },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Input
        label="Full Name"
        placeholder="e.g. Rahul Sharma"
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        label="Email Address"
        type="email"
        placeholder="e.g. rahul@example.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Status"
          options={statusOptions}
          error={errors.status?.message}
          {...register('status')}
        />
        <Select
          label="Source"
          placeholder="Select source"
          options={sourceOptions}
          error={errors.source?.message}
          {...register('source')}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {lead ? 'Update Lead' : 'Create Lead'}
        </Button>
      </div>
    </form>
  );
};
