// Original: src/tools/WebFetchTool/utils.ts
var exports_utils2 = {};
__export(exports_utils2, {
  validateURL: () => validateURL,
  isPreapprovedUrl: () => isPreapprovedUrl,
  isPermittedRedirect: () => isPermittedRedirect,
  getWithPermittedRedirects: () => getWithPermittedRedirects,
  getURLMarkdownContent: () => getURLMarkdownContent,
  clearWebFetchCache: () => clearWebFetchCache,
  checkDomainBlocklist: () => checkDomainBlocklist,
  applyPromptToMarkdown: () => applyPromptToMarkdown,
  MAX_MARKDOWN_LENGTH: () => MAX_MARKDOWN_LENGTH
});
function clearWebFetchCache() {
  URL_CACHE.clear(), DOMAIN_CHECK_CACHE.clear();
}
function getTurndownService() {
  return turndownServicePromise ??= Promise.resolve().then(() => (init_turndown_es(), exports_turndown_es)).then((m4) => {
    return new m4.default;
  });
}
function isPreapprovedUrl(url3) {
  try {
    let parsedUrl = new URL(url3);
    return isPreapprovedHost(parsedUrl.hostname, parsedUrl.pathname);
  } catch {
    return !1;
  }
}
function validateURL(url3) {
  if (url3.length > MAX_URL_LENGTH)
    return !1;
  let parsed;
  try {
    parsed = new URL(url3);
  } catch {
    return !1;
  }
  if (parsed.username || parsed.password)
    return !1;
  if (parsed.hostname.split(".").length < 2)
    return !1;
  return !0;
}
async function checkDomainBlocklist(_domain) {
  return { status: "allowed" };
}
function isPermittedRedirect(originalUrl, redirectUrl) {
  try {
    let parsedOriginal = new URL(originalUrl), parsedRedirect = new URL(redirectUrl);
    if (parsedRedirect.protocol !== parsedOriginal.protocol)
      return !1;
    if (parsedRedirect.port !== parsedOriginal.port)
      return !1;
    if (parsedRedirect.username || parsedRedirect.password)
      return !1;
    let stripWww = (hostname2) => hostname2.replace(/^www\./, ""), originalHostWithoutWww = stripWww(parsedOriginal.hostname), redirectHostWithoutWww = stripWww(parsedRedirect.hostname);
    return originalHostWithoutWww === redirectHostWithoutWww;
  } catch (_error) {
    return !1;
  }
}
async function getWithPermittedRedirects(url3, signal, redirectChecker, depth = 0) {
  if (depth > MAX_REDIRECTS)
    throw Error(`Too many redirects (exceeded ${MAX_REDIRECTS})`);
  try {
    return await axios_default.get(url3, {
      signal,
      timeout: FETCH_TIMEOUT_MS3,
      maxRedirects: 0,
      responseType: "arraybuffer",
      maxContentLength: MAX_HTTP_CONTENT_LENGTH,
      headers: {
        Accept: "text/markdown, text/html, */*",
        "User-Agent": getWebFetchUserAgent()
      }
    });
  } catch (error44) {
    if (axios_default.isAxiosError(error44) && error44.response && [301, 302, 307, 308].includes(error44.response.status)) {
      let redirectLocation = error44.response.headers.location;
      if (!redirectLocation)
        throw Error("Redirect missing Location header");
      let redirectUrl = new URL(redirectLocation, url3).toString();
      if (redirectChecker(url3, redirectUrl))
        return getWithPermittedRedirects(redirectUrl, signal, redirectChecker, depth + 1);
      else
        return {
          type: "redirect",
          originalUrl: url3,
          redirectUrl,
          statusCode: error44.response.status
        };
    }
    if (axios_default.isAxiosError(error44) && error44.response?.status === 403 && error44.response.headers["x-proxy-error"] === "blocked-by-allowlist") {
      let hostname2 = new URL(url3).hostname;
      throw new EgressBlockedError(hostname2);
    }
    throw error44;
  }
}
function isRedirectInfo(response7) {
  return "type" in response7 && response7.type === "redirect";
}
async function getURLMarkdownContent(url3, abortController) {
  if (!validateURL(url3))
    throw Error("Invalid URL");
  let cachedEntry = URL_CACHE.get(url3);
  if (cachedEntry)
    return {
      bytes: cachedEntry.bytes,
      code: cachedEntry.code,
      codeText: cachedEntry.codeText,
      content: cachedEntry.content,
      contentType: cachedEntry.contentType,
      persistedPath: cachedEntry.persistedPath,
      persistedSize: cachedEntry.persistedSize
    };
  let parsedUrl, upgradedUrl = url3;
  try {
    if (parsedUrl = new URL(url3), parsedUrl.protocol === "http:")
      parsedUrl.protocol = "https:", upgradedUrl = parsedUrl.toString();
    let hostname2 = parsedUrl.hostname;
    if (!getSettings_DEPRECATED().skipWebFetchPreflight)
      switch ((await checkDomainBlocklist(hostname2)).status) {
        case "allowed":
          break;
        case "blocked":
          throw new DomainBlockedError(hostname2);
        case "check_failed":
          throw new DomainCheckFailedError(hostname2);
      }
  } catch (e) {
    if (e instanceof DomainBlockedError || e instanceof DomainCheckFailedError)
      throw e;
    logError2(e);
  }
  let response7 = await getWithPermittedRedirects(upgradedUrl, abortController.signal, isPermittedRedirect);
  if (isRedirectInfo(response7))
    return response7;
  let rawBuffer = Buffer.from(response7.data);
  response7.data = null;
  let contentType = response7.headers["content-type"] ?? "", persistedPath, persistedSize;
  if (isBinaryContentType(contentType)) {
    let persistId = `webfetch-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, result = await persistBinaryContent(rawBuffer, contentType, persistId);
    if (!("error" in result))
      persistedPath = result.filepath, persistedSize = result.size;
  }
  let bytes = rawBuffer.length, htmlContent = rawBuffer.toString("utf-8"), markdownContent, contentBytes;
  if (contentType.includes("text/html")) {
    let cleanHtml = htmlContent;
    try {
      let { document: document2 } = parseHTML(htmlContent);
      Object.defineProperty(document2, "baseURI", { value: upgradedUrl, configurable: !0 });
      let article = new import_readability.Readability(document2).parse();
      if (article?.content)
        cleanHtml = article.content;
    } catch {}
    markdownContent = (await getTurndownService()).turndown(cleanHtml), contentBytes = Buffer.byteLength(markdownContent);
  } else
    markdownContent = htmlContent, contentBytes = bytes;
  let entry = {
    bytes,
    code: response7.status,
    codeText: response7.statusText,
    content: markdownContent,
    contentType,
    persistedPath,
    persistedSize
  };
  return URL_CACHE.set(url3, entry, { size: Math.max(1, contentBytes) }), entry;
}
function looksLikeRefusal(text2) {
  return REFUSAL_PATTERNS.some((p4) => p4.test(text2));
}
async function applyPromptToMarkdown(prompt, markdownContent, signal, isNonInteractiveSession, isPreapprovedDomain) {
  let truncatedContent = markdownContent.length > MAX_MARKDOWN_LENGTH ? markdownContent.slice(0, MAX_MARKDOWN_LENGTH) + `

[Content truncated due to length...]` : markdownContent, modelPrompt = makeSecondaryModelPrompt(truncatedContent, prompt, isPreapprovedDomain), assistantMessage = await queryHaiku({
    systemPrompt: asSystemPrompt([]),
    userPrompt: modelPrompt,
    signal,
    options: {
      querySource: "web_fetch_apply",
      agents: [],
      isNonInteractiveSession,
      hasAppendSystemPrompt: !1,
      mcpTools: []
    }
  });
  if (signal.aborted)
    throw new AbortError;
  let { content } = assistantMessage.message, resultText = "No response from model";
  if (content.length > 0) {
    let contentBlock = content[0];
    if ("text" in contentBlock)
      resultText = contentBlock.text;
  }
  if (!getPromptOverrides().webFetchCopyright && looksLikeRefusal(resultText))
    return `[Secondary model refused to reproduce content \u2014 returning raw fetched content]

User prompt: ${prompt}

---

Fetched content:
${truncatedContent}`;
  return resultText;
}
var import_readability, DomainBlockedError, DomainCheckFailedError, EgressBlockedError, CACHE_TTL_MS2 = 900000, MAX_CACHE_SIZE_BYTES = 52428800, URL_CACHE, DOMAIN_CHECK_CACHE, turndownServicePromise, MAX_URL_LENGTH = 2000, MAX_HTTP_CONTENT_LENGTH = 10485760, FETCH_TIMEOUT_MS3 = 60000, MAX_REDIRECTS = 10, MAX_MARKDOWN_LENGTH = 1e5, REFUSAL_PATTERNS;
var init_utils15 = __esm(() => {
  init_axios2();
  init_index_min();
  init_claude();
  init_errors();
  init_http6();
  init_log3();
  init_mcpOutputStorage();
  init_settings2();
  init_promptOverrides();
  init_esm34();
  init_preapproved();
  init_prompt3();
  import_readability = __toESM(require_readability(), 1);
  DomainBlockedError = class DomainBlockedError extends Error {
    constructor(domain2) {
      super(`Claude Code is unable to fetch from ${domain2}`);
      this.name = "DomainBlockedError";
    }
  };
  DomainCheckFailedError = class DomainCheckFailedError extends Error {
    constructor(domain2) {
      super(`Unable to verify if domain ${domain2} is safe to fetch. This may be due to network restrictions or enterprise security policies blocking claude.ai.`);
      this.name = "DomainCheckFailedError";
    }
  };
  EgressBlockedError = class EgressBlockedError extends Error {
    domain;
    constructor(domain2) {
      super(JSON.stringify({
        error_type: "EGRESS_BLOCKED",
        domain: domain2,
        message: `Access to ${domain2} is blocked by the network egress proxy.`
      }));
      this.domain = domain2;
      this.name = "EgressBlockedError";
    }
  };
  URL_CACHE = new L({
    maxSize: MAX_CACHE_SIZE_BYTES,
    ttl: CACHE_TTL_MS2
  }), DOMAIN_CHECK_CACHE = new L({
    max: 128,
    ttl: 300000
  });
  REFUSAL_PATTERNS = [
    /copyright/i,
    /protected by/i,
    /can'?t reproduce/i,
    /unable to reproduce/i,
    /can'?t provide the (full|complete|exact)/i,
    /unable to provide the (full|complete|exact)/i,
    /I'?m not able to/i,
    /instead.*(visit|check|go to|see)/i,
    /owned by.*publishers?/i,
    /cannot (share|copy|reproduce|provide)/i,
    /recommend visiting/i,
    /officially hosted/i
  ];
});
