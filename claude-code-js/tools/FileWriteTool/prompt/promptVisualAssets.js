// function: promptVisualAssets
async function promptVisualAssets() {
  let icon = await esm_default4({
    message: "Icon file path (optional, relative to manifest):",
    validate: (value) => {
      if (!value.trim())
        return !0;
      if (value.includes(".."))
        return "Relative paths cannot include '..'";
      return !0;
    }
  }), addIconVariants = await esm_default3({
    message: "Add theme/size-specific icons array?",
    default: !1
  }), icons = [];
  if (addIconVariants) {
    let addMoreIcons = !0;
    while (addMoreIcons) {
      let iconSrc = await esm_default4({
        message: "Icon source path (relative to manifest):",
        validate: (value) => {
          if (!value.trim())
            return "Icon path is required";
          if (value.includes(".."))
            return "Relative paths cannot include '..'";
          return !0;
        }
      }), iconSize = await esm_default4({
        message: "Icon size (e.g., 16x16):",
        validate: (value) => {
          if (!value.trim())
            return "Icon size is required";
          if (!/^\d+x\d+$/.test(value))
            return "Icon size must be in WIDTHxHEIGHT format (e.g., 128x128)";
          return !0;
        }
      }), iconTheme = await esm_default4({
        message: "Icon theme (light, dark, or custom - optional):",
        default: ""
      });
      icons.push({
        src: iconSrc,
        size: iconSize,
        ...iconTheme.trim() ? { theme: iconTheme.trim() } : {}
      }), addMoreIcons = await esm_default3({
        message: "Add another icon entry?",
        default: !1
      });
    }
  }
  let addScreenshots = await esm_default3({
    message: "Add screenshots?",
    default: !1
  }), screenshots = [];
  if (addScreenshots) {
    let addMore = !0;
    while (addMore) {
      let screenshot = await esm_default4({
        message: "Screenshot file path (relative to manifest):",
        validate: (value) => {
          if (!value.trim())
            return "Screenshot path is required";
          if (value.includes(".."))
            return "Relative paths cannot include '..'";
          return !0;
        }
      });
      screenshots.push(screenshot), addMore = await esm_default3({
        message: "Add another screenshot?",
        default: !1
      });
    }
  }
  return { icon, icons, screenshots };
}
