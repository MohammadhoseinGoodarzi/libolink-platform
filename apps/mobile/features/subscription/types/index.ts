// View-only types for the Subscription screen (handoff Subscription). Domain
// shapes (PremiumOffer, SubscriptionPlan, …) live in @repo/types.
import type { PlanKey, PremiumBenefit, PremiumComparisonRow, SubscriptionPlan } from '@repo/types';

export type SectionHeadProps = {
  overline: string;
  title: string;
};

export type PremiumHeroProps = {
  // The headline (annual) per-month price and the standard monthly rate it
  // compares against — both from the shared offer so the hero stays in sync.
  price: number;
  compareAt: number | null;
};

export type PlanSelectorProps = {
  plans: SubscriptionPlan[];
  selected: PlanKey;
  onSelect: (key: PlanKey) => void;
};

export type BenefitCardProps = {
  benefit: PremiumBenefit;
};

export type CompareTableProps = {
  rows: PremiumComparisonRow[];
};

export type CheckoutSheetProps = {
  open: boolean;
  onClose: () => void;
  plan: SubscriptionPlan;
  onConfirm: () => void;
};
