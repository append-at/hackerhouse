import { z } from 'zod';

export type OnboardingStep = z.infer<typeof Steps>;
export const Steps = z.enum(['setup-profile', 'select-topics']);

export type Profile = z.infer<typeof ProfileSchema>;
export const ProfileSchema = z.object({
  id: z.string(), // Supabase user id
  firstName: z.string().trim().min(1, 'Please fill out this field'),
  lastName: z.string().trim().min(1, 'Please fill out this field'),
  bio: z.string().trim().min(1, 'Please fill out this field'),
  avatarUrl: z.string().url(),
  username: z.string(),
});

export type Topics = z.infer<typeof TopicsSchema>;
export const TopicsSchema = z.object({
  topics: z.array(z.string()).min(1, 'Please select at least one topic'),
});
