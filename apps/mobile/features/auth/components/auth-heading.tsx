import { cn } from '@repo/utils';
import { View } from 'react-native';
import { Text } from '@/shared/components/ui';

type AuthHeadingProps = {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  size?: number;
};

export function AuthHeading({ title, subtitle, align = 'left', size = 28 }: AuthHeadingProps) {
  return (
    <View className={cn('mb-6', align === 'center' && 'items-center')}>
      <Text
        className="font-sans-bold text-foreground"
        style={{ fontSize: size, lineHeight: size * 1.14, letterSpacing: -0.6, textAlign: align }}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          className="mt-2 text-[15px] leading-[22px] text-muted-foreground"
          style={{ textAlign: align }}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
