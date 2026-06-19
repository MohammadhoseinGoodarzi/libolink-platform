import { useDictionary } from '@repo/i18n';
import type { ProfileStatKey } from '@repo/types';
import { Fragment } from 'react';
import { View } from 'react-native';
import { Avatar, Card, Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import type { FollowCountsProps } from '../types';

// Social-stat card (handoff §6.4): Books · Followers · Following with a
// social-proof row ("Followed by Amara, James +1.2k"). Display-only here.
function FollowCounts({ stats, socialProof }: FollowCountsProps) {
  const t = useDictionary('Profile');
  const colors = useThemeColors();
  const valueFor = (key: ProfileStatKey) => stats.find((s) => s.key === key)?.value ?? '0';

  const columns = [
    { key: 'read', label: t('statBooksShort'), value: valueFor('read') },
    { key: 'followers', label: t('statFollowersShort'), value: valueFor('followers') },
    { key: 'following', label: t('statFollowingShort'), value: valueFor('following') },
  ];

  return (
    <View className="px-4 pt-4">
      <Card className="overflow-hidden">
        <View className="flex-row items-center px-1 py-3">
          {columns.map((c, i) => (
            <Fragment key={c.key}>
              {i > 0 ? <View className="h-[30px] w-px bg-border" /> : null}
              <View className="flex-1 items-center gap-0.5 py-0.5">
                <Text className="font-sans-bold text-[21px] text-foreground">{c.value}</Text>
                <Text className="font-sans-semibold text-[10.5px] uppercase tracking-wide text-muted-foreground">
                  {c.label}
                </Text>
              </View>
            </Fragment>
          ))}
        </View>

        <View className="flex-row items-center gap-2.5 border-border border-t px-4 py-2.5">
          <View className="flex-row">
            {socialProof.people.map((p, i) => (
              <View
                key={`${p.initials}-${i}`}
                className="rounded-full"
                style={{
                  marginLeft: i > 0 ? -8 : 0,
                  borderWidth: 2,
                  borderColor: colors.card,
                  borderRadius: 9999,
                }}
              >
                <Avatar initials={p.initials} hue={p.hue} size={22} />
              </View>
            ))}
          </View>
          <Text className="flex-1 font-sans text-[12.5px] text-muted-foreground">
            {t('followedBy')}{' '}
            {socialProof.names.map((n, i) => (
              <Text key={n} className="font-sans-semibold text-foreground">
                {i > 0 ? ', ' : ''}
                {n}
              </Text>
            ))}
            {socialProof.othersLabel ? ` +${socialProof.othersLabel}` : ''}
          </Text>
        </View>
      </Card>
    </View>
  );
}

export { FollowCounts };
