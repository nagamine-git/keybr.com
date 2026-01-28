// Generated file for 月配列2-263 (Tsuki-hairetsu 2-263) keyboard layout
// This layout uses chord-based input where KeyD and KeyK act as prefix shift modifier keys

import { type CharacterDict, type ChordLayoutMetadata } from "../types.ts";
import { type CodePoint } from "@keybr/unicode";

// Character array slots: [None, Shift, Alt, ShiftAlt, ★(KeyD), ☆(KeyK), ☆+゜(handakuten)]
// Extended slots (index 6+) for post-modifier results to enable key preview

// prettier-ignore
export const LAYOUT_JA_TSUKI_2_263: CharacterDict = {
  // Top row
  Backquote: [null, null, null, null, null, null],
  Digit1: [null, null, null, null, null, null],
  Digit2: [null, null, null, null, null, null],
  Digit3: [null, null, null, null, null, null],
  Digit4: [null, null, null, null, null, null],
  Digit5: [null, null, null, null, null, null],
  Digit6: [null, null, null, null, null, null],
  Digit7: [null, null, null, null, null, null],
  Digit8: [null, null, null, null, null, null],
  Digit9: [null, null, null, null, null, null],
  Digit0: [null, null, null, null, null, null],
  Minus: [null, null, null, null, null, null],
  Equal: [null, null, null, null, null, null],

  // QWERTY row
  KeyQ: [/* そ */ 0x305d, null, null, null, null, /* ぁ */ 0x3041],
  KeyW: [/* こ */ 0x3053, null, null, null, null, /* ひ */ 0x3072, /* ぴ */ 0x3074],
  KeyE: [/* し */ 0x3057, null, null, null, null, /* ほ */ 0x307b, /* ぽ */ 0x307d],
  KeyR: [/* て */ 0x3066, null, null, null, null, /* ふ */ 0x3075, /* ぷ */ 0x3077],
  KeyT: [/* ょ */ 0x3087, null, null, null, null, /* め */ 0x3081],
  KeyY: [/* つ */ 0x3064, null, null, null, /* ぬ */ 0x306c, null],
  KeyU: [/* ん */ 0x3093, null, null, null, /* え */ 0x3048, null],
  KeyI: [/* い */ 0x3044, null, null, null, /* み */ 0x307f, null],
  KeyO: [/* の */ 0x306e, null, null, null, /* や */ 0x3084, null],
  KeyP: [/* り */ 0x308a, null, null, null, /* ぇ */ 0x3047, null],
  BracketLeft: [/* ち */ 0x3061, null, null, null, null, null],
  BracketRight: [null, null, null, null, null, null],
  Backslash: [/* ・ */ 0x30fb, null, null, null, null, null],

  // ASDF row (home row)
  KeyA: [/* は */ 0x306f, /* ば */ 0x3070, /* ぱ */ 0x3071, null, null, /* ぃ */ 0x3043],
  KeyS: [/* か */ 0x304b, /* が */ 0x304c, null, null, null, /* を */ 0x3092],
  KeyD: [/* ★ */ 0x3057, /* じ */ 0x3058, null, null, null, /* ら */ 0x3089], // ★ modifier key (also types し when used alone)
  KeyF: [/* と */ 0x3068, /* ど */ 0x3069, null, null, null, /* あ */ 0x3042], // Normal key (k+f = あ)
  KeyG: [/* た */ 0x305f, /* だ */ 0x3060, null, null, null, /* よ */ 0x3088],
  KeyH: [/* く */ 0x304f, /* ぐ */ 0x3050, null, null, /* ま */ 0x307e, null],
  KeyJ: [/* う */ 0x3046, null, null, null, /* お */ 0x304a, null],
  KeyK: [/* の */ 0x306e, null, null, null, /* も */ 0x3082, null], // ☆ modifier key
  KeyL: [/* ゛ */ 0x309b, /* ゛ */ 0x309b, null, null, /* わ */ 0x308f, null], // Also dakuten post-modifier
  Semicolon: [/* き */ 0x304d, /* ぎ */ 0x304e, null, null, /* ゆ */ 0x3086, null],
  Quote: [/* れ */ 0x308c, null, null, null, null, null],

  // ZXCV row
  KeyZ: [/* す */ 0x3059, /* ず */ 0x305a, null, null, null, /* ぅ */ 0x3045],
  KeyX: [/* け */ 0x3051, /* げ */ 0x3052, null, null, null, /* へ */ 0x3078, /* ぺ */ 0x307a],
  KeyC: [/* に */ 0x306b, null, null, null, null, /* せ */ 0x305b],
  KeyV: [/* な */ 0x306a, null, null, null, null, /* ゅ */ 0x3085],
  KeyB: [/* さ */ 0x3055, /* ざ */ 0x3056, null, null, null, /* ゃ */ 0x3083],
  KeyN: [/* っ */ 0x3063, null, null, null, /* む */ 0x3080, null],
  KeyM: [/* る */ 0x308b, null, null, null, /* ろ */ 0x308d, null],
  Comma: [/* 、 */ 0x3001, null, null, null, /* ね */ 0x306d, null],
  Period: [/* 。 */ 0x3002, null, null, null, null, null],
  Slash: [/* ゜ */ 0x309c, /* ゜ */ 0x309c, null, null, /* ぉ */ 0x3049, null], // Also handakuten post-modifier

  // Space
  Space: [/* SPACE */ 0x0020, /* SPACE */ 0x0020, null, null, null, null],
};

