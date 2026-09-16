import {
  CalendarDays,
  Clock,
  MousePointerClick,
  Users,
} from "lucide-react";

import { useVisitorTrackingSnapshot } from "@/lib/visitor-tracking";

function formatDuration(totalSeconds: number) {
  const safe = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function FooterStats({
  title = "Thống kê truy cập",
  helperText = "Số liệu truy cập được gom chung để đồng bộ giữa Analytics, CRM và webhook.",
}: {
  title?: string;
  helperText?: string;
}) {
  const snapshot = useVisitorTrackingSnapshot();

  const quickStats = [
    {
      icon: Users,
      label: "Truy cập hôm nay",
      value: snapshot.metrics.sessionCounts.today.toLocaleString("vi-VN"),
      hint: "Lượt trong ngày",
    },
    {
      icon: CalendarDays,
      label: "Truy cập tháng này",
      value: snapshot.metrics.sessionCounts.month.toLocaleString("vi-VN"),
      hint: "Lượt trong tháng",
    },
    {
      icon: Clock,
      label: "Thời gian trên trang",
      value: formatDuration(snapshot.metrics.timeOnPageSeconds),
      hint: "Phút:giây",
    },
    {
      icon: MousePointerClick,
      label: "Độ sâu cuộn",
      value: `${Math.min(100, Math.max(0, snapshot.metrics.scrollDepthPercent))}%`,
      hint: "Mức đã xem",
    },
  ];

  const isLive = snapshot.initialized;

  return (
    <aside
      aria-label="Thống kê lưu lượng truy cập"
      className="overflow-hidden rounded-2xl border border-border bg-card/80 shadow-[var(--shadow-card)] backdrop-blur sm:rounded-3xl"
    >
      <div className="flex flex-col gap-3 border-b border-border/60 bg-gradient-to-br from-primary/10 via-card to-card px-4 py-4 sm:px-6 sm:py-5 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <h3 className="text-sm font-extrabold text-foreground sm:text-base md:text-lg">
            {title}
          </h3>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground sm:text-xs md:text-sm">
            {helperText}
          </p>
        </div>
        <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-primary/10 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-primary ring-1 ring-primary/20 sm:px-3 sm:text-[11px]">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            {isLive && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/70" />
            )}
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          {isLive ? "Trực tiếp" : "Đang khởi tạo"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-px bg-border/60 lg:grid-cols-4">
        {quickStats.map((stat) => (
          <div key={stat.label} className="bg-card px-3 py-3 sm:px-4 sm:py-4 md:px-5 md:py-5">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[11px]">
              <stat.icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{stat.label}</span>
            </div>
            <p className="mt-2 text-xl font-black tabular-nums text-foreground sm:text-2xl md:text-3xl">
              {stat.value}
            </p>
            <p className="mt-0.5 text-[10px] text-muted-foreground sm:text-[11px]">
              {stat.hint}
            </p>
          </div>
        ))}
      </div>
    </aside>
  );
}
