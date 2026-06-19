import { useCreatePost } from '@repo/hooks';
import { useDictionary } from '@repo/i18n';
import { useState } from 'react';
import { useToast } from '@/shared/components/ui';
import { feedClient } from '../services/feed-service';
import { ComposeSheet } from './compose-sheet';
import { ComposerBar } from './composer-bar';

// Owns the compose flow (handoff §6.2): the pinned bar plus the sheet, wired to
// the shared create-post mutation on the feed's (mock) client.
export function ComposeDock() {
  const t = useDictionary('Home');
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const createPost = useCreatePost(feedClient);

  const submit = (text: string) => {
    createPost.mutate({ content: text }, { onSuccess: () => toast.show(t('posted')) });
  };

  return (
    <>
      <ComposerBar onOpen={() => setOpen(true)} />
      <ComposeSheet open={open} onClose={() => setOpen(false)} onSubmit={submit} />
    </>
  );
}
