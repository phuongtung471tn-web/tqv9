/**
 * Unified visitor behavior tracking and lead assessment helpers.
 */
import type {
  BehaviorData,
  LeadAssessment,
  LeadRiskLevel,
  VisitorBehaviorPayload,
} from "@/types/visitor-tracking";
import {
  collectBehavior,
  getTrackingSnapshot,
  initVisitorTracking,
  markCopiedText,
  markCopyPaste,
  markFaqClick,
  markFormStart,
  markIndustrySwitch,
  type VisitorTrackingInitOptions,
} from "@/lib/visitor-tracking";

export type { BehaviorData, LeadAssessment, LeadRiskLevel };
export {
  markCopiedText,
  markCopyPaste,
  markFaqClick,
  markFormStart,
  markIndustrySwitch,
};

export function initBehavior(options: VisitorTrackingInitOptions = {}) {
  return initVisitorTracking(options);
}

function scoreLead(
  data: BehaviorData,
  cfg?: {
    enabled?: boolean;
    vipDeviceRegex?: string;
    keyRegions?: string;
    fastFillThresholdSec?: number;
    vipTimeOnPageSec?: number;
    vipScrollPercent?: number;
  },
): LeadAssessment {
  if (cfg?.enabled === false) {
    return {
      score: 0,
      rank: "Chưa chấm AI",
      riskLevel: "unrated",
      reasons: ["AI Sales Advisor đang tắt trong cấu hình Admin"],
      recommendedAction: "Tư vấn theo quy trình thông thường",
    };
  }

  const fastFill = cfg?.fastFillThresholdSec ?? 4;
  const vipTime = cfg?.vipTimeOnPageSec ?? 80;
  const vipScroll = cfg?.vipScrollPercent ?? 70;
  const reasons: string[] = [];
  const locationMismatch = Boolean(
    data.location_city &&
    data.form_city &&
    !data.location_city.toLowerCase().includes(data.form_city.toLowerCase()) &&
    !data.form_city.toLowerCase().includes(data.location_city.toLowerCase()),
  );

  if (data.is_headless_browser) {
    reasons.push("Trình duyệt tự động/headless được nhận diện");
  }
  if (
    data.form_fill_duration_seconds > 0 &&
    data.form_fill_duration_seconds < fastFill
  ) {
    reasons.push(`Thời gian điền form dưới ${fastFill} giây`);
  }
  if (data.submission_count_same_ip > 1) {
    reasons.push(
      `Thiết bị đã ghi nhận ${data.submission_count_same_ip} lần gửi trong ngày`,
    );
  }
  if (locationMismatch && data.is_copy_paste) {
    reasons.push(
      "Khu vực mạng khác tỉnh khai báo kèm thao tác copy số điện thoại",
    );
  }
  if (data.network_flags.length > 0) {
    reasons.push(`Mạng có tín hiệu: ${data.network_flags.join(", ")}`);
  }

  if (data.is_headless_browser) {
    return {
      score: 5,
      rank: "Bot / Ảo",
      riskLevel: "high",
      reasons,
      recommendedAction: "Không tự động gọi; kiểm tra lead và nguồn quảng cáo",
    };
  }

  const safeRegex = (pattern?: string) => {
    if (!pattern) return null;
    try {
      return new RegExp(pattern, "i");
    } catch {
      return null;
    }
  };

  const vipDevice =
    safeRegex(cfg?.vipDeviceRegex) ??
    /iPhone (12|13|14|15|16)|Galaxy S(22|23|24|25)|Fold|Flip|Pixel/i;
  const keyRegion =
    safeRegex(cfg?.keyRegions) ??
    /Nghệ An|Hà Tĩnh|Quảng Bình|Thanh Hóa|Quảng Ninh|Hải Phòng/i;

  let score = 45;
  if (vipDevice.test(data.device_model_name)) score += 18;
  if (data.time_on_page_seconds >= vipTime) score += 15;
  if (data.scroll_depth_percent >= vipScroll) score += 12;
  if (keyRegion.test(data.form_city)) score += 8;
  if (data.utm_source && data.utm_source !== "Direct") score += 5;
  if (
    data.focus_section === "luong_thuc_tap" ||
    data.copied_text_type === "chi_phi"
  ) {
    score += 5;
  }
  if (data.visits_today >= 2) score += 4;
  score = Math.max(0, Math.min(100, score));

  const riskLevel: LeadRiskLevel =
    data.submission_count_same_ip > 1 ||
    (locationMismatch && data.is_copy_paste) ||
    data.network_flags.includes("Tor")
      ? "high"
      : data.form_fill_duration_seconds > 0 &&
          data.form_fill_duration_seconds < fastFill
        ? "review"
        : "low";

  return {
    score,
    rank:
      score >= 80
        ? "VIP"
        : score >= 65
          ? "Tiềm năng cao"
          : score >= 50
            ? "Tiềm năng"
            : "Cần nuôi dưỡng",
    riskLevel,
    reasons,
    recommendedAction:
      riskLevel === "high"
        ? "Xác minh thủ công trước khi gửi báo giá hoặc chuyển sale"
        : riskLevel === "review"
          ? "Ưu tiên xác minh qua Zalo trước khi gọi"
          : "Gọi tư vấn theo kịch bản phù hợp nhu cầu",
  };
}

