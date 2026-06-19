import { BookOpen } from 'lucide-react-native';
import { Text } from '@/shared/components/ui';
import { CLUB_FOIL, CLUB_ICONS } from '../constants';
import type { ClubLogoProps } from '../types';
import { TonedGradient } from './toned-gradient';

// Rounded-square gradient logo tile (handoff §6.5) — communities are squares,
// people are round. Shows an icon when given, otherwise the monogram.
function ClubLogo({ label, icon, tone, size = 48, radius = 14 }: ClubLogoProps) {
  // Match the CLUB_ICONS contract: an unmapped icon key still shows the default
  // icon, never the monogram.
  const Icon = icon ? (CLUB_ICONS[icon] ?? BookOpen) : undefined;
  return (
    <TonedGradient
      tone={tone}
      className="items-center justify-center"
      style={{ width: size, height: size, borderRadius: radius }}
    >
      {Icon ? (
        <Icon size={size * 0.42} color={CLUB_FOIL} />
      ) : (
        <Text className="font-sans-bold" style={{ color: CLUB_FOIL, fontSize: size * 0.33 }}>
          {label}
        </Text>
      )}
    </TonedGradient>
  );
}

export { ClubLogo };
