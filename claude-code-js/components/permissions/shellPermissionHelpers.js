// Original: src/components/permissions/shellPermissionHelpers.tsx
import { basename as basename48, sep as sep34 } from "path";
function commandListDisplay(commands7) {
  switch (commands7.length) {
    case 0:
      return "";
    case 1:
      return /* @__PURE__ */ jsx_dev_runtime385.jsxDEV(ThemedText, {
        bold: !0,
        children: commands7[0]
      }, void 0, !1, void 0, this);
    case 2:
      return /* @__PURE__ */ jsx_dev_runtime385.jsxDEV(ThemedText, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime385.jsxDEV(ThemedText, {
            bold: !0,
            children: commands7[0]
          }, void 0, !1, void 0, this),
          " and ",
          /* @__PURE__ */ jsx_dev_runtime385.jsxDEV(ThemedText, {
            bold: !0,
            children: commands7[1]
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this);
    default:
      return /* @__PURE__ */ jsx_dev_runtime385.jsxDEV(ThemedText, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime385.jsxDEV(ThemedText, {
            bold: !0,
            children: commands7.slice(0, -1).join(", ")
          }, void 0, !1, void 0, this),
          ", and",
          " ",
          /* @__PURE__ */ jsx_dev_runtime385.jsxDEV(ThemedText, {
            bold: !0,
            children: commands7.slice(-1)[0]
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this);
  }
}
function commandListDisplayTruncated(commands7) {
  if (commands7.join(", ").length > 50)
    return "similar";
  return commandListDisplay(commands7);
}
function formatPathList(paths2) {
  if (paths2.length === 0)
    return "";
  let names = paths2.map((p4) => basename48(p4) || p4);
  if (names.length === 1)
    return /* @__PURE__ */ jsx_dev_runtime385.jsxDEV(ThemedText, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime385.jsxDEV(ThemedText, {
          bold: !0,
          children: names[0]
        }, void 0, !1, void 0, this),
        sep34
      ]
    }, void 0, !0, void 0, this);
  if (names.length === 2)
    return /* @__PURE__ */ jsx_dev_runtime385.jsxDEV(ThemedText, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime385.jsxDEV(ThemedText, {
          bold: !0,
          children: names[0]
        }, void 0, !1, void 0, this),
        sep34,
        " and ",
        /* @__PURE__ */ jsx_dev_runtime385.jsxDEV(ThemedText, {
          bold: !0,
          children: names[1]
        }, void 0, !1, void 0, this),
        sep34
      ]
    }, void 0, !0, void 0, this);
  return /* @__PURE__ */ jsx_dev_runtime385.jsxDEV(ThemedText, {
    children: [
      /* @__PURE__ */ jsx_dev_runtime385.jsxDEV(ThemedText, {
        bold: !0,
        children: names[0]
      }, void 0, !1, void 0, this),
      sep34,
      ", ",
      /* @__PURE__ */ jsx_dev_runtime385.jsxDEV(ThemedText, {
        bold: !0,
        children: names[1]
      }, void 0, !1, void 0, this),
      sep34,
      " and ",
      paths2.length - 2,
      " more"
    ]
  }, void 0, !0, void 0, this);
}
function generateShellSuggestionsLabel(suggestions, shellToolName, commandTransform) {
  let allRules = suggestions.filter((s2) => s2.type === "addRules").flatMap((s2) => s2.rules || []), readRules = allRules.filter((r4) => r4.toolName === "Read"), shellRules = allRules.filter((r4) => r4.toolName === shellToolName), directories = suggestions.filter((s2) => s2.type === "addDirectories").flatMap((s2) => s2.directories || []), readPaths = readRules.map((r4) => r4.ruleContent?.replace("/**", "") || "").filter((p4) => p4), shellCommands = [...new Set(shellRules.flatMap((rule) => {
    if (!rule.ruleContent)
      return [];
    let command19 = permissionRuleExtractPrefix2(rule.ruleContent) ?? rule.ruleContent;
    return commandTransform ? commandTransform(command19) : command19;
  }))], hasDirectories = directories.length > 0, hasReadPaths = readPaths.length > 0, hasCommands = shellCommands.length > 0;
  if (hasReadPaths && !hasDirectories && !hasCommands) {
    if (readPaths.length === 1) {
      let firstPath = readPaths[0], dirName = basename48(firstPath) || firstPath;
      return /* @__PURE__ */ jsx_dev_runtime385.jsxDEV(ThemedText, {
        children: [
          "Yes, allow reading from ",
          /* @__PURE__ */ jsx_dev_runtime385.jsxDEV(ThemedText, {
            bold: !0,
            children: dirName
          }, void 0, !1, void 0, this),
          sep34,
          " from this project"
        ]
      }, void 0, !0, void 0, this);
    }
    return /* @__PURE__ */ jsx_dev_runtime385.jsxDEV(ThemedText, {
      children: [
        "Yes, allow reading from ",
        formatPathList(readPaths),
        " from this project"
      ]
    }, void 0, !0, void 0, this);
  }
  if (hasDirectories && !hasReadPaths && !hasCommands) {
    if (directories.length === 1) {
      let firstDir = directories[0], dirName = basename48(firstDir) || firstDir;
      return /* @__PURE__ */ jsx_dev_runtime385.jsxDEV(ThemedText, {
        children: [
          "Yes, and always allow access to ",
          /* @__PURE__ */ jsx_dev_runtime385.jsxDEV(ThemedText, {
            bold: !0,
            children: dirName
          }, void 0, !1, void 0, this),
          sep34,
          " from this project"
        ]
      }, void 0, !0, void 0, this);
    }
    return /* @__PURE__ */ jsx_dev_runtime385.jsxDEV(ThemedText, {
      children: [
        "Yes, and always allow access to ",
        formatPathList(directories),
        " from this project"
      ]
    }, void 0, !0, void 0, this);
  }
  if (hasCommands && !hasDirectories && !hasReadPaths)
    return /* @__PURE__ */ jsx_dev_runtime385.jsxDEV(ThemedText, {
      children: [
        "Yes, and don't ask again for ",
        commandListDisplayTruncated(shellCommands),
        " commands in",
        " ",
        /* @__PURE__ */ jsx_dev_runtime385.jsxDEV(ThemedText, {
          bold: !0,
          children: getOriginalCwd()
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this);
  if ((hasDirectories || hasReadPaths) && !hasCommands) {
    let allPaths = [...directories, ...readPaths];
    if (hasDirectories && hasReadPaths)
      return /* @__PURE__ */ jsx_dev_runtime385.jsxDEV(ThemedText, {
        children: [
          "Yes, and always allow access to ",
          formatPathList(allPaths),
          " from this project"
        ]
      }, void 0, !0, void 0, this);
  }
  if ((hasDirectories || hasReadPaths) && hasCommands) {
    let allPaths = [...directories, ...readPaths];
    if (allPaths.length === 1 && shellCommands.length === 1)
      return /* @__PURE__ */ jsx_dev_runtime385.jsxDEV(ThemedText, {
        children: [
          "Yes, and allow access to ",
          formatPathList(allPaths),
          " and",
          " ",
          commandListDisplayTruncated(shellCommands),
          " commands"
        ]
      }, void 0, !0, void 0, this);
    return /* @__PURE__ */ jsx_dev_runtime385.jsxDEV(ThemedText, {
      children: [
        "Yes, and allow ",
        formatPathList(allPaths),
        " access and",
        " ",
        commandListDisplayTruncated(shellCommands),
        " commands"
      ]
    }, void 0, !0, void 0, this);
  }
  return null;
}
var jsx_dev_runtime385;
var init_shellPermissionHelpers = __esm(() => {
  init_state();
  init_ink2();
  init_shellRuleMatching();
  jsx_dev_runtime385 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