function generateSaleAdvice(
  data: BehaviorData,
  assessment: LeadAssessment = scoreLead(data),
): string {
  if (assessment.riskLevel === "unrated") {
    return `ℹ️ [CHƯA CHẤM AI] ${assessment.recommendedAction}.`;
  }
  if (assessment.riskLevel === "high") {
    return `⚠️ [CẦN XÁC MINH] ${assessment.reasons.join("; ") || "Lead có tín hiệu bất thường"}. ${assessment.recommendedAction}.`;
  }
  if (assessment.riskLevel === "review") {
    return `🟡 [TÍN HIỆU YẾU] ${assessment.reasons.join("; ") || "Cần xác minh thêm"}. ${assessment.recommendedAction}.`;
  }

  const advice: string[] = [];
  const isHighEndDevice =
    /iPhone (12|13|14|15|16)|Galaxy S(22|23|24|25)|Fold|Flip|Pixel/i.test(
      data.device_model_name,
    );
  const isKeyRegion =
    /Nghệ An|Hà Tĩnh|Quảng Bình|Thanh Hóa|Quảng Ninh|Hải Phòng/i.test(
      data.form_city,
    );
  const isNightTime = (() => {
    const hour = new Date().getHours();
    return hour >= 22 || hour <= 6;
  })();

  if (
    isHighEndDevice &&
    data.time_on_page_seconds >= 80 &&
    data.scroll_depth_percent >= 70
  ) {
    advice.push(
      `💡 [KHÁCH VIP] Thiết bị ${data.device_model_name}, đọc kỹ trang ${data.time_on_page_seconds}s và cuộn ${data.scroll_depth_percent}%.`,
    );
    advice.push(
      `👉 Tư vấn theo hướng phụ huynh quan tâm độ an toàn, lộ trình visa và đầu ra nghề nghiệp của ngành ${data.nganh_hoc}.`,
    );
  } else if (
    data.focus_section === "luong_thuc_tap" ||
    data.copied_text_type === "chi_phi" ||
    /cpc|paid|ads/i.test(data.utm_medium)
  ) {
    advice.push(
      "💡 [KHÁCH QUAN TÂM TÀI CHÍNH] Tập trung vào thu nhập, chi phí và khả năng tự chủ tài chính.",
    );
    advice.push(
      `👉 Mở đầu bằng mức lương thực tập của ngành ${data.nganh_hoc}, rồi chốt bằng lộ trình học phí 0Đ và cơ hội việc làm sau tốt nghiệp.`,
    );
  } else if (data.faq_clicked === "tieng_trung") {
    advice.push(
      "💡 [LO NGẠI NGÔN NGỮ] Khách quan tâm rào cản tiếng Trung và điều kiện đầu vào.",
    );
    advice.push(
      "👉 Tư vấn ngắn, rõ: học từ 0, có lộ trình tiền HSK và hỗ trợ thích nghi trước khi bay.",
    );
  } else if (data.industry_switch_count > 1) {
    advice.push(
      `💡 [PHÂN VÂN NGÀNH] Đã đổi ngành ${data.industry_switch_count} lần trước khi chốt ${data.nganh_hoc}.`,
    );
    advice.push(
      "👉 Sale nên đóng vai hướng nghiệp, so sánh đầu ra, môi trường làm việc và thu nhập giữa 2-3 ngành gần nhau.",
    );
  } else if (data.time_on_page_seconds < 25) {
    advice.push(
      `💡 [XEM NHANH] Khách lướt nhanh bằng ${data.device_model_name}.`,
    );
    advice.push(
      "👉 Ưu tiên gửi Zalo kèm ảnh thực tế/KTX trước, sau đó mới gọi điện chốt nhu cầu.",
    );
  } else {
    advice.push(
      `💡 [TÌM HIỂU NGHIÊM TÚC] ${data.device_model_name} · ${data.network_label}. Ngành quan tâm: ${data.nganh_hoc}.`,
    );
    advice.push(
      "👉 Gọi tư vấn theo kịch bản khám phá mục tiêu học tập, tài chính và thời điểm nhập học phù hợp.",
    );
  }

  if (data.current_battery_level != null && data.current_battery_level <= 15) {
    advice.push(
      `⚡ Pin chỉ còn ${data.current_battery_level}%, ưu tiên nhắn Zalo/gọi sớm để không rơi lead.`,
    );
  }
  if (data.time_to_first_interaction_seconds > 120) {
    advice.push(
      "🧐 Khách suy nghĩ khá lâu trước khi điền form, cần tư vấn chuyên sâu và tránh chốt vội.",
    );
  }
  if (isKeyRegion) {
    advice.push(
      `📌 Khách ở ${data.form_city}, nên nhắc tới cộng đồng học viên đồng hương và case thành công gần khu vực này.`,
    );
  }
  if (isNightTime) {
    advice.push(
      "🌙 Lead đến vào đêm muộn, nên nhắn chào ngay nhưng hẹn gọi lại vào giờ hành chính hôm sau.",
    );
  }

  return advice.join("\n");
}