// Dakuten (゛) conversion map: か→が, き→ぎ, etc.
const dakutenMap = new Map<CodePoint, CodePoint>([
  // か行 → が行
  [0x304b, 0x304c], // か → が
  [0x304d, 0x304e], // き → ぎ
  [0x304f, 0x3050], // く → ぐ
  [0x3051, 0x3052], // け → げ
  [0x3053, 0x3054], // こ → ご
  // さ行 → ざ行
  [0x3055, 0x3056], // さ → ざ
  [0x3057, 0x3058], // し → じ
  [0x3059, 0x305a], // す → ず
  [0x305b, 0x305c], // せ → ぜ
  [0x305d, 0x305e], // そ → ぞ
  // た行 → だ行
  [0x305f, 0x3060], // た → だ
  [0x3061, 0x3062], // ち → ぢ
  [0x3064, 0x3065], // つ → づ
  [0x3066, 0x3067], // て → で
  [0x3068, 0x3069], // と → ど
  // は行 → ば行
  [0x306f, 0x3070], // は → ば
  [0x3072, 0x3073], // ひ → び
  [0x3075, 0x3076], // ふ → ぶ
  [0x3078, 0x3079], // へ → べ
  [0x307b, 0x307c], // ほ → ぼ
]);

// Handakuten (゜) conversion map: は→ぱ, ひ→ぴ, etc.
const handakutenMap = new Map<CodePoint, CodePoint>([
  [0x306f, 0x3071], // は → ぱ
  [0x3072, 0x3074], // ひ → ぴ
  [0x3075, 0x3077], // ふ → ぷ
  [0x3078, 0x307a], // へ → ぺ
  [0x307b, 0x307d], // ほ → ぽ
]);

/**
 * Applies dakuten (゛) to a hiragana character.
 * @param baseChar The base character to modify
 * @returns The modified character with dakuten, or null if not applicable
 */
export function applyDakuten(baseChar: CodePoint): CodePoint | null {
  return dakutenMap.get(baseChar) ?? null;
}

/**
 * Applies handakuten (゜) to a hiragana character.
 * @param baseChar The base character to modify
 * @returns The modified character with handakuten, or null if not applicable
 */
export function applyHandakuten(baseChar: CodePoint): CodePoint | null {
  return handakutenMap.get(baseChar) ?? null;
}

