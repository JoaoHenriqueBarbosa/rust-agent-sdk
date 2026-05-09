// Original: src/components/LogoV2/Clawd.tsx
function Clawd(t0) {
  let $3 = import_compiler_runtime196.c(26), t1;
  if ($3[0] !== t0)
    t1 = t0 === void 0 ? {} : t0, $3[0] = t0, $3[1] = t1;
  else
    t1 = $3[1];
  let {
    pose: t2
  } = t1, pose = t2 === void 0 ? "default" : t2;
  if (env3.terminal === "Apple_Terminal") {
    let t32;
    if ($3[2] !== pose)
      t32 = /* @__PURE__ */ jsx_dev_runtime247.jsxDEV(AppleTerminalClawd, {
        pose
      }, void 0, !1, void 0, this), $3[2] = pose, $3[3] = t32;
    else
      t32 = $3[3];
    return t32;
  }
  let p4 = POSES[pose], t3;
  if ($3[4] !== p4.r1L)
    t3 = /* @__PURE__ */ jsx_dev_runtime247.jsxDEV(ThemedText, {
      color: "clawd_body",
      children: p4.r1L
    }, void 0, !1, void 0, this), $3[4] = p4.r1L, $3[5] = t3;
  else
    t3 = $3[5];
  let t4;
  if ($3[6] !== p4.r1E)
    t4 = /* @__PURE__ */ jsx_dev_runtime247.jsxDEV(ThemedText, {
      color: "clawd_body",
      backgroundColor: "clawd_background",
      children: p4.r1E
    }, void 0, !1, void 0, this), $3[6] = p4.r1E, $3[7] = t4;
  else
    t4 = $3[7];
  let t5;
  if ($3[8] !== p4.r1R)
    t5 = /* @__PURE__ */ jsx_dev_runtime247.jsxDEV(ThemedText, {
      color: "clawd_body",
      children: p4.r1R
    }, void 0, !1, void 0, this), $3[8] = p4.r1R, $3[9] = t5;
  else
    t5 = $3[9];
  let t6;
  if ($3[10] !== t3 || $3[11] !== t4 || $3[12] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime247.jsxDEV(ThemedText, {
      children: [
        t3,
        t4,
        t5
      ]
    }, void 0, !0, void 0, this), $3[10] = t3, $3[11] = t4, $3[12] = t5, $3[13] = t6;
  else
    t6 = $3[13];
  let t7;
  if ($3[14] !== p4.r2L)
    t7 = /* @__PURE__ */ jsx_dev_runtime247.jsxDEV(ThemedText, {
      color: "clawd_body",
      children: p4.r2L
    }, void 0, !1, void 0, this), $3[14] = p4.r2L, $3[15] = t7;
  else
    t7 = $3[15];
  let t8;
  if ($3[16] === Symbol.for("react.memo_cache_sentinel"))
    t8 = /* @__PURE__ */ jsx_dev_runtime247.jsxDEV(ThemedText, {
      color: "clawd_body",
      backgroundColor: "clawd_background",
      children: "\u2588\u2588\u2588\u2588\u2588"
    }, void 0, !1, void 0, this), $3[16] = t8;
  else
    t8 = $3[16];
  let t9;
  if ($3[17] !== p4.r2R)
    t9 = /* @__PURE__ */ jsx_dev_runtime247.jsxDEV(ThemedText, {
      color: "clawd_body",
      children: p4.r2R
    }, void 0, !1, void 0, this), $3[17] = p4.r2R, $3[18] = t9;
  else
    t9 = $3[18];
  let t10;
  if ($3[19] !== t7 || $3[20] !== t9)
    t10 = /* @__PURE__ */ jsx_dev_runtime247.jsxDEV(ThemedText, {
      children: [
        t7,
        t8,
        t9
      ]
    }, void 0, !0, void 0, this), $3[19] = t7, $3[20] = t9, $3[21] = t10;
  else
    t10 = $3[21];
  let t11;
  if ($3[22] === Symbol.for("react.memo_cache_sentinel"))
    t11 = /* @__PURE__ */ jsx_dev_runtime247.jsxDEV(ThemedText, {
      color: "clawd_body",
      children: [
        "  ",
        "\u2598\u2598 \u259D\u259D",
        "  "
      ]
    }, void 0, !0, void 0, this), $3[22] = t11;
  else
    t11 = $3[22];
  let t12;
  if ($3[23] !== t10 || $3[24] !== t6)
    t12 = /* @__PURE__ */ jsx_dev_runtime247.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t6,
        t10,
        t11
      ]
    }, void 0, !0, void 0, this), $3[23] = t10, $3[24] = t6, $3[25] = t12;
  else
    t12 = $3[25];
  return t12;
}
function AppleTerminalClawd(t0) {
  let $3 = import_compiler_runtime196.c(10), {
    pose
  } = t0, t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = /* @__PURE__ */ jsx_dev_runtime247.jsxDEV(ThemedText, {
      color: "clawd_body",
      children: "\u2597"
    }, void 0, !1, void 0, this), $3[0] = t1;
  else
    t1 = $3[0];
  let t2 = APPLE_EYES[pose], t3;
  if ($3[1] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime247.jsxDEV(ThemedText, {
      color: "clawd_background",
      backgroundColor: "clawd_body",
      children: t2
    }, void 0, !1, void 0, this), $3[1] = t2, $3[2] = t3;
  else
    t3 = $3[2];
  let t4;
  if ($3[3] === Symbol.for("react.memo_cache_sentinel"))
    t4 = /* @__PURE__ */ jsx_dev_runtime247.jsxDEV(ThemedText, {
      color: "clawd_body",
      children: "\u2596"
    }, void 0, !1, void 0, this), $3[3] = t4;
  else
    t4 = $3[3];
  let t5;
  if ($3[4] !== t3)
    t5 = /* @__PURE__ */ jsx_dev_runtime247.jsxDEV(ThemedText, {
      children: [
        t1,
        t3,
        t4
      ]
    }, void 0, !0, void 0, this), $3[4] = t3, $3[5] = t5;
  else
    t5 = $3[5];
  let t6, t7;
  if ($3[6] === Symbol.for("react.memo_cache_sentinel"))
    t6 = /* @__PURE__ */ jsx_dev_runtime247.jsxDEV(ThemedText, {
      backgroundColor: "clawd_body",
      children: " ".repeat(7)
    }, void 0, !1, void 0, this), t7 = /* @__PURE__ */ jsx_dev_runtime247.jsxDEV(ThemedText, {
      color: "clawd_body",
      children: "\u2598\u2598 \u259D\u259D"
    }, void 0, !1, void 0, this), $3[6] = t6, $3[7] = t7;
  else
    t6 = $3[6], t7 = $3[7];
  let t8;
  if ($3[8] !== t5)
    t8 = /* @__PURE__ */ jsx_dev_runtime247.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      alignItems: "center",
      children: [
        t5,
        t6,
        t7
      ]
    }, void 0, !0, void 0, this), $3[8] = t5, $3[9] = t8;
  else
    t8 = $3[9];
  return t8;
}
var import_compiler_runtime196, jsx_dev_runtime247, POSES, APPLE_EYES;
var init_Clawd = __esm(() => {
  init_ink2();
  init_env();
  import_compiler_runtime196 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime247 = __toESM(require_react_jsx_dev_runtime_development(), 1), POSES = {
    default: {
      r1L: " \u2590",
      r1E: "\u259B\u2588\u2588\u2588\u259C",
      r1R: "\u258C",
      r2L: "\u259D\u259C",
      r2R: "\u259B\u2598"
    },
    "look-left": {
      r1L: " \u2590",
      r1E: "\u259F\u2588\u2588\u2588\u259F",
      r1R: "\u258C",
      r2L: "\u259D\u259C",
      r2R: "\u259B\u2598"
    },
    "look-right": {
      r1L: " \u2590",
      r1E: "\u2599\u2588\u2588\u2588\u2599",
      r1R: "\u258C",
      r2L: "\u259D\u259C",
      r2R: "\u259B\u2598"
    },
    "arms-up": {
      r1L: "\u2597\u259F",
      r1E: "\u259B\u2588\u2588\u2588\u259C",
      r1R: "\u2599\u2596",
      r2L: " \u259C",
      r2R: "\u259B "
    }
  }, APPLE_EYES = {
    default: " \u2597   \u2596 ",
    "look-left": " \u2598   \u2598 ",
    "look-right": " \u259D   \u259D ",
    "arms-up": " \u2597   \u2596 "
  };
});
