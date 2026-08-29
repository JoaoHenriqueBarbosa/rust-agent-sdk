// Original: src/upstreamproxy/upstreamproxy.ts
var exports_upstreamproxy = {};
__export(exports_upstreamproxy, {
  resetUpstreamProxyForTests: () => resetUpstreamProxyForTests,
  initUpstreamProxy: () => initUpstreamProxy,
  getUpstreamProxyEnv: () => getUpstreamProxyEnv,
  SESSION_TOKEN_PATH: () => SESSION_TOKEN_PATH
});
import { mkdir as mkdir41, readFile as readFile53, unlink as unlink23, writeFile as writeFile45 } from "fs/promises";
import { homedir as homedir36 } from "os";
import { join as join140 } from "path";
async function initUpstreamProxy(opts) {
  if (!isEnvTruthy(process.env.CLAUDE_CODE_REMOTE))
    return state3;
  if (!isEnvTruthy(process.env.CCR_UPSTREAM_PROXY_ENABLED))
    return state3;
  let sessionId = process.env.CLAUDE_CODE_REMOTE_SESSION_ID;
  if (!sessionId)
    return logForDebugging("[upstreamproxy] CLAUDE_CODE_REMOTE_SESSION_ID unset; proxy disabled", { level: "warn" }), state3;
  let tokenPath = opts?.tokenPath ?? SESSION_TOKEN_PATH, token = await readToken(tokenPath);
  if (!token)
    return logForDebugging("[upstreamproxy] no session token file; proxy disabled"), state3;
  setNonDumpable();
  let baseUrl = opts?.ccrBaseUrl ?? process.env.ANTHROPIC_BASE_URL ?? "https://api.anthropic.com", caBundlePath = opts?.caBundlePath ?? join140(homedir36(), ".ccr", "ca-bundle.crt");
  if (!await downloadCaBundle(baseUrl, opts?.systemCaPath ?? SYSTEM_CA_BUNDLE, caBundlePath))
    return state3;
  try {
    let wsUrl = baseUrl.replace(/^http/, "ws") + "/v1/code/upstreamproxy/ws", relay = await startUpstreamProxyRelay({ wsUrl, sessionId, token });
    registerCleanup(async () => relay.stop()), state3 = { enabled: !0, port: relay.port, caBundlePath }, logForDebugging(`[upstreamproxy] enabled on 127.0.0.1:${relay.port}`), await unlink23(tokenPath).catch(() => {
      logForDebugging("[upstreamproxy] token file unlink failed", {
        level: "warn"
      });
    });
  } catch (err2) {
    logForDebugging(`[upstreamproxy] relay start failed: ${err2 instanceof Error ? err2.message : String(err2)}; proxy disabled`, { level: "warn" });
  }
  return state3;
}
function getUpstreamProxyEnv() {
  if (!state3.enabled || !state3.port || !state3.caBundlePath) {
    if (process.env.HTTPS_PROXY && process.env.SSL_CERT_FILE) {
      let inherited = {};
      for (let key3 of [
        "HTTPS_PROXY",
        "https_proxy",
        "NO_PROXY",
        "no_proxy",
        "SSL_CERT_FILE",
        "NODE_EXTRA_CA_CERTS",
        "REQUESTS_CA_BUNDLE",
        "CURL_CA_BUNDLE"
      ])
        if (process.env[key3])
          inherited[key3] = process.env[key3];
      return inherited;
    }
    return {};
  }
  let proxyUrl = `http://127.0.0.1:${state3.port}`;
  return {
    HTTPS_PROXY: proxyUrl,
    https_proxy: proxyUrl,
    NO_PROXY: NO_PROXY_LIST,
    no_proxy: NO_PROXY_LIST,
    SSL_CERT_FILE: state3.caBundlePath,
    NODE_EXTRA_CA_CERTS: state3.caBundlePath,
    REQUESTS_CA_BUNDLE: state3.caBundlePath,
    CURL_CA_BUNDLE: state3.caBundlePath
  };
}
function resetUpstreamProxyForTests() {
  state3 = { enabled: !1 };
}
async function readToken(path25) {
  try {
    return (await readFile53(path25, "utf8")).trim() || null;
  } catch (err2) {
    if (isENOENT(err2))
      return null;
    return logForDebugging(`[upstreamproxy] token read failed: ${err2 instanceof Error ? err2.message : String(err2)}`, { level: "warn" }), null;
  }
}
function setNonDumpable() {
  if (process.platform !== "linux" || typeof Bun > "u")
    return;
  try {
    let lib = __require("bun:ffi").dlopen("libc.so.6", {
      prctl: {
        args: ["int", "u64", "u64", "u64", "u64"],
        returns: "int"
      }
    }), PR_SET_DUMPABLE = 4;
    if (lib.symbols.prctl(4, 0n, 0n, 0n, 0n) !== 0)
      logForDebugging("[upstreamproxy] prctl(PR_SET_DUMPABLE,0) returned nonzero", {
        level: "warn"
      });
  } catch (err2) {
    logForDebugging(`[upstreamproxy] prctl unavailable: ${err2 instanceof Error ? err2.message : String(err2)}`, { level: "warn" });
  }
}
async function downloadCaBundle(baseUrl, systemCaPath, outPath) {
  try {
    let resp = await fetch(`${baseUrl}/v1/code/upstreamproxy/ca-cert`, {
      signal: AbortSignal.timeout(5000)
    });
    if (!resp.ok)
      return logForDebugging(`[upstreamproxy] ca-cert fetch ${resp.status}; proxy disabled`, { level: "warn" }), !1;
    let ccrCa = await resp.text(), systemCa = await readFile53(systemCaPath, "utf8").catch(() => "");
    return await mkdir41(join140(outPath, ".."), { recursive: !0 }), await writeFile45(outPath, systemCa + `
` + ccrCa, "utf8"), !0;
  } catch (err2) {
    return logForDebugging(`[upstreamproxy] ca-cert download failed: ${err2 instanceof Error ? err2.message : String(err2)}; proxy disabled`, { level: "warn" }), !1;
  }
}
var SESSION_TOKEN_PATH = "/run/ccr/session_token", SYSTEM_CA_BUNDLE = "/etc/ssl/certs/ca-certificates.crt", NO_PROXY_LIST, state3;
var init_upstreamproxy = __esm(() => {
  init_cleanupRegistry();
  init_debug();
  init_envUtils();
  init_errors();
  init_relay();
  NO_PROXY_LIST = [
    "localhost",
    "127.0.0.1",
    "::1",
    "169.254.0.0/16",
    "10.0.0.0/8",
    "172.16.0.0/12",
    "192.168.0.0/16",
    "anthropic.com",
    ".anthropic.com",
    "*.anthropic.com",
    "github.com",
    "api.github.com",
    "*.github.com",
    "*.githubusercontent.com",
    "registry.npmjs.org",
    "pypi.org",
    "files.pythonhosted.org",
    "index.crates.io",
    "proxy.golang.org"
  ].join(","), state3 = { enabled: !1 };
});
