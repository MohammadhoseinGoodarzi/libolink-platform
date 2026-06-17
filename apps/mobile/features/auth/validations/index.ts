import { emailSchema, passwordSchema } from '@repo/validators';
import * as v from 'valibot';

// Auth validation is shared — re-export from @repo/validators. The mobile sign-up
// form is richer than the shared SignUpPayload, so its schema is feature-local
// (the existing note sanctions extending here for mobile-only rules).
export {
  type SignInInput,
  type SignUpInput,
  signInSchema,
  signUpSchema,
  valibotResolver,
} from '@repo/validators';

// Mobile sign-up form (handoff §6.1): first/last name, username, email, password
// + confirm, optional referral, terms agreement. use-signup-form maps this to the
// shared SignUpPayload ({ email, username, password }) for the API call.
export const signUpFormSchema = v.pipe(
  v.object({
    firstName: v.pipe(v.string(), v.trim(), v.minLength(1, 'nameRequired')),
    lastName: v.pipe(v.string(), v.trim(), v.minLength(1, 'nameRequired')),
    username: v.pipe(
      v.string(),
      v.trim(),
      v.toLowerCase(),
      v.minLength(3, 'usernameTooShort'),
      v.regex(/^[a-z0-9_.]+$/, 'usernameInvalid'),
    ),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: v.string(),
    referral: v.optional(v.string(), ''),
    agree: v.pipe(
      v.boolean(),
      v.check((value) => value === true, 'mustAgree'),
    ),
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

export type SignUpFormInput = v.InferInput<typeof signUpFormSchema>;
