import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { h as useSiteConfig } from "./use-site-config-DjShPvKg.mjs";
import { t as AdminLoginPage } from "./AdminLoginPage-BIGPYb0o.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-D7fBVljC.js
var import_jsx_runtime = require_jsx_runtime();
function AdminRoute() {
	const { config } = useSiteConfig();
	if (config.admin.adminPath.trim().replace(/^\/+|\/+$/g, "") === "admin") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoginPage, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Trang quản trị đã được chuyển sang đường dẫn mới."
		})
	});
}
//#endregion
export { AdminRoute as component };
