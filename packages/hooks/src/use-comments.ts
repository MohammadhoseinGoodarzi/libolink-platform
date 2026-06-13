import { commentsQueryOptions, createPostApi, type HttpClient, postKeys } from '@repo/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useComments(client: HttpClient, postId: string) {
  const queryClient = useQueryClient();
  const comments = useQuery(commentsQueryOptions(client, postId));

  const addComment = useMutation({
    mutationFn: (content: string) => createPostApi(client).addComment({ postId, content }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: postKeys.comments(postId) }),
  });

  return { comments, addComment };
}
