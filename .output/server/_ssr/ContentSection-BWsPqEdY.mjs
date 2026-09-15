import { n as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { h as useSiteConfig } from "./use-site-config-DjShPvKg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ContentSection-BWsPqEdY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function endOfMonth() {
	const now = /* @__PURE__ */ new Date();
	return new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0).getTime();
}
function pad(n) {
	return n.toString().padStart(2, "0");
}
/** Đếm ngược + số suất còn lại, lấy trực tiếp từ cấu hình Admin. */
function ScarcityBar({ tone = "light" }) {
	const { config } = useSiteConfig();
	const c = config.countdown;
	const [left, setLeft] = (0, import_react.useState)(null);
	const target = c.endMode === "fixed" && c.endDate ? new Date(c.endDate).getTime() : endOfMonth();
	const validTarget = Number.isFinite(target) ? target : endOfMonth();
	(0, import_react.useEffect)(() => {
		const tick = () => setLeft(Math.max(0, validTarget - Date.now()));
		tick();
		const id = window.setInterval(tick, 1e3);
		return () => window.clearInterval(id);
	}, [validTarget]);
	if (!c.enabled) return null;
	const d = left === null ? 0 : Math.floor(left / 864e5);
	const h = left === null ? 0 : Math.floor(left % 864e5 / 36e5);
	const m = left === null ? 0 : Math.floor(left % 36e5 / 6e4);
	const s = left === null ? 0 : Math.floor(left % 6e4 / 1e3);
	const dark = tone === "dark";
	const box = dark ? "bg-surface-foreground/10 text-surface-foreground ring-surface-foreground/20" : "bg-card text-card-foreground ring-border";
	const accent = dark ? "text-gold" : "text-primary";
	const cell = dark ? "bg-surface-foreground/10" : "bg-primary/10";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `rounded-2xl px-4 py-3 ring-1 ${box}`,
		"aria-live": "polite",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm font-bold",
			children: [
				"Chỉ còn",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: accent,
					children: [c.slotsLeft.toString().padStart(2, "0"), " suất"]
				}),
				" ",
				c.headline
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 flex items-center gap-2",
			children: [
				{
					v: d,
					l: "Ngày"
				},
				{
					v: h,
					l: "Giờ"
				},
				{
					v: m,
					l: "Phút"
				},
				{
					v: s,
					l: "Giây"
				}
			].map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `min-w-[3.25rem] rounded-lg px-2 py-1.5 text-center ${cell}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `block text-lg font-black leading-none tabular-nums ${accent}`,
					children: left === null ? "--" : pad(u.v)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] font-semibold uppercase tracking-wide opacity-70",
					children: u.l
				})]
			}, u.l))
		})]
	});
}
function ContentSection({ section }) {
	const variant = section.content?.variant || section.type;
	const youtubeId = (section.content?.buttonHref || "").match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^?&/]+)/)?.[1];
	const bodyLines = section.content?.body?.split("\n").map((line) => line.trim()).filter(Boolean) || [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		style: {
			backgroundColor: section.content?.backgroundColor || void 0,
			color: section.content?.textColor || void 0
		},
		className: `mx-auto w-full max-w-6xl px-4 py-16 sm:py-20 ${variant === "testimonials" ? "border-l-4 border-gold bg-card" : ""} ${variant === "guarantee" ? "ring-1 ring-primary/20" : ""}`,
		children: [
			variant === "video" && youtubeId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-6 aspect-video overflow-hidden rounded-2xl bg-neutral-900",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
					className: "h-full w-full",
					src: `https://www.youtube.com/embed/${youtubeId}`,
					title: section.content?.heading || section.label,
					loading: "lazy",
					allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
					allowFullScreen: true
				})
			}) : section.content?.imageUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: section.content.imageUrl,
				alt: "",
				className: "mb-6 max-h-[28rem] w-full rounded-2xl object-cover",
				loading: "lazy"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				style: { color: section.content?.accentColor || void 0 },
				className: "text-2xl font-extrabold sm:text-3xl",
				children: section.content?.heading || section.label
			}),
			variant === "faq" && section.content?.body ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
				className: "mt-4 rounded-xl border border-border bg-card p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
					className: "cursor-pointer font-bold",
					children: section.content.heading || section.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground",
					children: section.content.body
				})]
			}) : variant === "pricing" || variant === "grid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 grid gap-2 sm:grid-cols-2",
				children: (bodyLines.length ? bodyLines : [section.content?.body || ""]).map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-xl border border-border bg-card p-3 text-sm leading-relaxed",
					children: ["✓ ", line]
				}, line))
			}) : section.content?.body && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-3xl whitespace-pre-line text-muted-foreground",
				children: section.content.body
			}),
			variant === "countdown" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 max-w-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScarcityBar, {})
			}),
			section.content?.buttonLabel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: section.content.buttonHref || "#dang-ky",
				className: "mt-6 inline-flex rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground",
				children: section.content.buttonLabel
			})
		]
	});
}
//#endregion
export { ScarcityBar as n, ContentSection as t };
