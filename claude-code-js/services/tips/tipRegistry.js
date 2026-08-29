// Original: src/services/tips/tipRegistry.ts
async function isOfficialMarketplaceInstalled() {
  if (_isOfficialMarketplaceInstalledCache !== void 0)
    return _isOfficialMarketplaceInstalledCache;
  let config11 = await loadKnownMarketplacesConfigSafe();
  return _isOfficialMarketplaceInstalledCache = OFFICIAL_MARKETPLACE_NAME in config11, _isOfficialMarketplaceInstalledCache;
}
async function isMarketplacePluginRelevant(pluginName, context7, signals2) {
  if (!await isOfficialMarketplaceInstalled())
    return !1;
  if (isPluginInstalled(`${pluginName}@${OFFICIAL_MARKETPLACE_NAME}`))
    return !1;
  let { bashTools } = context7 ?? {};
  if (signals2.cli && bashTools?.size) {
    if (signals2.cli.some((cmd) => bashTools.has(cmd)))
      return !0;
  }
  if (signals2.filePath && context7?.readFileState) {
    if (cacheKeys(context7.readFileState).some((fp) => signals2.filePath.test(fp)))
      return !0;
  }
  return !1;
}
function getCustomTips() {
  let override = getInitialSettings().spinnerTipsOverride;
  if (!override?.tips?.length)
    return [];
  return override.tips.map((content, i5) => ({
    id: `custom-tip-${i5}`,
    content: async () => content,
    cooldownSessions: 0,
    isRelevant: async () => !0
  }));
}
async function getRelevantTips(context7) {
  let override = getInitialSettings().spinnerTipsOverride, customTips = getCustomTips();
  if (override?.excludeDefault && customTips.length > 0)
    return customTips;
  let tips = [...externalTips, ...internalOnlyTips], isRelevant = await Promise.all(tips.map((_) => _.isRelevant(context7)));
  return [...tips.filter((_, index2) => isRelevant[index2]).filter((_) => getSessionsSinceLastShown(_.id) >= _.cooldownSessions), ...customTips];
}
var _isOfficialMarketplaceInstalledCache, externalTips, internalOnlyTips;
var init_tipRegistry = __esm(() => {
  init_source();
  init_debug();
  init_fileHistory();
  init_settings2();
  init_terminalSetup();
  init_color();
  init_OverageCreditUpsell();
  init_shortcutFormat();
  init_concurrentSessions();
  init_config4();
  init_env();
  init_fileStateCache();
  init_git();
  init_ide();
  init_model();
  init_platform();
  init_installedPluginsManager();
  init_marketplaceManager();
  init_officialMarketplace();
  init_sessionStorage();
  init_overageCreditGrant();
  init_referral();
  init_tipHistory();
  externalTips = [
    {
      id: "new-user-warmup",
      content: async () => "Start with small features or bug fixes, tell Claude to propose a plan, and verify its suggested edits",
      cooldownSessions: 3,
      async isRelevant() {
        return getGlobalConfig().numStartups < 10;
      }
    },
    {
      id: "plan-mode-for-complex-tasks",
      content: async () => `Use Plan Mode to prepare for a complex request before making changes. Press ${getShortcutDisplay("chat:cycleMode", "Chat", "shift+tab")} twice to enable.`,
      cooldownSessions: 5,
      isRelevant: async () => {
        let config11 = getGlobalConfig();
        return (config11.lastPlanModeUse ? (Date.now() - config11.lastPlanModeUse) / 86400000 : 1 / 0) > 7;
      }
    },
    {
      id: "default-permission-mode-config",
      content: async () => "Use /config to change your default permission mode (including Plan Mode)",
      cooldownSessions: 10,
      isRelevant: async () => {
        try {
          let config11 = getGlobalConfig(), settings = getSettings_DEPRECATED(), hasUsedPlanMode = Boolean(config11.lastPlanModeUse), hasDefaultMode = Boolean(settings?.permissions?.defaultMode);
          return hasUsedPlanMode && !hasDefaultMode;
        } catch (error44) {
          return logForDebugging(`Failed to check default-permission-mode-config tip relevance: ${error44}`, { level: "warn" }), !1;
        }
      }
    },
    {
      id: "git-worktrees",
      content: async () => "Use git worktrees to run multiple Claude sessions in parallel.",
      cooldownSessions: 10,
      isRelevant: async () => {
        try {
          let config11 = getGlobalConfig();
          return await getWorktreeCount() <= 1 && config11.numStartups > 50;
        } catch (_) {
          return !1;
        }
      }
    },
    {
      id: "color-when-multi-clauding",
      content: async () => "Running multiple Claude sessions? Use /color and /rename to tell them apart at a glance.",
      cooldownSessions: 10,
      isRelevant: async () => {
        if (getCurrentSessionAgentColor())
          return !1;
        return await countConcurrentSessions() >= 2;
      }
    },
    {
      id: "terminal-setup",
      content: async () => env3.terminal === "Apple_Terminal" ? "Run /terminal-setup to enable convenient terminal integration like Option + Enter for new line and more" : "Run /terminal-setup to enable convenient terminal integration like Shift + Enter for new line and more",
      cooldownSessions: 10,
      async isRelevant() {
        let config11 = getGlobalConfig();
        if (env3.terminal === "Apple_Terminal")
          return !config11.optionAsMetaKeyInstalled;
        return !config11.shiftEnterKeyBindingInstalled;
      }
    },
    {
      id: "shift-enter",
      content: async () => env3.terminal === "Apple_Terminal" ? "Press Option+Enter to send a multi-line message" : "Press Shift+Enter to send a multi-line message",
      cooldownSessions: 10,
      async isRelevant() {
        let config11 = getGlobalConfig();
        return Boolean((env3.terminal === "Apple_Terminal" ? config11.optionAsMetaKeyInstalled : config11.shiftEnterKeyBindingInstalled) && config11.numStartups > 3);
      }
    },
    {
      id: "shift-enter-setup",
      content: async () => env3.terminal === "Apple_Terminal" ? "Run /terminal-setup to enable Option+Enter for new lines" : "Run /terminal-setup to enable Shift+Enter for new lines",
      cooldownSessions: 10,
      async isRelevant() {
        if (!shouldOfferTerminalSetup())
          return !1;
        let config11 = getGlobalConfig();
        return !(env3.terminal === "Apple_Terminal" ? config11.optionAsMetaKeyInstalled : config11.shiftEnterKeyBindingInstalled);
      }
    },
    {
      id: "memory-command",
      content: async () => "Use /memory to view and manage Claude memory",
      cooldownSessions: 15,
      async isRelevant() {
        return getGlobalConfig().memoryUsageCount <= 0;
      }
    },
    {
      id: "theme-command",
      content: async () => "Use /theme to change the color theme",
      cooldownSessions: 20,
      isRelevant: async () => !0
    },
    {
      id: "colorterm-truecolor",
      content: async () => "Try setting environment variable COLORTERM=truecolor for richer colors",
      cooldownSessions: 30,
      isRelevant: async () => !process.env.COLORTERM && source_default.level < 3
    },
    {
      id: "powershell-tool-env",
      content: async () => "Set CLAUDE_CODE_USE_POWERSHELL_TOOL=1 to enable the PowerShell tool (preview)",
      cooldownSessions: 10,
      isRelevant: async () => getPlatform() === "windows" && process.env.CLAUDE_CODE_USE_POWERSHELL_TOOL === void 0
    },
    {
      id: "status-line",
      content: async () => "Use /statusline to set up a custom status line that will display beneath the input box",
      cooldownSessions: 25,
      isRelevant: async () => getSettings_DEPRECATED().statusLine === void 0
    },
    {
      id: "prompt-queue",
      content: async () => "Hit Enter to queue up additional messages while Claude is working.",
      cooldownSessions: 5,
      async isRelevant() {
        return getGlobalConfig().promptQueueUseCount <= 3;
      }
    },
    {
      id: "enter-to-steer-in-relatime",
      content: async () => "Send messages to Claude while it works to steer Claude in real-time",
      cooldownSessions: 20,
      isRelevant: async () => !0
    },
    {
      id: "todo-list",
      content: async () => "Ask Claude to create a todo list when working on complex tasks to track progress and remain on track",
      cooldownSessions: 20,
      isRelevant: async () => !0
    },
    {
      id: "vscode-command-install",
      content: async () => `Open the Command Palette (Cmd+Shift+P) and run "Shell Command: Install '${env3.terminal === "vscode" ? "code" : env3.terminal}' command in PATH" to enable IDE integration`,
      cooldownSessions: 0,
      async isRelevant() {
        if (!isSupportedVSCodeTerminal())
          return !1;
        if (getPlatform() !== "macos")
          return !1;
        switch (env3.terminal) {
          case "vscode":
            return !await isVSCodeInstalled();
          case "cursor":
            return !await isCursorInstalled();
          case "windsurf":
            return !await isWindsurfInstalled();
          default:
            return !1;
        }
      }
    },
    {
      id: "ide-upsell-external-terminal",
      content: async () => "Connect Claude to your IDE \xB7 /ide",
      cooldownSessions: 4,
      async isRelevant() {
        if (isSupportedTerminal())
          return !1;
        if ((await getSortedIdeLockfiles()).length !== 0)
          return !1;
        return (await detectRunningIDEsCached()).length > 0;
      }
    },
    {
      id: "install-github-app",
      content: async () => "Run /install-github-app to tag @claude right from your Github issues and PRs",
      cooldownSessions: 10,
      isRelevant: async () => !getGlobalConfig().githubActionSetupCount
    },
    {
      id: "install-slack-app",
      content: async () => "Run /install-slack-app to use Claude in Slack",
      cooldownSessions: 10,
      isRelevant: async () => !getGlobalConfig().slackAppInstallCount
    },
    {
      id: "permissions",
      content: async () => "Use /permissions to pre-approve and pre-deny bash, edit, and MCP tools",
      cooldownSessions: 10,
      async isRelevant() {
        return getGlobalConfig().numStartups > 10;
      }
    },
    {
      id: "drag-and-drop-images",
      content: async () => "Did you know you can drag and drop image files into your terminal?",
      cooldownSessions: 10,
      isRelevant: async () => !env3.isSSH()
    },
    {
      id: "paste-images-mac",
      content: async () => "Paste images into Claude Code using control+v (not cmd+v!)",
      cooldownSessions: 10,
      isRelevant: async () => getPlatform() === "macos"
    },
    {
      id: "double-esc",
      content: async () => "Double-tap esc to rewind the conversation to a previous point in time",
      cooldownSessions: 10,
      isRelevant: async () => !fileHistoryEnabled()
    },
    {
      id: "double-esc-code-restore",
      content: async () => "Double-tap esc to rewind the code and/or conversation to a previous point in time",
      cooldownSessions: 10,
      isRelevant: async () => fileHistoryEnabled()
    },
    {
      id: "continue",
      content: async () => "Run claude --continue or claude --resume to resume a conversation",
      cooldownSessions: 10,
      isRelevant: async () => !0
    },
    {
      id: "rename-conversation",
      content: async () => "Name your conversations with /rename to find them easily in /resume later",
      cooldownSessions: 15,
      isRelevant: async () => isCustomTitleEnabled() && getGlobalConfig().numStartups > 10
    },
    {
      id: "custom-commands",
      content: async () => "Create skills by adding .md files to .claude/skills/ in your project or ~/.claude/skills/ for skills that work in any project",
      cooldownSessions: 15,
      async isRelevant() {
        return getGlobalConfig().numStartups > 10;
      }
    },
    {
      id: "shift-tab",
      content: async () => `Hit ${getShortcutDisplay("chat:cycleMode", "Chat", "shift+tab")} to cycle between default mode, auto-accept edit mode, and plan mode`,
      cooldownSessions: 10,
      isRelevant: async () => !0
    },
    {
      id: "image-paste",
      content: async () => `Use ${getShortcutDisplay("chat:imagePaste", "Chat", "ctrl+v")} to paste images from your clipboard`,
      cooldownSessions: 20,
      isRelevant: async () => !0
    },
    {
      id: "custom-agents",
      content: async () => "Use /agents to optimize specific tasks. Eg. Software Architect, Code Writer, Code Reviewer",
      cooldownSessions: 15,
      async isRelevant() {
        return getGlobalConfig().numStartups > 5;
      }
    },
    {
      id: "agent-flag",
      content: async () => "Use --agent <agent_name> to directly start a conversation with a subagent",
      cooldownSessions: 15,
      async isRelevant() {
        return getGlobalConfig().numStartups > 5;
      }
    },
    {
      id: "desktop-app",
      content: async () => "Run Claude Code locally or remotely using the Claude desktop app: clau.de/desktop",
      cooldownSessions: 15,
      isRelevant: async () => getPlatform() !== "linux"
    },
    {
      id: "desktop-shortcut",
      content: async (ctx) => {
        return `Continue your session in Claude Code Desktop with ${color("suggestion", ctx.theme)("/desktop")}`;
      },
      cooldownSessions: 15,
      isRelevant: async () => {
        return process.platform === "darwin" || process.platform === "win32" && process.arch === "x64";
      }
    },
    {
      id: "web-app",
      content: async () => "Run tasks in the cloud while you keep coding locally \xB7 clau.de/web",
      cooldownSessions: 15,
      isRelevant: async () => !0
    },
    {
      id: "mobile-app",
      content: async () => "/mobile to use Claude Code from the Claude app on your phone",
      cooldownSessions: 15,
      isRelevant: async () => !0
    },
    {
      id: "opusplan-mode-reminder",
      content: async () => `Your default model setting is Opus Plan Mode. Press ${getShortcutDisplay("chat:cycleMode", "Chat", "shift+tab")} twice to activate Plan Mode and plan with Claude Opus.`,
      cooldownSessions: 2,
      async isRelevant() {
        let config11 = getGlobalConfig(), hasOpusPlanMode = getUserSpecifiedModelSetting() === "opusplan", daysSinceLastUse = config11.lastPlanModeUse ? (Date.now() - config11.lastPlanModeUse) / 86400000 : 1 / 0;
        return hasOpusPlanMode && daysSinceLastUse > 3;
      }
    },
    {
      id: "frontend-design-plugin",
      content: async (ctx) => {
        return `Working with HTML/CSS? Install the frontend-design plugin:
${color("suggestion", ctx.theme)(`/plugin install frontend-design@${OFFICIAL_MARKETPLACE_NAME}`)}`;
      },
      cooldownSessions: 3,
      isRelevant: async (context7) => isMarketplacePluginRelevant("frontend-design", context7, {
        filePath: /\.(html|css|htm)$/i
      })
    },
    {
      id: "vercel-plugin",
      content: async (ctx) => {
        return `Working with Vercel? Install the vercel plugin:
${color("suggestion", ctx.theme)(`/plugin install vercel@${OFFICIAL_MARKETPLACE_NAME}`)}`;
      },
      cooldownSessions: 3,
      isRelevant: async (context7) => isMarketplacePluginRelevant("vercel", context7, {
        filePath: /(?:^|[/\\])vercel\.json$/i,
        cli: ["vercel"]
      })
    },
    {
      id: "effort-high-nudge",
      content: async (ctx) => {
        return `Working on something tricky? ${color("suggestion", ctx.theme)("/effort high")} gives better first answers`;
      },
      cooldownSessions: 3,
      isRelevant: async () => {
        return !1;
      }
    },
    {
      id: "subagent-fanout-nudge",
      content: async (ctx) => {
        return `Say ${color("suggestion", ctx.theme)('"fan out subagents"')} and Claude sends a team. Each one digs deep so nothing gets missed.`;
      },
      cooldownSessions: 3,
      isRelevant: async () => {
        return !1;
      }
    },
    {
      id: "loop-command-nudge",
      content: async (ctx) => {
        return `${color("suggestion", ctx.theme)("/loop")} runs any prompt on a recurring schedule. Great for monitoring deploys, babysitting PRs, or polling status.`;
      },
      cooldownSessions: 3,
      isRelevant: async () => {
        return !1;
      }
    },
    {
      id: "guest-passes",
      content: async (ctx) => {
        let claude = color("claude", ctx.theme), reward = getCachedReferrerReward();
        return reward ? `Share Claude Code and earn ${claude(formatCreditAmount(reward))} of extra usage \xB7 ${claude("/passes")}` : `You have free guest passes to share \xB7 ${claude("/passes")}`;
      },
      cooldownSessions: 3,
      isRelevant: async () => {
        if (getGlobalConfig().hasVisitedPasses)
          return !1;
        let { eligible: eligible2 } = checkCachedPassesEligibility();
        return eligible2;
      }
    },
    {
      id: "overage-credit",
      content: async (ctx) => {
        let claude = color("claude", ctx.theme), info = getCachedOverageCreditGrant(), amount = info ? formatGrantAmount(info) : null;
        if (!amount)
          return "";
        return `${claude(`${amount} in extra usage, on us`)} \xB7 third-party apps \xB7 ${claude("/extra-usage")}`;
      },
      cooldownSessions: 3,
      isRelevant: async () => shouldShowOverageCreditUpsell()
    },
    {
      id: "feedback-command",
      content: async () => "Use /feedback to help us improve!",
      cooldownSessions: 15,
      async isRelevant() {
        return getGlobalConfig().numStartups > 5;
      }
    }
  ], internalOnlyTips = [];
});
