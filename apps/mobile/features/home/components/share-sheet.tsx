import { useDictionary } from '@repo/i18n';
import { cn, getInitials } from '@repo/utils';
import { Bookmark, Check, Flag, Link, X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, useWindowDimensions, View } from 'react-native';
import { Avatar, BottomSheet, Text, useToast } from '@/shared/components/ui';
import { useBottomInset } from '@/shared/hooks/use-bottom-inset';
import { useThemeColors } from '@/shared/theme';
import { DM_FRIENDS } from '../services/share-data';
import type { ShareSheetProps } from '../types';

// Grabber (~30) + the two-line title header (~46) share BottomSheet's 90% box
// (mirror of the comments sheet), so the send bar never overflows behind the
// Android nav bar.
const SHEET_CHROME = 76;

// Share-to-DM sheet (handoff §6.2): a multi-select friend grid plus Copy Link /
// Save / Report, with a fixed Send bar. Sending is mocked with a toast until the
// DM backend exists — the selection here is pure UI state.
export function ShareSheet({ post, open, onClose }: ShareSheetProps) {
  const t = useDictionary('Share');
  const tCommon = useDictionary('Common');
  const colors = useThemeColors();
  const toast = useToast();
  const bottomInset = useBottomInset();
  const { height } = useWindowDimensions();
  const sheetHeight = Math.max(
    320,
    Math.min(height * 0.64, height * 0.9 - SHEET_CHROME - bottomInset),
  );

  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const count = Object.values(picked).filter(Boolean).length;

  const toggle = (id: string) => {
    setPicked((s) => ({ ...s, [id]: !s[id] }));
  };

  const send = () => {
    onClose();
    toast.show(`${t('sentTo')} ${count} ${count === 1 ? t('friend') : t('friends')}`);
    setTimeout(() => setPicked({}), 300);
  };

  const runAction = (toastMsg: string) => {
    onClose();
    toast.show(toastMsg);
  };

  const subject =
    post.content.length > 60 ? `${post.content.slice(0, 60).trimEnd()}…` : post.content;
  const sendLabel =
    count === 0 ? t('selectFriends') : count === 1 ? t('send') : `${t('sendTo')} ${count}`;

  const actions = [
    { key: 'copy', label: t('copyLink'), icon: Link, toastMsg: t('linkCopied'), danger: false },
    { key: 'save', label: t('save'), icon: Bookmark, toastMsg: t('saved'), danger: false },
    { key: 'report', label: t('report'), icon: Flag, toastMsg: t('reported'), danger: true },
  ];

  const header = (
    <View className="flex-row items-center border-border border-b px-4 pb-3">
      <View className="w-8" />
      <View className="flex-1 items-center">
        <Text className="font-sans-bold text-[15px] text-foreground">{t('title')}</Text>
        {subject ? (
          <Text numberOfLines={1} className="mt-0.5 font-sans text-[12.5px] text-muted-foreground">
            {subject}
          </Text>
        ) : null}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={tCommon('close')}
        onPress={onClose}
        className="h-8 w-8 items-center justify-center rounded-full bg-secondary active:opacity-70"
      >
        <X size={17} color={colors.foreground} />
      </Pressable>
    </View>
  );

  return (
    <BottomSheet open={open} onClose={onClose} label={t('title')} header={header}>
      <View style={{ height: sheetHeight }}>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* friend grid (multi-select) */}
          <View className="flex-row flex-wrap px-2 pt-3">
            {DM_FRIENDS.map((f) => {
              const on = !!picked[f.id];
              return (
                <Pressable
                  key={f.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                  onPress={() => toggle(f.id)}
                  className="w-1/4 items-center gap-1.5 py-2 active:opacity-70"
                >
                  <View
                    style={{
                      borderWidth: 2,
                      borderColor: on ? colors.destructive : 'transparent',
                      borderRadius: 9999,
                      padding: 2,
                    }}
                  >
                    <Avatar initials={getInitials(f.displayName)} name={f.displayName} size={52} />
                    {on ? (
                      <View
                        className="absolute items-center justify-center rounded-full"
                        style={{
                          right: 0,
                          bottom: 0,
                          width: 22,
                          height: 22,
                          backgroundColor: colors.destructive,
                          borderWidth: 2,
                          borderColor: colors.background,
                        }}
                      >
                        <Check size={12} color={colors.destructiveForeground} strokeWidth={3} />
                      </View>
                    ) : null}
                  </View>
                  <Text numberOfLines={1} className="font-sans text-[11px] text-foreground">
                    {f.displayName.split(' ')[0] ?? f.displayName}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* secondary actions */}
          <View className="mt-2 border-border border-t px-3 pt-1.5">
            {actions.map((a) => {
              const Icon = a.icon;
              return (
                <Pressable
                  key={a.key}
                  accessibilityRole="button"
                  onPress={() => runAction(a.toastMsg)}
                  className="h-[50px] flex-row items-center gap-3.5 active:opacity-70"
                >
                  <View className="h-[38px] w-[38px] items-center justify-center rounded-full border border-border bg-card">
                    <Icon size={18} color={a.danger ? colors.destructive : colors.primary} />
                  </View>
                  <Text
                    className={cn(
                      'font-sans-semibold text-[15px]',
                      a.danger ? 'text-destructive' : 'text-foreground',
                    )}
                  >
                    {a.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        {/* send bar */}
        <View className="border-border border-t bg-card px-4 py-2.5">
          <Pressable
            accessibilityRole="button"
            disabled={count === 0}
            onPress={send}
            className={cn(
              'h-12 items-center justify-center rounded-[16px] bg-destructive active:opacity-90',
              count === 0 && 'opacity-60',
            )}
          >
            <Text
              className="font-sans-bold text-[15px]"
              style={{ color: colors.destructiveForeground }}
            >
              {sendLabel}
            </Text>
          </Pressable>
        </View>
      </View>
    </BottomSheet>
  );
}
