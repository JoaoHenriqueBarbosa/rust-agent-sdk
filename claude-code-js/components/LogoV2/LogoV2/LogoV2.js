// function: LogoV2
function LogoV2() {
  let $3 = import_compiler_runtime205.c(94), activities = getRecentActivitySync(), username = getGlobalConfig().oauthAccount?.displayName ?? "", {
    columns
  } = useTerminalSize(), t0;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t0 = shouldShowProjectOnboarding(), $3[0] = t0;
  else
    t0 = $3[0];
  let showOnboarding = t0, t1;
  if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
    t1 = SandboxManager2.isSandboxingEnabled(), $3[1] = t1;
  else
    t1 = $3[1];
  let showSandboxStatus = t1, showGuestPassesUpsell = useShowGuestPassesUpsell(), showOverageCreditUpsell = useShowOverageCreditUpsell(), agent = useAppState(_temp121), effortValue = useAppState(_temp246), config11 = getGlobalConfig(), changelog;
  try {
    changelog = getRecentReleaseNotesSync(3);
  } catch {
    changelog = [];
  }
  let [announcement] = import_react150.useState(() => {
    let announcements = getInitialSettings().companyAnnouncements;
    if (!announcements || announcements.length === 0)
      return;
    return config11.numStartups === 1 ? announcements[0] : announcements[Math.floor(Math.random() * announcements.length)];
  }), {
    hasReleaseNotes
  } = checkForReleaseNotesSync(config11.lastReleaseNotesSeen), t2;
  if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
    t2 = () => {
      if (getGlobalConfig().lastReleaseNotesSeen === "2.1.90")
        return;
      if (saveGlobalConfig(_temp330), showOnboarding)
        incrementProjectOnboardingSeenCount();
    }, $3[2] = t2;
  else
    t2 = $3[2];
  let t3;
  if ($3[3] !== config11)
    t3 = [config11, showOnboarding], $3[3] = config11, $3[4] = t3;
  else
    t3 = $3[4];
  import_react150.useEffect(t2, t3);
  let t4;
  if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
    t4 = !hasReleaseNotes && !showOnboarding && !isEnvTruthy(process.env.CLAUDE_CODE_FORCE_FULL_LOGO), $3[5] = t4;
  else
    t4 = $3[5];
  let isCondensedMode = t4, t5, t6;
  if ($3[6] !== showGuestPassesUpsell)
    t5 = () => {
      if (showGuestPassesUpsell && !showOnboarding && !isCondensedMode)
        incrementGuestPassesSeenCount();
    }, t6 = [showGuestPassesUpsell, showOnboarding, isCondensedMode], $3[6] = showGuestPassesUpsell, $3[7] = t5, $3[8] = t6;
  else
    t5 = $3[7], t6 = $3[8];
  import_react150.useEffect(t5, t6);
  let t7, t8;
  if ($3[9] !== showGuestPassesUpsell || $3[10] !== showOverageCreditUpsell)
    t7 = () => {
      if (showOverageCreditUpsell && !showOnboarding && !showGuestPassesUpsell && !isCondensedMode)
        incrementOverageCreditUpsellSeenCount();
    }, t8 = [showOverageCreditUpsell, showOnboarding, showGuestPassesUpsell, isCondensedMode], $3[9] = showGuestPassesUpsell, $3[10] = showOverageCreditUpsell, $3[11] = t7, $3[12] = t8;
  else
    t7 = $3[11], t8 = $3[12];
  import_react150.useEffect(t7, t8);
  let model = useMainLoopModel(), fullModelDisplayName = renderModelSetting(model), {
    version: version5,
    cwd: cwd2,
    billingType,
    agentName: agentNameFromSettings
  } = getLogoDisplayData(), agentName = agent ?? agentNameFromSettings, effortSuffix = getEffortSuffix(model, effortValue), t9 = fullModelDisplayName + effortSuffix, t10;
  if ($3[13] !== t9)
    t10 = truncate(t9, LEFT_PANEL_MAX_WIDTH - 20), $3[13] = t9, $3[14] = t10;
  else
    t10 = $3[14];
  let modelDisplayName = t10;
  if (!hasReleaseNotes && !showOnboarding && !isEnvTruthy(process.env.CLAUDE_CODE_FORCE_FULL_LOGO)) {
    let t112, t122, t132, t142, t152, t162, t172;
    if ($3[15] === Symbol.for("react.memo_cache_sentinel"))
      t112 = /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(CondensedLogo, {}, void 0, !1, void 0, this), t122 = /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(VoiceModeNotice, {}, void 0, !1, void 0, this), t132 = /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(Opus1mMergeNotice, {}, void 0, !1, void 0, this), t142 = ChannelsNoticeModule && /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(ChannelsNoticeModule.ChannelsNotice, {}, void 0, !1, void 0, this), t152 = isDebugMode() && /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(ThemedBox_default, {
        paddingLeft: 2,
        flexDirection: "column",
        children: [
          /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(ThemedText, {
            color: "warning",
            children: "Debug mode enabled"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              "Logging to: ",
              isDebugToStdErr() ? "stderr" : getDebugLogPath()
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this), t162 = /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(EmergencyTip, {}, void 0, !1, void 0, this), t172 = process.env.CLAUDE_CODE_TMUX_SESSION && /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(ThemedBox_default, {
        paddingLeft: 2,
        flexDirection: "column",
        children: [
          /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              "tmux session: ",
              process.env.CLAUDE_CODE_TMUX_SESSION
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(ThemedText, {
            dimColor: !0,
            children: process.env.CLAUDE_CODE_TMUX_PREFIX_CONFLICTS ? `Detach: ${process.env.CLAUDE_CODE_TMUX_PREFIX} ${process.env.CLAUDE_CODE_TMUX_PREFIX} d (press prefix twice - Claude uses ${process.env.CLAUDE_CODE_TMUX_PREFIX})` : `Detach: ${process.env.CLAUDE_CODE_TMUX_PREFIX} d`
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this), $3[15] = t112, $3[16] = t122, $3[17] = t132, $3[18] = t142, $3[19] = t152, $3[20] = t162, $3[21] = t172;
    else
      t112 = $3[15], t122 = $3[16], t132 = $3[17], t142 = $3[18], t152 = $3[19], t162 = $3[20], t172 = $3[21];
    let t182;
    if ($3[22] !== announcement || $3[23] !== config11)
      t182 = announcement && /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(ThemedBox_default, {
        paddingLeft: 2,
        flexDirection: "column",
        children: [
          !process.env.IS_DEMO && config11.oauthAccount?.organizationName && /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              "Message from ",
              config11.oauthAccount.organizationName,
              ":"
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(ThemedText, {
            children: announcement
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this), $3[22] = announcement, $3[23] = config11, $3[24] = t182;
    else
      t182 = $3[24];
    let t192, t202, t212, t222;
    if ($3[25] === Symbol.for("react.memo_cache_sentinel"))
      t192 = !1, t202 = !1, t212 = !1, t222 = !1, $3[25] = t192, $3[26] = t202, $3[27] = t212, $3[28] = t222;
    else
      t192 = $3[25], t202 = $3[26], t212 = $3[27], t222 = $3[28];
    let t232;
    if ($3[29] !== t182)
      t232 = /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(jsx_dev_runtime259.Fragment, {
        children: [
          t112,
          t122,
          t132,
          t142,
          t152,
          t162,
          t172,
          t182,
          t192,
          t202,
          t212,
          t222
        ]
      }, void 0, !0, void 0, this), $3[29] = t182, $3[30] = t232;
    else
      t232 = $3[30];
    return t232;
  }
  let layoutMode = getLayoutMode(columns), userTheme = resolveThemeSetting(getGlobalConfig().theme), borderTitle = ` ${color("claude", userTheme)("Claude Code")} ${color("inactive", userTheme)(`v${version5} (dev)`)} `, compactBorderTitle = color("claude", userTheme)(" Claude Code ");
  if (layoutMode === "compact") {
    let welcomeMessage = formatWelcomeMessage(username);
    if (stringWidth(welcomeMessage) > columns - 4) {
      let t113;
      if ($3[31] === Symbol.for("react.memo_cache_sentinel"))
        t113 = formatWelcomeMessage(null), $3[31] = t113;
      else
        t113 = $3[31];
      welcomeMessage = t113;
    }
    let cwdAvailableWidth = agentName ? columns - 4 - 1 - stringWidth(agentName) - 3 : columns - 4, truncatedCwd = truncatePath(cwd2, Math.max(cwdAvailableWidth, 10)), t112;
    if ($3[32] !== compactBorderTitle)
      t112 = {
        content: compactBorderTitle,
        position: "top",
        align: "start",
        offset: 1
      }, $3[32] = compactBorderTitle, $3[33] = t112;
    else
      t112 = $3[33];
    let t122;
    if ($3[34] === Symbol.for("react.memo_cache_sentinel"))
      t122 = /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(ThemedBox_default, {
        marginY: 1,
        children: /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(Clawd, {}, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), $3[34] = t122;
    else
      t122 = $3[34];
    let t132;
    if ($3[35] !== modelDisplayName)
      t132 = /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(ThemedText, {
        dimColor: !0,
        children: modelDisplayName
      }, void 0, !1, void 0, this), $3[35] = modelDisplayName, $3[36] = t132;
    else
      t132 = $3[36];
    let t142, t152, t162;
    if ($3[37] === Symbol.for("react.memo_cache_sentinel"))
      t142 = /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(VoiceModeNotice, {}, void 0, !1, void 0, this), t152 = /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(Opus1mMergeNotice, {}, void 0, !1, void 0, this), t162 = ChannelsNoticeModule && /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(ChannelsNoticeModule.ChannelsNotice, {}, void 0, !1, void 0, this), $3[37] = t142, $3[38] = t152, $3[39] = t162;
    else
      t142 = $3[37], t152 = $3[38], t162 = $3[39];
    let t172;
    if ($3[40] !== showSandboxStatus)
      t172 = showSandboxStatus && /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(ThemedBox_default, {
        marginTop: 1,
        flexDirection: "column",
        children: /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(ThemedText, {
          color: "warning",
          children: "Your bash commands will be sandboxed. Disable with /sandbox."
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), $3[40] = showSandboxStatus, $3[41] = t172;
    else
      t172 = $3[41];
    let t182, t192;
    if ($3[42] === Symbol.for("react.memo_cache_sentinel"))
      t182 = !1, t192 = !1, $3[42] = t182, $3[43] = t192;
    else
      t182 = $3[42], t192 = $3[43];
    return /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(jsx_dev_runtime259.Fragment, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(OffscreenFreeze, {
          children: /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            borderStyle: "round",
            borderColor: "claude",
            borderText: t112,
            paddingX: 1,
            paddingY: 1,
            alignItems: "center",
            width: columns,
            children: [
              /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(ThemedText, {
                bold: !0,
                children: welcomeMessage
              }, void 0, !1, void 0, this),
              t122,
              t132,
              /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(ThemedText, {
                dimColor: !0,
                children: billingType
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(ThemedText, {
                dimColor: !0,
                children: agentName ? `@${agentName} \xB7 ${truncatedCwd}` : truncatedCwd
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this),
        t142,
        t152,
        t162,
        t172,
        t182,
        t192
      ]
    }, void 0, !0, void 0, this);
  }
  let welcomeMessage_0 = formatWelcomeMessage(username), modelLine = !process.env.IS_DEMO && config11.oauthAccount?.organizationName ? `${modelDisplayName} \xB7 ${billingType} \xB7 ${config11.oauthAccount.organizationName}` : `${modelDisplayName} \xB7 ${billingType}`, cwdAvailableWidth_0 = agentName ? LEFT_PANEL_MAX_WIDTH - 1 - stringWidth(agentName) - 3 : LEFT_PANEL_MAX_WIDTH, truncatedCwd_0 = truncatePath(cwd2, Math.max(cwdAvailableWidth_0, 10)), cwdLine = agentName ? `@${agentName} \xB7 ${truncatedCwd_0}` : truncatedCwd_0, optimalLeftWidth = calculateOptimalLeftWidth(welcomeMessage_0, cwdLine, modelLine), {
    leftWidth,
    rightWidth
  } = calculateLayoutDimensions(columns, layoutMode, optimalLeftWidth), T0 = OffscreenFreeze, T1 = ThemedBox_default, t11 = "column", t12 = "round", t13 = "claude", t14;
  if ($3[44] !== borderTitle)
    t14 = {
      content: borderTitle,
      position: "top",
      align: "start",
      offset: 3
    }, $3[44] = borderTitle, $3[45] = t14;
  else
    t14 = $3[45];
  let T2 = ThemedBox_default, t15 = layoutMode === "horizontal" ? "row" : "column", t16 = 1, t17 = 1, t18;
  if ($3[46] !== welcomeMessage_0)
    t18 = /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(ThemedText, {
        bold: !0,
        children: welcomeMessage_0
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[46] = welcomeMessage_0, $3[47] = t18;
  else
    t18 = $3[47];
  let t19;
  if ($3[48] === Symbol.for("react.memo_cache_sentinel"))
    t19 = /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(Clawd, {}, void 0, !1, void 0, this), $3[48] = t19;
  else
    t19 = $3[48];
  let t20;
  if ($3[49] !== modelLine)
    t20 = /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(ThemedText, {
      dimColor: !0,
      children: modelLine
    }, void 0, !1, void 0, this), $3[49] = modelLine, $3[50] = t20;
  else
    t20 = $3[50];
  let t21;
  if ($3[51] !== cwdLine)
    t21 = /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(ThemedText, {
      dimColor: !0,
      children: cwdLine
    }, void 0, !1, void 0, this), $3[51] = cwdLine, $3[52] = t21;
  else
    t21 = $3[52];
  let t22;
  if ($3[53] !== t20 || $3[54] !== t21)
    t22 = /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      alignItems: "center",
      children: [
        t20,
        t21
      ]
    }, void 0, !0, void 0, this), $3[53] = t20, $3[54] = t21, $3[55] = t22;
  else
    t22 = $3[55];
  let t23;
  if ($3[56] !== leftWidth || $3[57] !== t18 || $3[58] !== t22)
    t23 = /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      width: leftWidth,
      justifyContent: "space-between",
      alignItems: "center",
      minHeight: 9,
      children: [
        t18,
        t19,
        t22
      ]
    }, void 0, !0, void 0, this), $3[56] = leftWidth, $3[57] = t18, $3[58] = t22, $3[59] = t23;
  else
    t23 = $3[59];
  let t24;
  if ($3[60] !== layoutMode)
    t24 = layoutMode === "horizontal" && /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(ThemedBox_default, {
      height: "100%",
      borderStyle: "single",
      borderColor: "claude",
      borderDimColor: !0,
      borderTop: !1,
      borderBottom: !1,
      borderLeft: !1
    }, void 0, !1, void 0, this), $3[60] = layoutMode, $3[61] = t24;
  else
    t24 = $3[61];
  let t25 = layoutMode === "horizontal" && /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(FeedColumn, {
    feeds: showOnboarding ? [createProjectOnboardingFeed(getSteps()), createRecentActivityFeed(activities)] : showGuestPassesUpsell ? [createRecentActivityFeed(activities), createGuestPassesFeed()] : showOverageCreditUpsell ? [createRecentActivityFeed(activities), createOverageCreditFeed()] : [createRecentActivityFeed(activities), createWhatsNewFeed(changelog)],
    maxWidth: rightWidth
  }, void 0, !1, void 0, this), t26;
  if ($3[62] !== T2 || $3[63] !== t15 || $3[64] !== t23 || $3[65] !== t24 || $3[66] !== t25)
    t26 = /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(T2, {
      flexDirection: t15,
      paddingX: t16,
      gap: t17,
      children: [
        t23,
        t24,
        t25
      ]
    }, void 0, !0, void 0, this), $3[62] = T2, $3[63] = t15, $3[64] = t23, $3[65] = t24, $3[66] = t25, $3[67] = t26;
  else
    t26 = $3[67];
  let t27;
  if ($3[68] !== T1 || $3[69] !== t14 || $3[70] !== t26)
    t27 = /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(T1, {
      flexDirection: t11,
      borderStyle: t12,
      borderColor: t13,
      borderText: t14,
      children: t26
    }, void 0, !1, void 0, this), $3[68] = T1, $3[69] = t14, $3[70] = t26, $3[71] = t27;
  else
    t27 = $3[71];
  let t28;
  if ($3[72] !== T0 || $3[73] !== t27)
    t28 = /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(T0, {
      children: t27
    }, void 0, !1, void 0, this), $3[72] = T0, $3[73] = t27, $3[74] = t28;
  else
    t28 = $3[74];
  let t29, t30, t31, t32, t33, t34;
  if ($3[75] === Symbol.for("react.memo_cache_sentinel"))
    t29 = /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(VoiceModeNotice, {}, void 0, !1, void 0, this), t30 = /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(Opus1mMergeNotice, {}, void 0, !1, void 0, this), t31 = ChannelsNoticeModule && /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(ChannelsNoticeModule.ChannelsNotice, {}, void 0, !1, void 0, this), t32 = isDebugMode() && /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(ThemedBox_default, {
      paddingLeft: 2,
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(ThemedText, {
          color: "warning",
          children: "Debug mode enabled"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            "Logging to: ",
            isDebugToStdErr() ? "stderr" : getDebugLogPath()
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this), t33 = /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(EmergencyTip, {}, void 0, !1, void 0, this), t34 = process.env.CLAUDE_CODE_TMUX_SESSION && /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(ThemedBox_default, {
      paddingLeft: 2,
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            "tmux session: ",
            process.env.CLAUDE_CODE_TMUX_SESSION
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(ThemedText, {
          dimColor: !0,
          children: process.env.CLAUDE_CODE_TMUX_PREFIX_CONFLICTS ? `Detach: ${process.env.CLAUDE_CODE_TMUX_PREFIX} ${process.env.CLAUDE_CODE_TMUX_PREFIX} d (press prefix twice - Claude uses ${process.env.CLAUDE_CODE_TMUX_PREFIX})` : `Detach: ${process.env.CLAUDE_CODE_TMUX_PREFIX} d`
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[75] = t29, $3[76] = t30, $3[77] = t31, $3[78] = t32, $3[79] = t33, $3[80] = t34;
  else
    t29 = $3[75], t30 = $3[76], t31 = $3[77], t32 = $3[78], t33 = $3[79], t34 = $3[80];
  let t35;
  if ($3[81] !== announcement || $3[82] !== config11)
    t35 = announcement && /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(ThemedBox_default, {
      paddingLeft: 2,
      flexDirection: "column",
      children: [
        !process.env.IS_DEMO && config11.oauthAccount?.organizationName && /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            "Message from ",
            config11.oauthAccount.organizationName,
            ":"
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(ThemedText, {
          children: announcement
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[81] = announcement, $3[82] = config11, $3[83] = t35;
  else
    t35 = $3[83];
  let t36;
  if ($3[84] !== showSandboxStatus)
    t36 = showSandboxStatus && /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(ThemedBox_default, {
      paddingLeft: 2,
      flexDirection: "column",
      children: /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(ThemedText, {
        color: "warning",
        children: "Your bash commands will be sandboxed. Disable with /sandbox."
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[84] = showSandboxStatus, $3[85] = t36;
  else
    t36 = $3[85];
  let t37, t38, t39, t40;
  if ($3[86] === Symbol.for("react.memo_cache_sentinel"))
    t37 = !1, t38 = !1, t39 = !1, t40 = !1, $3[86] = t37, $3[87] = t38, $3[88] = t39, $3[89] = t40;
  else
    t37 = $3[86], t38 = $3[87], t39 = $3[88], t40 = $3[89];
  let t41;
  if ($3[90] !== t28 || $3[91] !== t35 || $3[92] !== t36)
    t41 = /* @__PURE__ */ jsx_dev_runtime259.jsxDEV(jsx_dev_runtime259.Fragment, {
      children: [
        t28,
        t29,
        t30,
        t31,
        t32,
        t33,
        t34,
        t35,
        t36,
        t37,
        t38,
        t39,
        t40
      ]
    }, void 0, !0, void 0, this), $3[90] = t28, $3[91] = t35, $3[92] = t36, $3[93] = t41;
  else
    t41 = $3[93];
  return t41;
}
