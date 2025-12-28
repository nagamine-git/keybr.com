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
  let pendingPreModifier: { code: KeyId; timeStamp: number; event: IKeyboardEvent } | null = null;

  // Check if a key is a pre-modifier (chord modifier key)
  const isPreModifier = (code: KeyId): boolean => {
    return chordMeta.chordModifiers[code] !== undefined;
  };

  // Flush pending pre-modifier (output its base character)
  const flushPendingPreModifier = () => {
    if (!pendingPreModifier) return;

    const { code, timeStamp, event: modEvent } = pendingPreModifier;
    console.log('[FLUSH] Flushing pre-modifier:', code);
    const characters = keyboard.getCharacters(code);
    if (characters) {
      const modifier = toKeyModifier(modEvent.modifiers);
      // Use getCodePoint directly for base layer (layer 0)
      const codePoint = characters.getCodePoint(modifier);
      console.log('[FLUSH] Base character lookup for', code, ':', codePoint ? String.fromCodePoint(codePoint) : 'null');

      if (codePoint !== null) {
        postModBuffer.recordChar(codePoint, timeStamp);

        const inputEvent: IInputEvent = {
          type: "input",
          timeStamp,
          inputType: "appendChar",
          codePoint,
          timeToType: 0,
        };
        target.onInput(inputEvent);
      }
    }

    pendingPreModifier = null;
  };

  return {
    onKeyDown: (event: IKeyboardEvent): void => {
      // Check if this is a post-modifier key
      const postModFn = chordMeta.postModifiers[event.code];
      if (postModFn) {
        // Flush pending pre-modifier before post-modification
        flushPendingPreModifier();

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
      }

      // Determine if we're using a chord layer from a pending pre-modifier
      let chordLayer = 0;
      if (pendingPreModifier) {
        // Use the pre-modifier to determine the chord layer
        chordLayer = chordMeta.chordModifiers[pendingPreModifier.code] ?? 0;
        console.log('[CHORD] Using chord layer', chordLayer, 'from pre-modifier', pendingPreModifier.code, 'for key', event.code);
        // Clear the pending pre-modifier (it's been consumed)
        pendingPreModifier = null;
      }
      // If no pending pre-modifier AND this key is a pre-modifier, store it
      else if (isPreModifier(event.code)) {
        // Store this pre-modifier as pending (don't output yet)
        pendingPreModifier = {
          code: event.code,
          timeStamp: event.timeStamp,
          event,
        };
        console.log('[PRE-MOD] Stored pre-modifier:', event.code, '-> layer', chordMeta.chordModifiers[event.code]);

        // Pass through the keydown event
        target.onKeyDown(event);
        return;
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
          target.onInput(inputEvent);
        }
      }

      // Pass through the keydown event
      target.onKeyDown(event);
    },

    onKeyUp: (event: IKeyboardEvent): void => {
      // Flush pending pre-modifier when the key is released
      // This handles the case where the user presses a pre-modifier and releases it
      // without pressing another key
      if (pendingPreModifier && pendingPreModifier.code === event.code) {
        console.log('[KEYUP] Pre-modifier released without consuming:', event.code);
        flushPendingPreModifier();
      }

      target.onKeyUp(event);
    },

    onInput: (event: IInputEvent): void => {
      // Handle non-appendChar input events (like clearWord, etc.)
      if (event.inputType !== "appendChar") {
        if (event.inputType === "clearChar" || event.inputType === "clearWord") {
          // Clear both buffers
          postModBuffer.clear();
          pendingPreModifier = null;
        }
        target.onInput(event);
      }
      // appendChar events are generated by onKeyDown, so we skip them here
    },
  };
}
