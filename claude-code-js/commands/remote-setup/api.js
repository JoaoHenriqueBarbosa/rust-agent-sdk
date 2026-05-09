// Original: src/commands/remote-setup/api.ts
async function importGithubToken(token) {
  let accessToken, orgUUID;
  try {
    ({ accessToken, orgUUID } = await prepareApiRequest());
  } catch {
    return { ok: !1, error: { kind: "not_signed_in" } };
  }
  let url3 = `${getOauthConfig().BASE_API_URL}/v1/code/github/import-token`, headers = {
    ...getOAuthHeaders(accessToken),
    "anthropic-beta": CCR_BYOC_BETA_HEADER,
    "x-organization-uuid": orgUUID
  };
  try {
    let response7 = await axios_default.post(url3, { token: token.reveal() }, { headers, timeout: 15000, validateStatus: () => !0 });
    if (response7.status === 200)
      return { ok: !0, result: response7.data };
    if (response7.status === 400)
      return { ok: !1, error: { kind: "invalid_token" } };
    if (response7.status === 401)
      return { ok: !1, error: { kind: "not_signed_in" } };
    return logForDebugging(`import-token returned ${response7.status}`, {
      level: "error"
    }), { ok: !1, error: { kind: "server", status: response7.status } };
  } catch (err2) {
    if (axios_default.isAxiosError(err2))
      logForDebugging(`import-token network error: ${err2.code ?? "unknown"}`, {
        level: "error"
      });
    return { ok: !1, error: { kind: "network" } };
  }
}
async function hasExistingEnvironment() {
  try {
    return (await fetchEnvironments()).length > 0;
  } catch {
    return !1;
  }
}
async function createDefaultEnvironment() {
  let accessToken, orgUUID;
  try {
    ({ accessToken, orgUUID } = await prepareApiRequest());
  } catch {
    return !1;
  }
  if (await hasExistingEnvironment())
    return !0;
  let url3 = `${getOauthConfig().BASE_API_URL}/v1/environment_providers/cloud/create`, headers = {
    ...getOAuthHeaders(accessToken),
    "x-organization-uuid": orgUUID
  };
  try {
    let response7 = await axios_default.post(url3, {
      name: "Default",
      kind: "anthropic_cloud",
      description: "Default - trusted network access",
      config: {
        environment_type: "anthropic",
        cwd: "/home/user",
        init_script: null,
        environment: {},
        languages: [
          { name: "python", version: "3.11" },
          { name: "node", version: "20" }
        ],
        network_config: {
          allowed_hosts: [],
          allow_default_hosts: !0
        }
      }
    }, { headers, timeout: 15000, validateStatus: () => !0 });
    return response7.status >= 200 && response7.status < 300;
  } catch {
    return !1;
  }
}
async function isSignedIn() {
  try {
    return await prepareApiRequest(), !0;
  } catch {
    return !1;
  }
}
function getCodeWebUrl() {
  return `${getOauthConfig().CLAUDE_AI_ORIGIN}/code`;
}
var CCR_BYOC_BETA_HEADER = "ccr-byoc-2025-07-29", RedactedGithubToken;
var init_api3 = __esm(() => {
  init_axios2();
  init_oauth();
  init_debug();
  init_api2();
  init_environments();
  RedactedGithubToken = class RedactedGithubToken {
    #value;
    constructor(raw) {
      this.#value = raw;
    }
    reveal() {
      return this.#value;
    }
    toString() {
      return "[REDACTED:gh-token]";
    }
    toJSON() {
      return "[REDACTED:gh-token]";
    }
    [Symbol.for("nodejs.util.inspect.custom")]() {
      return "[REDACTED:gh-token]";
    }
  };
});
