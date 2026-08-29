// Original: src/components/Onboarding.tsx
var exports_Onboarding = {};
__export(exports_Onboarding, {
  SkippableStep: () => SkippableStep,
  Onboarding: () => Onboarding
});
function Onboarding({
  onDone
}) {
  let [currentStepIndex, setCurrentStepIndex] = import_react308.useState(0), [skipOAuth, setSkipOAuth] = import_react308.useState(!1), [oauthEnabled] = import_react308.useState(() => isAnthropicAuthEnabled()), [theme2, setTheme] = useTheme();
  import_react308.useEffect(() => {
    logEvent("tengu_began_setup", {
      oauthEnabled
    });
  }, [oauthEnabled]);
  function goToNextStep() {
    if (currentStepIndex < steps.length - 1) {
      let nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex), logEvent("tengu_onboarding_step", {
        oauthEnabled,
        stepId: steps[nextIndex]?.id
      });
    } else
      onDone();
  }
  function handleThemeSelection(newTheme) {
    setTheme(newTheme), goToNextStep();
  }
  let exitState = useExitOnCtrlCDWithKeybindings(), themeStep = /* @__PURE__ */ jsx_dev_runtime469.jsxDEV(ThemedBox_default, {
    marginX: 1,
    children: /* @__PURE__ */ jsx_dev_runtime469.jsxDEV(ThemePicker, {
      onThemeSelect: handleThemeSelection,
      showIntroText: !0,
      helpText: "To change this later, run /theme",
      hideEscToCancel: !0,
      skipExitHandling: !0
    }, void 0, !1, void 0, this)
  }, void 0, !1, void 0, this), securityStep = /* @__PURE__ */ jsx_dev_runtime469.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    gap: 1,
    paddingLeft: 1,
    children: [
      /* @__PURE__ */ jsx_dev_runtime469.jsxDEV(ThemedText, {
        bold: !0,
        children: "Security notes:"
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime469.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        width: 70,
        children: /* @__PURE__ */ jsx_dev_runtime469.jsxDEV(OrderedList, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime469.jsxDEV(OrderedList.Item, {
              children: [
                /* @__PURE__ */ jsx_dev_runtime469.jsxDEV(ThemedText, {
                  children: "Claude can make mistakes"
                }, void 0, !1, void 0, this),
                /* @__PURE__ */ jsx_dev_runtime469.jsxDEV(ThemedText, {
                  dimColor: !0,
                  wrap: "wrap",
                  children: [
                    "You should always review Claude's responses, especially when",
                    /* @__PURE__ */ jsx_dev_runtime469.jsxDEV(Newline, {}, void 0, !1, void 0, this),
                    "running code.",
                    /* @__PURE__ */ jsx_dev_runtime469.jsxDEV(Newline, {}, void 0, !1, void 0, this)
                  ]
                }, void 0, !0, void 0, this)
              ]
            }, void 0, !0, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime469.jsxDEV(OrderedList.Item, {
              children: [
                /* @__PURE__ */ jsx_dev_runtime469.jsxDEV(ThemedText, {
                  children: "Due to prompt injection risks, only use it with code you trust"
                }, void 0, !1, void 0, this),
                /* @__PURE__ */ jsx_dev_runtime469.jsxDEV(ThemedText, {
                  dimColor: !0,
                  wrap: "wrap",
                  children: [
                    "For more details see:",
                    /* @__PURE__ */ jsx_dev_runtime469.jsxDEV(Newline, {}, void 0, !1, void 0, this),
                    /* @__PURE__ */ jsx_dev_runtime469.jsxDEV(Link, {
                      url: "https://code.claude.com/docs/en/security"
                    }, void 0, !1, void 0, this)
                  ]
                }, void 0, !0, void 0, this)
              ]
            }, void 0, !0, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime469.jsxDEV(PressEnterToContinue, {}, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this), preflightStep = /* @__PURE__ */ jsx_dev_runtime469.jsxDEV(PreflightStep, {
    onSuccess: goToNextStep
  }, void 0, !1, void 0, this), apiKeyNeedingApproval = import_react308.useMemo(() => {
    if (!process.env.ANTHROPIC_API_KEY || isRunningOnHomespace())
      return "";
    let customApiKeyTruncated = normalizeApiKeyForConfig(process.env.ANTHROPIC_API_KEY);
    if (getCustomApiKeyStatus(customApiKeyTruncated) === "new")
      return customApiKeyTruncated;
  }, []);
  function handleApiKeyDone(approved) {
    if (approved)
      setSkipOAuth(!0);
    goToNextStep();
  }
  let steps = [];
  if (oauthEnabled)
    steps.push({
      id: "preflight",
      component: preflightStep
    });
  if (steps.push({
    id: "theme",
    component: themeStep
  }), apiKeyNeedingApproval)
    steps.push({
      id: "api-key",
      component: /* @__PURE__ */ jsx_dev_runtime469.jsxDEV(ApproveApiKey, {
        customApiKeyTruncated: apiKeyNeedingApproval,
        onDone: handleApiKeyDone
      }, void 0, !1, void 0, this)
    });
  if (oauthEnabled)
    steps.push({
      id: "oauth",
      component: /* @__PURE__ */ jsx_dev_runtime469.jsxDEV(SkippableStep, {
        skip: skipOAuth,
        onSkip: goToNextStep,
        children: /* @__PURE__ */ jsx_dev_runtime469.jsxDEV(ConsoleOAuthFlow, {
          onDone: goToNextStep
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this)
    });
  if (steps.push({
    id: "security",
    component: securityStep
  }), shouldOfferTerminalSetup())
    steps.push({
      id: "terminal-setup",
      component: /* @__PURE__ */ jsx_dev_runtime469.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        gap: 1,
        paddingLeft: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime469.jsxDEV(ThemedText, {
            bold: !0,
            children: "Use Claude Code's terminal setup?"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime469.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            width: 70,
            gap: 1,
            children: [
              /* @__PURE__ */ jsx_dev_runtime469.jsxDEV(ThemedText, {
                children: [
                  "For the optimal coding experience, enable the recommended settings",
                  /* @__PURE__ */ jsx_dev_runtime469.jsxDEV(Newline, {}, void 0, !1, void 0, this),
                  "for your terminal:",
                  " ",
                  env3.terminal === "Apple_Terminal" ? "Option+Enter for newlines and visual bell" : "Shift+Enter for newlines"
                ]
              }, void 0, !0, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime469.jsxDEV(Select, {
                options: [{
                  label: "Yes, use recommended settings",
                  value: "install"
                }, {
                  label: "No, maybe later with /terminal-setup",
                  value: "no"
                }],
                onChange: (value) => {
                  if (value === "install")
                    setupTerminal(theme2).catch(() => {}).finally(goToNextStep);
                  else
                    goToNextStep();
                },
                onCancel: () => goToNextStep()
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime469.jsxDEV(ThemedText, {
                dimColor: !0,
                children: exitState.pending ? /* @__PURE__ */ jsx_dev_runtime469.jsxDEV(jsx_dev_runtime469.Fragment, {
                  children: [
                    "Press ",
                    exitState.keyName,
                    " again to exit"
                  ]
                }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime469.jsxDEV(jsx_dev_runtime469.Fragment, {
                  children: "Enter to confirm \xB7 Esc to skip"
                }, void 0, !1, void 0, this)
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    });
  let currentStep = steps[currentStepIndex], handleSecurityContinue = import_react308.useCallback(() => {
    if (currentStepIndex === steps.length - 1)
      onDone();
    else
      goToNextStep();
  }, [currentStepIndex, steps.length, oauthEnabled, onDone]), handleTerminalSetupSkip = import_react308.useCallback(() => {
    goToNextStep();
  }, [currentStepIndex, steps.length, oauthEnabled, onDone]);
  return useKeybindings({
    "confirm:yes": handleSecurityContinue
  }, {
    context: "Confirmation",
    isActive: currentStep?.id === "security"
  }), useKeybindings({
    "confirm:no": handleTerminalSetupSkip
  }, {
    context: "Confirmation",
    isActive: currentStep?.id === "terminal-setup"
  }), /* @__PURE__ */ jsx_dev_runtime469.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    children: [
      /* @__PURE__ */ jsx_dev_runtime469.jsxDEV(WelcomeV2, {}, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime469.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        marginTop: 1,
        children: [
          currentStep?.component,
          exitState.pending && /* @__PURE__ */ jsx_dev_runtime469.jsxDEV(ThemedBox_default, {
            padding: 1,
            children: /* @__PURE__ */ jsx_dev_runtime469.jsxDEV(ThemedText, {
              dimColor: !0,
              children: [
                "Press ",
                exitState.keyName,
                " again to exit"
              ]
            }, void 0, !0, void 0, this)
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
function SkippableStep(t0) {
  let $3 = import_compiler_runtime369.c(4), {
    skip,
    onSkip,
    children
  } = t0, t1, t2;
  if ($3[0] !== onSkip || $3[1] !== skip)
    t1 = () => {
      if (skip)
        onSkip();
    }, t2 = [skip, onSkip], $3[0] = onSkip, $3[1] = skip, $3[2] = t1, $3[3] = t2;
  else
    t1 = $3[2], t2 = $3[3];
  if (import_react308.useEffect(t1, t2), skip)
    return null;
  return children;
}
var import_compiler_runtime369, import_react308, jsx_dev_runtime469;
var init_Onboarding = __esm(() => {
  init_terminalSetup();
  init_useExitOnCtrlCDWithKeybindings();
  init_ink2();
  init_useKeybinding();
  init_auth14();
  init_authPortable();
  init_config4();
  init_env();
  init_envUtils();
  init_preflightChecks();
  init_ApproveApiKey();
  init_ConsoleOAuthFlow();
  init_select();
  init_WelcomeV2();
  init_PressEnterToContinue();
  init_ThemePicker();
  init_OrderedList();
  import_compiler_runtime369 = __toESM(require_react_compiler_runtime_development(), 1), import_react308 = __toESM(require_react_development(), 1), jsx_dev_runtime469 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
