'use client';

import { useDictionary } from '@repo/i18n';
import { cn } from '@repo/utils';
import { Eye, EyeOff } from 'lucide-react';
import { type ComponentProps, useState } from 'react';
import { Input } from './input';

function PasswordInput({ className, ...props }: ComponentProps<'input'>) {
  const t = useDictionary('Common');
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input type={visible ? 'text' : 'password'} className={cn('pr-10', className)} {...props} />
      <button
        type="button"
        aria-label={visible ? t('hidePassword') : t('showPassword')}
        onClick={() => setVisible((value) => !value)}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

export { PasswordInput };
