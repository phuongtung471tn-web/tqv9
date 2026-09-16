/**
 * A/B Split Testing — Traffic Splitter.
 * Gán biến thể cho khách lần đầu vào trang và ghi nhớ ở localStorage
 * để lần sau vẫn thấy đúng biến thể đó.
 */
const KEY_PREFIX = "funnel_ab_variant_v2";

export function getVariant(enabled: boolean, splitToB: number): "A" | "B" {
  if (typeof window === "undefined" || !enabled) return "A";
  const split = Math.min(100, Math.max(0, Number(splitToB) || 0));
  const key = `${KEY_PREFIX}_${split}`;
  try {
    const saved = window.localStorage.getItem(key);
    if (saved === "A" || saved === "B") return saved;
    const variant = Math.random() * 100 < split ? "B" : "A";
    window.localStorage.setItem(key, variant);
    return variant;
  } catch {
    return "A";
  }
}

export function resetVariant(splitToB?: number): void {
  if (typeof window === "undefined") return;
  try {
    if (splitToB === undefined) {
      Object.keys(window.localStorage)
        .filter((key) => key.startsWith(`${KEY_PREFIX}_`))
        .forEach((key) => window.localStorage.removeItem(key));
    } else {
      const split = Math.min(100, Math.max(0, Number(splitToB) || 0));
      window.localStorage.removeItem(`${KEY_PREFIX}_${split}`);
    }
  } catch {
    /* ignore storage restrictions */
  }
}

const REFERRER_MAP: Array<[RegExp, string]> = [
  [/facebook\.com|fb\.me|fbcdn/i, "facebook"],
  [/m\.facebook|mbasic\.facebook/i, "facebook"],
  [/tiktok\.com|t\.tiktok|bytedance/i, "tiktok"],
  [/zalo\.me|zaloapp|z\.alo/i, "zalo"],
  [/google\./i, "google"],
  [/instagram\.com|instagr\.am/i, "instagram"],
  [/t\.co|twitter\.com|x\.com/i, "twitter"],
  [/t\.me|telegram\.org|telegram/i, "telegram"],
  [/messenger|fb\.com\/messages/i, "messenger"],
  [/youtube\.com|youtu\.be/i, "youtube"],
  [/linkedin\.com|lnkd\.in/i, "linkedin"],
  [/pinterest\.com|pin\.it/i, "pinterest"],
  [/reddit\.com/i, "reddit"],
  [/snapchat\.com/i, "snapchat"],
  [/wechat|weixin/i, "wechat"],
  [/whatsapp\.com/i, "whatsapp"],
  [/viber/i, "viber"],
];

export function detectReferrerSource(referrer: string): string {
  if (!referrer) return "";
  for (const [regex, name] of REFERRER_MAP) {
    if (regex.test(referrer)) return name;
  }
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    return host || "referral";
  } catch {
    return "referral";
  }
}

import { detectDevice } from "@/lib/visitor-tracking";

export function utmSource(): string {
  if (typeof window === "undefined") return "direct";
  const p = new URLSearchParams(window.location.search);
  const utm = p.get("utm_source");
  if (utm) return utm;

  // Đọc UTM đã lưu từ lần truy cập đầu (readAttribution lưu vào localStorage)
  try {
    const stored = JSON.parse(
      window.localStorage.getItem("lp_utm_v2") || "{}",
    ) as Record<string, string>;
    if (stored.utm_source) return stored.utm_source;
  } catch {
    /* ignore */
  }

  // Phát hiện nguồn từ in-app browser (FB/TikTok/Zalo) khi referrer rỗng
  const device = detectDevice();
  if (device.isInAppBrowser) {
    const ua = navigator.userAgent;
    if (/FBAN|FBAV|Facebook/i.test(ua)) return "facebook";
    if (/TikTok|BytedanceWebview/i.test(ua)) return "tiktok";
    if (/Zalo/i.test(ua)) return "zalo";
  }

  if (document.referrer) return detectReferrerSource(document.referrer);
  return "direct";
}
