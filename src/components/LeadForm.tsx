import { useRef, useState } from "react";
import { toast } from "sonner";
import { trackFormStart, trackLead } from "@/lib/tracking";
import {
  buildVisitorBehaviorPayload,
  markCopyPaste,
  markFormStart,
  markIndustrySwitch,
} from "@/lib/behavior";
import { getVariant, utmSource } from "@/lib/ab";
import { useSiteConfig } from "@/lib/use-site-config";
import { dispatchLead } from "@/services/webhooks";
import {
  isDuplicateLead,
  saveLead,
  trackConversion,
  type LeadRecord,
} from "@/services/dataAdapter";
import { sendLeadEmail } from "@/lib/email.functions";

export const MAJORS = [
  "Công nghệ Ô tô điện",
  "Công nghệ Drone (UAV)",
  "Thương mại điện tử",
  "Logistics & Chuỗi cung ứng",
  "Kỹ thuật Điện tử",
  "IoT - Internet vạn vật",
  "Cơ khí tự động hóa",
  "Hán ngữ thương mại",
];

/** 63 tỉnh/thành Việt Nam gom theo vùng (dùng cho <optgroup>) */
const PROVINCE_GROUPS: { region: string; provinces: string[] }[] = [
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
      "Ninh Bình",
    ],
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
      "Lâm Đồng",
    ],
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
      "Cà Mau",
    ],
  },
];

const EMPTY = { name: "", phone: "", email: "", province: "", major: "" };

type Status = "idle" | "sending" | "done" | "error";

const inputClass =
  "w-full rounded-xl border border-input bg-background px-4 py-3.5 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30";

/** Rate limiting: giới hạn số lần gửi trong 1 cửa sổ thời gian / trình duyệt (cấu hình trong Admin). */
const RATE_KEY = "lp_rate";

function rateLimited(maxCount: number, windowMin: number): boolean {
  if (typeof window === "undefined") return false;
  const now = Date.now();
  const windowMs = Math.max(1, windowMin) * 60 * 1000;
  let stamps: number[] = [];
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
  } catch {
    /* ignore quota */
  }
  return false;
}

