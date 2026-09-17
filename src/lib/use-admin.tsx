import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AdminModalKey =
  | "editor"
  | "fomo"
  | "analytics"
  | "pages"
  | "abtest"
  | "email"
  | "webhook"
  | "theme"
  | "guide"
  | "leads"
  | "webmaster"
  | "pixel"
  | "cron"
  | "storage"
  | "seo"
  | "form"
  | "ai"
  | "contact"
  | "countdown"
  | "adminlink"
  | "utm";

const AUTH_KEY = "funnel_admin_authed_v1";

/** Salt cố định cho hash mật khẩu admin — không phải bí mật, chỉ chống rainbow table. */
const ADMIN_PW_SALT = "funnel-builder-2026-salt-v1";

/** Hash mật khẩu bằng SHA-256 + salt (Web Crypto API). */
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${ADMIN_PW_SALT}:${password}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export type DeviceView = "mobile" | "tablet" | "desktop";
export type DeviceSize = { width: number; height: number };

export const DEFAULT_DEVICE_SIZES: Record<DeviceView, DeviceSize> = {
  mobile: { width: 375, height: 780 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 780 },
};

interface AdminContextValue {
  authed: boolean;
  login: (password: string, expected: string) => Promise<boolean>;
  logout: () => void;
  activeModal: AdminModalKey | null;
  openModal: (key: AdminModalKey) => void;
  closeModal: () => void;
  device: DeviceView;
  setDevice: (d: DeviceView) => void;
  deviceSizes: Record<DeviceView, DeviceSize>;
  setDeviceSize: (device: DeviceView, size: DeviceSize) => void;
  resetDeviceSizes: () => void;
  /** Bật: xem qua khung iframe theo thiết bị. Tắt: chỉnh trực tiếp trên trang thật. */
  previewEnabled: boolean;
  setPreviewEnabled: (enabled: boolean) => void;
}

const PREVIEW_KEY = "funnel_admin_preview_enabled_v1";

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [activeModal, setActiveModal] = useState<AdminModalKey | null>(null);
  const [device, setDevice] = useState<DeviceView>("desktop");
  const [deviceSizes, setDeviceSizes] =
    useState<Record<DeviceView, DeviceSize>>(DEFAULT_DEVICE_SIZES);
  const [previewEnabled, setPreviewEnabledState] = useState(true);

  useEffect(() => {
    try {
      setAuthed(window.sessionStorage.getItem(AUTH_KEY) === "1");
      const savedSizes = window.localStorage.getItem(
        "funnel_admin_device_sizes_v1",
      );
      if (savedSizes)
        setDeviceSizes({ ...DEFAULT_DEVICE_SIZES, ...JSON.parse(savedSizes) });
      const savedPreview = window.localStorage.getItem(PREVIEW_KEY);
      if (savedPreview !== null) setPreviewEnabledState(savedPreview === "1");
    } catch {
      /* ignore */
    }
  }, []);

  const setDeviceSize = useCallback((view: DeviceView, size: DeviceSize) => {
    setDeviceSizes((current) => {
      const next = { ...current, [view]: size };
      try {
        window.localStorage.setItem(
          "funnel_admin_device_sizes_v1",
          JSON.stringify(next),
        );
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const resetDeviceSizes = useCallback(() => {
    setDeviceSizes(DEFAULT_DEVICE_SIZES);
    try {
      window.localStorage.removeItem("funnel_admin_device_sizes_v1");
    } catch {
      /* ignore */
    }
  }, []);

  const setPreviewEnabled = useCallback((enabled: boolean) => {
    setPreviewEnabledState(enabled);
    try {
      window.localStorage.setItem(PREVIEW_KEY, enabled ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);

  const login = useCallback(async (password: string, expected: string) => {
    if (!password || !expected) return false;
    const inputHash = await hashPassword(password);
    const expectedHash = expected.startsWith("sha256:")
      ? expected.slice(7)
      : await hashPassword(expected);
    if (inputHash === expectedHash) {
      setAuthed(true);
      try {
        window.sessionStorage.setItem(AUTH_KEY, "1");
      } catch {
        /* ignore */
      }
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setAuthed(false);
    setActiveModal(null);
    try {
      window.sessionStorage.removeItem(AUTH_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({
      authed,
      login,
      logout,
      activeModal,
      openModal: (k: AdminModalKey) => setActiveModal(k),
      closeModal: () => setActiveModal(null),
      device,
      setDevice,
      deviceSizes,
      setDeviceSize,
      resetDeviceSizes,
      previewEnabled,
      setPreviewEnabled,
    }),
    [
      authed,
      login,
      logout,
      activeModal,
      device,
      deviceSizes,
      setDeviceSize,
      resetDeviceSizes,
      previewEnabled,
      setPreviewEnabled,
    ],
  );

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
