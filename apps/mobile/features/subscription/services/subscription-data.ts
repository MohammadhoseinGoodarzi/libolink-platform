import type { PremiumOffer } from '@repo/types';

// Offline premium offer (handoff Subscription). Structure only — every label is
// resolved from @repo/i18n in the UI. Annual is the default (best value).
export const PREMIUM_OFFER: PremiumOffer = {
  plans: [
    { key: 'annual', price: 8, billedYearly: 96, best: true },
    { key: 'monthly', price: 10, billedYearly: null, best: false },
  ],
  benefits: [
    { key: 'ai', icon: 'infinity', verified: false, membersOnly: false, chips: [] },
    { key: 'noads', icon: 'noads', verified: false, membersOnly: true, chips: [] },
    { key: 'badge', icon: 'badge', verified: true, membersOnly: false, chips: [] },
    { key: 'gift', icon: 'gift', verified: false, membersOnly: true, chips: [] },
    {
      key: 'early',
      icon: 'zap',
      verified: false,
      membersOnly: false,
      chips: ['chipEvents', 'chipBookSwap'],
    },
  ],
  comparison: [
    { key: 'compareAi', free: 'limited', pro: 'unlimited' },
    { key: 'compareAds', free: false, pro: true },
    { key: 'compareBadge', free: false, pro: true },
    { key: 'compareGiveaway', free: false, pro: true },
    { key: 'compareEarly', free: false, pro: true },
    { key: 'compareCore', free: true, pro: true },
  ],
};
