import { type CodePoint } from "@keybr/unicode";

export type WeightedCodePointSet = {
  readonly size: number;
  has(codePoint: CodePoint): boolean;
  weight(codePoint: CodePoint): number;
} & Iterable<CodePoint>;

export type KeyId = string;

export type ZoneId =
  // Finger zones.
  | "pinky"
  | "ring"
  | "middle"
  | "leftIndex"
  | "rightIndex"
  | "thumb"
  // Hand zones.
  | "left"
  | "right"
  // Row zones.
  | "digit"
  | "top"
  | "home"
  | "bottom";

export type DeadCharacter = { readonly dead: CodePoint };

export type SpecialCharacter = { readonly special: CodePoint };

export type LigatureCharacter = { readonly ligature: string };

export type Character =
  | CodePoint
  | DeadCharacter
  | SpecialCharacter
  | LigatureCharacter;

export type CharacterDict = {
  readonly [id: KeyId]: readonly (Character | null)[];
};

/**
 * Metadata for chord-based keyboard layouts where certain keys act as modifiers.
 * Used by layouts like 月配列 (Tsuki) that use chord/combo keys.
 */
export type ChordLayoutMetadata = {
  /**
   * Maps chord modifier keys to their layer index.
   * Example: { KeyD: 4, KeyK: 5, KeyF: 6 }
   * When KeyD is held, characters are looked up at index 4.
   */
  readonly chordModifiers: { readonly [id: KeyId]: number };
  /**
   * Maps post-modifier keys to their character transformation functions.
   * Example: { KeyL: applyDakuten, Slash: applyHandakuten }
   * When pressed after a character, transforms the previous character.
   */
  readonly postModifiers: {
    readonly [id: KeyId]: (char: CodePoint) => CodePoint | null;
  };
  /**
   * Total number of layers in the character arrays.
   * Standard layouts: 4 (none, shift, alt, shift+alt)
   * Chord layouts: 7+ (standard + chord layers)
   */
  readonly layerCount: number;
};

export type GeometryDict = {
  readonly [id: KeyId]: {
    readonly x: number;
    readonly y: number;
    readonly w?: number;
    readonly h?: number;
    readonly labels?: readonly LabelShape[];
    readonly shape?: string;
    readonly zones?: readonly ZoneId[];
    readonly homing?: boolean;
  };
};

/** A static text label on a key cap. */
export type LabelShape = {
  readonly text: string;
  readonly pos?: readonly [x: number, y: number];
  readonly align?: readonly [
    h: /* start */ "s" | /* middle */ "m" | /* end */ "e",
    v: /* bottom */ "b" | /* middle */ "m" | /* top */ "t",
  ];
};

export type ZoneFilter = {
  readonly zones: readonly ZoneId[];
  readonly dead: boolean;
  readonly shift: boolean;
  readonly alt: boolean;
};
