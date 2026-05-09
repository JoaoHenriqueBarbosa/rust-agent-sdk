// function: transformRedirection
function transformRedirection(raw) {
  if (raw.type === "MergingRedirectionAst")
    return { operator: "2>&1", target: "", isMerging: !0 };
  let append2 = raw.append ?? !1, fromStream = raw.fromStream ?? "Output", operator;
  if (append2)
    switch (fromStream) {
      case "Error":
        operator = "2>>";
        break;
      case "All":
        operator = "*>>";
        break;
      default:
        operator = ">>";
        break;
    }
  else
    switch (fromStream) {
      case "Error":
        operator = "2>";
        break;
      case "All":
        operator = "*>";
        break;
      default:
        operator = ">";
        break;
    }
  return { operator, target: raw.locationText ?? "", isMerging: !1 };
}
