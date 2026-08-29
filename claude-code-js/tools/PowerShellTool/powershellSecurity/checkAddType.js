// function: checkAddType
function checkAddType(parsed) {
  if (hasCommandNamed(parsed, "Add-Type"))
    return {
      behavior: "ask",
      message: "Command compiles and loads .NET code"
    };
  return { behavior: "passthrough" };
}
