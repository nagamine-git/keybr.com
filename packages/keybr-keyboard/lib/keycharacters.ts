import { isNumber, isObject } from "@keybr/lang";
import { type CodePoint } from "@keybr/unicode";
import { KeyModifier } from "./keymodifier.ts";
import {
  type Character,
  type DeadCharacter,
  type KeyId,
  type LigatureCharacter,
  type SpecialCharacter,
} from "./types.ts";

export class KeyCharacters {
  static isCodePoint = (ch: unknown | null): ch is CodePoint => {
    return isNumber(ch) && ch > 0x0000;
  };

  static isDead = (ch: unknown | null): ch is DeadCharacter => {
    return isObject(ch) && "dead" in ch;
  };

  static isSpecial = (ch: unknown | null): ch is SpecialCharacter => {
    return isObject(ch) && "special" in ch;
  };

  static isLigature = (ch: unknown | null): ch is LigatureCharacter => {
    return isObject(ch) && "ligature" in ch;
  };

  readonly id: KeyId;
  readonly a: Character | null;
  readonly b: Character | null;
  readonly c: Character | null;
  readonly d: Character | null;
  /** Extended character array for chord layouts (optional, length 7+) */
  readonly characters?: readonly (Character | null)[];

  constructor(
    id: KeyId,
    a: Character | null,
    b: Character | null,
    c: Character | null,
    d: Character | null,
    characters?: readonly (Character | null)[],
  ) {
    this.id = id;
    this.a = a || null;
    this.b = b || null;
    this.c = c || null;
    this.d = d || null;
    this.characters = characters;
  }

  getCodePoint(modifier: KeyModifier): CodePoint | null {
    switch (modifier) {
      case KeyModifier.None:
        return select(this.a);
      case KeyModifier.Shift:
        return select(this.b, this.a);
      case KeyModifier.Alt:
        return select(this.c, this.b, this.a);
      case KeyModifier.ShiftAlt:
        return select(this.d, this.c, this.b, this.a);
      default:
        throw new Error();
    }
  }

  /**
   * Gets the code point for a chord layout key press.
   * Supports extended character arrays with multiple chord layers.
   *
   * @param chordLayer The chord layer index (0 = base, 4 = ★, 5 = ☆, 6 = ※)
   * @param modifier The key modifier (None, Shift, Alt, ShiftAlt)
   * @returns The code point for the key+layer+modifier combination, or null
   *
   * Character array slots for chord layouts (length 7):
   * [0] = None, [1] = Shift, [2] = Alt, [3] = ShiftAlt,
   * [4] = ★ (KeyD), [5] = ☆ (KeyK), [6] = ※ (KeyF)
   */
  getCodePointForChord(
    chordLayer: number,
    modifier: KeyModifier,
  ): CodePoint | null {
    // If no extended characters or base layer, use standard method
    if (!this.characters || this.characters.length <= 4 || chordLayer === 0) {
      return this.getCodePoint(modifier);
    }

    // For chord layers, the layer index IS the base index
    // Standard modifiers don't apply within chord layers for this layout
    // (each chord layer only has one character per key)
    const char = this.characters[chordLayer];

    // Fallback: try base layer with modifier if chord layer is empty
    if (char == null) {
      return this.getCodePoint(modifier);
    }

    return select(char);
  }

  get valid() {
    return Boolean(this.a || this.b || this.c || this.d);
  }
}

function select(...characters: (Character | null)[]): CodePoint | null {
  for (const character of characters) {
    if (character != null) {
      if (KeyCharacters.isCodePoint(character)) {
        return character;
      } else {
        break;
      }
    }
  }
  return null;
}
