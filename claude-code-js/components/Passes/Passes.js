// Original: src/components/Passes/Passes.tsx
function Passes({
  onDone
}) {
  let [loading, setLoading] = import_react171.useState(!0), [passStatuses, setPassStatuses] = import_react171.useState([]), [isAvailable, setIsAvailable] = import_react171.useState(!1), [referralLink, setReferralLink] = import_react171.useState(null), [referrerReward, setReferrerReward] = import_react171.useState(void 0), exitState = useExitOnCtrlCDWithKeybindings(() => onDone("Guest passes dialog dismissed", {
    display: "system"
  })), handleCancel = import_react171.useCallback(() => {
    onDone("Guest passes dialog dismissed", {
      display: "system"
    });
  }, [onDone]);
  if (useKeybinding("confirm:no", handleCancel, {
    context: "Confirmation"
  }), use_input_default((_input, key3) => {
    if (key3.return && referralLink)
      setClipboard(referralLink).then((raw) => {
        if (raw)
          process.stdout.write(raw);
        logEvent("tengu_guest_passes_link_copied", {}), onDone("Referral link copied to clipboard!");
      });
  }), import_react171.useEffect(() => {
    async function loadPassesData() {
      try {
        let eligibilityData = await getCachedOrFetchPassesEligibility();
        if (!eligibilityData || !eligibilityData.eligible) {
          setIsAvailable(!1), setLoading(!1);
          return;
        }
        if (setIsAvailable(!0), eligibilityData.referral_code_details?.referral_link)
          setReferralLink(eligibilityData.referral_code_details.referral_link);
        setReferrerReward(eligibilityData.referrer_reward);
        let campaign = eligibilityData.referral_code_details?.campaign ?? "claude_code_guest_pass", redemptionsData;
        try {
          redemptionsData = await fetchReferralRedemptions(campaign);
        } catch (err_0) {
          logError2(err_0), setIsAvailable(!1), setLoading(!1);
          return;
        }
        let redemptions = redemptionsData.redemptions || [], maxRedemptions = redemptionsData.limit || 3, statuses = [];
        for (let i5 = 0;i5 < maxRedemptions; i5++) {
          let redemption = redemptions[i5];
          statuses.push({
            passNumber: i5 + 1,
            isAvailable: !redemption
          });
        }
        setPassStatuses(statuses), setLoading(!1);
      } catch (err2) {
        logError2(err2), setIsAvailable(!1), setLoading(!1);
      }
    }
    loadPassesData();
  }, []), loading)
    return /* @__PURE__ */ jsx_dev_runtime304.jsxDEV(Pane, {
      children: /* @__PURE__ */ jsx_dev_runtime304.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        gap: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime304.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "Loading guest pass information\u2026"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime304.jsxDEV(ThemedText, {
            dimColor: !0,
            italic: !0,
            children: exitState.pending ? /* @__PURE__ */ jsx_dev_runtime304.jsxDEV(jsx_dev_runtime304.Fragment, {
              children: [
                "Press ",
                exitState.keyName,
                " again to exit"
              ]
            }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime304.jsxDEV(jsx_dev_runtime304.Fragment, {
              children: "Esc to cancel"
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this);
  if (!isAvailable)
    return /* @__PURE__ */ jsx_dev_runtime304.jsxDEV(Pane, {
      children: /* @__PURE__ */ jsx_dev_runtime304.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        gap: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime304.jsxDEV(ThemedText, {
            children: "Guest passes are not currently available."
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime304.jsxDEV(ThemedText, {
            dimColor: !0,
            italic: !0,
            children: exitState.pending ? /* @__PURE__ */ jsx_dev_runtime304.jsxDEV(jsx_dev_runtime304.Fragment, {
              children: [
                "Press ",
                exitState.keyName,
                " again to exit"
              ]
            }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime304.jsxDEV(jsx_dev_runtime304.Fragment, {
              children: "Esc to cancel"
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this);
  let availableCount = count2(passStatuses, (p4) => p4.isAvailable), sortedPasses = [...passStatuses].sort((a2, b) => +b.isAvailable - +a2.isAvailable), renderTicket = (pass6) => {
    if (!pass6.isAvailable)
      return /* @__PURE__ */ jsx_dev_runtime304.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        marginRight: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime304.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2571"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime304.jsxDEV(ThemedText, {
            dimColor: !0,
            children: ` ) CC ${TEARDROP_ASTERISK} \u250A\u2571`
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime304.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2571"
          }, void 0, !1, void 0, this)
        ]
      }, pass6.passNumber, !0, void 0, this);
    return /* @__PURE__ */ jsx_dev_runtime304.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginRight: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime304.jsxDEV(ThemedText, {
          children: "\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime304.jsxDEV(ThemedText, {
          children: [
            " ) CC ",
            /* @__PURE__ */ jsx_dev_runtime304.jsxDEV(ThemedText, {
              color: "claude",
              children: TEARDROP_ASTERISK
            }, void 0, !1, void 0, this),
            " \u250A ( "
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime304.jsxDEV(ThemedText, {
          children: "\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518"
        }, void 0, !1, void 0, this)
      ]
    }, pass6.passNumber, !0, void 0, this);
  };
  return /* @__PURE__ */ jsx_dev_runtime304.jsxDEV(Pane, {
    children: /* @__PURE__ */ jsx_dev_runtime304.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime304.jsxDEV(ThemedText, {
          color: "permission",
          children: [
            "Guest passes \xB7 ",
            availableCount,
            " left"
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime304.jsxDEV(ThemedBox_default, {
          flexDirection: "row",
          marginLeft: 2,
          children: sortedPasses.slice(0, 3).map((pass_0) => renderTicket(pass_0))
        }, void 0, !1, void 0, this),
        referralLink && /* @__PURE__ */ jsx_dev_runtime304.jsxDEV(ThemedBox_default, {
          marginLeft: 2,
          children: /* @__PURE__ */ jsx_dev_runtime304.jsxDEV(ThemedText, {
            children: referralLink
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime304.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          marginLeft: 2,
          children: /* @__PURE__ */ jsx_dev_runtime304.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              referrerReward ? `Share a free week of Claude Code with friends. If they love it and subscribe, you'll get ${formatCreditAmount(referrerReward)} of extra usage to keep building. ` : "Share a free week of Claude Code with friends. ",
              /* @__PURE__ */ jsx_dev_runtime304.jsxDEV(Link, {
                url: referrerReward ? "https://support.claude.com/en/articles/13456702-claude-code-guest-passes" : "https://support.claude.com/en/articles/12875061-claude-code-guest-passes",
                children: "Terms apply."
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime304.jsxDEV(ThemedBox_default, {
          children: /* @__PURE__ */ jsx_dev_runtime304.jsxDEV(ThemedText, {
            dimColor: !0,
            italic: !0,
            children: exitState.pending ? /* @__PURE__ */ jsx_dev_runtime304.jsxDEV(jsx_dev_runtime304.Fragment, {
              children: [
                "Press ",
                exitState.keyName,
                " again to exit"
              ]
            }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime304.jsxDEV(jsx_dev_runtime304.Fragment, {
              children: "Enter to copy link \xB7 Esc to cancel"
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this)
  }, void 0, !1, void 0, this);
}
var import_react171, jsx_dev_runtime304;
var init_Passes = __esm(() => {
  init_figures2();
  init_useExitOnCtrlCDWithKeybindings();
  init_osc();
  init_ink2();
  init_useKeybinding();
  init_referral();
  init_log3();
  init_Pane();
  import_react171 = __toESM(require_react_development(), 1), jsx_dev_runtime304 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
