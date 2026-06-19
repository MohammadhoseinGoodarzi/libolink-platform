import { View } from 'react-native';
import { CLUB_ICONS } from '../constants';
import type { ClubBannerProps } from '../types';
import { TonedGradient } from './toned-gradient';

// Gradient banner with an optional ghosted icon watermark (handoff §6.5) — used
// for series posters and the sponsored card. Children render on top.
function ClubBanner({ tone, icon, height, radius = 0, children }: ClubBannerProps) {
  const Icon = icon ? CLUB_ICONS[icon] : undefined;
  return (
    <TonedGradient tone={tone} className="w-full" style={{ height, borderRadius: radius }}>
      {Icon ? (
        <View className="absolute" style={{ right: -6, bottom: -12 }}>
          <Icon size={height * 0.7} color="rgba(255,255,255,0.12)" />
        </View>
      ) : null}
      {children}
    </TonedGradient>
  );
}

export { ClubBanner };
