import { useDictionary } from '@repo/i18n';
import { useRouter } from 'expo-router';
import { Eye } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { BrandLogo } from '@/shared/components/brand-logo';
import { Button, Text, useToast } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { useThemeColors } from '@/shared/theme';
import { useProfile } from '../hooks/use-profile';
import type { ProfileMode } from '../types';
import { BioSection } from './bio-section';
import { FavoritesSection } from './favorites-section';
import { FollowCounts } from './follow-counts';
import { LibrarySection } from './library-section';
import { ProfileHero } from './profile-hero';
import { ReadingJourney } from './reading-journey';
import { ReadingLifeSection } from './reading-life-section';
import { StatsSection } from './stats-section';
import { WriterSection } from './writer-section';

// Profile screen orchestrator (handoff §6.4): loads the reader profile via the
// shared @repo/api factory and stacks the read-surface sections. Owns the
// owner⇄visitor preview mode and the follow state; deeper actions (edit, share,
// invite, see-all, per-card nav) are profile phase-2 and acknowledge taps.
export function ProfileView() {
  const t = useDictionary('Profile');
  const tCommon = useDictionary('Common');
  const colors = useThemeColors();
  const router = useRouter();
  const toast = useToast();
  const { data, isLoading, isError, refetch } = useProfile();
  const [mode, setMode] = useState<ProfileMode>('owner');
  const [following, setFollowing] = useState(false);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-background px-8">
        <Text className="text-center font-sans text-[14px] text-muted-foreground">
          {tCommon('genericError')}
        </Text>
        <Button variant="outline" size="sm" onPress={() => void refetch()}>
          {tCommon('retry')}
        </Button>
      </View>
    );
  }

  const profile = data;
  const owner = mode === 'owner';
  const comingSoon = () => toast.show(tCommon('comingSoon'));

  return (
    <View className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-6">
        <ProfileHero
          identity={profile.identity}
          mode={mode}
          following={following}
          onEdit={comingSoon}
          onShare={comingSoon}
          onPreview={() => {
            setMode('visitor');
            toast.show(t('previewVisitor'));
          }}
          onFollow={() => setFollowing((f) => !f)}
          onMessage={() => router.push(ROUTES.messages)}
          onInvite={comingSoon}
        />
        <FollowCounts stats={profile.stats} socialProof={profile.socialProof} />
        <BioSection identity={profile.identity} />
        <FavoritesSection favorites={profile.favorites} genres={profile.identity.genres} />
        <StatsSection stats={profile.stats} />
        <ReadingJourney
          currentlyReading={profile.currentlyReading}
          upNext={profile.upNext}
          recentlyFinished={profile.recentlyFinished}
        />
        <LibrarySection shelves={profile.shelves} />
        <WriterSection writer={profile.writer} />
        <ReadingLifeSection readingLife={profile.readingLife} />

        <View className="items-center gap-1.5 px-6 pt-7 pb-2">
          <BrandLogo height={18} />
          <Text className="font-sans text-[11.5px] text-muted-foreground">
            {t('readingSince')} {profile.identity.joined}
          </Text>
        </View>
      </ScrollView>

      {/* visitor-preview banner */}
      {owner ? null : (
        <View
          className="flex-row items-center gap-2.5 px-4 py-3"
          style={{ backgroundColor: colors.foreground }}
        >
          <Eye size={17} color={colors.background} />
          <Text
            className="flex-1 font-sans-semibold text-[13px]"
            style={{ color: colors.background }}
          >
            {t('viewingAsVisitor')}
          </Text>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full bg-background px-3.5"
            onPress={() => setMode('owner')}
          >
            <Text className="font-sans-bold text-[12.5px]" style={{ color: colors.foreground }}>
              {t('exit')}
            </Text>
          </Button>
        </View>
      )}
    </View>
  );
}
