import { useDictionary } from '@repo/i18n';
import { userAtom } from '@repo/stores';
import { getInitials } from '@repo/utils';
import { useAtomValue } from 'jotai';
import { ExternalLink, Mail, Pencil } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Avatar, Card, Text, VerifiedBadge } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import type { AccountCardProps } from '../types';

// Account summary (handoff Settings): the owner's identity + Edit / View Profile.
// Identity comes from the shared session user (@repo/stores).
function AccountCard({ onEdit, onViewProfile }: AccountCardProps) {
  const t = useDictionary('Settings');
  const colors = useThemeColors();
  const user = useAtomValue(userAtom);
  const name = user?.displayName ?? '';

  return (
    <View className="px-4 pt-4">
      <Card className="overflow-hidden">
        <View className="flex-row items-center gap-3.5 p-4">
          <View className="relative">
            <Avatar initials={getInitials(name)} name={name} size={60} />
            {user?.verified ? (
              <View className="-right-1 -bottom-1 absolute rounded-full bg-card p-0.5">
                <VerifiedBadge size={18} />
              </View>
            ) : null}
          </View>
          <View className="min-w-0 flex-1">
            <Text numberOfLines={1} className="font-sans-bold text-[17.5px] text-foreground">
              {name}
            </Text>
            <Text className="mt-0.5 font-sans text-[13px] text-muted-foreground">
              @{user?.username}
            </Text>
            {user?.email ? (
              <View className="mt-1 flex-row items-center gap-1.5">
                <Mail size={13} color={colors.mutedForeground} />
                <Text numberOfLines={1} className="font-sans text-[12.5px] text-muted-foreground">
                  {user.email}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
        <View className="flex-row gap-2.5 px-4 pb-4">
          <Pressable
            accessibilityRole="button"
            onPress={onEdit}
            className="h-[42px] flex-1 flex-row items-center justify-center gap-1.5 rounded-2xl bg-primary"
          >
            <Pencil size={16} color={colors.primaryForeground} />
            <Text className="font-sans-semibold text-[14px] text-primary-foreground">
              {t('editProfile')}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={onViewProfile}
            className="h-[42px] flex-1 flex-row items-center justify-center gap-1.5 rounded-2xl border border-border"
          >
            <ExternalLink size={16} color={colors.primary} />
            <Text className="font-sans-semibold text-[14px] text-primary">{t('viewProfile')}</Text>
          </Pressable>
        </View>
      </Card>
    </View>
  );
}

export { AccountCard };
