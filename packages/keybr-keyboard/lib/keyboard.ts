import { type CodePoint, combineDiacritic, isDiacritic } from "@keybr/unicode";
import { type Geometry } from "./geometry.ts";
import { KeyCharacters } from "./keycharacters.ts";
import { KeyCombo } from "./keycombo.ts";
import { KeyModifier } from "./keymodifier.ts";
import { KeyShape } from "./keyshape.ts";
import { getExampleLetters, getExampleText } from "./language.ts";
import { type Layout } from "./layout.ts";
import { TSUKI_2_263_LEARNING_ORDER } from "./layout/ja_tsuki_2_263.ts";
import {
  type CharacterDict,
  type DeadCharacter,
  type GeometryDict,
  type KeyId,
  type WeightedCodePointSet,
  type ZoneFilter,
  type ZoneId,
} from "./types.ts";

export class Keyboard {
  readonly characters: ReadonlyMap<KeyId, KeyCharacters>;
  readonly combos: ReadonlyMap<CodePoint, KeyCombo>;
  readonly shapes: ReadonlyMap<KeyId, KeyShape>;
  readonly zones: ReadonlyMap<ZoneId, readonly KeyShape[]>;

  constructor(
    readonly layout: Layout,
    readonly geometry: Geometry,
    readonly characterDict: CharacterDict,
    readonly geometryDict: GeometryDict,
  ) {
    const characters = new Map<KeyId, KeyCharacters>();
    const combos = new Map<CodePoint, KeyCombo>();
    const shapes = new Map<KeyId, KeyShape>();
    const zones = new Map<ZoneId, KeyShape[]>();

    for (const [id, chars] of Object.entries(characterDict)) {
      const [a = null, b = null, c = null, d = null] = chars;
      // For chord layouts (length > 4), pass the full character array
      const keyChars =
        chars.length > 4
          ? new KeyCharacters(id, a, b, c, d, chars)
          : new KeyCharacters(id, a, b, c, d);
      characters.set(id, keyChars);
    }

    // Get chord modifier keys (D, K, F) that should not be registered as standalone keys
    const chordModifierKeys = new Set<KeyId>();
    if (layout.chordMetadata?.chordModifiers) {
      for (const keyId of Object.keys(layout.chordMetadata.chordModifiers)) {
        chordModifierKeys.add(keyId);
      }
    }

    for (const keyChars of characters.values()) {
      const { id, a, b, c, d } = keyChars;

      // Skip base character (index 0) for chord modifier keys
      // They should only work in combination with other keys
      const isChordModifier = chordModifierKeys.has(id);

      if (KeyCharacters.isCodePoint(a) && !isChordModifier) {
        addCombo(combos, a, id, KeyModifier.None);
      }
      if (KeyCharacters.isCodePoint(b)) {
        addCombo(combos, b, id, KeyModifier.Shift);
      }
      if (KeyCharacters.isCodePoint(c)) {
        addCombo(combos, c, id, KeyModifier.Alt);
      }
      if (KeyCharacters.isCodePoint(d)) {
        addCombo(combos, d, id, KeyModifier.ShiftAlt);
      }

      // For chord layouts, add combos for extended character array
      // This includes post-modifier results (dakuten, handakuten) and chord layers
      if (keyChars.characters && keyChars.characters.length > 4) {
        for (let i = 1; i < keyChars.characters.length; i++) {
          const char = keyChars.characters[i];
          if (KeyCharacters.isCodePoint(char)) {
            addCombo(combos, char, id, KeyModifier.None);
          }
        }
      }
    }

    for (const { id, a, b, c, d } of characters.values()) {
      if (KeyCharacters.isDead(a)) {
        addDeadCombo(combos, a, id, KeyModifier.None);
      }
      if (KeyCharacters.isDead(b)) {
        addDeadCombo(combos, b, id, KeyModifier.Shift);
      }
      if (KeyCharacters.isDead(c)) {
        addDeadCombo(combos, c, id, KeyModifier.Alt);
      }
      if (KeyCharacters.isDead(d)) {
        addDeadCombo(combos, d, id, KeyModifier.ShiftAlt);
      }
    }

    for (const [id, data] of Object.entries(
      layout.mod(geometry, geometryDict),
    )) {
      const shape = new KeyShape(id, data, characterDict[id] ?? null);
      shapes.set(id, shape);
      for (const zone of shape.zones) {
        let list = zones.get(zone);
        if (list == null) {
          zones.set(zone, (list = []));
        }
        list.push(shape);
      }
    }

    this.layout = layout;
    this.geometry = geometry;
    this.characters = characters;
    this.combos = combos;
    this.shapes = shapes;
    this.zones = zones;
  }

