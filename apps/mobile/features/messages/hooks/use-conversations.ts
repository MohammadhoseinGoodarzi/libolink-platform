import { conversationsQueryOptions } from '@repo/api';
import { useQuery } from '@tanstack/react-query';
import { messagesClient } from '../services/messages-service';

// Feature binding over the shared @repo/api conversations factory, wired to the
// messages (currently mock) HttpClient. Components stay client-agnostic.
export function useConversations() {
  return useQuery(conversationsQueryOptions(messagesClient));
}
