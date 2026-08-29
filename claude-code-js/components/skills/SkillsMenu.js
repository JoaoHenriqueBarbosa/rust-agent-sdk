// Original: src/components/skills/SkillsMenu.tsx
function getSourceTitle(source) {
  if (source === "plugin")
    return "Plugin skills";
  if (source === "mcp")
    return "MCP skills";
  return `${capitalize_default(getSettingSourceName(source))} skills`;
}
function getSourceSubtitle(source, skills) {
  if (source === "mcp") {
    let servers = [...new Set(skills.map((s2) => {
      let idx = s2.name.indexOf(":");
      return idx > 0 ? s2.name.slice(0, idx) : null;
    }).filter((n5) => n5 != null))];
    return servers.length > 0 ? servers.join(", ") : void 0;
  }
  let skillsPath = getDisplayPath(getSkillsPath(source, "skills"));
  return skills.some((s2) => s2.loadedFrom === "commands_DEPRECATED") ? `${skillsPath}, ${getDisplayPath(getSkillsPath(source, "commands"))}` : skillsPath;
}
function SkillsMenu(t0) {
  let $3 = import_compiler_runtime220.c(35), {
    onExit: onExit2,
    commands: commands7
  } = t0, t1;
  if ($3[0] !== commands7)
    t1 = commands7.filter(_temp134), $3[0] = commands7, $3[1] = t1;
  else
    t1 = $3[1];
  let skills = t1, groups;
  if ($3[2] !== skills) {
    groups = {
      policySettings: [],
      userSettings: [],
      projectSettings: [],
      localSettings: [],
      flagSettings: [],
      plugin: [],
      mcp: []
    };
    for (let skill of skills) {
      let source = skill.source;
      if (source in groups)
        groups[source].push(skill);
    }
    for (let group of Object.values(groups))
      group.sort(_temp251);
    $3[2] = skills, $3[3] = groups;
  } else
    groups = $3[3];
  let skillsBySource = groups, t2;
  if ($3[4] !== onExit2)
    t2 = () => {
      onExit2("Skills dialog dismissed", {
        display: "system"
      });
    }, $3[4] = onExit2, $3[5] = t2;
  else
    t2 = $3[5];
  let handleCancel = t2;
  if (skills.length === 0) {
    let t32;
    if ($3[6] === Symbol.for("react.memo_cache_sentinel"))
      t32 = /* @__PURE__ */ jsx_dev_runtime277.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "Create skills in .claude/skills/ or ~/.claude/skills/"
      }, void 0, !1, void 0, this), $3[6] = t32;
    else
      t32 = $3[6];
    let t42;
    if ($3[7] === Symbol.for("react.memo_cache_sentinel"))
      t42 = /* @__PURE__ */ jsx_dev_runtime277.jsxDEV(ThemedText, {
        dimColor: !0,
        italic: !0,
        children: /* @__PURE__ */ jsx_dev_runtime277.jsxDEV(ConfigurableShortcutHint, {
          action: "confirm:no",
          context: "Confirmation",
          fallback: "Esc",
          description: "close"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), $3[7] = t42;
    else
      t42 = $3[7];
    let t52;
    if ($3[8] !== handleCancel)
      t52 = /* @__PURE__ */ jsx_dev_runtime277.jsxDEV(Dialog, {
        title: "Skills",
        subtitle: "No skills found",
        onCancel: handleCancel,
        hideInputGuide: !0,
        children: [
          t32,
          t42
        ]
      }, void 0, !0, void 0, this), $3[8] = handleCancel, $3[9] = t52;
    else
      t52 = $3[9];
    return t52;
  }
  let renderSkill = _temp334, t3;
  if ($3[10] !== skillsBySource)
    t3 = (source_0) => {
      let groupSkills = skillsBySource[source_0];
      if (groupSkills.length === 0)
        return null;
      let title = getSourceTitle(source_0), subtitle = getSourceSubtitle(source_0, groupSkills);
      return /* @__PURE__ */ jsx_dev_runtime277.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: [
          /* @__PURE__ */ jsx_dev_runtime277.jsxDEV(ThemedBox_default, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime277.jsxDEV(ThemedText, {
                bold: !0,
                dimColor: !0,
                children: title
              }, void 0, !1, void 0, this),
              subtitle && /* @__PURE__ */ jsx_dev_runtime277.jsxDEV(ThemedText, {
                dimColor: !0,
                children: [
                  " (",
                  subtitle,
                  ")"
                ]
              }, void 0, !0, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          groupSkills.map((skill_1) => renderSkill(skill_1))
        ]
      }, source_0, !0, void 0, this);
    }, $3[10] = skillsBySource, $3[11] = t3;
  else
    t3 = $3[11];
  let renderSkillGroup = t3, t4 = skills.length, t5;
  if ($3[12] !== skills.length)
    t5 = plural(skills.length, "skill"), $3[12] = skills.length, $3[13] = t5;
  else
    t5 = $3[13];
  let t6 = `${t4} ${t5}`, t7;
  if ($3[14] !== renderSkillGroup)
    t7 = renderSkillGroup("projectSettings"), $3[14] = renderSkillGroup, $3[15] = t7;
  else
    t7 = $3[15];
  let t8;
  if ($3[16] !== renderSkillGroup)
    t8 = renderSkillGroup("userSettings"), $3[16] = renderSkillGroup, $3[17] = t8;
  else
    t8 = $3[17];
  let t9;
  if ($3[18] !== renderSkillGroup)
    t9 = renderSkillGroup("policySettings"), $3[18] = renderSkillGroup, $3[19] = t9;
  else
    t9 = $3[19];
  let t10;
  if ($3[20] !== renderSkillGroup)
    t10 = renderSkillGroup("plugin"), $3[20] = renderSkillGroup, $3[21] = t10;
  else
    t10 = $3[21];
  let t11;
  if ($3[22] !== renderSkillGroup)
    t11 = renderSkillGroup("mcp"), $3[22] = renderSkillGroup, $3[23] = t11;
  else
    t11 = $3[23];
  let t12;
  if ($3[24] !== t10 || $3[25] !== t11 || $3[26] !== t7 || $3[27] !== t8 || $3[28] !== t9)
    t12 = /* @__PURE__ */ jsx_dev_runtime277.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      children: [
        t7,
        t8,
        t9,
        t10,
        t11
      ]
    }, void 0, !0, void 0, this), $3[24] = t10, $3[25] = t11, $3[26] = t7, $3[27] = t8, $3[28] = t9, $3[29] = t12;
  else
    t12 = $3[29];
  let t13;
  if ($3[30] === Symbol.for("react.memo_cache_sentinel"))
    t13 = /* @__PURE__ */ jsx_dev_runtime277.jsxDEV(ThemedText, {
      dimColor: !0,
      italic: !0,
      children: /* @__PURE__ */ jsx_dev_runtime277.jsxDEV(ConfigurableShortcutHint, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "close"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[30] = t13;
  else
    t13 = $3[30];
  let t14;
  if ($3[31] !== handleCancel || $3[32] !== t12 || $3[33] !== t6)
    t14 = /* @__PURE__ */ jsx_dev_runtime277.jsxDEV(Dialog, {
      title: "Skills",
      subtitle: t6,
      onCancel: handleCancel,
      hideInputGuide: !0,
      children: [
        t12,
        t13
      ]
    }, void 0, !0, void 0, this), $3[31] = handleCancel, $3[32] = t12, $3[33] = t6, $3[34] = t14;
  else
    t14 = $3[34];
  return t14;
}
function _temp334(skill_0) {
  let estimatedTokens = estimateSkillFrontmatterTokens(skill_0), tokenDisplay = `~${formatTokens(estimatedTokens)}`, pluginName = skill_0.source === "plugin" ? skill_0.pluginInfo?.pluginManifest.name : void 0;
  return /* @__PURE__ */ jsx_dev_runtime277.jsxDEV(ThemedBox_default, {
    children: [
      /* @__PURE__ */ jsx_dev_runtime277.jsxDEV(ThemedText, {
        children: getCommandName(skill_0)
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime277.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          pluginName ? ` \xB7 ${pluginName}` : "",
          " \xB7 ",
          tokenDisplay,
          " description tokens"
        ]
      }, void 0, !0, void 0, this)
    ]
  }, `${skill_0.name}-${skill_0.source}`, !0, void 0, this);
}
function _temp251(a2, b) {
  return getCommandName(a2).localeCompare(getCommandName(b));
}
function _temp134(cmd) {
  return cmd.type === "prompt" && (cmd.loadedFrom === "skills" || cmd.loadedFrom === "commands_DEPRECATED" || cmd.loadedFrom === "plugin" || cmd.loadedFrom === "mcp");
}
var import_compiler_runtime220, jsx_dev_runtime277;
var init_SkillsMenu = __esm(() => {
  init_capitalize();
  init_commands5();
  init_ink2();
  init_loadSkillsDir();
  init_file();
  init_format();
  init_constants2();
  init_ConfigurableShortcutHint();
  init_Dialog();
  import_compiler_runtime220 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime277 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
