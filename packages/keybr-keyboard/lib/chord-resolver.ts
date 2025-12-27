import { type ChordLayoutMetadata, type KeyId } from "./types.ts";

/**
 * Resolves the active chord layer based on currently depressed (held) keys.
 *
 * For chord layouts like 月配列2-263, certain keys act as modifiers when held.
 * This function determines which chord layer should be used for character lookup.
 *
 * @param depressedKeys Array of currently pressed key IDs
 * @param chordMetadata Chord layout metadata defining modifier keys and layers
 * @returns Layer index to use for character lookup (0 = base layer, 4+ = chord layers)
 *
 * @example
 * ```typescript
 * const metadata = {
 *   chordModifiers: { KeyD: 4, KeyK: 5, KeyF: 6 },
 *   postModifiers: {},
 *   layerCount: 7,
 * };
 *
 * // No chord keys pressed
 * resolveChordLayer(['KeyA', 'KeyQ'], metadata) // => 0 (base layer)
 *
 * // KeyK (☆) pressed
 * resolveChordLayer(['KeyK', 'KeyQ'], metadata) // => 5 (☆ layer)
 *
 * // Multiple chord keys pressed - prioritize KeyD > KeyK > KeyF
 * resolveChordLayer(['KeyD', 'KeyK'], metadata) // => 4 (★ layer has priority)
 * ```
 */
export function resolveChordLayer(
  depressedKeys: readonly KeyId[],
  chordMetadata: ChordLayoutMetadata,
): number {
  const { chordModifiers } = chordMetadata;

  // Priority order: KeyD (★) > KeyK (☆) > KeyF (※)
  // Check in priority order and return the first match
  const priorityOrder: KeyId[] = ["KeyD", "KeyK", "KeyF"];

  for (const priorityKey of priorityOrder) {
    if (
      chordModifiers[priorityKey] !== undefined &&
      depressedKeys.includes(priorityKey)
    ) {
      return chordModifiers[priorityKey];
    }
  }

  // No chord modifier keys pressed - return base layer
  return 0;
}
