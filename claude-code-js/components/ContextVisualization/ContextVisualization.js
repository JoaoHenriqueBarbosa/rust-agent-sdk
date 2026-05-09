// function: ContextVisualization
function ContextVisualization(t0) {
  let $3 = import_compiler_runtime148.c(87), {
    data
  } = t0, {
    categories,
    totalTokens,
    rawMaxTokens,
    percentage,
    gridRows,
    model,
    memoryFiles,
    mcpTools,
    deferredBuiltinTools: t1,
    systemTools,
    systemPromptSections,
    agents,
    skills,
    messageBreakdown
  } = data, T0, T1, t2, t3, t4, t5, t6, t7, t8, t9;
  if ($3[0] !== categories || $3[1] !== gridRows || $3[2] !== mcpTools || $3[3] !== model || $3[4] !== percentage || $3[5] !== rawMaxTokens || $3[6] !== systemTools || $3[7] !== t1 || $3[8] !== totalTokens) {
    let deferredBuiltinTools = t1 === void 0 ? [] : t1, visibleCategories = categories.filter(_temp77), t102;
    if ($3[19] !== categories)
      t102 = categories.some(_temp221), $3[19] = categories, $3[20] = t102;
    else
      t102 = $3[20];
    let hasDeferredMcpTools = t102, hasDeferredBuiltinTools = deferredBuiltinTools.length > 0, autocompactCategory = categories.find(_temp316);
    if (T1 = ThemedBox_default, t6 = "column", t7 = 1, $3[21] === Symbol.for("react.memo_cache_sentinel"))
      t8 = /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedText, {
        bold: !0,
        children: "Context Usage"
      }, void 0, !1, void 0, this), $3[21] = t8;
    else
      t8 = $3[21];
    let t112;
    if ($3[22] !== gridRows)
      t112 = gridRows.map(_temp510), $3[22] = gridRows, $3[23] = t112;
    else
      t112 = $3[23];
    let t122;
    if ($3[24] !== t112)
      t122 = /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        flexShrink: 0,
        children: t112
      }, void 0, !1, void 0, this), $3[24] = t112, $3[25] = t122;
    else
      t122 = $3[25];
    let t132;
    if ($3[26] !== totalTokens)
      t132 = formatTokens(totalTokens), $3[26] = totalTokens, $3[27] = t132;
    else
      t132 = $3[27];
    let t142;
    if ($3[28] !== rawMaxTokens)
      t142 = formatTokens(rawMaxTokens), $3[28] = rawMaxTokens, $3[29] = t142;
    else
      t142 = $3[29];
    let t152;
    if ($3[30] !== model || $3[31] !== percentage || $3[32] !== t132 || $3[33] !== t142)
      t152 = /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          model,
          " \xB7 ",
          t132,
          "/",
          t142,
          " ",
          "tokens (",
          percentage,
          "%)"
        ]
      }, void 0, !0, void 0, this), $3[30] = model, $3[31] = percentage, $3[32] = t132, $3[33] = t142, $3[34] = t152;
    else
      t152 = $3[34];
    let t162, t172, t182;
    if ($3[35] === Symbol.for("react.memo_cache_sentinel"))
      t162 = /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(CollapseStatus, {}, void 0, !1, void 0, this), t172 = /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedText, {
        children: " "
      }, void 0, !1, void 0, this), t182 = /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedText, {
        dimColor: !0,
        italic: !0,
        children: "Estimated usage by category"
      }, void 0, !1, void 0, this), $3[35] = t162, $3[36] = t172, $3[37] = t182;
    else
      t162 = $3[35], t172 = $3[36], t182 = $3[37];
    let t19;
    if ($3[38] !== rawMaxTokens)
      t19 = (cat_2, index) => {
        let tokenDisplay = formatTokens(cat_2.tokens), percentDisplay = cat_2.isDeferred ? "N/A" : `${(cat_2.tokens / rawMaxTokens * 100).toFixed(1)}%`, isReserved = cat_2.name === RESERVED_CATEGORY_NAME2, displayName = cat_2.name, symbol2 = cat_2.isDeferred ? " " : isReserved ? "\u26DD" : "\u26C1";
        return /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedBox_default, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedText, {
              color: cat_2.color,
              children: symbol2
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedText, {
              children: [
                " ",
                displayName,
                ": "
              ]
            }, void 0, !0, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedText, {
              dimColor: !0,
              children: [
                tokenDisplay,
                " tokens (",
                percentDisplay,
                ")"
              ]
            }, void 0, !0, void 0, this)
          ]
        }, index, !0, void 0, this);
      }, $3[38] = rawMaxTokens, $3[39] = t19;
    else
      t19 = $3[39];
    let t20 = visibleCategories.map(t19), t21;
    if ($3[40] !== categories || $3[41] !== rawMaxTokens)
      t21 = (categories.find(_temp65)?.tokens ?? 0) > 0 && /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedBox_default, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "\u26F6"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedText, {
            children: " Free space: "
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              formatTokens(categories.find(_temp75)?.tokens || 0),
              " ",
              "(",
              ((categories.find(_temp84)?.tokens || 0) / rawMaxTokens * 100).toFixed(1),
              "%)"
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this), $3[40] = categories, $3[41] = rawMaxTokens, $3[42] = t21;
    else
      t21 = $3[42];
    let t22 = autocompactCategory && autocompactCategory.tokens > 0 && /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedBox_default, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedText, {
          color: autocompactCategory.color,
          children: "\u26DD"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            " ",
            autocompactCategory.name,
            ": "
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            formatTokens(autocompactCategory.tokens),
            " tokens (",
            (autocompactCategory.tokens / rawMaxTokens * 100).toFixed(1),
            "%)"
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this), t23;
    if ($3[43] !== t152 || $3[44] !== t20 || $3[45] !== t21 || $3[46] !== t22)
      t23 = /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        gap: 0,
        flexShrink: 0,
        children: [
          t152,
          t162,
          t172,
          t182,
          t20,
          t21,
          t22
        ]
      }, void 0, !0, void 0, this), $3[43] = t152, $3[44] = t20, $3[45] = t21, $3[46] = t22, $3[47] = t23;
    else
      t23 = $3[47];
    if ($3[48] !== t122 || $3[49] !== t23)
      t9 = /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedBox_default, {
        flexDirection: "row",
        gap: 2,
        children: [
          t122,
          t23
        ]
      }, void 0, !0, void 0, this), $3[48] = t122, $3[49] = t23, $3[50] = t9;
    else
      t9 = $3[50];
    if (T0 = ThemedBox_default, t2 = "column", t3 = -1, $3[51] !== hasDeferredMcpTools || $3[52] !== mcpTools)
      t4 = mcpTools.length > 0 && /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        marginTop: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedBox_default, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedText, {
                bold: !0,
                children: "MCP tools"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedText, {
                dimColor: !0,
                children: [
                  " ",
                  "\xB7 /mcp",
                  hasDeferredMcpTools ? " (loaded on-demand)" : ""
                ]
              }, void 0, !0, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          mcpTools.some(_temp92) && /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            marginTop: 1,
            children: [
              /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedText, {
                dimColor: !0,
                children: "Loaded"
              }, void 0, !1, void 0, this),
              mcpTools.filter(_temp0).map(_temp1)
            ]
          }, void 0, !0, void 0, this),
          hasDeferredMcpTools && mcpTools.some(_temp102) && /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            marginTop: 1,
            children: [
              /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedText, {
                dimColor: !0,
                children: "Available"
              }, void 0, !1, void 0, this),
              mcpTools.filter(_temp11).map(_temp122)
            ]
          }, void 0, !0, void 0, this),
          !hasDeferredMcpTools && mcpTools.map(_temp132)
        ]
      }, void 0, !0, void 0, this), $3[51] = hasDeferredMcpTools, $3[52] = mcpTools, $3[53] = t4;
    else
      t4 = $3[53];
    t5 = null, $3[0] = categories, $3[1] = gridRows, $3[2] = mcpTools, $3[3] = model, $3[4] = percentage, $3[5] = rawMaxTokens, $3[6] = systemTools, $3[7] = t1, $3[8] = totalTokens, $3[9] = T0, $3[10] = T1, $3[11] = t2, $3[12] = t3, $3[13] = t4, $3[14] = t5, $3[15] = t6, $3[16] = t7, $3[17] = t8, $3[18] = t9;
  } else
    T0 = $3[9], T1 = $3[10], t2 = $3[11], t3 = $3[12], t4 = $3[13], t5 = $3[14], t6 = $3[15], t7 = $3[16], t8 = $3[17], t9 = $3[18];
  let t10;
  if ($3[54] !== systemPromptSections)
    t10 = null, $3[54] = systemPromptSections, $3[55] = t10;
  else
    t10 = $3[55];
  let t11;
  if ($3[56] !== agents)
    t11 = agents.length > 0 && /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedBox_default, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedText, {
              bold: !0,
              children: "Custom agents"
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedText, {
              dimColor: !0,
              children: " \xB7 /agents"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        Array.from(groupBySource(agents).entries()).map(_temp222)
      ]
    }, void 0, !0, void 0, this), $3[56] = agents, $3[57] = t11;
  else
    t11 = $3[57];
  let t12;
  if ($3[58] !== memoryFiles)
    t12 = memoryFiles.length > 0 && /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedBox_default, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedText, {
              bold: !0,
              children: "Memory files"
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedText, {
              dimColor: !0,
              children: " \xB7 /memory"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        memoryFiles.map(_temp232)
      ]
    }, void 0, !0, void 0, this), $3[58] = memoryFiles, $3[59] = t12;
  else
    t12 = $3[59];
  let t13;
  if ($3[60] !== skills)
    t13 = skills && skills.tokens > 0 && /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedBox_default, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedText, {
              bold: !0,
              children: "Skills"
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedText, {
              dimColor: !0,
              children: " \xB7 /skills"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        Array.from(groupBySource(skills.skillFrontmatter).entries()).map(_temp252)
      ]
    }, void 0, !0, void 0, this), $3[60] = skills, $3[61] = t13;
  else
    t13 = $3[61];
  let t14;
  if ($3[62] !== messageBreakdown)
    t14 = null, $3[62] = messageBreakdown, $3[63] = t14;
  else
    t14 = $3[63];
  let t15;
  if ($3[64] !== T0 || $3[65] !== t10 || $3[66] !== t11 || $3[67] !== t12 || $3[68] !== t13 || $3[69] !== t14 || $3[70] !== t2 || $3[71] !== t3 || $3[72] !== t4 || $3[73] !== t5)
    t15 = /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(T0, {
      flexDirection: t2,
      marginLeft: t3,
      children: [
        t4,
        t5,
        t10,
        t11,
        t12,
        t13,
        t14
      ]
    }, void 0, !0, void 0, this), $3[64] = T0, $3[65] = t10, $3[66] = t11, $3[67] = t12, $3[68] = t13, $3[69] = t14, $3[70] = t2, $3[71] = t3, $3[72] = t4, $3[73] = t5, $3[74] = t15;
  else
    t15 = $3[74];
  let t16;
  if ($3[75] !== data)
    t16 = generateContextSuggestions(data), $3[75] = data, $3[76] = t16;
  else
    t16 = $3[76];
  let t17;
  if ($3[77] !== t16)
    t17 = /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ContextSuggestions, {
      suggestions: t16
    }, void 0, !1, void 0, this), $3[77] = t16, $3[78] = t17;
  else
    t17 = $3[78];
  let t18;
  if ($3[79] !== T1 || $3[80] !== t15 || $3[81] !== t17 || $3[82] !== t6 || $3[83] !== t7 || $3[84] !== t8 || $3[85] !== t9)
    t18 = /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(T1, {
      flexDirection: t6,
      paddingLeft: t7,
      children: [
        t8,
        t9,
        t15,
        t17
      ]
    }, void 0, !0, void 0, this), $3[79] = T1, $3[80] = t15, $3[81] = t17, $3[82] = t6, $3[83] = t7, $3[84] = t8, $3[85] = t9, $3[86] = t18;
  else
    t18 = $3[86];
  return t18;
}
