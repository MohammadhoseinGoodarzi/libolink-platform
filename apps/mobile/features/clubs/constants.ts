import {
  BookOpen,
  Drama,
  Feather,
  Film,
  Gift,
  Globe,
  GraduationCap,
  type LucideIcon,
  Sparkles,
  Wand2,
} from 'lucide-react-native';

// Club banner / logo gradient tones (content imagery, same allowance as avatars
// — handoff §6.5). Eight muted cloth-hardcover pairs.
export const CLUB_TONES: ReadonlyArray<readonly [string, string]> = [
  ['#1f5135', '#0e2c1c'], // forest
  ['#6e2b32', '#39141a'], // oxblood
  ['#27426b', '#132238'], // deep navy
  ['#4a2f55', '#26162f'], // plum
  ['#1f5a5c', '#0d3032'], // teal
  ['#5b4326', '#2d2013'], // umber
  ['#3a3f5a', '#23263b'], // slate
  ['#5a3320', '#311a10'], // sienna
];

// Foil ink used for monograms/icons on the gradient tiles.
export const CLUB_FOIL = '#F3E7CF';

// Club icon keys → lucide icons (watermarks + monogram tiles). Falls back to
// BookOpen for any unmapped key.
export const CLUB_ICONS: Record<string, LucideIcon> = {
  book: BookOpen,
  wand: Wand2,
  masks: Drama,
  globe: Globe,
  sparkles: Sparkles,
  gradCap: GraduationCap,
  feather: Feather,
  film: Film,
  gift: Gift,
};
