import { z } from 'zod';

export type Profile = z.infer<typeof ProfileSchema>;
export const ProfileSchema = z.object({
  name: z.string().min(1, 'Please fill out this field'),
  bio: z.string().min(1, 'Please fill out this field'),
  topics: z.array(z.string()).min(1, 'Please select at least one topic'),
});
