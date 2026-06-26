import type { MessageKey } from '@repo/i18n';
import type { BenefitKey } from '@repo/types';
import {
  ArrowLeftRight,
  BadgeCheck,
  Ban,
  Calendar,
  Gift,
  Infinity as InfinityIcon,
  type LucideIcon,
  Zap,
} from 'lucide-react-native';

// Benefit icon keys → lucide icons (handoff Subscription). Falls back to Zap.
export const BENEFIT_ICONS: Record<string, LucideIcon> = {
  infinity: InfinityIcon,
  noads: Ban,
  badge: BadgeCheck,
  gift: Gift,
  zap: Zap,
};

// Early-access chip i18n keys → their leading icon.
export const CHIP_ICONS: Record<string, LucideIcon> = {
  chipEvents: Calendar,
  chipBookSwap: ArrowLeftRight,
};

// Benefit key → its title/description @repo/i18n keys (typed so the dictionary
// lookup stays checked).
export const BENEFIT_COPY: Record<
  BenefitKey,
  { title: MessageKey<'Subscription'>; desc: MessageKey<'Subscription'> }
> = {
  ai: { title: 'benefitAiTitle', desc: 'benefitAiDesc' },
  noads: { title: 'benefitNoadsTitle', desc: 'benefitNoadsDesc' },
  badge: { title: 'benefitBadgeTitle', desc: 'benefitBadgeDesc' },
  gift: { title: 'benefitGiftTitle', desc: 'benefitGiftDesc' },
  early: { title: 'benefitEarlyTitle', desc: 'benefitEarlyDesc' },
};
