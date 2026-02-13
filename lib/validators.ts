import { z } from 'zod';

export const SpecSchema = z.object({
  goal: z.string().min(3, 'Goal is required'),
  users: z.string().min(3, 'Users is required'),
  constraints: z.string().min(3, 'Constraints is required'),
  risks: z.string().optional(),
  template: z.string().min(1),
});
