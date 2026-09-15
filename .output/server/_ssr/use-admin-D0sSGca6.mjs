import { n as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-admin-D0sSGca6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AUTH_KEY = "funnel_admin_authed_v1";
var DEFAULT_DEVICE_SIZES = {
	mobile: {
		width: 375,
		height: 780
	},
	tablet: {
		width: 768,
		height: 1024
	},
	desktop: {
		width: 1280,
		height: 780
	}
};
var PREVIEW_KEY = "funnel_admin_preview_enabled_v1";
var AdminContext = (0, import_react.createContext)(null);
function AdminProvider({ children }) {
	const [authed, setAuthed] = (0, import_react.useState)(false);
	const [activeModal, setActiveModal] = (0, import_react.useState)(null);
	const [device, setDevice] = (0, import_react.useState)("desktop");
	const [deviceSizes, setDeviceSizes] = (0, import_react.useState)(DEFAULT_DEVICE_SIZES);
	const [previewEnabled, setPreviewEnabledState] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		try {
			setAuthed(window.sessionStorage.getItem(AUTH_KEY) === "1");
			const savedSizes = window.localStorage.getItem("funnel_admin_device_sizes_v1");
			if (savedSizes) setDeviceSizes({
				...DEFAULT_DEVICE_SIZES,
				...JSON.parse(savedSizes)
			});
			const savedPreview = window.localStorage.getItem(PREVIEW_KEY);
			if (savedPreview !== null) setPreviewEnabledState(savedPreview === "1");
		} catch {}
	}, []);
	const setDeviceSize = (0, import_react.useCallback)((view, size) => {
		setDeviceSizes((current) => {
			const next = {
				...current,
				[view]: size
			};
			try {
				window.localStorage.setItem("funnel_admin_device_sizes_v1", JSON.stringify(next));
			} catch {}
			return next;
		});
	}, []);
	const resetDeviceSizes = (0, import_react.useCallback)(() => {
		setDeviceSizes(DEFAULT_DEVICE_SIZES);
		try {
			window.localStorage.removeItem("funnel_admin_device_sizes_v1");
		} catch {}
	}, []);
	const setPreviewEnabled = (0, import_react.useCallback)((enabled) => {
		setPreviewEnabledState(enabled);
		try {
			window.localStorage.setItem(PREVIEW_KEY, enabled ? "1" : "0");
		} catch {}
	}, []);
	const login = (0, import_react.useCallback)((password, expected) => {
		if (password && password === expected) {
			setAuthed(true);
			try {
				window.sessionStorage.setItem(AUTH_KEY, "1");
			} catch {}
			return true;
		}
		return false;
	}, []);
	const logout = (0, import_react.useCallback)(() => {
		setAuthed(false);
		setActiveModal(null);
		try {
			window.sessionStorage.removeItem(AUTH_KEY);
		} catch {}
	}, []);
	const value = (0, import_react.useMemo)(() => ({
		authed,
		login,
		logout,
		activeModal,
		openModal: (k) => setActiveModal(k),
		closeModal: () => setActiveModal(null),
		device,
		setDevice,
		deviceSizes,
		setDeviceSize,
		resetDeviceSizes,
		previewEnabled,
		setPreviewEnabled
	}), [
		authed,
		login,
		logout,
		activeModal,
		device,
		deviceSizes,
		setDeviceSize,
		resetDeviceSizes,
		previewEnabled,
		setPreviewEnabled
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminContext.Provider, {
		value,
		children
	});
}
function useAdmin() {
	const ctx = (0, import_react.useContext)(AdminContext);
	if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
	return ctx;
}
//#endregion
export { useAdmin as n, AdminProvider as t };
