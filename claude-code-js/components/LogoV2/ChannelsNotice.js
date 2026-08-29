// Original: src/components/LogoV2/ChannelsNotice.tsx
var exports_ChannelsNotice = {};
__export(exports_ChannelsNotice, {
  ChannelsNotice: () => ChannelsNotice
});
function ChannelsNotice() {
  let $3 = import_compiler_runtime204.c(32), [t0] = import_react149.useState(_temp120), {
    channels,
    disabled,
    noAuth,
    policyBlocked,
    list: list2,
    unmatched
  } = t0;
  if (channels.length === 0)
    return null;
  let hasNonDev = channels.some(_temp245), flag = getHasDevChannels() && hasNonDev ? "Channels" : getHasDevChannels() ? "--dangerously-load-development-channels" : "--channels";
  if (disabled) {
    let t12;
    if ($3[0] !== flag || $3[1] !== list2)
      t12 = /* @__PURE__ */ jsx_dev_runtime258.jsxDEV(ThemedText, {
        color: "error",
        children: [
          flag,
          " ignored (",
          list2,
          ")"
        ]
      }, void 0, !0, void 0, this), $3[0] = flag, $3[1] = list2, $3[2] = t12;
    else
      t12 = $3[2];
    let t22;
    if ($3[3] === Symbol.for("react.memo_cache_sentinel"))
      t22 = /* @__PURE__ */ jsx_dev_runtime258.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "Channels are not currently available"
      }, void 0, !1, void 0, this), $3[3] = t22;
    else
      t22 = $3[3];
    let t32;
    if ($3[4] !== t12)
      t32 = /* @__PURE__ */ jsx_dev_runtime258.jsxDEV(ThemedBox_default, {
        paddingLeft: 2,
        flexDirection: "column",
        children: [
          t12,
          t22
        ]
      }, void 0, !0, void 0, this), $3[4] = t12, $3[5] = t32;
    else
      t32 = $3[5];
    return t32;
  }
  if (noAuth) {
    let t12;
    if ($3[6] !== flag || $3[7] !== list2)
      t12 = /* @__PURE__ */ jsx_dev_runtime258.jsxDEV(ThemedText, {
        color: "error",
        children: [
          flag,
          " ignored (",
          list2,
          ")"
        ]
      }, void 0, !0, void 0, this), $3[6] = flag, $3[7] = list2, $3[8] = t12;
    else
      t12 = $3[8];
    let t22;
    if ($3[9] === Symbol.for("react.memo_cache_sentinel"))
      t22 = /* @__PURE__ */ jsx_dev_runtime258.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "Channels require claude.ai authentication \xB7 run /login, then restart"
      }, void 0, !1, void 0, this), $3[9] = t22;
    else
      t22 = $3[9];
    let t32;
    if ($3[10] !== t12)
      t32 = /* @__PURE__ */ jsx_dev_runtime258.jsxDEV(ThemedBox_default, {
        paddingLeft: 2,
        flexDirection: "column",
        children: [
          t12,
          t22
        ]
      }, void 0, !0, void 0, this), $3[10] = t12, $3[11] = t32;
    else
      t32 = $3[11];
    return t32;
  }
  if (policyBlocked) {
    let t12;
    if ($3[12] !== flag || $3[13] !== list2)
      t12 = /* @__PURE__ */ jsx_dev_runtime258.jsxDEV(ThemedText, {
        color: "error",
        children: [
          flag,
          " blocked by org policy (",
          list2,
          ")"
        ]
      }, void 0, !0, void 0, this), $3[12] = flag, $3[13] = list2, $3[14] = t12;
    else
      t12 = $3[14];
    let t22, t32;
    if ($3[15] === Symbol.for("react.memo_cache_sentinel"))
      t22 = /* @__PURE__ */ jsx_dev_runtime258.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "Inbound messages will be silently dropped"
      }, void 0, !1, void 0, this), t32 = /* @__PURE__ */ jsx_dev_runtime258.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "Have an administrator set channelsEnabled: true in managed settings to enable"
      }, void 0, !1, void 0, this), $3[15] = t22, $3[16] = t32;
    else
      t22 = $3[15], t32 = $3[16];
    let t42;
    if ($3[17] !== unmatched)
      t42 = unmatched.map(_temp329), $3[17] = unmatched, $3[18] = t42;
    else
      t42 = $3[18];
    let t5;
    if ($3[19] !== t12 || $3[20] !== t42)
      t5 = /* @__PURE__ */ jsx_dev_runtime258.jsxDEV(ThemedBox_default, {
        paddingLeft: 2,
        flexDirection: "column",
        children: [
          t12,
          t22,
          t32,
          t42
        ]
      }, void 0, !0, void 0, this), $3[19] = t12, $3[20] = t42, $3[21] = t5;
    else
      t5 = $3[21];
    return t5;
  }
  let t1;
  if ($3[22] !== list2)
    t1 = /* @__PURE__ */ jsx_dev_runtime258.jsxDEV(ThemedText, {
      color: "error",
      children: [
        "Listening for channel messages from: ",
        list2
      ]
    }, void 0, !0, void 0, this), $3[22] = list2, $3[23] = t1;
  else
    t1 = $3[23];
  let t2;
  if ($3[24] !== flag)
    t2 = /* @__PURE__ */ jsx_dev_runtime258.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        "Experimental \xB7 inbound messages will be pushed into this session, this carries prompt injection risks. Restart Claude Code without ",
        flag,
        " to disable."
      ]
    }, void 0, !0, void 0, this), $3[24] = flag, $3[25] = t2;
  else
    t2 = $3[25];
  let t3;
  if ($3[26] !== unmatched)
    t3 = unmatched.map(_temp425), $3[26] = unmatched, $3[27] = t3;
  else
    t3 = $3[27];
  let t4;
  if ($3[28] !== t1 || $3[29] !== t2 || $3[30] !== t3)
    t4 = /* @__PURE__ */ jsx_dev_runtime258.jsxDEV(ThemedBox_default, {
      paddingLeft: 2,
      flexDirection: "column",
      children: [
        t1,
        t2,
        t3
      ]
    }, void 0, !0, void 0, this), $3[28] = t1, $3[29] = t2, $3[30] = t3, $3[31] = t4;
  else
    t4 = $3[31];
  return t4;
}
function _temp425(u_0) {
  return /* @__PURE__ */ jsx_dev_runtime258.jsxDEV(ThemedText, {
    color: "warning",
    children: [
      formatEntry(u_0.entry),
      " \xB7 ",
      u_0.why
    ]
  }, `${formatEntry(u_0.entry)}:${u_0.why}`, !0, void 0, this);
}
function _temp329(u5) {
  return /* @__PURE__ */ jsx_dev_runtime258.jsxDEV(ThemedText, {
    color: "warning",
    children: [
      formatEntry(u5.entry),
      " \xB7 ",
      u5.why
    ]
  }, `${formatEntry(u5.entry)}:${u5.why}`, !0, void 0, this);
}
function _temp245(c3) {
  return !c3.dev;
}
function _temp120() {
  let ch2 = getAllowedChannels();
  if (ch2.length === 0)
    return {
      channels: ch2,
      disabled: !1,
      noAuth: !1,
      policyBlocked: !1,
      list: "",
      unmatched: []
    };
  let l3 = ch2.map(formatEntry).join(", "), sub = getSubscriptionType(), managed = sub === "team" || sub === "enterprise", policy = getSettingsForSource("policySettings"), allowlist = getEffectiveChannelAllowlist(sub, policy?.allowedChannelPlugins);
  return {
    channels: ch2,
    disabled: !isChannelsEnabled(),
    noAuth: !getClaudeAIOAuthTokens()?.accessToken,
    policyBlocked: managed && policy?.channelsEnabled !== !0,
    list: l3,
    unmatched: findUnmatched(ch2, allowlist)
  };
}
function formatEntry(c3) {
  return c3.kind === "plugin" ? `plugin:${c3.name}@${c3.marketplace}` : `server:${c3.name}`;
}
function findUnmatched(entries2, allowlist) {
  let scopes = ["enterprise", "user", "project", "local"], configured = /* @__PURE__ */ new Set;
  for (let scope of scopes)
    for (let name3 of Object.keys(getMcpConfigsByScope(scope).servers))
      configured.add(name3);
  let installedPluginIds = new Set(Object.keys(loadInstalledPluginsV2().plugins)), {
    entries: allowed,
    source
  } = allowlist, out = [];
  for (let entry of entries2) {
    if (entry.kind === "server") {
      if (!configured.has(entry.name))
        out.push({
          entry,
          why: "no MCP server configured with that name"
        });
      if (!entry.dev)
        out.push({
          entry,
          why: "server: entries need --dangerously-load-development-channels"
        });
      continue;
    }
    if (!installedPluginIds.has(`${entry.name}@${entry.marketplace}`))
      out.push({
        entry,
        why: "plugin not installed"
      });
    if (!entry.dev && !allowed.some((e) => e.plugin === entry.name && e.marketplace === entry.marketplace))
      out.push({
        entry,
        why: source === "org" ? "not on your org's approved channels list" : "not on the approved channels allowlist"
      });
  }
  return out;
}
var import_compiler_runtime204, import_react149, jsx_dev_runtime258;
var init_ChannelsNotice = __esm(() => {
  init_state();
  init_ink2();
  init_channelAllowlist();
  init_channelNotification();
  init_config8();
  init_auth14();
  init_installedPluginsManager();
  init_settings2();
  import_compiler_runtime204 = __toESM(require_react_compiler_runtime_development(), 1), import_react149 = __toESM(require_react_development(), 1), jsx_dev_runtime258 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
