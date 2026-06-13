import type { SignInPayload } from '@repo/types';
import * as v from 'valibot';
import { emailSchema, passwordSchema } from './common';

export const signInSchema = v.object({
  email: emailSchema,
  password: passwordSchema,
}) satisfies v.GenericSchema<SignInPayload>;

export type SignInInput = v.InferOutput<typeof signInSchema>;

export const signUpSchema = v.pipe(
  v.object({
    email: emailSchema,
    username: v.pipe(v.string(), v.trim(), v.minLength(3, 'usernameTooShort')),
    password: passwordSchema,
    confirmPassword: v.string(),
  }),
  v.forward(
    v.partialCheck(
      [['password'], ['confirmPassword']],
      (input) => input.password === input.confirmPassword,
      'passwordsDoNotMatch',
    ),
    ['confirmPassword'],
  ),
);

export type SignUpInput = v.InferOutput<typeof signUpSchema>;
