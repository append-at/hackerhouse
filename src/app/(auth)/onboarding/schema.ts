import { z } from 'zod';

export const Steps = z.enum(['setup-profile', 'select-topics']);

export type Profile = z.infer<typeof ProfileSchema>;
export const ProfileSchema = z.object({
  firstName: z.string().trim().min(1, 'Please fill out this field'),
  lastName: z.string().trim().min(1, 'Please fill out this field'),
  description: z.string().trim().min(1, 'Please fill out this field'),
});
