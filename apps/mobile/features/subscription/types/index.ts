// View-only types for the Subscription screen (handoff Subscription). Domain
// shapes (PremiumOffer, SubscriptionPlan, …) live in @repo/types.
import type { PlanKey, PremiumBenefit, PremiumComparisonRow, SubscriptionPlan } from '@repo/types';

export type SectionHeadProps = {
  overline: string;
  title: string;
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
