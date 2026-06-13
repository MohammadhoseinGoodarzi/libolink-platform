import type { CreatePostPayload } from '@repo/types';
import * as v from 'valibot';

export const createPostSchema = v.object({
  content: v.pipe(v.string(), v.trim(), v.nonEmpty('postEmpty'), v.maxLength(500, 'postTooLong')),
  imageUrl: v.optional(v.pipe(v.string(), v.url('invalidImageUrl'))),
}) satisfies v.GenericSchema<CreatePostPayload>;

export type CreatePostInput = v.InferOutput<typeof createPostSchema>;
