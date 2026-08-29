// function: ElicitationURLDialog
function ElicitationURLDialog({
  event,
  onResponse,
  onWaitingDismiss
}) {
  let {
    serverName,
    signal,
    waitingState
  } = event, urlParams = event.params, {
    message,
    url: url3
  } = urlParams, [phase, setPhase] = import_react220.useState("prompt"), phaseRef = import_react220.useRef("prompt"), [focusedButton, setFocusedButton] = import_react220.useState("accept"), showCancel = waitingState?.showCancel ?? !1;
  useNotifyAfterTimeout("Claude Code needs your input", "elicitation_url_dialog"), useRegisterOverlay("elicitation-url"), phaseRef.current = phase;
  let onWaitingDismissRef = import_react220.useRef(onWaitingDismiss);
  onWaitingDismissRef.current = onWaitingDismiss, import_react220.useEffect(() => {
    let handleAbort2 = () => {
      if (phaseRef.current === "waiting")
        onWaitingDismissRef.current?.("cancel");
      else
        onResponse("cancel");
    };
    if (signal.aborted) {
      handleAbort2();
      return;
    }
    return signal.addEventListener("abort", handleAbort2), () => signal.removeEventListener("abort", handleAbort2);
  }, [signal, onResponse]);
  let domain2 = "", urlBeforeDomain = "", urlAfterDomain = "";
  try {
    domain2 = new URL(url3).hostname;
    let domainStart = url3.indexOf(domain2);
    urlBeforeDomain = url3.slice(0, domainStart), urlAfterDomain = url3.slice(domainStart + domain2.length);
  } catch {
    domain2 = url3;
  }
  import_react220.useEffect(() => {
    if (phase === "waiting" && event.completed)
      onWaitingDismiss?.(showCancel ? "retry" : "dismiss");
  }, [phase, event.completed, onWaitingDismiss, showCancel]);
  let handleAccept = import_react220.useCallback(() => {
    openBrowser(url3), onResponse("accept"), setPhase("waiting"), phaseRef.current = "waiting", setFocusedButton("open");
  }, [onResponse, url3]);
  if (use_input_default((_input, key3) => {
    if (phase === "prompt") {
      if (key3.leftArrow || key3.rightArrow) {
        setFocusedButton((prev) => prev === "accept" ? "decline" : "accept");
        return;
      }
      if (key3.return)
        if (focusedButton === "accept")
          handleAccept();
        else
          onResponse("decline");
    } else {
      let waitingButtons = showCancel ? ["open", "action", "cancel"] : ["open", "action"];
      if (key3.leftArrow || key3.rightArrow) {
        setFocusedButton((prev_0) => {
          let idx = waitingButtons.indexOf(prev_0), delta = key3.rightArrow ? 1 : -1;
          return waitingButtons[(idx + delta + waitingButtons.length) % waitingButtons.length];
        });
        return;
      }
      if (key3.return)
        if (focusedButton === "open")
          openBrowser(url3);
        else if (focusedButton === "cancel")
          onWaitingDismiss?.("cancel");
        else
          onWaitingDismiss?.(showCancel ? "retry" : "dismiss");
    }
  }), phase === "waiting") {
    let actionLabel = waitingState?.actionLabel ?? "Continue without waiting";
    return /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(Dialog, {
      title: `MCP server \u201C${serverName}\u201D \u2014 waiting for completion`,
      subtitle: `
${message}`,
      color: "permission",
      onCancel: () => onWaitingDismiss?.("cancel"),
      isCancelActive: !0,
      inputGuide: (exitState) => exitState.pending ? /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
        children: [
          "Press ",
          exitState.keyName,
          " again to exit"
        ]
      }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(Byline, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ConfigurableShortcutHint, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "cancel"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(KeyboardShortcutHint, {
            shortcut: "\\u2190\\u2192",
            action: "switch"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      children: /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: [
          /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedBox_default, {
            marginBottom: 1,
            flexDirection: "column",
            children: /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
              children: [
                urlBeforeDomain,
                /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
                  bold: !0,
                  children: domain2
                }, void 0, !1, void 0, this),
                urlAfterDomain
              ]
            }, void 0, !0, void 0, this)
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedBox_default, {
            marginBottom: 1,
            children: /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
              dimColor: !0,
              italic: !0,
              children: "Waiting for the server to confirm completion\u2026"
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedBox_default, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
                color: "success",
                children: focusedButton === "open" ? figures_default.pointer : " "
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
                bold: focusedButton === "open",
                color: focusedButton === "open" ? "success" : void 0,
                dimColor: focusedButton !== "open",
                children: " Reopen URL  "
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
                color: "success",
                children: focusedButton === "action" ? figures_default.pointer : " "
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
                bold: focusedButton === "action",
                color: focusedButton === "action" ? "success" : void 0,
                dimColor: focusedButton !== "action",
                children: ` ${actionLabel}`
              }, void 0, !1, void 0, this),
              showCancel && /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(jsx_dev_runtime401.Fragment, {
                children: [
                  /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
                    children: " "
                  }, void 0, !1, void 0, this),
                  /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
                    color: "error",
                    children: focusedButton === "cancel" ? figures_default.pointer : " "
                  }, void 0, !1, void 0, this),
                  /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
                    bold: focusedButton === "cancel",
                    color: focusedButton === "cancel" ? "error" : void 0,
                    dimColor: focusedButton !== "cancel",
                    children: " Cancel"
                  }, void 0, !1, void 0, this)
                ]
              }, void 0, !0, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this);
  }
  return /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(Dialog, {
    title: `MCP server \u201C${serverName}\u201D wants to open a URL`,
    subtitle: `
${message}`,
    color: "permission",
    onCancel: () => onResponse("cancel"),
    isCancelActive: !0,
    inputGuide: (exitState_0) => exitState_0.pending ? /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
      children: [
        "Press ",
        exitState_0.keyName,
        " again to exit"
      ]
    }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(Byline, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ConfigurableShortcutHint, {
          action: "confirm:no",
          context: "Confirmation",
          fallback: "Esc",
          description: "cancel"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(KeyboardShortcutHint, {
          shortcut: "\\u2190\\u2192",
          action: "switch"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this),
    children: /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedBox_default, {
          marginBottom: 1,
          flexDirection: "column",
          children: /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
            children: [
              urlBeforeDomain,
              /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
                bold: !0,
                children: domain2
              }, void 0, !1, void 0, this),
              urlAfterDomain
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedBox_default, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
              color: "success",
              children: focusedButton === "accept" ? figures_default.pointer : " "
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
              bold: focusedButton === "accept",
              color: focusedButton === "accept" ? "success" : void 0,
              dimColor: focusedButton !== "accept",
              children: " Accept  "
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
              color: "error",
              children: focusedButton === "decline" ? figures_default.pointer : " "
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
              bold: focusedButton === "decline",
              color: focusedButton === "decline" ? "error" : void 0,
              dimColor: focusedButton !== "decline",
              children: " Decline"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this)
  }, void 0, !1, void 0, this);
}
