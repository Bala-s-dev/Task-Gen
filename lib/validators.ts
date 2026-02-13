import { z } from 'zod';

export const SpecSchema = z.object({
  goal: z.string().min(10, 'Goal is too short'),
  users: z.string().min(5, 'Users field required'),
  constraints: z.string().min(5, 'Constraints required'),
  risks: z.string().optional(),
  template: z.enum(['web', 'mobile', 'internal']),
});
