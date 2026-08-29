// Original: src/utils/processUserInput/processBashCommand.tsx
var exports_processBashCommand = {};
__export(exports_processBashCommand, {
  processBashCommand: () => processBashCommand
});
import { randomUUID as randomUUID39 } from "crypto";
async function processBashCommand(inputString, precedingInputBlocks, attachmentMessages, context7, setToolJSX) {
  let usePowerShell = isPowerShellToolEnabled() && resolveDefaultShell() === "powershell";
  logEvent("tengu_input_bash", {
    powershell: usePowerShell
  });
  let userMessage = createUserMessage({
    content: prepareUserContent({
      inputString: `<bash-input>${inputString}</bash-input>`,
      precedingInputBlocks
    })
  }), jsx;
  setToolJSX({
    jsx: /* @__PURE__ */ jsx_dev_runtime436.jsxDEV(BashModeProgress, {
      input: inputString,
      progress: null,
      verbose: context7.options.verbose
    }, void 0, !1, void 0, this),
    shouldHidePromptInput: !1
  });
  try {
    let bashModeContext = {
      ...context7,
      setToolJSX: (_) => {
        jsx = _?.jsx;
      }
    }, onProgress = (progress) => {
      setToolJSX({
        jsx: /* @__PURE__ */ jsx_dev_runtime436.jsxDEV(jsx_dev_runtime436.Fragment, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime436.jsxDEV(BashModeProgress, {
              input: inputString,
              progress: progress.data,
              verbose: context7.options.verbose
            }, void 0, !1, void 0, this),
            jsx
          ]
        }, void 0, !0, void 0, this),
        shouldHidePromptInput: !1,
        showSpinner: !1
      });
    }, PowerShellTool2 = null;
    if (usePowerShell)
      PowerShellTool2 = (init_PowerShellTool(), __toCommonJS(exports_PowerShellTool)).PowerShellTool;
    let shellTool = PowerShellTool2 ?? BashTool, data = (PowerShellTool2 ? await PowerShellTool2.call({
      command: inputString,
      dangerouslyDisableSandbox: !0
    }, bashModeContext, void 0, void 0, onProgress) : await BashTool.call({
      command: inputString,
      dangerouslyDisableSandbox: !0
    }, bashModeContext, void 0, void 0, onProgress)).data;
    if (!data)
      throw Error("No result received from shell command");
    let stderr = data.stderr, mapped = await processToolResultBlock(shellTool, {
      ...data,
      stderr: ""
    }, randomUUID39()), stdout = typeof mapped.content === "string" ? mapped.content : escapeXml(data.stdout);
    return {
      messages: [createSyntheticUserCaveatMessage(), userMessage, ...attachmentMessages, createUserMessage({
        content: `<bash-stdout>${stdout}</bash-stdout><bash-stderr>${escapeXml(stderr)}</bash-stderr>`
      })],
      shouldQuery: !1
    };
  } catch (e) {
    if (e instanceof ShellError) {
      if (e.interrupted)
        return {
          messages: [createSyntheticUserCaveatMessage(), userMessage, createUserInterruptionMessage({
            toolUse: !1
          }), ...attachmentMessages],
          shouldQuery: !1
        };
      return {
        messages: [createSyntheticUserCaveatMessage(), userMessage, ...attachmentMessages, createUserMessage({
          content: `<bash-stdout>${escapeXml(e.stdout)}</bash-stdout><bash-stderr>${escapeXml(e.stderr)}</bash-stderr>`
        })],
        shouldQuery: !1
      };
    }
    return {
      messages: [createSyntheticUserCaveatMessage(), userMessage, ...attachmentMessages, createUserMessage({
        content: `<bash-stderr>Command failed: ${escapeXml(errorMessage(e))}</bash-stderr>`
      })],
      shouldQuery: !1
    };
  } finally {
    setToolJSX(null);
  }
}
var jsx_dev_runtime436;
var init_processBashCommand = __esm(() => {
  init_BashModeProgress();
  init_BashTool();
  init_errors();
  init_messages3();
  init_resolveDefaultShell();
  init_shellToolUtils();
  init_toolResultStorage();
  jsx_dev_runtime436 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
