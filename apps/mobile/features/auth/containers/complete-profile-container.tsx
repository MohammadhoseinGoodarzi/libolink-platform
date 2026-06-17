import { useDictionary } from '@repo/i18n';
import { userAtom } from '@repo/stores';
import { useRouter } from 'expo-router';
import { useAtomValue } from 'jotai';
import {
  AtSign,
  BookOpen,
  Briefcase,
  Building2,
  Feather,
  Globe,
  GraduationCap,
  MapPin,
  Star,
} from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { AuthButton } from '../components/auth-button';
import { AuthField } from '../components/auth-field';
import { AuthHeading } from '../components/auth-heading';
import { AuthScreen } from '../components/auth-screen';
import { BioField } from '../components/bio-field';
import { PickerSheet } from '../components/picker-sheet';
import { ProfilePhoto } from '../components/profile-photo';
import { SelectField } from '../components/select-field';
import { COUNTRIES, citiesFor, DEGREES, GENRES, PROFESSIONS } from '../services/profile-options';

type SelectKey = 'country' | 'city' | 'profession' | 'degree' | 'favGenre';
type Picker = { key: SelectKey; title: string; options: string[]; search: boolean };
type ProfileForm = {
  first: string;
  last: string;
  username: string;
  country: string;
  city: string;
  profession: string;
  university: string;
  degree: string;
  bio: string;
  favBook: string;
  favAuthor: string;
  favGenre: string;
};

function SectionLabel({ children }: { children: string }) {
  return (
    <Text className="mt-2 mb-0.5 px-0.5 font-sans-bold text-[12.5px] uppercase tracking-wide text-muted-foreground">
      {children}
    </Text>
  );
}

export function CompleteProfileContainer() {
  const t = useDictionary('Auth');
  const router = useRouter();
  const user = useAtomValue(userAtom);

  const nameParts = (user?.displayName ?? '').split(' ');
  const [form, setForm] = useState<ProfileForm>({
    first: nameParts[0] ?? '',
    last: nameParts.slice(1).join(' '),
    username: user?.username ?? '',
    country: '',
    city: '',
    profession: '',
    university: '',
    degree: '',
    bio: '',
    favBook: '',
    favAuthor: '',
    favGenre: '',
  });
  const [picker, setPicker] = useState<Picker | null>(null);
  const [busy, setBusy] = useState(false);

  const set = (key: keyof ProfileForm) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const initials = ((form.first[0] ?? '') + (form.last[0] ?? '')).toUpperCase() || 'YOU';

  const finish = () => {
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      router.replace({ pathname: ROUTES.success, params: { name: form.first || 'Reader' } });
    }, 700);
  };

  const skip = () =>
    router.replace({ pathname: ROUTES.success, params: { name: form.first || 'Reader' } });

  return (
    <AuthScreen
      showBack
      padTop={108}
      footer={
        <View className="gap-1.5">
          <AuthButton onPress={finish} loading={busy}>
            {t('completeProfile')}
          </AuthButton>
          <Pressable
            accessibilityRole="button"
            onPress={skip}
            className="h-11 items-center justify-center active:opacity-60"
          >
            <Text className="font-sans-semibold text-[14.5px] text-muted-foreground">
              {t('skipForNow')}
            </Text>
          </Pressable>
        </View>
      }
    >
      <AuthHeading title={t('completeTitle')} subtitle={t('completeSubtitle')} />

      <View className="mb-5 items-center">
        <ProfilePhoto initials={initials} name={`${form.first} ${form.last}`} />
      </View>

      <View className="gap-[14px]">
        <SectionLabel>{t('sectionIdentity')}</SectionLabel>
        <View className="flex-row gap-3">
          <View className="flex-1">
            <AuthField label={t('firstName')} value={form.first} onChangeText={set('first')} />
          </View>
          <View className="flex-1">
            <AuthField label={t('lastName')} value={form.last} onChangeText={set('last')} />
          </View>
        </View>
        <AuthField
          label={t('usernameLabel')}
          icon={AtSign}
          prefix="@"
          value={form.username}
          onChangeText={set('username')}
          autoCapitalize="none"
        />

        <SectionLabel>{t('sectionLocation')}</SectionLabel>
        <View className="flex-row gap-3">
          <View className="flex-1">
            <SelectField
              label={t('country')}
              icon={Globe}
              value={form.country}
              placeholder={t('select')}
              onPress={() =>
                setPicker({ key: 'country', title: t('country'), options: COUNTRIES, search: true })
              }
            />
          </View>
          <View className="flex-1">
            <SelectField
              label={t('city')}
              icon={MapPin}
              value={form.city}
              placeholder={t('select')}
              onPress={() =>
                setPicker({
                  key: 'city',
                  title: t('city'),
                  options: citiesFor(form.country),
                  search: true,
                })
              }
            />
          </View>
        </View>

        <SectionLabel>{t('sectionWorkStudy')}</SectionLabel>
        <SelectField
          label={t('profession')}
          icon={Briefcase}
          value={form.profession}
          placeholder={t('selectProfession')}
          onPress={() =>
            setPicker({
              key: 'profession',
              title: t('profession'),
              options: PROFESSIONS,
              search: false,
            })
          }
        />
        <AuthField
          label={t('university')}
          icon={Building2}
          value={form.university}
          onChangeText={set('university')}
          placeholder={t('universityPlaceholder')}
        />
        <SelectField
          label={t('degree')}
          icon={GraduationCap}
          value={form.degree}
          placeholder={t('selectDegree')}
          onPress={() =>
            setPicker({ key: 'degree', title: t('degree'), options: DEGREES, search: false })
          }
        />

        <SectionLabel>{t('sectionAbout')}</SectionLabel>
        <BioField
          label={t('bio')}
          value={form.bio}
          onChangeText={set('bio')}
          placeholder={t('bioPlaceholder')}
        />

        <SectionLabel>{t('sectionReadingTaste')}</SectionLabel>
        <AuthField
          label={t('favBook')}
          icon={BookOpen}
          value={form.favBook}
          onChangeText={set('favBook')}
          placeholder={t('favBookPlaceholder')}
        />
        <AuthField
          label={t('favAuthor')}
          icon={Feather}
          value={form.favAuthor}
          onChangeText={set('favAuthor')}
          placeholder={t('favAuthorPlaceholder')}
        />
        <SelectField
          label={t('favGenre')}
          icon={Star}
          value={form.favGenre}
          placeholder={t('selectGenre')}
          onPress={() =>
            setPicker({ key: 'favGenre', title: t('favGenre'), options: GENRES, search: true })
          }
        />
      </View>

      {picker ? (
        <PickerSheet
          open
          onClose={() => setPicker(null)}
          title={picker.title}
          options={picker.options}
          search={picker.search}
          value={form[picker.key]}
          onPick={(value) =>
            setForm((prev) => ({
              ...prev,
              [picker.key]: value,
              ...(picker.key === 'country' ? { city: '' } : {}),
            }))
          }
        />
      ) : null}
    </AuthScreen>
  );
}
