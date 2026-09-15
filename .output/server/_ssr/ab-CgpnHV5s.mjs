import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-CIHAFgYl.mjs";
import { n as objectType, r as stringType, t as enumType } from "../_libs/zod.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-Cj8cTMMZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ab-CgpnHV5s.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
/**
* AUTOMATED EMAIL SEQUENCER (auto-responder).
* Gửi email cảm ơn ngay sau khi khách đăng ký. Chạy phía server để
* API key không lộ ra trình duyệt: thêm secret RESEND_API_KEY.
*/
var schema = objectType({
	provider: enumType(["resend", "gmail"]).default("resend"),
	to: stringType().email(),
	from: stringType().email(),
	subject: stringType().min(1),
	text: stringType().min(1)
});
var checkEmailConfig = createServerFn({ method: "GET" }).handler(createSsrRpc("5dd11d22fa873a9491cd5c93fc3d45224e628a4cc8d4b35c4fa8cccd1e4b748c"));
var sendLeadEmail = createServerFn({ method: "POST" }).validator((data) => schema.parse(data)).handler(createSsrRpc("cb38c81a85e3a70622346fb76fc7e69378a0178a9259e78f65da0c163f1f406e"));
var sendTestEmail = createServerFn({ method: "POST" }).validator((data) => schema.parse(data)).handler(createSsrRpc("d732dbd0324b5de3cd27374b91a2d4196cd6a42ec4166af82f02cfbf6319a58a"));
function pushDataLayer(event) {
	if (typeof window === "undefined") return;
	window.dataLayer = window.dataLayer || [];
	window.dataLayer.push(event);
}
/** Khách bắt đầu tương tác với ô input đầu tiên */
function trackFormStart(enabled = true) {
	if (!enabled) return;
	pushDataLayer({ event: "form_start" });
}
function trackInteraction(eventName, payload = {}) {
	if (typeof window === "undefined") return;
	pushDataLayer({
		event: eventName,
		...payload
	});
	try {
		window.fbq?.("trackCustom", eventName, payload);
	} catch (e) {
		console.warn(`fbq ${eventName} failed`, e);
	}
	try {
		window.ttq?.track("ClickButton", {
			event_name: eventName,
			...payload
		});
	} catch (e) {
		console.warn(`ttq ${eventName} failed`, e);
	}
	try {
		window.gtag?.("event", eventName, payload);
	} catch (e) {
		console.warn(`gtag ${eventName} failed`, e);
	}
}
/**
* Chỉ gọi SAU khi dữ liệu đã gửi thành công.
* `adsId` lấy trực tiếp từ config.tracking.ga4Id (một nguồn ID duy nhất);
* chỉ bắn conversion Google Ads khi ID có dạng AW-xxx.
*/
function trackLead(payload, events, adsId) {
	if (typeof window === "undefined") return;
	if (events?.lead === false) return;
	pushDataLayer({
		event: "lead_conversion",
		nganh_hoc: payload?.["content_name"] ?? ""
	});
	try {
		window.fbq?.("track", "Lead", payload);
	} catch (e) {
		console.warn("fbq lead failed", e);
	}
	try {
		if (events?.completeRegistration !== false) window.ttq?.track("CompleteRegistration", payload);
		window.ttq?.track("SubmitForm", payload);
	} catch (e) {
		console.warn("ttq event failed", e);
	}
	const sendTo = adsId?.trim();
	if (sendTo?.startsWith("AW-")) try {
		window.gtag?.("event", "conversion", { send_to: sendTo });
	} catch (e) {
		console.warn("gtag conversion failed", e);
	}
}
/**
* Bắn một sự kiện thử tới tất cả kênh tracking đang hoạt động
* và trả về nhật ký trạng thái để hiển thị trong Admin.
*/
function fireTestEvent() {
	const logs = [];
	if (typeof window === "undefined") return logs;
	const payload = {
		test: true,
		content_name: "admin_test_event",
		value: 0,
		currency: "VND"
	};
	if (typeof window.fbq === "function") try {
		window.fbq("trackCustom", "LovableTestEvent", payload);
		logs.push({
			channel: "Meta Pixel",
			ok: true,
			detail: "Đã gửi LovableTestEvent"
		});
	} catch (e) {
		logs.push({
			channel: "Meta Pixel",
			ok: false,
			detail: String(e)
		});
	}
	else logs.push({
		channel: "Meta Pixel",
		ok: false,
		detail: "Chưa nạp (thiếu Pixel ID?)"
	});
	if (window.ttq && typeof window.ttq.track === "function") try {
		window.ttq.track("ClickButton", payload);
		logs.push({
			channel: "TikTok Pixel",
			ok: true,
			detail: "Đã gửi ClickButton"
		});
	} catch (e) {
		logs.push({
			channel: "TikTok Pixel",
			ok: false,
			detail: String(e)
		});
	}
	else logs.push({
		channel: "TikTok Pixel",
		ok: false,
		detail: "Chưa nạp (thiếu Pixel ID?)"
	});
	if (typeof window.gtag === "function") try {
		window.gtag("event", "lovable_test_event", payload);
		logs.push({
			channel: "Google Analytics 4",
			ok: true,
			detail: "Đã gửi lovable_test_event"
		});
	} catch (e) {
		logs.push({
			channel: "Google Analytics 4",
			ok: false,
			detail: String(e)
		});
	}
	else logs.push({
		channel: "Google Analytics 4",
		ok: false,
		detail: "Chưa nạp (thiếu GA4 ID?)"
	});
	if (Array.isArray(window.dataLayer)) {
		pushDataLayer({
			event: "lovable_test_event",
			...payload
		});
		logs.push({
			channel: "GTM dataLayer",
			ok: true,
			detail: `${window.dataLayer.length} sự kiện trong hàng đợi`
		});
	} else logs.push({
		channel: "GTM dataLayer",
		ok: false,
		detail: "Chưa có dataLayer"
	});
	const scripts = [
		"fb-pixel",
		"tiktok-pixel",
		"ga4-init",
		"gtm-init",
		"custom-head",
		"custom-body",
		"custom-footer"
	].filter((id) => document.getElementById(id));
	logs.push({
		channel: "Mã đã chèn vào trang",
		ok: scripts.length > 0,
		detail: scripts.length ? scripts.join(", ") : "Chưa có mã nào được chèn"
	});
	return logs;
}
var TIMEOUT_MS = 8e3;
var RETRIES = 2;
function validUrl(value) {
	try {
		const url = new URL(value);
		return url.protocol === "https:" || url.hostname === "localhost";
	} catch {
		return false;
	}
}
function webhookConfigurationWarning(endpoint, config) {
	const value = endpoint.url.trim();
	if (!value) return "Chưa nhập URL endpoint";
	if (!validUrl(value)) return "URL phải dùng HTTPS (localhost có thể dùng HTTP)";
	if (endpoint.type === "telegram" && !value.includes("/bot")) return "URL Telegram cần có dạng /bot<TOKEN>/sendMessage?chat_id=...";
	if (endpoint.type === "telegram" && !new URL(value).searchParams.get("chat_id")) return "URL Telegram đang thiếu chat_id";
	if (endpoint.type === "supabase" && (!config.admin.supabaseUrl || !config.admin.supabaseAnonKey)) return "Cần cấu hình Supabase URL và anon key trong Storage trước";
}
async function requestWithRetry(endpoint, init) {
	let detail = "Không thể kết nối";
	for (let attempt = 1; attempt <= 3; attempt += 1) {
		const controller = new AbortController();
		const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
		try {
			const response = await fetch(endpoint, {
				...init,
				signal: controller.signal
			});
			window.clearTimeout(timer);
			if (response.ok || response.status < 500) {
				if (!response.ok) detail = (await response.text().catch(() => "")).trim().slice(0, 180) || `HTTP ${response.status}`;
				return {
					response,
					attempts: attempt,
					detail
				};
			}
			detail = `HTTP ${response.status}`;
		} catch (error) {
			window.clearTimeout(timer);
			detail = error instanceof DOMException && error.name === "AbortError" ? "Timeout" : error.message;
		}
		if (attempt <= RETRIES) await new Promise((resolve) => window.setTimeout(resolve, attempt * 300));
	}
	return {
		attempts: 3,
		detail
	};
}
function telegramBody(url, payload) {
	const escapeHtml = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
	const text = Object.entries(payload).map(([k, v]) => `${escapeHtml(k)}: ${escapeHtml(String(v ?? ""))}`).join("\n");
	const u = new URL(url);
	const chatId = u.searchParams.get("chat_id") || "";
	u.searchParams.delete("chat_id");
	return {
		endpoint: u.toString(),
		body: {
			chat_id: chatId,
			text,
			parse_mode: "HTML"
		}
	};
}
async function postOne(ep, payload, supabase) {
	try {
		let endpoint = ep.url;
		let body = payload;
		let headers = { "Content-Type": "application/json" };
		if (ep.type === "telegram") {
			const t = telegramBody(ep.url, payload);
			endpoint = t.endpoint;
			body = t.body;
		} else if (ep.type === "supabase" && supabase.url && supabase.key) {
			endpoint = `${supabase.url.replace(/\/$/, "")}/rest/v1/${ep.url.replace(/^\//, "") || "leads"}`;
			headers = {
				...headers,
				apikey: supabase.key,
				Authorization: `Bearer ${supabase.key}`,
				Prefer: "return=minimal"
			};
			body = [payload];
		}
		if (!validUrl(endpoint)) return {
			label: ep.label || ep.type,
			ok: false,
			attempts: 0,
			detail: "URL không hợp lệ hoặc không dùng HTTPS"
		};
		const result = await requestWithRetry(endpoint, {
			method: "POST",
			headers,
			body: JSON.stringify(body)
		});
		if (!result.response?.ok) return {
			label: ep.label || ep.type,
			ok: false,
			attempts: result.attempts,
			detail: result.detail || `HTTP ${result.response?.status}`
		};
		return {
			label: ep.label || ep.type,
			ok: true,
			attempts: result.attempts
		};
	} catch (err) {
		return {
			label: ep.label || ep.type,
			ok: false,
			attempts: 0,
			detail: err.message
		};
	}
}
async function testWebhookEndpoint(endpoint, config) {
	return postOne(endpoint, {
		test: true,
		event: "webhook_test",
		sent_at: (/* @__PURE__ */ new Date()).toISOString()
	}, {
		url: config.admin.supabaseUrl,
		key: config.admin.supabaseAnonKey
	});
}
/**
* Gửi lead đi mọi kênh. Khi đã cấu hình nhiều kênh, chỉ coi là thành công
* khi tất cả kênh đều nhận được dữ liệu; không cấu hình kênh nào vẫn hợp lệ.
*/
async function dispatchLead(config, payload) {
	const endpoints = [];
	const primary = config.form.webhookUrl?.trim();
	if (primary && primary.startsWith("http") && !primary.includes("REPLACE")) endpoints.push({
		id: "primary",
		label: "Webhook chính",
		url: primary,
		enabled: true,
		type: "make"
	});
	endpoints.push(...config.webhooks.filter((w) => w.enabled && w.url.trim()));
	const uniqueEndpoints = endpoints.filter((endpoint, index, all) => all.findIndex((candidate) => candidate.url.trim() === endpoint.url.trim()) === index);
	if (uniqueEndpoints.length === 0) return {
		ok: true,
		results: []
	};
	const results = await Promise.all(uniqueEndpoints.map((ep) => postOne(ep, payload, {
		url: config.admin.supabaseUrl,
		key: config.admin.supabaseAnonKey
	})));
	return {
		ok: results.every((r) => r.ok),
		results
	};
}
/**
* A/B Split Testing — Traffic Splitter.
* Gán biến thể cho khách lần đầu vào trang và ghi nhớ ở localStorage
* để lần sau vẫn thấy đúng biến thể đó.
*/
var KEY_PREFIX = "funnel_ab_variant_v2";
function getVariant(enabled, splitToB) {
	if (typeof window === "undefined" || !enabled) return "A";
	const split = Math.min(100, Math.max(0, Number(splitToB) || 0));
	const key = `${KEY_PREFIX}_${split}`;
	try {
		const saved = window.localStorage.getItem(key);
		if (saved === "A" || saved === "B") return saved;
		const variant = Math.random() * 100 < split ? "B" : "A";
		window.localStorage.setItem(key, variant);
		return variant;
	} catch {
		return "A";
	}
}
function resetVariant(splitToB) {
	if (typeof window === "undefined") return;
	try {
		if (splitToB === void 0) Object.keys(window.localStorage).filter((key) => key.startsWith(`${KEY_PREFIX}_`)).forEach((key) => window.localStorage.removeItem(key));
		else {
			const split = Math.min(100, Math.max(0, Number(splitToB) || 0));
			window.localStorage.removeItem(`${KEY_PREFIX}_${split}`);
		}
	} catch {}
}
function utmSource() {
	if (typeof window === "undefined") return "direct";
	return new URLSearchParams(window.location.search).get("utm_source") || (document.referrer ? "referral" : "direct");
}
//#endregion
export { resetVariant as a, testWebhookEndpoint as c, trackLead as d, utmSource as f, getVariant as i, trackFormStart as l, dispatchLead as n, sendLeadEmail as o, webhookConfigurationWarning as p, fireTestEvent as r, sendTestEmail as s, checkEmailConfig as t, trackInteraction as u };