  getCharacters(id: KeyId): KeyCharacters | null {
    return this.characters.get(id) ?? null;
  }

  getCombo(codePoint: CodePoint): KeyCombo | null {
    return this.combos.get(codePoint) ?? null;
  }

  getShape(id: KeyId): KeyShape | null {
    return this.shapes.get(id) ?? null;
  }

  getCodePoints({
    zones,
    dead = true,
    shift = true,
    alt = true,
  }: Partial<ZoneFilter> = {}): WeightedCodePointSet {
    const list: CodePoint[] = [];
    const weights = new Map<CodePoint, number>();

    // Check if this is 月配列2-263 layout - use custom learning order
    const useTsukiLearningOrder = this.layout.id === "ja-tsuki-2-263";

    for (const combo of this.combos.values()) {
      const shape = this.getShape(combo.id);
      if (
        (combo.prefix == null || dead) &&
        (!combo.shift || shift) &&
        (!combo.alt || alt) &&
        (zones == null || shape?.inAnyZone(zones))
      ) {
        list.push(combo.codePoint);

        if (useTsukiLearningOrder) {
          // Use custom learning order for 月配列2-263
          const customWeight = TSUKI_2_263_LEARNING_ORDER.get(combo.codePoint);
          if (customWeight != null) {
            weights.set(combo.codePoint, customWeight);
          }
        } else {
          // Default behavior for other layouts
          switch (shape?.row) {
            case "home":
              weights.set(combo.codePoint, 1);
              break;
            case "top":
              weights.set(combo.codePoint, 2);
              break;
          }
        }
      }
    }

    // For chord layouts, also include extended character array characters (slots 4-6)
    for (const keyChars of this.characters.values()) {
      if (keyChars.characters && keyChars.characters.length > 4) {
        const shape = this.getShape(keyChars.id);
        if (zones == null || shape?.inAnyZone(zones)) {
          // Process chord layer characters (slots 4, 5, 6)
          for (let i = 4; i < keyChars.characters.length; i++) {
            const char = keyChars.characters[i];
            if (KeyCharacters.isCodePoint(char)) {
              list.push(char);

              if (useTsukiLearningOrder) {
                // Use custom learning order for chord characters
                const customWeight = TSUKI_2_263_LEARNING_ORDER.get(char);
                if (customWeight != null) {
                  weights.set(char, customWeight);
                }
              } else {
                // Default weight for chord characters
                weights.set(char, 3);
              }
            }
          }
        }
      }
    }

    const codePoints = new Set(list.sort((a, b) => a - b));
    return new (class implements WeightedCodePointSet {
      [Symbol.iterator](): IterableIterator<CodePoint> {
        return codePoints[Symbol.iterator]();
      }
      get size(): number {
        return codePoints.size;
      }
      has(codePoint: CodePoint): boolean {
        return codePoints.has(codePoint);
      }
      weight(codePoint: CodePoint): number {
        return weights.get(codePoint) ?? 1000;
      }
    })();
  }

  getExampleText(): string {
    return getExampleText(this.layout.language);
  }

  getExampleLetters(): CodePoint[] {
    const codePoints = this.getCodePoints();
    return getExampleLetters(this.layout.language).filter(codePoints.has);
  }
}

function setCombo(map: Map<CodePoint, KeyCombo>, combo: KeyCombo): void {
  const oldCombo = map.get(combo.codePoint);
  if (oldCombo == null || oldCombo.complexity > combo.complexity) {
    map.set(combo.codePoint, combo);
  }
}

function addCombo(
  map: Map<CodePoint, KeyCombo>,
  character: CodePoint,
  id: KeyId,
  modifier: KeyModifier,
): void {
  setCombo(map, new KeyCombo(character, id, modifier));
}

function addDeadCombo(
  map: Map<CodePoint, KeyCombo>,
  { dead }: DeadCharacter,
  id: KeyId,
  modifier: KeyModifier,
): void {
  if (isDiacritic(dead)) {
    const prefix = new KeyCombo(dead, id, modifier);
    for (const combo of map.values()) {
      if (combo.prefix == null) {
        const combinedCodePoint = combineDiacritic(combo.codePoint, dead);
        if (combinedCodePoint !== combo.codePoint) {
          setCombo(
            map,
            new KeyCombo(combinedCodePoint, combo.id, combo.modifier, prefix),
          );
        }
      }
    }
  }
}
