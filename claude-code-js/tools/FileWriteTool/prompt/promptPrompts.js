// function: promptPrompts
async function promptPrompts() {
  let addPrompts = await esm_default3({
    message: "Does your MCP Server provide prompts you want to advertise (optional)?",
    default: !1
  }), prompts = [], promptsGenerated = !1;
  if (addPrompts) {
    let addMore = !0;
    while (addMore) {
      let promptName = await esm_default4({
        message: "Prompt name:",
        validate: (value) => value.trim().length > 0 || "Prompt name is required"
      }), promptDescription = await esm_default4({
        message: "Prompt description (optional):"
      }), hasArguments = await esm_default3({
        message: "Does this prompt have arguments?",
        default: !1
      }), argumentNames = [];
      if (hasArguments) {
        let addMoreArgs = !0;
        while (addMoreArgs) {
          let argName = await esm_default4({
            message: "Argument name:",
            validate: (value) => {
              if (!value.trim())
                return "Argument name is required";
              if (argumentNames.includes(value))
                return "Argument names must be unique";
              return !0;
            }
          });
          argumentNames.push(argName), addMoreArgs = await esm_default3({
            message: "Add another argument?",
            default: !1
          });
        }
      }
      let promptText = await esm_default4({
        message: hasArguments ? `Prompt text (use \${arguments.name} for arguments: ${argumentNames.join(", ")}):` : "Prompt text:",
        validate: (value) => value.trim().length > 0 || "Prompt text is required"
      });
      prompts.push({
        name: promptName,
        ...promptDescription ? { description: promptDescription } : {},
        ...argumentNames.length > 0 ? { arguments: argumentNames } : {},
        text: promptText
      }), addMore = await esm_default3({
        message: "Add another prompt?",
        default: !1
      });
    }
    promptsGenerated = await esm_default3({
      message: "Does your server generate additional prompts at runtime?",
      default: !1
    });
  }
  return { prompts, promptsGenerated };
}
