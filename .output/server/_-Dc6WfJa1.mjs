import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { h as useSiteConfig } from "./_ssr/use-site-config-DjShPvKg.mjs";
import { t as AdminLoginPage } from "./_ssr/AdminLoginPage-BIGPYb0o.mjs";
import { t as ContentSection } from "./_ssr/ContentSection-BWsPqEdY.mjs";
import { _ as useParams, g as Link } from "./_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_-Dc6WfJa1.js
var import_jsx_runtime = require_jsx_runtime();
function CatchAll() {
	const params = useParams({ from: "/$" });
	const { config } = useSiteConfig();
	const slug = (params._splat ?? "").replace(/^\/+|\/+$/g, "");
	const adminPath = config.admin.adminPath.trim().replace(/^\/+|\/+$/g, "");
	if (adminPath && slug === adminPath) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoginPage, {});
	const page = config.pages.find((item) => item.enabled && item.path === slug);
	if (page) {
		const menuPages = config.pages.filter((item) => item.enabled && item.showInMenu).sort((a, b) => a.menuOrder - b.menuOrder);
		const pageSections = (page.sectionIds || []).map((sectionId) => config.landing.sectionsArray.find((section) => section.id === sectionId)).filter((section) => Boolean(section && section.enabled));
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "min-h-screen bg-background",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
					className: "sticky top-0 z-40 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "mx-auto flex max-w-6xl items-center justify-end gap-3 overflow-x-auto",
						"aria-label": "Menu chính",
						children: menuPages.map((menuPage) => {
							const cls = `shrink-0 text-xs font-semibold transition hover:text-primary ${menuPage.id === page.id ? "text-primary" : "text-muted-foreground"}`;
							return menuPage.path ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/$",
								params: { _splat: menuPage.path },
								className: cls,
								children: menuPage.title
							}, menuPage.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								className: cls,
								children: menuPage.title
							}, menuPage.id);
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto w-full max-w-3xl px-4 pt-16 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-bold uppercase tracking-widest text-primary",
							children: page.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-3 text-3xl font-black text-foreground",
							children: page.heading || page.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 leading-relaxed text-muted-foreground",
							children: page.description
						}),
						page.ctaLabel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: page.ctaHref || "/",
							className: "mt-6 inline-flex rounded-lg bg-primary px-5 py-3 font-bold text-primary-foreground",
							children: page.ctaLabel
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8",
					children: pageSections.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContentSection, { section }, section.id))
				})
			]
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Không tìm thấy trang"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
						children: "Về trang chủ"
					})
				})
			]
		})
	});
}
//#endregion
export { CatchAll as component };
