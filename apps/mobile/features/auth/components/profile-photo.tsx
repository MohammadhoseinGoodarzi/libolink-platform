import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'lucide-react-native';
import { useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import { Avatar } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';

// Avatar with a camera badge that opens the gallery (handoff §6.1 Complete
// Profile). Camera capture can be added via launchCameraAsync later.
export function ProfilePhoto({ initials, name }: { initials: string; name?: string }) {
  const colors = useThemeColors();
  const [uri, setUri] = useState<string | null>(null);

  const pick = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    const asset = result.assets?.[0];
    if (!result.canceled && asset) {
      setUri(asset.uri);
    }
  };

  return (
    <View className="items-center">
      <Pressable
        accessibilityRole="button"
        onPress={pick}
        className="active:opacity-60"
        style={{ width: 96, height: 96 }}
      >
        {uri ? (
          <Image source={{ uri }} style={{ width: 96, height: 96, borderRadius: 48 }} />
        ) : (
          <Avatar initials={initials} name={name} size={96} />
        )}
        <View
          className="absolute h-[34px] w-[34px] items-center justify-center rounded-full bg-primary"
          style={{ right: -2, bottom: -2, borderWidth: 3, borderColor: colors.background }}
        >
          <Camera size={16} color={colors.primaryForeground} />
        </View>
      </Pressable>
    </View>
  );
}
