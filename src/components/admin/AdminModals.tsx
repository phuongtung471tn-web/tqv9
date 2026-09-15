import { checkEmailConfig, sendTestEmail } from "@/lib/email.functions";
import { Download, GraduationCap, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState, type ReactElement } from "react";

import { useAdmin, type AdminModalKey } from "@/lib/use-admin";
import { DEFAULT_CONFIG } from "@/config/site-config";
import { useSiteConfig } from "@/lib/use-site-config";
import {
  clearLeads,
  clearAnalytics,
  ANALYTICS_UPDATED_EVENT,
  LEAD_CREATED_EVENT,
  exportLeadsCsv,
  loadAnalytics,
  loadLeads,
  saveLead,
  testSupabaseConnection,
  type AnalyticsState,
  type LeadRecord,
} from "@/services/dataAdapter";
import { fireTestEvent, type TestEventLog } from "@/lib/tracking";
import {
  testWebhookEndpoint,
  webhookConfigurationWarning,
  type WebhookResult,
} from "@/services/webhooks";
import { getVariant, resetVariant } from "@/lib/ab";
import {
  AdminModal,
  Field,
  Stat,
  TextArea,
  TextInput,
  Toggle,
} from "./adminUi";

export function AdminModals() {
  const { activeModal, closeModal } = useAdmin();
  if (!activeModal) return null;
  const Body = REGISTRY[activeModal];
  return <Body onClose={closeModal} />;
}

type ModalProps = { onClose: () => void };

/* ------------------------------- FOMO ------------------------------------ */
function FomoModal({ onClose }: ModalProps) {
  const { config, update } = useSiteConfig();
  const f = config.fomo;
  return (
    <AdminModal
      title="Thông Báo FOMO"
      subtitle="Popup 'khách vừa đăng ký' kích thích tâm lý đám đông"
      onClose={onClose}
    >
      <Toggle
        checked={f.enabled}
        onChange={(v) => update((d) => (d.fomo.enabled = v))}
        label="Bật thông báo FOMO"
      />
      <Field
        label="Nguồn dữ liệu"
        hint="Khuyến nghị dùng lead thật để tránh hiển thị thông tin gây hiểu nhầm."
      >
        <div className="flex gap-2">
          {(["recentLeads", "sample"] as const).map((source) => (
            <button
              key={source}
              type="button"
              onClick={() => update((d) => (d.fomo.source = source))}
              className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold ${
                f.source === source
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-300"
              }`}
            >
              {source === "recentLeads" ? "Lead thật" : "Mẫu minh họa"}
            </button>
          ))}
        </div>
      </Field>
      <Toggle
        checked={f.respectReducedMotion}
        onChange={(v) => update((d) => (d.fomo.respectReducedMotion = v))}
        label="Tắt chuyển động khi người dùng yêu cầu giảm motion"
      />
      <Field label="Mẫu nội dung" hint="Dùng {name}, {city}, {mins}">
        <TextInput
          value={f.template}
          onChange={(e) => update((d) => (d.fomo.template = e.target.value))}
        />
      </Field>
      <Field label="Danh sách tên khách (mỗi dòng 1 tên)">
        <TextArea
          value={f.names.join("\n")}
          onChange={(e) =>
            update(
              (d) =>
                (d.fomo.names = e.target.value.split("\n").filter(Boolean)),
            )
          }
        />
      </Field>
      <Field label="Danh sách tỉnh/thành (mỗi dòng 1 địa danh)">
        <TextArea
          value={f.cities.join("\n")}
          onChange={(e) =>
            update(
              (d) =>
                (d.fomo.cities = e.target.value.split("\n").filter(Boolean)),
            )
          }
        />
      </Field>
      <div className="grid grid-cols-3 gap-2">
        <Field label="Trễ tối thiểu (s)">
          <TextInput
            type="number"
            value={f.minDelaySec}
            onChange={(e) =>
              update((d) => (d.fomo.minDelaySec = +e.target.value))
            }
          />
        </Field>
        <Field label="Trễ tối đa (s)">
          <TextInput
            type="number"
            value={f.maxDelaySec}
            onChange={(e) =>
              update((d) => (d.fomo.maxDelaySec = +e.target.value))
            }
          />
        </Field>
        <Field label="Hiển thị (s)">
          <TextInput
            type="number"
            value={f.displaySec}
            onChange={(e) =>
              update((d) => (d.fomo.displaySec = +e.target.value))
            }
          />
        </Field>
      </div>
      <Field label="Vị trí">
        <div className="flex gap-2">
          {(["left", "right"] as const).map((p) => (
            <button
              key={p}
              onClick={() => update((d) => (d.fomo.position = p))}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold ${
                f.position === p
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-300"
              }`}
            >
              {p === "left" ? "Góc trái" : "Góc phải"}
            </button>
          ))}
        </div>
      </Field>
      <SaveHint />
    </AdminModal>
  );
}

/* ------------------------------- FORM ------------------------------------ */
function FormModal({ onClose }: ModalProps) {
  const { config, update } = useSiteConfig();
  const form = config.form;
  return (
    <AdminModal
      title="Form & Webhook"
      subtitle="Tùy chỉnh nội dung form và kết nối gửi lead"
      onClose={onClose}
    >
      <Field label="Tiêu đề form">
        <TextInput
          value={form.headline}
          onChange={(e) => update((d) => (d.form.headline = e.target.value))}
        />
      </Field>
      <Field label="Chữ trên nút CTA">
        <TextInput
          value={form.ctaLabel}
          onChange={(e) => update((d) => (d.form.ctaLabel = e.target.value))}
        />
      </Field>
      <Field
        label="Webhook URL (Make/Zapier)"
        hint="Giữ nguyên URL đang chạy để không đứt kết nối"
      >
        <TextInput
          value={form.webhookUrl}
          onChange={(e) => update((d) => (d.form.webhookUrl = e.target.value))}
        />
      </Field>
      <Field label="Redirect sau khi gửi (tùy chọn)">
        <TextInput
          value={form.redirectUrl}
          onChange={(e) => update((d) => (d.form.redirectUrl = e.target.value))}
        />
      </Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Giới hạn số lần gửi">
          <TextInput
            type="number"
            value={form.rateLimitCount}
            onChange={(e) =>
              update((d) => (d.form.rateLimitCount = +e.target.value))
            }
          />
        </Field>
        <Field label="Trong khoảng (phút)">
          <TextInput
            type="number"
            value={form.rateLimitWindowMin}
            onChange={(e) =>
              update((d) => (d.form.rateLimitWindowMin = +e.target.value))
            }
          />
        </Field>
      </div>
      <p className="mb-2 text-xs font-semibold text-neutral-700">
        Nhãn & placeholder các trường
      </p>
      {form.fields.map((field, i) => (
        <div
          key={field.name}
          className="mb-2 grid grid-cols-2 gap-2 rounded-lg border border-neutral-200 p-2"
        >
          <TextInput
            value={field.label}
            onChange={(e) =>
              update((d) => (d.form.fields[i]!.label = e.target.value))
            }
            placeholder="Label"
          />
          <TextInput
            value={field.placeholder}
            onChange={(e) =>
              update((d) => (d.form.fields[i]!.placeholder = e.target.value))
            }
            placeholder="Placeholder"
          />
        </div>
      ))}
      <p className="mt-1 text-[11px] text-neutral-400">
        Dropdown 63 tỉnh/thành (phân theo Miền) và danh sách ngành được giữ
        nguyên trong form.
      </p>
      <SaveHint />
    </AdminModal>
  );
}

/* ------------------------------ THEME ------------------------------------ */
function ThemeModal({ onClose }: ModalProps) {
  const { config, update } = useSiteConfig();
  const t = config.theme;
  return (
    <AdminModal
      title="Style & Theme"
      subtitle="Màu sắc & font hiển thị"
      onClose={onClose}
    >
      <div className="grid grid-cols-2 gap-2">
        <Field label="Màu chính (primary)">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={t.primary}
              onChange={(e) =>
                update((d) => (d.theme.primary = e.target.value))
              }
              className="h-9 w-12 rounded border border-neutral-300"
            />
            <TextInput
              value={t.primary}
              onChange={(e) =>
                update((d) => (d.theme.primary = e.target.value))
              }
            />
          </div>
        </Field>
        <Field label="Màu nhấn (gold)">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={t.gold}
              onChange={(e) => update((d) => (d.theme.gold = e.target.value))}
              className="h-9 w-12 rounded border border-neutral-300"
            />
            <TextInput
              value={t.gold}
              onChange={(e) => update((d) => (d.theme.gold = e.target.value))}
            />
          </div>
        </Field>
      </div>
      <Field label="Font tiêu đề">
        <TextInput
          value={t.fontHeading}
          onChange={(e) =>
            update((d) => (d.theme.fontHeading = e.target.value))
          }
        />
      </Field>
      <Field label="Font nội dung">
        <TextInput
          value={t.fontBody}
          onChange={(e) => update((d) => (d.theme.fontBody = e.target.value))}
        />
      </Field>
      <p className="text-[11px] text-neutral-400">
        Màu và font này được áp dụng chung cho trang chủ, trang phụ và các khối
        nội dung.
      </p>
      <SaveHint />
    </AdminModal>
  );
}

