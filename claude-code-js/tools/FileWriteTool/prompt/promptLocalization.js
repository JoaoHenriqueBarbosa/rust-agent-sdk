// function: promptLocalization
async function promptLocalization() {
  if (!await esm_default3({
    message: "Configure localization resources?",
    default: !1
  }))
    return;
  let placeholderRegex = /\$\{locale\}/i, resourcesPath = await esm_default4({
    message: "Localization resources path (must include ${locale} placeholder):",
    default: "resources/${locale}.json",
    validate: (value) => {
      if (!value.trim())
        return "Resources path is required";
      if (value.includes(".."))
        return "Relative paths cannot include '..'";
      if (!placeholderRegex.test(value))
        return "Path must include a ${locale} placeholder";
      return !0;
    }
  }), defaultLocale = await esm_default4({
    message: "Default locale (BCP 47, e.g., en-US):",
    default: "en-US",
    validate: (value) => {
      if (!value.trim())
        return "Default locale is required";
      if (!/^[A-Za-z0-9]{2,8}(?:-[A-Za-z0-9]{1,8})*$/.test(value))
        return "Default locale must follow BCP 47 (e.g., en-US or zh-Hans)";
      return !0;
    }
  });
  return {
    resources: resourcesPath,
    default_locale: defaultLocale
  };
}
