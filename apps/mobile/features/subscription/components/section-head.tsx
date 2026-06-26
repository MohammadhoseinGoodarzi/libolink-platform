import { View } from 'react-native';
import { Text } from '@/shared/components/ui';
import type { SectionHeadProps } from '../types';

// Section heading (handoff Subscription): a brand-green overline + large title.
function SectionHead({ overline, title }: SectionHeadProps) {
  return (
    <View className="px-5 pt-6 pb-0.5">
      <Text
        className="font-sans-bold text-[11.5px] text-primary/60 uppercase"
        style={{ letterSpacing: 1.2 }}
      >
        {overline}
      </Text>
      <Text
        className="mt-1 font-sans-bold text-[22px] text-foreground"
        style={{ letterSpacing: -0.5 }}
      >
        {title}
      </Text>
    </View>
  );
}

export { SectionHead };
