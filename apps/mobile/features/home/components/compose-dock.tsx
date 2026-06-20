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
  const tCommon = useDictionary('Common');
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const createPost = useCreatePost(feedClient);

  // Await the mutation so the sheet can keep the draft open on failure.
  const submit = async (text: string): Promise<boolean> => {
    try {
      await createPost.mutateAsync({ content: text });
      toast.show(t('posted'));
      return true;
    } catch {
      toast.show(tCommon('genericError'));
      return false;
    }
  };

  return (
    <>
      <ComposerBar onOpen={() => setOpen(true)} />
      <ComposeSheet open={open} onClose={() => setOpen(false)} onSubmit={submit} />
    </>
  );
}
