// Premium / Subscription (handoff Subscription) — the membership offer surfaced
// on the subscription landing page. Structure is shared; all user-visible copy
// lives in @repo/i18n (keyed by the keys below), and each app maps icon keys to
// its own icon set.

export type PlanKey = 'annual' | 'monthly';

export interface SubscriptionPlan {
  key: PlanKey;
  /** Headline price per month, in whole dollars. */
  price: number;
  /** Total yearly charge for the annual plan; null when billed monthly. */
  billedYearly: number | null;
  /** The recommended plan (carries the BEST VALUE tag + strike-through). */
  best: boolean;
}

export type BenefitKey = 'ai' | 'noads' | 'badge' | 'gift' | 'early';

export interface PremiumBenefit {
  key: BenefitKey;
  /** Icon key, mapped to a lucide icon per app. */
  icon: string;
  /** Show the green verified seal beside the title. */
  verified: boolean;
  /** Show the "Members only" tag. */
  membersOnly: boolean;
  /** Early-access feature chips, as @repo/i18n keys. */
  chips: string[];
}

// A comparison cell: a flag, or a graded value ("limited"/"unlimited" for the AI row).
export type ComparisonValue = boolean | 'limited' | 'unlimited';

export interface PremiumComparisonRow {
  /** Row label as an @repo/i18n key. */
  key: string;
  free: ComparisonValue;
  pro: ComparisonValue;
}

export interface PremiumOffer {
  plans: SubscriptionPlan[];
  benefits: PremiumBenefit[];
  comparison: PremiumComparisonRow[];
}
