// RN's color parser doesn't understand oklch(), but the design generates avatar
// and online-dot colors in OKLCH (fixed lightness/chroma, per-person hue). This
// converts OKLCH → sRGB hex so those colors render identically to the prototype.
export function oklchToHex(l: number, c: number, h: number): string {
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;

  const lc = l_ * l_ * l_;
  const mc = m_ * m_ * m_;
  const sc = s_ * s_ * s_;

  const r = 4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc;
  const g = -1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc;
  const bl = -0.0041960863 * lc - 0.7034186147 * mc + 1.707614701 * sc;

  const gamma = (x: number) => (x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055);
  const to255 = (x: number) =>
    Math.round(Math.max(0, Math.min(1, x)) * 255)
      .toString(16)
      .padStart(2, '0');

  return `#${to255(gamma(r))}${to255(gamma(g))}${to255(gamma(bl))}`;
}

// Deterministic per-person hue so an avatar's colour is stable across renders.
export function hueFromString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) % 360;
  }
  return hash;
}

// Fixed-lightness avatar palette (matches the prototype's oklch(0.7 0.13 h) fill
// + oklch(0.26 0.06 h) ink) for cohesive, legible per-person colours.
export function avatarColors(hue: number): { background: string; foreground: string } {
  return {
    background: oklchToHex(0.7, 0.13, hue),
    foreground: oklchToHex(0.26, 0.06, hue),
  };
}

// Online presence dot (oklch(0.72 0.18 145) — a vivid AA green).
export const ONLINE_DOT = oklchToHex(0.72, 0.18, 145);
