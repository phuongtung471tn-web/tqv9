import {
  Bell,
  BarChart3,
  ChevronDown,
  ChevronUp,
  FileText,
  SplitSquareHorizontal,
  Mail,
  Link2,
  BookOpen,
  ClipboardList,
  Globe,
  CloudUpload,
  Database,
  Search,
  KeyRound,
  Save,
  Package,
  Upload,
  Eye,
  EyeOff,
  RotateCcw,
  LogOut,
  Pencil,
  Palette,
  Megaphone,
  Settings2,
  SlidersHorizontal,
  Smartphone,
  Tablet,
  Monitor,
  Clock,
  Phone,
  Sparkles,
  Target,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useAdmin, type AdminModalKey } from "@/lib/use-admin";
import { useSiteConfig } from "@/lib/use-site-config";
import { isDevicePreview } from "./DeviceFrame";

interface Tool {
  key: AdminModalKey;
  label: string;
  icon: LucideIcon;
}

interface ToolGroup {
  key: string;
  label: string;
  icon: LucideIcon;
  tools: Tool[];
}

const TOOL_GROUPS: ToolGroup[] = [
  {
    key: "content",
    label: "Nội dung & Giao diện",
    icon: Palette,
    tools: [
      { key: "editor", label: "Sửa Giao Diện", icon: Pencil },
      { key: "theme", label: "Màu & Font", icon: Palette },
      { key: "pages", label: "Đa Trang", icon: FileText },
      { key: "fomo", label: "FOMO Popups", icon: Bell },
      { key: "countdown", label: "Đồng Hồ Đếm Ngược", icon: Clock },
      { key: "contact", label: "Hotline & Zalo", icon: Phone },
    ],
  },
  {
    key: "marketing",
    label: "Marketing & Lead",
    icon: Megaphone,
    tools: [
      { key: "leads", label: "Quản Lý Lead", icon: ClipboardList },
      { key: "form", label: "Form & Webhook", icon: FileText },
      { key: "webhook", label: "Webhook Hub", icon: Link2 },
      { key: "email", label: "Auto Email", icon: Mail },
      { key: "abtest", label: "A/B Testing", icon: SplitSquareHorizontal },
      { key: "utm", label: "UTM Hub", icon: Globe },
      { key: "ai", label: "AI Sales Advisor", icon: Sparkles },
      { key: "pixel", label: "Pixel & Sự Kiện Ads", icon: Target },
    ],
  },
  {
    key: "data",
    label: "Dữ liệu & SEO",
    icon: BarChart3,
    tools: [
      { key: "analytics", label: "Analytics", icon: BarChart3 },
      { key: "seo", label: "SEO Google", icon: Search },
      { key: "webmaster", label: "Webmaster & Scripts", icon: Globe },
      { key: "storage", label: "Storage Mode", icon: Database },
    ],
  },
  {
    key: "system",
    label: "Hệ thống",
    icon: Settings2,
    tools: [
      { key: "cron", label: "Cloud Cron & Backup", icon: CloudUpload },
      { key: "adminlink", label: "Đổi Link Admin", icon: KeyRound },
      { key: "guide", label: "Hướng Dẫn & Health", icon: BookOpen },
    ],
  },
];

const DEVICES = [
  { key: "mobile" as const, label: "Mobile 375", icon: Smartphone },
  { key: "tablet" as const, label: "Tablet 768", icon: Tablet },
  { key: "desktop" as const, label: "Desktop 100%", icon: Monitor },
];

const ICON_BUTTON =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors";

