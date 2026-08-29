// function: promptTools
async function promptTools() {
  let addTools = await esm_default3({
    message: "Does your MCP Server provide tools you want to advertise (optional)?",
    default: !0
  }), tools = [], toolsGenerated = !1;
  if (addTools) {
    let addMore = !0;
    while (addMore) {
      let toolName = await esm_default4({
        message: "Tool name:",
        validate: (value) => value.trim().length > 0 || "Tool name is required"
      }), toolDescription = await esm_default4({
        message: "Tool description (optional):"
      });
      tools.push({
        name: toolName,
        ...toolDescription ? { description: toolDescription } : {}
      }), addMore = await esm_default3({
        message: "Add another tool?",
        default: !1
      });
    }
    toolsGenerated = await esm_default3({
      message: "Does your server generate additional tools at runtime?",
      default: !1
    });
  }
  return { tools, toolsGenerated };
}
