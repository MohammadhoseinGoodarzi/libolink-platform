import { useDictionary } from '@repo/i18n';
import type { AutoplayMode } from '@repo/types';
import { Database, Download, Volume2, Wifi } from 'lucide-react-native';
import { type DimensionValue, View } from 'react-native';
import { ActionSheet, Card, Text, useToast } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import { STORAGE_USAGE, type StorageTone } from '../constants';
import { useSelectSheet } from '../hooks/use-select-sheet';
import { useSettings } from '../hooks/use-settings';
import { GroupCard } from './group-card';
import { SettingsGroupLabel } from './settings-group-label';
import { SettingsNote } from './settings-note';
import { SettingsRow } from './settings-row';
import { SettingsScreenShell } from './settings-screen-shell';

// Storage & Data (handoff): usage breakdown, manage (downloads/cache) and the
// data-usage toggles + autoplay selector. The downloads list is a deeper
// sub-screen (phase-2); clearing the cache acknowledges.
export function StorageScreen() {
  const t = useDictionary('Settings');
  const tCommon = useDictionary('Common');
  const toast = useToast();
  const colors = useThemeColors();
  const { settings, setSettings } = useSettings();
  const { sheet, openSelect, closeSheet } = useSelectSheet();
  const d = settings.data;

  const toneColor = (tone: StorageTone) =>
    tone === 'green'
      ? colors.primary
      : tone === 'navy'
        ? colors.link
        : tone === 'crimson'
          ? colors.destructive
          : colors.mutedForeground;

  const toggle = (key: 'dataSaver' | 'hiQualityAudio' | 'downloadWifiOnly') =>
    setSettings((prev) => ({ ...prev, data: { ...prev.data, [key]: !prev.data[key] } }));

  const autoplayOptions: { key: AutoplayMode; label: string }[] = [
    { key: 'wifi', label: t('autoplayWifi') },
    { key: 'always', label: t('autoplayAlways') },
    { key: 'never', label: t('autoplayNever') },
  ];
  const autoplayLabel =
    d.autoplay === 'always'
      ? t('autoplayAlways')
      : d.autoplay === 'never'
        ? t('autoplayNever')
        : t('autoplayWifi');

  return (
    <SettingsScreenShell title={t('storage')}>
      <View className="px-4">
        <Card variant="flat" padded>
          <View className="flex-row items-baseline justify-between">
            <Text
              className="font-sans-bold text-[22px] text-foreground"
              style={{ letterSpacing: -0.4 }}
            >
              {STORAGE_USAGE.usedGB} GB
            </Text>
            <Text className="font-sans text-[12.5px] text-muted-foreground">
              {t('storageOf')} {STORAGE_USAGE.totalGB} GB {t('storageUsed')}
            </Text>
          </View>
          <View className="mt-3 h-3 flex-row gap-0.5 overflow-hidden rounded-full bg-secondary">
            {STORAGE_USAGE.segments.map((seg) => (
              <View
                key={seg.label}
                style={{
                  // cast: a computed `${number}%` widens to string; it's a valid DimensionValue.
                  width: `${(seg.value / STORAGE_USAGE.totalGB) * 100}%` as DimensionValue,
                  backgroundColor: toneColor(seg.tone),
                }}
              />
            ))}
          </View>
          <View className="mt-3.5 flex-row flex-wrap gap-x-4 gap-y-2">
            {STORAGE_USAGE.segments.map((seg) => (
              <View key={seg.label} className="flex-row items-center gap-1.5">
                <View
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: toneColor(seg.tone) }}
                />
                <Text className="font-sans text-[12.5px] text-muted-foreground">
                  {t(seg.label)} · {seg.value} GB
                </Text>
              </View>
            ))}
          </View>
        </Card>
      </View>

      <View className="h-5" />
      <SettingsGroupLabel icon={Database}>{t('manageGroup')}</SettingsGroupLabel>
      <GroupCard>
        <SettingsRow
          first
          icon={Download}
          title={t('downloadedContent')}
          value={STORAGE_USAGE.downloads}
          onPress={() => toast.show(tCommon('comingSoon'))}
        />
        <SettingsRow
          icon={Database}
          title={t('cachedData')}
          value={STORAGE_USAGE.cache}
          onPress={() => toast.show(t('cacheCleared'))}
        />
      </GroupCard>

      <View className="h-5" />
      <SettingsGroupLabel icon={Wifi}>{t('dataUsageGroup')}</SettingsGroupLabel>
      <GroupCard>
        <SettingsRow
          first
          icon={Wifi}
          title={t('dataSaver')}
          subtitle={t('dataSaverSub')}
          trailing="switch"
          on={d.dataSaver}
          onToggle={() => toggle('dataSaver')}
        />
        <SettingsRow
          icon={Volume2}
          title={t('autoplayMedia')}
          value={autoplayLabel}
          onPress={() =>
            openSelect<AutoplayMode>(t('autoplayMedia'), autoplayOptions, d.autoplay, (mode) =>
              setSettings((prev) => ({ ...prev, data: { ...prev.data, autoplay: mode } })),
            )
          }
        />
        <SettingsRow
          icon={Volume2}
          title={t('hiQualityAudio')}
          subtitle={t('hiQualityAudioSub')}
          trailing="switch"
          on={d.hiQualityAudio}
          onToggle={() => toggle('hiQualityAudio')}
        />
        <SettingsRow
          icon={Download}
          title={t('downloadWifiOnly')}
          trailing="switch"
          on={d.downloadWifiOnly}
          onToggle={() => toggle('downloadWifiOnly')}
        />
      </GroupCard>
      <SettingsNote>{t('storageNote')}</SettingsNote>

      <ActionSheet
        open={sheet !== null}
        onClose={closeSheet}
        title={sheet?.title ?? ''}
        actions={sheet?.actions ?? []}
      />
    </SettingsScreenShell>
  );
}
