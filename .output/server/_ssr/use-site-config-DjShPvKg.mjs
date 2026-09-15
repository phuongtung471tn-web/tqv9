import { n as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-site-config-DjShPvKg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DEFAULT_CONFIG = {
	admin: {
		adminPath: "admin",
		password: "duhoc2026",
		storageMode: "local",
		supabaseUrl: "",
		supabaseAnonKey: "",
		backupEmail: "",
		cronSchedule: "off"
	},
	pages: [{
		id: "home",
		title: "Trang chủ",
		path: "",
		kind: "landing",
		enabled: true,
		showInMenu: true,
		menuOrder: 0,
		heading: "",
		description: "",
		ctaLabel: "",
		ctaHref: "#dang-ky",
		sectionIds: []
	}, {
		id: "thank-you",
		title: "Cảm ơn",
		path: "cam-on",
		kind: "thankYou",
		enabled: true,
		showInMenu: false,
		menuOrder: 1,
		heading: "Cảm ơn bạn đã đăng ký!",
		description: "Thông tin đã được ghi nhận. Tư vấn viên sẽ liên hệ với bạn trong thời gian sớm nhất.",
		ctaLabel: "Về trang chủ",
		ctaHref: "/",
		sectionIds: []
	}],
	tracking: {
		facebookPixelId: "",
		tiktokPixelId: "DAILRC3C77U3EDHHCGUG",
		tiktokAccessToken: "",
		ga4Id: "",
		gtmId: "",
		googleVerification: "",
		customHead: "",
		customBody: "",
		customFooter: "",
		events: {
			pageView: true,
			formStart: true,
			lead: true,
			completeRegistration: true,
			click: true,
			scroll: true
		}
	},
	seo: {
		title: "Du học nghề Trung Quốc 2026 — Học bổng miễn phí KTX, cam kết Visa",
		description: "Chương trình du học nghề Trung Quốc trọn gói: học bổng miễn 100% KTX, vừa học vừa làm lương 15-25 triệu/tháng, cam kết Visa 100%. Đăng ký tư vấn miễn phí.",
		keywords: "du học nghề trung quốc, học bổng trung quốc, du học vừa học vừa làm",
		ogImage: "/og-image.jpg",
		faviconUrl: "/favicon.ico",
		schemaType: "EducationalOrganization"
	},
	theme: {
		primary: "#c0392b",
		gold: "#d4af37",
		fontHeading: "Be Vietnam Pro",
		fontBody: "Be Vietnam Pro"
	},
	landing: {
		sectionsArray: [
			{
				id: "hero",
				type: "hero",
				label: "Hero",
				enabled: true,
				order: 0
			},
			{
				id: "stats",
				type: "stats",
				label: "Stats",
				enabled: true,
				order: 1
			},
			{
				id: "pains",
				type: "pains",
				label: "Pain points",
				enabled: true,
				order: 2
			},
			{
				id: "benefits",
				type: "benefits",
				label: "Benefits",
				enabled: true,
				order: 3
			},
			{
				id: "majors",
				type: "majors",
				label: "Ngành học",
				enabled: true,
				order: 4
			},
			{
				id: "experts",
				type: "experts",
				label: "Chuyên gia",
				enabled: true,
				order: 5
			},
			{
				id: "gallery",
				type: "gallery",
				label: "Gallery",
				enabled: true,
				order: 6
			},
			{
				id: "testimonials",
				type: "testimonials",
				label: "Testimonials",
				enabled: true,
				order: 7
			},
			{
				id: "steps",
				type: "steps",
				label: "Lộ trình",
				enabled: true,
				order: 8
			},
			{
				id: "faq",
				type: "faq",
				label: "FAQ",
				enabled: true,
				order: 9
			},
			{
				id: "finalCta",
				type: "finalCta",
				label: "CTA cuối",
				enabled: true,
				order: 10
			}
		],
		brandName: "Trung tâm Hướng nghiệp & Phát triển Sự nghiệp Quốc tế",
		showLogo: true,
		logoUrl: "",
		heroEyebrow: "Tuyển sinh kỳ tháng 3 & tháng 9",
		heroTitle: "5 năm nữa bạn vẫn muốn đứng ở vị trí",
		heroHighlight: "công nhân lặp đi lặp lại?",
		heroDescription: "Du học nghề Trung Quốc: học phí 0Đ, vừa học vừa làm lương 15-30 triệu/tháng, ra trường có bằng Cao đẳng chính quy quốc tế và tay nghề công nghệ cao.",
		heroMediaMode: "image",
		heroImageUrl: "",
		heroSliderImages: [],
		heroSliderIntervalMs: 4500,
		galleryImageUrls: [
			"",
			"",
			"",
			""
		],
		expertImageUrls: [
			"",
			"",
			""
		],
		heroTrustItems: [
			"Không chứng minh tài chính",
			"Không cần tiếng Hán trước",
			"Xét hồ sơ tốt nghiệp THPT",
			"Hỗ trợ trọn gói tới khi nhập học"
		],
		heroCtaLabel: "Đăng ký nhận lộ trình 0Đ",
		stats: [
			{
				value: "100%",
				label: "Học viên có việc làm khi thực tập"
			},
			{
				value: "15-30tr",
				label: "Thu nhập mỗi tháng khi vừa học vừa làm"
			},
			{
				value: "8",
				label: "Ngành công nghệ đang khát nhân lực"
			},
			{
				value: "0Đ",
				label: "Học phí trong toàn bộ khóa học"
			}
		],
		painHeading: "Nếu bạn đang gặp một trong ba điều này, bạn cần đọc tiếp",
		pains: [
			"Làm công nhân 10-12 tiếng/ngày, lương không tăng, tay nghề không lên.",
			"Không có bằng cấp quốc tế nên mãi không thoát khỏi vị trí lao động phổ thông.",
			"Muốn đi nước ngoài nhưng sợ chi phí hàng trăm triệu và rủi ro môi giới."
		],
		benefitsHeading: "4 lợi ích vàng của chương trình",
		benefits: [
			{
				stat: "0Đ",
				title: "Học phí bằng 0",
				text: "Doanh nghiệp Trung Quốc tài trợ toàn bộ học phí theo chương trình liên kết đào tạo nhân lực."
			},
			{
				stat: "80%",
				title: "80% thực hành",
				text: "Chỉ 20% lý thuyết. Bạn làm việc trực tiếp trên dây chuyền, máy móc và công nghệ mới nhất."
			},
			{
				stat: "15-30tr",
				title: "Lương cứng mỗi tháng",
				text: "Vừa học vừa làm, thu nhập 15-30 triệu/tháng, đủ chi phí sinh hoạt và gửi về gia đình."
			},
			{
				stat: "Bằng",
				title: "Cao đẳng chính quy quốc tế",
				text: "Bằng Cao đẳng chính quy được công nhận quốc tế, mở đường ở lại làm việc hoặc học tiếp."
			}
		],
		majorsHeading: "8 ngành nghề phát triển trong 5-20 năm tới",
		majorsDescription: "Các lựa chọn bám sát chuyển dịch công nghệ, sản xuất và thương mại giữa Việt Nam – Trung Quốc.",
		majorNames: [
			"Công nghệ Ô tô điện",
			"Công nghệ Drone (UAV)",
			"Thương mại điện tử",
			"Logistics & Chuỗi cung ứng",
			"Kỹ thuật Điện tử",
			"IoT - Internet vạn vật",
			"Cơ khí tự động hóa",
			"Hán ngữ thương mại"
		],
		majorIcons: [
			"🚗",
			"🛸",
			"🛒",
			"🚚",
			"🔌",
			"📡",
			"⚙️",
			"🀄"
		],
		majorDescriptions: [
			"Đón đầu xu hướng điện hóa giao thông, pin thế hệ mới và hệ sinh thái xe thông minh.",
			"Phát triển cùng nhu cầu UAV trong nông nghiệp, vận chuyển, khảo sát và cứu hộ.",
			"Mở rộng theo thương mại xuyên biên giới, bán hàng đa kênh và vận hành bằng dữ liệu.",
			"Giữ vai trò cốt lõi khi chuỗi cung ứng khu vực ngày càng tự động hóa và kết nối sâu.",
			"Là nền tảng cho thiết bị thông minh, năng lượng sạch, robot và sản xuất công nghệ cao.",
			"Kết nối nhà máy, đô thị và thiết bị thông minh trong nền kinh tế số tương lai.",
			"Thúc đẩy nhà máy thông minh, robot cộng tác và dây chuyền sản xuất ít phụ thuộc lao động tay chân.",
			"Tạo lợi thế trong thương mại, dịch vụ và hợp tác doanh nghiệp Việt Nam – Trung Quốc."
		],
		expertsHeading: "Đội ngũ chuyên gia tư vấn",
		expertsDescription: "Đồng hành từ lúc chọn ngành, chuẩn bị hồ sơ đến khi học viên sẵn sàng nhập học.",
		experts: [
			{
				name: "Ths. Nguyễn Thu Hương",
				role: "Chuyên gia định hướng ngành học",
				bio: "Tập trung đánh giá năng lực, sở thích và mục tiêu dài hạn để giúp học viên chọn ngành phù hợp.",
				experience: "Kinh nghiệm tư vấn lộ trình học nghề quốc tế và định hướng nghề nghiệp sau tốt nghiệp."
			},
			{
				name: "Ông Lê Quang Vinh",
				role: "Chuyên gia hồ sơ & tuyển sinh",
				bio: "Đồng hành cùng học viên từ bước rà soát điều kiện đến hoàn thiện hồ sơ nhập học và visa.",
				experience: "Kinh nghiệm xử lý hồ sơ tuyển sinh, thủ tục du học và chuẩn bị trước khi xuất cảnh."
			},
			{
				name: "Cô Phạm Minh Anh",
				role: "Chuyên gia đồng hành học viên",
				bio: "Hỗ trợ học viên chuẩn bị ngôn ngữ, kỹ năng thích nghi và kế hoạch học tập tại Trung Quốc.",
				experience: "Kinh nghiệm đào tạo kỹ năng tiền du học và hỗ trợ học viên trong quá trình hòa nhập."
			}
		],
		galleryHeading: "Hình ảnh thực tế: visa, trường học & ký túc xá",
		galleryDescription: "Ảnh từ các khóa học viên đã bay và trường đối tác tại Trung Quốc.",
		galleryCaptions: [
			"Visa du học sinh đã được cấp cho học viên khóa gần nhất",
			"Khuôn viên trường Cao đẳng nghề đối tác tại Trung Quốc",
			"Phòng ký túc xá trong trường — miễn 100% phí ở",
			"Học viên lên đường nhập học kỳ tháng 9"
		],
		testimonialsHeading: "Học viên đi trước nói gì",
		testimonials: [
			{
				name: "Nguyễn Văn Hùng",
				meta: "Ngành Ô tô điện · Quảng Châu · khóa tháng 9",
				text: "Trước em làm xưởng gỗ 7 triệu/tháng. Sang đây vừa học vừa làm được hơn 20 triệu, tháng nào cũng gửi về nhà 10 triệu. Tay nghề lên hẳn vì được làm trên xe thật.",
				avatarUrl: ""
			},
			{
				name: "Trần Thị Ngọc",
				meta: "Ngành Thương mại điện tử · Nghĩa Ô",
				text: "Em không biết tiếng Hán, được học nền tảng trước khi bay nên sang không bị choáng. Giờ em phụ trách livestream cho một shop, thu nhập ổn định.",
				avatarUrl: ""
			},
			{
				name: "Lê Đình Phúc",
				meta: "Ngành Drone (UAV) · Thâm Quyến",
				text: "Nhà em không đủ tiền cho đi du học tự túc. Chương trình 0Đ giúp em học ngành công nghệ mà chi phí ban đầu rất nhẹ. Ra trường có bằng Cao đẳng chính quy.",
				avatarUrl: ""
			}
		],
		stepsHeading: "Lộ trình 4 bước đơn giản",
		steps: [
			{
				number: "01",
				title: "Đăng ký & tư vấn 1:1",
				description: "Điền form, chuyên viên gọi lại trong 30 phút, gửi lộ trình chi tiết."
			},
			{
				number: "02",
				title: "Chọn ngành & xét hồ sơ",
				description: "Chọn 1 trong 8 ngành hot, hoàn thiện hồ sơ theo hướng dẫn từng bước."
			},
			{
				number: "03",
				title: "Học tiếng Hán & định hướng",
				description: "Đào tạo tiếng Hán nền tảng và kỹ năng trước khi bay."
			},
			{
				number: "04",
				title: "Nhập học & bắt đầu kiếm tiền",
				description: "Sang trường đối tác, học nghề và làm việc có lương ngay từ kỳ đầu."
			}
		],
		faqHeading: "Câu hỏi thường gặp",
		faqs: [
			{
				slug: "hoc_phi",
				question: "Du học nghề Trung Quốc học phí 0Đ có thật không?",
				answer: "Có. Học phí được doanh nghiệp Trung Quốc tài trợ theo chương trình liên kết đào tạo nhân lực. Học viên chỉ cần chuẩn bị chi phí hồ sơ, vé máy bay và sinh hoạt ban đầu; phần này được tư vấn minh bạch trước khi đăng ký."
			},
			{
				slug: "tieng_trung",
				question: "Điều kiện tham gia gồm những gì?",
				answer: "Tốt nghiệp THPT (hoặc tương đương), độ tuổi 18-28, sức khỏe tốt. Không cần chứng minh tài chính và không yêu cầu biết tiếng Hán trước — học viên được đào tạo tiếng Hán nền tảng trước khi bay."
			},
			{
				slug: "luong_thuc_tap",
				question: "Vừa học vừa làm thì lương bao nhiêu và có đủ sống không?",
				answer: "Thu nhập thực tập tại doanh nghiệp đối tác thường 15-30 triệu đồng/tháng tùy ngành và ca làm. Mức này đủ trang trải sinh hoạt, ký túc xá và còn dư gửi về gia đình."
			},
			{
				slug: "bang_cap",
				question: "Bằng tốt nghiệp có được công nhận không?",
				answer: "Học viên nhận bằng Cao đẳng chính quy của trường tại Trung Quốc, được công nhận quốc tế, có thể ở lại làm việc, học liên thông lên Đại học hoặc về Việt Nam làm cho doanh nghiệp FDI."
			},
			{
				slug: "thoi_gian",
				question: "Thời gian nhập học và quy trình mất bao lâu?",
				answer: "Có hai kỳ nhập học mỗi năm: tháng 3 và tháng 9. Từ lúc đăng ký tới khi bay thường 3-5 tháng, gồm xét hồ sơ, học tiếng Hán và làm thủ tục visa."
			},
			{
				slug: "nganh_hoc",
				question: "Ngành nào đang cần nhiều nhân lực nhất?",
				answer: "Công nghệ ô tô điện, công nghệ drone (UAV), IoT và logistics là các ngành tuyển nhiều nhất, đồng thời có mức lương thực tập cao nhất trong 8 ngành của chương trình."
			}
		],
		finalCtaHeading: "Đổi 30 giây hôm nay cho 5 năm tới của bạn",
		finalCtaDescription: "Nhận lộ trình chi tiết, danh sách trường và mức lương thực tế theo từng ngành — hoàn toàn 0Đ."
	},
	fomo: {
		enabled: true,
		source: "recentLeads",
		respectReducedMotion: true,
		names: [
			"Trần Văn Nam",
			"Nguyễn Thị Hà",
			"Lê Minh Quân",
			"Phạm Thu Trang",
			"Hoàng Văn Dũng",
			"Đỗ Thị Mai",
			"Vũ Đức Anh",
			"Bùi Thanh Tùng",
			"Ngô Thị Lan",
			"Đặng Hữu Phước"
		],
		cities: [
			"Bình Dương",
			"Hà Nội",
			"Bắc Giang",
			"Nghệ An",
			"Thanh Hóa",
			"Hải Phòng",
			"Đồng Nai",
			"Thái Nguyên",
			"Cần Thơ",
			"Đắk Lắk"
		],
		minDelaySec: 10,
		maxDelaySec: 18,
		displaySec: 5,
		position: "left",
		template: "{name} ({city}) vừa đăng ký nhận tư vấn"
	},
	countdown: {
		enabled: true,
		slotsLeft: 12,
		headline: "suất học bổng miễn 100% KTX tháng này",
		endMode: "endOfMonth",
		endDate: ""
	},
	floatingContact: {
		enabled: true,
		hotline: "0900000000",
		zalo: "https://zalo.me/0900000000",
		messenger: "",
		animateHotline: true,
		animateMessenger: true
	},
	trafficStats: {
		enabled: true,
		position: "footer",
		title: "Thống kê truy cập thông minh",
		helperText: "Dữ liệu truy cập được gom từ cùng một kho tracking để đồng bộ giữa Analytics, Mini-CRM và Webhook."
	},
	footer: {
		logoUrl: "",
		menuLabel: "Liên kết nhanh",
		menuLinks: [{
			label: "Đăng ký tư vấn",
			href: "#dang-ky-cuoi"
		}, {
			label: "Câu hỏi thường gặp",
			href: "#faq"
		}]
	},
	form: {
		headline: "Đăng ký nhận tư vấn miễn phí",
		ctaLabel: "ĐĂNG KÝ NGAY",
		webhookUrl: "https://hook.eu2.make.com/REPLACE_WITH_YOUR_WEBHOOK",
		redirectUrl: "",
		rateLimitCount: 3,
		rateLimitWindowMin: 5,
		fields: [
			{
				name: "name",
				label: "Họ và tên",
				placeholder: "Nguyễn Văn A",
				type: "text",
				required: true
			},
			{
				name: "phone",
				label: "Số điện thoại",
				placeholder: "09xx xxx xxx",
				type: "tel",
				required: true
			},
			{
				name: "email",
				label: "Email (không bắt buộc)",
				placeholder: "email@example.com",
				type: "email",
				required: false
			},
			{
				name: "city",
				label: "Tỉnh/Thành phố",
				placeholder: "Chọn tỉnh/thành",
				type: "select",
				required: true
			},
			{
				name: "major",
				label: "Ngành học quan tâm",
				placeholder: "Chọn ngành",
				type: "select",
				required: true
			}
		]
	},
	aiAdvisor: {
		enabled: true,
		vipDeviceRegex: "iPhone (13|14|15|16) Pro|Pro Max|Galaxy S(22|23|24)|Fold|Flip",
		keyRegions: "Nghệ An|Hà Tĩnh|Quảng Bình|Thanh Hóa|Quảng Ninh|Hải Phòng",
		fastFillThresholdSec: 4,
		vipTimeOnPageSec: 80,
		vipScrollPercent: 70
	},
	webhooks: [],
	emailAutomation: {
		enabled: false,
		provider: "resend",
		fromEmail: "",
		subject: "Cảm ơn {name} đã đăng ký tư vấn du học nghề Trung Quốc",
		body: "Chào {name},\n\nCảm ơn bạn đã để lại thông tin. Đội ngũ tư vấn sẽ liên hệ số {phone} trong thời gian sớm nhất.\n\nTrân trọng."
	},
	abTest: {
		enabled: false,
		split: 50,
		variantALabel: "Variant A",
		variantBLabel: "Variant B",
		variantAHeadline: "",
		variantBHeadline: "",
		variantACta: "",
		variantBCta: ""
	}
};
/**
* HYBRID STORAGE ADAPTER
* ----------------------
* - LOCAL MODE (mặc định): đọc/ghi cấu hình qua localStorage, không cần DB.
* - DATABASE MODE: đồng bộ qua Supabase REST (khi Admin cấu hình URL + anon key).
*
* Toàn bộ hệ thống chỉ gọi qua adapter này nên có thể đổi backend mà không sửa UI.
*/
var CONFIG_KEY = "funnel_site_config_v1";
var LEADS_KEY = "funnel_leads_v1";
var ANALYTICS_KEY = "funnel_analytics_v1";
var BACKUP_KEY = "funnel_backup_snapshots_v1";
var LEAD_CREATED_EVENT = "funnel:lead-created";
var ANALYTICS_UPDATED_EVENT = "funnel:analytics-updated";
var CLOUD_CONFIG_TABLE = "funnel_configs";
function isRecord(value) {
	return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
/** Deep-merge dữ liệu đã lưu lên mặc định để config luôn đủ trường khi nâng cấp. */
function mergeConfig(base, override) {
	if (!override) return structuredClone(base);
	const compatibleOverride = structuredClone(override);
	if (compatibleOverride.landing?.sections && !compatibleOverride.landing.sectionsArray) {
		compatibleOverride.landing.sectionsArray = compatibleOverride.landing.sections.map((section, order) => ({
			...section,
			type: section.type || section.id,
			order
		}));
		delete compatibleOverride.landing.sections;
	}
	const merge = (baseValue, overrideValue) => {
		if (overrideValue && typeof overrideValue === "object" && !Array.isArray(overrideValue) && baseValue && typeof baseValue === "object" && !Array.isArray(baseValue)) {
			const result = { ...baseValue };
			for (const [key, value] of Object.entries(overrideValue)) result[key] = merge(result[key], value);
			return result;
		}
		return overrideValue === void 0 ? baseValue : overrideValue;
	};
	return merge(structuredClone(base), compatibleOverride);
}
function isBrowser() {
	return typeof window !== "undefined";
}
function loadConfig() {
	if (!isBrowser()) return structuredClone(DEFAULT_CONFIG);
	try {
		const raw = window.localStorage.getItem(CONFIG_KEY);
		const parsed = raw ? JSON.parse(raw) : null;
		return mergeConfig(DEFAULT_CONFIG, isRecord(parsed) ? parsed : null);
	} catch {
		return structuredClone(DEFAULT_CONFIG);
	}
}
/** Nạp cấu hình landing từ Supabase khi Database Mode được bật. */
async function loadCloudConfig(config) {
	if (!isBrowser() || config.admin.storageMode !== "database" || !config.admin.supabaseUrl || !config.admin.supabaseAnonKey) return null;
	try {
		const response = await fetch(`${config.admin.supabaseUrl.replace(/\/$/, "")}/rest/v1/${CLOUD_CONFIG_TABLE}?id=eq.1&select=data`, { headers: {
			apikey: config.admin.supabaseAnonKey,
			Authorization: `Bearer ${config.admin.supabaseAnonKey}`
		} });
		if (!response.ok) return null;
		const rows = await response.json();
		if (!Array.isArray(rows) || !isRecord(rows[0])) return null;
		const data = rows[0]["data"];
		return isRecord(data) ? mergeConfig(DEFAULT_CONFIG, data) : null;
	} catch {
		return null;
	}
}
function saveConfig(config) {
	if (!isBrowser()) return;
	try {
		window.localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
	} catch {
		return;
	}
	try {
		const snaps = JSON.parse(window.localStorage.getItem(BACKUP_KEY) || "[]");
		snaps.unshift({
			at: (/* @__PURE__ */ new Date()).toISOString(),
			config
		});
		window.localStorage.setItem(BACKUP_KEY, JSON.stringify(snaps.slice(0, 10)));
	} catch {}
	if (config.admin.storageMode === "database" && config.admin.supabaseUrl && config.admin.supabaseAnonKey) syncConfigToSupabase(config);
}
function resetConfig() {
	if (isBrowser()) window.localStorage.removeItem(CONFIG_KEY);
	return structuredClone(DEFAULT_CONFIG);
}
function exportConfigFile(config) {
	if (!isBrowser()) return;
	const content = `// AUTO-GENERATED — dán đè vào src/config/site-config.ts (phần DEFAULT_CONFIG)\nexport const DEFAULT_CONFIG = ${JSON.stringify(config, null, 2)};\n`;
	const blob = new Blob([content], { type: "text/javascript" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = "site-config.export.js";
	a.click();
	URL.revokeObjectURL(url);
}
/**
* Kiểm tra & chuẩn hoá cấu hình tải lên (JSON thuần hoặc file .js đã export).
* Trả về null nếu nội dung không phải một SiteConfig hợp lệ.
*/
function parseImportedConfig(raw) {
	const jsonText = raw.trim().startsWith("{") ? raw : raw.match(/\{[\s\S]*\}/)?.[0] ?? "";
	if (!jsonText) return null;
	try {
		const parsed = JSON.parse(jsonText);
		if (!isRecord(parsed) || !isRecord(parsed["admin"]) || !isRecord(parsed["landing"]) || !isRecord(parsed["tracking"]) || !isRecord(parsed["seo"])) return null;
		return mergeConfig(DEFAULT_CONFIG, parsed);
	} catch {
		return null;
	}
}
function loadLeads() {
	if (!isBrowser()) return [];
	try {
		return JSON.parse(window.localStorage.getItem(LEADS_KEY) || "[]");
	} catch {
		return [];
	}
}
/** Trùng lặp: cùng số điện thoại đã gửi trong 24 giờ gần nhất. */
function isDuplicateLead(phone) {
	const cutoff = Date.now() - 864e5;
	return loadLeads().some((l) => l.phone === phone && new Date(l.at).getTime() > cutoff);
}
function clearLeads() {
	if (!isBrowser()) return;
	window.localStorage.removeItem(LEADS_KEY);
}
/**
* Lưu lead vào kho đang hoạt động. Luôn ghi bản sao ở máy để Mini-CRM hiển thị
* ngay; ở Database Mode sẽ đẩy thêm lên bảng `leads` của Supabase.
*/
async function saveLead(lead, config) {
	const mode = config?.admin.storageMode === "database" && config.admin.supabaseUrl && config.admin.supabaseAnonKey ? "database" : "local";
	const record = {
		...lead,
		storage: mode
	};
	if (mode === "database" && config) {
		if (!await pushLeadToSupabase(record, config.admin.supabaseUrl, config.admin.supabaseAnonKey)) record.storage = "local";
	}
	if (isBrowser()) {
		const leads = loadLeads();
		leads.unshift(record);
		window.localStorage.setItem(LEADS_KEY, JSON.stringify(leads.slice(0, 500)));
		window.dispatchEvent(new CustomEvent(LEAD_CREATED_EVENT, { detail: record }));
	}
	return record;
}
async function pushLeadToSupabase(lead, url, key) {
	try {
		return (await fetch(`${url.replace(/\/$/, "")}/rest/v1/leads`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				apikey: key,
				Authorization: `Bearer ${key}`,
				Prefer: "return=minimal"
			},
			body: JSON.stringify([{
				name: lead.name,
				phone: lead.phone,
				email: lead.email ?? null,
				city: lead.city ?? null,
				major: lead.major ?? null,
				ai_score: lead.aiScore ?? null,
				ai_rank: lead.aiRank ?? null,
				risk_level: lead.riskLevel ?? null,
				risk_reasons: lead.riskReasons ?? null,
				recommended_action: lead.recommendedAction ?? null,
				lead_behavior_summary: lead.behaviorSummary ?? null,
				behavior_summary: lead.behaviorSummary ?? null,
				sale_advice: lead.saleAdvice ?? null,
				device_summary: lead.deviceTechInfo ?? null,
				device_tech_info: lead.deviceTechInfo ?? null,
				utm_traffic_source: lead.trafficAdsSource ?? null,
				traffic_ads_source: lead.trafficAdsSource ?? null,
				network_provider: lead.networkProvider ?? null,
				network_label: lead.networkLabel ?? null,
				current_session: lead.currentSession ?? null,
				visits_today: lead.visitsToday ?? null,
				visits_month: lead.visitsMonth ?? null,
				utm_source: lead.utmSource ?? null,
				utm_medium: lead.utmMedium ?? null,
				utm_campaign: lead.utmCampaign ?? null,
				utm_content: lead.utmContent ?? null,
				ttclid: lead.ttclid ?? null,
				variant: lead.variant ?? null,
				visitor_behavior_payload: lead.visitorBehaviorPayload ?? null,
				created_at: lead.at
			}])
		})).ok;
	} catch {
		return false;
	}
}
function exportLeadsCsv(leads) {
	if (!isBrowser()) return;
	const headers = [
		"at",
		"name",
		"phone",
		"email",
		"city",
		"major",
		"aiScore",
		"aiRank",
		"riskLevel",
		"riskReasons",
		"recommendedAction",
		"behaviorSummary",
		"saleAdvice",
		"deviceTechInfo",
		"trafficAdsSource",
		"networkProvider",
		"networkLabel",
		"currentSession",
		"visitsToday",
		"visitsMonth",
		"utmSource",
		"utmMedium",
		"utmCampaign",
		"utmContent",
		"ttclid",
		"variant"
	];
	const rows = leads.map((l) => headers.map((h) => `"${String(l[h] ?? "").replace(/"/g, "\"\"")}"`).join(","));
	const csv = [headers.join(","), ...rows].join("\n");
	const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `leads-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
	a.click();
	URL.revokeObjectURL(url);
}
function emptyAnalytics() {
	return {
		visits: 0,
		leads: 0,
		bySource: {},
		bySourceStats: {},
		byVariant: {}
	};
}
function cleanSource(source) {
	return source.trim().slice(0, 100) || "direct";
}
function normalizeAnalytics(value) {
	const result = emptyAnalytics();
	result.visits = Number.isFinite(value?.visits) ? Math.max(0, Number(value?.visits)) : 0;
	result.leads = Number.isFinite(value?.leads) ? Math.max(0, Number(value?.leads)) : 0;
	for (const [source, count] of Object.entries(value?.bySource || {})) if (Number.isFinite(count)) result.bySource[cleanSource(source)] = Math.max(0, Number(count));
	for (const [source, stats] of Object.entries(value?.bySourceStats || {})) {
		if (!stats) continue;
		result.bySourceStats[cleanSource(source)] = {
			visits: Number.isFinite(stats.visits) ? Math.max(0, Number(stats.visits)) : 0,
			leads: Number.isFinite(stats.leads) ? Math.max(0, Number(stats.leads)) : 0
		};
	}
	for (const [source, visits] of Object.entries(result.bySource)) result.bySourceStats[source] = result.bySourceStats[source] || {
		visits,
		leads: 0
	};
	for (const [variant, stats] of Object.entries(value?.byVariant || {})) {
		if (!stats) continue;
		result.byVariant[variant] = {
			visits: Number.isFinite(stats.visits) ? Math.max(0, Number(stats.visits)) : 0,
			leads: Number.isFinite(stats.leads) ? Math.max(0, Number(stats.leads)) : 0
		};
	}
	return result;
}
function loadAnalytics() {
	if (!isBrowser()) return emptyAnalytics();
	try {
		return normalizeAnalytics(JSON.parse(window.localStorage.getItem(ANALYTICS_KEY) || "{}"));
	} catch {
		return emptyAnalytics();
	}
}
function saveAnalytics(state) {
	if (!isBrowser()) return;
	window.localStorage.setItem(ANALYTICS_KEY, JSON.stringify(state));
	window.dispatchEvent(new CustomEvent(ANALYTICS_UPDATED_EVENT, { detail: state }));
}
function trackVisit(source, variant) {
	const a = loadAnalytics();
	a.visits += 1;
	const normalizedSource = cleanSource(source);
	a.bySource[normalizedSource] = (a.bySource[normalizedSource] || 0) + 1;
	a.bySourceStats[normalizedSource] = a.bySourceStats[normalizedSource] || {
		visits: 0,
		leads: 0
	};
	a.bySourceStats[normalizedSource].visits += 1;
	if (variant) {
		a.byVariant[variant] = a.byVariant[variant] || {
			visits: 0,
			leads: 0
		};
		a.byVariant[variant].visits += 1;
	}
	saveAnalytics(a);
}
function trackConversion(source, variant) {
	const a = loadAnalytics();
	a.leads += 1;
	const normalizedSource = cleanSource(source);
	a.bySource[normalizedSource] = a.bySource[normalizedSource] || 0;
	a.bySourceStats[normalizedSource] = a.bySourceStats[normalizedSource] || {
		visits: 0,
		leads: 0
	};
	a.bySourceStats[normalizedSource].leads += 1;
	if (variant) {
		a.byVariant[variant] = a.byVariant[variant] || {
			visits: 0,
			leads: 0
		};
		a.byVariant[variant].leads += 1;
	}
	saveAnalytics(a);
}
function clearAnalytics() {
	if (!isBrowser()) return;
	window.localStorage.removeItem(ANALYTICS_KEY);
	window.dispatchEvent(new CustomEvent(ANALYTICS_UPDATED_EVENT, { detail: emptyAnalytics() }));
}
/** Ghi config vào bảng `site_config` (id=1) qua Supabase REST. Best-effort. */
async function syncConfigToSupabase(config) {
	try {
		const { supabaseUrl, supabaseAnonKey } = config.admin;
		const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/${CLOUD_CONFIG_TABLE}?on_conflict=id`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Prefer: "resolution=merge-duplicates",
				apikey: supabaseAnonKey,
				Authorization: `Bearer ${supabaseAnonKey}`
			},
			body: JSON.stringify([{
				id: 1,
				data: config,
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			}])
		});
		if (!response.ok) console.warn(`Supabase config sync failed [${response.status}]`);
	} catch (err) {
		console.warn("Supabase config sync failed:", err.message);
	}
}
async function testSupabaseConnection(url, key) {
	try {
		const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/`, { headers: {
			apikey: key,
			Authorization: `Bearer ${key}`
		} });
		return res.ok || res.status === 404;
	} catch {
		return false;
	}
}
var SiteConfigContext = (0, import_react.createContext)(null);
function SiteConfigProvider({ children }) {
	const [config, setConfig] = (0, import_react.useState)(DEFAULT_CONFIG);
	const [dirty, setDirty] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const localConfig = loadConfig();
		setConfig(localConfig);
		loadCloudConfig(localConfig).then((cloudConfig) => {
			if (cloudConfig) setConfig(cloudConfig);
		});
	}, []);
	const update = (0, import_react.useCallback)((patch) => {
		setConfig((prev) => {
			const draft = structuredClone(prev);
			patch(draft);
			return draft;
		});
		setDirty(true);
	}, []);
	const save = (0, import_react.useCallback)(() => {
		setConfig((current) => {
			saveConfig(current);
			return current;
		});
		setDirty(false);
	}, []);
	const reset = (0, import_react.useCallback)(() => {
		setConfig(resetConfig());
		setDirty(false);
	}, []);
	const resetLanding = (0, import_react.useCallback)(() => {
		setConfig((current) => ({
			...current,
			landing: structuredClone(DEFAULT_CONFIG.landing)
		}));
		setDirty(true);
	}, []);
	const exportFile = (0, import_react.useCallback)(() => {
		setConfig((current) => {
			exportConfigFile(current);
			return current;
		});
	}, []);
	const importConfig = (0, import_react.useCallback)((raw) => {
		const parsed = parseImportedConfig(raw);
		if (!parsed) return false;
		saveConfig(parsed);
		setConfig(parsed);
		setDirty(false);
		return true;
	}, []);
	const value = (0, import_react.useMemo)(() => ({
		config,
		update,
		save,
		reset,
		resetLanding,
		exportFile,
		importConfig,
		dirty
	}), [
		config,
		update,
		save,
		reset,
		resetLanding,
		exportFile,
		importConfig,
		dirty
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteConfigContext.Provider, {
		value,
		children
	});
}
function useSiteConfig() {
	const ctx = (0, import_react.useContext)(SiteConfigContext);
	if (!ctx) throw new Error("useSiteConfig must be used within SiteConfigProvider");
	return ctx;
}
//#endregion
export { clearAnalytics as a, isDuplicateLead as c, saveLead as d, testSupabaseConnection as f, useSiteConfig as h, SiteConfigProvider as i, loadAnalytics as l, trackVisit as m, DEFAULT_CONFIG as n, clearLeads as o, trackConversion as p, LEAD_CREATED_EVENT as r, exportLeadsCsv as s, ANALYTICS_UPDATED_EVENT as t, loadLeads as u };
