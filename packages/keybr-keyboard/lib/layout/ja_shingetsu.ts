// Generated file for 新月配列 (Shingetsu) keyboard layout
// This layout uses chord-based input where KeyD (★) and KeyK (☆) act as prefix modifier keys
// Based on shingetsu-ansi.tsv configuration

import { type CharacterDict, type ChordLayoutMetadata } from "../types.ts";
import { type CodePoint } from "@keybr/unicode";

// Character array slots: [None, Shift, Alt, ShiftAlt, ★(KeyD), ☆(KeyK)]

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
  // q: ほ, ☆q: ぼ, ★q: ぽ
  KeyQ: [/* ほ */ 0x307b, null, null, null, /* ぽ */ 0x307d, /* ぼ */ 0x307c],
  // w: ひ, ☆w: び, ★w: ぴ
  KeyW: [/* ひ */ 0x3072, null, null, null, /* ぴ */ 0x3074, /* び */ 0x3073],
  // e: し, ☆e: じ, ★e: ぁ
  KeyE: [/* し */ 0x3057, null, null, null, /* ぁ */ 0x3041, /* じ */ 0x3058],
  // r: て, ☆r: で, ★r: み
  KeyR: [/* て */ 0x3066, null, null, null, /* み */ 0x307f, /* で */ 0x3067],
  // t: ょ, ☆t: よ, ★t: む
  KeyT: [/* ょ */ 0x3087, null, null, null, /* む */ 0x3080, /* よ */ 0x3088],
  // y: る, ☆y: け, ★y: げ
  KeyY: [/* る */ 0x308b, null, null, null, /* げ */ 0x3052, /* け */ 0x3051],
  // u: す, ☆u: ぬ, ★u: ず
  KeyU: [/* す */ 0x3059, null, null, null, /* ず */ 0x305a, /* ぬ */ 0x306c],
  // i: う, ☆i: ぇ, ★i: も
  KeyI: [/* う */ 0x3046, null, null, null, /* も */ 0x3082, /* ぇ */ 0x3047],
  // o: き, ☆o: ろ, ★o: ぎ
  KeyO: [/* き */ 0x304d, null, null, null, /* ぎ */ 0x304e, /* ろ */ 0x308d],
  // p: こ, ☆p: ; (semicolon), ★p: ご
  KeyP: [/* こ */ 0x3053, null, null, null, /* ご */ 0x3054, /* ; */ 0x003b],
  BracketLeft: [/* 「 */ 0x300c, null, null, null, null, null],
  BracketRight: [/* 」 */ 0x300d, null, null, null, null, null],
  Backslash: [/* ・ */ 0x30fb, null, null, null, null, null],

  // ASDF row (home row)
  // a: は, ☆a: ば, ★a: ぱ
  KeyA: [/* は */ 0x306f, null, null, null, /* ぱ */ 0x3071, /* ば */ 0x3070],
  // s: か, ☆s: が, ★s: ら
  KeyS: [/* か */ 0x304b, null, null, null, /* ら */ 0x3089, /* が */ 0x304c],
  // d: ★ (modifier), ☆d: り, ★d: (modifier)
  KeyD: [null, null, null, null, null, /* り */ 0x308a], // ★ modifier key
  // f: と, ☆f: ど, ★f: あ
  KeyF: [/* と */ 0x3068, null, null, null, /* あ */ 0x3042, /* ど */ 0x3069],
  // g: た, ☆g: だ, ★g: わ
  KeyG: [/* た */ 0x305f, null, null, null, /* わ */ 0x308f, /* だ */ 0x3060],
  // h: く, ☆h: れ, ★h: ぐ
  KeyH: [/* く */ 0x304f, null, null, null, /* ぐ */ 0x3050, /* れ */ 0x308c],
  // j: ん, ☆j: さ, ★j: ざ
  KeyJ: [/* ん */ 0x3093, null, null, null, /* ざ */ 0x3056, /* さ */ 0x3055],
  // k: ☆ (modifier), ★k: え
  KeyK: [null, null, null, null, /* え */ 0x3048, null], // ☆ modifier key
  // l: い, ☆l: ー, ★l: を
  KeyL: [/* い */ 0x3044, null, null, null, /* を */ 0x3092, /* ー */ 0x30fc],
  // ;: の, ☆;: ぉ, ★;: お
  Semicolon: [/* の */ 0x306e, null, null, null, /* お */ 0x304a, /* ぉ */ 0x3049],
  // ': ' (single quote)
  Quote: [/* ' */ 0x0027, null, null, null, null, null],

  // ZXCV row
  // z: へ, ☆z: べ, ★z: ぺ
  KeyZ: [/* へ */ 0x3078, null, null, null, /* ぺ */ 0x307a, /* べ */ 0x3079],
  // x: ふ, ☆x: ぶ, ★x: ぷ
  KeyX: [/* ふ */ 0x3075, null, null, null, /* ぷ */ 0x3077, /* ぶ */ 0x3076],
  // c: に, ☆c: ゅ, ★c: ゆ
  KeyC: [/* に */ 0x306b, null, null, null, /* ゆ */ 0x3086, /* ゅ */ 0x3085],
  // v: ま, ☆v: せ, ★v: ぜ
  KeyV: [/* ま */ 0x307e, null, null, null, /* ぜ */ 0x305c, /* せ */ 0x305b],
  // b: や, ☆b: ゃ, ★b: ね
  KeyB: [/* や */ 0x3084, null, null, null, /* ね */ 0x306d, /* ゃ */ 0x3083],
  // n: っ, ☆n: づ, ★n: つ
  KeyN: [/* っ */ 0x3063, null, null, null, /* つ */ 0x3064, /* づ */ 0x3065],
  // m: な, ☆m: ち, ★m: ぢ
  KeyM: [/* な */ 0x306a, null, null, null, /* ぢ */ 0x3062, /* ち */ 0x3061],
  // ,: 、, ☆,: ぞ, ★,: そ
  Comma: [/* 、 */ 0x3001, null, null, null, /* そ */ 0x305d, /* ぞ */ 0x305e],
  // .: 。, ☆.: ぃ, ★.: め
  Period: [/* 。 */ 0x3002, null, null, null, /* め */ 0x3081, /* ぃ */ 0x3043],
  // /: ・, ☆/: ぅ, ★/: ヴ
  Slash: [/* ・ */ 0x30fb, null, null, null, /* ヴ */ 0x30f4, /* ぅ */ 0x3045],

  // Space
  Space: [/* SPACE */ 0x0020, /* SPACE */ 0x0020, null, null, null, null],
};