/**
 * Metadata for the 月配列2-263 chord layout.
 * Defines which keys act as chord modifiers and post-modifiers.
 */
export const TSUKI_2_263_CHORD_METADATA: ChordLayoutMetadata = {
  chordModifiers: {
    KeyD: 4, // ★ layer
    KeyK: 5, // ☆ layer
  },
  postModifiers: {
    KeyL: applyDakuten,
    Slash: applyHandakuten,
  },
  layerCount: 6,
};

/**
 * Custom learning order for 月配列2-263.
 * Order: は、か、う、き、ば、が、ど、ぎスタート + progression
 */
export const TSUKI_2_263_LEARNING_ORDER = new Map<CodePoint, number>([
  [0x306f, 1], // は
  [0x304b, 2], // か
  [0x3046, 3], // う
  [0x304d, 4], // き
  [0x3070, 5], // ば
  [0x304c, 6], // が
  [0x3069, 7], // ど
  [0x304e, 8], // ぎ
  [0x306e, 9], // の
  [0x306b, 10], // に
  [0x305f, 11], // た
  [0x3044, 12], // い
  [0x3092, 13], // を
  [0x3068, 14], // と
  [0x308b, 15], // る
  [0x3057, 16], // し
  [0x3067, 17], // で
  [0x3066, 18], // て
  [0x306a, 19], // な
  [0x3063, 20], // っ
  [0x308c, 21], // れ
  [0x3089, 22], // ら
  [0x3082, 23], // も
  [0x3059, 24], // す
  [0x308a, 25], // り
  [0x3053, 26], // こ
  [0x3060, 27], // だ
  [0x307e, 28], // ま
  [0x3055, 29], // さ
  [0x3081, 30], // め
  [0x304f, 31], // く
  [0x3042, 32], // あ
  [0x3051, 33], // け
  [0x3093, 34], // ん
  [0x3048, 35], // え
  [0x3088, 36], // よ
  [0x3064, 37], // つ
  [0x3084, 38], // や
  [0x305d, 39], // そ
  [0x308f, 40], // わ
  [0x3061, 41], // ち
  [0x307f, 42], // み
  [0x305b, 43], // せ
  [0x308d, 44], // ろ
  [0x304a, 45], // お
  [0x3058, 46], // じ
  [0x3079, 47], // べ
  [0x305a, 48], // ず
  [0x3052, 49], // げ
  [0x307b, 50], // ほ
  [0x3078, 51], // へ
  [0x3073, 52], // び
  [0x3080, 53], // む
  [0x3054, 54], // ご
  [0x306d, 55], // ね
  [0x3076, 56], // ぶ
  [0x3050, 57], // ぐ
  [0x3072, 58], // ひ
  [0x3087, 59], // ょ
  [0x3065, 60], // づ
  [0x307c, 61], // ぼ
  [0x3056, 62], // ざ
  [0x3075, 63], // ふ
  [0x3083, 64], // ゃ
  [0x305e, 65], // ぞ
  [0x3086, 66], // ゆ
  [0x305c, 67], // ぜ
  [0x306c, 68], // ぬ
  [0x3071, 69], // ぱ
  [0x3085, 70], // ゅ
  [0x3074, 71], // ぴ
  [0x307d, 72], // ぽ
  [0x3077, 73], // ぷ
  [0x307a, 74], // ぺ
  [0x3041, 75], // ぁ
  [0x3047, 76], // ぇ
  [0x3062, 77], // ぢ
  // Additional characters
  [0x3043, 78], // ぃ (A+☆)
  [0x3045, 79], // ぅ (Z+☆)
  [0x3049, 80], // ぉ (/+☆)
  [0x309b, 81], // ゛ (L)
  [0x309c, 82], // ゜ (/)
  [0x3001, 83], // 、 (,)
  [0x3002, 84], // 。 (.)
  [0x30fb, 85], // ・ (\)
]);
