// Original: src/commands/plugin/UnifiedInstalledCell.tsx
function UnifiedInstalledCell(t0) {
  let $3 = import_compiler_runtime191.c(142), {
    item,
    isSelected
  } = t0, [theme] = useTheme();
  if (item.type === "plugin") {
    let statusIcon, statusText;
    if (item.pendingToggle) {
      let t15;
      if ($3[0] !== theme)
        t15 = color("suggestion", theme)(figures_default.arrowRight), $3[0] = theme, $3[1] = t15;
      else
        t15 = $3[1];
      statusIcon = t15, statusText = item.pendingToggle === "will-enable" ? "will enable" : "will disable";
    } else if (item.errorCount > 0) {
      let t15;
      if ($3[2] !== theme)
        t15 = color("error", theme)(figures_default.cross), $3[2] = theme, $3[3] = t15;
      else
        t15 = $3[3];
      statusIcon = t15;
      let t23 = item.errorCount, t33;
      if ($3[4] !== item.errorCount)
        t33 = plural(item.errorCount, "error"), $3[4] = item.errorCount, $3[5] = t33;
      else
        t33 = $3[5];
      statusText = `${t23} ${t33}`;
    } else if (!item.isEnabled) {
      let t15;
      if ($3[6] !== theme)
        t15 = color("inactive", theme)(figures_default.radioOff), $3[6] = theme, $3[7] = t15;
      else
        t15 = $3[7];
      statusIcon = t15, statusText = "disabled";
    } else {
      let t15;
      if ($3[8] !== theme)
        t15 = color("success", theme)(figures_default.tick), $3[8] = theme, $3[9] = t15;
      else
        t15 = $3[9];
      statusIcon = t15, statusText = "enabled";
    }
    let t14 = isSelected ? "suggestion" : void 0, t22 = isSelected ? `${figures_default.pointer} ` : "  ", t32;
    if ($3[10] !== t14 || $3[11] !== t22)
      t32 = /* @__PURE__ */ jsx_dev_runtime241.jsxDEV(ThemedText, {
        color: t14,
        children: t22
      }, void 0, !1, void 0, this), $3[10] = t14, $3[11] = t22, $3[12] = t32;
    else
      t32 = $3[12];
    let t42 = isSelected ? "suggestion" : void 0, t52;
    if ($3[13] !== item.name || $3[14] !== t42)
      t52 = /* @__PURE__ */ jsx_dev_runtime241.jsxDEV(ThemedText, {
        color: t42,
        children: item.name
      }, void 0, !1, void 0, this), $3[13] = item.name, $3[14] = t42, $3[15] = t52;
    else
      t52 = $3[15];
    let t62 = !isSelected, t72;
    if ($3[16] === Symbol.for("react.memo_cache_sentinel"))
      t72 = /* @__PURE__ */ jsx_dev_runtime241.jsxDEV(ThemedText, {
        backgroundColor: "userMessageBackground",
        children: "Plugin"
      }, void 0, !1, void 0, this), $3[16] = t72;
    else
      t72 = $3[16];
    let t82;
    if ($3[17] !== t62)
      t82 = /* @__PURE__ */ jsx_dev_runtime241.jsxDEV(ThemedText, {
        dimColor: t62,
        children: [
          " ",
          t72
        ]
      }, void 0, !0, void 0, this), $3[17] = t62, $3[18] = t82;
    else
      t82 = $3[18];
    let t92;
    if ($3[19] !== item.marketplace)
      t92 = /* @__PURE__ */ jsx_dev_runtime241.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          " \xB7 ",
          item.marketplace
        ]
      }, void 0, !0, void 0, this), $3[19] = item.marketplace, $3[20] = t92;
    else
      t92 = $3[20];
    let t102 = !isSelected, t112;
    if ($3[21] !== statusIcon || $3[22] !== t102)
      t112 = /* @__PURE__ */ jsx_dev_runtime241.jsxDEV(ThemedText, {
        dimColor: t102,
        children: [
          " \xB7 ",
          statusIcon,
          " "
        ]
      }, void 0, !0, void 0, this), $3[21] = statusIcon, $3[22] = t102, $3[23] = t112;
    else
      t112 = $3[23];
    let t122 = !isSelected, t132;
    if ($3[24] !== statusText || $3[25] !== t122)
      t132 = /* @__PURE__ */ jsx_dev_runtime241.jsxDEV(ThemedText, {
        dimColor: t122,
        children: statusText
      }, void 0, !1, void 0, this), $3[24] = statusText, $3[25] = t122, $3[26] = t132;
    else
      t132 = $3[26];
    let t142;
    if ($3[27] !== t112 || $3[28] !== t132 || $3[29] !== t32 || $3[30] !== t52 || $3[31] !== t82 || $3[32] !== t92)
      t142 = /* @__PURE__ */ jsx_dev_runtime241.jsxDEV(ThemedBox_default, {
        children: [
          t32,
          t52,
          t82,
          t92,
          t112,
          t132
        ]
      }, void 0, !0, void 0, this), $3[27] = t112, $3[28] = t132, $3[29] = t32, $3[30] = t52, $3[31] = t82, $3[32] = t92, $3[33] = t142;
    else
      t142 = $3[33];
    return t142;
  }
  if (item.type === "flagged-plugin") {
    let t14;
    if ($3[34] !== theme)
      t14 = color("warning", theme)(figures_default.warning), $3[34] = theme, $3[35] = t14;
    else
      t14 = $3[35];
    let statusIcon_0 = t14, t22 = isSelected ? "suggestion" : void 0, t32 = isSelected ? `${figures_default.pointer} ` : "  ", t42;
    if ($3[36] !== t22 || $3[37] !== t32)
      t42 = /* @__PURE__ */ jsx_dev_runtime241.jsxDEV(ThemedText, {
        color: t22,
        children: t32
      }, void 0, !1, void 0, this), $3[36] = t22, $3[37] = t32, $3[38] = t42;
    else
      t42 = $3[38];
    let t52 = isSelected ? "suggestion" : void 0, t62;
    if ($3[39] !== item.name || $3[40] !== t52)
      t62 = /* @__PURE__ */ jsx_dev_runtime241.jsxDEV(ThemedText, {
        color: t52,
        children: item.name
      }, void 0, !1, void 0, this), $3[39] = item.name, $3[40] = t52, $3[41] = t62;
    else
      t62 = $3[41];
    let t72 = !isSelected, t82;
    if ($3[42] === Symbol.for("react.memo_cache_sentinel"))
      t82 = /* @__PURE__ */ jsx_dev_runtime241.jsxDEV(ThemedText, {
        backgroundColor: "userMessageBackground",
        children: "Plugin"
      }, void 0, !1, void 0, this), $3[42] = t82;
    else
      t82 = $3[42];
    let t92;
    if ($3[43] !== t72)
      t92 = /* @__PURE__ */ jsx_dev_runtime241.jsxDEV(ThemedText, {
        dimColor: t72,
        children: [
          " ",
          t82
        ]
      }, void 0, !0, void 0, this), $3[43] = t72, $3[44] = t92;
    else
      t92 = $3[44];
    let t102;
    if ($3[45] !== item.marketplace)
      t102 = /* @__PURE__ */ jsx_dev_runtime241.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          " \xB7 ",
          item.marketplace
        ]
      }, void 0, !0, void 0, this), $3[45] = item.marketplace, $3[46] = t102;
    else
      t102 = $3[46];
    let t112 = !isSelected, t122;
    if ($3[47] !== statusIcon_0 || $3[48] !== t112)
      t122 = /* @__PURE__ */ jsx_dev_runtime241.jsxDEV(ThemedText, {
        dimColor: t112,
        children: [
          " \xB7 ",
          statusIcon_0,
          " "
        ]
      }, void 0, !0, void 0, this), $3[47] = statusIcon_0, $3[48] = t112, $3[49] = t122;
    else
      t122 = $3[49];
    let t132 = !isSelected, t142;
    if ($3[50] !== t132)
      t142 = /* @__PURE__ */ jsx_dev_runtime241.jsxDEV(ThemedText, {
        dimColor: t132,
        children: "removed"
      }, void 0, !1, void 0, this), $3[50] = t132, $3[51] = t142;
    else
      t142 = $3[51];
    let t15;
    if ($3[52] !== t102 || $3[53] !== t122 || $3[54] !== t142 || $3[55] !== t42 || $3[56] !== t62 || $3[57] !== t92)
      t15 = /* @__PURE__ */ jsx_dev_runtime241.jsxDEV(ThemedBox_default, {
        children: [
          t42,
          t62,
          t92,
          t102,
          t122,
          t142
        ]
      }, void 0, !0, void 0, this), $3[52] = t102, $3[53] = t122, $3[54] = t142, $3[55] = t42, $3[56] = t62, $3[57] = t92, $3[58] = t15;
    else
      t15 = $3[58];
    return t15;
  }
  if (item.type === "failed-plugin") {
    let t14;
    if ($3[59] !== theme)
      t14 = color("error", theme)(figures_default.cross), $3[59] = theme, $3[60] = t14;
    else
      t14 = $3[60];
    let statusIcon_1 = t14, t22 = item.errorCount, t32;
    if ($3[61] !== item.errorCount)
      t32 = plural(item.errorCount, "error"), $3[61] = item.errorCount, $3[62] = t32;
    else
      t32 = $3[62];
    let statusText_0 = `failed to load \xB7 ${t22} ${t32}`, t42 = isSelected ? "suggestion" : void 0, t52 = isSelected ? `${figures_default.pointer} ` : "  ", t62;
    if ($3[63] !== t42 || $3[64] !== t52)
      t62 = /* @__PURE__ */ jsx_dev_runtime241.jsxDEV(ThemedText, {
        color: t42,
        children: t52
      }, void 0, !1, void 0, this), $3[63] = t42, $3[64] = t52, $3[65] = t62;
    else
      t62 = $3[65];
    let t72 = isSelected ? "suggestion" : void 0, t82;
    if ($3[66] !== item.name || $3[67] !== t72)
      t82 = /* @__PURE__ */ jsx_dev_runtime241.jsxDEV(ThemedText, {
        color: t72,
        children: item.name
      }, void 0, !1, void 0, this), $3[66] = item.name, $3[67] = t72, $3[68] = t82;
    else
      t82 = $3[68];
    let t92 = !isSelected, t102;
    if ($3[69] === Symbol.for("react.memo_cache_sentinel"))
      t102 = /* @__PURE__ */ jsx_dev_runtime241.jsxDEV(ThemedText, {
        backgroundColor: "userMessageBackground",
        children: "Plugin"
      }, void 0, !1, void 0, this), $3[69] = t102;
    else
      t102 = $3[69];
    let t112;
    if ($3[70] !== t92)
      t112 = /* @__PURE__ */ jsx_dev_runtime241.jsxDEV(ThemedText, {
        dimColor: t92,
        children: [
          " ",
          t102
        ]
      }, void 0, !0, void 0, this), $3[70] = t92, $3[71] = t112;
    else
      t112 = $3[71];
    let t122;
    if ($3[72] !== item.marketplace)
      t122 = /* @__PURE__ */ jsx_dev_runtime241.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          " \xB7 ",
          item.marketplace
        ]
      }, void 0, !0, void 0, this), $3[72] = item.marketplace, $3[73] = t122;
    else
      t122 = $3[73];
    let t132 = !isSelected, t142;
    if ($3[74] !== statusIcon_1 || $3[75] !== t132)
      t142 = /* @__PURE__ */ jsx_dev_runtime241.jsxDEV(ThemedText, {
        dimColor: t132,
        children: [
          " \xB7 ",
          statusIcon_1,
          " "
        ]
      }, void 0, !0, void 0, this), $3[74] = statusIcon_1, $3[75] = t132, $3[76] = t142;
    else
      t142 = $3[76];
    let t15 = !isSelected, t16;
    if ($3[77] !== statusText_0 || $3[78] !== t15)
      t16 = /* @__PURE__ */ jsx_dev_runtime241.jsxDEV(ThemedText, {
        dimColor: t15,
        children: statusText_0
      }, void 0, !1, void 0, this), $3[77] = statusText_0, $3[78] = t15, $3[79] = t16;
    else
      t16 = $3[79];
    let t17;
    if ($3[80] !== t112 || $3[81] !== t122 || $3[82] !== t142 || $3[83] !== t16 || $3[84] !== t62 || $3[85] !== t82)
      t17 = /* @__PURE__ */ jsx_dev_runtime241.jsxDEV(ThemedBox_default, {
        children: [
          t62,
          t82,
          t112,
          t122,
          t142,
          t16
        ]
      }, void 0, !0, void 0, this), $3[80] = t112, $3[81] = t122, $3[82] = t142, $3[83] = t16, $3[84] = t62, $3[85] = t82, $3[86] = t17;
    else
      t17 = $3[86];
    return t17;
  }
  let statusIcon_2, statusText_1;
  if (item.status === "connected") {
    let t14;
    if ($3[87] !== theme)
      t14 = color("success", theme)(figures_default.tick), $3[87] = theme, $3[88] = t14;
    else
      t14 = $3[88];
    statusIcon_2 = t14, statusText_1 = "connected";
  } else if (item.status === "disabled") {
    let t14;
    if ($3[89] !== theme)
      t14 = color("inactive", theme)(figures_default.radioOff), $3[89] = theme, $3[90] = t14;
    else
      t14 = $3[90];
    statusIcon_2 = t14, statusText_1 = "disabled";
  } else if (item.status === "pending") {
    let t14;
    if ($3[91] !== theme)
      t14 = color("inactive", theme)(figures_default.radioOff), $3[91] = theme, $3[92] = t14;
    else
      t14 = $3[92];
    statusIcon_2 = t14, statusText_1 = "connecting\u2026";
  } else if (item.status === "needs-auth") {
    let t14;
    if ($3[93] !== theme)
      t14 = color("warning", theme)(figures_default.triangleUpOutline), $3[93] = theme, $3[94] = t14;
    else
      t14 = $3[94];
    statusIcon_2 = t14, statusText_1 = "Enter to auth";
  } else {
    let t14;
    if ($3[95] !== theme)
      t14 = color("error", theme)(figures_default.cross), $3[95] = theme, $3[96] = t14;
    else
      t14 = $3[96];
    statusIcon_2 = t14, statusText_1 = "failed";
  }
  if (item.indented) {
    let t14 = isSelected ? "suggestion" : void 0, t22 = isSelected ? `${figures_default.pointer} ` : "  ", t32;
    if ($3[97] !== t14 || $3[98] !== t22)
      t32 = /* @__PURE__ */ jsx_dev_runtime241.jsxDEV(ThemedText, {
        color: t14,
        children: t22
      }, void 0, !1, void 0, this), $3[97] = t14, $3[98] = t22, $3[99] = t32;
    else
      t32 = $3[99];
    let t42 = !isSelected, t52;
    if ($3[100] !== t42)
      t52 = /* @__PURE__ */ jsx_dev_runtime241.jsxDEV(ThemedText, {
        dimColor: t42,
        children: "\u2514 "
      }, void 0, !1, void 0, this), $3[100] = t42, $3[101] = t52;
    else
      t52 = $3[101];
    let t62 = isSelected ? "suggestion" : void 0, t72;
    if ($3[102] !== item.name || $3[103] !== t62)
      t72 = /* @__PURE__ */ jsx_dev_runtime241.jsxDEV(ThemedText, {
        color: t62,
        children: item.name
      }, void 0, !1, void 0, this), $3[102] = item.name, $3[103] = t62, $3[104] = t72;
    else
      t72 = $3[104];
    let t82 = !isSelected, t92;
    if ($3[105] === Symbol.for("react.memo_cache_sentinel"))
      t92 = /* @__PURE__ */ jsx_dev_runtime241.jsxDEV(ThemedText, {
        backgroundColor: "userMessageBackground",
        children: "MCP"
      }, void 0, !1, void 0, this), $3[105] = t92;
    else
      t92 = $3[105];
    let t102;
    if ($3[106] !== t82)
      t102 = /* @__PURE__ */ jsx_dev_runtime241.jsxDEV(ThemedText, {
        dimColor: t82,
        children: [
          " ",
          t92
        ]
      }, void 0, !0, void 0, this), $3[106] = t82, $3[107] = t102;
    else
      t102 = $3[107];
    let t112 = !isSelected, t122;
    if ($3[108] !== statusIcon_2 || $3[109] !== t112)
      t122 = /* @__PURE__ */ jsx_dev_runtime241.jsxDEV(ThemedText, {
        dimColor: t112,
        children: [
          " \xB7 ",
          statusIcon_2,
          " "
        ]
      }, void 0, !0, void 0, this), $3[108] = statusIcon_2, $3[109] = t112, $3[110] = t122;
    else
      t122 = $3[110];
    let t132 = !isSelected, t142;
    if ($3[111] !== statusText_1 || $3[112] !== t132)
      t142 = /* @__PURE__ */ jsx_dev_runtime241.jsxDEV(ThemedText, {
        dimColor: t132,
        children: statusText_1
      }, void 0, !1, void 0, this), $3[111] = statusText_1, $3[112] = t132, $3[113] = t142;
    else
      t142 = $3[113];
    let t15;
    if ($3[114] !== t102 || $3[115] !== t122 || $3[116] !== t142 || $3[117] !== t32 || $3[118] !== t52 || $3[119] !== t72)
      t15 = /* @__PURE__ */ jsx_dev_runtime241.jsxDEV(ThemedBox_default, {
        children: [
          t32,
          t52,
          t72,
          t102,
          t122,
          t142
        ]
      }, void 0, !0, void 0, this), $3[114] = t102, $3[115] = t122, $3[116] = t142, $3[117] = t32, $3[118] = t52, $3[119] = t72, $3[120] = t15;
    else
      t15 = $3[120];
    return t15;
  }
  let t1 = isSelected ? "suggestion" : void 0, t2 = isSelected ? `${figures_default.pointer} ` : "  ", t3;
  if ($3[121] !== t1 || $3[122] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime241.jsxDEV(ThemedText, {
      color: t1,
      children: t2
    }, void 0, !1, void 0, this), $3[121] = t1, $3[122] = t2, $3[123] = t3;
  else
    t3 = $3[123];
  let t4 = isSelected ? "suggestion" : void 0, t5;
  if ($3[124] !== item.name || $3[125] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime241.jsxDEV(ThemedText, {
      color: t4,
      children: item.name
    }, void 0, !1, void 0, this), $3[124] = item.name, $3[125] = t4, $3[126] = t5;
  else
    t5 = $3[126];
  let t6 = !isSelected, t7;
  if ($3[127] === Symbol.for("react.memo_cache_sentinel"))
    t7 = /* @__PURE__ */ jsx_dev_runtime241.jsxDEV(ThemedText, {
      backgroundColor: "userMessageBackground",
      children: "MCP"
    }, void 0, !1, void 0, this), $3[127] = t7;
  else
    t7 = $3[127];
  let t8;
  if ($3[128] !== t6)
    t8 = /* @__PURE__ */ jsx_dev_runtime241.jsxDEV(ThemedText, {
      dimColor: t6,
      children: [
        " ",
        t7
      ]
    }, void 0, !0, void 0, this), $3[128] = t6, $3[129] = t8;
  else
    t8 = $3[129];
  let t9 = !isSelected, t10;
  if ($3[130] !== statusIcon_2 || $3[131] !== t9)
    t10 = /* @__PURE__ */ jsx_dev_runtime241.jsxDEV(ThemedText, {
      dimColor: t9,
      children: [
        " \xB7 ",
        statusIcon_2,
        " "
      ]
    }, void 0, !0, void 0, this), $3[130] = statusIcon_2, $3[131] = t9, $3[132] = t10;
  else
    t10 = $3[132];
  let t11 = !isSelected, t12;
  if ($3[133] !== statusText_1 || $3[134] !== t11)
    t12 = /* @__PURE__ */ jsx_dev_runtime241.jsxDEV(ThemedText, {
      dimColor: t11,
      children: statusText_1
    }, void 0, !1, void 0, this), $3[133] = statusText_1, $3[134] = t11, $3[135] = t12;
  else
    t12 = $3[135];
  let t13;
  if ($3[136] !== t10 || $3[137] !== t12 || $3[138] !== t3 || $3[139] !== t5 || $3[140] !== t8)
    t13 = /* @__PURE__ */ jsx_dev_runtime241.jsxDEV(ThemedBox_default, {
      children: [
        t3,
        t5,
        t8,
        t10,
        t12
      ]
    }, void 0, !0, void 0, this), $3[136] = t10, $3[137] = t12, $3[138] = t3, $3[139] = t5, $3[140] = t8, $3[141] = t13;
  else
    t13 = $3[141];
  return t13;
}
var import_compiler_runtime191, jsx_dev_runtime241;
var init_UnifiedInstalledCell = __esm(() => {
  init_figures();
  init_ink2();
  import_compiler_runtime191 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime241 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
