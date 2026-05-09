// function: checkGcpCredentialsValid
async function checkGcpCredentialsValid() {
  try {
    let { GoogleAuth: GoogleAuth2 } = await Promise.resolve().then(() => __toESM(require_src6(), 1)), auth13 = new GoogleAuth2({
      scopes: ["https://www.googleapis.com/auth/cloud-platform"]
    }), probe = (async () => {
      await (await auth13.getClient()).getAccessToken();
    })(), timeout = sleep3(GCP_CREDENTIALS_CHECK_TIMEOUT_MS).then(() => {
      throw new GcpCredentialsTimeoutError("GCP credentials check timed out");
    });
    return await Promise.race([probe, timeout]), !0;
  } catch {
    return !1;
  }
}
