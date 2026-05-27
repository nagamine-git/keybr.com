// Generated file for 新月配列 (Shingetsu) keyboard layout
// This layout uses chord-based input where KeyD (★) and KeyK (☆) act as prefix
// modifier keys, and KeyL (゛/゜小) acts as a post-modifier that transforms the
// previously typed character.
//
// The layout is derived directly from the canonical definition:
//   shingetsu-layout/shingetsu_analyzer.json (conversion) and
//   shingetsu-layout/shingetsu-ansi-qwerty.tsv
//
// Canonical encoding -> keybr slots:
//   shift:[]    (1 keystroke)     -> base layer   (index 0)
//   shift:["d"] (★ prefix, KeyD)  -> ★ layer      (index 4)
//   shift:["k"] (☆ prefix, KeyK)  -> ☆ layer      (index 5)
//   l  = ゛ (dakuten), l,l = ゜ (handakuten)  -> KeyL post-modifier
//
// Voiced (濁音), semi-voiced (半濁音) and small kana (小書き) are NOT stored in
// slots. They are produced canonically as 清音 + post-modifier (KeyL), e.g.
//   が = か(s) + ゛(l),  ぱ = は(a) + ゛(l) + ゜(l).
// Compound youon (拗音, e.g. きゃ) are typed as two ordinary characters in
// sequence (き then ゃ), matching how the engine processes each keystroke.

import { type CodePoint } from "@keybr/unicode";
import { type CharacterDict, type ChordLayoutMetadata } from "../types.ts";

// Character array slots: [None, Shift, Alt, ShiftAlt, ★(KeyD, index4), ☆(KeyK, index5)]

// prettier-ignore
export const LAYOUT_JA_SHINGETSU: CharacterDict = {
  // Top row - Numbers (no hiragana)
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
  KeyQ: [/* HIRAGANA LETTER SO */ 0x305d, null, null, null, null, /* HIRAGANA LETTER YU */ 0x3086],
  KeyW: [/* HIRAGANA LETTER KO */ 0x3053, null, null, null, null, /* HIRAGANA LETTER HI */ 0x3072],
  KeyE: [/* HIRAGANA LETTER SI */ 0x3057, null, null, null, null, /* HIRAGANA LETTER HO */ 0x307b],
  KeyR: [/* HIRAGANA LETTER TE */ 0x3066, null, null, null, null, /* HIRAGANA LETTER HU */ 0x3075],
  KeyT: [/* HIRAGANA LETTER SMALL YO */ 0x3087, null, null, null, null, /* HIRAGANA LETTER ME */ 0x3081],
  KeyY: [/* HIRAGANA LETTER TU */ 0x3064, null, null, null, /* HIRAGANA LETTER NU */ 0x306c, null],
  KeyU: [/* HIRAGANA LETTER N */ 0x3093, null, null, null, /* HIRAGANA LETTER E */ 0x3048, null],
  KeyI: [/* HIRAGANA LETTER I */ 0x3044, null, null, null, /* HIRAGANA LETTER MI */ 0x307f, null],
  KeyO: [/* HIRAGANA LETTER NO */ 0x306e, null, null, null, /* HIRAGANA LETTER YA */ 0x3084, null],
  KeyP: [/* HIRAGANA LETTER RI */ 0x308a, null, null, null, /* KATAKANA-HIRAGANA PROLONGED SOUND MARK */ 0x30fc, null],
  BracketLeft: [/* LEFT CORNER BRACKET */ 0x300c, null, null, null, null, null],
  BracketRight: [/* RIGHT CORNER BRACKET */ 0x300d, null, null, null, null, null],
  Backslash: [null, null, null, null, null, null],

  // ASDF row (home row)
  KeyA: [/* HIRAGANA LETTER HA */ 0x306f, null, null, null, null, /* HIRAGANA LETTER A */ 0x3042],
  KeyS: [/* HIRAGANA LETTER KA */ 0x304b, null, null, null, null, /* HIRAGANA LETTER WO */ 0x3092],
  KeyD: [null, null, null, null, null, /* HIRAGANA LETTER RA */ 0x3089], // ★ modifier key (☆d = ら)
  KeyF: [/* HIRAGANA LETTER TO */ 0x3068, null, null, null, null, /* HIRAGANA LETTER RE */ 0x308c],
  KeyG: [/* HIRAGANA LETTER TA */ 0x305f, null, null, null, null, /* HIRAGANA LETTER YO */ 0x3088],
  KeyH: [/* HIRAGANA LETTER KU */ 0x304f, null, null, null, /* HIRAGANA LETTER MA */ 0x307e, null],
  KeyJ: [/* HIRAGANA LETTER U */ 0x3046, null, null, null, /* HIRAGANA LETTER O */ 0x304a, null],
  KeyK: [null, null, null, null, /* HIRAGANA LETTER MO */ 0x3082, null], // ☆ modifier key (★k = も)
  KeyL: [null, null, null, null, /* HIRAGANA LETTER WA */ 0x308f, null], // ゛゜小 post-modifier (★l = わ)
  Semicolon: [/* HIRAGANA LETTER KI */ 0x304d, null, null, null, /* HIRAGANA LETTER TI */ 0x3061, null],
  Quote: [null, null, null, null, null, null],

  // ZXCV row
  KeyZ: [/* HIRAGANA LETTER SU */ 0x3059, null, null, null, null, /* HIRAGANA LETTER NE */ 0x306d],
  KeyX: [/* HIRAGANA LETTER KE */ 0x3051, null, null, null, null, /* HIRAGANA LETTER HE */ 0x3078],
  KeyC: [/* HIRAGANA LETTER NI */ 0x306b, null, null, null, null, /* HIRAGANA LETTER SE */ 0x305b],
  KeyV: [/* HIRAGANA LETTER NA */ 0x306a, null, null, null, null, /* HIRAGANA LETTER SMALL YU */ 0x3085],
  KeyB: [/* HIRAGANA LETTER SA */ 0x3055, null, null, null, null, /* HIRAGANA LETTER SMALL YA */ 0x3083],
  KeyN: [/* HIRAGANA LETTER SMALL TU */ 0x3063, null, null, null, /* HIRAGANA LETTER MU */ 0x3080, null],
  KeyM: [/* HIRAGANA LETTER RU */ 0x308b, null, null, null, /* HIRAGANA LETTER RO */ 0x308d, null],
  Comma: [/* IDEOGRAPHIC COMMA */ 0x3001, null, null, null, null, null],
  Period: [/* IDEOGRAPHIC FULL STOP */ 0x3002, null, null, null, null, null],
  Slash: [/* KATAKANA MIDDLE DOT */ 0x30fb, null, null, null, null, null],

  // Space
  Space: [/* SPACE */ 0x0020, /* SPACE */ 0x0020, null, null, null, null],
};

