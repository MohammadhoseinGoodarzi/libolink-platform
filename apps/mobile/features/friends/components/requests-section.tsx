import { useDictionary } from '@repo/i18n';
import { ChevronDown, ChevronRight, UserCheck, UserPlus } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Avatar, Card, Text, useToast } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import type { RequestsSectionProps } from '../types';

// Reader Requests (handoff Friends): a collapsible banner of incoming connection
// requests with Accept / Decline. Resolution is a local toggle (the real respond
// mutation lands with the backend).
function RequestsSection({ requests }: RequestsSectionProps) {
  const t = useDictionary('Friends');
  const colors = useThemeColors();
  const toast = useToast();
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState(false);

  const incoming = requests.filter((r) => !done[r.id]);
  if (incoming.length === 0) {
    return null;
  }

  const resolve = (id: string, message: string) => {
    setDone((d) => ({ ...d, [id]: true }));
    toast.show(message);
  };

  return (
    <View className="px-5 pt-3.5">
      <Card variant="flat" className="overflow-hidden">
        <Pressable
          accessibilityRole="button"
          onPress={() => setOpen((o) => !o)}
          className="flex-row items-center gap-3 p-3.5"
        >
          <View className="h-11 w-11 items-center justify-center rounded-2xl bg-destructive">
            <UserPlus size={22} color={colors.destructiveForeground} />
          </View>
          <View className="min-w-0 flex-1">
            <View className="flex-row items-center gap-2">
              <Text className="font-sans-bold text-[15.5px] text-foreground">
                {t('requestsTitle')}
              </Text>
              <View className="h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5">
                <Text className="font-sans-bold text-[11px] text-destructive-foreground">
                  {incoming.length}
                </Text>
              </View>
            </View>
            <Text
              numberOfLines={1}
              className="mt-0.5 font-sans text-[12.5px] text-muted-foreground"
            >
              {incoming.map((r) => r.name.split(' ')[0]).join(', ')} {t('wantToConnect')}
            </Text>
          </View>
          {open ? (
            <ChevronDown size={18} color={colors.mutedForeground} />
          ) : (
            <ChevronRight size={18} color={colors.mutedForeground} />
          )}
        </Pressable>

        {open ? (
          <View className="border-border border-t px-3.5 pt-1 pb-3.5">
            {incoming.map((reader) => (
              <View key={reader.id} className="pt-3">
                <View className="flex-row items-center gap-3">
                  <Avatar initials={reader.initials} hue={reader.hue} size={46} />
                  <View className="min-w-0 flex-1">
                    <Text className="font-sans-bold text-[14.5px] text-foreground">
                      {reader.name}
                    </Text>
                    <Text className="mt-0.5 font-sans text-[12px] text-muted-foreground">
                      {reader.role}
                    </Text>
                  </View>
                </View>
                <View className="mt-3 flex-row gap-2.5">
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => resolve(reader.id, `${reader.name} ${t('nowCompanions')}`)}
                    className="h-10 flex-1 flex-row items-center justify-center gap-1.5 rounded-full bg-destructive"
                  >
                    <UserCheck size={16} color={colors.destructiveForeground} />
                    <Text className="font-sans-bold text-[13.5px] text-destructive-foreground">
                      {t('accept')}
                    </Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => resolve(reader.id, t('requestDeclined'))}
                    className="h-10 flex-1 items-center justify-center rounded-full border border-border"
                  >
                    <Text className="font-sans-semibold text-[13.5px] text-primary">
                      {t('decline')}
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        ) : null}
      </Card>
    </View>
  );
}

export { RequestsSection };
