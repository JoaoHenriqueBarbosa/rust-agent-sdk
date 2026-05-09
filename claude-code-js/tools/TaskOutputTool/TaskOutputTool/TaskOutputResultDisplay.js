// function: TaskOutputResultDisplay
function TaskOutputResultDisplay(t0) {
  let $3 = import_compiler_runtime119.c(54), {
    content,
    verbose: t1,
    theme
  } = t0, verbose = t1 === void 0 ? !1 : t1, expandShortcut = useShortcutDisplay("app:toggleTranscript", "Global", "ctrl+o"), t2;
  if ($3[0] !== content)
    t2 = typeof content === "string" ? jsonParse(content) : content, $3[0] = content, $3[1] = t2;
  else
    t2 = $3[1];
  let result = t2;
  if (!result.task) {
    let t32;
    if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
      t32 = /* @__PURE__ */ jsx_dev_runtime141.jsxDEV(MessageResponse, {
        children: /* @__PURE__ */ jsx_dev_runtime141.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "No task output available"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), $3[2] = t32;
    else
      t32 = $3[2];
    return t32;
  }
  let {
    task
  } = result;
  if (task.task_type === "local_bash") {
    let t32;
    if ($3[3] !== task.error || $3[4] !== task.output)
      t32 = {
        stdout: task.output,
        stderr: "",
        isImage: !1,
        dangerouslyDisableSandbox: !0,
        returnCodeInterpretation: task.error
      }, $3[3] = task.error, $3[4] = task.output, $3[5] = t32;
    else
      t32 = $3[5];
    let bashOut = t32, t42;
    if ($3[6] !== bashOut || $3[7] !== verbose)
      t42 = /* @__PURE__ */ jsx_dev_runtime141.jsxDEV(BashToolResultMessage, {
        content: bashOut,
        verbose
      }, void 0, !1, void 0, this), $3[6] = bashOut, $3[7] = verbose, $3[8] = t42;
    else
      t42 = $3[8];
    return t42;
  }
  if (task.task_type === "local_agent") {
    let lineCount = task.result ? countCharInString(task.result, `
`) + 1 : 0;
    if (result.retrieval_status === "success") {
      if (verbose) {
        let t34;
        if ($3[9] !== lineCount || $3[10] !== task.description)
          t34 = /* @__PURE__ */ jsx_dev_runtime141.jsxDEV(ThemedText, {
            children: [
              task.description,
              " (",
              lineCount,
              " lines)"
            ]
          }, void 0, !0, void 0, this), $3[9] = lineCount, $3[10] = task.description, $3[11] = t34;
        else
          t34 = $3[11];
        let t42;
        if ($3[12] !== task.prompt || $3[13] !== theme)
          t42 = task.prompt && /* @__PURE__ */ jsx_dev_runtime141.jsxDEV(AgentPromptDisplay, {
            prompt: task.prompt,
            theme,
            dim: !0
          }, void 0, !1, void 0, this), $3[12] = task.prompt, $3[13] = theme, $3[14] = t42;
        else
          t42 = $3[14];
        let t52;
        if ($3[15] !== task.result || $3[16] !== theme)
          t52 = task.result && /* @__PURE__ */ jsx_dev_runtime141.jsxDEV(ThemedBox_default, {
            marginTop: 1,
            children: /* @__PURE__ */ jsx_dev_runtime141.jsxDEV(AgentResponseDisplay, {
              content: [{
                type: "text",
                text: task.result
              }],
              theme
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this), $3[15] = task.result, $3[16] = theme, $3[17] = t52;
        else
          t52 = $3[17];
        let t6;
        if ($3[18] !== task.error)
          t6 = task.error && /* @__PURE__ */ jsx_dev_runtime141.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            marginTop: 1,
            children: [
              /* @__PURE__ */ jsx_dev_runtime141.jsxDEV(ThemedText, {
                color: "error",
                bold: !0,
                children: "Error:"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime141.jsxDEV(ThemedBox_default, {
                paddingLeft: 2,
                children: /* @__PURE__ */ jsx_dev_runtime141.jsxDEV(ThemedText, {
                  color: "error",
                  children: task.error
                }, void 0, !1, void 0, this)
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this), $3[18] = task.error, $3[19] = t6;
        else
          t6 = $3[19];
        let t7;
        if ($3[20] !== t42 || $3[21] !== t52 || $3[22] !== t6)
          t7 = /* @__PURE__ */ jsx_dev_runtime141.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            paddingLeft: 2,
            marginTop: 1,
            children: [
              t42,
              t52,
              t6
            ]
          }, void 0, !0, void 0, this), $3[20] = t42, $3[21] = t52, $3[22] = t6, $3[23] = t7;
        else
          t7 = $3[23];
        let t8;
        if ($3[24] !== t34 || $3[25] !== t7)
          t8 = /* @__PURE__ */ jsx_dev_runtime141.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            children: [
              t34,
              t7
            ]
          }, void 0, !0, void 0, this), $3[24] = t34, $3[25] = t7, $3[26] = t8;
        else
          t8 = $3[26];
        return t8;
      }
      let t33;
      if ($3[27] !== expandShortcut)
        t33 = /* @__PURE__ */ jsx_dev_runtime141.jsxDEV(MessageResponse, {
          children: /* @__PURE__ */ jsx_dev_runtime141.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              "Read output (",
              expandShortcut,
              " to expand)"
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this), $3[27] = expandShortcut, $3[28] = t33;
      else
        t33 = $3[28];
      return t33;
    }
    if (result.retrieval_status === "timeout" || task.status === "running") {
      let t33;
      if ($3[29] === Symbol.for("react.memo_cache_sentinel"))
        t33 = /* @__PURE__ */ jsx_dev_runtime141.jsxDEV(MessageResponse, {
          children: /* @__PURE__ */ jsx_dev_runtime141.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "Task is still running\u2026"
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this), $3[29] = t33;
      else
        t33 = $3[29];
      return t33;
    }
    if (result.retrieval_status === "not_ready") {
      let t33;
      if ($3[30] === Symbol.for("react.memo_cache_sentinel"))
        t33 = /* @__PURE__ */ jsx_dev_runtime141.jsxDEV(MessageResponse, {
          children: /* @__PURE__ */ jsx_dev_runtime141.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "Task is still running\u2026"
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this), $3[30] = t33;
      else
        t33 = $3[30];
      return t33;
    }
    let t32;
    if ($3[31] === Symbol.for("react.memo_cache_sentinel"))
      t32 = /* @__PURE__ */ jsx_dev_runtime141.jsxDEV(MessageResponse, {
        children: /* @__PURE__ */ jsx_dev_runtime141.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "Task not ready"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), $3[31] = t32;
    else
      t32 = $3[31];
    return t32;
  }
  if (task.task_type === "remote_agent") {
    let t32;
    if ($3[32] !== task.description || $3[33] !== task.status)
      t32 = /* @__PURE__ */ jsx_dev_runtime141.jsxDEV(ThemedText, {
        children: [
          "\xA0\xA0",
          task.description,
          " [",
          task.status,
          "]"
        ]
      }, void 0, !0, void 0, this), $3[32] = task.description, $3[33] = task.status, $3[34] = t32;
    else
      t32 = $3[34];
    let t42;
    if ($3[35] !== task.output || $3[36] !== verbose)
      t42 = task.output && verbose && /* @__PURE__ */ jsx_dev_runtime141.jsxDEV(ThemedBox_default, {
        paddingLeft: 4,
        marginTop: 1,
        children: /* @__PURE__ */ jsx_dev_runtime141.jsxDEV(ThemedText, {
          children: task.output
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), $3[35] = task.output, $3[36] = verbose, $3[37] = t42;
    else
      t42 = $3[37];
    let t52;
    if ($3[38] !== expandShortcut || $3[39] !== task.output || $3[40] !== verbose)
      t52 = !verbose && task.output && /* @__PURE__ */ jsx_dev_runtime141.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "     ",
          "(",
          expandShortcut,
          " to expand)"
        ]
      }, void 0, !0, void 0, this), $3[38] = expandShortcut, $3[39] = task.output, $3[40] = verbose, $3[41] = t52;
    else
      t52 = $3[41];
    let t6;
    if ($3[42] !== t32 || $3[43] !== t42 || $3[44] !== t52)
      t6 = /* @__PURE__ */ jsx_dev_runtime141.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: [
          t32,
          t42,
          t52
        ]
      }, void 0, !0, void 0, this), $3[42] = t32, $3[43] = t42, $3[44] = t52, $3[45] = t6;
    else
      t6 = $3[45];
    return t6;
  }
  let t3;
  if ($3[46] !== task.description || $3[47] !== task.status)
    t3 = /* @__PURE__ */ jsx_dev_runtime141.jsxDEV(ThemedText, {
      children: [
        "\xA0\xA0",
        task.description,
        " [",
        task.status,
        "]"
      ]
    }, void 0, !0, void 0, this), $3[46] = task.description, $3[47] = task.status, $3[48] = t3;
  else
    t3 = $3[48];
  let t4;
  if ($3[49] !== task.output)
    t4 = task.output && /* @__PURE__ */ jsx_dev_runtime141.jsxDEV(ThemedBox_default, {
      paddingLeft: 4,
      children: /* @__PURE__ */ jsx_dev_runtime141.jsxDEV(ThemedText, {
        children: task.output.slice(0, 500)
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[49] = task.output, $3[50] = t4;
  else
    t4 = $3[50];
  let t5;
  if ($3[51] !== t3 || $3[52] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime141.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t3,
        t4
      ]
    }, void 0, !0, void 0, this), $3[51] = t3, $3[52] = t4, $3[53] = t5;
  else
    t5 = $3[53];
  return t5;
}