/* ---------------------------- COUNTDOWN ---------------------------------- */
function CountdownModal({ onClose }: ModalProps) {
  const { config, update } = useSiteConfig();
  const c = config.countdown;
  return (
    <AdminModal
      title="Đồng Hồ Đếm Ngược"
      subtitle="Tạo cảm giác khan hiếm & khẩn cấp"
      onClose={onClose}
    >
      <Toggle
        checked={c.enabled}
        onChange={(v) => update((d) => (d.countdown.enabled = v))}
        label="Bật countdown"
      />
      <Field label="Số suất còn lại">
        <TextInput
          type="number"
          value={c.slotsLeft}
          onChange={(e) =>
            update((d) => (d.countdown.slotsLeft = +e.target.value))
          }
        />
      </Field>
      <Field label="Dòng chữ mô tả">
        <TextInput
          value={c.headline}
          onChange={(e) =>
            update((d) => (d.countdown.headline = e.target.value))
          }
        />
      </Field>
      <Field label="Mốc kết thúc">
        <div className="flex gap-2">
          {(["endOfMonth", "fixed"] as const).map((m) => (
            <button
              key={m}
              onClick={() => update((d) => (d.countdown.endMode = m))}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold ${
                c.endMode === m
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-300"
              }`}
            >
              {m === "endOfMonth" ? "Cuối tháng" : "Ngày cố định"}
            </button>
          ))}
        </div>
      </Field>
      {c.endMode === "fixed" && (
        <Field label="Ngày kết thúc">
          <TextInput
            type="datetime-local"
            value={c.endDate}
            onChange={(e) =>
              update((d) => (d.countdown.endDate = e.target.value))
            }
          />
        </Field>
      )}
      <SaveHint />
    </AdminModal>
  );
}

/* ---------------------------- CONTACT ------------------------------------ */
function ContactModal({ onClose }: ModalProps) {
  const { config, update } = useSiteConfig();
  const c = config.floatingContact;
  return (
    <AdminModal
      title="Hotline & Zalo"
      subtitle="Nút liên hệ nổi + thanh CTA mobile"
      onClose={onClose}
    >
      <Toggle
        checked={c.enabled}
        onChange={(v) => update((d) => (d.floatingContact.enabled = v))}
        label="Bật nút liên hệ nổi"
      />
      <Toggle
        checked={c.animateHotline !== false}
        onChange={(v) => update((d) => (d.floatingContact.animateHotline = v))}
        label="Hiệu ứng nút gọi hotline"
      />
      <Toggle
        checked={c.animateMessenger !== false}
        onChange={(v) =>
          update((d) => (d.floatingContact.animateMessenger = v))
        }
        label="Hiệu ứng nút Messenger"
      />
      <Field label="Số hotline">
        <TextInput
          value={c.hotline}
          onChange={(e) =>
            update((d) => (d.floatingContact.hotline = e.target.value))
          }
        />
      </Field>
      <Field label="Link Zalo">
        <TextInput
          value={c.zalo}
          onChange={(e) =>
            update((d) => (d.floatingContact.zalo = e.target.value))
          }
        />
      </Field>
      <Field label="Link Messenger (tùy chọn)">
        <TextInput
          value={c.messenger}
          onChange={(e) =>
            update((d) => (d.floatingContact.messenger = e.target.value))
          }
        />
      </Field>
      <SaveHint />
    </AdminModal>
  );
}

/* ----------------------------- TRACKING / PIXEL --------------------------- */
function PixelModal({ onClose }: ModalProps) {
  const { config, update } = useSiteConfig();
  const t = config.tracking;
  const [logs, setLogs] = useState<TestEventLog[] | null>(null);
  return (
    <AdminModal
      title="Pixel & Sự Kiện Ads"
      subtitle="Facebook, TikTok, GA4, GTM"
      onClose={onClose}
    >
      <Field label="Facebook Pixel ID">
        <TextInput
          value={t.facebookPixelId}
          onChange={(e) =>
            update((d) => (d.tracking.facebookPixelId = e.target.value))
          }
        />
      </Field>
      <Field label="TikTok Pixel ID">
        <TextInput
          value={t.tiktokPixelId}
          onChange={(e) =>
            update((d) => (d.tracking.tiktokPixelId = e.target.value))
          }
        />
      </Field>
      <Field
        label="TikTok Events API Access Token"
        hint="Chỉ dùng ở backend/server; không nhúng token vào mã trình duyệt."
      >
        <TextInput
          type="password"
          value={t.tiktokAccessToken}
          autoComplete="new-password"
          onChange={(e) =>
            update((d) => (d.tracking.tiktokAccessToken = e.target.value))
          }
        />
      </Field>
      <Field label="GA4 Measurement ID">
        <TextInput
          value={t.ga4Id}
          onChange={(e) => update((d) => (d.tracking.ga4Id = e.target.value))}
        />
      </Field>
      <Field label="Google Tag Manager ID">
        <TextInput
          value={t.gtmId}
          onChange={(e) => update((d) => (d.tracking.gtmId = e.target.value))}
        />
      </Field>
      <p className="mb-2 text-xs font-semibold text-neutral-700">
        Bật/tắt sự kiện chuyển đổi
      </p>
      <Toggle
        checked={t.events.pageView}
        onChange={(v) => update((d) => (d.tracking.events.pageView = v))}
        label="PageView"
      />
      <Toggle
        checked={t.events.formStart}
        onChange={(v) => update((d) => (d.tracking.events.formStart = v))}
        label="Form Start"
      />
      <Toggle
        checked={t.events.lead}
        onChange={(v) => update((d) => (d.tracking.events.lead = v))}
        label="Lead"
      />
      <Toggle
        checked={t.events.completeRegistration}
        onChange={(v) =>
          update((d) => (d.tracking.events.completeRegistration = v))
        }
        label="CompleteRegistration"
      />
      <Toggle
        checked={t.events.click !== false}
        onChange={(v) => update((d) => (d.tracking.events.click = v))}
        label="Click CTA / Hotline / Zalo / Messenger"
      />
      <Toggle
        checked={t.events.scroll !== false}
        onChange={(v) => update((d) => (d.tracking.events.scroll = v))}
        label="Scroll depth 25 / 50 / 75 / 90%"
      />
      <div className="mt-4 rounded-xl border border-neutral-200 p-3 dark:border-white/10">
        <button
          onClick={() => setLogs(fireTestEvent())}
          className="w-full rounded-lg bg-neutral-900 py-2.5 text-sm font-bold text-white dark:bg-white dark:text-neutral-900"
        >
          Kiểm tra / Bắn sự kiện thử
        </button>
        <p className="mt-2 text-[11px] text-neutral-400">
          Lưu cấu hình, tải lại trang rồi kiểm tra. Sự kiện thử không phải là
          chuyển đổi thật và không gửi lead.
        </p>
        <ol className="mt-3 list-decimal space-y-1 pl-4 text-[11px] text-neutral-500">
          <li>Meta: lấy Pixel ID trong Events Manager.</li>
          <li>
            TikTok: lấy Pixel ID trong Events Manager; Access Token chỉ cấu hình
            ở server.
          </li>
          <li>GA4: dùng Measurement ID dạng G-XXXXXXXXXX.</li>
          <li>GTM: dùng Container ID dạng GTM-XXXXXXX rồi kiểm tra Preview.</li>
          <li>Dùng nút kiểm tra, xem log Admin và DebugView/Test Events.</li>
        </ol>
        {logs && (
          <ul className="mt-3 space-y-1.5">
            {logs.map((l) => (
              <li
                key={l.channel}
                className="flex items-start gap-2 text-[11px]"
              >
                <span className={l.ok ? "text-emerald-500" : "text-red-500"}>
                  {l.ok ? "●" : "○"}
                </span>
                <span>
                  <strong>{l.channel}</strong> — {l.detail}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <SaveHint />
    </AdminModal>
  );
}

/* ------------------------- WEBMASTER / SCRIPTS ---------------------------- */
function WebmasterModal({ onClose }: ModalProps) {
  const { config, update } = useSiteConfig();
  const t = config.tracking;
  const [logs, setLogs] = useState<TestEventLog[] | null>(null);
  return (
    <AdminModal
      title="Webmaster & Custom Scripts"
      subtitle="Pixel, tracking, xác minh Google và mã tùy chỉnh"
      onClose={onClose}
    >
      <p className="mb-3 rounded-lg bg-sky-50 px-3 py-2 text-[11px] leading-relaxed text-sky-800">
        Cấu hình Pixel, sự kiện quảng cáo và kiểm tra tracking nằm ở mục
        <strong> Pixel &amp; Sự Kiện Ads</strong> trong toolbar. Tránh chỉnh
        trùng lặp ở hai nơi khác nhau.
      </p>
      <Field label="Google Search Console verification">
        <TextInput
          value={t.googleVerification}
          onChange={(e) =>
            update((d) => (d.tracking.googleVerification = e.target.value))
          }
        />
      </Field>
      <Field label="Custom Script — Head">
        <TextArea
          value={t.customHead}
          onChange={(e) =>
            update((d) => (d.tracking.customHead = e.target.value))
          }
        />
      </Field>
      <Field label="Custom Script — Body">
        <TextArea
          value={t.customBody}
          onChange={(e) =>
            update((d) => (d.tracking.customBody = e.target.value))
          }
        />
      </Field>
      <Field label="Custom Script — Footer">
        <TextArea
          value={t.customFooter}
          onChange={(e) =>
            update((d) => (d.tracking.customFooter = e.target.value))
          }
        />
      </Field>
      <SaveHint />
    </AdminModal>
  );
}

/* -------------------------------- SEO ------------------------------------ */
function SeoModal({ onClose }: ModalProps) {
  const { config, update } = useSiteConfig();
  const s = config.seo;
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const titleLength = s.title.length;
  const descriptionLength = s.description.length;
  return (
    <AdminModal
      title="SEO Google"
      subtitle="Meta tags & schema"
      onClose={onClose}
    >
      <Field label="Meta Title">
        <TextInput
          value={s.title}
          onChange={(e) => update((d) => (d.seo.title = e.target.value))}
        />
      </Field>
      <p
        className={`text-[11px] ${titleLength > 60 ? "text-amber-600" : "text-neutral-400"}`}
      >
        Meta Title: {titleLength}/60 ký tự
      </p>
      <Field label="Meta Description">
        <TextArea
          value={s.description}
          onChange={(e) => update((d) => (d.seo.description = e.target.value))}
        />
      </Field>
      <p
        className={`text-[11px] ${descriptionLength > 160 ? "text-amber-600" : "text-neutral-400"}`}
      >
        Meta Description: {descriptionLength}/160 ký tự
      </p>
      <Field label="Keywords">
        <TextInput
          value={s.keywords}
          onChange={(e) => update((d) => (d.seo.keywords = e.target.value))}
        />
      </Field>
      <Field label="OG Image URL">
        <TextInput
          value={s.ogImage}
          onChange={(e) => update((d) => (d.seo.ogImage = e.target.value))}
        />
      </Field>
      <Field
        label="Favicon URL hoặc ảnh tải lên"
        hint="Dùng .ico/.png/.svg; ảnh tải lên tối đa 512KB."
      >
        <div className="space-y-2">
          <TextInput
            value={s.faviconUrl}
            placeholder="/favicon.ico hoặc https://..."
            onChange={(e) => update((d) => (d.seo.faviconUrl = e.target.value))}
          />
          <input
            ref={faviconInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml,image/x-icon"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file || file.size > 512 * 1024) return;
              const reader = new FileReader();
              reader.onload = () => {
                if (typeof reader.result === "string")
                  update((d) => (d.seo.faviconUrl = reader.result as string));
              };
              reader.readAsDataURL(file);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => faviconInputRef.current?.click()}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-xs font-bold"
          >
            Chọn favicon
          </button>
        </div>
      </Field>
      <Field label="Schema Type">
        <TextInput
          value={s.schemaType}
          onChange={(e) => update((d) => (d.seo.schemaType = e.target.value))}
        />
      </Field>
      <SaveHint />
    </AdminModal>
  );
}

/* ------------------------------- AI --------------------------------------- */
function AiModal({ onClose }: ModalProps) {
  const { config, update } = useSiteConfig();
  const a = config.aiAdvisor;
  return (
    <AdminModal
      title="AI Sales Advisor"
      subtitle="Ma trận chấm điểm & phân hạng lead"
      onClose={onClose}
    >
      <Toggle
        checked={a.enabled}
        onChange={(v) => update((d) => (d.aiAdvisor.enabled = v))}
        label="Bật gợi ý AI Sales"
      />
      <Field label="Regex nhận diện thiết bị VIP">
        <TextInput
          value={a.vipDeviceRegex}
          onChange={(e) =>
            update((d) => (d.aiAdvisor.vipDeviceRegex = e.target.value))
          }
        />
      </Field>
      <Field label="Tỉnh trọng điểm (phân tách bằng |)">
        <TextInput
          value={a.keyRegions}
          onChange={(e) =>
            update((d) => (d.aiAdvisor.keyRegions = e.target.value))
          }
        />
      </Field>
      <div className="grid grid-cols-3 gap-2">
        <Field label="Điền nhanh (<s) = bot">
          <TextInput
            type="number"
            value={a.fastFillThresholdSec}
            onChange={(e) =>
              update(
                (d) => (d.aiAdvisor.fastFillThresholdSec = +e.target.value),
              )
            }
          />
        </Field>
        <Field label="VIP: xem web (s)">
          <TextInput
            type="number"
            value={a.vipTimeOnPageSec}
            onChange={(e) =>
              update((d) => (d.aiAdvisor.vipTimeOnPageSec = +e.target.value))
            }
          />
        </Field>
        <Field label="VIP: cuộn (%)">
          <TextInput
            type="number"
            value={a.vipScrollPercent}
            onChange={(e) =>
              update((d) => (d.aiAdvisor.vipScrollPercent = +e.target.value))
            }
          />
        </Field>
      </div>
      <SaveHint />
    </AdminModal>
  );
}

/* ------------------------------ EMAIL ------------------------------------- */
function EmailModal({ onClose }: ModalProps) {
  const { config, update } = useSiteConfig();
  const e = config.emailAutomation;
  const [testState, setTestState] = useState<
    "idle" | "testing" | "ok" | "error"
  >("idle");
  const [testMessage, setTestMessage] = useState("");
  const [testTo, setTestTo] = useState("");
  const validFrom = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.fromEmail);
  return (
    <AdminModal
      title="Tự Động Hóa Email"
      subtitle="Gửi email cảm ơn ngay khi có lead"
      onClose={onClose}
    >
      <Toggle
        checked={e.enabled}
        onChange={(v) => update((d) => (d.emailAutomation.enabled = v))}
        label="Bật auto email"
      />
      <Field label="Nhà cung cấp">
        <div className="flex gap-2">
          {(["resend", "gmail"] as const).map((p) => (
            <button
              key={p}
              onClick={() => update((d) => (d.emailAutomation.provider = p))}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold uppercase ${
                e.provider === p
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-300"
              }`}
            >
              {p === "gmail" ? "Gmail OAuth2" : "Resend"}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Email gửi đi (From)">
        <TextInput
          value={e.fromEmail}
          onChange={(ev) =>
            update((d) => (d.emailAutomation.fromEmail = ev.target.value))
          }
        />
      </Field>
      <p
        className={`mb-3 text-xs ${validFrom ? "text-emerald-600" : "text-amber-600"}`}
      >
        {validFrom ? "Địa chỉ From hợp lệ." : "Cần nhập email From hợp lệ."}
      </p>
      <Field
        label="Email nhận test"
        hint="Chỉ dùng để gửi email kiểm tra, không lưu secret."
      >
        <TextInput
          type="email"
          value={testTo}
          onChange={(event) => setTestTo(event.target.value)}
          placeholder="ban@example.com"
        />
      </Field>
      <Field label="Tiêu đề" hint="Dùng {name} {phone} {city} {ai_score}">
        <TextInput
          value={e.subject}
          onChange={(ev) =>
            update((d) => (d.emailAutomation.subject = ev.target.value))
          }
        />
      </Field>
      <Field label="Nội dung">
        <TextArea
          value={e.body}
          onChange={(ev) =>
            update((d) => (d.emailAutomation.body = ev.target.value))
          }
        />
      </Field>
      <div className="mb-3 rounded-lg bg-sky-50 px-3 py-2 text-[11px] leading-relaxed text-sky-800">
        <strong>Resend:</strong> tạo API key tại resend.com/api-keys, xác thực
        domain rồi đặt <code>RESEND_API_KEY</code> trên server.
        <br />
        <strong>Gmail:</strong> tạo OAuth Client trong Google Cloud, bật Gmail
        API và lấy refresh token; đặt <code>GMAIL_CLIENT_ID</code>,{" "}
        <code>GMAIL_CLIENT_SECRET</code>, <code>GMAIL_REFRESH_TOKEN</code> trên
        server. Runtime Cloudflare dùng Gmail API OAuth2, không dùng SMTP TCP
        trực tiếp.
      </div>
      <button
        type="button"
        disabled={
          !validFrom ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testTo) ||
          testState === "testing"
        }
        onClick={() => {
          setTestState("testing");
          void checkEmailConfig()
            .then((result) => {
              const configured =
                e.provider === "gmail"
                  ? result.gmailConfigured
                  : result.resendConfigured;
              if (!configured)
                throw new Error(
                  e.provider === "gmail"
                    ? "Thiếu GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET hoặc GMAIL_REFRESH_TOKEN."
                    : "Thiếu RESEND_API_KEY.",
                );
              return sendTestEmail({
                data: {
                  provider: e.provider,
                  to: testTo,
                  from: e.fromEmail,
                  subject: "Email test từ Funnel Builder",
                  text: "Đây là email kiểm tra cấu hình tự động hóa email.",
                },
              });
            })
            .then((result) => {
              setTestState(result.sent ? "ok" : "error");
              setTestMessage(
                result.sent
                  ? "Đã gửi email test thành công."
                  : `Gửi email test thất bại: ${result.reason}`,
              );
            })
            .catch((error: unknown) => {
              setTestState("error");
              setTestMessage(
                error instanceof Error
                  ? error.message
                  : "Không gọi được email server.",
              );
            });
        }}
        className="w-full rounded-lg border border-neutral-300 py-2.5 text-xs font-bold disabled:opacity-40"
      >
        {testState === "testing"
          ? "Đang kiểm tra..."
          : "Kiểm tra cấu hình email"}
      </button>
      {testState !== "idle" && testState !== "testing" && (
        <p
          className={`mt-2 text-xs font-semibold ${testState === "ok" ? "text-emerald-600" : "text-red-600"}`}
        >
          {testMessage}
        </p>
      )}
      <SaveHint />
    </AdminModal>
  );
}

/* ------------------------------ WEBHOOK HUB ------------------------------- */
function WebhookModal({ onClose }: ModalProps) {
  const { config, update } = useSiteConfig();
  const list = config.webhooks;
  const [testingId, setTestingId] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, WebhookResult>>({});
  const enabledCount = list.filter(
    (endpoint) => endpoint.enabled && endpoint.url.trim(),
  ).length;
  return (
    <AdminModal
      title="Cổng Webhook & Đa Kênh"
      subtitle="Gửi lead tới nhiều nơi cùng lúc"
      onClose={onClose}
    >
      <p className="mb-3 rounded-lg bg-sky-50 px-3 py-2 text-[11px] leading-relaxed text-sky-800">
        Tiêu đề form, nhãn nút CTA, webhook chính và giới hạn gửi nằm ở mục
        <strong> Form &amp; Webhook</strong> trong toolbar. UTM được đọc tự động
        từ URL quảng cáo và gửi trong các trường
        <strong> traffic_ads_source</strong>, <strong>utm_source</strong>,
        <strong> utm_campaign</strong> của lead.
      </p>
      <div className="mb-3 rounded-lg bg-neutral-50 p-3 text-xs text-neutral-600">
        <p className="font-bold text-neutral-800">Cách vận hành</p>
        <p className="mt-1">
          Mỗi lead được gửi song song tới {enabledCount} endpoint đang bật. Một
          endpoint lỗi không làm mất lead trong Mini-CRM.
        </p>
        <p className="mt-1">
          Hãy bấm test sau khi nhập URL. Trình duyệt có thể chặn endpoint không
          bật CORS; khi đó nên dùng Make/Zapier làm cổng trung gian.
        </p>
      </div>
      <div className="mb-3 rounded-xl border border-neutral-200 p-3 dark:border-white/10">
        <p className="mb-1 text-xs font-bold text-neutral-800">
          AI Sales Advisor & kịch bản gọi
        </p>
        <p className="mb-3 text-[11px] text-neutral-500">
          AI dùng hành vi tracking đã thu thập để chấm điểm, phân loại và gợi ý
          cách gọi. Kết quả được gửi cùng payload webhook và lưu trong Mini-CRM.
        </p>
        <Toggle
          checked={config.aiAdvisor.enabled}
          onChange={(value) =>
            update((draft) => (draft.aiAdvisor.enabled = value))
          }
          label="Bật AI Sales Advisor"
        />
        {config.aiAdvisor.enabled && (
          <div className="mt-3 space-y-3">
            <Field label="Regex thiết bị ưu tiên">
              <TextInput
                value={config.aiAdvisor.vipDeviceRegex}
                onChange={(event) =>
                  update(
                    (draft) =>
                      (draft.aiAdvisor.vipDeviceRegex = event.target.value),
                  )
                }
              />
            </Field>
            <Field label="Tỉnh trọng điểm, phân tách bằng |">
              <TextInput
                value={config.aiAdvisor.keyRegions}
                onChange={(event) =>
                  update(
                    (draft) =>
                      (draft.aiAdvisor.keyRegions = event.target.value),
                  )
                }
              />
            </Field>
            <div className="grid grid-cols-3 gap-2">
              <Field label="Điền nhanh (s)">
                <TextInput
                  type="number"
                  min="1"
                  value={config.aiAdvisor.fastFillThresholdSec}
                  onChange={(event) =>
                    update(
                      (draft) =>
                        (draft.aiAdvisor.fastFillThresholdSec = Math.max(
                          1,
                          Number(event.target.value) || 1,
                        )),
                    )
                  }
                />
              </Field>
              <Field label="VIP: thời gian (s)">
                <TextInput
                  type="number"
                  min="1"
                  value={config.aiAdvisor.vipTimeOnPageSec}
                  onChange={(event) =>
                    update(
                      (draft) =>
                        (draft.aiAdvisor.vipTimeOnPageSec = Math.max(
                          1,
                          Number(event.target.value) || 1,
                        )),
                    )
                  }
                />
              </Field>
              <Field label="VIP: cuộn (%)">
                <TextInput
                  type="number"
                  min="1"
                  max="100"
                  value={config.aiAdvisor.vipScrollPercent}
                  onChange={(event) =>
                    update(
                      (draft) =>
                        (draft.aiAdvisor.vipScrollPercent = Math.min(
                          100,
                          Math.max(1, Number(event.target.value) || 1),
                        )),
                    )
                  }
                />
              </Field>
            </div>
          </div>
        )}
      </div>
      {list.length === 0 && (
        <p className="mb-3 text-xs text-neutral-400">
          Chưa có endpoint nào. Thêm mới bên dưới.
        </p>
      )}
      {list.map((w, i) => (
        <div
          key={w.id}
          className="mb-2 rounded-lg border border-neutral-200 p-2"
        >
          <div className="mb-2 flex items-center gap-2">
            <TextInput
              value={w.label}
              placeholder="Tên"
              onChange={(e) =>
                update((d) => (d.webhooks[i]!.label = e.target.value))
              }
            />
            <select
              value={w.type}
              onChange={(e) =>
                update(
                  (d) =>
                    (d.webhooks[i]!.type = e.target.value as typeof w.type),
                )
              }
              className="rounded-lg border border-neutral-300 px-2 py-2 text-sm"
            >
              <option value="make">Make/Zapier</option>
              <option value="telegram">Telegram</option>
              <option value="sheets">Google Sheets</option>
              <option value="supabase">Supabase</option>
              <option value="custom">Custom</option>
            </select>
            <button
              onClick={() => update((d) => d.webhooks.splice(i, 1))}
              className="rounded-md p-2 text-red-500 hover:bg-red-50"
              aria-label="Xóa"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <TextInput
            value={w.url}
            placeholder="https://..."
            onChange={(e) =>
              update((d) => (d.webhooks[i]!.url = e.target.value))
            }
          />
          {webhookConfigurationWarning(w, config) && (
            <p className="mt-1 text-[11px] font-semibold text-amber-600">
              Cảnh báo: {webhookConfigurationWarning(w, config)}
            </p>
          )}
          <div className="mt-2">
            <Toggle
              checked={w.enabled}
              onChange={(v) => update((d) => (d.webhooks[i]!.enabled = v))}
              label="Kích hoạt"
            />
          </div>
          <button
            type="button"
            disabled={!w.url.trim() || testingId === w.id}
            onClick={() => {
              setTestingId(w.id);
              void testWebhookEndpoint(w, config)
                .then((result) =>
                  setResults((current) => ({ ...current, [w.id]: result })),
                )
                .finally(() => setTestingId(null));
            }}
            className="mt-2 w-full rounded-lg border border-neutral-300 py-2 text-xs font-bold disabled:opacity-40"
          >
            {testingId === w.id ? "Đang gửi test..." : "Gửi test endpoint"}
          </button>
          {results[w.id] && (
            <p
              className={`mt-1 text-[11px] font-semibold ${results[w.id]!.ok ? "text-emerald-600" : "text-red-600"}`}
            >
              {results[w.id]!.ok
                ? `OK sau ${results[w.id]!.attempts} lần thử`
                : `Lỗi: ${results[w.id]!.detail}`}
            </p>
          )}
          <p className="mt-1 text-[10px] text-neutral-400">
            {w.type === "telegram" && "Telegram: dùng URL Bot API kèm chat_id."}
            {w.type === "supabase" &&
              "Supabase: dùng tên bảng trong URL, ví dụ leads."}
            {(w.type === "make" ||
              w.type === "sheets" ||
              w.type === "custom") &&
              "Endpoint phải nhận POST JSON và cho phép CORS từ landing page."}
          </p>
        </div>
      ))}
      <button
        onClick={() =>
          update((d) =>
            d.webhooks.push({
              id: `wh_${Date.now()}`,
              label: "Endpoint mới",
              url: "",
              enabled: true,
              type: "make",
            }),
          )
        }
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-neutral-300 py-2.5 text-sm font-semibold text-neutral-600"
      >
        <Plus className="h-4 w-4" /> Thêm Webhook
      </button>
      <SaveHint />
    </AdminModal>
  );
}

/* ------------------------------ ANALYTICS --------------------------------- */
function AnalyticsModal({ onClose }: ModalProps) {
  const [a, setA] = useState<AnalyticsState | null>(null);
  useEffect(() => {
    const refresh = () => setA(loadAnalytics());
    refresh();
    window.addEventListener(ANALYTICS_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(ANALYTICS_UPDATED_EVENT, refresh);
  }, []);
  const cr =
    a && a.visits > 0 ? ((a.leads / a.visits) * 100).toFixed(1) : "0.0";
  return (
    <AdminModal
      title="Thống Kê & Analytics"
      subtitle="Số liệu thời gian thực (local)"
      onClose={onClose}
    >
      <div className="mb-3 flex justify-end">
        <button
          type="button"
          onClick={() => {
            if (
              window.confirm("Xóa toàn bộ số liệu Analytics trên thiết bị này?")
            )
              clearAnalytics();
          }}
          className="rounded-lg border border-red-200 px-3 py-1.5 text-[11px] font-bold text-red-600"
        >
          Xóa số liệu test
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Stat label="Lượt truy cập" value={a?.visits ?? 0} />
        <Stat
          label="Lượt đăng ký"
          value={a?.leads ?? 0}
          tone="text-emerald-600"
        />
        <Stat label="Tỷ lệ CR" value={`${cr}%`} tone="text-red-600" />
      </div>
      <p className="mb-2 mt-4 text-xs font-semibold text-neutral-700">
        Nguồn traffic (UTM)
      </p>
      <div className="space-y-1">
        {a && Object.keys(a.bySourceStats).length > 0 ? (
          Object.entries(a.bySourceStats).map(([s, stats]) => (
            <div
              key={s}
              className="flex justify-between rounded-lg bg-neutral-100 px-3 py-1.5 text-xs dark:bg-white/5"
            >
              <span className="font-medium">{s}</span>
              <span className="tabular-nums">
                {stats.visits} visits · {stats.leads} leads ·{" "}
                {stats.visits
                  ? ((stats.leads / stats.visits) * 100).toFixed(1)
                  : "0.0"}
                % CR
              </span>
            </div>
          ))
        ) : (
          <p className="text-xs text-neutral-400">Chưa có dữ liệu.</p>
        )}
      </div>
      <p className="mb-2 mt-4 text-xs font-semibold text-neutral-700">
        So sánh A/B
      </p>
      {a && Object.keys(a.byVariant).length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(a.byVariant).map(([v, s]) => (
            <div
              key={v}
              className="rounded-lg border border-neutral-200 p-2 text-xs dark:border-white/10"
            >
              <div className="font-bold">{v}</div>
              <div>Visits: {s.visits}</div>
              <div>Leads: {s.leads}</div>
              <div>
                CR: {s.visits ? ((s.leads / s.visits) * 100).toFixed(1) : "0"}%
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-neutral-400">
          A/B chưa có dữ liệu. Hãy bật A/B Testing, lưu cấu hình, mở landing ở
          tab mới rồi tải lại Analytics.
        </p>
      )}
    </AdminModal>
  );
}

/* ------------------------------- LEADS ------------------------------------ */
function LeadsModal({ onClose }: ModalProps) {
  const { config } = useSiteConfig();
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    const refresh = () => setLeads(loadLeads());
    refresh();
    window.addEventListener(LEAD_CREATED_EVENT, refresh);
    return () => window.removeEventListener(LEAD_CREATED_EVENT, refresh);
  }, []);

  const cloud =
    config.admin.storageMode === "database" && !!config.admin.supabaseUrl;
  const key = q.trim().toLowerCase();
  const filtered = key
    ? leads.filter((l) =>
        [l.name, l.phone, l.city, l.major, l.utmSource].some((v) =>
          (v || "").toLowerCase().includes(key),
        ),
      )
    : leads;

  const addTestLead = async () => {
    const n = leads.length + 1;
    await saveLead(
      {
        id: `ld_test_${Date.now()}`,
        at: new Date().toISOString(),
        name: `Lead thử nghiệm ${n}`,
        phone: `09${String(Date.now()).slice(-8)}`,
        city: "Hà Nội",
        major: "Công nghệ ô tô điện",
        aiScore: 72,
        aiRank: "WARM",
        utmSource: "test",
      },
      config,
    );
    setLeads(loadLeads());
  };

  return (
    <AdminModal
      title="Quản Lý Lead (Mini-CRM)"
      subtitle={`${leads.length} lead đã ghi nhận`}
      onClose={onClose}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
            cloud
              ? "bg-sky-100 text-sky-700"
              : "bg-neutral-200 text-neutral-700"
          }`}
        >
          {cloud ? "Supabase Cloud" : "LocalStorage"}
        </span>
        <button
          onClick={() => exportLeadsCsv(filtered)}
          disabled={filtered.length === 0}
          className="flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-2 text-xs font-bold text-white disabled:opacity-40"
        >
          <Download className="h-3.5 w-3.5" /> Xuất CSV/Excel
        </button>
        <button
          onClick={addTestLead}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-xs font-bold text-neutral-700"
        >
          + Lead thử
        </button>
        <button
          onClick={() => {
            if (window.confirm("Xoá toàn bộ lead đã lưu trên máy này?")) {
              clearLeads();
              setLeads([]);
            }
          }}
          disabled={leads.length === 0}
          className="ml-auto rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 disabled:opacity-40"
        >
          Xoá tất cả
        </button>
      </div>

      <TextInput
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Tìm theo tên, SĐT, tỉnh, ngành..."
      />

      {filtered.length === 0 ? (
        <p className="mt-4 text-xs text-neutral-400">
          {leads.length === 0
            ? "Chưa có lead nào. Lead sẽ xuất hiện tại đây sau khi khách gửi form."
            : "Không tìm thấy lead phù hợp."}
        </p>
      ) : (
        <div className="mt-3 overflow-x-auto rounded-xl border border-neutral-200 dark:border-white/10">
          <table className="w-full min-w-[560px] text-left text-xs">
            <thead className="bg-neutral-100 text-[10px] uppercase tracking-wide text-neutral-500 dark:bg-white/5">
              <tr>
                <th className="px-3 py-2">Họ tên</th>
                <th className="px-3 py-2">Điện thoại</th>
                <th className="px-3 py-2">Tỉnh/Thành</th>
                <th className="px-3 py-2">Ngành</th>
                <th className="px-3 py-2">Thời gian</th>
                <th className="px-3 py-2">Nguồn</th>
                <th className="px-3 py-2">Lưu tại</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr
                  key={l.id}
                  className="border-t border-neutral-200 dark:border-white/10"
                >
                  <td className="px-3 py-2 font-semibold">
                    <div className="min-w-0">
                      <div className="break-words">{l.name}</div>
                      {l.aiRank && (
                        <span className="ml-1.5 rounded bg-amber-100 px-1.5 text-[10px] font-bold text-amber-700">
                          {l.aiRank}
                        </span>
                      )}
                      {l.riskLevel && l.riskLevel !== "low" && (
                        <span
                          title={
                            l.riskReasons?.join("; ") ||
                            l.recommendedAction ||
                            "Cần kiểm tra thêm"
                          }
                          className={`ml-1.5 rounded px-1.5 text-[10px] font-bold ${
                            l.riskLevel === "high"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {l.riskLevel === "high" ? "CẦN XÁC MINH" : "XEM LẠI"}
                        </span>
                      )}
                      <div className="mt-1 space-y-1 text-[11px] font-normal leading-relaxed text-neutral-500">
                        {l.deviceTechInfo && (
                          <p className="break-words">{l.deviceTechInfo}</p>
                        )}
                        {l.networkLabel && (
                          <p className="break-words">{l.networkLabel}</p>
                        )}
                        {l.trafficAdsSource && (
                          <p className="break-words">{l.trafficAdsSource}</p>
                        )}
                        {l.saleAdvice && (
                          <p className="break-words text-neutral-700 dark:text-neutral-200">
                            {l.saleAdvice}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 tabular-nums">{l.phone}</td>
                  <td className="px-3 py-2">{l.city || "—"}</td>
                  <td className="px-3 py-2">{l.major || "—"}</td>
                  <td className="px-3 py-2 text-neutral-500">
                    {new Date(l.at).toLocaleString("vi-VN")}
                  </td>
                  <td className="px-3 py-2 text-neutral-500">
                    <div className="space-y-1">
                      <div>{l.utmSource || "direct"}</div>
                      <div className="text-[11px] leading-relaxed">
                        Phiên {l.currentSession || 1} · Hôm nay{" "}
                        {l.visitsToday || 0} · Tháng {l.visitsMonth || 0}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        l.storage === "database"
                          ? "bg-sky-100 text-sky-700"
                          : "bg-neutral-200 text-neutral-700"
                      }`}
                    >
                      {l.storage === "database" ? "Cloud" : "Local"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminModal>
  );
}

/* ------------------------------ STORAGE ----------------------------------- */
function StorageModal({ onClose }: ModalProps) {
  const { config, update } = useSiteConfig();
  const a = config.admin;
  const [testing, setTesting] = useState<null | boolean>(null);
  return (
    <AdminModal
      title="Storage Mode"
      subtitle="Local (mặc định) hoặc Supabase Cloud"
      onClose={onClose}
    >
      <Field label="Chế độ lưu trữ">
        <div className="flex gap-2">
          {(["local", "database"] as const).map((m) => (
            <button
              key={m}
              onClick={() => update((d) => (d.admin.storageMode = m))}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold ${
                a.storageMode === m
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-300"
              }`}
            >
              {m === "local" ? "Local (localStorage)" : "Database (Supabase)"}
            </button>
          ))}
        </div>
      </Field>
      {a.storageMode === "database" && (
        <>
          <Field label="Supabase URL">
            <TextInput
              value={a.supabaseUrl}
              onChange={(e) =>
                update((d) => (d.admin.supabaseUrl = e.target.value))
              }
            />
          </Field>
          <Field label="Supabase Anon Key">
            <TextInput
              value={a.supabaseAnonKey}
              onChange={(e) =>
                update((d) => (d.admin.supabaseAnonKey = e.target.value))
              }
            />
          </Field>
          <button
            onClick={async () => {
              setTesting(null);
              setTesting(
                await testSupabaseConnection(a.supabaseUrl, a.supabaseAnonKey),
              );
            }}
            className="mb-3 rounded-lg bg-neutral-900 px-3 py-2 text-xs font-bold text-white"
          >
            Kiểm tra kết nối
          </button>
          {testing !== null && (
            <p
              className={`text-xs font-semibold ${testing ? "text-emerald-600" : "text-red-600"}`}
            >
              {testing
                ? "Kết nối thành công."
                : "Không kết nối được. Kiểm tra lại URL/Key."}
            </p>
          )}
        </>
      )}
      <SaveHint />
    </AdminModal>
  );
}