export function LeadForm({ id = "dang-ky" }: { id?: string }) {
  const { config } = useSiteConfig();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [form, setForm] = useState(EMPTY);
  const startedRef = useRef(false);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const field = (name: string, fallback: string) =>
    config.form.fields.find((item) => item.name === name)?.placeholder ||
    fallback;

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const setMajor = (e: React.ChangeEvent<HTMLSelectElement>) => {
    markIndustrySwitch();
    setForm((f) => ({ ...f, major: e.target.value }));
  };

  const setPhone = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({
      ...f,
      phone: e.target.value.replace(/\D/g, "").slice(0, 10),
    }));

  // Khách bắt đầu tương tác với ô input đầu tiên -> form_start
  const onFirstInteract = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    markFormStart();
    trackFormStart(config.tracking.events.formStart);
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;

    // Anti-spam honeypot: bot điền trường ẩn -> giả vờ thành công, không gửi
    if (honeypotRef.current?.value) {
      setForm(EMPTY);
      setStatus("done");
      return;
    }

    const phone = form.phone.replace(/\D/g, "");
    if (!/^(03|05|07|08|09)\d{8}$/.test(phone)) {
      setError(
        "Số điện thoại không hợp lệ. Phải bắt đầu bằng 03, 05, 07, 08 hoặc 09 và đủ 10 số — ví dụ: 0912345678.",
      );
      setStatus("error");
      return;
    }
    const name = form.name.trim();
    if (name.length < 2 || !/^[\p{L}\s]+$/u.test(name)) {
      setError(
        "Họ và tên chỉ chứa chữ cái và dấu tiếng Việt, tối thiểu 2 ký tự.",
      );
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
      setError(
        "Số điện thoại này vừa được đăng ký. Tư vấn viên sẽ liên hệ với bạn sớm nhất.",
      );
      setStatus("error");
      return;
    }

    if (
      rateLimited(config.form.rateLimitCount, config.form.rateLimitWindowMin)
    ) {
      setError(
        "Bạn đã gửi nhiều lần trong thời gian ngắn. Vui lòng chờ vài phút rồi thử lại.",
      );
      setStatus("error");
      return;
    }

    setError("");
    setStatus("sending");

    const { behavior, assessment, visitorBehaviorPayload } =
      buildVisitorBehaviorPayload(
        {
          city: form.province,
          major: form.major,
        },
        config.aiAdvisor,
      );
    const { score: aiScore, rank: aiRank } = assessment;
    const variant = getVariant(config.abTest.enabled, config.abTest.split);
    const source = utmSource();

    const payload = {
      full_name: name.slice(0, 100),
      phone,
      email: email.slice(0, 255),
      major: form.major,
      city: form.province,
      landing_url:
        typeof window !== "undefined"
          ? window.location.href
          : "Landing Page UTM",
      source,
      created_at: visitorBehaviorPayload.submittedAt,
      ab_variant: variant,
      ai_score: aiScore,
      ai_rank: aiRank,
      risk_level: assessment.riskLevel,
      risk_reasons: assessment.reasons,
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
      operating_system: [
        behavior.operating_system,
        behavior.operating_system_version,
      ]
        .filter(Boolean)
        .join(" "),
      browser: [behavior.browser, behavior.browser_version]
        .filter(Boolean)
        .join(" "),
      network_provider: behavior.network_provider,
      network_label: behavior.network_label,
      sale_advice: visitorBehaviorPayload.saleAdvice,
      behavior_summary: visitorBehaviorPayload.behaviorSummary,
      device_tech_info: visitorBehaviorPayload.deviceTechInfo,
      traffic_ads_source: visitorBehaviorPayload.trafficAdsSource,
      visitor_behavior_payload: visitorBehaviorPayload,
    };

    try {
      // Lưu Mini-CRM (localStorage / Supabase) để hiện trong bảng Quản Lý Lead.
      const leadRecord: LeadRecord = {
        id: `ld_${Date.now()}`,
        at: payload.created_at,
        name: payload.full_name,
        phone: payload.phone,
        email: payload.email || undefined,
        city: payload.city || undefined,
        major: payload.major || undefined,
        aiScore,
        aiRank,
        riskLevel: assessment.riskLevel,
        riskReasons: assessment.reasons,
        recommendedAction: assessment.recommendedAction,
        behaviorSummary: payload.behavior_summary,
        saleAdvice: payload.sale_advice,
        deviceTechInfo: payload.device_tech_info,
        trafficAdsSource: payload.traffic_ads_source,
        networkProvider: payload.network_provider || undefined,
        networkLabel: payload.network_label || undefined,
        visitsToday: payload.visits_today,
        visitsMonth: payload.visits_month,
        currentSession: payload.current_session,
        visitorBehaviorPayload,
        utmSource: source,
        utmMedium: payload.utm_medium,
        utmCampaign: payload.utm_campaign,
        utmContent: payload.utm_content,
        ttclid: payload.ttclid,
        variant,
      };
      await saveLead(leadRecord, config);

      // Chờ toàn bộ endpoint đã bật nhận lead trước khi xác nhận chuyển đổi.
      const delivery = await dispatchLead(config, payload);
      if (!delivery.ok) {
        const failed = delivery.results
          .filter((result) => !result.ok)
          .map((result) => result.label)
          .join(", ");
        console.warn("Webhook delivery incomplete:", delivery.results);
        throw new Error(
          failed
            ? `Webhook chưa nhận được dữ liệu: ${failed}`
            : "Webhook chưa được cấu hình hoặc chưa phản hồi.",
        );
      }

      // Ghi nhận chuyển đổi cho Analytics Dashboard + A/B comparison.
      trackConversion(source, config.abTest.enabled ? variant : undefined);

      // Automated Email Sequencer (auto-responder) — chạy phía server nếu bật.
      if (config.emailAutomation.enabled && email) {
        const fill = (s: string) =>
          s
            .replaceAll("{name}", payload.full_name)
            .replaceAll("{phone}", payload.phone)
            .replaceAll("{city}", payload.city || "")
            .replaceAll("{ai_score}", String(aiScore));
        void sendLeadEmail({
          data: {
            provider: config.emailAutomation.provider,
            to: email,
            from: config.emailAutomation.fromEmail,
            subject: fill(config.emailAutomation.subject),
            text: fill(config.emailAutomation.body),
          },
        })
          .then((result) => {
            if (!result.sent)
              console.warn(
                "Lead confirmation email was not sent:",
                result.reason,
              );
          })
          .catch((error) => {
            console.warn("Lead confirmation email failed:", error);
          });
      }

      // Chỉ bắn tracking SAU khi dữ liệu đã gửi thành công
      trackLead(
        { content_name: form.major || "Du hoc nghe Trung Quoc" },
        config.tracking.events,
        config.tracking.ga4Id,
      );
      setForm(EMPTY);
      setStatus("done");
      toast.success("Đăng ký thành công!", {
        description: "Tư vấn viên sẽ liên hệ lại trong 5 phút.",
      });
      // Redirect (Thank You Page) nếu Admin cấu hình.
      const redirect = config.form.redirectUrl?.trim();
      if (redirect && typeof window !== "undefined")
        window.location.assign(redirect);
      else {
        const thankYou = config.pages.find(
          (page) => page.enabled && page.kind === "thankYou",
        );
        if (thankYou && typeof window !== "undefined")
          window.location.assign(`/${thankYou.path}`);
      }
    } catch {
      setError(
        "Có lỗi khi gửi thông tin. Vui lòng kiểm tra kết nối và thử gửi lại.",
      );
      setStatus("error");
      toast.error("Gửi chưa thành công", {
        description: "Vui lòng thử lại sau vài giây.",
      });
    }
  }

  if (status === "done") {
    return (
      <div
        id={id}
        className="rounded-2xl bg-card p-8 text-center shadow-[var(--shadow-card)] ring-1 ring-border"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold text-2xl font-bold text-gold-foreground">
          ✓
        </div>
        <h3 className="mt-4 text-2xl font-extrabold">Đăng ký thành công!</h3>
        <p className="mt-2 text-muted-foreground">
          Tư vấn viên sẽ liên hệ lại với bạn trong 5 phút. Vui lòng để ý điện
          thoại (cuộc gọi hoặc Zalo).
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 text-sm font-bold text-primary underline underline-offset-4"
        >
          Gửi thêm một đăng ký khác
        </button>
      </div>
    );
  }

  return (
    <form
      id={id}
      onSubmit={onSubmit}
      className="rounded-2xl bg-card p-6 shadow-[var(--shadow-card)] ring-1 ring-border sm:p-8"
    >
      <p className="text-xs font-bold uppercase tracking-widest text-primary">
        Miễn phí 100%
      </p>
      <h2 className="mt-1 text-2xl font-extrabold leading-tight sm:text-3xl">
        {config.form.headline || "Nhận lộ trình du học nghề 0Đ"}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Chỉ 30 giây. Chúng tôi gọi lại tư vấn 1:1, không thu bất kỳ khoản phí
        nào.
      </p>

      <div className="mt-5 space-y-3">
        {/* Honeypot ẩn chống bot — người thật không nhìn thấy */}
        <input
          ref={honeypotRef}
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] h-0 w-0 opacity-0"
        />
        <input
          required
          maxLength={100}
          value={form.name}
          onChange={set("name")}
          onFocus={onFirstInteract}
          placeholder={field("name", "Họ và tên")}
          className={inputClass}
        />
        <input
          required
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={10}
          value={form.phone}
          onChange={setPhone}
          onFocus={onFirstInteract}
          onPaste={() => markCopyPaste("sdt")}
          placeholder={field("phone", "Số điện thoại (Zalo) — 10 số")}
          className={inputClass}
        />
        <input
          type="email"
          maxLength={255}
          value={form.email}
          onChange={set("email")}
          onFocus={onFirstInteract}
          placeholder={field("email", "Email (không bắt buộc)")}
          className={inputClass}
        />
        <select
          required
          value={form.province}
          onChange={set("province")}
          className={inputClass}
        >
          <option value="">{field("city", "Tỉnh/Thành phố")}</option>
          {PROVINCE_GROUPS.map((g) => (
            <optgroup key={g.region} label={g.region}>
              {g.provinces.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <select
          required
          value={form.major}
          onChange={setMajor}
          className={inputClass}
        >
          <option value="">{field("major", "Ngành quan tâm")}</option>
          {MAJORS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {status === "error" && error && (
        <p className="mt-3 text-sm font-medium text-destructive" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        aria-busy={status === "sending"}
        className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-6 py-4 text-base font-extrabold uppercase tracking-wide text-primary-foreground shadow-[var(--shadow-cta)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 sm:text-lg"
      >
        {status === "sending" && (
          <span
            aria-hidden="true"
            className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground"
          />
        )}
        {status === "sending"
          ? "Đang gửi..."
          : config.form.ctaLabel || "Gửi đăng ký — Nhận lộ trình 0Đ"}
      </button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Thông tin của bạn được bảo mật, chỉ dùng để tư vấn hướng nghiệp.
      </p>
    </form>
  );
}
