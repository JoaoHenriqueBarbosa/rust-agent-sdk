// function: promptCompatibility
async function promptCompatibility(serverType) {
  if (!await esm_default3({
    message: "Add compatibility constraints?",
    default: !1
  }))
    return;
  let addPlatforms = await esm_default3({
    message: "Specify supported platforms?",
    default: !1
  }), platforms;
  if (addPlatforms) {
    let selectedPlatforms = [];
    if (await esm_default3({
      message: "Support macOS (darwin)?",
      default: !0
    }))
      selectedPlatforms.push("darwin");
    if (await esm_default3({
      message: "Support Windows (win32)?",
      default: !0
    }))
      selectedPlatforms.push("win32");
    if (await esm_default3({
      message: "Support Linux?",
      default: !0
    }))
      selectedPlatforms.push("linux");
    platforms = selectedPlatforms.length > 0 ? selectedPlatforms : void 0;
  }
  let runtimes;
  if (serverType !== "binary") {
    if (await esm_default3({
      message: "Specify runtime version constraints?",
      default: !1
    })) {
      if (serverType === "python")
        runtimes = { python: await esm_default4({
          message: "Python version constraint (e.g., >=3.8,<4.0):",
          validate: (value) => value.trim().length > 0 || "Python version constraint is required"
        }) };
      else if (serverType === "node")
        runtimes = { node: await esm_default4({
          message: "Node.js version constraint (e.g., >=16.0.0):",
          validate: (value) => value.trim().length > 0 || "Node.js version constraint is required"
        }) };
    }
  }
  return {
    ...platforms ? { platforms } : {},
    ...runtimes ? { runtimes } : {}
  };
}
