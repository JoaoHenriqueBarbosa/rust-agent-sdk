// function: PluginComponentsDisplay
function PluginComponentsDisplay({
  plugin,
  marketplace
}) {
  let [components, setComponents] = import_react137.useState(null), [loading, setLoading] = import_react137.useState(!0), [error44, setError] = import_react137.useState(null);
  if (import_react137.useEffect(() => {
    async function loadComponents() {
      try {
        if (marketplace === "builtin") {
          let builtinDef = getBuiltinPluginDefinition(plugin.name);
          if (builtinDef) {
            let skillNames = builtinDef.skills?.map((s2) => s2.name) ?? [], hookEvents = builtinDef.hooks ? Object.keys(builtinDef.hooks) : [], mcpServerNames = builtinDef.mcpServers ? Object.keys(builtinDef.mcpServers) : [];
            setComponents({
              commands: null,
              agents: null,
              skills: skillNames.length > 0 ? skillNames : null,
              hooks: hookEvents.length > 0 ? hookEvents : null,
              mcpServers: mcpServerNames.length > 0 ? mcpServerNames : null
            });
          } else
            setError(`Built-in plugin ${plugin.name} not found`);
          setLoading(!1);
          return;
        }
        let pluginEntry = (await getMarketplace(marketplace)).plugins.find((p4) => p4.name === plugin.name);
        if (pluginEntry) {
          let commandPathList = [];
          if (plugin.commandsPath)
            commandPathList.push(plugin.commandsPath);
          if (plugin.commandsPaths)
            commandPathList.push(...plugin.commandsPaths);
          let commandList = [];
          for (let commandPath of commandPathList)
            if (typeof commandPath === "string") {
              let baseNames = await getBaseFileNames(commandPath);
              commandList.push(...baseNames);
            }
          let agentPathList = [];
          if (plugin.agentsPath)
            agentPathList.push(plugin.agentsPath);
          if (plugin.agentsPaths)
            agentPathList.push(...plugin.agentsPaths);
          let agentList = [];
          for (let agentPath of agentPathList)
            if (typeof agentPath === "string") {
              let baseNames_0 = await getBaseFileNames(agentPath);
              agentList.push(...baseNames_0);
            }
          let skillPathList = [];
          if (plugin.skillsPath)
            skillPathList.push(plugin.skillsPath);
          if (plugin.skillsPaths)
            skillPathList.push(...plugin.skillsPaths);
          let skillList = [];
          for (let skillPath of skillPathList)
            if (typeof skillPath === "string") {
              let skillDirNames = await getSkillDirNames(skillPath);
              skillList.push(...skillDirNames);
            }
          let hooksList = [];
          if (plugin.hooksConfig)
            hooksList.push(Object.keys(plugin.hooksConfig));
          if (pluginEntry.hooks)
            hooksList.push(pluginEntry.hooks);
          let mcpServersList = [];
          if (plugin.mcpServers)
            mcpServersList.push(Object.keys(plugin.mcpServers));
          if (pluginEntry.mcpServers)
            mcpServersList.push(pluginEntry.mcpServers);
          setComponents({
            commands: commandList.length > 0 ? commandList : null,
            agents: agentList.length > 0 ? agentList : null,
            skills: skillList.length > 0 ? skillList : null,
            hooks: hooksList.length > 0 ? hooksList : null,
            mcpServers: mcpServersList.length > 0 ? mcpServersList : null
          });
        } else
          setError(`Plugin ${plugin.name} not found in marketplace`);
      } catch (err2) {
        setError(err2 instanceof Error ? err2.message : "Failed to load components");
      } finally {
        setLoading(!1);
      }
    }
    loadComponents();
  }, [plugin.name, plugin.commandsPath, plugin.commandsPaths, plugin.agentsPath, plugin.agentsPaths, plugin.skillsPath, plugin.skillsPaths, plugin.hooksConfig, plugin.mcpServers, marketplace]), loading)
    return null;
  if (error44)
    return /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginBottom: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
          bold: !0,
          children: "Components:"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            "Error: ",
            error44
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this);
  if (!components)
    return null;
  if (!(components.commands || components.agents || components.skills || components.hooks || components.mcpServers))
    return null;
  return /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    marginBottom: 1,
    children: [
      /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
        bold: !0,
        children: "Installed components:"
      }, void 0, !1, void 0, this),
      components.commands ? /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "\u2022 Commands:",
          " ",
          typeof components.commands === "string" ? components.commands : Array.isArray(components.commands) ? components.commands.join(", ") : Object.keys(components.commands).join(", ")
        ]
      }, void 0, !0, void 0, this) : null,
      components.agents ? /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "\u2022 Agents:",
          " ",
          typeof components.agents === "string" ? components.agents : Array.isArray(components.agents) ? components.agents.join(", ") : Object.keys(components.agents).join(", ")
        ]
      }, void 0, !0, void 0, this) : null,
      components.skills ? /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "\u2022 Skills:",
          " ",
          typeof components.skills === "string" ? components.skills : Array.isArray(components.skills) ? components.skills.join(", ") : Object.keys(components.skills).join(", ")
        ]
      }, void 0, !0, void 0, this) : null,
      components.hooks ? /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "\u2022 Hooks:",
          " ",
          typeof components.hooks === "string" ? components.hooks : Array.isArray(components.hooks) ? components.hooks.map(String).join(", ") : typeof components.hooks === "object" && components.hooks !== null ? Object.keys(components.hooks).join(", ") : String(components.hooks)
        ]
      }, void 0, !0, void 0, this) : null,
      components.mcpServers ? /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "\u2022 MCP Servers:",
          " ",
          typeof components.mcpServers === "string" ? components.mcpServers : Array.isArray(components.mcpServers) ? components.mcpServers.map(String).join(", ") : typeof components.mcpServers === "object" && components.mcpServers !== null ? Object.keys(components.mcpServers).join(", ") : String(components.mcpServers)
        ]
      }, void 0, !0, void 0, this) : null
    ]
  }, void 0, !0, void 0, this);
}
