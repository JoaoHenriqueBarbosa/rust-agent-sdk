// Original: src/utils/status.tsx
function buildSandboxProperties() {
  return [];
}
function buildIDEProperties(mcpClients, ideInstallationStatus = null, theme) {
  let ideClient = mcpClients?.find((client15) => client15.name === "ide");
  if (ideInstallationStatus) {
    let ideName = toIDEDisplayName(ideInstallationStatus.ideType), pluginOrExtension = isJetBrainsIde(ideInstallationStatus.ideType) ? "plugin" : "extension";
    if (ideInstallationStatus.error)
      return [{
        label: "IDE",
        value: /* @__PURE__ */ jsx_dev_runtime61.jsxDEV(ThemedText, {
          children: [
            color("error", theme)(figures_default.cross),
            " Error installing ",
            ideName,
            " ",
            pluginOrExtension,
            ": ",
            ideInstallationStatus.error,
            `
`,
            "Please restart your IDE and try again."
          ]
        }, void 0, !0, void 0, this)
      }];
    if (ideInstallationStatus.installed)
      if (ideClient && ideClient.type === "connected")
        if (ideInstallationStatus.installedVersion !== ideClient.serverInfo?.version)
          return [{
            label: "IDE",
            value: `Connected to ${ideName} ${pluginOrExtension} version ${ideInstallationStatus.installedVersion} (server version: ${ideClient.serverInfo?.version})`
          }];
        else
          return [{
            label: "IDE",
            value: `Connected to ${ideName} ${pluginOrExtension} version ${ideInstallationStatus.installedVersion}`
          }];
      else
        return [{
          label: "IDE",
          value: `Installed ${ideName} ${pluginOrExtension}`
        }];
  } else if (ideClient) {
    let ideName = getIdeClientName(ideClient) ?? "IDE";
    if (ideClient.type === "connected")
      return [{
        label: "IDE",
        value: `Connected to ${ideName} extension`
      }];
    else
      return [{
        label: "IDE",
        value: `${color("error", theme)(figures_default.cross)} Not connected to ${ideName}`
      }];
  }
  return [];
}
function buildMcpProperties(clients = [], theme) {
  let servers = clients.filter((client15) => client15.name !== "ide");
  if (!servers.length)
    return [];
  let byState = {
    connected: 0,
    pending: 0,
    needsAuth: 0,
    failed: 0
  };
  for (let s2 of servers)
    if (s2.type === "connected")
      byState.connected++;
    else if (s2.type === "pending")
      byState.pending++;
    else if (s2.type === "needs-auth")
      byState.needsAuth++;
    else
      byState.failed++;
  let parts = [];
  if (byState.connected)
    parts.push(color("success", theme)(`${byState.connected} connected`));
  if (byState.needsAuth)
    parts.push(color("warning", theme)(`${byState.needsAuth} need auth`));
  if (byState.pending)
    parts.push(color("inactive", theme)(`${byState.pending} pending`));
  if (byState.failed)
    parts.push(color("error", theme)(`${byState.failed} failed`));
  return [{
    label: "MCP servers",
    value: `${parts.join(", ")} ${color("inactive", theme)("\xB7 /mcp")}`
  }];
}
async function buildMemoryDiagnostics() {
  let files2 = await getMemoryFiles(), largeFiles = getLargeMemoryFiles(files2), diagnostics = [];
  return largeFiles.forEach((file2) => {
    let displayPath = getDisplayPath(file2.path);
    diagnostics.push(`Large ${displayPath} will impact performance (${formatNumber(file2.content.length)} chars > ${formatNumber(MAX_MEMORY_CHARACTER_COUNT)})`);
  }), diagnostics;
}
function buildSettingSourcesProperties() {
  return [{
    label: "Setting sources",
    value: getEnabledSettingSources().filter((source) => {
      let settings = getSettingsForSource(source);
      return settings !== null && Object.keys(settings).length > 0;
    }).map((source) => {
      if (source === "policySettings") {
        let origin2 = getPolicySettingsOrigin();
        if (origin2 === null)
          return null;
        switch (origin2) {
          case "remote":
            return "Enterprise managed settings (remote)";
          case "plist":
            return "Enterprise managed settings (plist)";
          case "hklm":
            return "Enterprise managed settings (HKLM)";
          case "file": {
            let {
              hasBase,
              hasDropIns
            } = getManagedFileSettingsPresence();
            if (hasBase && hasDropIns)
              return "Enterprise managed settings (file + drop-ins)";
            if (hasDropIns)
              return "Enterprise managed settings (drop-ins)";
            return "Enterprise managed settings (file)";
          }
          case "hkcu":
            return "Enterprise managed settings (HKCU)";
        }
      }
      return getSettingSourceDisplayNameCapitalized(source);
    }).filter((name3) => name3 !== null)
  }];
}
async function buildInstallationDiagnostics() {
  return (await checkInstall()).map((warning) => warning.message);
}
async function buildInstallationHealthDiagnostics() {
  let diagnostic = await getDoctorDiagnostic(), items = [], {
    errors: validationErrors
  } = getSettingsWithAllErrors();
  if (validationErrors.length > 0) {
    let fileList = Array.from(new Set(validationErrors.map((error44) => error44.file))).join(", ");
    items.push(`Found invalid settings files: ${fileList}. They will be ignored.`);
  }
  if (diagnostic.warnings.forEach((warning) => {
    items.push(warning.issue);
  }), diagnostic.hasUpdatePermissions === !1)
    items.push("No write permissions for auto-updates (requires sudo)");
  return items;
}
function buildAccountProperties() {
  let accountInfo = getAccountInformation();
  if (!accountInfo)
    return [];
  let properties = [];
  if (accountInfo.subscription)
    properties.push({
      label: "Login method",
      value: `${accountInfo.subscription} Account`
    });
  if (accountInfo.tokenSource)
    properties.push({
      label: "Auth token",
      value: accountInfo.tokenSource
    });
  if (accountInfo.apiKeySource)
    properties.push({
      label: "API key",
      value: accountInfo.apiKeySource
    });
  if (accountInfo.organization && !process.env.IS_DEMO)
    properties.push({
      label: "Organization",
      value: accountInfo.organization
    });
  if (accountInfo.email && !process.env.IS_DEMO)
    properties.push({
      label: "Email",
      value: accountInfo.email
    });
  return properties;
}
function buildAPIProviderProperties() {
  let apiProvider = getAPIProvider(), properties = [];
  if (apiProvider !== "firstParty") {
    let providerLabel = {
      bedrock: "AWS Bedrock",
      vertex: "Google Vertex AI",
      foundry: "Microsoft Foundry"
    }[apiProvider];
    properties.push({
      label: "API provider",
      value: providerLabel
    });
  }
  if (apiProvider === "firstParty") {
    let anthropicBaseUrl = process.env.ANTHROPIC_BASE_URL;
    if (anthropicBaseUrl)
      properties.push({
        label: "Anthropic base URL",
        value: anthropicBaseUrl
      });
  } else if (apiProvider === "bedrock") {
    let bedrockBaseUrl = process.env.BEDROCK_BASE_URL;
    if (bedrockBaseUrl)
      properties.push({
        label: "Bedrock base URL",
        value: bedrockBaseUrl
      });
    if (properties.push({
      label: "AWS region",
      value: getAWSRegion()
    }), isEnvTruthy(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH))
      properties.push({
        value: "AWS auth skipped"
      });
  } else if (apiProvider === "vertex") {
    let vertexBaseUrl = process.env.VERTEX_BASE_URL;
    if (vertexBaseUrl)
      properties.push({
        label: "Vertex base URL",
        value: vertexBaseUrl
      });
    let gcpProject = process.env.ANTHROPIC_VERTEX_PROJECT_ID;
    if (gcpProject)
      properties.push({
        label: "GCP project",
        value: gcpProject
      });
    if (properties.push({
      label: "Default region",
      value: getDefaultVertexRegion()
    }), isEnvTruthy(process.env.CLAUDE_CODE_SKIP_VERTEX_AUTH))
      properties.push({
        value: "GCP auth skipped"
      });
  } else if (apiProvider === "foundry") {
    let foundryBaseUrl = process.env.ANTHROPIC_FOUNDRY_BASE_URL;
    if (foundryBaseUrl)
      properties.push({
        label: "Microsoft Foundry base URL",
        value: foundryBaseUrl
      });
    let foundryResource = process.env.ANTHROPIC_FOUNDRY_RESOURCE;
    if (foundryResource)
      properties.push({
        label: "Microsoft Foundry resource",
        value: foundryResource
      });
    if (isEnvTruthy(process.env.CLAUDE_CODE_SKIP_FOUNDRY_AUTH))
      properties.push({
        value: "Microsoft Foundry auth skipped"
      });
  }
  let proxyUrl = getProxyUrl();
  if (proxyUrl)
    properties.push({
      label: "Proxy",
      value: proxyUrl
    });
  let mtlsConfig = getMTLSConfig();
  if (process.env.NODE_EXTRA_CA_CERTS)
    properties.push({
      label: "Additional CA cert(s)",
      value: process.env.NODE_EXTRA_CA_CERTS
    });
  if (mtlsConfig) {
    if (mtlsConfig.cert && process.env.CLAUDE_CODE_CLIENT_CERT)
      properties.push({
        label: "mTLS client cert",
        value: process.env.CLAUDE_CODE_CLIENT_CERT
      });
    if (mtlsConfig.key && process.env.CLAUDE_CODE_CLIENT_KEY)
      properties.push({
        label: "mTLS client key",
        value: process.env.CLAUDE_CODE_CLIENT_KEY
      });
  }
  return properties;
}
function getModelDisplayLabel(mainLoopModel) {
  let modelLabel = modelDisplayString(mainLoopModel);
  if (mainLoopModel === null && isClaudeAISubscriber()) {
    let description = getClaudeAiUserDefaultModelDescription();
    modelLabel = `${source_default.bold("Default")} ${description}`;
  }
  return modelLabel;
}
var jsx_dev_runtime61;
var init_status = __esm(() => {
  init_source();
  init_figures();
  init_ink2();
  init_auth14();
  init_claudemd();
  init_doctorDiagnostic();
  init_envUtils();
  init_file();
  init_format();
  init_ide();
  init_model();
  init_providers();
  init_mtls();
  init_nativeInstaller();
  init_proxy();
  init_sandbox_adapter();
  init_allErrors();
  init_constants2();
  init_settings2();
  jsx_dev_runtime61 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
