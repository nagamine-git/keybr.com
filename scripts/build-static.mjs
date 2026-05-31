#!/usr/bin/env node
// 新月配列練習サイト向けの静的エクスポート。
// 本番ビルド済みの root/public/assets を前提に、サーバを一時起動して匿名 /ja を
// レンダリングし、HTML を以下のように後処理して root/public 直下に書き出す:
//   - 広告 / 解析スクリプト (Freestar, GTM, Cloudflare beacon, ads entry) を除去
//   - 多言語 hreflang alternate を除去 (単一ロケール配信のため)
//   - localhost canonicalUrl を本番オリジンに置換
//   - 新規ユーザーが新月配列で着地するための既定 settings を localStorage に注入
//
// 出力:
//   root/public/ja/index.html  (SPA basename=/ja に合わせる)
//   root/public/_redirects     (Cloudflare Pages: / -> /ja/ と SPA フォールバック)
//
// 環境変数:
//   PUBLIC_ORIGIN (任意, 既定: https://practice.shingetsu-layout.com)
//
// 使い方:
//   npm run build && node scripts/build-static.mjs
//   Cloudflare Pages の publish ディレクトリは root/public を指定。

import { spawn } from "node:child_process";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import http from "node:http";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIR = join(ROOT, "root", "public");
const MANIFEST_PATH = join(PUBLIC_DIR, "assets", "manifest.json");
const PORT = 3777;
const WS_PORT = 3778;
// IPv4 を明示 (Node fetch の localhost が ::1 に解決され接続失敗するのを回避)
const SERVER_URL = `http://127.0.0.1:${PORT}`;
const PROD_ORIGIN = (process.env.PUBLIC_ORIGIN ?? "https://practice.shingetsu-layout.com").replace(/\/+$/, "");
const DEFAULT_SETTINGS = {
  "keyboard.layout": "ja-shingetsu",
  "keyboard.language": "ja",
};

async function loadManifest() {
  return JSON.parse(await readFile(MANIFEST_PATH, "utf-8"));
}

function httpGet(url, { headers = {}, timeoutMs = 5000 } = {}) {
  // Node の fetch(undici) は localhost で ECONNREFUSED になるケースがあるため http.get を使う
  return new Promise((resolve, reject) => {
    const req = http.get(url, { headers }, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve({ status: res.statusCode ?? 0, body: Buffer.concat(chunks).toString("utf-8") }));
      res.on("error", reject);
    });
    req.on("error", reject);
    req.setTimeout(timeoutMs, () => {
      req.destroy(new Error("request timeout"));
    });
  });
}

async function waitForServer(url, attempts = 60) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await httpGet(url, { timeoutMs: 2000 });
      // 301/302 を含む 2xx-3xx を ready とみなす
      if (res.status > 0 && res.status < 500) return;
    } catch {
      // not up yet
    }
    await delay(500);
  }
  throw new Error(`server did not become ready at ${url}`);
}

async function fetchHtml(url) {
  const res = await httpGet(url, { headers: { "accept-encoding": "identity" }, timeoutMs: 10000 });
  if (res.status !== 200) throw new Error(`fetch ${url}: HTTP ${res.status}`);
  return res.body;
}

function processHtml(html, manifest) {
  // 広告/解析スクリプトを除去
  html = html
    .replace(/<script src="https:\/\/static\.cloudflareinsights\.com\/[^"]*"[^>]*><\/script>/g, "")
    .replace(/<script>window\.dataLayer[\s\S]*?gtag\("config","[^"]*"\);<\/script>/g, "")
    .replace(/<script src="https:\/\/www\.googletagmanager\.com\/[^"]*"[^>]*><\/script>/g, "")
    .replace(/<script>var freestar[\s\S]*?enabled_slots=\[[^\]]*\];<\/script>/g, "");

  // ads エントリ JS (ハッシュ名は毎ビルド変わるので manifest から取得して除去)
  // manifest 構造: { entrypoints: { ads: { assets: { js: [...], css: [...] } } } }
  const adsScripts = manifest.entrypoints?.ads?.assets?.js ?? [];
  for (const script of adsScripts) {
    const name = script.split("/").pop();
    const esc = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    html = html.replace(new RegExp(`<script src="/assets/${esc}"[^>]*></script>`, "g"), "");
  }

  // 多言語 hreflang alternate (単一ロケール配信なので削除)
  html = html.replace(/<link href="[^"]*" rel="alternate" hrefLang="[^"]*"\/>/g, "");

  // canonicalUrl / OG URL を本番に
  html = html.replaceAll(`${SERVER_URL}/`, `${PROD_ORIGIN}/`);
  html = html.replace(/content="https:\/\/www\.keybr\.com\/"/g, `content="${PROD_ORIGIN}/"`);

  // 既定 settings を localStorage に注入 (新規ユーザーは新月配列で着地)。
  // SPA 側の defaults 解決(navigator.language ベース)が tsuki を選ぶため、
  // 初回マーカーを使って localStorage.settings を直接書く。以降はユーザーの
  // 選択を尊重(マーカーがあるので再書込みしない)。
  const json = JSON.stringify(DEFAULT_SETTINGS);
  const marker = "__shingetsu_default_v1";
  const defaultsScript =
    `<script>(function(){try{` +
    `if(!localStorage.getItem(${JSON.stringify(marker)})){` +
    `localStorage.setItem("settings",${JSON.stringify(json)});` +
    `localStorage.setItem(${JSON.stringify(marker)},"1");` +
    `}` +
    `}catch(e){}})();</script>`;
  if (html.includes('<script id="page-data">')) {
    html = html.replace('<script id="page-data">', `${defaultsScript}<script id="page-data">`);
  } else {
    throw new Error("page-data script not found; HTML format changed?");
  }

  return html;
}

