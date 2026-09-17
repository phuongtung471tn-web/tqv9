-- BẢO MẬT: Bật RLS + tạo policy cho bảng leads và visitor_sessions
-- Chạy file này trong Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- Sau khi chạy, ai cũng chỉ có thể INSERT (gửi form), không thể đọc/xóa/sửa dữ liệu

-- ============================================================
-- 1. Bảng leads: bật RLS, chỉ cho INSERT (gửi form), không cho đọc
-- ============================================================
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Xóa policy cũ nếu có
DROP POLICY IF EXISTS "anon_insert_leads" ON public.leads;
DROP POLICY IF EXISTS "anon_select_leads" ON public.leads;
DROP POLICY IF EXISTS "anon_update_leads" ON public.leads;
DROP POLICY IF EXISTS "anon_delete_leads" ON public.leads;

-- Chỉ cho phép INSERT (khách điền form), KHÔNG cho SELECT/UPDATE/DELETE
CREATE POLICY "anon_insert_leads"
  ON public.leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- ============================================================
-- 2. Bảng visitor_sessions: bật RLS, chỉ cho INSERT
-- ============================================================
ALTER TABLE public.visitor_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_visitor_sessions" ON public.visitor_sessions;
DROP POLICY IF EXISTS "anon_select_visitor_sessions" ON public.visitor_sessions;
DROP POLICY IF EXISTS "anon_update_visitor_sessions" ON public.visitor_sessions;
DROP POLICY IF EXISTS "anon_delete_visitor_sessions" ON public.visitor_sessions;

CREATE POLICY "anon_insert_visitor_sessions"
  ON public.visitor_sessions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- ============================================================
-- 3. Bảng funnel_configs: anon có thể ghi (đồng bộ config) nhưng KHÔNG đọc
-- ============================================================
-- Xóa policy cũ cho phép đọc công khai
DROP POLICY IF EXISTS "funnel configs can be read" ON public.funnel_configs;
DROP POLICY IF EXISTS "funnel configs can be written" ON public.funnel_configs;
DROP POLICY IF EXISTS "funnel configs can be updated" ON public.funnel_configs;

-- Không cho anon đọc cấu hình (chứa API keys, mật khẩu admin hash)
CREATE POLICY "no_read_funnel_configs"
  ON public.funnel_configs FOR SELECT
  TO anon, authenticated
  USING (false);

-- Cho phép anon ghi/upsync cấu hình (nhưng dữ liệu nhạy cảm đã được strip trước khi gửi)
CREATE POLICY "anon_insert_funnel_configs"
  ON public.funnel_configs FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "anon_update_funnel_configs"
  ON public.funnel_configs FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
