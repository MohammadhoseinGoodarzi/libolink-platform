import { useDictionary } from '@repo/i18n';
import type { Density, FontSizeLevel, Theme } from '@repo/types';
import { cn } from '@repo/utils';
import { Moon, Smartphone, Sun } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Card, Text } from '@/shared/components/ui';
import { useAppTheme } from '@/shared/theme';
import { A11Y_ITEMS } from '../constants';
import { useSettings } from '../hooks/use-settings';
import { GroupCard } from './group-card';
import { SettingsGroupLabel } from './settings-group-label';
import { SettingsNote } from './settings-note';
import { SettingsRow } from './settings-row';
import { SettingsScreenShell } from './settings-screen-shell';
import { Segment, TileSegment } from './settings-segment';

const LEVELS: FontSizeLevel[] = [0, 1, 2, 3, 4];
// Glyph size of each "A" picker button, per level.
const A_SIZES = [11, 13.5, 16, 19, 23];

// Font-size picker with a live preview (handoff Appearance). A native slider would
// need a new dep, so this is a 5-step "A" picker — same five levels, no slider.
function FontSizeControl() {
  const t = useDictionary('Settings');
  const { settings, setSettings } = useSettings();
  const level = settings.fontSize;
  const labels = [t('fontSmall'), t('fontMedium'), t('fontDefault'), t('fontLarge'), t('fontXL')];
  const previewSize = 13 + level * 1.7;

  return (
    <View>
      <View className="flex-row items-center justify-between">
        <Text className="font-sans-semibold text-[15.5px] text-foreground">{t('fontSize')}</Text>
        <Text className="font-sans-semibold text-[14px] text-primary">{labels[level] ?? ''}</Text>
      </View>

      <View className="mt-3 rounded-2xl bg-secondary px-4 py-3.5">
        <Text
          className="font-sans text-foreground"
          style={{ fontSize: previewSize, lineHeight: previewSize * 1.45 }}
        >
          {t('fontPreview')}
        </Text>
      </View>

      <View className="mt-3.5 flex-row items-center gap-2.5">
        <Text className="font-sans-semibold text-[13px] text-muted-foreground">A</Text>
        <View className="flex-1 flex-row gap-1.5">
          {LEVELS.map((lvl) => {
            const on = lvl === level;
            return (
              <Pressable
                key={lvl}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                onPress={() => setSettings((prev) => ({ ...prev, fontSize: lvl }))}
                className={cn(
                  'h-10 flex-1 items-center justify-center rounded-xl',
                  on ? 'bg-primary' : 'bg-secondary',
                )}
              >
                <Text
                  className={cn(
                    'font-sans-bold',
                    on ? 'text-primary-foreground' : 'text-muted-foreground',
                  )}
                  style={{ fontSize: A_SIZES[lvl] ?? 13 }}
                >
                  A
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text className="font-sans-bold text-[22px] text-muted-foreground">A</Text>
      </View>
    </View>
  );
}

// Appearance settings (handoff): theme tiles (drive the existing theme system),
// font size, display density, and the accessibility toggles.
export function AppearanceScreen() {
  const t = useDictionary('Settings');
  const { preference, setTheme } = useAppTheme();
  const { settings, setSettings } = useSettings();

  const themeOptions: { key: Theme; label: string; icon: typeof Sun }[] = [
    { key: 'light', label: t('themeLight'), icon: Sun },
    { key: 'dark', label: t('themeDark'), icon: Moon },
    { key: 'system', label: t('themeSystem'), icon: Smartphone },
  ];
  const densityOptions: { key: Density; label: string }[] = [
    { key: 'comfortable', label: t('densityComfortable') },
    { key: 'compact', label: t('densityCompact') },
  ];
  const themeHint =
    preference === 'system'
      ? t('themeSystemHint')
      : preference === 'dark'
        ? t('themeDarkHint')
        : t('themeLightHint');

  return (
    <SettingsScreenShell title={t('appearance')}>
      <SettingsGroupLabel icon={Sun}>{t('theme')}</SettingsGroupLabel>
      <View className="px-4">
        <Card variant="flat" padded>
          <TileSegment options={themeOptions} value={preference} onChange={setTheme} />
          <Text className="mt-3 font-sans text-[12px] text-muted-foreground leading-[17px]">
            {themeHint}
          </Text>
        </Card>
      </View>

      <View className="h-5" />
      <SettingsGroupLabel>{t('display')}</SettingsGroupLabel>
      <View className="px-4">
        <Card variant="flat" padded>
          <FontSizeControl />
        </Card>
        <View className="h-3" />
        <Card variant="flat" padded>
          <Text className="mb-3 font-sans-semibold text-[15.5px] text-foreground">
            {t('displayDensity')}
          </Text>
          <Segment
            options={densityOptions}
            value={settings.density}
            onChange={(key) => setSettings((prev) => ({ ...prev, density: key }))}
          />
        </Card>
      </View>

      <View className="h-5" />
      <SettingsGroupLabel>{t('accessibility')}</SettingsGroupLabel>
      <GroupCard>
        {A11Y_ITEMS.map((item, index) => (
          <SettingsRow
            key={item.key}
            first={index === 0}
            icon={item.icon}
            title={t(item.title)}
            subtitle={t(item.desc)}
            trailing="switch"
            on={settings.accessibility[item.key]}
            onToggle={() =>
              setSettings((prev) => ({
                ...prev,
                accessibility: {
                  ...prev.accessibility,
                  [item.key]: !prev.accessibility[item.key],
                },
              }))
            }
          />
        ))}
      </GroupCard>
      <SettingsNote>{t('accessibilityNote')}</SettingsNote>
    </SettingsScreenShell>
  );
}
