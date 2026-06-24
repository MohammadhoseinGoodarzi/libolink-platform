import { useDictionary } from '@repo/i18n';
import { Search } from 'lucide-react-native';
import { useState } from 'react';
import { IconButton } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import { SearchOverlay } from './search-overlay';

// Global header search entry (handoff §6.2): the icon opens the full-screen
// search overlay. Used by every tab's header (Home, Messages, Clubs, Profile).
export function GlobalSearch() {
  const colors = useThemeColors();
  const tCommon = useDictionary('Common');
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton accessibilityLabel={tCommon('search')} onPress={() => setOpen(true)}>
        <Search size={21} color={colors.primary} />
      </IconButton>
      <SearchOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}
