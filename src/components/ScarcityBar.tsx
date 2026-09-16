import { useEffect, useState } from "react";

import { useSiteConfig } from "@/lib/use-site-config";
import { LEAD_CREATED_EVENT } from "@/services/dataAdapter";

function endOfMonth() {
  const now = new Date();
  return new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1,
    0,
    0,
    0,
    0,
  ).getTime();
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

/** Đếm ngược + số suất còn lại, lấy trực tiếp từ cấu hình Admin. */
export function ScarcityBar({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { config, update, save } = useSiteConfig();
  const c = config.countdown;
  const [left, setLeft] = useState<number | null>(null);

  const target =
    c.endMode === "fixed" && c.endDate
      ? new Date(c.endDate).getTime()
      : endOfMonth();
  const validTarget = Number.isFinite(target) ? target : endOfMonth();

  useEffect(() => {
    const tick = () => setLeft(Math.max(0, validTarget - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [validTarget]);

  useEffect(() => {
    if (!c.enabled || c.autoDecrement === false) return;
    const onLeadCreated = () => {
      if (c.slotsLeft <= 0) return;
      update((d) => {
        d.countdown.slotsLeft = Math.max(0, d.countdown.slotsLeft - 1);
      });
      save();
    };
    window.addEventListener(LEAD_CREATED_EVENT, onLeadCreated);
    return () => window.removeEventListener(LEAD_CREATED_EVENT, onLeadCreated);
  }, [c.enabled, c.autoDecrement, c.slotsLeft, update, save]);

  const d = left === null ? 0 : Math.floor(left / 86400000);
  const h = left === null ? 0 : Math.floor((left % 86400000) / 3600000);
  const m = left === null ? 0 : Math.floor((left % 3600000) / 60000);
  const s = left === null ? 0 : Math.floor((left % 60000) / 1000);

  const displaySlots = (() => {
    if (!c.enabled) return c.slotsLeft;
    const maxSlots = c.slotsLeft;
    if (maxSlots <= 0) return 0;
    // Số suất giảm dần theo thời gian: đầu kỳ gần maxSlots, cuối kỳ gần 1.
    // totalSeconds giảm dần → ratio giảm → dynamic giảm.
    const totalSeconds = d * 86400 + h * 3600 + m * 60 + s;
    const ratio = Math.min(1, totalSeconds / (30 * 86400));
    const fluctuation = Math.floor(
      Math.sin(Date.now() / 300000) * 1.5 + Math.cos(Date.now() / 470000) * 1,
    );
    const dynamic = Math.round(maxSlots * (0.15 + ratio * 0.85)) + fluctuation;
    return Math.max(1, Math.min(maxSlots, dynamic));
  })();

  if (!c.enabled) return null;

  const dark = tone === "dark";
  const box = dark
    ? "bg-surface-foreground/10 text-surface-foreground ring-surface-foreground/20"
    : "bg-card text-card-foreground ring-border";
  const accent = dark ? "text-gold" : "text-primary";
  const cell = dark ? "bg-surface-foreground/10" : "bg-primary/10";

  return (
    <div className={`rounded-2xl px-4 py-3 ring-1 ${box}`} aria-live="polite">
      <p className="text-sm font-bold">
        Chỉ còn{" "}
        <span className={accent}>
          {displaySlots.toString().padStart(2, "0")} suất
        </span>{" "}
        {c.headline}
      </p>
      <div className="mt-2 flex items-center gap-2">
        {[
          { v: d, l: "Ngày" },
          { v: h, l: "Giờ" },
          { v: m, l: "Phút" },
          { v: s, l: "Giây" },
        ].map((u) => (
          <div
            key={u.l}
            className={`min-w-[3.25rem] rounded-lg px-2 py-1.5 text-center ${cell}`}
          >
            <span
              className={`block text-lg font-black leading-none tabular-nums ${accent}`}
            >
              {left === null ? "--" : pad(u.v)}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wide opacity-70">
              {u.l}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