// Post-modifier (KeyL = ゛/゜小) transition map.
//
// In 新月配列, a single physical key (l) carries dakuten (゛), handakuten (゜)
// and the small-kana modifier. Pressing it once applies the first transition,
// pressing it again applies the second. The PostModifierBuffer feeds the
// previously emitted character back in, so a single chained map reproduces the
// canonical behaviour:
//   は -(l)-> ば -(l)-> ぱ
//   あ -(l)-> ぁ
//   う -(l)-> ゔ -(l)-> ぅ
//   わ -(l)-> ;   (canonical 半角セミコロン: ★l=わ, then l)
const postModifierMap = new Map<CodePoint, CodePoint>([
  // 清音 -> 濁音 (first press)
  [0x304b, 0x304c], // か -> が
  [0x304d, 0x304e], // き -> ぎ
  [0x304f, 0x3050], // く -> ぐ
  [0x3051, 0x3052], // け -> げ
  [0x3053, 0x3054], // こ -> ご
  [0x3055, 0x3056], // さ -> ざ
  [0x3057, 0x3058], // し -> じ
  [0x3059, 0x305a], // す -> ず
  [0x305b, 0x305c], // せ -> ぜ
  [0x305d, 0x305e], // そ -> ぞ
  [0x305f, 0x3060], // た -> だ
  [0x3061, 0x3062], // ち -> ぢ
  [0x3064, 0x3065], // つ -> づ
  [0x3066, 0x3067], // て -> で
  [0x3068, 0x3069], // と -> ど
  [0x306f, 0x3070], // は -> ば
  [0x3072, 0x3073], // ひ -> び
  [0x3075, 0x3076], // ふ -> ぶ
  [0x3078, 0x3079], // へ -> べ
  [0x307b, 0x307c], // ほ -> ぼ
  [0x3046, 0x3094], // う -> ゔ
  // 濁音(は行) -> 半濁音 (second press)
  [0x3070, 0x3071], // ば -> ぱ
  [0x3073, 0x3074], // び -> ぴ
  [0x3076, 0x3077], // ぶ -> ぷ
  [0x3079, 0x307a], // べ -> ぺ
  [0x307c, 0x307d], // ぼ -> ぽ
  // 母音 -> 小書き (first press)
  [0x3042, 0x3041], // あ -> ぁ
  [0x3044, 0x3043], // い -> ぃ
  [0x3048, 0x3047], // え -> ぇ
  [0x304a, 0x3049], // お -> ぉ
  // う系: first press う->ゔ (above), second press ゔ -> ぅ
  [0x3094, 0x3045], // ゔ -> ぅ
  // ★l = わ, さらに l で半角セミコロン ;
  [0x308f, 0x003b], // わ -> ;
]);

/**
 * Applies the 新月配列 post-modifier (KeyL = ゛/゜小) to the previously typed
 * character. The same key chains dakuten -> handakuten and vowel -> small kana,
 * so this single function reproduces the canonical multi-press behaviour when
 * driven by the PostModifierBuffer.
 *
 * @param baseChar The previously typed character to transform
 * @returns The transformed character, or null if no transition applies
 */
