import { z } from 'zod';

export const usernameSchema = z.string()
  .min(3, 'Username must be at least 3 characters')
  .max(16, 'Username must be at most 16 characters')
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    'Username can only contain letters, numbers, underscores, and hyphens'
  );

export const registrationSchema = z.object({
  username: usernameSchema,
  address: z.string(),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;