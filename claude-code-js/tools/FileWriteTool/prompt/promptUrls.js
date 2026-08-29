// function: promptUrls
async function promptUrls() {
  let homepage = await esm_default4({
    message: "Homepage URL (optional):",
    validate: (value) => {
      if (!value.trim())
        return !0;
      try {
        return new URL(value), !0;
      } catch {
        return "Must be a valid URL (e.g., https://example.com)";
      }
    }
  }), documentation = await esm_default4({
    message: "Documentation URL (optional):",
    validate: (value) => {
      if (!value.trim())
        return !0;
      try {
        return new URL(value), !0;
      } catch {
        return "Must be a valid URL";
      }
    }
  }), support = await esm_default4({
    message: "Support URL (optional):",
    validate: (value) => {
      if (!value.trim())
        return !0;
      try {
        return new URL(value), !0;
      } catch {
        return "Must be a valid URL";
      }
    }
  });
  return { homepage, documentation, support };
}
