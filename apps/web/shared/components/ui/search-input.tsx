import { cn } from '@repo/utils';
import { Search } from 'lucide-react';
import type { ComponentProps } from 'react';
import { Input } from './input';

function SearchInput({ className, ...props }: ComponentProps<'input'>) {
  return (
    <div className="relative">
      <Search className="absolute inset-y-0 left-3 my-auto size-4 text-muted-foreground" />
      <Input type="search" className={cn('pl-9', className)} {...props} />
    </div>
  );
}

export { SearchInput };
