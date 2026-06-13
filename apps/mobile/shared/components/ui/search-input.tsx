import { cn } from '@repo/utils';
import { Search } from 'lucide-react-native';
import type { ComponentProps } from 'react';
import { TextInput, View } from 'react-native';

function SearchInput({ className, ...props }: ComponentProps<typeof TextInput>) {
  return (
    <View className="relative justify-center">
      <View className="absolute left-3 z-10">
        <Search size={18} color="#9ca3af" />
      </View>
      <TextInput
        placeholderTextColor="#9ca3af"
        className={cn(
          'h-[42px] rounded-md border border-input bg-background pl-10 pr-3 text-base text-foreground',
          className,
        )}
        {...props}
      />
    </View>
  );
}

export { SearchInput };
