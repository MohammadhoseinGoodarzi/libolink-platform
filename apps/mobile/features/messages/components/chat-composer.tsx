import { useDictionary } from '@repo/i18n';
import { cn } from '@repo/utils';
import { Send } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/shared/theme';

// Chat composer (handoff §6.3): pill text field + crimson send. Attachment /
// camera / voice and the share-in-chat sheet land in phase-2.
export function ChatComposer({ onSend }: { onSend: (text: string) => void }) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const t = useDictionary('Messages');
  const [text, setText] = useState('');
  const canSend = text.trim().length > 0;

  const submit = () => {
    const value = text.trim();
    if (!value) {
      return;
    }
    onSend(value);
    setText('');
  };

  return (
    <View style={{ paddingBottom: insets.bottom }} className="border-border border-t bg-card">
      <View className="flex-row items-end gap-2 px-3 py-2">
        <View className="min-h-[40px] flex-1 justify-center rounded-[20px] border border-border bg-background px-4">
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder={t('composerPlaceholder')}
            placeholderTextColor={colors.mutedForeground}
            multiline
            className="max-h-24 py-2 font-sans text-[15px] text-foreground"
          />
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('send')}
          disabled={!canSend}
          onPress={submit}
          className={cn(
            'h-10 w-10 items-center justify-center rounded-full bg-destructive active:opacity-80',
            !canSend && 'opacity-60',
          )}
        >
          <Send size={19} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}
