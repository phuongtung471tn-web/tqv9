import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-CIHAFgYl.mjs";
import { n as objectType, r as stringType, t as enumType } from "../_libs/zod.mjs";
import processModule from "node:process";
//#region node_modules/.nitro/vite/services/ssr/assets/email.functions-DmAPUqG1.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
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
var checkEmailConfig_createServerFn_handler = createServerRpc({
	id: "5dd11d22fa873a9491cd5c93fc3d45224e628a4cc8d4b35c4fa8cccd1e4b748c",
	name: "checkEmailConfig",
	filename: "src/lib/email.functions.ts"
}, (opts) => checkEmailConfig.__executeServer(opts));
var checkEmailConfig = createServerFn({ method: "GET" }).handler(checkEmailConfig_createServerFn_handler, () => ({
	resendConfigured: Boolean(processModule.env["RESEND_API_KEY"]),
	gmailConfigured: Boolean(processModule.env["GMAIL_CLIENT_ID"] && processModule.env["GMAIL_CLIENT_SECRET"] && processModule.env["GMAIL_REFRESH_TOKEN"])
}));
async function sendWithGmail(data) {
	const clientId = processModule.env["GMAIL_CLIENT_ID"];
	const clientSecret = processModule.env["GMAIL_CLIENT_SECRET"];
	const refreshToken = processModule.env["GMAIL_REFRESH_TOKEN"];
	if (!clientId || !clientSecret || !refreshToken) return {
		sent: false,
		reason: "missing_gmail_secrets"
	};
	const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			client_id: clientId,
			client_secret: clientSecret,
			refresh_token: refreshToken,
			grant_type: "refresh_token"
		})
	});
	if (!tokenResponse.ok) return {
		sent: false,
		reason: "gmail_token_error"
	};
	const token = await tokenResponse.json();
	if (!token.access_token) return {
		sent: false,
		reason: "gmail_token_error"
	};
	const raw = [
		`From: ${data.from}`,
		`To: ${data.to}`,
		`Subject: ${data.subject}`,
		"Content-Type: text/plain; charset=UTF-8",
		"",
		data.text
	].join("\r\n");
	const encoded = btoa(unescape(encodeURIComponent(raw))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
	return (await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token.access_token}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ raw: encoded })
	})).ok ? { sent: true } : {
		sent: false,
		reason: "gmail_send_error"
	};
}
var sendLeadEmail_createServerFn_handler = createServerRpc({
	id: "cb38c81a85e3a70622346fb76fc7e69378a0178a9259e78f65da0c163f1f406e",
	name: "sendLeadEmail",
	filename: "src/lib/email.functions.ts"
}, (opts) => sendLeadEmail.__executeServer(opts));
var sendLeadEmail = createServerFn({ method: "POST" }).validator((data) => schema.parse(data)).handler(sendLeadEmail_createServerFn_handler, async ({ data }) => {
	if (data.provider === "gmail") return sendWithGmail(data);
	const apiKey = processModule.env["RESEND_API_KEY"];
	if (!apiKey) return {
		sent: false,
		reason: "missing_api_key"
	};
	const res = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			from: data.from,
			to: [data.to],
			subject: data.subject,
			text: data.text
		})
	});
	if (!res.ok) {
		const detail = await res.text();
		console.error(`Resend failed [${res.status}]: ${detail}`);
		return {
			sent: false,
			reason: "provider_error",
			status: res.status
		};
	}
	return { sent: true };
});
var sendTestEmail_createServerFn_handler = createServerRpc({
	id: "d732dbd0324b5de3cd27374b91a2d4196cd6a42ec4166af82f02cfbf6319a58a",
	name: "sendTestEmail",
	filename: "src/lib/email.functions.ts"
}, (opts) => sendTestEmail.__executeServer(opts));
var sendTestEmail = createServerFn({ method: "POST" }).validator((data) => schema.parse(data)).handler(sendTestEmail_createServerFn_handler, async ({ data }) => sendLeadEmail({ data }));
//#endregion
export { checkEmailConfig_createServerFn_handler, sendLeadEmail_createServerFn_handler, sendTestEmail_createServerFn_handler };