function generateBehaviorSummary(data: BehaviorData): string {
  const items = [
    `⏱️ ${data.time_on_page_seconds}s trên trang`,
    `🖱️ ${data.time_to_first_interaction_seconds || 0}s tới lần tương tác đầu`,
    `📝 ${data.form_fill_duration_seconds || 0}s điền form`,
    `📜 Cuộn ${data.scroll_depth_percent}%`,
    `👀 Phiên #${data.current_session} · Hôm nay ${data.visits_today} · Tháng ${data.visits_month}`,
  ];
  if (data.industry_switch_count > 0)
    items.push(`🔄 Đổi ngành ${data.industry_switch_count} lần`);
  if (data.focus_section) items.push(`🎯 Tập trung ${data.focus_section}`);
  if (data.faq_clicked) items.push(`❓ FAQ ${data.faq_clicked}`);
  if (data.is_copy_paste) items.push("📋 Có thao tác copy/paste");
  return items.join(" | ");
}

function generateDeviceTechInfo(data: BehaviorData): string {
  const batteryInfo =
    data.start_battery_level != null && data.current_battery_level != null
      ? `Pin ${data.current_battery_level}% (giảm ${data.battery_drain}%)`
      : "Pin: thiết bị không chia sẻ";
  const os = [data.operating_system, data.operating_system_version]
    .filter((part) => part && part !== "Unknown")
    .join(" ");
  const browser = [data.browser, data.browser_version]
    .filter((part) => part && part !== "Unknown")
    .join(" ");
  const deviceName = [data.device_manufacturer, data.device_model_name]
    .filter((part) => part && part !== "Unknown")
    .join(" ");
  return [
    deviceName || "Thiết bị chưa nhận diện",
    os || "Hệ điều hành chưa rõ",
    browser || "Trình duyệt chưa rõ",
    data.network_label,
    batteryInfo,
  ]
    .filter(Boolean)
    .join(" | ");
}

export function generateTrafficAdsSource(data: BehaviorData): string {
  const source = (data.utm_source || "Direct").trim();
  const hasCampaignData = Boolean(
    data.utm_medium ||
      data.utm_campaign ||
      data.utm_content ||
      data.utm_term ||
      data.ttclid,
  );

  if (!hasCampaignData && source.toLowerCase() === "direct") {
    return "Nguồn: Truy cập trực tiếp (không qua chiến dịch quảng cáo)";
  }

  const parts = [
    `Source: ${source}`,
    data.utm_medium && `Medium: ${data.utm_medium}`,
    data.utm_campaign && `Campaign: ${data.utm_campaign}`,
    data.utm_content && `Content: ${data.utm_content}`,
    data.utm_term && `Term: ${data.utm_term}`,
    data.ttclid && `TTCLID: ${data.ttclid}`,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" | ") : "Nguồn: Truy cập trực tiếp";
}

export function buildVisitorBehaviorPayload(
  input: { city: string; major: string },
  cfg?: Parameters<typeof scoreLead>[1],
): {
  behavior: BehaviorData;
  assessment: LeadAssessment;
  visitorBehaviorPayload: VisitorBehaviorPayload;
} {
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
      submittedAt: new Date().toISOString(),
      device: snapshot.device,
      network: snapshot.network,
      attribution: snapshot.attribution,
      metrics: {
        ...snapshot.metrics,
        submissionCountSameVisitor: behavior.submission_count_same_ip,
      },
      form: input,
      assessment,
      saleAdvice,
      behaviorSummary,
      deviceTechInfo,
      trafficAdsSource,
    },
  };
}