/* --------------------------- ADMIN LINK ----------------------------------- */
function AdminLinkModal({ onClose }: ModalProps) {
  const { config, update, save } = useSiteConfig();
  const a = config.admin;
  const [confirm, setConfirm] = useState(a.password);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const path = a.adminPath.trim().replace(/^\/+|\/+$/g, "");

  function handleSave() {
    if (!/^[a-z0-9-]{3,40}$/i.test(path)) {
      setMsg({
        ok: false,
        text: "Đường dẫn chỉ gồm chữ, số và dấu gạch ngang (3-40 ký tự).",
      });
      return;
    }
    if (a.password.length < 4) {
      setMsg({ ok: false, text: "Mật khẩu cần tối thiểu 4 ký tự." });
      return;
    }
    if (a.password !== confirm) {
      setMsg({ ok: false, text: "Hai ô mật khẩu chưa khớp nhau." });
      return;
    }
    update((d) => (d.admin.adminPath = path));
    save();
    setMsg({
      ok: true,
      text: `Đã lưu. Đăng nhập tại /${path} với mật khẩu mới.`,
    });
  }

  return (
    <AdminModal
      title="Đổi Link & Mật Khẩu Admin"
      subtitle="Bảo mật trang quản trị"
      onClose={onClose}
    >
      <Field label="Đường dẫn admin" hint={`Truy cập tại /${path || "..."}`}>
        <TextInput
          value={a.adminPath}
          onChange={(e) => {
            setMsg(null);
            update((d) => (d.admin.adminPath = e.target.value));
          }}
        />
      </Field>
      <Field label="Mật khẩu quản trị">
        <TextInput
          type="text"
          value={a.password}
          onChange={(e) => {
            setMsg(null);
            update((d) => (d.admin.password = e.target.value));
          }}
        />
      </Field>
      <Field label="Nhập lại mật khẩu">
        <TextInput
          type="text"
          value={confirm}
          onChange={(e) => {
            setMsg(null);
            setConfirm(e.target.value);
          }}
        />
      </Field>

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="flex-1 rounded-lg bg-emerald-500 py-2.5 text-sm font-bold text-white"
        >
          LƯU & ÁP DỤNG
        </button>
        <button
          onClick={() => window.open(`/${path}`, "_blank", "noopener")}
          className="flex-1 rounded-lg border border-neutral-300 py-2.5 text-sm font-bold dark:border-white/20"
        >
          Kiểm tra link
        </button>
      </div>

      {msg && (
        <p
          className={`mt-3 text-xs font-semibold ${msg.ok ? "text-emerald-600" : "text-red-500"}`}
        >
          {msg.text}
        </p>
      )}

      <p className="mt-3 text-[11px] text-neutral-400">
        Lưu ý: đây là mật khẩu phía client cho tiện chỉnh sửa nhanh. Với dữ liệu
        nhạy cảm hãy dùng Supabase Row Level Security.
      </p>
    </AdminModal>
  );
}

