import { createPostApi, type HttpClient, postKeys } from '@repo/api';
import type { ToggleLikeInput } from '@repo/types';
import { type CreatePostInput, createPostSchema } from '@repo/validators';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { parse } from 'valibot';

export function usePostActions(client: HttpClient) {
  const queryClient = useQueryClient();
  const api = createPostApi(client);

  const createPost = useMutation({
    // The shared hook revalidates input so every caller gets the same
    // guarantees as the form layer, regardless of platform.
    mutationFn: (input: CreatePostInput) => api.create(parse(createPostSchema, input)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: postKeys.feed() }),
  });

  const toggleLike = useMutation({
    mutationFn: ({ postId, liked }: ToggleLikeInput) =>
      liked ? api.unlike(postId) : api.like(postId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: postKeys.all }),
  });

  return { createPost, toggleLike };
}
