import { BadgeCheck, Bookmark, Heart, MessageCircle, Sparkles, Star } from 'lucide-react-native';
import { View } from 'react-native';
import { Avatar, BookCover, BrandGradient, Text } from '@/shared/components/ui';
import { useShadow, useThemeColors } from '@/shared/theme';

const GOLD = '#C9A227';

function Stars() {
  return (
    <View className="flex-row gap-0.5">
      {(['a', 'b', 'c', 'd', 'e'] as const).map((id) => (
        <Star key={id} size={9} color={GOLD} fill={GOLD} />
      ))}
    </View>
  );
}

// Illustrative preview of the social experience (handoff §6.1 Welcome). Sample
// content is decorative mock data, not localized chrome.
export function WelcomeHero() {
  const colors = useThemeColors();
  const lifted = useShadow('lifted');

  return (
    <View className="h-[300px] items-center justify-center">
      <View style={{ width: 320, height: 290 }}>
        {/* tilted cover peeking behind */}
        <View style={{ position: 'absolute', right: 8, top: 2, transform: [{ rotate: '9deg' }] }}>
          <BookCover
            title="One Hundred Years of Solitude"
            author="G. García Márquez"
            width={62}
            tone={5}
          />
        </View>

        {/* main post card */}
        <View
          style={[{ position: 'absolute', left: 18, top: 44, width: 244 }, lifted]}
          className="rounded-lg border border-border bg-card p-3"
        >
          <View className="flex-row items-center gap-2.5">
            <Avatar initials="SA" hue={24} size={34} />
            <View className="flex-1">
              <View className="flex-row items-center gap-1">
                <Text className="font-sans-bold text-[13px] text-card-foreground">Sara Amini</Text>
                <BadgeCheck size={12} color={colors.primary} />
              </View>
              <Text className="text-[11px] text-muted-foreground">@sara.reads · 2h</Text>
            </View>
            <View className="h-[26px] items-center justify-center rounded-full bg-primary px-3">
              <Text className="font-sans-bold text-[11px] text-primary-foreground">Follow</Text>
            </View>
          </View>

          <Text className="my-2.5 text-[12.5px] leading-[18px] text-card-foreground">
            Finished <Text className="font-sans-bold">Pachinko</Text> in one sitting — devastating
            and luminous. ✨
          </Text>

          <View className="flex-row items-center gap-2.5 rounded-xl bg-secondary p-2">
            <BookCover title="Pachinko" author="Min Jin Lee" width={34} tone={0} />
            <View className="flex-1">
              <Text className="font-sans-bold text-[11.5px] text-card-foreground" numberOfLines={1}>
                Pachinko
              </Text>
              <Text className="mb-1 text-[10.5px] text-muted-foreground">Min Jin Lee</Text>
              <Stars />
            </View>
          </View>

          <View className="mt-2.5 flex-row items-center gap-4">
            <View className="flex-row items-center gap-1.5">
              <Heart size={14} color={colors.destructive} fill={colors.destructive} />
              <Text className="font-sans-semibold text-[11.5px] text-muted-foreground">1.2k</Text>
            </View>
            <View className="flex-row items-center gap-1.5">
              <MessageCircle size={14} color={colors.mutedForeground} />
              <Text className="font-sans-semibold text-[11.5px] text-muted-foreground">86</Text>
            </View>
            <Bookmark size={14} color={colors.mutedForeground} />
          </View>
        </View>

        {/* now-reading chip */}
        <View
          style={[{ position: 'absolute', left: 0, top: 0, width: 168 }, lifted]}
          className="flex-row items-center gap-2.5 rounded-2xl border border-border bg-card px-3 py-2"
        >
          <Avatar initials="MK" hue={158} size={28} />
          <View className="flex-1">
            <Text className="font-sans-bold text-[11px] text-card-foreground">Now reading</Text>
            <View className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
              <View className="h-full rounded-full bg-primary" style={{ width: '62%' }} />
            </View>
          </View>
          <Text className="font-sans-bold text-[10.5px] text-primary">62%</Text>
        </View>

        {/* community chip */}
        <View
          style={[{ position: 'absolute', right: 4, bottom: 6 }, lifted]}
          className="flex-row items-center gap-2.5 rounded-2xl border border-border bg-card py-2 pl-2.5 pr-3"
        >
          <View className="flex-row">
            {[
              { id: 'rz', hue: 250 },
              { id: 'lx', hue: 200 },
              { id: 'na', hue: 320 },
            ].map((a, i) => (
              <View key={a.id} style={{ marginLeft: i ? -10 : 0 }}>
                <Avatar initials={a.id.toUpperCase()} hue={a.hue} size={24} />
              </View>
            ))}
          </View>
          <View>
            <Text className="font-sans-bold text-[11px] text-card-foreground">Magical Realism</Text>
            <Text className="text-[10px] text-muted-foreground">book club · 1.2k</Text>
          </View>
        </View>

        {/* sparkle badge */}
        <BrandGradient
          style={{ position: 'absolute', left: 2, top: 150 }}
          className="h-9 w-9 items-center justify-center rounded-full"
        >
          <Sparkles size={18} color="#FFFFFF" />
        </BrandGradient>
      </View>
    </View>
  );
}
