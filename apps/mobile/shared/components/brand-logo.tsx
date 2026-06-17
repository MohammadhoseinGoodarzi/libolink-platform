import { useColorScheme } from 'nativewind';
import { Image, type ImageStyle, type StyleProp } from 'react-native';
import Logo from '../../assets/images/libolink-logo.png';
import LogoDark from '../../assets/images/libolink-logo-dark.png';
import Mark from '../../assets/images/libolink-mark.png';
import MarkDark from '../../assets/images/libolink-mark-dark.png';

// Raster aspect ratios of the shipped lockup / mark assets.
const ASPECT = { lockup: 5483 / 793, mark: 1150 / 793 } as const;

type BrandLogoProps = {
  variant?: 'lockup' | 'mark';
  /** Size by height; width is derived. Header ≈ 24, drawer ≈ 22, footer ≈ 18 (§4). */
  height?: number;
  /** Force the cream-ink dark art on a brand-green surface even in light mode. */
  onBrandSurface?: boolean;
  style?: StyleProp<ImageStyle>;
};

// Always the shipped duotone PNG — never redraw the mark or set the wordmark in
// live text (handoff §4). Picks the -dark art on dark themes / green surfaces.
function BrandLogo({
  variant = 'lockup',
  height = 24,
  onBrandSurface = false,
  style,
}: BrandLogoProps) {
  const { colorScheme } = useColorScheme();
  const dark = onBrandSurface || colorScheme === 'dark';
  const source = variant === 'mark' ? (dark ? MarkDark : Mark) : dark ? LogoDark : Logo;

  return (
    <Image
      source={source}
      accessibilityRole="image"
      accessibilityLabel="Libolink"
      resizeMode="contain"
      style={[{ height, width: height * ASPECT[variant] }, style]}
    />
  );
}

export { BrandLogo };