/**
 * Metadata for the 新月配列 chord layout.
 * Defines which keys act as chord modifiers.
 */
export const SHINGETSU_CHORD_METADATA: ChordLayoutMetadata = {
  chordModifiers: {
    KeyD: 4, // ★ layer
    KeyK: 5, // ☆ layer
  },
  postModifiers: {},
  layerCount: 6,
};

/**
 * Custom learning order for 新月配列.
 * User-specified order for optimal learning progression.
 */
export const SHINGETSU_LEARNING_ORDER = new Map<CodePoint, number>([
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
  [0x304c, 17], // が
  [0x3067, 18], // で
  [0x3063, 19], // っ
  [0x3087, 20], // ょ
  [0x3059, 21], // す
  [0x307e, 22], // ま
  [0x3058, 23], // じ
  [0x308a, 24], // り
  [0x3082, 25], // も
  [0x3064, 26], // つ
  [0x304a, 27], // お
  [0x3089, 28], // ら
  [0x3092, 29], // を
  [0x3055, 30], // さ
  [0x3042, 31], // あ
  [0x308c, 32], // れ
  [0x3060, 33], // だ
  [0x3061, 34], // ち
  [0x305b, 35], // せ
  [0x3051, 36], // け
  [0x30fc, 37], // ー
  [0x3088, 38], // よ
  [0x3069, 39], // ど
  [0x3085, 40], // ゅ
  [0x305d, 41], // そ
  [0x3048, 42], // え
  [0x308f, 43], // わ
  [0x307f, 44], // み
  [0x3081, 45], // め
  [0x3072, 46], // ひ
  [0x3070, 47], // ば
  [0x3084, 48], // や
  [0x308d, 49], // ろ
  [0x307b, 50], // ほ
  [0x3075, 51], // ふ
  [0x3083, 52], // ゃ
  [0x3076, 53], // ぶ
  [0x306d, 54], // ね
  [0x3054, 55], // ご
  [0x304e, 56], // ぎ
  [0x3052, 57], // げ
  [0x3080, 58], // む
  [0x305a, 59], // ず
  [0x3073, 60], // び
  [0x3056, 61], // ざ
  [0x3050, 62], // ぐ
  [0x305c, 63], // ぜ
  [0x3078, 64], // へ
  [0x3079, 65], // べ
  [0x3086, 66], // ゆ
  [0x307c, 67], // ぼ
  [0x3077, 68], // ぷ
  [0x305e, 69], // ぞ
  [0x3071, 70], // ぱ
  [0x3043, 71], // ぃ
  [0x307d, 72], // ぽ
  [0x3047, 73], // ぇ
  [0x3065, 74], // づ
  [0x3074, 75], // ぴ
  [0x3041, 76], // ぁ
  [0x306c, 77], // ぬ
  [0x307a, 78], // ぺ
  [0x3049, 79], // ぉ
  [0x30f4, 80], // ヴ
  [0x3062, 81], // ぢ
  [0x3045, 82], // ぅ
]);
