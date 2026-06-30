import { useDictionary } from '@repo/i18n';
import type { ConnectedProvider } from '@repo/types';
import { cn } from '@repo/utils';
import { useState } from 'react';
import { View } from 'react-native';
import { Button, Text, useToast } from '@/shared/components/ui';
import { CONNECTED_ACCOUNTS } from '../services/connected-accounts';
import { GroupCard } from './group-card';
import { SettingsNote } from './settings-note';
import { SettingsScreenShell } from './settings-screen-shell';

// Connected Accounts (handoff Account): the linked sign-in providers, each with a
// connect/disconnect toggle. Mock list with a local-optimistic toggle until the
// backend exists.
export function AccConnectedScreen() {
  const t = useDictionary('Settings');
  const toast = useToast();
  const [accounts, setAccounts] = useState(() => CONNECTED_ACCOUNTS.map((item) => ({ ...item })));

  const toggle = (id: ConnectedProvider, wasConnected: boolean) => {
    setAccounts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, connected: !item.connected } : item)),
    );
    toast.show(wasConnected ? t('accDisconnected') : t('accConnected'));
  };

  return (
    <SettingsScreenShell title={t('connectedAccounts')}>
      <GroupCard>
        {accounts.map((account, index) => (
          <View
            key={account.id}
            className={cn(
              'flex-row items-center gap-3 px-4 py-3',
              index > 0 && 'border-border border-t',
            )}
          >
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-secondary">
              <Text className="font-sans-bold text-[16px] text-primary">{account.name[0]}</Text>
            </View>
            <View className="min-w-0 flex-1">
              <Text className="font-sans-semibold text-[15px] text-foreground">{account.name}</Text>
              <Text
                numberOfLines={1}
                className="mt-0.5 font-sans text-[12px] text-muted-foreground"
              >
                {account.connected ? account.detail : t('accNotConnected')}
              </Text>
            </View>
            <Button
              size="sm"
              variant={account.connected ? 'outline' : 'default'}
              onPress={() => toggle(account.id, account.connected)}
            >
              {account.connected ? t('accDisconnect') : t('accConnect')}
            </Button>
          </View>
        ))}
      </GroupCard>
      <SettingsNote>{t('accConnectedNote')}</SettingsNote>
    </SettingsScreenShell>
  );
}
