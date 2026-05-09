// function: generateTemporaryCacheNameForPlugin
function generateTemporaryCacheNameForPlugin(source) {
  let timestamp = Date.now(), random2 = Math.random().toString(36).substring(2, 8), prefix;
  if (typeof source === "string")
    prefix = "local";
  else
    switch (source.source) {
      case "npm":
        prefix = "npm";
        break;
      case "pip":
        prefix = "pip";
        break;
      case "github":
        prefix = "github";
        break;
      case "url":
        prefix = "git";
        break;
      case "git-subdir":
        prefix = "subdir";
        break;
      default:
        prefix = "unknown";
    }
  return `temp_${prefix}_${timestamp}_${random2}`;
}
