import { createPostApi, type HttpClient, postKeys } from '@repo/api';
import type { CreatePostPayload } from '@repo/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Shared create-post mutation — identical on web and mobile (core law: only the
// rendering differs). On success it invalidates the feed so the new post shows
// up; the calling component owns the UI feedback (toast, closing the sheet).
export function useCreatePost(client: HttpClient) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePostPayload) => createPostApi(client).create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: postKeys.feed() });
    },
  });
}