export function AdminBar() {
  const {
    authed,
    openModal,
    logout,
    device,
    setDevice,
    deviceSizes,
    setDeviceSize,
    resetDeviceSizes,
    previewEnabled,
    setPreviewEnabled,
  } = useAdmin();
  const { save, reset, exportFile, importConfig, dirty } = useSiteConfig();
  const [hidden, setHidden] = useState(true);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const configInputRef = useRef<HTMLInputElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => setHidden(isDevicePreview()), []);

  useEffect(() => {
    if (!openGroup) return;
    function onPointerDown(event: MouseEvent) {
      if (!barRef.current?.contains(event.target as Node)) setOpenGroup(null);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenGroup(null);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [openGroup]);

  function handleImportConfig(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const ok = importConfig(String(reader.result));
      window.alert(
        ok
          ? "Đã nhập và lưu cấu hình thành công."
          : "File cấu hình không hợp lệ hoặc thiếu trường bắt buộc.",
      );
    };
    reader.onerror = () => window.alert("Không thể đọc file cấu hình.");
    reader.readAsText(file);
  }

  if (hidden || !authed) return null;

  function toggleGroup(key: string) {
    setOpenGroup((current) => (current === key ? null : key));
  }

  return (
    <div
      ref={barRef}
      className="sticky top-0 z-[90] border-b border-white/10 bg-neutral-950 text-white"
    >
      <div className="relative flex items-center gap-1 px-2 py-2">
        <span className="shrink-0 rounded-md bg-white/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide">
          Admin
        </span>

        {/* Nhóm công cụ dạng biểu tượng + menu thả xuống */}
        <div className="flex shrink-0 items-center gap-1">
          {TOOL_GROUPS.map((group) => {
            const Icon = group.icon;
            const open = openGroup === group.key;
            return (
              <div key={group.key} className="relative">
                <button
                  onClick={() => toggleGroup(group.key)}
                  aria-expanded={open}
                  aria-haspopup="menu"
                  aria-label={group.label}
                  title={group.label}
                  className={`${ICON_BUTTON} ${
                    open
                      ? "bg-white text-neutral-900"
                      : "bg-white/10 text-white/80 hover:bg-white/20"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </button>
                {open && (
                  <div
                    role="menu"
                    aria-label={group.label}
                    className="absolute left-0 top-full z-[95] mt-1 w-56 overflow-hidden rounded-lg border border-white/10 bg-neutral-900 p-1 shadow-xl"
                  >
                    <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white/40">
                      {group.label}
                    </p>
                    {group.tools.map((tool) => {
                      const ToolIcon = tool.icon;
                      return (
                        <button
                          key={tool.key}
                          role="menuitem"
                          onClick={() => {
                            setOpenGroup(null);
                            openModal(tool.key);
                          }}
                          className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          <ToolIcon className="h-4 w-4 shrink-0" />
                          {tool.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <span className="mx-0.5 h-6 w-px shrink-0 bg-white/10" />

        {/* Xem trước theo thiết bị */}
        <button
          onClick={() => setPreviewEnabled(!previewEnabled)}
          aria-pressed={previewEnabled}
          aria-label={
            previewEnabled ? "Tắt khung xem trước" : "Bật khung xem trước"
          }
          title={
            previewEnabled
              ? "Tắt khung xem trước, sửa trực tiếp trên trang thật"
              : "Bật lại khung xem trước theo thiết bị"
          }
          className={`${ICON_BUTTON} ${
            previewEnabled
              ? "bg-white text-neutral-900"
              : "bg-white/10 text-white/70 hover:bg-white/20"
          }`}
        >
          {previewEnabled ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </button>
        <div className="flex shrink-0 items-center gap-1 rounded-md bg-white/5 p-1">
          {DEVICES.map((item) => {
            const Icon = item.icon;
            const active = device === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setDevice(item.key)}
                disabled={!previewEnabled}
                aria-pressed={active}
                aria-label={item.label}
                title={item.label}
                className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors disabled:opacity-40 ${
                  active
                    ? "bg-white text-neutral-900"
                    : "text-white/70 hover:bg-white/20"
                }`}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>

        {/* Kích thước khung xem trước + cấu hình gom vào 1 biểu tượng */}
        <div className="relative shrink-0">
          <button
            onClick={() => toggleGroup("settings")}
            aria-expanded={openGroup === "settings"}
            aria-haspopup="menu"
            aria-label="Kích thước khung xem trước và cấu hình"
            title="Kích thước khung xem trước & cấu hình"
            className={`${ICON_BUTTON} ${
              openGroup === "settings"
                ? "bg-white text-neutral-900"
                : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
          {openGroup === "settings" && (
            <div className="absolute left-0 top-full z-[95] mt-1 w-64 rounded-lg border border-white/10 bg-neutral-900 p-2 shadow-xl">
              <p className="px-1 pb-1 text-[10px] font-bold uppercase tracking-wide text-white/40">
                Kích thước khung xem trước
              </p>
              <div className="flex items-center gap-2 px-1 pb-2 text-[11px] text-white/60">
                <label className="flex items-center gap-1">
                  Rộng
                  <input
                    aria-label="Chiều rộng khung xem thử"
                    type="number"
                    min="280"
                    max="1920"
                    value={deviceSizes[device].width}
                    onChange={(event) =>
                      setDeviceSize(device, {
                        ...deviceSizes[device],
                        width: Math.max(280, Number(event.target.value) || 280),
                      })
                    }
                    className="w-16 rounded border border-white/20 bg-white/10 px-1.5 py-1 text-center text-[11px] text-white"
                  />
                </label>
                <label className="flex items-center gap-1">
                  Cao
                  <input
                    aria-label="Chiều cao khung xem thử"
                    type="number"
                    min="400"
                    max="1600"
                    value={deviceSizes[device].height}
                    onChange={(event) =>
                      setDeviceSize(device, {
                        ...deviceSizes[device],
                        height: Math.max(
                          400,
                          Number(event.target.value) || 400,
                        ),
                      })
                    }
                    className="w-16 rounded border border-white/20 bg-white/10 px-1.5 py-1 text-center text-[11px] text-white"
                  />
                </label>
                <button
                  onClick={resetDeviceSizes}
                  className="rounded-md bg-white/10 px-2 py-1 text-[11px] font-semibold text-white/70 hover:bg-white/20 hover:text-white"
                  title="Khôi phục kích thước mặc định"
                >
                  Mặc định
                </button>
              </div>
              <div className="border-t border-white/10 pt-1">
                <p className="px-1 py-1 text-[10px] font-bold uppercase tracking-wide text-white/40">
                  Cấu hình
                </p>
                <button
                  onClick={() => {
                    setOpenGroup(null);
                    exportFile();
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs font-medium text-white/80 hover:bg-white/10 hover:text-white"
                >
                  <Package className="h-4 w-4" /> Xuất config
                </button>
                <input
                  ref={configInputRef}
                  type="file"
                  accept="application/json,.json,.js"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) handleImportConfig(file);
                    event.target.value = "";
                  }}
                />
                <button
                  onClick={() => configInputRef.current?.click()}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs font-medium text-white/80 hover:bg-white/10 hover:text-white"
                >
                  <Upload className="h-4 w-4" /> Nhập config
                </button>
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Khôi phục cấu hình gốc? Mọi thay đổi đã lưu sẽ mất.",
                      )
                    ) {
                      setOpenGroup(null);
                      reset();
                    }
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs font-medium text-red-300 hover:bg-red-500/15"
                >
                  <RotateCcw className="h-4 w-4" /> Khôi phục gốc
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Lưu & đăng xuất luôn nằm sát mép phải */}
        <div className="ml-auto flex shrink-0 items-center gap-1">
          <button
            onClick={save}
            aria-label={
              dirty ? "Lưu thay đổi (đang có thay đổi)" : "Lưu thay đổi"
            }
            title={dirty ? "Lưu thay đổi (đang có thay đổi)" : "Lưu thay đổi"}
            className={`relative ${ICON_BUTTON} ${
              dirty
                ? "bg-emerald-500 text-white"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            <Save className="h-4 w-4" />
            {dirty && (
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-amber-300" />
            )}
          </button>
          <button
            onClick={logout}
            aria-label="Đăng xuất"
            title="Đăng xuất"
            className={`${ICON_BUTTON} bg-red-500/20 text-red-300 hover:bg-red-500/30`}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
