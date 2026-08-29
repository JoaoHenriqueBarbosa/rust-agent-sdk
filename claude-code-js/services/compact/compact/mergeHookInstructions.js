// function: mergeHookInstructions
function mergeHookInstructions(userInstructions, hookInstructions) {
  if (!hookInstructions)
    return userInstructions || void 0;
  if (!userInstructions)
    return hookInstructions;
  return `${userInstructions}

${hookInstructions}`;
}
