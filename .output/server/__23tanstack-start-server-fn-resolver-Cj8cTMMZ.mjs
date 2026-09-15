//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-Cj8cTMMZ.js
var manifest = {
	"5dd11d22fa873a9491cd5c93fc3d45224e628a4cc8d4b35c4fa8cccd1e4b748c": {
		functionName: "checkEmailConfig_createServerFn_handler",
		importer: () => import("./_ssr/email.functions-DmAPUqG1.mjs")
	},
	"cb38c81a85e3a70622346fb76fc7e69378a0178a9259e78f65da0c163f1f406e": {
		functionName: "sendLeadEmail_createServerFn_handler",
		importer: () => import("./_ssr/email.functions-DmAPUqG1.mjs")
	},
	"d732dbd0324b5de3cd27374b91a2d4196cd6a42ec4166af82f02cfbf6319a58a": {
		functionName: "sendTestEmail_createServerFn_handler",
		importer: () => import("./_ssr/email.functions-DmAPUqG1.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
