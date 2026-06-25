import { cn } from '@repo/utils';
import type { TextInputProps } from 'react-native';
import { InputBase } from './input-base';

// Filled native-feel field (handoff auth Field): recessed secondary fill, 16px
// radius, 52px tall, Vazirmatn medium. A bare InputBase, so the multiline
// chat/compose/comments composers can reuse it and override the box via className.
function Input({ className, ...props }: TextInputProps) {
  return (
    <InputBase
      className={cn(
        'h-[52px] rounded-2xl bg-secondary px-3.5 font-sans-medium text-base text-foreground',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
