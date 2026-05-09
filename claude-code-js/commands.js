// Original: src/commands.ts
async function getSkills(cwd2) {
  try {
    let [skillDirCommands, pluginSkills] = await Promise.all([
      getSkillDirCommands(cwd2).catch((err2) => {
        return logError2(toError(err2)), logForDebugging("Skill directory commands failed to load, continuing without them"), [];
      }),
      getPluginSkills().catch((err2) => {
        return logError2(toError(err2)), logForDebugging("Plugin skills failed to load, continuing without them"), [];
      })
    ]), bundledSkills2 = getBundledSkills(), builtinPluginSkills = getBuiltinPluginSkillCommands();
    return logForDebugging(`getSkills returning: ${skillDirCommands.length} skill dir commands, ${pluginSkills.length} plugin skills, ${bundledSkills2.length} bundled skills, ${builtinPluginSkills.length} builtin plugin skills`), {
      skillDirCommands,
      pluginSkills,
      bundledSkills: bundledSkills2,
      builtinPluginSkills
    };
  } catch (err2) {
    return logError2(toError(err2)), logForDebugging("Unexpected error in getSkills, returning empty"), {
      skillDirCommands: [],
      pluginSkills: [],
      bundledSkills: [],
      builtinPluginSkills: []
    };
  }
}
function meetsAvailabilityRequirement(cmd) {
  if (!cmd.availability)
    return !0;
  for (let a2 of cmd.availability)
    switch (a2) {
      case "claude-ai":
        if (isClaudeAISubscriber())
          return !0;
        break;
      case "console":
        if (!isClaudeAISubscriber() && !isUsing3PServices() && isFirstPartyAnthropicBaseUrl())
          return !0;
        break;
      default: {
        let _exhaustive = a2;
        break;
      }
    }
  return !1;
}
async function getCommands(cwd2) {
  let allCommands = await loadAllCommands(cwd2), dynamicSkills2 = getDynamicSkills(), baseCommands = allCommands.filter((_) => meetsAvailabilityRequirement(_) && isCommandEnabled(_));
  if (dynamicSkills2.length === 0)
    return baseCommands;
  let baseCommandNames = new Set(baseCommands.map((c3) => c3.name)), uniqueDynamicSkills = dynamicSkills2.filter((s2) => !baseCommandNames.has(s2.name) && meetsAvailabilityRequirement(s2) && isCommandEnabled(s2));
  if (uniqueDynamicSkills.length === 0)
    return baseCommands;
  let builtInNames = new Set(COMMANDS().map((c3) => c3.name)), insertIndex = baseCommands.findIndex((c3) => builtInNames.has(c3.name));
  if (insertIndex === -1)
    return [...baseCommands, ...uniqueDynamicSkills];
  return [
    ...baseCommands.slice(0, insertIndex),
    ...uniqueDynamicSkills,
    ...baseCommands.slice(insertIndex)
  ];
}
function clearCommandMemoizationCaches() {
  loadAllCommands.cache?.clear?.(), getSkillToolCommands.cache?.clear?.(), getSlashCommandToolSkills.cache?.clear?.();
}
function clearCommandsCache() {
  clearCommandMemoizationCaches(), clearPluginCommandCache(), clearPluginSkillsCache(), clearSkillCaches();
}
function getMcpSkillCommands(_mcpCommands) {
  return [];
}
function isBridgeSafeCommand(cmd) {
  if (cmd.type === "local-jsx")
    return !1;
  if (cmd.type === "prompt")
    return !0;
  return BRIDGE_SAFE_COMMANDS.has(cmd);
}
function filterCommandsForRemoteMode(commands7) {
  return commands7.filter((cmd) => REMOTE_SAFE_COMMANDS.has(cmd));
}
function findCommand(commandName, commands7) {
  return commands7.find((_) => _.name === commandName || getCommandName(_) === commandName || _.aliases?.includes(commandName));
}
function hasCommand(commandName, commands7) {
  return findCommand(commandName, commands7) !== void 0;
}
function getCommand(commandName, commands7) {
  let command19 = findCommand(commandName, commands7);
  if (!command19)
    throw ReferenceError(`Command ${commandName} not found. Available commands: ${commands7.map((_) => {
      let name3 = getCommandName(_);
      return _.aliases ? `${name3} (aliases: ${_.aliases.join(", ")})` : name3;
    }).sort((a2, b) => a2.localeCompare(b)).join(", ")}`);
  return command19;
}
function formatDescriptionWithSource(cmd) {
  if (cmd.type !== "prompt")
    return cmd.description;
  if (cmd.kind === "workflow")
    return `${cmd.description} (workflow)`;
  if (cmd.source === "plugin") {
    let pluginName = cmd.pluginInfo?.pluginManifest.name;
    if (pluginName)
      return `(${pluginName}) ${cmd.description}`;
    return `${cmd.description} (plugin)`;
  }
  if (cmd.source === "builtin" || cmd.source === "mcp")
    return cmd.description;
  if (cmd.source === "bundled")
    return `${cmd.description} (bundled)`;
  return `${cmd.description} (${getSettingSourceName(cmd.source)})`;
}
var voiceCommand, webCmd, usageReport2, INTERNAL_ONLY_COMMANDS2, COMMANDS, builtInCommandNames, loadAllCommands, getSkillToolCommands, getSlashCommandToolSkills, REMOTE_SAFE_COMMANDS, BRIDGE_SAFE_COMMANDS;
var init_commands5 = __esm(() => {
  init_add_dir2();
  init_btw2();
  init_feedback2();
  init_clear2();
  init_color3();
  init_commit();
  init_copy2();
  init_desktop2();
  init_commit_push_pr();
  init_compact3();
  init_config14();
  init_context4();
  init_cost2();
  init_diff4();
  init_doctor2();
  init_memory2();
  init_help2();
  init_ide3();
  init_init2();
  init_init_verifiers();
  init_keybindings2();
  init_login2();
  init_logout2();
  init_install_github_app2();
  init_install_slack_app2();
  init_mcp3();
  init_mobile2();
  init_pr_comments();
  init_release_notes2();
  init_rename2();
  init_resume2();
  init_review();
  init_session2();
  init_skills2();
  init_status3();
  init_tasks4();
  init_security_review();
  init_terminalSetup2();
  init_usage3();
  init_theme4();
  init_vim2();
  init_permissions4();
  init_plan2();
  init_fast2();
  init_passes2();
  init_privacy_settings2();
  init_hooks3();
  init_files5();
  init_branch2();
  init_agents2();
  init_plugin2();
  init_reload_plugins2();
  init_rewind();
  init_heapdump2();
  init_version();
  init_sandbox_toggle2();
  init_chrome2();
  init_stickers2();
  init_advisor2();
  init_log3();
  init_errors();
  init_debug();
  init_loadSkillsDir();
  init_bundledSkills();
  init_builtinPlugins();
  init_loadPluginCommands();
  init_memoize();
  init_auth14();
  init_providers();
  init_exit2();
  init_export2();
  init_model3();
  init_tag2();
  init_output_style();
  init_remote_env2();
  init_upgrade2();
  init_extra_usage2();
  init_rate_limit_options2();
  init_statusline();
  init_effort3();
  init_stats3();
  init_constants2();
  voiceCommand = (init_voice4(), __toCommonJS(exports_voice4)).default, webCmd = (init_remote_setup2(), __toCommonJS(exports_remote_setup2)).default, usageReport2 = {
    type: "prompt",
    name: "insights",
    description: "Generate a report analyzing your Claude Code sessions",
    contentLength: 0,
    progressMessage: "analyzing your sessions",
    source: "builtin",
    async getPromptForCommand(args, context7) {
      let real = (await Promise.resolve().then(() => (init_insights(), exports_insights))).default;
      if (real.type !== "prompt")
        throw Error("unreachable");
      return real.getPromptForCommand(args, context7);
    }
  }, INTERNAL_ONLY_COMMANDS2 = [
    commit_default,
    commit_push_pr_default,
    init_verifiers_default,
    version_default
  ].filter(Boolean), COMMANDS = memoize_default(() => [
    add_dir_default,
    advisor_default,
    agents_default,
    branch_default,
    btw_default,
    chrome_default,
    clear_default,
    color_default,
    compact_default,
    config_default,
    copy_default,
    desktop_default,
    context6,
    contextNonInteractive,
    cost_default,
    diff_default,
    doctor_default,
    effort_default,
    exit_default,
    fast_default,
    files_default,
    heapdump_default,
    help_default,
    ide_default,
    init_default3,
    keybindings_default,
    install_github_app_default,
    install_slack_app_default,
    mcp_default,
    memory_default,
    mobile_default,
    model_default,
    output_style_default,
    remote_env_default,
    plugin_default,
    pr_comments_default,
    release_notes_default,
    reload_plugins_default,
    rename_default,
    resume_default,
    session_default,
    skills_default,
    stats_default,
    status_default,
    statusline_default,
    stickers_default,
    tag_default,
    theme_default,
    feedback_default,
    review_default,
    ultrareview,
    rewind_default,
    security_review_default,
    terminalSetup_default,
    upgrade_default,
    extraUsage,
    extraUsageNonInteractive,
    rate_limit_options_default,
    usage_default,
    usageReport2,
    vim_default,
    ...webCmd ? [webCmd] : [],
    ...voiceCommand ? [voiceCommand] : [],
    permissions_default,
    plan_default,
    privacy_settings_default,
    hooks_default,
    export_default,
    sandbox_toggle_default,
    ...!isUsing3PServices() ? [logout_default, login_default()] : [],
    passes_default,
    tasks_default,
    ...INTERNAL_ONLY_COMMANDS2
  ]), builtInCommandNames = memoize_default(() => new Set(COMMANDS().flatMap((_) => [_.name, ..._.aliases ?? []])));
  loadAllCommands = memoize_default(async (cwd2) => {
    let [
      { skillDirCommands, pluginSkills, bundledSkills: bundledSkills2, builtinPluginSkills },
      pluginCommands
    ] = await Promise.all([
      getSkills(cwd2),
      getPluginCommands()
    ]);
    return [
      ...bundledSkills2,
      ...builtinPluginSkills,
      ...skillDirCommands,
      ...pluginCommands,
      ...pluginSkills,
      ...COMMANDS()
    ];
  });
  getSkillToolCommands = memoize_default(async (cwd2) => {
    return (await getCommands(cwd2)).filter((cmd) => cmd.type === "prompt" && !cmd.disableModelInvocation && cmd.source !== "builtin" && (cmd.loadedFrom === "bundled" || cmd.loadedFrom === "skills" || cmd.loadedFrom === "commands_DEPRECATED" || cmd.hasUserSpecifiedDescription || cmd.whenToUse));
  }), getSlashCommandToolSkills = memoize_default(async (cwd2) => {
    try {
      return (await getCommands(cwd2)).filter((cmd) => cmd.type === "prompt" && cmd.source !== "builtin" && (cmd.hasUserSpecifiedDescription || cmd.whenToUse) && (cmd.loadedFrom === "skills" || cmd.loadedFrom === "plugin" || cmd.loadedFrom === "bundled" || cmd.disableModelInvocation));
    } catch (error44) {
      return logError2(toError(error44)), logForDebugging("Returning empty skills array due to load failure"), [];
    }
  }), REMOTE_SAFE_COMMANDS = /* @__PURE__ */ new Set([
    session_default,
    exit_default,
    clear_default,
    help_default,
    theme_default,
    color_default,
    vim_default,
    cost_default,
    usage_default,
    copy_default,
    btw_default,
    feedback_default,
    plan_default,
    keybindings_default,
    statusline_default,
    stickers_default,
    mobile_default
  ]), BRIDGE_SAFE_COMMANDS = new Set([
    compact_default,
    clear_default,
    cost_default,
    release_notes_default,
    files_default
  ].filter((c3) => c3 !== null));
});
