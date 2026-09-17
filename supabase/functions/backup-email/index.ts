Deno.serve(async (req: Request) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Client-Info, Apikey",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const resendApiKey = Deno.env.get("RESEND_API_KEY") ?? "";

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: "Missing Supabase credentials" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ error: "Missing RESEND_API_KEY secret" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Parse request body for backup config
    const body = await req.json().catch(() => ({}));
    const backupEmail: string =
      body?.backupEmail ?? Deno.env.get("BACKUP_EMAIL") ?? "";
    const fromEmail: string =
      body?.fromEmail ??
      Deno.env.get("FROM_EMAIL") ??
      "backup@resend.dev";
    const schedule: string = body?.schedule ?? "daily";

    if (!backupEmail) {
      return new Response(
        JSON.stringify({ error: "Missing backupEmail in request body" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Calculate time window based on schedule
    const now = new Date();
    const since =
      schedule === "weekly"
        ? new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        : new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Fetch leads since last backup using service role key (bypasses RLS)
    const leadsUrl = `${supabaseUrl.replace(/\/$/, "")}/rest/v1/leads?created_at=gte.${since.toISOString()}&order=created_at.desc&select=*`;
    const leadsRes = await fetch(leadsUrl, {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    });

    if (!leadsRes.ok) {
      const detail = await leadsRes.text();
      return new Response(
        JSON.stringify({
          error: `Failed to fetch leads: ${leadsRes.status}`,
          detail,
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const leads = await leadsRes.json();
    const leadCount = Array.isArray(leads) ? leads.length : 0;

    // Fetch funnel config
    const configUrl = `${supabaseUrl.replace(/\/$/, "")}/rest/v1/funnel_configs?id=eq.1&select=data`;
    const configRes = await fetch(configUrl, {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    });
    let configSnapshot: unknown = null;
    if (configRes.ok) {
      const configRows = await configRes.json();
      if (Array.isArray(configRows) && configRows[0]) {
        configSnapshot = (configRows[0] as Record<string, unknown>).data ?? null;
      }
    }

    // Build email content
    const dateStr = now.toISOString().split("T")[0];
    const subject = `[Backup] ${leadCount} leads — ${dateStr} (${schedule})`;
    const backupData = {
      exportedAt: now.toISOString(),
      schedule,
      leadCount,
      leads,
      configSnapshot,
    };

    const textBody = [
      `Backup report — ${dateStr}`,
      `Schedule: ${schedule}`,
      `Leads since ${since.toISOString()}: ${leadCount}`,
      "",
      "Full JSON backup attached.",
      "",
      "--- Leads summary ---",
      ...leads.slice(0, 20).map(
        (l: Record<string, unknown>, i: number) =>
          `${i + 1}. ${l.name ?? "—"} | ${l.phone ?? "—"} | ${l.city ?? "—"} | ${l.major ?? "—"}`,
      ),
      leadCount > 20 ? `... and ${leadCount - 20} more` : "",
    ]
      .filter(Boolean)
      .join("\n");

    // Send via Resend
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [backupEmail],
        subject,
        text: textBody,
        attachments: [
          {
            filename: `backup-${dateStr}.json`,
            content: btoa(unescape(encodeURIComponent(JSON.stringify(backupData, null, 2)))),
          },
        ],
      }),
    });

    if (!emailRes.ok) {
      const detail = await emailRes.text();
      console.error(`Resend failed [${emailRes.status}]: ${detail}`);
      return new Response(
        JSON.stringify({
          error: "Resend API error",
          status: emailRes.status,
          detail,
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const emailResult = await emailRes.json();

    return new Response(
      JSON.stringify({
        success: true,
        exportedAt: backupData.exportedAt,
        leadCount,
        messageId: emailResult.id ?? null,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Backup email error:", message);
    return new Response(
      JSON.stringify({ error: message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
