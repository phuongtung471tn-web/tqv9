import {
  Activity,
  CalendarDays,
  Clock,
  Cpu,
  MapPin,
  MousePointerClick,
  Users,
  Wifi,
} from "lucide-react";

import { useVisitorTrackingSnapshot } from "@/lib/visitor-tracking";

interface FooterStatsProps {
  title?: string;
  helperText?: string;
}

/** Bỏ các phần trùng lặp (ví dụ model = hệ điều hành) để không hiển thị "Linux · Linux". */
function dedupeParts(parts: Array<string | undefined>) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of parts) {
    const value = (raw || "").trim();
    if (!value) continue;
    const key = value.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(value);
  }
  return result;
}

function formatDuration(totalSeconds: number) {
  const safe = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function FooterStats({
  title = "Thống kê truy cập thông minh",
  helperText = "Dữ liệu truy cập được gom từ cùng một kho tracking để đồng bộ giữa Analytics, Mini-CRM và Webhook.",
}: FooterStatsProps) {
  const snapshot = useVisitorTrackingSnapshot();

  const deviceValue =
    dedupeParts([
      snapshot.device.manufacturer !== "Unknown"
        ? snapshot.device.manufacturer
        : "",
      snapshot.device.model !== "Unknown" ? snapshot.device.model : "",
      snapshot.device.os !== "Unknown" ? snapshot.device.os : "",
      snapshot.device.browser !== "Unknown" ? snapshot.device.browser : "",
    ]).join(" · ") || "Thiết bị chưa nhận diện";

  const networkValue =
    snapshot.network.displayLabel &&
    !snapshot.network.displayLabel.toLowerCase().includes("unknown")
      ? snapshot.network.displayLabel
      : snapshot.network.fallbackLabel || "Mạng băng thông rộng · Việt Nam";

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
      hint: "Phút:giây · trực tiếp",
    },
    {
      icon: MousePointerClick,
      label: "Độ sâu cuộn trang",
      value: `${Math.min(100, Math.max(0, snapshot.metrics.scrollDepthPercent))}%`,
      hint: "Mức đã xem · trực tiếp",
    },
  ];

  const detailStats = [
    {
      icon: Activity,
      label: "Phiên hiện tại",
      value: `Phiên #${snapshot.metrics.sessionCounts.currentSession}`,
      sub: `Mã khách: ${snapshot.visitorId.slice(-6).toUpperCase()}`,
    },
    {
      icon: Cpu,
      label: "Thiết bị nhận diện",
      value: deviceValue,
      sub: snapshot.device.isInAppBrowser
        ? "Trình duyệt trong ứng dụng"
        : "Trình duyệt độc lập",
    },
    {
      icon: Wifi,
      label: "Mạng & khu vực",
      value: networkValue,
      sub:
        snapshot.network.flags.length > 0
          ? `Tín hiệu: ${snapshot.network.flags.join(", ")}`
          : snapshot.network.connectionLabel || "Kết nối ổn định",
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

      <dl className="grid gap-px border-t border-border/60 bg-border/60 sm:grid-cols-3">
        {detailStats.map((item) => (
          <div key={item.label} className="min-w-0 bg-card px-4 py-3 sm:px-5 sm:py-4">
            <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[11px]">
              <item.icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {item.label}
            </dt>
            <dd
              className="mt-1.5 break-words text-xs font-bold leading-snug text-foreground sm:text-sm"
              title={item.value}
            >
              {item.value}
            </dd>
            <p className="mt-1 break-words text-[10px] leading-relaxed text-muted-foreground sm:text-[11px]">
              {item.sub}
            </p>
          </div>
        ))}
      </dl>

      <p className="flex items-start gap-1.5 border-t border-border/60 px-5 py-3 text-[11px] leading-relaxed text-muted-foreground sm:px-6 sm:text-xs">
        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {snapshot.network.lookupStatus === "resolved"
          ? `Nhà mạng hiện tại: ${snapshot.network.provider || snapshot.network.connectionLabel}. Khi dịch vụ IP thiếu dữ liệu, hệ thống tự chuyển sang chuỗi mạng thay thế để không hiển thị lỗi.`
          : "Dịch vụ định vị IP đang dùng cơ chế dự phòng; giao diện vẫn hiển thị chuỗi mạng chuyên nghiệp, không lộ lỗi hệ thống."}
      </p>
    </aside>
  );
}
