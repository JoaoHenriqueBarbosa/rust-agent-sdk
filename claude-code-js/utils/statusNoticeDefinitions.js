// Original: src/utils/statusNoticeDefinitions.tsx
import { relative as relative25 } from "path";
function getActiveNotices(context7) {
  return statusNoticeDefinitions.filter((notice) => notice.isActive(context7));
}
var jsx_dev_runtime263, largeMemoryFilesNotice, claudeAiSubscriberExternalTokenNotice, apiKeyConflictNotice, bothAuthMethodsNotice, largeAgentDescriptionsNotice, jetbrainsPluginNotice, statusNoticeDefinitions;
var init_statusNoticeDefinitions = __esm(() => {
  init_ink2();
  init_claudemd();
  init_figures();
  init_cwd2();
  init_format();
  init_auth14();
  init_statusNoticeHelpers();
  init_ide();
  init_jetbrains();
  jsx_dev_runtime263 = __toESM(require_react_jsx_dev_runtime_development(), 1), largeMemoryFilesNotice = {
    id: "large-memory-files",
    type: "warning",
    isActive: (ctx) => getLargeMemoryFiles(ctx.memoryFiles).length > 0,
    render: (ctx) => {
      let largeMemoryFiles = getLargeMemoryFiles(ctx.memoryFiles);
      return /* @__PURE__ */ jsx_dev_runtime263.jsxDEV(jsx_dev_runtime263.Fragment, {
        children: largeMemoryFiles.map((file2) => {
          let displayPath = file2.path.startsWith(getCwd()) ? relative25(getCwd(), file2.path) : file2.path;
          return /* @__PURE__ */ jsx_dev_runtime263.jsxDEV(ThemedBox_default, {
            flexDirection: "row",
            children: [
              /* @__PURE__ */ jsx_dev_runtime263.jsxDEV(ThemedText, {
                color: "warning",
                children: figures_default.warning
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime263.jsxDEV(ThemedText, {
                color: "warning",
                children: [
                  "Large ",
                  /* @__PURE__ */ jsx_dev_runtime263.jsxDEV(ThemedText, {
                    bold: !0,
                    children: displayPath
                  }, void 0, !1, void 0, this),
                  " will impact performance (",
                  formatNumber(file2.content.length),
                  " chars >",
                  " ",
                  formatNumber(MAX_MEMORY_CHARACTER_COUNT),
                  ")",
                  /* @__PURE__ */ jsx_dev_runtime263.jsxDEV(ThemedText, {
                    dimColor: !0,
                    children: " \xB7 /memory to edit"
                  }, void 0, !1, void 0, this)
                ]
              }, void 0, !0, void 0, this)
            ]
          }, file2.path, !0, void 0, this);
        })
      }, void 0, !1, void 0, this);
    }
  }, claudeAiSubscriberExternalTokenNotice = {
    id: "claude-ai-external-token",
    type: "warning",
    isActive: () => {
      let authTokenInfo = getAuthTokenSource();
      return isClaudeAISubscriber() && (authTokenInfo.source === "ANTHROPIC_AUTH_TOKEN" || authTokenInfo.source === "apiKeyHelper");
    },
    render: () => {
      let authTokenInfo = getAuthTokenSource();
      return /* @__PURE__ */ jsx_dev_runtime263.jsxDEV(ThemedBox_default, {
        flexDirection: "row",
        marginTop: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime263.jsxDEV(ThemedText, {
            color: "warning",
            children: figures_default.warning
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime263.jsxDEV(ThemedText, {
            color: "warning",
            children: [
              "Auth conflict: Using ",
              authTokenInfo.source,
              " instead of Claude account subscription token. Either unset ",
              authTokenInfo.source,
              ", or run `claude /logout`."
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this);
    }
  }, apiKeyConflictNotice = {
    id: "api-key-conflict",
    type: "warning",
    isActive: () => {
      let {
        source: apiKeySource
      } = getAnthropicApiKeyWithSource({
        skipRetrievingKeyFromApiKeyHelper: !0
      });
      return !!getApiKeyFromConfigOrMacOSKeychain() && (apiKeySource === "ANTHROPIC_API_KEY" || apiKeySource === "apiKeyHelper");
    },
    render: () => {
      let {
        source: apiKeySource
      } = getAnthropicApiKeyWithSource({
        skipRetrievingKeyFromApiKeyHelper: !0
      });
      return /* @__PURE__ */ jsx_dev_runtime263.jsxDEV(ThemedBox_default, {
        flexDirection: "row",
        marginTop: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime263.jsxDEV(ThemedText, {
            color: "warning",
            children: figures_default.warning
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime263.jsxDEV(ThemedText, {
            color: "warning",
            children: [
              "Auth conflict: Using ",
              apiKeySource,
              " instead of Anthropic Console key. Either unset ",
              apiKeySource,
              ", or run `claude /logout`."
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this);
    }
  }, bothAuthMethodsNotice = {
    id: "both-auth-methods",
    type: "warning",
    isActive: () => {
      let {
        source: apiKeySource
      } = getAnthropicApiKeyWithSource({
        skipRetrievingKeyFromApiKeyHelper: !0
      }), authTokenInfo = getAuthTokenSource();
      return apiKeySource !== "none" && authTokenInfo.source !== "none" && !(apiKeySource === "apiKeyHelper" && authTokenInfo.source === "apiKeyHelper");
    },
    render: () => {
      let {
        source: apiKeySource
      } = getAnthropicApiKeyWithSource({
        skipRetrievingKeyFromApiKeyHelper: !0
      }), authTokenInfo = getAuthTokenSource();
      return /* @__PURE__ */ jsx_dev_runtime263.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        marginTop: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime263.jsxDEV(ThemedBox_default, {
            flexDirection: "row",
            children: [
              /* @__PURE__ */ jsx_dev_runtime263.jsxDEV(ThemedText, {
                color: "warning",
                children: figures_default.warning
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime263.jsxDEV(ThemedText, {
                color: "warning",
                children: [
                  "Auth conflict: Both a token (",
                  authTokenInfo.source,
                  ") and an API key (",
                  apiKeySource,
                  ") are set. This may lead to unexpected behavior."
                ]
              }, void 0, !0, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime263.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            marginLeft: 3,
            children: [
              /* @__PURE__ */ jsx_dev_runtime263.jsxDEV(ThemedText, {
                color: "warning",
                children: [
                  "\xB7 Trying to use",
                  " ",
                  authTokenInfo.source === "claude.ai" ? "claude.ai" : authTokenInfo.source,
                  "?",
                  " ",
                  apiKeySource === "ANTHROPIC_API_KEY" ? 'Unset the ANTHROPIC_API_KEY environment variable, or claude /logout then say "No" to the API key approval before login.' : apiKeySource === "apiKeyHelper" ? "Unset the apiKeyHelper setting." : "claude /logout"
                ]
              }, void 0, !0, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime263.jsxDEV(ThemedText, {
                color: "warning",
                children: [
                  "\xB7 Trying to use ",
                  apiKeySource,
                  "?",
                  " ",
                  authTokenInfo.source === "claude.ai" ? "claude /logout to sign out of claude.ai." : `Unset the ${authTokenInfo.source} environment variable.`
                ]
              }, void 0, !0, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this);
    }
  }, largeAgentDescriptionsNotice = {
    id: "large-agent-descriptions",
    type: "warning",
    isActive: (context7) => {
      return getAgentDescriptionsTotalTokens(context7.agentDefinitions) > AGENT_DESCRIPTIONS_THRESHOLD;
    },
    render: (context7) => {
      let totalTokens = getAgentDescriptionsTotalTokens(context7.agentDefinitions);
      return /* @__PURE__ */ jsx_dev_runtime263.jsxDEV(ThemedBox_default, {
        flexDirection: "row",
        children: [
          /* @__PURE__ */ jsx_dev_runtime263.jsxDEV(ThemedText, {
            color: "warning",
            children: figures_default.warning
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime263.jsxDEV(ThemedText, {
            color: "warning",
            children: [
              "Large cumulative agent descriptions will impact performance (~",
              formatNumber(totalTokens),
              " tokens >",
              " ",
              formatNumber(AGENT_DESCRIPTIONS_THRESHOLD),
              ")",
              /* @__PURE__ */ jsx_dev_runtime263.jsxDEV(ThemedText, {
                dimColor: !0,
                children: " \xB7 /agents to manage"
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this);
    }
  }, jetbrainsPluginNotice = {
    id: "jetbrains-plugin-install",
    type: "info",
    isActive: (context7) => {
      if (!isSupportedJetBrainsTerminal())
        return !1;
      if (!(context7.config.autoInstallIdeExtension ?? !0))
        return !1;
      let ideType = getTerminalIdeType();
      return ideType !== null && !isJetBrainsPluginInstalledCachedSync(ideType);
    },
    render: () => {
      let ideType = getTerminalIdeType(), ideName = toIDEDisplayName(ideType);
      return /* @__PURE__ */ jsx_dev_runtime263.jsxDEV(ThemedBox_default, {
        flexDirection: "row",
        gap: 1,
        marginLeft: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime263.jsxDEV(ThemedText, {
            color: "ide",
            children: figures_default.arrowUp
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime263.jsxDEV(ThemedText, {
            children: [
              "Install the ",
              /* @__PURE__ */ jsx_dev_runtime263.jsxDEV(ThemedText, {
                color: "ide",
                children: ideName
              }, void 0, !1, void 0, this),
              " plugin from the JetBrains Marketplace:",
              " ",
              /* @__PURE__ */ jsx_dev_runtime263.jsxDEV(ThemedText, {
                bold: !0,
                children: "https://docs.claude.com/s/claude-code-jetbrains"
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this);
    }
  }, statusNoticeDefinitions = [largeMemoryFilesNotice, largeAgentDescriptionsNotice, claudeAiSubscriberExternalTokenNotice, apiKeyConflictNotice, bothAuthMethodsNotice, jetbrainsPluginNotice];
});
