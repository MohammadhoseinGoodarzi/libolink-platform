import { Chip } from './chip';
import type { FilterChipProps } from './types';

// 32px selectable pill (handoff §5): the selectable Chip with an optional trailing
// count. Active = primary fill + white; inactive = secondary fill + green text.
function FilterChip({ label, active = false, count, onPress }: FilterChipProps) {
  return <Chip selectable label={label} active={active} count={count} onPress={onPress} />;
}

export { FilterChip };
