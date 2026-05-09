// Original: src/utils/aws.ts
function isAwsCredentialsProviderError(err) {
  return err?.name === "CredentialsProviderError";
}
function isValidAwsStsOutput(obj) {
  if (!obj || typeof obj !== "object")
    return !1;
  let output = obj;
  if (!output.Credentials || typeof output.Credentials !== "object")
    return !1;
  let credentials = output.Credentials;
  return typeof credentials.AccessKeyId === "string" && typeof credentials.SecretAccessKey === "string" && typeof credentials.SessionToken === "string" && credentials.AccessKeyId.length > 0 && credentials.SecretAccessKey.length > 0 && credentials.SessionToken.length > 0;
}
async function checkStsCallerIdentity() {
  let { STSClient: STSClient4, GetCallerIdentityCommand: GetCallerIdentityCommand3 } = await Promise.resolve().then(() => (init_dist_es45(), exports_dist_es15));
  await new STSClient4().send(new GetCallerIdentityCommand3({}));
}
async function clearAwsIniCache() {
  try {
    logForDebugging("Clearing AWS credential provider cache");
    let { fromIni: fromIni5 } = await Promise.resolve().then(() => (init_dist_es47(), exports_dist_es16));
    await fromIni5({ ignoreCache: !0 })(), logForDebugging("AWS credential provider cache refreshed");
  } catch (_error) {
    logForDebugging("Failed to clear AWS credential cache (this is expected if no credentials are configured)");
  }
}
var init_aws = __esm(() => {
  init_debug();
});
