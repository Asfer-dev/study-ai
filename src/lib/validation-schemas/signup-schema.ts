import { z } from 'zod';

export const signupSchema = z
  .object({
    firstName: z.string().min(2, {
      message: 'First name must be at least 2 characters.',
    }),
    lastName: z.string().min(2, {
      message: 'Last name must be at least 2 characters.',
    }),
    email: z.string().email({
      message: 'Invalid email address.',
    }),
    password: z.string().min(4, {
      message: 'Password must be at least 4 characters.',
    }),
    confirmPassword: z.string().min(4, {
      message: 'Confirm password must be at least 4 characters.',
    }),
    role: z.enum(['teacher', 'student'], {
      errorMap: () => ({ message: 'Role must be either teacher or student.' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
