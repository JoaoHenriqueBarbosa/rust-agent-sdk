// function: promptLongDescription
async function promptLongDescription(description) {
  if (await esm_default3({
    message: "Add a detailed long description?",
    default: !1
  }))
    return await esm_default4({
      message: "Long description (supports basic markdown):",
      default: description
    });
  return;
}
