import en from './messages/en.json';

export type Messages = typeof en;
export type Namespace = keyof Messages;
export type MessageKey<N extends Namespace> = keyof Messages[N] & string;
export type Translator<N extends Namespace> = (key: MessageKey<N>) => string;

function createTranslator<N extends Namespace>(namespace: N): Translator<N> {
  // Widened view so the generic indexed access resolves to string;
  // key validity is already enforced by the Translator<N> signature.
  const table: Record<string, string> = en[namespace];
  return (key) => table[key] ?? key;
}

/**
 * Mirrors next-intl's `getTranslations(namespace)` API exactly.
 *
 * Migration path when next-intl is added to apps/web — replace this body with:
 * `export { getTranslations as getDictionary } from 'next-intl/server';`
 * No component changes needed.
 */
export async function getDictionary<N extends Namespace>(namespace: N): Promise<Translator<N>> {
  return createTranslator(namespace);
}

/**
 * Mirrors next-intl's `useTranslations(namespace)` API for client components
 * and React Native, where an async dictionary cannot be awaited in render.
 */
export function useDictionary<N extends Namespace>(namespace: N): Translator<N> {
  return createTranslator(namespace);
}
