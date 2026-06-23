import { useId } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { Text } from './text';
import type { BookCoverProps } from './types';

// Muted cloth-hardcover tones (forest / oxblood / navy / plum / teal / umber).
const COVER_TONES: ReadonlyArray<readonly [string, string]> = [
  ['#2f4f3a', '#1c3324'],
  ['#5a3a40', '#3a2429'],
  ['#3a3f5a', '#23263b'],
  ['#4a3a52', '#2d2333'],
  ['#36505a', '#22343b'],
  ['#4a4636', '#2f2c22'],
];

// Cream foil ink used for title + author on every tone.
const FOIL = '#F3E7CF';

function toneFromString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 17 + value.charCodeAt(i)) % COVER_TONES.length;
  }
  return hash;
}

// Generated, offline-safe cover (handoff §5). Real cover photos use <expo-image>
// + picker; this is the fallback for any book without user-supplied art.
function BookCover({ title, author, width = 44, tone, radius = 12 }: BookCoverProps) {
  const height = width * 1.4;
  const [from, to] = COVER_TONES[(tone ?? toneFromString(title)) % COVER_TONES.length] as readonly [
    string,
    string,
  ];
  const gradientId = `bc${useId().replace(/:/g, '')}`;

  return (
    <View
      style={[{ width, height, borderRadius: radius }, styles.shadow]}
      className="shrink-0 overflow-hidden"
    >
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0" stopColor={from} />
            <Stop offset="1" stopColor={to} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${gradientId})`} />
      </Svg>

      {/* spine + highlight */}
      <View className="absolute top-0 bottom-0 left-0" style={styles.spine} />
      <View className="absolute top-0 bottom-0" style={styles.spineHighlight} />

      <Text
        numberOfLines={3}
        className="absolute font-sans-bold"
        style={{
          left: width * 0.16,
          right: width * 0.12,
          top: width * 0.2,
          color: FOIL,
          fontSize: Math.max(7, width * 0.15),
          lineHeight: Math.max(8, width * 0.17),
        }}
      >
        {title}
      </Text>

      {author ? (
        <Text
          numberOfLines={1}
          className="absolute font-sans-medium"
          style={{
            left: width * 0.16,
            right: width * 0.12,
            bottom: width * 0.16,
            color: FOIL,
            opacity: 0.7,
            fontSize: Math.max(6, width * 0.105),
          }}
        >
          {author}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  spine: { width: 3, backgroundColor: 'rgba(0,0,0,0.28)' },
  spineHighlight: { left: 3, width: 1.5, backgroundColor: 'rgba(255,255,255,0.18)' },
});

export { BookCover };
