import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { DEFAULT_CONFIG, type SiteConfig } from "@/config/site-config";
import {
  exportConfigFile,
  loadCloudConfig,
  loadConfig,
  parseImportedConfig,
  resetConfig,
  saveConfig,
} from "@/services/dataAdapter";

interface SiteConfigContextValue {
  config: SiteConfig;
  /** Cập nhật trong bộ nhớ (chưa lưu) — dùng cho form Admin. */
  update: (patch: (draft: SiteConfig) => void) => void;
  /** Ghi xuống storage (localStorage / Supabase). */
  save: () => void;
  /** Nạp lại cấu hình gốc từ src/config. */
  reset: () => void;
  resetLanding: () => void;
  /** Xuất file config để dán đè vào mã nguồn. */
  exportFile: () => void;
  /** Nạp cấu hình từ nội dung file đã tải lên; trả về false nếu file không hợp lệ. */
  importConfig: (raw: string) => boolean;
  dirty: boolean;
}

const SiteConfigContext = createContext<SiteConfigContextValue | null>(null);

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [dirty, setDirty] = useState(false);

  // Hydrate từ storage sau khi mount (tránh mismatch SSR).
  useEffect(() => {
    const localConfig = loadConfig();
    setConfig(localConfig);
    void loadCloudConfig(localConfig).then((cloudConfig) => {
      if (cloudConfig) setConfig(cloudConfig);
    });
  }, []);

  const update = useCallback((patch: (draft: SiteConfig) => void) => {
    setConfig((prev) => {
      const draft = structuredClone(prev);
      patch(draft);
      return draft;
    });
    setDirty(true);
  }, []);

  const save = useCallback(() => {
    setConfig((current) => {
      saveConfig(current);
      return current;
    });
    setDirty(false);
  }, []);

  const reset = useCallback(() => {
    setConfig(resetConfig());
    setDirty(false);
  }, []);

  const resetLanding = useCallback(() => {
    setConfig((current) => ({
      ...current,
      landing: structuredClone(DEFAULT_CONFIG.landing),
    }));
    setDirty(true);
  }, []);

  const exportFile = useCallback(() => {
    setConfig((current) => {
      exportConfigFile(current);
      return current;
    });
  }, []);

  const importConfig = useCallback((raw: string) => {
    const parsed = parseImportedConfig(raw);
    if (!parsed) return false;
    saveConfig(parsed);
    setConfig(parsed);
    setDirty(false);
    return true;
  }, []);

  const value = useMemo(
    () => ({
      config,
      update,
      save,
      reset,
      resetLanding,
      exportFile,
      importConfig,
      dirty,
    }),
    [
      config,
      update,
      save,
      reset,
      resetLanding,
      exportFile,
      importConfig,
      dirty,
    ],
  );

  return (
    <SiteConfigContext.Provider value={value}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig(): SiteConfigContextValue {
  const ctx = useContext(SiteConfigContext);
  if (!ctx)
    throw new Error("useSiteConfig must be used within SiteConfigProvider");
  return ctx;
}
