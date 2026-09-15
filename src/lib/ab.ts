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

export function utmSource(): string {
  if (typeof window === "undefined") return "direct";
  const p = new URLSearchParams(window.location.search);
  return p.get("utm_source") || (document.referrer ? "referral" : "direct");
}
