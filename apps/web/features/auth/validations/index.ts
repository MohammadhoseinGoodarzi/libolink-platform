// Auth validation is fully shared — re-export from @repo/validators so the
// feature has a single import surface and can extend later if web-only rules appear.
export {
  type SignInInput,
  type SignUpInput,
  signInSchema,
  signUpSchema,
  valibotResolver,
} from '@repo/validators';