/* ------------------------------ A/B TEST ---------------------------------- */
function AbTestModal({ onClose }: ModalProps) {
  const { config, update } = useSiteConfig();
  const ab = config.abTest;
  const currentVariant = getVariant(ab.enabled, ab.split);
  return (
    <AdminModal
      title="A/B Split Testing"
      subtitle="Phân phối traffic giữa 2 biến thể"
      onClose={onClose}
    >
      <Toggle
        checked={ab.enabled}
        onChange={(v) => update((d) => (d.abTest.enabled = v))}
        label="Bật A/B testing"
      />
      <Field label={`% traffic vào Variant B: ${ab.split}%`}>
        <input
          type="range"
          min={0}
          max={100}
          value={ab.split}
          onChange={(e) => update((d) => (d.abTest.split = +e.target.value))}
          className="w-full"
        />
      </Field>
      <div className="mb-3 rounded-lg bg-neutral-100 px-3 py-2 text-xs dark:bg-white/5">
        Thiết bị này đang ở{" "}
        <strong>
          Variant {ab.enabled ? currentVariant : "A (A/B đang tắt)"}
        </strong>
        .
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Nhãn Variant A">
          <TextInput
            value={ab.variantALabel}
            onChange={(e) =>
              update((d) => (d.abTest.variantALabel = e.target.value))
            }
          />
        </Field>
        <Field label="Nhãn Variant B">
          <TextInput
            value={ab.variantBLabel}
            onChange={(e) =>
              update((d) => (d.abTest.variantBLabel = e.target.value))
            }
          />
        </Field>
      </div>
      <Field label="Headline Variant A" hint="Để trống để dùng headline gốc">
        <TextInput
          value={ab.variantAHeadline}
          onChange={(e) =>
            update((d) => (d.abTest.variantAHeadline = e.target.value))
          }
        />
      </Field>
      <Field label="Headline Variant B" hint="Để trống để dùng headline gốc">
        <TextInput
          value={ab.variantBHeadline}
          onChange={(e) =>
            update((d) => (d.abTest.variantBHeadline = e.target.value))
          }
        />
      </Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label="CTA Variant A">
          <TextInput
            value={ab.variantACta}
            onChange={(e) =>
              update((d) => (d.abTest.variantACta = e.target.value))
            }
          />
        </Field>
        <Field label="CTA Variant B">
          <TextInput
            value={ab.variantBCta}
            onChange={(e) =>
              update((d) => (d.abTest.variantBCta = e.target.value))
            }
          />
        </Field>
      </div>
      <button
        type="button"
        onClick={() => {
          resetVariant(ab.split);
          window.sessionStorage.removeItem(
            `funnel_visit_counted_v2_ab_${ab.split}`,
          );
          window.alert(
            "Đã reset phân bổ A/B trên thiết bị này. Mở lại landing để được chia lại nhóm.",
          );
        }}
        className="mt-2 w-full rounded-lg border border-amber-300 px-3 py-2 text-xs font-bold text-amber-700"
      >
        Reset phân bổ A/B trên thiết bị này
      </button>
      <SaveHint />
    </AdminModal>
  );
}

