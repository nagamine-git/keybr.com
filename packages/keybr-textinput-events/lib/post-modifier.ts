import { type CodePoint } from "@keybr/unicode";

/**
 * Result of attempting to apply a post-modifier transformation.
 */
export type PostModifyResult = {
  /** Whether the modification was successfully applied */
  readonly success: boolean;
  /** The new modified character (if successful) or null */
  readonly newChar: CodePoint | null;
  /** The old character that was replaced (if successful) or null */
  readonly oldChar: CodePoint | null;
};

/**
 * Buffer that tracks the last emitted character to allow post-modification.
 *
 * Used by chord layouts like 月配列2-263 to support dakuten (゛) and handakuten (゜)
 * which modify the previously typed character rather than producing a new character.
 *
 * @example
 * ```typescript
 * const buffer = new PostModifierBuffer();
 *
 * // Type か (ka)
 * buffer.recordChar(0x304b);
 *
 * // Press dakuten key
 * const result = buffer.tryModify(applyDakuten);
 * // result.success === true
 * // result.newChar === 0x304c (が)
 *
 * // Try dakuten on non-applicable character
 * buffer.recordChar(0x3042); // あ (a)
 * const result2 = buffer.tryModify(applyDakuten);
 * // result2.success === false
 * // result2.newChar === null
 * ```
 */
export class PostModifierBuffer {
  private lastChar: CodePoint | null = null;

  /**
   * Records a character that was just emitted.
   * This character can be modified by subsequent post-modifier key presses.
   *
   * @param char The character code point to record
   */
  recordChar(char: CodePoint): void {
    this.lastChar = char;
  }

  /**
   * Attempts to apply a post-modification function to the last recorded character.
   *
   * @param modifierFn Function that transforms a character (e.g., adds dakuten)
   * @returns Result object with success flag and modified character
   */
  tryModify(modifierFn: (char: CodePoint) => CodePoint | null): PostModifyResult {
    // No previous character to modify
    if (this.lastChar === null) {
      return { success: false, newChar: null, oldChar: null };
    }

    // Try to apply the modification
    const oldChar = this.lastChar;
    const modified = modifierFn(oldChar);

    if (modified !== null) {
      // Modification successful - update the buffer with the new character
      this.lastChar = modified;
      return { success: true, newChar: modified, oldChar };
    }

    // Modification not applicable to this character
    return { success: false, newChar: null, oldChar: null };
  }

  /**
   * Clears the buffer. Called when starting a new word or resetting input.
   */
  clear(): void {
    this.lastChar = null;
  }

  /**
   * Returns the last recorded character (for debugging/testing).
   */
  getLastChar(): CodePoint | null {
    return this.lastChar;
  }
}
