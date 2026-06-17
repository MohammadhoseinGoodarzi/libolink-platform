import { type MessageKey, useDictionary } from '@repo/i18n';
import { cn } from '@repo/utils';
import { Check } from 'lucide-react-native';
import { View } from 'react-native';
import { Text } from '@/shared/components/ui';
import { oklchToHex, useThemeColors } from '@/shared/theme';

const SUCCESS = oklchToHex(0.6, 0.15, 150);

// 0–4 score: length, mixed case, number, symbol (handoff auth kit).
export function pwStrength(password: string): number {
  let score = 0;
  if (password.length >= 8) {
    score += 1;
  }
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) {
    score += 1;
  }
  if (/[0-9]/.test(password)) {
    score += 1;
  }
  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  }
  return Math.min(score, 4);
}

const LABEL_KEYS: MessageKey<'Auth'>[] = ['pwTooWeak', 'pwWeak', 'pwFair', 'pwGood', 'pwStrong'];
const BARS = ['a', 'b', 'c', 'd'] as const;

export function PasswordStrength({ password }: { password: string }) {
  const colors = useThemeColors();
  const t = useDictionary('Auth');
  if (!password) {
    return null;
  }
  const score = pwStrength(password);
  const palette = [
    colors.destructive,
    colors.destructive,
    '#C9A227',
    oklchToHex(0.66, 0.14, 150),
    oklchToHex(0.6, 0.16, 150),
  ];
  const color = palette[score] ?? colors.destructive;

  return (
    <View className="mt-3">
      <View className="flex-row gap-1.5">
        {BARS.map((id, i) => (
          <View
            key={id}
            className="h-1.5 flex-1 rounded-full"
            style={{ backgroundColor: i < score ? color : colors.secondary }}
          />
        ))}
      </View>
      <Text className="mt-1.5 font-sans-semibold text-[11.5px]" style={{ color }}>
        {t(LABEL_KEYS[score] ?? 'pwTooWeak')}
      </Text>
    </View>
  );
}

type Requirement = { key: string; labelKey: MessageKey<'Auth'>; ok: boolean };

// Live requirements checklist (handoff New Password screen).
export function PasswordRequirements({ password }: { password: string }) {
  const colors = useThemeColors();
  const t = useDictionary('Auth');
  const requirements: Requirement[] = [
    { key: 'len', labelKey: 'reqLength', ok: password.length >= 8 },
    { key: 'case', labelKey: 'reqCase', ok: /[A-Z]/.test(password) && /[a-z]/.test(password) },
    { key: 'num', labelKey: 'reqNumber', ok: /[0-9]/.test(password) },
    { key: 'sym', labelKey: 'reqSymbol', ok: /[^A-Za-z0-9]/.test(password) },
  ];
  return (
    <View className="gap-2">
      {requirements.map((req) => (
        <View key={req.key} className="flex-row items-center gap-2.5">
          <View
            className="h-[19px] w-[19px] items-center justify-center rounded-full"
            style={{ backgroundColor: req.ok ? SUCCESS : colors.secondary }}
          >
            {req.ok ? (
              <Check size={12} color="#FFFFFF" />
            ) : (
              <View
                className="h-1 w-1 rounded-full"
                style={{ backgroundColor: colors.mutedForeground }}
              />
            )}
          </View>
          <Text
            className={cn(
              'text-[13px]',
              req.ok ? 'font-sans-semibold text-foreground' : 'text-muted-foreground',
            )}
          >
            {t(req.labelKey)}
          </Text>
        </View>
      ))}
    </View>
  );
}
