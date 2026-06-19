import { useDictionary } from '@repo/i18n';
import {
  Briefcase,
  Building2,
  Calendar,
  Check,
  Eye,
  Gift,
  GraduationCap,
  MapPin,
  MessageCircle,
  Share2,
  Sparkles,
  SquarePen,
  UserPlus,
} from 'lucide-react-native';
import { View } from 'react-native';
import { Avatar, BrandGradient, Button, Text, VerifiedBadge } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import type { ProfileHeroProps } from '../types';

// Cover + identity hero (handoff §6.4): gradient cover with the reader-level
// chip, overlapping avatar with verified badge, name/handle, identity meta, and
// the owner/visitor action row.
function ProfileHero({
  identity,
  mode,
  following,
  onEdit,
  onShare,
  onPreview,
  onFollow,
  onMessage,
  onInvite,
}: ProfileHeroProps) {
  const t = useDictionary('Profile');
  const colors = useThemeColors();
  const owner = mode === 'owner';

  const metaRows = [
    { key: 'profession', Icon: Briefcase, text: identity.profession },
    { key: 'degree', Icon: GraduationCap, text: identity.degree },
    { key: 'university', Icon: Building2, text: identity.university },
    { key: 'location', Icon: MapPin, text: `${identity.city}, ${identity.country}` },
    { key: 'joined', Icon: Calendar, text: `${t('joinedLabel')} ${identity.joined}` },
  ];

  return (
    <View>
      {/* cover — full-bleed gradient, square corners */}
      <BrandGradient className="h-[156px] w-full">
        <View
          className="absolute right-3.5 top-3.5 h-[30px] flex-row items-center gap-1.5 rounded-full px-3"
          style={{ backgroundColor: 'rgba(255,255,255,0.92)' }}
        >
          <Sparkles size={14} color={colors.primary} />
          <Text className="font-sans-bold text-[12.5px]" style={{ color: colors.primary }}>
            {identity.readerLevel}
          </Text>
        </View>
      </BrandGradient>

      {/* avatar overlapping the cover */}
      <View className="px-4" style={{ marginTop: -46 }}>
        <View style={{ width: 96, height: 96 }}>
          <View
            className="rounded-full"
            style={{ borderWidth: 4, borderColor: colors.card, borderRadius: 9999 }}
          >
            <Avatar
              initials={identity.initials}
              hue={identity.hue}
              name={identity.name}
              size={96}
            />
          </View>
          {identity.verified ? (
            <View
              className="absolute items-center justify-center rounded-full bg-card"
              style={{ right: 0, bottom: 4, width: 28, height: 28 }}
            >
              <VerifiedBadge size={22} />
            </View>
          ) : null}
        </View>

        {/* name + handle */}
        <View className="mt-3">
          <Text className="font-sans-bold text-[23px] text-foreground">{identity.name}</Text>
          <Text className="mt-0.5 font-sans text-[14px] text-muted-foreground">
            {identity.handle}
          </Text>
        </View>

        {/* identity meta */}
        <View className="mt-3 flex-row flex-wrap" style={{ rowGap: 8, columnGap: 18 }}>
          {metaRows.map(({ key, Icon, text }) => (
            <View key={key} className="flex-row items-center gap-1.5">
              <Icon size={15} color={colors.mutedForeground} />
              <Text className="font-sans text-[13.5px] text-foreground">{text}</Text>
            </View>
          ))}
        </View>

        {/* social actions */}
        <View className="mt-4 flex-row gap-2">
          {owner ? (
            <>
              <Button variant="default" className="flex-1" onPress={onEdit}>
                <SquarePen size={17} color={colors.primaryForeground} />
                <Text className="font-sans-semibold text-[14.5px] text-primary-foreground">
                  {t('editProfile')}
                </Text>
              </Button>
              <Button
                variant="ghost"
                className="w-11 bg-secondary px-0"
                accessibilityLabel={t('shareProfile')}
                onPress={onShare}
              >
                <Share2 size={19} color={colors.primary} />
              </Button>
              <Button
                variant="ghost"
                className="w-11 bg-secondary px-0"
                accessibilityLabel={t('previewVisitor')}
                onPress={onPreview}
              >
                <Eye size={19} color={colors.primary} />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant={following ? 'outline' : 'destructive'}
                className="flex-1"
                onPress={onFollow}
              >
                {following ? (
                  <Check size={17} color={colors.primary} />
                ) : (
                  // Crimson button → always white icon (text-destructive-foreground).
                  <UserPlus size={17} color="#FFFFFF" />
                )}
                <Text
                  className={
                    following
                      ? 'font-sans-semibold text-[14.5px] text-primary'
                      : 'font-sans-semibold text-[14.5px] text-destructive-foreground'
                  }
                >
                  {following ? t('following') : t('follow')}
                </Text>
              </Button>
              <Button variant="default" className="flex-1" onPress={onMessage}>
                <MessageCircle size={17} color={colors.primaryForeground} />
                <Text className="font-sans-semibold text-[14.5px] text-primary-foreground">
                  {t('message')}
                </Text>
              </Button>
              <Button
                variant="ghost"
                className="w-11 bg-secondary px-0"
                accessibilityLabel={t('shareProfile')}
                onPress={onShare}
              >
                <Share2 size={19} color={colors.primary} />
              </Button>
              <Button
                variant="ghost"
                className="w-11 bg-secondary px-0"
                accessibilityLabel={t('inviteFriend')}
                onPress={onInvite}
              >
                <Gift size={19} color={colors.primary} />
              </Button>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

export { ProfileHero };
