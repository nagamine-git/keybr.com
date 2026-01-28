import { type Keyboard } from "@keybr/keyboard";
import { type KeyId } from "@keybr/keyboard/lib/types.ts";
import { toKeyModifier } from "./emulation.ts";
import { PostModifierBuffer } from "./post-modifier.ts";
import { type IInputEvent, type IKeyboardEvent, type InputListener } from "./types.ts";

/**
 * Creates a chord-aware input listener for layouts like 月配列2-263.
 *
 * Handles:
 * - Pre-modifier keys (d, k, f) that modify the NEXT character (prefix shift)
 * - Post-modifier keys (l, /) that modify the previous character
 * - Extended character arrays with 7+ slots
 *
 * NOTE: This implementation uses PREFIX SHIFT, not simultaneous chord detection.
 * Pre-modifiers are pressed sequentially (d then k), not simultaneously.
 *
 * @param keyboard The keyboard with chord layout metadata
 * @param target The target input listener to forward events to
 * @returns A wrapped input listener with chord support
 */
export function chordEmulation(
  keyboard: Keyboard,
  target: InputListener,
): InputListener {
  const postModBuffer = new PostModifierBuffer();
  const chordMeta = keyboard.layout.chordMetadata;

  if (!chordMeta) {
    throw new Error("chordEmulation called on non-chord layout");
  }

  // State for pre-modifier (prefix shift) handling
  // Support multiple pre-modifiers (e.g., K then D for combined layers)
  const pendingPreModifiers: Map<KeyId, { timeStamp: number; event: IKeyboardEvent }> = new Map();
  const PRE_MODIFIER_TIMEOUT = 2000; // ms - time window for sequential pre-modifier input
  let preModifierTimeout: NodeJS.Timeout | null = null;

  // Check if a key is a pre-modifier (chord modifier key)
  const isPreModifier = (code: KeyId): boolean => {
    return chordMeta.chordModifiers[code] !== undefined;
  };

  // Clear pending pre-modifiers
  const clearPendingPreModifiers = () => {
    console.log('[TIMEOUT] Clearing pending pre-modifiers');
    pendingPreModifiers.clear();
    if (preModifierTimeout) {
      clearTimeout(preModifierTimeout);
      preModifierTimeout = null;
    }
  };

  // Calculate combined chord layer from all pending pre-modifiers
  const getCombinedChordLayer = (): number => {
    if (pendingPreModifiers.size === 0) return 0;

    // Sum all pre-modifier layers
    let combinedLayer = 0;
    for (const [code, _] of pendingPreModifiers) {
      const layer = chordMeta.chordModifiers[code] ?? 0;
      combinedLayer += layer;
    }

    console.log('[LAYER] Combined layer from', Array.from(pendingPreModifiers.keys()), '=', combinedLayer);
    return combinedLayer;
  };

  return {
    onKeyDown: (event: IKeyboardEvent): void => {
      // Check if this is a post-modifier key
      const postModFn = chordMeta.postModifiers[event.code];

      // If this key is a post-modifier BUT we have pending pre-modifiers,
      // treat it as a regular character key instead (e.g., D -> L = わ)
      const hasPendingPreModifiers = pendingPreModifiers.size > 0;

      // Debug log for post-modifier keys
      if (postModFn !== undefined) {
        console.log('[KEY] Post-modifier key pressed:', event.code, '| Has pending:', hasPendingPreModifiers, '| Pending keys:', Array.from(pendingPreModifiers.keys()));
      }

      if (postModFn !== undefined && !hasPendingPreModifiers) {
        // Use as post-modifier only when no pending pre-modifiers
        const result = postModBuffer.tryModify(postModFn, event.timeStamp);
        console.log('[POST-MOD] tryModify result:', result);
        if (result.success && result.newChar !== null && result.oldChar !== null) {
          console.log('[POST-MOD] Transforming', String.fromCodePoint(result.oldChar), '→', String.fromCodePoint(result.newChar));
          // Calculate the time from when the original character was typed to now
          const timeToType = event.timeStamp - result.timeStamp;
          console.log('[POST-MOD] Calculated timeToType:', timeToType, 'ms');

          // Post-modification successful - emit clearChar to remove the old char from stats, then append new char
          const clearEvent: IInputEvent = {
            type: "input",
            timeStamp: event.timeStamp,
            inputType: "clearChar",
            codePoint: result.oldChar,
            timeToType: timeToType,
          };
          console.log('[POST-MOD] Sending clearEvent for', String.fromCodePoint(result.oldChar), 'with timeToType:', timeToType);
          target.onInput(clearEvent);

          const appendEvent: IInputEvent = {
            type: "input",
            timeStamp: event.timeStamp,
            inputType: "appendChar",
            codePoint: result.newChar,
            timeToType: timeToType,
          };
          console.log('[POST-MOD] Sending appendEvent for', String.fromCodePoint(result.newChar), 'with timeToType:', timeToType);
          target.onInput(appendEvent);
        } else {
          console.log('[POST-MOD] Modification failed or invalid result');
        }
        // Post-modification succeeded or failed - don't output the modifier character itself
        // Pass through the keydown event and return
        target.onKeyDown(event);
        return;
      } else if (postModFn !== undefined && hasPendingPreModifiers) {
        console.log('[POST-MOD] Post-modifier', event.code, 'with pending pre-modifiers - treating as regular key');
        // Fall through to regular key handling
      }

      // Check if this key is a pre-modifier
      // Only treat as pre-modifier if no keyboard modifiers (Shift/Alt) are pressed
      const hasModifiers = event.modifiers.includes("Shift") || event.modifiers.includes("Alt");
      if (isPreModifier(event.code) && !hasModifiers) {
        // If there are already pending pre-modifiers, treat this key as a regular character key
        // This allows K -> D to output "ら" (D at layer 5)
        if (pendingPreModifiers.size > 0) {
          console.log('[PRE-MOD] Pre-modifier', event.code, 'pressed with pending modifiers - treating as regular key');
          // Don't add to pending, fall through to regular key handling
        } else {
          // Add this pre-modifier to the pending set
          pendingPreModifiers.set(event.code, {
            timeStamp: event.timeStamp,
            event,
          });
          console.log('[PRE-MOD] Added pre-modifier:', event.code, '-> layer', chordMeta.chordModifiers[event.code], '| Total pending:', pendingPreModifiers.size);

          // Reset timeout - extend the window for sequential input
          if (preModifierTimeout) {
            clearTimeout(preModifierTimeout);
          }
          preModifierTimeout = setTimeout(clearPendingPreModifiers, PRE_MODIFIER_TIMEOUT);

          // Pass through the keydown event
          target.onKeyDown(event);
          return;
        }
      }

      // This is a regular character key (or pre-modifier treated as regular) - check if we have pending pre-modifiers
      const chordLayer = getCombinedChordLayer();
      if (chordLayer > 0) {
        console.log('[CHORD] Using combined chord layer', chordLayer, 'for key', event.code);
        // Clear pending pre-modifiers (they've been consumed)
        clearPendingPreModifiers();
      }

      // Get the character for this key + chord layer + modifiers
      const characters = keyboard.getCharacters(event.code);
      if (characters) {
        const modifier = toKeyModifier(event.modifiers);
        const codePoint = characters.getCodePointForChord(chordLayer, modifier);
        console.log('[LOOKUP] Key:', event.code, 'Layer:', chordLayer, 'Modifier:', modifier, '-> CodePoint:', codePoint ? `${String.fromCodePoint(codePoint)} (U+${codePoint.toString(16).toUpperCase()})` : 'null');

        if (codePoint !== null) {
          // Record the character in the post-modifier buffer
          postModBuffer.recordChar(codePoint, event.timeStamp);

          // Emit input event
          const inputEvent: IInputEvent = {
            type: "input",
            timeStamp: event.timeStamp,
            inputType: "appendChar",
            codePoint,
            timeToType: 0,
          };
          console.log('[CHORD-EMU] Sending appendChar:', String.fromCodePoint(codePoint), 'at', event.timeStamp);
          target.onInput(inputEvent);
        }
      }

      // Pass through the keydown event
      target.onKeyDown(event);
    },

    onKeyUp: (event: IKeyboardEvent): void => {
      // Pre-modifiers are released but kept in pending state
      // They will be cleared by timeout or consumed by the next regular key
      if (isPreModifier(event.code)) {
        console.log('[KEYUP] Pre-modifier released:', event.code, '| Pending:', Array.from(pendingPreModifiers.keys()));
      }

      target.onKeyUp(event);
    },

    onInput: (event: IInputEvent): void => {
      // Handle non-appendChar input events (like clearWord, etc.)
      if (event.inputType !== "appendChar") {
        if (event.inputType === "clearChar" || event.inputType === "clearWord") {
          // Clear both buffers
          postModBuffer.clear();
          clearPendingPreModifiers();
        }
        target.onInput(event);
      }
      // appendChar events are generated by onKeyDown, so we skip them here
    },
  };
}
