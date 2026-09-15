import { Lock } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useAdmin } from "@/lib/use-admin";
import { useSiteConfig } from "@/lib/use-site-config";

/** Màn hình đăng nhập quản trị — dùng cho /admin và đường dẫn tuỳ chỉnh. */
export function AdminLoginPage() {
  const { authed, login } = useAdmin();
  const { config } = useSiteConfig();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setReady(true);
  }, []);

  function handleSubmit() {
    const nextPassword = passwordInputRef.current?.value ?? password;
    if (login(nextPassword, config.admin.password)) {
      window.location.assign("/");
    } else {
      setError(true);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 text-white">
      <div className="w-full max-w-sm rounded-2xl bg-neutral-900 p-6 ring-1 ring-white/10">
        <div className="mb-5 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="text-lg font-bold">Đăng nhập quản trị</h1>
          <p className="mt-1 text-xs text-white/50">
            Funnel Builder — Bảng điều khiển
          </p>
        </div>

        {authed ? (
          <div className="space-y-3 text-center">
            <p className="text-sm text-emerald-400">Đã đăng nhập.</p>
            <a
              href="/"
              className="block w-full rounded-lg bg-white py-2.5 text-sm font-bold text-neutral-900"
            >
              Vào trang &amp; bật chế độ Admin
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            <input
              ref={passwordInputRef}
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Mật khẩu quản trị"
              autoFocus
              onKeyDown={(event) => {
                if (event.key === "Enter") handleSubmit();
              }}
              className="w-full rounded-lg bg-neutral-800 px-3 py-2.5 text-sm outline-none ring-1 ring-white/10 focus:ring-white/30"
            />
            {error && (
              <p className="text-xs text-red-400">Mật khẩu không đúng.</p>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!ready}
              className="w-full rounded-lg bg-white py-2.5 text-sm font-bold text-neutral-900 transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
            >
              Đăng nhập
            </button>
            <p className="text-center text-[11px] text-white/40">
              Đổi mật khẩu &amp; đường dẫn trong công cụ “Đổi Link Admin”.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