/* ------------------------------- CRON ------------------------------------- */
function CronModal({ onClose }: ModalProps) {
  const { config, update } = useSiteConfig();
  const a = config.admin;
  return (
    <AdminModal
      title="Cloud Cron & Backup"
      subtitle="Gửi backup .json định kỳ qua email"
      onClose={onClose}
    >
      <Field label="Email nhận backup">
        <TextInput
          value={a.backupEmail}
          onChange={(e) =>
            update((d) => (d.admin.backupEmail = e.target.value))
          }
        />
      </Field>
      <Field label="Lịch chạy">
        <div className="flex gap-2">
          {(["off", "daily", "weekly"] as const).map((s) => (
            <button
              key={s}
              onClick={() => update((d) => (d.admin.cronSchedule = s))}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold ${
                a.cronSchedule === s
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-300"
              }`}
            >
              {s === "off" ? "Tắt" : s === "daily" ? "Hàng ngày" : "Hàng tuần"}
            </button>
          ))}
        </div>
      </Field>
      <p className="text-[11px] text-neutral-400">
        Cron chạy phía Supabase Edge Function / cron-job.org khi ở Database
        Mode. Ở Local Mode, mỗi lần LƯU sẽ tạo snapshot backup tự động (giữ 10
        bản gần nhất).
      </p>
      <SaveHint />
    </AdminModal>
  );
}

/* --------------------------- INFO PANELS ---------------------------------- */
function InfoModal({
  onClose,
  title,
  subtitle,
  points,
}: ModalProps & { title: string; subtitle: string; points: string[] }) {
  return (
    <AdminModal title={title} subtitle={subtitle} onClose={onClose}>
      <ul className="space-y-2">
        {points.map((p) => (
          <li
            key={p}
            className="flex gap-2 rounded-lg bg-neutral-100 px-3 py-2 text-xs text-neutral-700 dark:bg-white/5 dark:text-neutral-200"
          >
            <span className="text-emerald-500">✓</span>
            {p}
          </li>
        ))}
      </ul>
    </AdminModal>
  );
}

const SECTION_LIBRARY: Record<
  string,
  { label: string; heading: string; body: string; buttonLabel: string }
> = {
  hero: {
    label: "Hero",
    heading: "Bắt đầu hành trình mới",
    body: "Thông điệp chính của trang và lý do khách hàng nên hành động ngay.",
    buttonLabel: "Nhận tư vấn",
  },
  countdown: {
    label: "Countdown",
    heading: "Ưu đãi có thời hạn",
    body: "Tạo động lực hành động bằng thời hạn rõ ràng và minh bạch.",
    buttonLabel: "Giữ suất ngay",
  },
  pricing: {
    label: "Pricing / Quyền lợi",
    heading: "Quyền lợi chương trình",
    body: "Liệt kê học phí, học bổng và các quyền lợi nổi bật.",
    buttonLabel: "Xem quyền lợi",
  },
  grid: {
    label: "Grid Icons",
    heading: "Điểm nổi bật",
    body: "Trình bày các lợi ích chính theo dạng lưới dễ quét trên mobile.",
    buttonLabel: "Tìm hiểu thêm",
  },
  testimonials: {
    label: "Testimonials",
    heading: "Khách hàng nói gì",
    body: "Thêm bằng chứng xã hội, trải nghiệm thực tế và kết quả đạt được.",
    buttonLabel: "Xem câu chuyện",
  },
  faq: {
    label: "FAQ",
    heading: "Câu hỏi thường gặp",
    body: "Giải đáp các băn khoăn trước khi khách hàng đăng ký.",
    buttonLabel: "Hỏi chuyên viên",
  },
  video: {
    label: "Video",
    heading: "Xem chương trình thực tế",
    body: "Đặt video giới thiệu, phỏng vấn hoặc hướng dẫn ở vị trí nổi bật.",
    buttonLabel: "Xem video",
  },
  guarantee: {
    label: "Guarantee / Cam kết",
    heading: "Cam kết đồng hành",
    body: "Nội dung cam kết, điều kiện và thông tin minh bạch.",
    buttonLabel: "Xem chi tiết",
  },
};

function LandingEditorModal({ onClose }: ModalProps) {
  const { config, update, save, resetLanding } = useSiteConfig();
  const content = config.landing;
  const importRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const heroImageInputRef = useRef<HTMLInputElement>(null);
  const heroSliderInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [logoError, setLogoError] = useState("");
  const [heroMediaError, setHeroMediaError] = useState("");
  const [templateType, setTemplateType] = useState("promo");
  const updateLines = (
    key: "heroTrustItems" | "pains" | "galleryCaptions",
    value: string,
  ) =>
    update((draft) => {
      draft.landing[key] = value
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    });
  const updateJson = <
    K extends
      | "stats"
      | "benefits"
      | "testimonials"
      | "steps"
      | "galleryImageUrls"
      | "heroSliderImages"
      | "expertImageUrls"
      | "majorDescriptions"
      | "faqs"
      | "majorNames"
      | "majorIcons"
      | "experts",
  >(
    key: K,
    value: string,
  ) => {
    try {
      const parsed = JSON.parse(value) as (typeof content)[K];
      update((draft) => {
        draft.landing[key] = parsed;
      });
    } catch {
      // Keep the textarea editable until the JSON is valid.
    }
  };
  function exportLanding() {
    const blob = new Blob([JSON.stringify(content, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "landing-page-config.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }
  function importLanding(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(String(reader.result)) as Partial<
          typeof content
        >;
        const hasString = (value: unknown): value is string =>
          typeof value === "string";
        const hasStringArray = (value: unknown): value is string[] =>
          Array.isArray(value) && value.every(hasString);
        const hasObjectArray = (value: unknown): value is object[] =>
          Array.isArray(value) &&
          value.every((item) => item !== null && typeof item === "object");
        if (
          !imported ||
          typeof imported !== "object" ||
          !hasString(imported.brandName) ||
          !hasString(imported.heroTitle) ||
          !hasStringArray(imported.heroTrustItems) ||
          !hasObjectArray(imported.sectionsArray) ||
          !hasObjectArray(imported.stats) ||
          !hasObjectArray(imported.benefits) ||
          !hasObjectArray(imported.faqs)
        ) {
          throw new Error("invalid landing config");
        }
        update((draft) => {
          draft.landing = {
            ...structuredClone(draft.landing),
            ...imported,
          } as typeof draft.landing;
        });
      } catch {
        window.alert("File landing config không hợp lệ.");
      }
    };
    reader.readAsText(file);
  }
  function readImageDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () =>
        typeof reader.result === "string"
          ? resolve(reader.result)
          : reject(new Error("invalid image"));
      reader.onerror = () => reject(new Error("read failed"));
      reader.readAsDataURL(file);
    });
  }

  function uploadLogo(file: File) {
    setLogoError("");
    if (!/^image\/(png|jpeg|webp|svg\+xml)$/.test(file.type)) {
      setLogoError("Logo cần là PNG, JPG, WebP hoặc SVG.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setLogoError("Logo không được vượt quá 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      update((draft) => {
        draft.landing.logoUrl = reader.result as string;
        draft.landing.showLogo = true;
      });
    };
    reader.onerror = () => setLogoError("Không thể đọc file logo.");
    reader.readAsDataURL(file);
  }
  function uploadHeroImage(file: File) {
    setHeroMediaError("");
    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) {
      setHeroMediaError("Ảnh hero cần là PNG, JPG hoặc WebP.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setHeroMediaError("Ảnh hero không được vượt quá 2MB.");
      return;
    }
    readImageDataUrl(file)
      .then((image) => {
        update((draft) => {
          draft.landing.heroMediaMode = "image";
          draft.landing.heroImageUrl = image;
        });
      })
      .catch(() => setHeroMediaError("Không thể đọc ảnh hero."));
  }

  function uploadHeroSlider(files: FileList) {
    setHeroMediaError("");
    const selected = Array.from(files).filter(
      (file) =>
        /^image\/(png|jpeg|webp)$/.test(file.type) &&
        file.size <= 2 * 1024 * 1024,
    );
    if (selected.length === 0) {
      setHeroMediaError("Vui lòng chọn PNG/JPG/WebP tối đa 2MB.");
      return;
    }
    Promise.all(selected.map((file) => readImageDataUrl(file)))
      .then((images) => {
        update((draft) => {
          draft.landing.heroMediaMode = "slider";
          draft.landing.heroSliderImages = images;
          if (!draft.landing.heroImageUrl) {
            draft.landing.heroImageUrl = images[0] || "";
          }
        });
      })
      .catch(() => setHeroMediaError("Không thể đọc slider hero."));
  }

  function uploadGallery(files: FileList) {
    const selected = Array.from(files).filter(
      (file) =>
        /^image\/(png|jpeg|webp)$/.test(file.type) &&
        file.size <= 2 * 1024 * 1024,
    );
    if (selected.length === 0) return;
    Promise.all(
      selected.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () =>
              typeof reader.result === "string"
                ? resolve(reader.result)
                : reject(new Error("invalid image"));
            reader.onerror = () => reject(new Error("read failed"));
            reader.readAsDataURL(file);
          }),
      ),
    ).then((images) => {
      update((draft) => {
        draft.landing.galleryImageUrls = [
          ...draft.landing.galleryImageUrls,
          ...images,
        ];
        draft.landing.galleryCaptions = [
          ...draft.landing.galleryCaptions,
          ...images.map(() => "Ảnh thực tế chương trình"),
        ];
      });
    });
  }
  function updateSections(nextSections: typeof content.sectionsArray) {
    update((draft) => {
      draft.landing.sectionsArray = nextSections.map((section, order) => ({
        ...section,
        order,
      }));
    });
  }
  function moveSection(index: number, direction: -1 | 1) {
    const next = [...content.sectionsArray];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target]!, next[index]!];
    updateSections(next);
  }
  function duplicateSection(index: number) {
    const source = content.sectionsArray[index];
    if (!source) return;
    const copy = {
      id: `custom-${crypto.randomUUID?.() || Date.now()}`,
      type: "custom",
      label: `${source.label} (bản sao)`,
      enabled: true,
      order: index + 1,
      content: {
        heading: source.label,
        body: `Nội dung bản sao của section ${source.label}. Chỉnh sửa nội dung tại đây.`,
        imageUrl: "",
        buttonLabel: "",
        buttonHref: "#dang-ky",
        backgroundColor: "",
        textColor: "",
        accentColor: "",
      },
    };
    updateSections([
      ...content.sectionsArray.slice(0, index + 1),
      copy,
      ...content.sectionsArray.slice(index + 1),
    ]);
  }
  function addSection() {
    const missing = DEFAULT_CONFIG.landing.sectionsArray.find(
      (defaultSection) =>
        !content.sectionsArray.some(
          (section) => section.id === defaultSection.id,
        ),
    );
    if (missing) {
      updateSections([...content.sectionsArray, structuredClone(missing)]);
      return;
    }
    const templates: Record<
      string,
      { label: string; heading: string; body: string; buttonLabel: string }
    > = {
      promo: {
        label: "Khối quảng bá",
        heading: "Tiêu đề khối quảng bá",
        body: "Mô tả ngắn cho ưu đãi hoặc chương trình.",
        buttonLabel: "Tìm hiểu thêm",
      },
      pricing: {
        label: "Bảng quyền lợi",
        heading: "Quyền lợi chương trình",
        body: "Liệt kê học phí, học bổng và các quyền lợi nổi bật.",
        buttonLabel: "Nhận tư vấn",
      },
      guarantee: {
        label: "Cam kết",
        heading: "Cam kết đồng hành",
        body: "Nội dung cam kết, điều kiện và thông tin minh bạch.",
        buttonLabel: "Xem chi tiết",
      },
      cta: {
        label: "CTA",
        heading: "Sẵn sàng bắt đầu?",
        body: "Để lại thông tin để nhận tư vấn phù hợp.",
        buttonLabel: "Đăng ký ngay",
      },
    };
    const template = templates[templateType] ?? templates["promo"]!;
    updateSections([
      ...content.sectionsArray,
      {
        id: `custom-${Date.now()}`,
        type: "custom",
        label: template.label,
        enabled: true,
        order: content.sectionsArray.length,
        content: {
          heading: template.heading,
          body: template.body,
          imageUrl: "",
          buttonLabel: template.buttonLabel,
          buttonHref: "#dang-ky",
          backgroundColor: "",
          textColor: "",
          accentColor: "",
        },
      },
    ]);
  }
  function updateSectionContent(
    id: string,
    patch: Partial<
      NonNullable<(typeof content.sectionsArray)[number]["content"]>
    >,
  ) {
    update((draft) => {
      const section = draft.landing.sectionsArray.find(
        (item) => item.id === id,
      );
      if (!section) return;
      section.content = {
        heading: section.label,
        body: "",
        imageUrl: "",
        buttonLabel: "",
        buttonHref: "#dang-ky",
        backgroundColor: "",
        textColor: "",
        accentColor: "",
        ...section.content,
        ...patch,
      };
      if (patch.heading) section.label = patch.heading;
    });
  }
  return (
    <AdminModal
      title="Sửa Giao Diện"
      subtitle="Nội dung và hình ảnh landing page được lưu vào cấu hình"
      onClose={onClose}
    >
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <button
          onClick={exportLanding}
          className="rounded-lg bg-neutral-900 px-2 py-2 text-xs font-bold text-white"
        >
          Xuất JSON
        </button>
        <button
          onClick={() => importRef.current?.click()}
          className="rounded-lg border border-neutral-300 px-2 py-2 text-xs font-bold"
        >
          Nhập JSON
        </button>
        <button
          onClick={() => {
            if (window.confirm("Khôi phục landing mặc định?")) resetLanding();
          }}
          className="rounded-lg border border-amber-300 px-2 py-2 text-xs font-bold text-amber-700"
        >
          Khôi phục
        </button>
        <button
          onClick={() => save()}
          className="rounded-lg bg-emerald-600 px-2 py-2 text-xs font-bold text-white"
        >
          Lưu ngay
        </button>
        <input
          ref={importRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) importLanding(file);
            e.target.value = "";
          }}
        />
      </div>
      <div className="mb-4 space-y-3 rounded-xl border border-neutral-200 p-3 dark:border-white/10">
        <p className="text-xs font-bold">CTA & liên hệ trang chủ</p>
        <Toggle
          checked={config.countdown.enabled}
          onChange={(value) =>
            update((draft) => (draft.countdown.enabled = value))
          }
          label="Hiển thị Countdown"
        />
        {config.countdown.enabled && (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Số suất còn lại">
              <TextInput
                type="number"
                min="0"
                value={config.countdown.slotsLeft}
                onChange={(event) =>
                  update(
                    (draft) =>
                      (draft.countdown.slotsLeft = Math.max(
                        0,
                        Number(event.target.value) || 0,
                      )),
                  )
                }
              />
            </Field>
            <Field label="Mô tả Countdown">
              <TextInput
                value={config.countdown.headline}
                onChange={(event) =>
                  update(
                    (draft) => (draft.countdown.headline = event.target.value),
                  )
                }
              />
            </Field>
          </div>
        )}
        <Toggle
          checked={config.floatingContact.enabled}
          onChange={(value) =>
            update((draft) => (draft.floatingContact.enabled = value))
          }
          label="Hiển thị Hotline / Zalo / Messenger"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Số hotline">
            <TextInput
              type="tel"
              value={config.floatingContact.hotline}
              onChange={(event) =>
                update(
                  (draft) =>
                    (draft.floatingContact.hotline = event.target.value),
                )
              }
            />
          </Field>
          <Field label="Link hoặc số Zalo">
            <TextInput
              value={config.floatingContact.zalo}
              onChange={(event) =>
                update(
                  (draft) => (draft.floatingContact.zalo = event.target.value),
                )
              }
            />
          </Field>
          <Field label="Link Messenger">
            <TextInput
              value={config.floatingContact.messenger}
              onChange={(event) =>
                update(
                  (draft) =>
                    (draft.floatingContact.messenger = event.target.value),
                )
              }
            />
          </Field>
        </div>
        <p className="text-[11px] text-neutral-400">
          Countdown và liên hệ dùng chung một nguồn cấu hình với CTA, footer và
          tracking. Bấm LƯU trên thanh Admin để áp dụng.
        </p>
      </div>
      <div className="mb-3 rounded-xl border border-neutral-200 p-3 dark:border-white/10">
        <p className="mb-2 text-xs font-bold">Logo & menu footer</p>
        <Field label="Logo footer URL">
          <TextInput
            type="url"
            value={config.footer.logoUrl}
            placeholder="Để trống dùng logo header"
            onChange={(event) =>
              update((draft) => (draft.footer.logoUrl = event.target.value))
            }
          />
        </Field>
        <Field label="Tên menu footer">
          <TextInput
            value={config.footer.menuLabel}
            onChange={(event) =>
              update((draft) => (draft.footer.menuLabel = event.target.value))
            }
          />
        </Field>
        <Field label="Menu footer (JSON: label, href)">
          <TextArea
            value={JSON.stringify(config.footer.menuLinks, null, 2)}
            onChange={(event) => {
              try {
                const links = JSON.parse(event.target.value) as unknown;
                if (Array.isArray(links))
                  update((draft) => (draft.footer.menuLinks = links));
              } catch {
                // Giữ nội dung đang nhập cho tới khi JSON hợp lệ.
              }
            }}
          />
        </Field>
        <p className="text-[11px] text-neutral-400">
          Footer tự xếp cột trên mobile và hai vùng trên tablet/desktop, không
          gây tràn chiều ngang.
        </p>
      </div>
      <div className="mb-4 rounded-xl border border-neutral-200 p-3 dark:border-white/10">
        <p className="mb-2 text-xs font-bold">Thứ tự & trạng thái section</p>
        <Toggle
          checked={config.trafficStats.enabled}
          onChange={(value) =>
            update((draft) => (draft.trafficStats.enabled = value))
          }
          label="Bật khối thống kê truy cập"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Vị trí hiển thị">
            <select
              value={config.trafficStats.position}
              onChange={(event) =>
                update(
                  (draft) =>
                    (draft.trafficStats.position = event.target
                      .value as typeof config.trafficStats.position),
                )
              }
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-neutral-900"
            >
              <option value="footer">Chân trang</option>
              <option value="afterHero">Ngay sau Hero</option>
            </select>
          </Field>
          <Field label="Tiêu đề khối thống kê">
            <TextInput
              value={config.trafficStats.title}
              onChange={(event) =>
                update(
                  (draft) => (draft.trafficStats.title = event.target.value),
                )
              }
            />
          </Field>
        </div>
        <Field label="Mô tả hỗ trợ">
          <TextArea
            value={config.trafficStats.helperText}
            onChange={(event) =>
              update(
                (draft) => (draft.trafficStats.helperText = event.target.value),
              )
            }
          />
        </Field>
        <div className="space-y-1.5">
          {content.sectionsArray.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center gap-1.5 rounded-lg bg-neutral-50 p-1.5 text-xs dark:bg-white/5"
            >
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              <button
                onClick={() =>
                  updateSections(
                    content.sectionsArray.map((section) =>
                      section.id === item.id
                        ? { ...section, enabled: !section.enabled }
                        : section,
                    ),
                  )
                }
                className={`rounded px-2 py-1 ${item.enabled ? "bg-emerald-100 text-emerald-700" : "bg-neutral-200 text-neutral-500"}`}
              >
                {item.enabled ? "Bật" : "Tắt"}
              </button>
              <button
                onClick={() => moveSection(index, -1)}
                disabled={index === 0}
                className="rounded border px-2 py-1 disabled:opacity-30"
                aria-label="Đưa lên"
              >
                ↑
              </button>
              <button
                onClick={() => moveSection(index, 1)}
                disabled={index === content.sectionsArray.length - 1}
                className="rounded border px-2 py-1 disabled:opacity-30"
                aria-label="Đưa xuống"
              >
                ↓
              </button>
              <button
                onClick={() => duplicateSection(index)}
                className="rounded border px-2 py-1"
                aria-label="Nhân bản"
              >
                +
              </button>
              <button
                onClick={() =>
                  updateSections(
                    content.sectionsArray.filter(
                      (section) => section.id !== item.id,
                    ),
                  )
                }
                className="rounded border border-red-200 px-2 py-1 text-red-600"
                aria-label="Xóa"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-[1fr_auto] gap-2">
          <select
            value={templateType}
            onChange={(event) => setTemplateType(event.target.value)}
            className="rounded-lg border border-neutral-300 bg-white px-2 py-2 text-xs dark:bg-neutral-800"
          >
            <option value="promo">Khối quảng bá</option>
            <option value="pricing">Pricing / Quyền lợi</option>
            <option value="guarantee">Guarantee / Cam kết</option>
            <option value="cta">CTA</option>
          </select>
          <button
            onClick={addSection}
            className="rounded-lg bg-neutral-900 px-3 py-2 text-xs font-semibold text-white"
          >
            + Thêm
          </button>
        </div>
      </div>
      {content.sectionsArray
        .filter((item) => item.type === "custom")
        .map((item) => (
          <div
            key={item.id}
            className="mb-4 rounded-xl border border-neutral-200 p-3 dark:border-white/10"
          >
            <p className="mb-2 text-xs font-bold">{item.label}</p>
            <Field label="Tiêu đề">
              <TextInput
                value={item.content?.heading || ""}
                onChange={(e) =>
                  updateSectionContent(item.id, { heading: e.target.value })
                }
              />
            </Field>
            <Field label="Nội dung">
              <TextArea
                value={item.content?.body || ""}
                onChange={(e) =>
                  updateSectionContent(item.id, { body: e.target.value })
                }
              />
            </Field>
            <Field label="URL hình ảnh">
              <TextInput
                type="url"
                value={item.content?.imageUrl || ""}
                onChange={(e) =>
                  updateSectionContent(item.id, { imageUrl: e.target.value })
                }
              />
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Nhãn nút">
                <TextInput
                  value={item.content?.buttonLabel || ""}
                  onChange={(e) =>
                    updateSectionContent(item.id, {
                      buttonLabel: e.target.value,
                    })
                  }
                />
              </Field>
              <Field label="Link nút">
                <TextInput
                  value={item.content?.buttonHref || "#dang-ky"}
                  onChange={(e) =>
                    updateSectionContent(item.id, {
                      buttonHref: e.target.value,
                    })
                  }
                />
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Field label="Nền">
                <TextInput
                  type="color"
                  value={item.content?.backgroundColor || "#ffffff"}
                  onChange={(e) =>
                    updateSectionContent(item.id, {
                      backgroundColor: e.target.value,
                    })
                  }
                />
              </Field>
              <Field label="Màu chữ">
                <TextInput
                  type="color"
                  value={item.content?.textColor || "#171717"}
                  onChange={(e) =>
                    updateSectionContent(item.id, { textColor: e.target.value })
                  }
                />
              </Field>
              <Field label="Màu tiêu đề">
                <TextInput
                  type="color"
                  value={item.content?.accentColor || "#c0392b"}
                  onChange={(e) =>
                    updateSectionContent(item.id, {
                      accentColor: e.target.value,
                    })
                  }
                />
              </Field>
            </div>
          </div>
        ))}
      <Field label="Tên thương hiệu">
        <TextInput
          value={content.brandName}
          onChange={(e) =>
            update((d) => (d.landing.brandName = e.target.value))
          }
        />
      </Field>
      <div className="mb-3 rounded-xl border border-neutral-200 p-3 dark:border-white/10">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold">Logo trên header</p>
            <p className="mt-0.5 text-[11px] text-neutral-400">
              Tự co giãn đẹp trên mobile, tablet và desktop.
            </p>
          </div>
          <Toggle
            checked={content.showLogo}
            onChange={(value) => update((d) => (d.landing.showLogo = value))}
            label=""
          />
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-neutral-100 ring-1 ring-neutral-200 dark:bg-white/10 dark:ring-white/10">
            {content.logoUrl ? (
              <img
                src={content.logoUrl}
                alt="Preview logo"
                className="h-full w-full object-contain"
              />
            ) : (
              <GraduationCap className="h-7 w-7 text-neutral-500" />
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="rounded-lg bg-neutral-900 px-3 py-2 text-xs font-bold text-white"
              >
                Tải logo lên
              </button>
              {content.logoUrl && (
                <button
                  type="button"
                  onClick={() => update((d) => (d.landing.logoUrl = ""))}
                  className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600"
                >
                  Xóa logo
                </button>
              )}
            </div>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) uploadLogo(file);
                event.target.value = "";
              }}
            />
            {logoError && (
              <p className="text-[11px] font-semibold text-red-600">
                {logoError}
              </p>
            )}
          </div>
        </div>
        <Field label="Hoặc dùng Logo URL">
          <TextInput
            type="url"
            value={content.logoUrl.startsWith("data:") ? "" : content.logoUrl}
            onChange={(e) =>
              update((d) => (d.landing.logoUrl = e.target.value))
            }
            placeholder="https://.../logo.png"
          />
        </Field>
      </div>
      <Field label="Hero: nhãn trên đầu">
        <TextInput
          value={content.heroEyebrow}
          onChange={(e) =>
            update((d) => (d.landing.heroEyebrow = e.target.value))
          }
        />
      </Field>
      <Field label="Hero: tiêu đề">
        <TextInput
          value={content.heroTitle}
          onChange={(e) =>
            update((d) => (d.landing.heroTitle = e.target.value))
          }
        />
      </Field>
      <Field label="Hero: phần nhấn mạnh">
        <TextInput
          value={content.heroHighlight}
          onChange={(e) =>
            update((d) => (d.landing.heroHighlight = e.target.value))
          }
        />
      </Field>
      <Field label="Hero: mô tả">
        <TextArea
          value={content.heroDescription}
          onChange={(e) =>
            update((d) => (d.landing.heroDescription = e.target.value))
          }
        />
      </Field>
      <Field label="Hero: chế độ nền">
        <select
          value={content.heroMediaMode}
          onChange={(e) =>
            update(
              (d) =>
                (d.landing.heroMediaMode = e.target
                  .value as typeof content.heroMediaMode),
            )
          }
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-neutral-900"
        >
          <option value="image">Ảnh tĩnh</option>
          <option value="slider">Slider nền</option>
        </select>
      </Field>
      <Field label="Hero: URL ảnh tĩnh (để trống dùng ảnh mặc định)">
        <TextInput
          type="url"
          value={content.heroImageUrl}
          onChange={(e) =>
            update((d) => (d.landing.heroImageUrl = e.target.value))
          }
        />
      </Field>
      <div className="mb-3 rounded-xl border border-neutral-200 p-3 dark:border-white/10">
        <p className="text-xs font-bold">Tải media cho Hero</p>
        <p className="mt-1 text-[11px] text-neutral-400">
          Ảnh tĩnh hoặc nhiều ảnh slider, tối đa 2MB mỗi tệp, responsive trên
          mobile/tablet/desktop.
        </p>
        <input
          ref={heroImageInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) uploadHeroImage(file);
            event.target.value = "";
          }}
        />
        <input
          ref={heroSliderInputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(event) => {
            if (event.target.files) uploadHeroSlider(event.target.files);
            event.target.value = "";
          }}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => heroImageInputRef.current?.click()}
            className="rounded-lg bg-neutral-900 px-3 py-2 text-xs font-bold text-white"
          >
            Upload ảnh tĩnh
          </button>
          <button
            onClick={() => heroSliderInputRef.current?.click()}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-xs font-bold text-neutral-700 dark:border-white/10 dark:text-white"
          >
            Upload slider hero
          </button>
        </div>
        {heroMediaError && (
          <p className="mt-2 text-[11px] font-medium text-red-500">
            {heroMediaError}
          </p>
        )}
      </div>
      <Field label="Hero: danh sách ảnh slider (JSON array)">
        <TextArea
          value={JSON.stringify(content.heroSliderImages, null, 2)}
          onChange={(e) => updateJson("heroSliderImages", e.target.value)}
        />
      </Field>
      <Field label="Hero: thời gian chuyển slide (ms)">
        <TextInput
          type="number"
          min="2500"
          value={content.heroSliderIntervalMs}
          onChange={(e) =>
            update(
              (d) =>
                (d.landing.heroSliderIntervalMs = Math.max(
                  2500,
                  Number(e.target.value) || 2500,
                )),
            )
          }
        />
      </Field>
      <Field label="Hero: các điểm tin tưởng (mỗi dòng một mục)">
        <TextArea
          value={content.heroTrustItems.join("\n")}
          onChange={(e) => updateLines("heroTrustItems", e.target.value)}
        />
      </Field>
      <Field label="Nhãn CTA hero">
        <TextInput
          value={content.heroCtaLabel}
          onChange={(e) =>
            update((d) => (d.landing.heroCtaLabel = e.target.value))
          }
        />
      </Field>
      <div className="grid gap-2 sm:grid-cols-2">
        {(
          [
            "painHeading",
            "benefitsHeading",
            "majorsHeading",
            "expertsHeading",
            "galleryHeading",
            "testimonialsHeading",
            "stepsHeading",
            "faqHeading",
            "finalCtaHeading",
          ] as const
        ).map((key) => (
          <Field key={key} label={key}>
            <TextInput
              value={content[key]}
              onChange={(e) => update((d) => (d.landing[key] = e.target.value))}
            />
          </Field>
        ))}
      </div>
      <Field label="Pain points (mỗi dòng một mục)">
        <TextArea
          value={content.pains.join("\n")}
          onChange={(e) => updateLines("pains", e.target.value)}
        />
      </Field>
      <Field label="Mô tả các ngành (JSON array 8 phần tử)">
        <TextArea
          value={JSON.stringify(content.majorDescriptions, null, 2)}
          onChange={(e) => updateJson("majorDescriptions", e.target.value)}
        />
      </Field>
      <Field label="Tên ngành (JSON array)">
        <TextArea
          value={JSON.stringify(content.majorNames, null, 2)}
          onChange={(e) => updateJson("majorNames", e.target.value)}
        />
      </Field>
      <Field label="Icon ngành (JSON array)">
        <TextArea
          value={JSON.stringify(content.majorIcons, null, 2)}
          onChange={(e) => updateJson("majorIcons", e.target.value)}
        />
      </Field>
      <Field label="Caption gallery (mỗi dòng một mục)">
        <TextArea
          value={content.galleryCaptions.join("\n")}
          onChange={(e) => updateLines("galleryCaptions", e.target.value)}
        />
      </Field>
      <Field label="URL ảnh gallery (JSON array)">
        <TextArea
          value={JSON.stringify(content.galleryImageUrls, null, 2)}
          onChange={(e) => updateJson("galleryImageUrls", e.target.value)}
        />
      </Field>
      <div className="mb-3 rounded-xl border border-neutral-200 p-3 dark:border-white/10">
        <p className="text-xs font-bold">Thêm nhiều ảnh vào slider</p>
        <p className="mt-1 text-[11px] text-neutral-400">
          Chọn nhiều PNG/JPG/WebP, tối đa 2MB mỗi ảnh. Caption tương ứng chỉnh ở
          ô Caption gallery ngay phía trên.
        </p>
        <input
          ref={galleryInputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(event) => {
            if (event.target.files) uploadGallery(event.target.files);
            event.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => galleryInputRef.current?.click()}
          className="mt-3 rounded-lg bg-neutral-900 px-3 py-2 text-xs font-bold text-white"
        >
          Chọn nhiều ảnh
        </button>
      </div>
      <Field label="URL ảnh chuyên gia (JSON array)">
        <TextArea
          value={JSON.stringify(content.expertImageUrls, null, 2)}
          onChange={(e) => updateJson("expertImageUrls", e.target.value)}
        />
      </Field>
      <Field label="Chuyên gia (JSON array gồm name, role, bio, experience)">
        <TextArea
          value={JSON.stringify(content.experts, null, 2)}
          onChange={(e) => updateJson("experts", e.target.value)}
        />
      </Field>
      <Field label="Stats (JSON array gồm value, label)">
        <TextArea
          value={JSON.stringify(content.stats, null, 2)}
          onChange={(e) => updateJson("stats", e.target.value)}
        />
      </Field>
      <Field label="Benefits (JSON array gồm stat, title, text)">
        <TextArea
          value={JSON.stringify(content.benefits, null, 2)}
          onChange={(e) => updateJson("benefits", e.target.value)}
        />
      </Field>
      <Field label="Testimonials (JSON array gồm name, meta, text)">
        <TextArea
          value={JSON.stringify(content.testimonials, null, 2)}
          onChange={(e) => updateJson("testimonials", e.target.value)}
        />
      </Field>
      <Field label="Steps (JSON array gồm number, title, description)">
        <TextArea
          value={JSON.stringify(content.steps, null, 2)}
          onChange={(e) => updateJson("steps", e.target.value)}
        />
      </Field>
      <Field label="FAQ (JSON array gồm slug, question, answer)">
        <TextArea
          value={JSON.stringify(content.faqs, null, 2)}
          onChange={(e) => updateJson("faqs", e.target.value)}
        />
      </Field>
      <Field label="Mô tả CTA cuối trang">
        <TextArea
          value={content.finalCtaDescription}
          onChange={(e) =>
            update((d) => (d.landing.finalCtaDescription = e.target.value))
          }
        />
      </Field>
      <SaveHint />
    </AdminModal>
  );
}

function PagesModal({ onClose }: ModalProps) {
  const { config, update } = useSiteConfig();
  const [selectedId, setSelectedId] = useState(config.pages[0]?.id || "");
  const selected =
    config.pages.find((page) => page.id === selectedId) || config.pages[0];
  if (!selected) return null;
  const selectedPageId = selected.id;
  const normalizedSelectedPath =
    selected?.path
      .trim()
      .replace(/^\/+|\/+$/g, "")
      .toLowerCase() || "";
  const pathConflict = Boolean(
    normalizedSelectedPath &&
    config.pages.some(
      (page) =>
        page.id !== selected.id &&
        page.path
          .trim()
          .replace(/^\/+|\/+$/g, "")
          .toLowerCase() === normalizedSelectedPath,
    ),
  );

  function updatePage(
    id: string,
    patch: Partial<(typeof config.pages)[number]>,
  ) {
    update((draft) => {
      const page = draft.pages.find((item) => item.id === id);
      if (page) Object.assign(page, patch);
    });
  }

  function addPage(kind: "custom" | "thankYou") {
    const id = `page_${Date.now()}`;
    const path =
      kind === "thankYou" ? `cam-on-${Date.now()}` : `trang-${Date.now()}`;
    update((draft) => {
      const nextMenuOrder =
        draft.pages.reduce(
          (maxOrder, page) => Math.max(maxOrder, page.menuOrder),
          -1,
        ) + 1;
      draft.pages.push({
        id,
        title: kind === "thankYou" ? "Trang cảm ơn mới" : "Trang mới",
        path,
        kind,
        enabled: true,
        showInMenu: kind === "custom",
        menuOrder: nextMenuOrder,
        heading: kind === "thankYou" ? "Cảm ơn bạn!" : "Tiêu đề trang mới",
        description: "Nội dung trang được chỉnh sửa trong Admin.",
        ctaLabel: "Về trang chủ",
        ctaHref: "/",
        sectionIds: [],
      });
    });
    setSelectedId(id);
  }

  function removePage(id: string) {
    if (id === "home") return;
    update((draft) => {
      draft.pages = draft.pages.filter((page) => page.id !== id);
    });
    if (selectedId === id) setSelectedId("home");
  }

  function addSectionToPage(type: string) {
    const template = SECTION_LIBRARY[type] ?? SECTION_LIBRARY["hero"]!;
    const sectionId = `page-${selectedPageId}-${type}-${Date.now()}`;
    update((draft) => {
      draft.landing.sectionsArray.push({
        id: sectionId,
        type: "custom",
        label: template.label,
        enabled: true,
        order: draft.landing.sectionsArray.length,
        content: {
          heading: template.heading,
          body: template.body,
          imageUrl: "",
          variant: type,
          buttonLabel: template.buttonLabel,
          buttonHref: "#dang-ky",
          backgroundColor: "",
          textColor: "",
          accentColor: "",
        },
      });
      const page = draft.pages.find((item) => item.id === selectedPageId);
      if (page) page.sectionIds = [...(page.sectionIds || []), sectionId];
    });
  }

  function detachSectionFromPage(sectionId: string) {
    update((draft) => {
      const page = draft.pages.find((item) => item.id === selectedPageId);
      if (page)
        page.sectionIds = (page.sectionIds || []).filter(
          (id) => id !== sectionId,
        );
    });
  }

  function updatePageSection(
    sectionId: string,
    patch: Partial<
      NonNullable<(typeof config.landing.sectionsArray)[number]["content"]>
    >,
  ) {
    update((draft) => {
      const section = draft.landing.sectionsArray.find(
        (item) => item.id === sectionId,
      );
      if (!section) return;
      section.content = {
        heading: section.label,
        body: "",
        imageUrl: "",
        buttonLabel: "",
        buttonHref: "#dang-ky",
        backgroundColor: "",
        textColor: "",
        accentColor: "",
        ...section.content,
        ...patch,
      };
      if (patch.heading?.trim()) section.label = patch.heading.trim();
    });
  }

  return (
    <AdminModal
      title="Quản Lý Đa Trang & Menu"
      subtitle="Tạo trang phụ, Thank You page và menu điều hướng hoạt động thật"
      onClose={onClose}
    >
      <div className="mb-3 flex gap-2">
        <button
          type="button"
          onClick={() => addPage("custom")}
          className="flex-1 rounded-lg bg-neutral-900 px-3 py-2 text-xs font-bold text-white"
        >
          + Trang mới
        </button>
        <button
          type="button"
          onClick={() => addPage("thankYou")}
          className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-xs font-bold"
        >
          + Thank You
        </button>
      </div>
      <div className="mb-4 flex gap-1 overflow-x-auto border-b border-neutral-200 pb-2">
        {config.pages.map((page) => (
          <button
            key={page.id}
            type="button"
            onClick={() => setSelectedId(page.id)}
            className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold ${page.id === selected.id ? "bg-neutral-900 text-white" : "bg-neutral-100"}`}
          >
            {page.title}
          </button>
        ))}
      </div>
      <Field label="Tên trang">
        <TextInput
          value={selected.title}
          onChange={(e) => updatePage(selected.id, { title: e.target.value })}
        />
      </Field>
      <Field
        label="Đường dẫn"
        hint={
          selected.path ? `Truy cập: /${selected.path}` : "Trang chủ dùng /"
        }
      >
        <TextInput
          disabled={selected.kind === "landing"}
          value={selected.path}
          onChange={(e) => {
            const path = e.target.value
              .replace(/^\/+|[^a-z0-9-]/gi, "")
              .toLowerCase();
            if (
              !path ||
              !config.pages.some(
                (page) => page.id !== selected.id && page.path === path,
              )
            )
              updatePage(selected.id, { path });
          }}
        />
      </Field>
      {pathConflict && (
        <p className="mb-3 text-xs font-semibold text-red-600">
          Đường dẫn này đã được dùng bởi một trang khác.
        </p>
      )}
      <Field label="Tiêu đề hiển thị">
        <TextInput
          value={selected.heading}
          onChange={(e) => updatePage(selected.id, { heading: e.target.value })}
        />
      </Field>
      <Field label="Mô tả">
        <TextArea
          value={selected.description}
          onChange={(e) =>
            updatePage(selected.id, { description: e.target.value })
          }
        />
      </Field>
      <Field label="Nút CTA">
        <TextInput
          value={selected.ctaLabel}
          onChange={(e) =>
            updatePage(selected.id, { ctaLabel: e.target.value })
          }
        />
      </Field>
      <Field label="Link CTA">
        <TextInput
          value={selected.ctaHref}
          onChange={(e) => updatePage(selected.id, { ctaHref: e.target.value })}
        />
      </Field>
      <Toggle
        checked={selected.enabled}
        onChange={(value) => updatePage(selected.id, { enabled: value })}
        label="Trang đang hoạt động"
      />
      <Toggle
        checked={selected.showInMenu}
        onChange={(value) => updatePage(selected.id, { showInMenu: value })}
        label="Hiển thị trong menu"
      />
      <Field label="Thứ tự menu">
        <TextInput
          type="number"
          value={selected.menuOrder}
          onChange={(e) =>
            updatePage(selected.id, { menuOrder: Number(e.target.value) || 0 })
          }
        />
      </Field>
      {selected.kind !== "landing" && (
        <Field
          label="Section hiển thị trên trang"
          hint="Tạo mới và gắn section ngay tại đây, hoặc quản lý nội dung trong Thêm Khối Giao Diện."
        >
          <div className="space-y-1.5 rounded-lg border border-neutral-200 p-2">
            {(selected.sectionIds || []).length === 0 && (
              <p className="text-xs text-neutral-400">
                Chưa gắn section nào vào trang này.
              </p>
            )}
            {(selected.sectionIds || []).map((sectionId) => {
              const section = config.landing.sectionsArray.find(
                (item) => item.id === sectionId,
              );
              if (!section) return null;
              return (
                <div
                  key={section.id}
                  className="rounded-lg border border-neutral-200 p-2"
                >
                  <div className="mb-2 flex items-center gap-2 text-xs">
                    <span className="min-w-0 flex-1 truncate font-bold">
                      {section.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => detachSectionFromPage(section.id)}
                      className="font-bold text-red-600"
                    >
                      Bỏ
                    </button>
                  </div>
                  <TextInput
                    aria-label="Tiêu đề"
                    value={section.content?.heading || section.label}
                    onChange={(event) =>
                      updatePageSection(section.id, {
                        heading: event.target.value,
                      })
                    }
                    placeholder="Tiêu đề block"
                  />
                  <TextArea
                    aria-label="Nội dung"
                    value={section.content?.body || ""}
                    onChange={(event) =>
                      updatePageSection(section.id, {
                        body: event.target.value,
                      })
                    }
                    placeholder="Nội dung đúng vai trò của block"
                  />
                  <div className="mt-1 grid grid-cols-2 gap-1.5">
                    <TextInput
                      value={section.content?.buttonLabel || ""}
                      onChange={(event) =>
                        updatePageSection(section.id, {
                          buttonLabel: event.target.value,
                        })
                      }
                      placeholder="Nhãn CTA"
                    />
                    <TextInput
                      value={section.content?.buttonHref || "#dang-ky"}
                      onChange={(event) =>
                        updatePageSection(section.id, {
                          buttonHref: event.target.value,
                        })
                      }
                      placeholder="Link CTA"
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {Object.entries(SECTION_LIBRARY).map(([type, template]) => (
              <button
                key={type}
                type="button"
                aria-label={`+ ${template.label}`}
                onClick={() => addSectionToPage(type)}
                className="rounded-lg border border-dashed border-neutral-300 px-2 py-1.5 text-left text-[11px] font-semibold hover:border-primary"
              >
                + {template.label}
              </button>
            ))}
          </div>
        </Field>
      )}
      <button
        type="button"
        disabled={selected.id === "home" || pathConflict}
        onClick={() => removePage(selected.id)}
        className="w-full rounded-lg border border-red-200 py-2 text-xs font-bold text-red-600 disabled:opacity-40"
      >
        Xóa trang này
      </button>
      <SaveHint />
    </AdminModal>
  );
}

function GuideModal({ onClose }: ModalProps) {
  const { config } = useSiteConfig();
  const isHttpUrl = (value: string) => {
    try {
      const url = new URL(value);
      return url.protocol === "https:" || url.hostname === "localhost";
    } catch {
      return false;
    }
  };
  const isEmailLike = (value: string) => /\S+@\S+\.\S+/.test(value.trim());
  const isPhoneLike = (value: string) => value.replace(/\D/g, "").length >= 8;
  const activeTrackingChannels = [
    config.tracking.facebookPixelId,
    config.tracking.tiktokPixelId,
    config.tracking.ga4Id,
    config.tracking.gtmId,
  ].filter((value) => value.trim()).length;
  const trackingEventsEnabled = Object.values(config.tracking.events).some(
    Boolean,
  );
  const primaryWebhookReady =
    !!config.form.webhookUrl.trim() && isHttpUrl(config.form.webhookUrl.trim());
  const normalizedPagePaths = config.pages.map((page) =>
    page.path
      .trim()
      .replace(/^\/+|\/+$/g, "")
      .toLowerCase(),
  );
  const pagePathsAreUnique =
    new Set(normalizedPagePaths).size === normalizedPagePaths.length;
  const pagePathsAreValid = config.pages.every(
    (page) =>
      !page.path ||
      /^[a-z0-9-]+$/i.test(page.path.trim().replace(/^\/+|\/+$/g, "")),
  );
  const knownSectionIds = new Set(
    config.landing.sectionsArray.map((section) => section.id),
  );
  const pageSectionsAreValid = config.pages.every((page) =>
    (page.sectionIds || []).every((sectionId) =>
      knownSectionIds.has(sectionId),
    ),
  );
  const configuredWebhookCount = [
    config.form.webhookUrl,
    ...config.webhooks
      .filter((endpoint) => endpoint.enabled)
      .map((endpoint) => endpoint.url),
  ].filter(
    (url) => url.trim() && url.startsWith("http") && !url.includes("REPLACE"),
  ).length;
  const configuredWebhookUrls = [
    config.form.webhookUrl,
    ...config.webhooks
      .filter((endpoint) => endpoint.enabled)
      .map((endpoint) => endpoint.url),
  ].filter(
    (url) => url.trim() && url.startsWith("http") && !url.includes("REPLACE"),
  );
  const adminPath = config.admin.adminPath.trim().replace(/^\/+|\/+$/g, "");
  const storageReady =
    config.admin.storageMode === "local" ||
    (isHttpUrl(config.admin.supabaseUrl.trim()) &&
      !!config.admin.supabaseAnonKey.trim());
  const contactReady =
    !config.floatingContact.enabled ||
    isPhoneLike(config.floatingContact.hotline) ||
    isHttpUrl(config.floatingContact.zalo.trim()) ||
    isHttpUrl(config.floatingContact.messenger.trim());
  const checks = [
    {
      label: "Lead có đầu ra nhận dữ liệu",
      ok: primaryWebhookReady || configuredWebhookCount > 0,
      purpose:
        "Ngăn form gửi thành công nhưng dữ liệu không tới đội sale hoặc hệ CRM.",
      action:
        "Nhập Webhook chính hợp lệ hoặc bật ít nhất một endpoint đang nhận lead.",
    },
    {
      label: "Webhook không bị trùng hoặc cấu hình sai",
      ok: new Set(configuredWebhookUrls).size === configuredWebhookCount,
      purpose:
        "Tránh gửi lead lặp, đo sai chuyển đổi và làm đội vận hành xử lý trùng dữ liệu.",
      action: "Loại bỏ URL trùng nhau và test lại từng endpoint quan trọng.",
    },
    {
      label: "Tracking đang đủ tối thiểu để đo hiệu quả",
      ok: activeTrackingChannels > 0 && trackingEventsEnabled,
      purpose:
        "Giúp biết nguồn quảng cáo nào ra lead và phát hiện điểm rơi chuyển đổi.",
      action:
        "Điền ít nhất một Pixel, GA4 hoặc GTM và giữ các event cốt lõi ở trạng thái bật.",
    },
    {
      label: "SEO cốt lõi đủ để trang hiển thị đúng",
      ok:
        !!config.seo.title.trim() &&
        !!config.seo.description.trim() &&
        !!config.seo.ogImage.trim(),
      purpose:
        "Giữ chất lượng hiển thị trên Google, Facebook và tránh snippet rỗng.",
      action:
        "Điền title, description và ảnh OG rõ ràng cho chiến dịch đang chạy.",
    },
    {
      label: "Kênh liên hệ nhanh đang sẵn sàng",
      ok: contactReady,
      purpose:
        "Đảm bảo khách có đường liên hệ ngay khi chưa kịp điền form hoặc cần tư vấn gấp.",
      action:
        "Bật hotline, Zalo hoặc Messenger với thông tin hợp lệ nếu muốn nhận lead tức thì.",
    },
    {
      label: "Lưu trữ và backup phù hợp chế độ vận hành",
      ok:
        storageReady &&
        (config.admin.cronSchedule === "off" ||
          isEmailLike(config.admin.backupEmail)),
      purpose:
        "Giảm nguy cơ mất cấu hình, mất lead và hỗ trợ đồng bộ khi nhiều người cùng vận hành.",
      action:
        "Nếu dùng database hãy điền Supabase; nếu bật cron backup hãy thêm email nhận backup.",
    },
    {
      label: "Admin có đường dẫn và mật khẩu an toàn cơ bản",
      ok:
        /^[a-z0-9-]+$/i.test(adminPath) &&
        config.admin.password.trim().length >= 6 &&
        config.admin.password !== DEFAULT_CONFIG.admin.password,
      purpose:
        "Giảm truy cập nhầm hoặc rủi ro giữ nguyên thông tin đăng nhập mặc định.",
      action:
        "Đổi admin path rõ ràng và thay mật khẩu mặc định bằng mật khẩu riêng từ 6 ký tự trở lên.",
    },
    {
      label: "Đa trang không trùng đường dẫn",
      ok: pagePathsAreUnique && pagePathsAreValid,
      purpose:
        "Ngăn va chạm route khiến menu, quảng cáo hoặc index SEO dẫn sai nội dung.",
      action:
        "Chuẩn hóa slug từng trang bằng chữ, số, dấu gạch ngang và tránh trùng nhau.",
    },
    {
      label: "Section đa trang còn tồn tại đúng phạm vi",
      ok: pageSectionsAreValid,
      purpose:
        "Đảm bảo section đã gán cho từng trang vẫn còn tồn tại và hiển thị đúng vị trí.",
      action:
        "Gỡ section đã xóa khỏi từng trang hoặc tạo lại section còn thiếu.",
    },
  ];
  const passedCount = checks.filter((check) => check.ok).length;
  const pendingCount = checks.length - passedCount;
  const score = Math.round((passedCount / checks.length) * 100);
  const readiness =
    score === 100
      ? {
          label: "Sẵn sàng vận hành",
          description:
            "Các điểm cốt lõi đã ổn. Có thể chạy ads, nhận lead và theo dõi hiệu quả mượt hơn.",
          tone: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300",
        }
      : score >= 75
        ? {
            label: "Hoạt động tốt nhưng còn mục nên tối ưu",
            description:
              "Hệ thống đã dùng được, nhưng nên xử lý hết cảnh báo để tránh sai số hoặc thất thoát lead.",
            tone: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300",
          }
        : {
            label: "Cần hoàn thiện thêm trước khi đẩy mạnh vận hành",
            description:
              "Một số cấu hình nền tảng còn thiếu; nên xử lý trước để website chạy đúng vai trò và mục đích sinh ra.",
            tone: "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300",
          };
  const valueChecklist = [
    {
      label: "Giảm rủi ro mất lead hoặc gửi lead trùng.",
      done:
        (primaryWebhookReady || configuredWebhookCount > 0) &&
        new Set(configuredWebhookUrls).size === configuredWebhookCount,
    },
    {
      label: "Giữ tracking đủ dữ liệu để đánh giá nguồn quảng cáo.",
      done: activeTrackingChannels > 0 && trackingEventsEnabled,
    },
    {
      label:
        "Giúp đội vận hành biết ngay mục nào cần sửa trước khi chạy chiến dịch.",
      done: score >= 75,
    },
    {
      label:
        "Xác nhận website đang dùng đúng vai trò: hút lead, tư vấn nhanh và đo hiệu quả.",
      done: score === 100,
    },
  ];
  return (
    <AdminModal
      title="Hướng Dẫn & Health Check"
      subtitle="Chẩn đoán nhanh trạng thái hệ thống"
      onClose={onClose}
    >
      <div className="space-y-4">
        <div className={`rounded-2xl border px-4 py-3 ${readiness.tone}`}>
          <p className="text-xs font-black uppercase tracking-[0.18em]">
            {readiness.label}
          </p>
          <p className="mt-1 text-sm font-medium">{readiness.description}</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Stat
            label="Điểm health"
            value={`${score}/100`}
            tone="text-primary"
          />
          <Stat label="Mục đạt" value={passedCount} tone="text-emerald-600" />
          <Stat
            label="Mục cần xử lý"
            value={pendingCount}
            tone="text-amber-600"
          />
        </div>
        <div className="rounded-xl border border-neutral-200 p-3 text-xs dark:border-white/10">
          <p className="font-bold text-neutral-900 dark:text-neutral-100">
            Tính năng này sinh ra để làm gì?
          </p>
          <ul className="mt-2 space-y-1.5 text-neutral-600 dark:text-neutral-300">
            <li>
              • Rà soát nhanh toàn bộ điểm dễ làm website chạy sai vai trò hoặc
              thất thoát lead.
            </li>
            <li>
              • Cảnh báo ngay cấu hình ảnh hưởng tới đo lường, đa trang, liên hệ
              và backup.
            </li>
            <li>
              • Xác nhận mức độ sẵn sàng trước khi chạy quảng cáo hoặc bàn giao
              vận hành.
            </li>
          </ul>
        </div>
        <div className="space-y-2">
          {checks.map((c) => (
            <div
              key={c.label}
              className="rounded-xl border border-neutral-200 px-3 py-3 text-xs dark:border-white/10"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-neutral-900 dark:text-neutral-100">
                    {c.label}
                  </p>
                  <p className="mt-1 text-neutral-600 dark:text-neutral-300">
                    {c.purpose}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    c.ok
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                  }`}
                >
                  {c.ok ? "OK" : "Cần xử lý"}
                </span>
              </div>
              <p className="mt-2 text-neutral-500 dark:text-neutral-400">
                <span className="font-semibold">Nâng cấp đề xuất:</span>{" "}
                {c.action}
              </p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-neutral-200 p-3 dark:border-white/10">
          <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
            Checklist giá trị sau khi hoàn tất
          </p>
          <ul className="mt-2 space-y-1.5 text-xs text-neutral-600 dark:text-neutral-300">
            {valueChecklist.map((item) => (
              <li key={item.label}>
                <span
                  className={item.done ? "text-emerald-600" : "text-amber-600"}
                >
                  {item.done ? "☑" : "☐"}
                </span>{" "}
                {item.label}
              </li>
            ))}
          </ul>
        </div>
        <ol className="list-decimal space-y-1.5 pl-5 text-xs text-neutral-600 dark:text-neutral-300">
          <li>
            Đăng nhập admin, mở đúng công cụ cần chỉnh và cập nhật cấu hình còn
            thiếu.
          </li>
          <li>
            Bấm LƯU để áp dụng ngay, sau đó XUẤT CONFIG nếu cần đồng bộ lại mã
            nguồn.
          </li>
          <li>
            Nếu dùng nhiều thiết bị hoặc cần lưu cloud, cấu hình Storage Mode
            trước khi chạy thật.
          </li>
          <li>
            Vào Cổng Webhook & Đa Kênh để test endpoint; chỉ chạy traffic khi
            các kênh quan trọng báo OK.
          </li>
          <li>
            Khi điểm health đạt 100/100, xem như xác nhận vận hành thành công.
          </li>
        </ol>
      </div>
    </AdminModal>
  );
}

/* ----------------------------- REGISTRY ----------------------------------- */
const REGISTRY: Record<AdminModalKey, (p: ModalProps) => ReactElement | null> =
  {
    editor: LandingEditorModal,
    fomo: FomoModal,
    analytics: AnalyticsModal,
    pages: PagesModal,
    abtest: AbTestModal,
    email: EmailModal,
    webhook: WebhookModal,
    theme: ThemeModal,
    guide: GuideModal,
    leads: LeadsModal,
    webmaster: WebmasterModal,
    pixel: PixelModal,
    utm: (p) => (
      <InfoModal
        {...p}
        title="UTM Intelligence Hub"
        subtitle="Gắn nhãn nguồn traffic cho AI Sales"
        points={[
          "Thêm ?utm_source=..&utm_medium=..&utm_campaign=.. vào link quảng cáo.",
          "Hệ thống tự đọc UTM, gộp vào biến traffic_ads_source gửi webhook.",
          "AI Sales Advisor dùng nguồn UTM để chọn kịch bản tư vấn phù hợp.",
        ]}
      />
    ),
    cron: CronModal,
    storage: StorageModal,
    seo: SeoModal,
    form: FormModal,
    ai: AiModal,
    contact: ContactModal,
    countdown: CountdownModal,
    adminlink: AdminLinkModal,
    tracking: PixelModal,
    preview: () => null,
  };

function SaveHint() {
  const { save, dirty } = useSiteConfig();
  return (
    <div className="sticky bottom-0 -mx-4 mt-4 border-t border-neutral-200 bg-white px-4 pb-1 pt-3 dark:border-white/10 dark:bg-neutral-900">
      <button
        onClick={save}
        className={`w-full rounded-lg py-2.5 text-sm font-bold ${
          dirty
            ? "bg-emerald-500 text-white"
            : "bg-neutral-200 text-neutral-500 dark:bg-white/10"
        }`}
      >
        {dirty ? "LƯU THAY ĐỔI" : "Đã lưu"}
      </button>
    </div>
  );
}
