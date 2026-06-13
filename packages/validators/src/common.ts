import * as v from 'valibot';

// Validation messages are @repo/i18n keys; the consuming UI translates them
// inside the matching namespace (Auth, Home, Common).
export const idSchema = v.pipe(v.string(), v.nonEmpty('required'));

export const emailSchema = v.pipe(v.string(), v.trim(), v.email('invalidEmail'));

export const passwordSchema = v.pipe(v.string(), v.minLength(8, 'passwordTooShort'));

export const paginationQuerySchema = v.object({
  page: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1)), 1),
  pageSize: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(100)), 20),
});

export type PaginationQuery = v.InferOutput<typeof paginationQuerySchema>;