function startServer() {
  const server = spawn("node", ["root/index.js"], {
    cwd: ROOT,
    env: {
      ...process.env,
      NODE_ENV: "production",
      DATABASE_CLIENT: "sqlite",
      SERVER_PORT: String(PORT),
      SERVER_PORT_WS: String(WS_PORT),
      // CanonicalHandler が canonicalUrl 以外のホストへの GET を 301 するので
      // ローカルキャプチャ用に APP_URL を 127.0.0.1:PORT に合わせる。
      // 後段で processHtml が本番オリジンに置換するので canonical 文字列は使い捨てでよい。
      APP_URL: `${SERVER_URL}/`,
    },
    detached: true,
    stdio: ["ignore", "pipe", "pipe"],
  });
  // デバッグ時は KEYBR_STATIC_DEBUG=1 で出力を流す。通常はバッファを溜めない。
  if (process.env.KEYBR_STATIC_DEBUG === "1") {
    server.stdout.on("data", (b) => process.stderr.write(`[server] ${b}`));
    server.stderr.on("data", (b) => process.stderr.write(`[server-err] ${b}`));
  } else {
    server.stdout.on("data", () => {});
    server.stderr.on("data", () => {});
  }
  return server;
}

async function stopServer(server) {
  try {
    // プロセスグループ全体を停止 (クラスタワーカーごと)
    process.kill(-server.pid, "SIGTERM");
  } catch {
    // ignore
  }
  // SIGTERM で止まらないことがあるので少し待って SIGKILL
  for (let i = 0; i < 6; i++) {
    if (server.exitCode != null) return;
    await delay(500);
  }
  try {
    process.kill(-server.pid, "SIGKILL");
  } catch {
    // ignore
  }
}

async function main() {
  const manifest = await loadManifest();
  console.log("[build-static] starting keybr server (sqlite:memory)...");
  const server = startServer();

  try {
    await waitForServer(`${SERVER_URL}/`);
    console.log("[build-static] capturing /ja ...");
    const raw = await fetchHtml(`${SERVER_URL}/ja`);
    console.log(`[build-static] captured ${raw.length} bytes; post-processing...`);
    const processed = processHtml(raw, manifest);

    const outDir = join(PUBLIC_DIR, "ja");
    await mkdir(outDir, { recursive: true });
    await writeFile(join(outDir, "index.html"), processed, "utf-8");
    console.log(`[build-static] wrote root/public/ja/index.html (${processed.length} bytes)`);

    await writeFile(
      join(PUBLIC_DIR, "_redirects"),
      "# Cloudflare Pages routing\n" +
        "/ /ja/ 302\n" +
        "/ja/* /ja/index.html 200\n",
      "utf-8",
    );
    console.log("[build-static] wrote root/public/_redirects");

    await writeFile(
      join(PUBLIC_DIR, "_headers"),
      "# Long-cache hashed assets, no-cache for HTML\n" +
        "/assets/*\n" +
        "  Cache-Control: public, max-age=31536000, immutable\n" +
        "/*.html\n" +
        "  Cache-Control: public, max-age=0, must-revalidate\n",
      "utf-8",
    );
    console.log("[build-static] wrote root/public/_headers");
  } finally {
    console.log("[build-static] stopping server...");
    await stopServer(server);
  }
  console.log("[build-static] done. publish directory: root/public");
}

main().catch((err) => {
  console.error("[build-static] FAILED:", err);
  process.exit(1);
});