export function applyShingetsuPostModifier(
  baseChar: CodePoint,
): CodePoint | null {
  return postModifierMap.get(baseChar) ?? null;
}

/**
 * Metadata for the 新月配列 chord layout.
 * KeyD (★) and KeyK (☆) are prefix modifiers; KeyL is a post-modifier.
 */
export const SHINGETSU_CHORD_METADATA: ChordLayoutMetadata = {
  chordModifiers: {
    KeyD: 4, // ★ layer
    KeyK: 5, // ☆ layer
  },
  postModifiers: {
    KeyL: applyShingetsuPostModifier,
  },
  layerCount: 6,
};

/**
 * Custom learning order for 新月配列.
 *
 * Ordered by 清音 / 小書き / 記号 only. Voiced (濁音) and semi-voiced (半濁音)
 * characters are produced canonically as 清音 + post-modifier (KeyL) and are
 * therefore not first-class learning targets; they are appended after the
 * 清音 set so that mastering the base layer also covers their input.
 */
export const SHINGETSU_LEARNING_ORDER = new Map<CodePoint, number>([
  // High-frequency base (無修飾) characters first
  [0x3044, 1], // い
  [0x3046, 2], // う
  [0x3093, 3], // ん
  [0x3057, 4], // し
  [0x304b, 5], // か
  [0x306e, 6], // の
  [0x3068, 7], // と
  [0x305f, 8], // た
  [0x3066, 9], // て
  [0x304f, 10], // く
  [0x306a, 11], // な
  [0x306b, 12], // に
  [0x304d, 13], // き
  [0x306f, 14], // は
  [0x3053, 15], // こ
  [0x308b, 16], // る
  [0x3059, 17], // す
  [0x3063, 18], // っ
  [0x3087, 19], // ょ
  [0x307e, 20], // ま
  [0x308a, 21], // り
  [0x3064, 22], // つ
  [0x304a, 23], // お (★;)
  [0x3055, 24], // さ
  [0x3082, 25], // も (★k)
  [0x3089, 26], // ら (☆d)
  [0x3092, 27], // を (☆s)
  [0x3042, 28], // あ (☆a)
  [0x308c, 29], // れ (☆f)
  [0x3061, 30], // ち (★;)
  [0x305b, 31], // せ (☆c)
  [0x3051, 32], // け
  [0x30fc, 33], // ー (★p)
  [0x3088, 34], // よ (☆g)
  [0x3085, 35], // ゅ (☆v)
  [0x305d, 36], // そ
  [0x3048, 37], // え (★u)
  [0x308f, 38], // わ (★l)
  [0x307f, 39], // み (★i)
  [0x3081, 40], // め (☆t)
  [0x3072, 41], // ひ (☆w)
  [0x3084, 42], // や (★o)
  [0x308d, 43], // ろ (★m)
  [0x307b, 44], // ほ (☆e)
  [0x3075, 45], // ふ (☆r)
  [0x3083, 46], // ゃ (☆b)
  [0x306d, 47], // ね (☆z)
  [0x3080, 48], // む (★n)
  [0x3078, 49], // へ (☆x)
  [0x3086, 50], // ゆ (☆q)
  [0x306c, 51], // ぬ (★y)
  // Symbols
  [0x3001, 52], // 、
  [0x3002, 53], // 。
  [0x300c, 54], // 「
  [0x300d, 55], // 」
  [0x30fb, 56], // ・
  // 濁音・半濁音 (produced via 清音 + KeyL post-modifier) appended last
  [0x304c, 60], // が
  [0x304e, 61], // ぎ
  [0x3050, 62], // ぐ
  [0x3052, 63], // げ
  [0x3054, 64], // ご
  [0x3056, 65], // ざ
  [0x3058, 66], // じ
  [0x305a, 67], // ず
  [0x305c, 68], // ぜ
  [0x305e, 69], // ぞ
  [0x3060, 70], // だ
  [0x3062, 71], // ぢ
  [0x3065, 72], // づ
  [0x3067, 73], // で
  [0x3069, 74], // ど
  [0x3070, 75], // ば
  [0x3073, 76], // び
  [0x3076, 77], // ぶ
  [0x3079, 78], // べ
  [0x307c, 79], // ぼ
  [0x3094, 80], // ゔ
  [0x3071, 81], // ぱ
  [0x3074, 82], // ぴ
  [0x3077, 83], // ぷ
  [0x307a, 84], // ぺ
  [0x307d, 85], // ぽ
  // 小書き (produced via 母音 + KeyL post-modifier)
  [0x3041, 90], // ぁ
  [0x3043, 91], // ぃ
  [0x3045, 92], // ぅ
  [0x3047, 93], // ぇ
  [0x3049, 94], // ぉ
]);
