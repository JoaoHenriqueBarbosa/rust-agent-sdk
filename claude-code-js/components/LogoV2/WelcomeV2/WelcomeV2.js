// function: WelcomeV2
function WelcomeV2() {
  let $3 = import_compiler_runtime366.c(35), [theme2] = useTheme();
  if (env3.terminal === "Apple_Terminal") {
    let t02;
    if ($3[0] !== theme2)
      t02 = /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(AppleTerminalWelcomeV2, {
        theme: theme2,
        welcomeMessage: "Welcome to Claude Code"
      }, void 0, !1, void 0, this), $3[0] = theme2, $3[1] = t02;
    else
      t02 = $3[1];
    return t02;
  }
  if (["light", "light-daltonized", "light-ansi"].includes(theme2)) {
    let t02, t17, t22, t32, t42, t52, t62, t72, t82;
    if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
      t02 = /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
            color: "claude",
            children: [
              "Welcome to Claude Code",
              " "
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              "v",
              "2.1.90",
              " (dev) "
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this), t17 = /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
        children: "\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026"
      }, void 0, !1, void 0, this), t22 = /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
        children: "                                                          "
      }, void 0, !1, void 0, this), t32 = /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
        children: "                                                          "
      }, void 0, !1, void 0, this), t42 = /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
        children: "                                                          "
      }, void 0, !1, void 0, this), t52 = /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
        children: "            \u2591\u2591\u2591\u2591\u2591\u2591                                        "
      }, void 0, !1, void 0, this), t62 = /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
        children: "    \u2591\u2591\u2591   \u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591                                      "
      }, void 0, !1, void 0, this), t72 = /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
        children: "   \u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591                                    "
      }, void 0, !1, void 0, this), t82 = /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
        children: "                                                          "
      }, void 0, !1, void 0, this), $3[2] = t02, $3[3] = t17, $3[4] = t22, $3[5] = t32, $3[6] = t42, $3[7] = t52, $3[8] = t62, $3[9] = t72, $3[10] = t82;
    else
      t02 = $3[2], t17 = $3[3], t22 = $3[4], t32 = $3[5], t42 = $3[6], t52 = $3[7], t62 = $3[8], t72 = $3[9], t82 = $3[10];
    let t92;
    if ($3[11] === Symbol.for("react.memo_cache_sentinel"))
      t92 = /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "                           \u2591\u2591\u2591\u2591"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
            children: "                     \u2588\u2588    "
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this), $3[11] = t92;
    else
      t92 = $3[11];
    let t102, t112;
    if ($3[12] === Symbol.for("react.memo_cache_sentinel"))
      t102 = /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "                         \u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
            children: "               \u2588\u2588\u2592\u2592\u2588\u2588  "
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this), t112 = /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
        children: "                                            \u2592\u2592      \u2588\u2588   \u2592"
      }, void 0, !1, void 0, this), $3[12] = t102, $3[13] = t112;
    else
      t102 = $3[12], t112 = $3[13];
    let t122;
    if ($3[14] === Symbol.for("react.memo_cache_sentinel"))
      t122 = /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
        children: [
          "      ",
          /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
            color: "clawd_body",
            children: " \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 "
          }, void 0, !1, void 0, this),
          "                         \u2592\u2592\u2591\u2591\u2592\u2592      \u2592 \u2592\u2592"
        ]
      }, void 0, !0, void 0, this), $3[14] = t122;
    else
      t122 = $3[14];
    let t132;
    if ($3[15] === Symbol.for("react.memo_cache_sentinel"))
      t132 = /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
        children: [
          "      ",
          /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
            color: "clawd_body",
            backgroundColor: "clawd_background",
            children: "\u2588\u2588\u2584\u2588\u2588\u2588\u2588\u2588\u2584\u2588\u2588"
          }, void 0, !1, void 0, this),
          "                           \u2592\u2592         \u2592\u2592 "
        ]
      }, void 0, !0, void 0, this), $3[15] = t132;
    else
      t132 = $3[15];
    let t142;
    if ($3[16] === Symbol.for("react.memo_cache_sentinel"))
      t142 = /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
        children: [
          "      ",
          /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
            color: "clawd_body",
            children: " \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 "
          }, void 0, !1, void 0, this),
          "                          \u2591          \u2592   "
        ]
      }, void 0, !0, void 0, this), $3[16] = t142;
    else
      t142 = $3[16];
    let t152;
    if ($3[17] === Symbol.for("react.memo_cache_sentinel"))
      t152 = /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedBox_default, {
        width: WELCOME_V2_WIDTH,
        children: /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
          children: [
            t02,
            t17,
            t22,
            t32,
            t42,
            t52,
            t62,
            t72,
            t82,
            t92,
            t102,
            t112,
            t122,
            t132,
            t142,
            /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
              children: [
                "\u2026\u2026\u2026\u2026\u2026\u2026\u2026",
                /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
                  color: "clawd_body",
                  children: "\u2588 \u2588   \u2588 \u2588"
                }, void 0, !1, void 0, this),
                "\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2591\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2592\u2026\u2026\u2026\u2026"
              ]
            }, void 0, !0, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this), $3[17] = t152;
    else
      t152 = $3[17];
    return t152;
  }
  let t0, t1, t2, t3, t4, t5, t6;
  if ($3[18] === Symbol.for("react.memo_cache_sentinel"))
    t0 = /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
          color: "claude",
          children: [
            "Welcome to Claude Code",
            " "
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            "v",
            "2.1.90",
            " (dev) "
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this), t1 = /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
      children: "\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026"
    }, void 0, !1, void 0, this), t2 = /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
      children: "                                                          "
    }, void 0, !1, void 0, this), t3 = /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
      children: "     *                                       \u2588\u2588\u2588\u2588\u2588\u2593\u2593\u2591     "
    }, void 0, !1, void 0, this), t4 = /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
      children: "                                 *         \u2588\u2588\u2588\u2593\u2591     \u2591\u2591   "
    }, void 0, !1, void 0, this), t5 = /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
      children: "            \u2591\u2591\u2591\u2591\u2591\u2591                        \u2588\u2588\u2588\u2593\u2591           "
    }, void 0, !1, void 0, this), t6 = /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
      children: "    \u2591\u2591\u2591   \u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591                      \u2588\u2588\u2588\u2593\u2591           "
    }, void 0, !1, void 0, this), $3[18] = t0, $3[19] = t1, $3[20] = t2, $3[21] = t3, $3[22] = t4, $3[23] = t5, $3[24] = t6;
  else
    t0 = $3[18], t1 = $3[19], t2 = $3[20], t3 = $3[21], t4 = $3[22], t5 = $3[23], t6 = $3[24];
  let t10, t11, t7, t8, t9;
  if ($3[25] === Symbol.for("react.memo_cache_sentinel"))
    t7 = /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
          children: "   \u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591    "
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
          bold: !0,
          children: "*"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
          children: "                \u2588\u2588\u2593\u2591\u2591      \u2593   "
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), t8 = /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
      children: "                                             \u2591\u2593\u2593\u2588\u2588\u2588\u2593\u2593\u2591    "
    }, void 0, !1, void 0, this), t9 = /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
      dimColor: !0,
      children: " *                                 \u2591\u2591\u2591\u2591                   "
    }, void 0, !1, void 0, this), t10 = /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "                                 \u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591                 "
    }, void 0, !1, void 0, this), t11 = /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "                               \u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591           "
    }, void 0, !1, void 0, this), $3[25] = t10, $3[26] = t11, $3[27] = t7, $3[28] = t8, $3[29] = t9;
  else
    t10 = $3[25], t11 = $3[26], t7 = $3[27], t8 = $3[28], t9 = $3[29];
  let t12;
  if ($3[30] === Symbol.for("react.memo_cache_sentinel"))
    t12 = /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
      color: "clawd_body",
      children: " \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 "
    }, void 0, !1, void 0, this), $3[30] = t12;
  else
    t12 = $3[30];
  let t13;
  if ($3[31] === Symbol.for("react.memo_cache_sentinel"))
    t13 = /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
      children: [
        "      ",
        t12,
        "                                       ",
        /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "*"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
          children: " "
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[31] = t13;
  else
    t13 = $3[31];
  let t14;
  if ($3[32] === Symbol.for("react.memo_cache_sentinel"))
    t14 = /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
      children: [
        "      ",
        /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
          color: "clawd_body",
          children: "\u2588\u2588\u2584\u2588\u2588\u2588\u2588\u2588\u2584\u2588\u2588"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
          children: "                        "
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
          bold: !0,
          children: "*"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
          children: "                "
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[32] = t14;
  else
    t14 = $3[32];
  let t15;
  if ($3[33] === Symbol.for("react.memo_cache_sentinel"))
    t15 = /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
      children: [
        "      ",
        /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
          color: "clawd_body",
          children: " \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 "
        }, void 0, !1, void 0, this),
        "     *                                   "
      ]
    }, void 0, !0, void 0, this), $3[33] = t15;
  else
    t15 = $3[33];
  let t16;
  if ($3[34] === Symbol.for("react.memo_cache_sentinel"))
    t16 = /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedBox_default, {
      width: WELCOME_V2_WIDTH,
      children: /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
        children: [
          t0,
          t1,
          t2,
          t3,
          t4,
          t5,
          t6,
          t7,
          t8,
          t9,
          t10,
          t11,
          t13,
          t14,
          t15,
          /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
            children: [
              "\u2026\u2026\u2026\u2026\u2026\u2026\u2026",
              /* @__PURE__ */ jsx_dev_runtime466.jsxDEV(ThemedText, {
                color: "clawd_body",
                children: "\u2588 \u2588   \u2588 \u2588"
              }, void 0, !1, void 0, this),
              "\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026"
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[34] = t16;
  else
    t16 = $3[34];
  return t16;
}
