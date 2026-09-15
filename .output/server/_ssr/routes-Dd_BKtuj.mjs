import { n as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as isDuplicateLead, d as saveLead, h as useSiteConfig, p as trackConversion, r as LEAD_CREATED_EVENT, u as loadLeads } from "./use-site-config-DjShPvKg.mjs";
import { A as GraduationCap, G as Activity, H as CalendarDays, L as Cpu, S as Menu, h as Phone, n as Wifi, r as Users, t as X, w as MapPin, x as MessageCircle, y as MousePointerClick, z as Clock } from "../_libs/lucide-react.mjs";
import { n as ScarcityBar, t as ContentSection } from "./ContentSection-BWsPqEdY.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as DialogOverlay, c as DialogTrigger, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { d as trackLead, f as utmSource, i as getVariant, l as trackFormStart, n as dispatchLead, o as sendLeadEmail } from "./ab-CgpnHV5s.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Dd_BKtuj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var expert_1_default = "/assets/expert-1-CcX0y7YN.webp";
var expert_2_default = "/assets/expert-2-WVJni1up.webp";
var expert_3_default = "/assets/expert-3-AK2LvN4J.webp";
var VISITOR_ID_KEY = "lp_visitor_id_v2";
var ATTRIBUTION_KEY = "lp_utm_v2";
var COUNTERS_KEY = "lp_visit_counters_v2";
var SUBMISSION_KEY = "lp_submission_counters_v2";
var SESSION_MARKER_KEY = "lp_session_marker_v2";
var VISITOR_SESSION_TABLE = "visitor_sessions";
var NETWORK_TIMEOUT_MS = 3500;
var defaultDevice = {
	userAgent: "",
	manufacturer: "Unknown",
	family: "Unknown",
	model: "Unknown",
	kind: "unknown",
	osName: "Unknown",
	osVersion: "",
	os: "Unknown",
	browserName: "Unknown",
	browserVersion: "",
	browser: "Unknown",
	isInAppBrowser: false
};
var defaultNetwork = {
	ip: "",
	city: "",
	region: "",
	country: "Việt Nam",
	isp: "",
	organization: "",
	provider: "",
	connectionType: "",
	connectionLabel: "Mạng băng thông rộng",
	fallbackLabel: "Mạng băng thông rộng · Việt Nam",
	displayLabel: "Mạng băng thông rộng · Việt Nam",
	flags: [],
	lookupStatus: "idle"
};
var defaultAttribution = {
	source: "",
	medium: "",
	campaign: "",
	content: "",
	term: "",
	ttclid: "",
	landingUrl: ""
};
var runtime = {
	initialized: false,
	startedAt: 0,
	firstInteractionAt: 0,
	formStartedAt: 0,
	maxScrollPercent: 0,
	industrySwitchCount: 0,
	faqClicked: "",
	copiedTextType: "",
	isCopyPaste: false,
	startBatteryLevel: null,
	currentBatteryLevel: null,
	sectionTime: {},
	visibleSections: {},
	visitorId: "",
	sessionId: "",
	device: defaultDevice,
	network: defaultNetwork,
	attribution: defaultAttribution,
	sessionCounts: {
		currentSession: 1,
		today: 0,
		month: 0
	},
	options: {}
};
var listeners = /* @__PURE__ */ new Set();
/** Tăng mỗi lần dữ liệu theo dõi thay đổi để cache snapshot biết làm mới. */
var snapshotVersion = 0;
function isBrowser() {
	return typeof window !== "undefined";
}
function subscribe(listener) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}
function emit() {
	snapshotVersion += 1;
	listeners.forEach((listener) => listener());
}
function readJSON(key, fallback) {
	if (!isBrowser()) return fallback;
	try {
		const raw = window.localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
}
function writeJSON(key, value) {
	if (!isBrowser()) return;
	try {
		window.localStorage.setItem(key, JSON.stringify(value));
	} catch {}
}
function readSessionMarker() {
	if (!isBrowser()) return "";
	try {
		return window.sessionStorage.getItem(SESSION_MARKER_KEY) || "";
	} catch {
		return "";
	}
}
function writeSessionMarker(value) {
	if (!isBrowser()) return;
	try {
		window.sessionStorage.setItem(SESSION_MARKER_KEY, value);
	} catch {}
}
function makeId(prefix) {
	if (!isBrowser()) return `${prefix}-ssr`;
	if (crypto.randomUUID) return `${prefix}-${crypto.randomUUID()}`;
	const seed = Array.from(crypto.getRandomValues(/* @__PURE__ */ new Uint32Array(2))).map((value) => value.toString(16)).join("");
	return `${prefix}-${Date.now()}-${seed}`;
}
function dayKey() {
	return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function monthKey() {
	return (/* @__PURE__ */ new Date()).toISOString().slice(0, 7);
}
function connectionTypeLabel(value) {
	switch (value.toUpperCase()) {
		case "5G": return "Mạng di động 5G";
		case "4G": return "Mạng di động 4G";
		case "3G": return "Mạng di động 3G";
		case "2G": return "Mạng di động 2G";
		case "SLOW-2G": return "Mạng di động chậm";
		default: return "Mạng băng thông rộng";
	}
}
function buildFallbackNetworkLabel(connectionType, country = "Việt Nam") {
	return `${connectionTypeLabel(connectionType)} · ${country}`;
}
function compactLocation(parts) {
	return parts.map((part) => (part || "").trim()).filter(Boolean).join(", ");
}
function buildNetworkDisplay(info) {
	const location = compactLocation([
		info.city,
		info.region,
		info.country
	]);
	if (info.provider && location) return `${info.provider} · ${location}`;
	if (info.provider) return `${info.provider} · Việt Nam`;
	if (location) return `${info.connectionLabel || "Mạng băng thông rộng"} · ${location}`;
	return info.fallbackLabel || "Mạng băng thông rộng · Việt Nam";
}
function detectConnectionType() {
	if (!isBrowser()) return "";
	const nav = navigator;
	return (nav.connection?.effectiveType || nav.connection?.type || "").toUpperCase();
}
function parseVersion(input) {
	return (input || "").replace(/_/g, ".").trim();
}
function prettifyToken(value) {
	return value.replace(/_/g, " ").replace(/\s+/g, " ").replace(/\b([a-z])/g, (match) => match.toUpperCase()).trim();
}
function inferDeviceKind(ua) {
	if (/iPad|Tablet|Nexus 7|SM-T|Tab/i.test(ua)) return "tablet";
	if (/Mobi|Android|iPhone|Mobile/i.test(ua)) return "mobile";
	if (ua) return "desktop";
	return "unknown";
}
function mapIPhoneModelByViewport() {
	if (!isBrowser()) return {
		family: "iPhone",
		model: "iPhone"
	};
	const width = Math.max(window.screen.width, window.screen.height);
	if (width >= 932) return {
		family: "iPhone Pro Max",
		model: "iPhone 15/16 Pro Max"
	};
	if (width >= 926) return {
		family: "iPhone Pro Max",
		model: "iPhone 12/13/14 Pro Max"
	};
	if (width >= 896) return {
		family: "iPhone",
		model: "iPhone XR/11/XS Max"
	};
	if (width >= 852) return {
		family: "iPhone Pro",
		model: "iPhone 14/15/16 Pro"
	};
	if (width >= 844) return {
		family: "iPhone",
		model: "iPhone 12/13/14"
	};
	if (width >= 812) return {
		family: "iPhone",
		model: "iPhone X/XS/11 Pro"
	};
	return {
		family: "iPhone",
		model: "iPhone SE/8/Plus"
	};
}
function inferAndroidManufacturer(token, ua) {
	const source = `${token} ${ua}`;
	if (/SM-|Galaxy|Samsung/i.test(source)) return "Samsung";
	if (/Pixel/i.test(source)) return "Google";
	if (/M210|M20\d|Redmi|Mi |Xiaomi|POCO/i.test(source)) return "Xiaomi";
	if (/CPH|PHT|PAHM|OPPO/i.test(source)) return "OPPO";
	if (/V2\d|VIVO/i.test(source)) return "Vivo";
	if (/RMX|realme/i.test(source)) return "realme";
	if (/HUAWEI|ANA-|ELS-|JAD-|BLA-/i.test(source)) return "Huawei";
	if (/TECNO|Infinix/i.test(source)) return /TECNO/i.test(source) ? "TECNO" : "Infinix";
	return "Android";
}
function parseAndroidModel(ua) {
	const rawModel = prettifyToken(ua.match(/Android\s[\d.]+;\s*([^;)]+?)(?:\sBuild\/|;|\))/i)?.[1] || "Android");
	const manufacturer = inferAndroidManufacturer(rawModel, ua);
	return {
		manufacturer,
		family: rawModel.split(" ").slice(0, 2).join(" ").trim() || manufacturer,
		model: rawModel
	};
}
function detectDeviceProfile() {
	if (!isBrowser()) return defaultDevice;
	const ua = navigator.userAgent || "";
	const kind = inferDeviceKind(ua);
	let osName = "Unknown";
	let osVersion = "";
	if (/Windows NT/i.test(ua)) {
		osName = "Windows";
		osVersion = parseVersion(ua.match(/Windows NT ([\d.]+)/i)?.[1]);
	} else if (/Android/i.test(ua)) {
		osName = "Android";
		osVersion = parseVersion(ua.match(/Android ([\d.]+)/i)?.[1]);
	} else if (/iPhone|iPad|iPod/i.test(ua)) {
		osName = /iPad/i.test(ua) ? "iPadOS" : "iOS";
		osVersion = parseVersion(ua.match(/OS ([\d_]+)/i)?.[1]);
	} else if (/Mac OS X/i.test(ua)) {
		osName = "macOS";
		osVersion = parseVersion(ua.match(/Mac OS X ([\d_]+)/i)?.[1]);
	} else if (/Linux/i.test(ua)) osName = "Linux";
	const browserMatchers = [
		[/Edg\/([\d.]+)/i, "Edge"],
		[/OPR\/([\d.]+)/i, "Opera"],
		[/Chrome\/([\d.]+)/i, "Chrome"],
		[/Version\/([\d.]+).*Safari/i, "Safari"],
		[/Firefox\/([\d.]+)/i, "Firefox"]
	];
	let browserName = "Unknown";
	let browserVersion = "";
	for (const [matcher, name] of browserMatchers) {
		const match = ua.match(matcher);
		if (match) {
			browserName = name;
			browserVersion = match[1] || "";
			break;
		}
	}
	if (/FBAN|FBAV/i.test(ua)) browserName = "Facebook In-App";
	if (/TikTok|BytedanceWebview/i.test(ua)) browserName = "TikTok In-App";
	if (/Zalo/i.test(ua)) browserName = "Zalo In-App";
	const isInAppBrowser = /FBAN|FBAV|TikTok|BytedanceWebview|Zalo/i.test(ua);
	let manufacturer = "Unknown";
	let family = osName;
	let model = osName;
	if (/Android/i.test(ua)) {
		const parsed = parseAndroidModel(ua);
		manufacturer = parsed.manufacturer;
		family = parsed.family;
		model = parsed.model;
	} else if (/iPhone/i.test(ua)) {
		const parsed = mapIPhoneModelByViewport();
		manufacturer = "Apple";
		family = parsed.family;
		model = parsed.model;
	} else if (/iPad/i.test(ua)) {
		manufacturer = "Apple";
		family = "iPad";
		model = "iPad";
	} else if (/Mac/i.test(ua)) {
		manufacturer = "Apple";
		family = "Mac";
		model = "Mac";
	} else if (/Windows/i.test(ua)) {
		manufacturer = "Microsoft / OEM";
		family = "Windows PC";
		model = "PC Windows";
	}
	return {
		userAgent: ua,
		manufacturer,
		family,
		model,
		kind,
		osName,
		osVersion,
		os: [osName, osVersion].filter(Boolean).join(" "),
		browserName,
		browserVersion,
		browser: [browserName, browserVersion].filter(Boolean).join(" "),
		isInAppBrowser
	};
}
function detectHeadlessBrowser() {
	if (!isBrowser()) return false;
	return Boolean(navigator.webdriver || /HeadlessChrome|Puppeteer|Playwright|PhantomJS/i.test(navigator.userAgent) || navigator.languages && navigator.languages.length === 0);
}
function getVisitorId() {
	if (!isBrowser()) return "visitor-ssr";
	try {
		const stored = window.localStorage.getItem(VISITOR_ID_KEY);
		if (stored) return stored;
		const next = makeId("visitor");
		window.localStorage.setItem(VISITOR_ID_KEY, next);
		return next;
	} catch {
		return makeId("visitor");
	}
}
function readAttribution() {
	if (!isBrowser()) return defaultAttribution;
	const stored = readJSON(ATTRIBUTION_KEY, {});
	const params = new URLSearchParams(window.location.search);
	const pick = (key) => params.get(key) || stored[key] || "";
	const attribution = {
		source: pick("utm_source"),
		medium: pick("utm_medium"),
		campaign: pick("utm_campaign"),
		content: pick("utm_content"),
		term: pick("utm_term"),
		ttclid: pick("ttclid"),
		landingUrl: window.location.href.split("#")[0] ?? window.location.href
	};
	if (params.toString()) writeJSON(ATTRIBUTION_KEY, {
		utm_source: attribution.source,
		utm_medium: attribution.medium,
		utm_campaign: attribution.campaign,
		utm_content: attribution.content,
		utm_term: attribution.term,
		ttclid: attribution.ttclid
	});
	return attribution;
}
function computeMetrics() {
	const now = isBrowser() ? Date.now() : runtime.startedAt;
	const timeOnPageSeconds = runtime.startedAt ? Math.max(0, Math.round((now - runtime.startedAt) / 1e3)) : 0;
	const timeToFirstInteractionSeconds = runtime.firstInteractionAt ? Math.max(0, Math.round((runtime.firstInteractionAt - runtime.startedAt) / 1e3)) : 0;
	const formFillDurationSeconds = runtime.formStartedAt ? Math.max(0, Math.round((now - runtime.formStartedAt) / 1e3)) : 0;
	const focusSection = Object.entries(runtime.sectionTime).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
	const batteryDrain = runtime.startBatteryLevel != null && runtime.currentBatteryLevel != null ? Math.max(0, runtime.startBatteryLevel - runtime.currentBatteryLevel) : 0;
	return {
		timeOnPageSeconds,
		timeToFirstInteractionSeconds,
		formFillDurationSeconds,
		scrollDepthPercent: runtime.maxScrollPercent,
		industrySwitchCount: Math.max(0, runtime.industrySwitchCount - 1),
		focusSection,
		faqClicked: runtime.faqClicked,
		copiedTextType: runtime.copiedTextType,
		isCopyPaste: runtime.isCopyPaste,
		isHeadlessBrowser: detectHeadlessBrowser(),
		submissionCountSameVisitor: 0,
		startBatteryLevel: runtime.startBatteryLevel,
		currentBatteryLevel: runtime.currentBatteryLevel,
		batteryDrain,
		sessionCounts: runtime.sessionCounts
	};
}
function buildSnapshot() {
	return {
		device: runtime.device,
		network: runtime.network,
		attribution: runtime.attribution,
		metrics: computeMetrics(),
		visitorId: runtime.visitorId,
		sessionId: runtime.sessionId,
		initialized: runtime.initialized
	};
}
/**
* Snapshot được cache theo `snapshotVersion` (tăng mỗi lần emit) để
* useSyncExternalStore luôn nhận cùng một tham chiếu giữa hai lần thay đổi —
* nếu không React sẽ render lặp vô hạn.
*/
var cachedSnapshot = null;
var cachedVersion = -1;
function getSnapshot() {
	if (!cachedSnapshot || cachedVersion !== snapshotVersion) {
		cachedSnapshot = buildSnapshot();
		cachedVersion = snapshotVersion;
	}
	return cachedSnapshot;
}
var serverSnapshot = null;
function getServerSnapshot() {
	serverSnapshot ??= buildSnapshot();
	return serverSnapshot;
}
function useVisitorTrackingSnapshot() {
	return (0, import_react.useSyncExternalStore)(subscribe, getSnapshot, getServerSnapshot);
}
function updateSnapshot() {
	emit();
}
function readLocalSessionCounts(isNewSession) {
	const stored = readJSON(COUNTERS_KEY, {
		day: {
			key: dayKey(),
			count: 0
		},
		month: {
			key: monthKey(),
			count: 0
		}
	});
	const nextDay = stored.day.key === dayKey() ? stored.day.count : 0;
	const nextMonth = stored.month.key === monthKey() ? stored.month.count : 0;
	const dayCount = isNewSession ? nextDay + 1 : Math.max(1, nextDay);
	const monthCount = isNewSession ? nextMonth + 1 : Math.max(1, nextMonth);
	writeJSON(COUNTERS_KEY, {
		day: {
			key: dayKey(),
			count: dayCount
		},
		month: {
			key: monthKey(),
			count: monthCount
		}
	});
	return {
		currentSession: 1,
		today: dayCount,
		month: monthCount
	};
}
async function fetchRemoteSessionCounts(options, visitorId, sessionId, isNewSession, attribution, device) {
	if (options.storageMode !== "database" || !options.supabaseUrl || !options.supabaseAnonKey || !isBrowser()) return;
	const base = options.supabaseUrl.replace(/\/$/, "");
	const headers = {
		"Content-Type": "application/json",
		apikey: options.supabaseAnonKey
	};
	try {
		if (isNewSession) await fetch(`${base}/rest/v1/${VISITOR_SESSION_TABLE}`, {
			method: "POST",
			headers: {
				...headers,
				Prefer: "resolution=ignore-duplicates,return=minimal"
			},
			body: JSON.stringify([{
				id: sessionId,
				visitor_id: visitorId,
				visited_day: dayKey(),
				visited_month: monthKey(),
				source: attribution.source || null,
				medium: attribution.medium || null,
				campaign: attribution.campaign || null,
				content: attribution.content || null,
				device_model: device.model,
				device_kind: device.kind,
				os: device.os,
				browser: device.browser,
				created_at: (/* @__PURE__ */ new Date()).toISOString()
			}])
		});
		const [todayResponse, monthResponse] = await Promise.all([fetch(`${base}/rest/v1/${VISITOR_SESSION_TABLE}?visitor_id=eq.${encodeURIComponent(visitorId)}&visited_day=eq.${dayKey()}&select=id`, { headers }), fetch(`${base}/rest/v1/${VISITOR_SESSION_TABLE}?visitor_id=eq.${encodeURIComponent(visitorId)}&visited_month=eq.${monthKey()}&select=id`, { headers })]);
		if (!todayResponse.ok || !monthResponse.ok) return;
		const [todayRows, monthRows] = await Promise.all([todayResponse.json(), monthResponse.json()]);
		runtime.sessionCounts = {
			currentSession: 1,
			today: Array.isArray(todayRows) ? todayRows.length : runtime.sessionCounts.today,
			month: Array.isArray(monthRows) ? monthRows.length : runtime.sessionCounts.month
		};
		updateSnapshot();
	} catch {}
}
async function refreshNetworkInfo() {
	if (!isBrowser()) return;
	const connectionType = detectConnectionType();
	runtime.network = {
		...runtime.network,
		connectionType,
		connectionLabel: connectionTypeLabel(connectionType),
		fallbackLabel: buildFallbackNetworkLabel(connectionType),
		displayLabel: buildFallbackNetworkLabel(connectionType),
		lookupStatus: "loading"
	};
	updateSnapshot();
	const controller = new AbortController();
	const timer = window.setTimeout(() => controller.abort(), NETWORK_TIMEOUT_MS);
	try {
		const payload = await (await fetch("https://ipwho.is/", { signal: controller.signal })).json();
		window.clearTimeout(timer);
		const provider = payload.connection?.isp || payload.connection?.org || "";
		runtime.network = {
			ip: payload.ip || "",
			city: payload.city || "",
			region: payload.region || "",
			country: payload.country || "Việt Nam",
			isp: payload.connection?.isp || "",
			organization: payload.connection?.org || "",
			provider,
			connectionType,
			connectionLabel: connectionTypeLabel(connectionType),
			fallbackLabel: buildFallbackNetworkLabel(connectionType, payload.country || "Việt Nam"),
			displayLabel: "",
			flags: [
				payload.security?.vpn && "VPN",
				payload.security?.proxy && "Proxy",
				payload.security?.tor && "Tor",
				payload.security?.hosting && "Hosting"
			].filter((flag) => Boolean(flag)),
			lookupStatus: payload.success === false ? "fallback" : "resolved"
		};
		runtime.network.displayLabel = buildNetworkDisplay(runtime.network);
	} catch {
		window.clearTimeout(timer);
		runtime.network = {
			...runtime.network,
			lookupStatus: "fallback",
			displayLabel: buildNetworkDisplay(runtime.network)
		};
	}
	updateSnapshot();
}
function initVisitorTracking(options = {}) {
	if (!isBrowser()) return () => {};
	runtime.options = options;
	if (runtime.initialized) {
		fetchRemoteSessionCounts(runtime.options, runtime.visitorId, runtime.sessionId, false, runtime.attribution, runtime.device);
		return runtime.cleanup || (() => {});
	}
	runtime.initialized = true;
	runtime.startedAt = Date.now();
	runtime.firstInteractionAt = 0;
	runtime.formStartedAt = 0;
	runtime.maxScrollPercent = 0;
	runtime.industrySwitchCount = 0;
	runtime.faqClicked = "";
	runtime.copiedTextType = "";
	runtime.isCopyPaste = false;
	runtime.sectionTime = {};
	runtime.visibleSections = {};
	runtime.visitorId = getVisitorId();
	runtime.sessionId = readSessionMarker() || makeId("session");
	const isNewSession = !readSessionMarker();
	if (isNewSession) writeSessionMarker(runtime.sessionId);
	runtime.device = detectDeviceProfile();
	runtime.attribution = readAttribution();
	runtime.sessionCounts = readLocalSessionCounts(isNewSession);
	runtime.network = {
		...defaultNetwork,
		connectionType: detectConnectionType(),
		connectionLabel: connectionTypeLabel(detectConnectionType()),
		fallbackLabel: buildFallbackNetworkLabel(detectConnectionType()),
		displayLabel: buildFallbackNetworkLabel(detectConnectionType())
	};
	updateSnapshot();
	const markInteraction = () => {
		if (!runtime.firstInteractionAt) runtime.firstInteractionAt = Date.now();
		updateSnapshot();
	};
	const onScroll = () => {
		markInteraction();
		const total = document.documentElement.scrollHeight - window.innerHeight;
		const percent = total > 0 ? Math.round((window.scrollY || 0) / total * 100) : 100;
		runtime.maxScrollPercent = Math.max(runtime.maxScrollPercent, Math.min(100, percent));
		updateSnapshot();
	};
	const events = [
		["scroll", onScroll],
		["pointerdown", markInteraction],
		["keydown", markInteraction]
	];
	events.forEach(([name, handler]) => window.addEventListener(name, handler, { passive: true }));
	onScroll();
	let observer;
	const tick = window.setInterval(() => {
		Object.keys(runtime.visibleSections).forEach((name) => {
			if (runtime.visibleSections[name]) runtime.sectionTime[name] = (runtime.sectionTime[name] || 0) + 1;
		});
		updateSnapshot();
	}, 1e3);
	if ("IntersectionObserver" in window) {
		observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				const name = entry.target.dataset["section"];
				if (name) runtime.visibleSections[name] = entry.isIntersecting && entry.intersectionRatio > .4 ? 1 : 0;
			});
		}, { threshold: [
			0,
			.4,
			.8
		] });
		document.querySelectorAll("[data-section]").forEach((element) => observer?.observe(element));
	}
	navigator.getBattery?.().then((battery) => {
		runtime.startBatteryLevel = Math.round(battery.level * 100);
		runtime.currentBatteryLevel = runtime.startBatteryLevel;
		battery.addEventListener("levelchange", () => {
			runtime.currentBatteryLevel = Math.round(battery.level * 100);
			updateSnapshot();
		});
		updateSnapshot();
	}).catch(() => {});
	refreshNetworkInfo();
	fetchRemoteSessionCounts(runtime.options, runtime.visitorId, runtime.sessionId, isNewSession, runtime.attribution, runtime.device);
	runtime.cleanup = () => {
		events.forEach(([name, handler]) => window.removeEventListener(name, handler));
		window.clearInterval(tick);
		observer?.disconnect();
		runtime.initialized = false;
		runtime.cleanup = void 0;
	};
	return runtime.cleanup;
}
function incrementSubmissionCounter() {
	const store = readJSON(SUBMISSION_KEY, {
		day: dayKey(),
		counts: {}
	});
	const counts = store.day === dayKey() ? store.counts : {};
	counts[runtime.visitorId || "unknown"] = (counts[runtime.visitorId || "unknown"] || 0) + 1;
	writeJSON(SUBMISSION_KEY, {
		day: dayKey(),
		counts
	});
	return counts[runtime.visitorId || "unknown"] ?? 1;
}
function markFormStart() {
	if (!runtime.formStartedAt) runtime.formStartedAt = Date.now();
	if (!runtime.firstInteractionAt) runtime.firstInteractionAt = Date.now();
	updateSnapshot();
}
function markIndustrySwitch() {
	runtime.industrySwitchCount += 1;
	updateSnapshot();
}
function markFaqClick(slug) {
	runtime.faqClicked = slug;
	updateSnapshot();
}
function markCopyPaste(type = "sdt") {
	runtime.isCopyPaste = true;
	runtime.copiedTextType = type;
	updateSnapshot();
}
function getTrackingSnapshot() {
	return getSnapshot();
}
function collectBehavior(form) {
	const snapshot = getSnapshot();
	const submissionCount = incrementSubmissionCounter();
	snapshot.metrics.submissionCountSameVisitor = submissionCount;
	return {
		time_on_page_seconds: snapshot.metrics.timeOnPageSeconds,
		time_to_first_interaction_seconds: snapshot.metrics.timeToFirstInteractionSeconds,
		form_fill_duration_seconds: snapshot.metrics.formFillDurationSeconds,
		scroll_depth_percent: snapshot.metrics.scrollDepthPercent,
		industry_switch_count: snapshot.metrics.industrySwitchCount,
		focus_section: snapshot.metrics.focusSection,
		faq_clicked: snapshot.metrics.faqClicked,
		copied_text_type: snapshot.metrics.copiedTextType,
		is_copy_paste: snapshot.metrics.isCopyPaste,
		is_headless_browser: snapshot.metrics.isHeadlessBrowser,
		submission_count_same_ip: submissionCount,
		device_model_name: snapshot.device.model,
		device_manufacturer: snapshot.device.manufacturer,
		device_family: snapshot.device.family,
		operating_system: snapshot.device.osName,
		operating_system_version: snapshot.device.osVersion,
		browser: snapshot.device.browserName,
		browser_version: snapshot.device.browserVersion,
		connection_type: snapshot.network.connectionType,
		network_provider: snapshot.network.provider,
		network_label: snapshot.network.displayLabel,
		network_flags: snapshot.network.flags,
		start_battery_level: snapshot.metrics.startBatteryLevel,
		current_battery_level: snapshot.metrics.currentBatteryLevel,
		battery_drain: snapshot.metrics.batteryDrain,
		client_ip: snapshot.network.ip,
		location_city: snapshot.network.city,
		location_region: snapshot.network.region,
		location_country: snapshot.network.country,
		form_city: form.city,
		nganh_hoc: form.major,
		utm_source: snapshot.attribution.source,
		utm_medium: snapshot.attribution.medium,
		utm_campaign: snapshot.attribution.campaign,
		utm_content: snapshot.attribution.content,
		utm_term: snapshot.attribution.term,
		ttclid: snapshot.attribution.ttclid,
		visits_today: snapshot.metrics.sessionCounts.today,
		visits_month: snapshot.metrics.sessionCounts.month,
		current_session: snapshot.metrics.sessionCounts.currentSession
	};
}
function initBehavior(options = {}) {
	return initVisitorTracking(options);
}
function scoreLead(data, cfg) {
	if (cfg?.enabled === false) return {
		score: 0,
		rank: "Chưa chấm AI",
		riskLevel: "unrated",
		reasons: ["AI Sales Advisor đang tắt trong cấu hình Admin"],
		recommendedAction: "Tư vấn theo quy trình thông thường"
	};
	const fastFill = cfg?.fastFillThresholdSec ?? 4;
	const vipTime = cfg?.vipTimeOnPageSec ?? 80;
	const vipScroll = cfg?.vipScrollPercent ?? 70;
	const reasons = [];
	const locationMismatch = Boolean(data.location_city && data.form_city && !data.location_city.toLowerCase().includes(data.form_city.toLowerCase()) && !data.form_city.toLowerCase().includes(data.location_city.toLowerCase()));
	if (data.is_headless_browser) reasons.push("Trình duyệt tự động/headless được nhận diện");
	if (data.form_fill_duration_seconds > 0 && data.form_fill_duration_seconds < fastFill) reasons.push(`Thời gian điền form dưới ${fastFill} giây`);
	if (data.submission_count_same_ip > 1) reasons.push(`Thiết bị đã ghi nhận ${data.submission_count_same_ip} lần gửi trong ngày`);
	if (locationMismatch && data.is_copy_paste) reasons.push("Khu vực mạng khác tỉnh khai báo kèm thao tác copy số điện thoại");
	if (data.network_flags.length > 0) reasons.push(`Mạng có tín hiệu: ${data.network_flags.join(", ")}`);
	if (data.is_headless_browser) return {
		score: 5,
		rank: "Bot / Ảo",
		riskLevel: "high",
		reasons,
		recommendedAction: "Không tự động gọi; kiểm tra lead và nguồn quảng cáo"
	};
	const safeRegex = (pattern) => {
		if (!pattern) return null;
		try {
			return new RegExp(pattern, "i");
		} catch {
			return null;
		}
	};
	const vipDevice = safeRegex(cfg?.vipDeviceRegex) ?? /iPhone (12|13|14|15|16)|Galaxy S(22|23|24|25)|Fold|Flip|Pixel/i;
	const keyRegion = safeRegex(cfg?.keyRegions) ?? /Nghệ An|Hà Tĩnh|Quảng Bình|Thanh Hóa|Quảng Ninh|Hải Phòng/i;
	let score = 45;
	if (vipDevice.test(data.device_model_name)) score += 18;
	if (data.time_on_page_seconds >= vipTime) score += 15;
	if (data.scroll_depth_percent >= vipScroll) score += 12;
	if (keyRegion.test(data.form_city)) score += 8;
	if (data.utm_source && data.utm_source !== "Direct") score += 5;
	if (data.focus_section === "luong_thuc_tap" || data.copied_text_type === "chi_phi") score += 5;
	if (data.visits_today >= 2) score += 4;
	score = Math.max(0, Math.min(100, score));
	const riskLevel = data.submission_count_same_ip > 1 || locationMismatch && data.is_copy_paste || data.network_flags.includes("Tor") ? "high" : data.form_fill_duration_seconds > 0 && data.form_fill_duration_seconds < fastFill ? "review" : "low";
	return {
		score,
		rank: score >= 80 ? "VIP" : score >= 65 ? "Tiềm năng cao" : score >= 50 ? "Tiềm năng" : "Cần nuôi dưỡng",
		riskLevel,
		reasons,
		recommendedAction: riskLevel === "high" ? "Xác minh thủ công trước khi gửi báo giá hoặc chuyển sale" : riskLevel === "review" ? "Ưu tiên xác minh qua Zalo trước khi gọi" : "Gọi tư vấn theo kịch bản phù hợp nhu cầu"
	};
}
function generateSaleAdvice(data, assessment = scoreLead(data)) {
	if (assessment.riskLevel === "unrated") return `ℹ️ [CHƯA CHẤM AI] ${assessment.recommendedAction}.`;
	if (assessment.riskLevel === "high") return `⚠️ [CẦN XÁC MINH] ${assessment.reasons.join("; ") || "Lead có tín hiệu bất thường"}. ${assessment.recommendedAction}.`;
	if (assessment.riskLevel === "review") return `🟡 [TÍN HIỆU YẾU] ${assessment.reasons.join("; ") || "Cần xác minh thêm"}. ${assessment.recommendedAction}.`;
	const advice = [];
	const isHighEndDevice = /iPhone (12|13|14|15|16)|Galaxy S(22|23|24|25)|Fold|Flip|Pixel/i.test(data.device_model_name);
	const isKeyRegion = /Nghệ An|Hà Tĩnh|Quảng Bình|Thanh Hóa|Quảng Ninh|Hải Phòng/i.test(data.form_city);
	const isNightTime = (() => {
		const hour = (/* @__PURE__ */ new Date()).getHours();
		return hour >= 22 || hour <= 6;
	})();
	if (isHighEndDevice && data.time_on_page_seconds >= 80 && data.scroll_depth_percent >= 70) {
		advice.push(`💡 [KHÁCH VIP] Thiết bị ${data.device_model_name}, đọc kỹ trang ${data.time_on_page_seconds}s và cuộn ${data.scroll_depth_percent}%.`);
		advice.push(`👉 Tư vấn theo hướng phụ huynh quan tâm độ an toàn, lộ trình visa và đầu ra nghề nghiệp của ngành ${data.nganh_hoc}.`);
	} else if (data.focus_section === "luong_thuc_tap" || data.copied_text_type === "chi_phi" || /cpc|paid|ads/i.test(data.utm_medium)) {
		advice.push("💡 [KHÁCH QUAN TÂM TÀI CHÍNH] Tập trung vào thu nhập, chi phí và khả năng tự chủ tài chính.");
		advice.push(`👉 Mở đầu bằng mức lương thực tập của ngành ${data.nganh_hoc}, rồi chốt bằng lộ trình học phí 0Đ và cơ hội việc làm sau tốt nghiệp.`);
	} else if (data.faq_clicked === "tieng_trung") {
		advice.push("💡 [LO NGẠI NGÔN NGỮ] Khách quan tâm rào cản tiếng Trung và điều kiện đầu vào.");
		advice.push("👉 Tư vấn ngắn, rõ: học từ 0, có lộ trình tiền HSK và hỗ trợ thích nghi trước khi bay.");
	} else if (data.industry_switch_count > 1) {
		advice.push(`💡 [PHÂN VÂN NGÀNH] Đã đổi ngành ${data.industry_switch_count} lần trước khi chốt ${data.nganh_hoc}.`);
		advice.push("👉 Sale nên đóng vai hướng nghiệp, so sánh đầu ra, môi trường làm việc và thu nhập giữa 2-3 ngành gần nhau.");
	} else if (data.time_on_page_seconds < 25) {
		advice.push(`💡 [XEM NHANH] Khách lướt nhanh bằng ${data.device_model_name}.`);
		advice.push("👉 Ưu tiên gửi Zalo kèm ảnh thực tế/KTX trước, sau đó mới gọi điện chốt nhu cầu.");
	} else {
		advice.push(`💡 [TÌM HIỂU NGHIÊM TÚC] ${data.device_model_name} · ${data.network_label}. Ngành quan tâm: ${data.nganh_hoc}.`);
		advice.push("👉 Gọi tư vấn theo kịch bản khám phá mục tiêu học tập, tài chính và thời điểm nhập học phù hợp.");
	}
	if (data.current_battery_level != null && data.current_battery_level <= 15) advice.push(`⚡ Pin chỉ còn ${data.current_battery_level}%, ưu tiên nhắn Zalo/gọi sớm để không rơi lead.`);
	if (data.time_to_first_interaction_seconds > 120) advice.push("🧐 Khách suy nghĩ khá lâu trước khi điền form, cần tư vấn chuyên sâu và tránh chốt vội.");
	if (isKeyRegion) advice.push(`📌 Khách ở ${data.form_city}, nên nhắc tới cộng đồng học viên đồng hương và case thành công gần khu vực này.`);
	if (isNightTime) advice.push("🌙 Lead đến vào đêm muộn, nên nhắn chào ngay nhưng hẹn gọi lại vào giờ hành chính hôm sau.");
	return advice.join("\n");
}
function generateBehaviorSummary(data) {
	const items = [
		`⏱️ ${data.time_on_page_seconds}s trên trang`,
		`🖱️ ${data.time_to_first_interaction_seconds || 0}s tới lần tương tác đầu`,
		`📝 ${data.form_fill_duration_seconds || 0}s điền form`,
		`📜 Cuộn ${data.scroll_depth_percent}%`,
		`👀 Phiên #${data.current_session} · Hôm nay ${data.visits_today} · Tháng ${data.visits_month}`
	];
	if (data.industry_switch_count > 0) items.push(`🔄 Đổi ngành ${data.industry_switch_count} lần`);
	if (data.focus_section) items.push(`🎯 Tập trung ${data.focus_section}`);
	if (data.faq_clicked) items.push(`❓ FAQ ${data.faq_clicked}`);
	if (data.is_copy_paste) items.push("📋 Có thao tác copy/paste");
	return items.join(" | ");
}
function generateDeviceTechInfo(data) {
	const batteryInfo = data.start_battery_level != null && data.current_battery_level != null ? `Pin ${data.current_battery_level}% (giảm ${data.battery_drain}%)` : "Pin: thiết bị không chia sẻ";
	const os = [data.operating_system, data.operating_system_version].filter((part) => part && part !== "Unknown").join(" ");
	const browser = [data.browser, data.browser_version].filter((part) => part && part !== "Unknown").join(" ");
	return [
		[data.device_manufacturer, data.device_model_name].filter((part) => part && part !== "Unknown").join(" ") || "Thiết bị chưa nhận diện",
		os || "Hệ điều hành chưa rõ",
		browser || "Trình duyệt chưa rõ",
		data.network_label,
		batteryInfo
	].filter(Boolean).join(" | ");
}
function generateTrafficAdsSource(data) {
	const source = (data.utm_source || "Direct").trim();
	if (!Boolean(data.utm_medium || data.utm_campaign || data.utm_content || data.utm_term || data.ttclid) && source.toLowerCase() === "direct") return "Nguồn: Truy cập trực tiếp (không qua chiến dịch quảng cáo)";
	const parts = [
		`Source: ${source}`,
		data.utm_medium && `Medium: ${data.utm_medium}`,
		data.utm_campaign && `Campaign: ${data.utm_campaign}`,
		data.utm_content && `Content: ${data.utm_content}`,
		data.utm_term && `Term: ${data.utm_term}`,
		data.ttclid && `TTCLID: ${data.ttclid}`
	].filter(Boolean);
	return parts.length > 0 ? parts.join(" | ") : "Nguồn: Truy cập trực tiếp";
}
function buildVisitorBehaviorPayload(input, cfg) {
	const behavior = collectBehavior(input);
	const assessment = scoreLead(behavior, cfg);
	const snapshot = getTrackingSnapshot();
	const saleAdvice = generateSaleAdvice(behavior, assessment);
	const behaviorSummary = generateBehaviorSummary(behavior);
	const deviceTechInfo = generateDeviceTechInfo(behavior);
	const trafficAdsSource = generateTrafficAdsSource(behavior);
	return {
		behavior,
		assessment,
		visitorBehaviorPayload: {
			submittedAt: (/* @__PURE__ */ new Date()).toISOString(),
			device: snapshot.device,
			network: snapshot.network,
			attribution: snapshot.attribution,
			metrics: {
				...snapshot.metrics,
				submissionCountSameVisitor: behavior.submission_count_same_ip
			},
			form: input,
			assessment,
			saleAdvice,
			behaviorSummary,
			deviceTechInfo,
			trafficAdsSource
		}
	};
}
var MAJORS = [
	"Công nghệ Ô tô điện",
	"Công nghệ Drone (UAV)",
	"Thương mại điện tử",
	"Logistics & Chuỗi cung ứng",
	"Kỹ thuật Điện tử",
	"IoT - Internet vạn vật",
	"Cơ khí tự động hóa",
	"Hán ngữ thương mại"
];
/** 63 tỉnh/thành Việt Nam gom theo vùng (dùng cho <optgroup>) */
var PROVINCE_GROUPS = [
	{
		region: "Miền Bắc",
		provinces: [
			"Hà Nội",
			"Hà Giang",
			"Cao Bằng",
			"Bắc Kạn",
			"Tuyên Quang",
			"Lào Cai",
			"Điện Biên",
			"Lai Châu",
			"Sơn La",
			"Yên Bái",
			"Hòa Bình",
			"Thái Nguyên",
			"Lạng Sơn",
			"Quảng Ninh",
			"Bắc Giang",
			"Phú Thọ",
			"Vĩnh Phúc",
			"Bắc Ninh",
			"Hải Dương",
			"Hải Phòng",
			"Hưng Yên",
			"Thái Bình",
			"Hà Nam",
			"Nam Định",
			"Ninh Bình"
		]
	},
	{
		region: "Miền Trung & Tây Nguyên",
		provinces: [
			"Thanh Hóa",
			"Nghệ An",
			"Hà Tĩnh",
			"Quảng Bình",
			"Quảng Trị",
			"Thừa Thiên Huế",
			"Đà Nẵng",
			"Quảng Nam",
			"Quảng Ngãi",
			"Bình Định",
			"Phú Yên",
			"Khánh Hòa",
			"Ninh Thuận",
			"Bình Thuận",
			"Kon Tum",
			"Gia Lai",
			"Đắk Lắk",
			"Đắk Nông",
			"Lâm Đồng"
		]
	},
	{
		region: "Miền Nam",
		provinces: [
			"Bình Phước",
			"Tây Ninh",
			"Bình Dương",
			"Đồng Nai",
			"Bà Rịa - Vũng Tàu",
			"TP. Hồ Chí Minh",
			"Long An",
			"Tiền Giang",
			"Bến Tre",
			"Trà Vinh",
			"Vĩnh Long",
			"Đồng Tháp",
			"An Giang",
			"Kiên Giang",
			"Cần Thơ",
			"Hậu Giang",
			"Sóc Trăng",
			"Bạc Liêu",
			"Cà Mau"
		]
	}
];
var EMPTY = {
	name: "",
	phone: "",
	email: "",
	province: "",
	major: ""
};
var inputClass = "w-full rounded-xl border border-input bg-background px-4 py-3.5 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30";
/** Rate limiting: giới hạn số lần gửi trong 1 cửa sổ thời gian / trình duyệt (cấu hình trong Admin). */
var RATE_KEY = "lp_rate";
function rateLimited(maxCount, windowMin) {
	if (typeof window === "undefined") return false;
	const now = Date.now();
	const windowMs = Math.max(1, windowMin) * 60 * 1e3;
	let stamps = [];
	try {
		stamps = JSON.parse(localStorage.getItem(RATE_KEY) || "[]");
	} catch {
		stamps = [];
	}
	stamps = stamps.filter((t) => now - t < windowMs);
	if (stamps.length >= Math.max(1, maxCount)) return true;
	stamps.push(now);
	try {
		localStorage.setItem(RATE_KEY, JSON.stringify(stamps));
	} catch {}
	return false;
}
function LeadForm({ id = "dang-ky" }) {
	const { config } = useSiteConfig();
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [error, setError] = (0, import_react.useState)("");
	const [form, setForm] = (0, import_react.useState)(EMPTY);
	const startedRef = (0, import_react.useRef)(false);
	const honeypotRef = (0, import_react.useRef)(null);
	const field = (name, fallback) => config.form.fields.find((item) => item.name === name)?.placeholder || fallback;
	const set = (k) => (e) => setForm((f) => ({
		...f,
		[k]: e.target.value
	}));
	const setMajor = (e) => {
		markIndustrySwitch();
		setForm((f) => ({
			...f,
			major: e.target.value
		}));
	};
	const setPhone = (e) => setForm((f) => ({
		...f,
		phone: e.target.value.replace(/\D/g, "").slice(0, 10)
	}));
	const onFirstInteract = () => {
		if (startedRef.current) return;
		startedRef.current = true;
		markFormStart();
		trackFormStart(config.tracking.events.formStart);
	};
	async function onSubmit(e) {
		e.preventDefault();
		if (status === "sending") return;
		if (honeypotRef.current?.value) {
			setForm(EMPTY);
			setStatus("done");
			return;
		}
		const phone = form.phone.replace(/\D/g, "");
		if (!/^0\d{9}$/.test(phone)) {
			setError("Số điện thoại phải đủ 10 chữ số và bắt đầu bằng 0 — ví dụ: 0912345678.");
			setStatus("error");
			return;
		}
		const email = form.email.trim();
		if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
			setError("Email chưa đúng định dạng — ví dụ: ten@gmail.com.");
			setStatus("error");
			return;
		}
		if (isDuplicateLead(phone)) {
			setError("Số điện thoại này vừa được đăng ký. Tư vấn viên sẽ liên hệ với bạn sớm nhất.");
			setStatus("error");
			return;
		}
		if (rateLimited(config.form.rateLimitCount, config.form.rateLimitWindowMin)) {
			setError("Bạn đã gửi nhiều lần trong thời gian ngắn. Vui lòng chờ vài phút rồi thử lại.");
			setStatus("error");
			return;
		}
		setError("");
		setStatus("sending");
		const { behavior, assessment, visitorBehaviorPayload } = buildVisitorBehaviorPayload({
			city: form.province,
			major: form.major
		}, config.aiAdvisor);
		const { score: aiScore, rank: aiRank } = assessment;
		const variant = getVariant(config.abTest.enabled, config.abTest.split);
		const source = utmSource();
		const payload = {
			full_name: form.name.trim().slice(0, 100),
			phone,
			email: email.slice(0, 255),
			major: form.major,
			city: form.province,
			landing_url: typeof window !== "undefined" ? window.location.href : "Landing Page UTM",
			source: typeof window !== "undefined" ? window.location.href : "Landing Page UTM",
			created_at: visitorBehaviorPayload.submittedAt,
			ab_variant: variant,
			ai_score: aiScore,
			ai_rank: aiRank,
			risk_level: assessment.riskLevel,
			lead_risk_level: assessment.riskLevel,
			risk_reasons: assessment.reasons,
			lead_risk_reasons: assessment.reasons,
			recommended_action: assessment.recommendedAction,
			utm_source: behavior.utm_source,
			utm_medium: behavior.utm_medium,
			utm_campaign: behavior.utm_campaign,
			utm_content: behavior.utm_content,
			utm_term: behavior.utm_term,
			ttclid: behavior.ttclid,
			visits_today: behavior.visits_today,
			visits_month: behavior.visits_month,
			current_session: behavior.current_session,
			device_manufacturer: behavior.device_manufacturer,
			device_family: behavior.device_family,
			device_model_name: behavior.device_model_name,
			operating_system: [behavior.operating_system, behavior.operating_system_version].filter(Boolean).join(" "),
			browser: [behavior.browser, behavior.browser_version].filter(Boolean).join(" "),
			network_provider: behavior.network_provider,
			network_label: behavior.network_label,
			sale_advice: visitorBehaviorPayload.saleAdvice,
			lead_behavior_summary: visitorBehaviorPayload.behaviorSummary,
			behavior_summary: visitorBehaviorPayload.behaviorSummary,
			device_summary: visitorBehaviorPayload.deviceTechInfo,
			device_tech_info: visitorBehaviorPayload.deviceTechInfo,
			utm_traffic_source: visitorBehaviorPayload.trafficAdsSource,
			traffic_ads_source: visitorBehaviorPayload.trafficAdsSource,
			visitor_behavior_payload: visitorBehaviorPayload
		};
		try {
			const leadRecord = {
				id: `ld_${Date.now()}`,
				at: payload.created_at,
				name: payload.full_name,
				phone: payload.phone,
				email: payload.email || void 0,
				city: payload.city || void 0,
				major: payload.major || void 0,
				aiScore,
				aiRank,
				riskLevel: assessment.riskLevel,
				riskReasons: assessment.reasons,
				recommendedAction: assessment.recommendedAction,
				behaviorSummary: payload.behavior_summary,
				saleAdvice: payload.sale_advice,
				deviceTechInfo: payload.device_tech_info,
				trafficAdsSource: payload.traffic_ads_source,
				networkProvider: payload.network_provider || void 0,
				networkLabel: payload.network_label || void 0,
				visitsToday: payload.visits_today,
				visitsMonth: payload.visits_month,
				currentSession: payload.current_session,
				visitorBehaviorPayload,
				utmSource: source,
				utmMedium: payload.utm_medium,
				utmCampaign: payload.utm_campaign,
				utmContent: payload.utm_content,
				ttclid: payload.ttclid,
				variant
			};
			await saveLead(leadRecord, config);
			const delivery = await dispatchLead(config, payload);
			if (!delivery.ok) {
				const failed = delivery.results.filter((result) => !result.ok).map((result) => result.label).join(", ");
				console.warn("Webhook delivery incomplete:", delivery.results);
				throw new Error(failed ? `Webhook chưa nhận được dữ liệu: ${failed}` : "Webhook chưa được cấu hình hoặc chưa phản hồi.");
			}
			trackConversion(source, config.abTest.enabled ? variant : void 0);
			if (config.emailAutomation.enabled && email) {
				const fill = (s) => s.replaceAll("{name}", payload.full_name).replaceAll("{phone}", payload.phone).replaceAll("{city}", payload.city || "").replaceAll("{ai_score}", String(aiScore));
				sendLeadEmail({ data: {
					provider: config.emailAutomation.provider,
					to: email,
					from: config.emailAutomation.fromEmail,
					subject: fill(config.emailAutomation.subject),
					text: fill(config.emailAutomation.body)
				} }).then((result) => {
					if (!result.sent) console.warn("Lead confirmation email was not sent:", result.reason);
				}).catch((error) => {
					console.warn("Lead confirmation email failed:", error);
				});
			}
			trackLead({ content_name: form.major || "Du hoc nghe Trung Quoc" }, config.tracking.events, config.tracking.ga4Id);
			setForm(EMPTY);
			setStatus("done");
			toast.success("Đăng ký thành công!", { description: "Tư vấn viên sẽ liên hệ lại trong 5 phút." });
			const redirect = config.form.redirectUrl?.trim();
			if (redirect && typeof window !== "undefined") window.location.assign(redirect);
			else {
				const thankYou = config.pages.find((page) => page.enabled && page.kind === "thankYou");
				if (thankYou && typeof window !== "undefined") window.location.assign(`/${thankYou.path}`);
			}
		} catch {
			setError("Có lỗi khi gửi thông tin. Vui lòng kiểm tra kết nối và thử gửi lại.");
			setStatus("error");
			toast.error("Gửi chưa thành công", { description: "Vui lòng thử lại sau vài giây." });
		}
	}
	if (status === "done") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		id,
		className: "rounded-2xl bg-card p-8 text-center shadow-[var(--shadow-card)] ring-1 ring-border",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold text-2xl font-bold text-gold-foreground",
				children: "✓"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-4 text-2xl font-extrabold",
				children: "Đăng ký thành công!"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-muted-foreground",
				children: "Tư vấn viên sẽ liên hệ lại với bạn trong 5 phút. Vui lòng để ý điện thoại (cuộc gọi hoặc Zalo)."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setStatus("idle"),
				className: "mt-5 text-sm font-bold text-primary underline underline-offset-4",
				children: "Gửi thêm một đăng ký khác"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		id,
		onSubmit,
		className: "rounded-2xl bg-card p-6 shadow-[var(--shadow-card)] ring-1 ring-border sm:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-bold uppercase tracking-widest text-primary",
				children: "Miễn phí 100%"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-1 text-2xl font-extrabold leading-tight sm:text-3xl",
				children: config.form.headline || "Nhận lộ trình du học nghề 0Đ"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Chỉ 30 giây. Chúng tôi gọi lại tư vấn 1:1, không thu bất kỳ khoản phí nào."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: honeypotRef,
						type: "text",
						name: "company",
						tabIndex: -1,
						autoComplete: "off",
						"aria-hidden": "true",
						className: "absolute left-[-9999px] h-0 w-0 opacity-0"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						maxLength: 100,
						value: form.name,
						onChange: set("name"),
						onFocus: onFirstInteract,
						placeholder: field("name", "Họ và tên"),
						className: inputClass
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						type: "tel",
						inputMode: "numeric",
						pattern: "[0-9]*",
						maxLength: 10,
						value: form.phone,
						onChange: setPhone,
						onFocus: onFirstInteract,
						onPaste: () => markCopyPaste("sdt"),
						placeholder: field("phone", "Số điện thoại (Zalo) — 10 số"),
						className: inputClass
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "email",
						maxLength: 255,
						value: form.email,
						onChange: set("email"),
						onFocus: onFirstInteract,
						placeholder: field("email", "Email (không bắt buộc)"),
						className: inputClass
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						required: true,
						value: form.province,
						onChange: set("province"),
						className: inputClass,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: field("city", "Tỉnh/Thành phố")
						}), PROVINCE_GROUPS.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("optgroup", {
							label: g.region,
							children: g.provinces.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: p,
								children: p
							}, p))
						}, g.region))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						required: true,
						value: form.major,
						onChange: setMajor,
						className: inputClass,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: field("major", "Ngành quan tâm")
						}), MAJORS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: m,
							children: m
						}, m))]
					})
				]
			}),
			status === "error" && error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm font-medium text-destructive",
				role: "alert",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "submit",
				disabled: status === "sending",
				"aria-busy": status === "sending",
				className: "mt-5 flex w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-6 py-4 text-base font-extrabold uppercase tracking-wide text-primary-foreground shadow-[var(--shadow-cta)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 sm:text-lg",
				children: [status === "sending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": "true",
					className: "h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground"
				}), status === "sending" ? "Đang gửi..." : config.form.ctaLabel || "Gửi đăng ký — Nhận lộ trình 0Đ"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-center text-xs text-muted-foreground",
				children: "Thông tin của bạn được bảo mật, chỉ dùng để tư vấn hướng nghiệp."
			})
		]
	});
}
/** Fade + rise vào khi phần tử lọt vào khung nhìn. */
function Reveal({ children, delay = 0, className = "" }) {
	const ref = (0, import_react.useRef)(null);
	const [shown, setShown] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		if (typeof IntersectionObserver === "undefined") {
			setShown(true);
			return;
		}
		const io = new IntersectionObserver((entries) => {
			for (const entry of entries) if (entry.isIntersecting) {
				setShown(true);
				io.disconnect();
			}
		}, {
			rootMargin: "0px 0px -10% 0px",
			threshold: .05
		});
		io.observe(el);
		return () => io.disconnect();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		style: { transitionDelay: `${delay}ms` },
		className: `transition-all duration-700 ease-out ${shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"} ${className}`,
		children
	});
}
function pick(arr, previous) {
	if (!arr.length) return void 0;
	if (arr.length === 1 || previous === void 0) return arr[Math.floor(Math.random() * arr.length)];
	const candidates = arr.filter((item) => item !== previous);
	return candidates[Math.floor(Math.random() * candidates.length)];
}
/** Thông báo "khách vừa đăng ký" trượt lên góc màn hình — dữ liệu & vị trí lấy từ Admin. */
function RecentLeadPopup() {
	const { config } = useSiteConfig();
	const fomo = config.fomo;
	const [item, setItem] = (0, import_react.useState)(null);
	const [visible, setVisible] = (0, import_react.useState)(false);
	const [dismissed, setDismissed] = (0, import_react.useState)(false);
	const previousNameRef = (0, import_react.useRef)(void 0);
	const leadsRef = (0, import_react.useRef)([]);
	const fomoRef = (0, import_react.useRef)(fomo);
	const immediateHideRef = (0, import_react.useRef)(void 0);
	const hideRef = (0, import_react.useRef)(void 0);
	fomoRef.current = fomo;
	const sampleItems = (0, import_react.useMemo)(() => fomo.names.map((name, index) => ({
		name,
		city: fomo.cities[index % Math.max(1, fomo.cities.length)] || "",
		mins: 1 + index % 9
	})), [fomo.names, fomo.cities]);
	(0, import_react.useEffect)(() => {
		const refreshLeads = () => {
			const recent = loadLeads().filter((lead) => {
				const timestamp = new Date(lead.at).getTime();
				return Number.isFinite(timestamp) && Date.now() - timestamp < 864e5;
			});
			leadsRef.current = recent;
		};
		const showNewLead = (event) => {
			const lead = event.detail;
			const currentFomo = fomoRef.current;
			if (!currentFomo.enabled || !lead?.name) return;
			if (currentFomo.respectReducedMotion && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
			const timestamp = new Date(lead.at).getTime();
			const mins = Number.isFinite(timestamp) ? Math.max(1, Math.floor((Date.now() - timestamp) / 6e4)) : 1;
			window.clearTimeout(immediateHideRef.current);
			window.clearTimeout(hideRef.current);
			setItem({
				name: lead.name,
				city: lead.city || "",
				mins
			});
			setDismissed(false);
			setVisible(true);
			immediateHideRef.current = window.setTimeout(() => setVisible(false), Math.min(30, Math.max(2, currentFomo.displaySec)) * 1e3);
		};
		refreshLeads();
		window.addEventListener(LEAD_CREATED_EVENT, refreshLeads);
		window.addEventListener(LEAD_CREATED_EVENT, showNewLead);
		return () => {
			window.removeEventListener(LEAD_CREATED_EVENT, refreshLeads);
			window.removeEventListener(LEAD_CREATED_EVENT, showNewLead);
			window.clearTimeout(immediateHideRef.current);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		setDismissed(false);
		setVisible(false);
		if (!fomo.enabled || fomo.source === "sample" && sampleItems.length === 0 || fomo.source === "recentLeads" && leadsRef.current.length === 0 && sampleItems.length === 0) return;
		if (fomo.respectReducedMotion && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		let hideTimer;
		let nextTimer;
		let lastName = previousNameRef.current;
		const displayMs = Math.min(30, Math.max(2, fomo.displaySec)) * 1e3;
		const minGap = Math.min(3600, Math.max(5, fomo.minDelaySec)) * 1e3;
		const maxGap = Math.min(3600, Math.max(minGap / 1e3, fomo.maxDelaySec)) * 1e3;
		const show = () => {
			const actual = fomo.source === "recentLeads" ? pick(leadsRef.current, leadsRef.current.find((lead) => lead.name === lastName)) : void 0;
			const sample = fomo.source === "sample" || leadsRef.current.length === 0 ? pick(sampleItems, sampleItems.find((entry) => entry.name === lastName)) : void 0;
			const next = actual ? {
				name: actual.name,
				city: actual.city || "",
				mins: Math.max(1, Math.floor((Date.now() - new Date(actual.at).getTime()) / 6e4))
			} : sample;
			if (!next) return;
			lastName = next.name;
			previousNameRef.current = lastName;
			setItem(next);
			setVisible(true);
			hideTimer = window.setTimeout(() => setVisible(false), displayMs);
			hideRef.current = hideTimer;
			const gap = minGap + Math.random() * (maxGap - minGap);
			nextTimer = window.setTimeout(show, displayMs + gap);
		};
		const first = window.setTimeout(show, minGap);
		return () => {
			window.clearTimeout(first);
			if (hideTimer) window.clearTimeout(hideTimer);
			if (nextTimer) window.clearTimeout(nextTimer);
			window.clearTimeout(hideRef.current);
		};
	}, [
		fomo.enabled,
		fomo.source,
		fomo.respectReducedMotion,
		fomo.displaySec,
		fomo.minDelaySec,
		fomo.maxDelaySec,
		sampleItems
	]);
	if (!fomo.enabled || !item || dismissed) return null;
	const message = fomo.template.replaceAll("{name}", item.name).replaceAll("{city}", item.city).replaceAll("{mins}", String(item.mins));
	const side = fomo.position === "right" ? "right-3 sm:right-6 left-auto" : "left-3 sm:left-6 right-auto";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "status",
		"aria-live": "polite",
		className: `pointer-events-none fixed bottom-24 z-40 max-w-[17rem] rounded-2xl bg-card/90 p-3 shadow-[var(--shadow-card)] ring-1 ring-border backdrop-blur transition-all duration-500 sm:bottom-6 ${side} ${visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-auto flex items-start gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs leading-snug text-card-foreground",
					children: message
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-[11px] font-semibold text-primary",
					children: [item.mins, " phút trước"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => {
					setDismissed(true);
					setVisible(false);
				},
				"aria-label": "Đóng thông báo",
				className: "shrink-0 text-xs text-muted-foreground hover:text-foreground",
				children: "×"
			})]
		})
	});
}
/** Carousel ảnh thực tế, tự chạy mượt, có nút chuyển và chấm điều hướng. */
function PhotoCarousel({ slides, interval = 4e3 }) {
	const [i, setI] = (0, import_react.useState)(0);
	const paused = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		const id = window.setInterval(() => {
			if (!paused.current) setI((p) => (p + 1) % slides.length);
		}, interval);
		return () => window.clearInterval(id);
	}, [slides.length, interval]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-hidden rounded-2xl bg-card ring-1 ring-border",
		onMouseEnter: () => paused.current = true,
		onMouseLeave: () => paused.current = false,
		onTouchStart: () => paused.current = true,
		onTouchEnd: () => paused.current = false,
		"aria-roledescription": "carousel",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex transition-transform duration-700 ease-out",
					style: { transform: `translateX(-${i * 100}%)` },
					children: slides.map((s, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
						className: "w-full shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: s.img,
							alt: s.caption,
							width: 1280,
							height: 800,
							loading: "lazy",
							decoding: "async",
							className: "aspect-[16/10] w-full object-cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
							className: "px-4 py-3 text-center text-sm font-semibold text-card-foreground/85",
							children: [
								idx + 1,
								"/",
								slides.length,
								" — ",
								s.caption
							]
						})]
					}, s.img))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Ảnh trước",
					onClick: () => setI((p) => (p - 1 + slides.length) % slides.length),
					className: "absolute left-2 top-1/3 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 text-lg font-bold backdrop-blur",
					children: "‹"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Ảnh tiếp theo",
					onClick: () => setI((p) => (p + 1) % slides.length),
					className: "absolute right-2 top-1/3 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 text-lg font-bold backdrop-blur",
					children: "›"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex justify-center gap-2 pb-4",
			children: slides.map((s, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": `Xem ảnh ${idx + 1}`,
				onClick: () => setI(idx),
				className: `h-2 rounded-full transition-all ${idx === i ? "w-6 bg-primary" : "w-2 bg-border"}`
			}, s.img))
		})]
	});
}
/** Chuẩn hoá số điện thoại & link Zalo từ cấu hình Admin. */
function contactLinks(config) {
	const c = config.floatingContact;
	const phone = (c.hotline || "").replace(/[^\d+]/g, "");
	const zaloRaw = (c.zalo || "").trim();
	const zaloDigits = zaloRaw.replace(/\D/g, "");
	let zaloHref = "";
	if (/^https?:\/\//i.test(zaloRaw)) zaloHref = zaloRaw;
	else if (zaloDigits) zaloHref = `https://zalo.me/${zaloDigits}`;
	else if (phone) zaloHref = `https://zalo.me/${phone.replace(/\D/g, "")}`;
	return {
		enabled: c.enabled,
		phone,
		hotlineHref: phone ? `tel:${phone}` : "#dang-ky",
		hasHotline: Boolean(phone),
		zaloHref: zaloHref || "#dang-ky",
		hasZalo: Boolean(zaloHref),
		messengerHref: (c.messenger || "").trim()
	};
}
/**
* Thanh CTA cố định ở mép dưới, chỉ hiện trên mobile sau khi cuộn qua hero.
* Số điện thoại / Zalo đọc trực tiếp từ cấu hình Admin.
*/
function StickyMobileCTA() {
	const { config } = useSiteConfig();
	const links = contactLinks(config);
	const [show, setShow] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const onScroll = () => setShow(window.scrollY > window.innerHeight * .8);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	function toForm(e) {
		e.preventDefault();
		(document.getElementById("dang-ky-cuoi") ?? document.getElementById("dang-ky"))?.scrollIntoView({
			behavior: "smooth",
			block: "center"
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-3 py-2.5 backdrop-blur transition-transform duration-300 sm:hidden ${show ? "translate-y-0" : "translate-y-full"}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2.5",
			children: [links.enabled && links.hasZalo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: links.zaloHref,
				target: "_blank",
				rel: "noopener noreferrer",
				className: "flex-1 rounded-xl bg-gold py-3.5 text-center text-sm font-extrabold text-gold-foreground shadow-[var(--shadow-card)]",
				children: "Zalo Tư Vấn"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#dang-ky-cuoi",
				onClick: toForm,
				className: "flex-[1.3] rounded-xl bg-primary py-3.5 text-center text-sm font-extrabold uppercase text-primary-foreground shadow-[var(--shadow-cta)]",
				children: "Đăng Ký Ngay"
			})]
		})
	});
}
/** Cụm nút liên hệ nổi (Hotline / Zalo / Messenger) — đọc từ cấu hình Admin. */
function FloatingContact() {
	const { config } = useSiteConfig();
	const links = contactLinks(config);
	if (!links.enabled) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed bottom-24 right-4 z-50 flex flex-col gap-3 sm:bottom-6 sm:right-6",
		children: [links.messengerHref && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: links.messengerHref,
			target: "_blank",
			rel: "noopener noreferrer",
			"aria-label": "Nhắn tin Messenger",
			className: `flex h-12 w-12 items-center justify-center rounded-full bg-card text-foreground shadow-[var(--shadow-card)] ring-1 ring-border transition hover:scale-105 ${config.floatingContact.animateMessenger !== false ? "contact-breathe" : ""}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-5 w-5" })
		}), links.hasHotline && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: links.hotlineHref,
			"aria-label": "Gọi hotline tư vấn",
			className: `flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-cta)] transition hover:scale-105 ${config.floatingContact.animateHotline !== false ? "contact-breathe" : ""}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-6 w-6" })
		})]
	});
}
/** Bỏ các phần trùng lặp (ví dụ model = hệ điều hành) để không hiển thị "Linux · Linux". */
function dedupeParts(parts) {
	const seen = /* @__PURE__ */ new Set();
	const result = [];
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
function formatDuration(totalSeconds) {
	const safe = Math.max(0, Math.round(totalSeconds));
	return `${Math.floor(safe / 60)}:${(safe % 60).toString().padStart(2, "0")}`;
}
function FooterStats({ title = "Thống kê truy cập thông minh", helperText = "Dữ liệu truy cập được gom từ cùng một kho tracking để đồng bộ giữa Analytics, Mini-CRM và Webhook." }) {
	const snapshot = useVisitorTrackingSnapshot();
	const deviceValue = dedupeParts([
		snapshot.device.manufacturer !== "Unknown" ? snapshot.device.manufacturer : "",
		snapshot.device.model !== "Unknown" ? snapshot.device.model : "",
		snapshot.device.os !== "Unknown" ? snapshot.device.os : "",
		snapshot.device.browser !== "Unknown" ? snapshot.device.browser : ""
	]).join(" · ") || "Thiết bị chưa nhận diện";
	const networkValue = snapshot.network.displayLabel && !snapshot.network.displayLabel.toLowerCase().includes("unknown") ? snapshot.network.displayLabel : snapshot.network.fallbackLabel || "Mạng băng thông rộng · Việt Nam";
	const quickStats = [
		{
			icon: Users,
			label: "Truy cập hôm nay",
			value: snapshot.metrics.sessionCounts.today.toLocaleString("vi-VN"),
			hint: "Lượt trong ngày"
		},
		{
			icon: CalendarDays,
			label: "Truy cập tháng này",
			value: snapshot.metrics.sessionCounts.month.toLocaleString("vi-VN"),
			hint: "Lượt trong tháng"
		},
		{
			icon: Clock,
			label: "Thời gian trên trang",
			value: formatDuration(snapshot.metrics.timeOnPageSeconds),
			hint: "Phút:giây · trực tiếp"
		},
		{
			icon: MousePointerClick,
			label: "Độ sâu cuộn trang",
			value: `${Math.min(100, Math.max(0, snapshot.metrics.scrollDepthPercent))}%`,
			hint: "Mức đã xem · trực tiếp"
		}
	];
	const detailStats = [
		{
			icon: Activity,
			label: "Phiên hiện tại",
			value: `Phiên #${snapshot.metrics.sessionCounts.currentSession}`,
			sub: `Mã khách: ${snapshot.visitorId.slice(-6).toUpperCase()}`
		},
		{
			icon: Cpu,
			label: "Thiết bị nhận diện",
			value: deviceValue,
			sub: snapshot.device.isInAppBrowser ? "Trình duyệt trong ứng dụng" : "Trình duyệt độc lập"
		},
		{
			icon: Wifi,
			label: "Mạng & khu vực",
			value: networkValue,
			sub: snapshot.network.flags.length > 0 ? `Tín hiệu: ${snapshot.network.flags.join(", ")}` : snapshot.network.connectionLabel || "Kết nối ổn định"
		}
	];
	const isLive = snapshot.initialized;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		"aria-label": "Thống kê lưu lượng truy cập",
		className: "overflow-hidden rounded-2xl border border-border bg-card/80 shadow-[var(--shadow-card)] backdrop-blur sm:rounded-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 border-b border-border/60 bg-gradient-to-br from-primary/10 via-card to-card px-4 py-4 sm:px-6 sm:py-5 md:flex-row md:items-center md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-extrabold text-foreground sm:text-base md:text-lg",
						children: title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[11px] leading-relaxed text-muted-foreground sm:text-xs md:text-sm",
						children: helperText
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-primary/10 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-primary ring-1 ring-primary/20 sm:px-3 sm:text-[11px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "relative flex h-2 w-2",
						"aria-hidden": "true",
						children: [isLive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-primary" })]
					}), isLive ? "Trực tiếp" : "Đang khởi tạo"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-px bg-border/60 lg:grid-cols-4",
				children: quickStats.map((stat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-card px-3 py-3 sm:px-4 sm:py-4 md:px-5 md:py-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[11px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(stat.icon, {
								className: "h-3.5 w-3.5 shrink-0",
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: stat.label
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xl font-black tabular-nums text-foreground sm:text-2xl md:text-3xl",
							children: stat.value
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-[10px] text-muted-foreground sm:text-[11px]",
							children: stat.hint
						})
					]
				}, stat.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "grid gap-px border-t border-border/60 bg-border/60 sm:grid-cols-3",
				children: detailStats.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 bg-card px-4 py-3 sm:px-5 sm:py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
							className: "flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[11px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, {
								className: "h-3.5 w-3.5 shrink-0",
								"aria-hidden": "true"
							}), item.label]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1.5 break-words text-xs font-bold leading-snug text-foreground sm:text-sm",
							title: item.value,
							children: item.value
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 break-words text-[10px] leading-relaxed text-muted-foreground sm:text-[11px]",
							children: item.sub
						})
					]
				}, item.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "flex items-start gap-1.5 border-t border-border/60 px-5 py-3 text-[11px] leading-relaxed text-muted-foreground sm:px-6 sm:text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
					className: "mt-0.5 h-3.5 w-3.5 shrink-0",
					"aria-hidden": "true"
				}), snapshot.network.lookupStatus === "resolved" ? `Nhà mạng hiện tại: ${snapshot.network.provider || snapshot.network.connectionLabel}. Khi dịch vụ IP thiếu dữ liệu, hệ thống tự chuyển sang chuỗi mạng thay thế để không hiển thị lỗi.` : "Dịch vụ định vị IP đang dùng cơ chế dự phòng; giao diện vẫn hiển thị chuỗi mạng chuyên nghiệp, không lộ lỗi hệ thống."]
			})
		]
	});
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var Sheet = Dialog;
var SheetTrigger = DialogTrigger;
var SheetClose = DialogClose;
var SheetPortal = DialogPortal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = DialogContent.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = DialogTitle.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription.displayName;
/**
* Hamburger trigger + animated vertical sidebar.
* Renders nothing when there are no menu pages, so the icon disappears
* on every device when there is no menu to show.
*/
function SiteMenu({ pages, brandName, logoUrl, showLogo = true, ctaLabel, ctaHref = "#dang-ky", activePageId }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	if (pages.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "hidden items-center gap-1 rounded-full border border-border/70 bg-muted/60 p-1 xl:flex",
		children: pages.map((page) => {
			const isActive = activePageId ? page.id === activePageId : page.path === "";
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: page.path ? "/$" : "/",
				params: page.path ? { _splat: page.path } : void 0,
				hash: page.path ? void 0 : "top",
				className: `rounded-full px-3 py-1.5 text-sm font-semibold transition ${isActive ? "bg-primary text-primary-foreground shadow-[var(--shadow-cta)]" : "text-muted-foreground hover:bg-background hover:text-foreground"}`,
				children: page.title
			}, page.id);
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetTrigger, {
			"aria-label": "Mở menu điều hướng",
			className: "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border/70 bg-background/80 px-3 text-foreground shadow-sm transition hover:border-primary/40 hover:bg-primary/10 hover:text-primary active:scale-95 xl:hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
				className: "h-4 w-4 sm:h-5 sm:w-5",
				"aria-hidden": "true"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "hidden text-sm font-semibold sm:inline",
				children: "Menu"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
			side: "left",
			className: "flex w-[19rem] max-w-[85vw] flex-col gap-0 border-r border-border bg-background p-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5 border-b border-border/60 bg-muted/40 px-5 py-4",
					children: [showLogo && (logoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: logoUrl || "/placeholder.svg",
						alt: "",
						className: "h-9 w-9 shrink-0 rounded-lg object-contain ring-1 ring-primary/20"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[var(--shadow-cta)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, {
							className: "h-5 w-5",
							"aria-hidden": "true"
						})
					})), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
						className: "min-w-0 truncate text-sm font-extrabold leading-tight",
						children: brandName
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex flex-1 flex-col gap-1.5 overflow-y-auto px-3 py-4",
					"aria-label": "Menu chính",
					children: pages.map((page, index) => {
						const isActive = activePageId ? page.id === activePageId : page.path === "";
						const className = `group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-colors ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"} motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-left-4`;
						const style = { animationDelay: `${index * 60 + 80}ms` };
						const dot = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `h-2 w-2 shrink-0 rounded-full transition ${isActive ? "bg-primary" : "bg-border group-hover:bg-primary/60"}`,
							"aria-hidden": "true"
						});
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetClose, {
							asChild: true,
							children: page.path ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/$",
								params: { _splat: page.path },
								className,
								style,
								children: [dot, page.title]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/",
								hash: "top",
								className,
								style,
								children: [dot, page.title]
							})
						}, page.id);
					})
				}),
				ctaLabel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-t border-border/60 p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetClose, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: ctaHref,
							className: "flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-[var(--shadow-cta)] transition hover:brightness-110",
							children: ctaLabel
						})
					})
				}) : null
			]
		})]
	})] });
}
var gallery_visa_default = "/assets/gallery-visa-C2KfDTnt.webp";
var gallery_campus_default = "/assets/gallery-campus-Ccbnr8PW.webp";
var gallery_dorm_room_default = "/assets/gallery-dorm-room-CN0jv29K.webp";
var gallery_airport_default = "/assets/gallery-airport-BNYTV757.webp";
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
/**
* Thông tin liên hệ dùng chung cho chân trang và các nút liên hệ nổi.
* Để chuỗi rỗng ("") thì dòng tương ứng sẽ tự ẩn cho tới khi có thông tin thật.
*/
var FOOTER = {
	hotline: "",
	email: "",
	/** Số Zalo nhận tin nhắn tư vấn nhanh (để trống thì dùng hotline) */
	zalo: "",
	/** Đơn vị bảo trợ chuyên môn & tuyển sinh hiển thị ở chân trang */
	sponsor: "Trung tâm Hướng nghiệp & Phát triển Sự nghiệp Quốc tế",
	address: "",
	licenseNumber: ""
};
var MAJOR_FUTURES = [
	"Đón đầu xu hướng điện hóa giao thông, pin thế hệ mới và hệ sinh thái xe thông minh.",
	"Phát triển cùng nhu cầu UAV trong nông nghiệp, vận chuyển, khảo sát và cứu hộ.",
	"Mở rộng theo thương mại xuyên biên giới, bán hàng đa kênh và vận hành bằng dữ liệu.",
	"Giữ vai trò cốt lõi khi chuỗi cung ứng khu vực ngày càng tự động hóa và kết nối sâu.",
	"Là nền tảng cho thiết bị thông minh, năng lượng sạch, robot và sản xuất công nghệ cao.",
	"Kết nối nhà máy, đô thị và thiết bị thông minh trong nền kinh tế số tương lai.",
	"Thúc đẩy nhà máy thông minh, robot cộng tác và dây chuyền sản xuất ít phụ thuộc lao động tay chân.",
	"Tạo lợi thế trong thương mại, dịch vụ và hợp tác doanh nghiệp Việt Nam – Trung Quốc."
];
var GALLERY = [
	{
		img: gallery_visa_default,
		caption: "Visa du học sinh đã được cấp cho học viên khóa gần nhất"
	},
	{
		img: gallery_campus_default,
		caption: "Khuôn viên trường Cao đẳng nghề đối tác tại Trung Quốc"
	},
	{
		img: gallery_dorm_room_default,
		caption: "Phòng ký túc xá trong trường — miễn 100% phí ở"
	},
	{
		img: gallery_airport_default,
		caption: "Học viên lên đ��ờng nhập học kỳ tháng 9"
	}
];
var EXPERTS = [
	{
		img: expert_1_default,
		name: "Ths. Nguyễn Thu Hương",
		role: "Chuyên gia định hướng ngành học",
		bio: "Tập trung đánh giá năng lực, sở thích và mục tiêu dài hạn để giúp học viên chọn ngành phù hợp.",
		experience: "Kinh nghiệm tư vấn lộ trình học nghề quốc tế và định hướng nghề nghiệp sau tốt nghiệp."
	},
	{
		img: expert_2_default,
		name: "Ông Lê Quang Vinh",
		role: "Chuyên gia hồ sơ & tuyển sinh",
		bio: "Đồng hành cùng học viên từ bước rà soát điều kiện đến hoàn thiện hồ sơ nhập học và visa.",
		experience: "Kinh nghiệm xử lý hồ sơ tuyển sinh, thủ tục du học và chuẩn bị trước khi xuất cảnh."
	},
	{
		img: expert_3_default,
		name: "Cô Phạm Minh Anh",
		role: "Chuyên gia đồng hành học viên",
		bio: "Hỗ trợ học viên chuẩn bị ngôn ngữ, kỹ năng thích nghi và kế hoạch học tập tại Trung Quốc.",
		experience: "Kinh nghiệm đào tạo kỹ năng tiền du học và hỗ trợ học viên trong quá trình hòa nhập."
	}
];
function Landing() {
	const { config } = useSiteConfig();
	const content = config.landing;
	const variant = getVariant(config.abTest.enabled, config.abTest.split);
	const experimentHeadline = variant === "B" ? config.abTest.variantBHeadline : config.abTest.variantAHeadline;
	const experimentCta = variant === "B" ? config.abTest.variantBCta : config.abTest.variantACta;
	const section = (id) => content.sectionsArray.find((item) => item.id === id);
	const sectionStyle = (id) => ({
		order: content.sectionsArray.findIndex((item) => item.id === id) + 1,
		display: section(id)?.enabled === false ? "none" : void 0
	});
	const gallerySlides = GALLERY.map((slide, index) => ({
		...slide,
		img: content.galleryImageUrls[index] || slide.img,
		caption: content.galleryCaptions[index] || slide.caption
	}));
	const faqs = content.faqs.map((faq) => ({
		slug: faq.slug,
		q: faq.question,
		a: faq.answer
	}));
	const customSections = content.sectionsArray.filter((item) => item.type === "custom" && item.enabled);
	const links = contactLinks(config);
	const menuPages = config.pages.filter((page) => page.enabled && page.showInMenu).sort((a, b) => a.menuOrder - b.menuOrder);
	const secondaryPageSectionIds = new Set(config.pages.filter((page) => page.id !== "home").flatMap((page) => page.sectionIds || []));
	const homeCustomSections = customSections.filter((section) => !secondaryPageSectionIds.has(section.id));
	const heroSlides = (0, import_react.useMemo)(() => {
		const configured = content.heroMediaMode === "slider" ? content.heroSliderImages.filter(Boolean) : [content.heroImageUrl].filter(Boolean);
		return configured.length > 0 ? configured : [content.heroImageUrl || "/assets/hero-student-RoGGUFG7.webp"];
	}, [
		content.heroImageUrl,
		content.heroMediaMode,
		content.heroSliderImages
	]);
	const [heroSlideIndex, setHeroSlideIndex] = (0, import_react.useState)(0);
	const [mobileMenuOpen, setMobileMenuOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => initBehavior({
		storageMode: config.admin.storageMode,
		supabaseUrl: config.admin.supabaseUrl,
		supabaseAnonKey: config.admin.supabaseAnonKey
	}), [
		config.admin.storageMode,
		config.admin.supabaseAnonKey,
		config.admin.supabaseUrl
	]);
	(0, import_react.useEffect)(() => {
		setHeroSlideIndex(0);
	}, [content.heroMediaMode, heroSlides.length]);
	(0, import_react.useEffect)(() => {
		if (content.heroMediaMode !== "slider" || heroSlides.length <= 1) return;
		const timer = window.setInterval(() => setHeroSlideIndex((current) => (current + 1) % heroSlides.length), Math.max(2500, content.heroSliderIntervalMs || 4500));
		return () => window.clearInterval(timer);
	}, [
		content.heroMediaMode,
		content.heroSliderIntervalMs,
		heroSlides.length
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		id: "top",
		className: "flex min-h-screen flex-col bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
				position: "top-center",
				richColors: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				style: { order: 0 },
				className: "sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl items-center gap-3 px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteMenu, {
							pages: menuPages.map((page) => ({
								id: page.id,
								title: page.title,
								path: page.path
							})),
							brandName: content.brandName,
							logoUrl: content.logoUrl,
							showLogo: content.showLogo,
							ctaLabel: content.heroCtaLabel,
							ctaHref: "#dang-ky",
							activePageId: "home"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "#top",
							className: "flex min-w-0 flex-1 items-center gap-2.5",
							"aria-label": content.brandName,
							children: [content.showLogo && (content.logoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: content.logoUrl,
								alt: "Logo",
								className: "h-9 w-9 shrink-0 rounded-lg object-contain ring-1 ring-primary/20 sm:h-11 sm:w-11 sm:rounded-xl"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[var(--shadow-cta)] sm:h-11 sm:w-11 sm:rounded-xl",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, {
									className: "h-5 w-5 sm:h-6 sm:w-6",
									"aria-hidden": "true"
								})
							})), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "min-w-0 max-w-[15rem] truncate text-xs font-extrabold leading-tight sm:max-w-[22rem] sm:text-sm",
								children: content.brandName
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#dang-ky",
							className: "hidden shrink-0 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-cta)] transition hover:-translate-y-0.5 hover:brightness-110 sm:inline-block",
							children: content.heroCtaLabel
						})
					]
				}), mobileMenuOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "border-t border-border/60 bg-background px-4 py-2 lg:hidden",
					"aria-label": "Menu chính (di động)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "flex flex-col",
						children: [menuPages.map((page) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: page.path ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/$",
							params: { _splat: page.path },
							onClick: () => setMobileMenuOpen(false),
							className: "block py-2.5 text-sm font-semibold text-muted-foreground transition hover:text-foreground",
							children: page.title
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							hash: "top",
							onClick: () => setMobileMenuOpen(false),
							className: "block py-2.5 text-sm font-semibold text-muted-foreground transition hover:text-foreground",
							children: page.title
						}) }, page.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#dang-ky",
							onClick: () => setMobileMenuOpen(false),
							className: "mt-2 block rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-bold text-primary-foreground sm:hidden",
							children: content.heroCtaLabel
						}) })]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				style: sectionStyle("hero"),
				className: "surface-panel relative overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0",
						children: heroSlides.map((slide, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: slide || "/assets/hero-student-RoGGUFG7.webp",
							alt: "Học viên Việt Nam thực hành lắp ráp ô tô điện tại trung tâm đào tạo nghề Trung Quốc",
							width: 1600,
							height: 1104,
							fetchPriority: index === 0 ? "high" : void 0,
							decoding: "async",
							className: `absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${content.heroMediaMode === "slider" ? index === heroSlideIndex ? "opacity-30" : "opacity-0" : "opacity-25"}`
						}, `${slide}-${index}`))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-surface/68" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mx-auto grid max-w-6xl gap-8 px-4 pb-14 pt-7 sm:gap-12 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-surface-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "inline-flex items-center gap-2 rounded-full bg-gold px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-gold-foreground",
									children: content.heroEyebrow
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
									className: "mt-6 text-3xl font-black leading-[1.12] sm:text-4xl lg:text-[3.25rem]",
									children: [
										experimentHeadline || content.heroTitle,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-hero-gradient",
											children: content.heroHighlight
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-5 max-w-xl text-base leading-relaxed text-surface-foreground/85 sm:text-lg",
									children: content.heroDescription
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-8 flex flex-col gap-3 sm:flex-row sm:items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "#dang-ky",
										className: "cta-pulse rounded-xl bg-primary px-7 py-4 text-center text-base font-extrabold uppercase tracking-wide text-primary-foreground sm:text-lg",
										children: experimentCta || content.heroCtaLabel
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-center text-sm text-surface-foreground/70 sm:text-left",
										children: [
											"Chỉ còn",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-gold",
												children: config.countdown.slotsLeft
											}),
											" ",
											config.countdown.headline
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-9 grid gap-2.5 text-sm text-surface-foreground/80 sm:grid-cols-2",
									children: content.heroTrustItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["✓ ", item] }, item))
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 lg:pl-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScarcityBar, { tone: "dark" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeadForm, {})]
						})]
					})
				]
			}),
			config.trafficStats.enabled && config.trafficStats.position === "afterHero" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-b border-border bg-background py-8 sm:py-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-6xl px-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterStats, {
						title: config.trafficStats.title,
						helperText: config.trafficStats.helperText
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				style: sectionStyle("stats"),
				className: "border-b border-border bg-muted/50 py-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 lg:grid-cols-4",
					children: content.stats.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						delay: i * 80,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "glass-card h-full rounded-2xl p-5 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xl font-black text-primary sm:text-3xl",
								children: s.value
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs font-semibold leading-snug text-muted-foreground sm:text-sm",
								children: s.label
							})]
						})
					}, s.label))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				style: sectionStyle("pains"),
				className: "mx-auto max-w-6xl px-4 py-16 sm:py-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "max-w-2xl text-2xl font-extrabold sm:text-3xl lg:text-4xl",
					children: content.painHeading
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 grid gap-5 sm:grid-cols-3",
					children: content.pains.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						delay: i * 100,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "h-full rounded-2xl border border-border bg-card p-6 text-sm leading-relaxed transition hover:-translate-y-1 hover:shadow-[var(--shadow-card)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-lg font-black text-primary",
								children: "!"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-card-foreground/85",
								children: p
							})]
						})
					}, p))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				style: sectionStyle("benefits"),
				"data-section": "luong_thuc_tap",
				className: "bg-muted/60 py-16 sm:py-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-6xl px-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-extrabold sm:text-3xl lg:text-4xl",
						children: content.benefitsHeading
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4",
						children: content.benefits.map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							delay: i * 90,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "glass-card h-full rounded-2xl p-6 transition hover:-translate-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-3xl font-black text-primary",
										children: b.stat
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-3 text-lg font-bold",
										children: b.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm leading-relaxed text-muted-foreground",
										children: b.text
									})
								]
							})
						}, b.title))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				style: sectionStyle("majors"),
				"data-section": "nganh_hoc",
				className: "mx-auto max-w-6xl px-4 py-16 sm:py-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-extrabold sm:text-3xl lg:text-4xl",
						children: content.majorsHeading
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-2xl text-muted-foreground",
						children: content.majorsDescription
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-9 grid grid-cols-2 gap-4 lg:grid-cols-4",
						children: content.majorNames.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							delay: i % 4 * 80,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "h-full rounded-2xl border border-border bg-card p-5 transition duration-300 hover:-translate-y-1.5 hover:border-primary hover:shadow-[var(--shadow-card)]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-2xl",
										children: content.majorIcons[i] || "•"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-3 text-base font-bold leading-snug",
										children: m
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm leading-relaxed text-muted-foreground",
										children: content.majorDescriptions[i] || MAJOR_FUTURES[i]
									})
								]
							})
						}, m))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				style: sectionStyle("experts"),
				className: "bg-muted/50 py-16 sm:py-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-6xl px-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl font-extrabold sm:text-3xl lg:text-4xl",
							children: content.expertsHeading
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-2xl text-muted-foreground",
							children: content.expertsDescription
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-9 grid gap-5 sm:grid-cols-3",
							children: content.experts.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
								delay: i * 90,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
									className: "glass-card flex h-full flex-col rounded-2xl p-6",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: content.expertImageUrls[i] || EXPERTS[i].img,
											alt: `${e.name} — ${e.role}`,
											width: 640,
											height: 640,
											loading: "lazy",
											decoding: "async",
											className: "h-20 w-20 shrink-0 rounded-full object-cover ring-2 ring-border"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "mt-4 text-base font-bold leading-snug",
											children: e.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs font-semibold text-primary",
											children: e.role
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-4 text-sm leading-relaxed text-card-foreground/85",
											children: e.bio
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-3 border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground",
											children: e.experience
										})
									]
								})
							}, e.name))
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				style: sectionStyle("gallery"),
				className: "mx-auto max-w-3xl px-4 py-16 sm:py-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-extrabold sm:text-3xl lg:text-4xl",
						children: content.galleryHeading
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-muted-foreground",
						children: content.galleryDescription
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoCarousel, { slides: gallerySlides })
					}) })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				style: sectionStyle("testimonials"),
				className: "mx-auto max-w-6xl px-4 py-16 sm:py-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-extrabold sm:text-3xl lg:text-4xl",
					children: content.testimonialsHeading
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-9 grid gap-5 lg:grid-cols-3",
					children: content.testimonials.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						delay: i * 100,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
							className: "flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] transition hover:-translate-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-gold",
									"aria-hidden": "true",
									children: "★★★★★"
								}),
								t.avatarUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: t.avatarUrl,
									alt: `Ảnh đại diện ${t.name}`,
									width: 48,
									height: 48,
									loading: "lazy",
									className: "mt-3 h-12 w-12 rounded-full object-cover ring-2 ring-border"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-3 flex-1 text-sm leading-relaxed text-card-foreground/90",
									children: [
										"“",
										t.text,
										"”"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
									className: "mt-4 border-t border-border pt-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-bold",
										children: t.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: t.meta
									})]
								})
							]
						})
					}, t.name))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				style: sectionStyle("steps"),
				className: "surface-panel py-16 text-surface-foreground sm:py-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-6xl px-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-extrabold sm:text-3xl lg:text-4xl",
						children: content.stepsHeading
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4",
						children: content.steps.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							delay: i * 90,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "glass-card-dark h-full rounded-2xl p-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-2xl font-black text-gold",
										children: s.number
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-2 text-base font-bold",
										children: s.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1.5 text-sm text-surface-foreground/75",
										children: s.description
									})
								]
							})
						}, s.number))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				style: sectionStyle("faq"),
				className: "mx-auto max-w-3xl px-4 py-16 sm:py-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-center text-2xl font-extrabold sm:text-3xl lg:text-4xl",
					children: content.faqHeading
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 space-y-3",
					children: faqs.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
						onToggle: (e) => {
							if (e.currentTarget.open) markFaqClick(f.slug);
						},
						className: "group rounded-2xl border border-border bg-card p-5 transition hover:border-primary/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
							className: "cursor-pointer list-none text-base font-bold leading-snug marker:hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mr-2 text-primary",
								children: "?"
							}), f.q]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm leading-relaxed text-muted-foreground",
							children: f.a
						})]
					}, f.q))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				style: sectionStyle("finalCta"),
				className: "bg-muted/60 py-16 sm:py-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-3xl px-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-center text-2xl font-extrabold sm:text-3xl lg:text-4xl",
							children: content.finalCtaHeading
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-center text-muted-foreground",
							children: content.finalCtaDescription
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScarcityBar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeadForm, { id: "dang-ky-cuoi" })]
						})
					]
				})
			}),
			homeCustomSections.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: { order: item.order + 1 },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContentSection, { section: item })
			}, item.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				style: { order: 99 },
				className: "border-t border-border bg-background py-12",
				children: [config.trafficStats.enabled && config.trafficStats.position === "footer" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mb-10 max-w-6xl px-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterStats, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-6xl px-4 text-sm text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [(config.footer.logoUrl || content.logoUrl) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: config.footer.logoUrl || content.logoUrl,
									alt: `Logo ${content.brandName}`,
									width: 180,
									height: 52,
									loading: "lazy",
									className: "mb-3 h-10 max-w-[180px] object-contain object-left"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-bold text-foreground",
									children: content.brandName
								})]
							}), config.footer.menuLinks.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
								"aria-label": config.footer.menuLabel,
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-2 text-xs font-bold uppercase tracking-wide text-foreground",
									children: config.footer.menuLabel
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-x-4 gap-y-2",
									children: config.footer.menuLinks.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: link.href,
										className: "font-semibold underline-offset-4 transition hover:text-primary hover:underline",
										children: link.label
									}, `${link.label}-${link.href}`))
								})]
							})]
						}),
						(links.hasHotline || FOOTER.email) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2",
							children: [
								links.hasHotline && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									"Hotline tư vấn:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										className: "font-semibold text-foreground",
										href: links.hotlineHref,
										children: config.floatingContact.hotline
									})
								] }),
								links.hasHotline && FOOTER.email && " · ",
								FOOTER.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									"Email:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										className: "font-semibold text-foreground",
										href: `mailto:${FOOTER.email}`,
										children: FOOTER.email
									})
								] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 text-xs leading-relaxed",
							children: [
								"Đơn vị bảo trợ chuyên môn & tuyển sinh: ",
								FOOTER.sponsor,
								FOOTER.address ? ` — ${FOOTER.address}` : "",
								FOOTER.licenseNumber ? ` · Giấy phép hoạt động số ${FOOTER.licenseNumber}` : "",
								". Chương trình liên kết đào tạo với các trường Cao đẳng nghề và doanh nghiệp tại Trung Quốc."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 text-xs",
							children: [
								"© ",
								(/* @__PURE__ */ new Date()).getFullYear(),
								" Bản quyền thuộc Trung tâm."
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecentLeadPopup, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloatingContact, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StickyMobileCTA, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-20 sm:hidden",
				style: { order: 100 }
			})
		]
	});
}
//#endregion
export { Landing as component };
