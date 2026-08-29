// function: createModelSwitchBreadcrumbs
function createModelSwitchBreadcrumbs(modelArg, resolvedDisplay) {
  return [
    createSyntheticUserCaveatMessage(),
    createUserMessage({ content: formatCommandInputTags("model", modelArg) }),
    createUserMessage({
      content: `<${LOCAL_COMMAND_STDOUT_TAG}>Set model to ${resolvedDisplay}</${LOCAL_COMMAND_STDOUT_TAG}>`
    })
  ];
}
