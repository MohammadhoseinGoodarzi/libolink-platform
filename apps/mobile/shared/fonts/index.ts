import VazirmatnBold from '../../assets/fonts/Vazirmatn-Bold.ttf';
import VazirmatnMedium from '../../assets/fonts/Vazirmatn-Medium.ttf';
import VazirmatnRegular from '../../assets/fonts/Vazirmatn-Regular.ttf';
import VazirmatnSemiBold from '../../assets/fonts/Vazirmatn-SemiBold.ttf';

// Passed to expo-font's useFonts. Keys are the family names referenced by the
// Tailwind fontFamily scale (font-sans / font-sans-medium / …) and by any place
// that needs a raw fontFamily string (SVG <Text>, generated book covers).
export const FONT_MAP = {
  'Vazirmatn-Regular': VazirmatnRegular,
  'Vazirmatn-Medium': VazirmatnMedium,
  'Vazirmatn-SemiBold': VazirmatnSemiBold,
  'Vazirmatn-Bold': VazirmatnBold,
} as const;

// Vazirmatn is the only sanctioned family (handoff §3.5). Weights 400/500/600/700.
export const FONT_FAMILY = {
  regular: 'Vazirmatn-Regular',
  medium: 'Vazirmatn-Medium',
  semibold: 'Vazirmatn-SemiBold',
  bold: 'Vazirmatn-Bold',
} as const;
