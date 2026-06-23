import type { MessageKey } from '@repo/i18n';
import type { LucideIcon } from 'lucide-react-native';
import type { ComponentType, ReactNode } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { TextInputProps } from 'react-native';
import type { SignInInput, SignUpFormInput } from '@/features/auth/validations';

export interface LoginFormProps {
  form: UseFormReturn<SignInInput>;
  onSubmit: () => void;
  isSubmitting: boolean;
  hasError: boolean;
}

export interface SignUpFormProps {
  form: UseFormReturn<SignUpFormInput>;
  onSubmit: () => void;
  isSubmitting: boolean;
  hasError: boolean;
}

export type AuthButtonProps = {
  children: ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
};

export type AuthFieldProps = Pick<
  TextInputProps,
  'autoCapitalize' | 'keyboardType' | 'autoFocus' | 'onSubmitEditing' | 'returnKeyType'
> & {
  value: string;
  onChangeText: (value: string) => void;
  label?: string;
  placeholder?: string;
  icon?: ComponentType<{ size?: number; color?: string }>;
  prefix?: string;
  secure?: boolean;
  ok?: boolean;
  error?: string;
  hint?: string;
};

export type AuthHeadingProps = {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  size?: number;
};

export type AuthScreenProps = {
  children: ReactNode;
  footer?: ReactNode;
  showBack?: boolean;
  center?: boolean;
  padTop?: number;
};

export type BioFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
};

export type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
};

export type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  autoFocus?: boolean;
};

export type Requirement = { key: string; labelKey: MessageKey<'Auth'>; ok: boolean };

export type PickerSheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  options: string[];
  value: string;
  onPick: (value: string) => void;
  search?: boolean;
};

export type SelectFieldProps = {
  label?: string;
  value: string;
  placeholder: string;
  icon?: ComponentType<{ size?: number; color?: string }>;
  onPress: () => void;
};

export type Perk = {
  key: string;
  icon: LucideIcon;
  title: MessageKey<'Auth'>;
  desc: MessageKey<'Auth'>;
};

export type WelcomeViewProps = {
  onCreateAccount: () => void;
  onSignIn: () => void;
  onGoogle: () => void;
};

export type SelectKey = 'country' | 'city' | 'profession' | 'degree' | 'favGenre';

export type Picker = { key: SelectKey; title: string; options: string[]; search: boolean };

export type ProfileForm = {
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
