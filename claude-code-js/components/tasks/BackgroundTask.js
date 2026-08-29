// Original: src/components/tasks/BackgroundTask.tsx
function BackgroundTask(t0) {
  let $3 = import_compiler_runtime224.c(92), {
    task,
    maxActivityWidth
  } = t0, activityLimit = maxActivityWidth ?? 40;
  switch (task.type) {
    case "local_bash": {
      let t1 = task.kind === "monitor" ? task.description : task.command, t2;
      if ($3[0] !== activityLimit || $3[1] !== t1)
        t2 = truncate(t1, activityLimit, !0), $3[0] = activityLimit, $3[1] = t1, $3[2] = t2;
      else
        t2 = $3[2];
      let t3;
      if ($3[3] !== task)
        t3 = /* @__PURE__ */ jsx_dev_runtime284.jsxDEV(ShellProgress, {
          shell: task
        }, void 0, !1, void 0, this), $3[3] = task, $3[4] = t3;
      else
        t3 = $3[4];
      let t4;
      if ($3[5] !== t2 || $3[6] !== t3)
        t4 = /* @__PURE__ */ jsx_dev_runtime284.jsxDEV(ThemedText, {
          children: [
            t2,
            " ",
            t3
          ]
        }, void 0, !0, void 0, this), $3[5] = t2, $3[6] = t3, $3[7] = t4;
      else
        t4 = $3[7];
      return t4;
    }
    case "remote_agent": {
      if (task.isRemoteReview) {
        let t12;
        if ($3[8] !== task)
          t12 = /* @__PURE__ */ jsx_dev_runtime284.jsxDEV(ThemedText, {
            children: /* @__PURE__ */ jsx_dev_runtime284.jsxDEV(RemoteSessionProgress, {
              session: task
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this), $3[8] = task, $3[9] = t12;
        else
          t12 = $3[9];
        return t12;
      }
      let t1 = task.status === "running" || task.status === "pending" ? DIAMOND_OPEN : DIAMOND_FILLED, t2;
      if ($3[10] !== t1)
        t2 = /* @__PURE__ */ jsx_dev_runtime284.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            t1,
            " "
          ]
        }, void 0, !0, void 0, this), $3[10] = t1, $3[11] = t2;
      else
        t2 = $3[11];
      let t3;
      if ($3[12] !== activityLimit || $3[13] !== task.title)
        t3 = truncate(task.title, activityLimit, !0), $3[12] = activityLimit, $3[13] = task.title, $3[14] = t3;
      else
        t3 = $3[14];
      let t4;
      if ($3[15] === Symbol.for("react.memo_cache_sentinel"))
        t4 = /* @__PURE__ */ jsx_dev_runtime284.jsxDEV(ThemedText, {
          dimColor: !0,
          children: " \xB7 "
        }, void 0, !1, void 0, this), $3[15] = t4;
      else
        t4 = $3[15];
      let t5;
      if ($3[16] !== task)
        t5 = /* @__PURE__ */ jsx_dev_runtime284.jsxDEV(RemoteSessionProgress, {
          session: task
        }, void 0, !1, void 0, this), $3[16] = task, $3[17] = t5;
      else
        t5 = $3[17];
      let t6;
      if ($3[18] !== t2 || $3[19] !== t3 || $3[20] !== t5)
        t6 = /* @__PURE__ */ jsx_dev_runtime284.jsxDEV(ThemedText, {
          children: [
            t2,
            t3,
            t4,
            t5
          ]
        }, void 0, !0, void 0, this), $3[18] = t2, $3[19] = t3, $3[20] = t5, $3[21] = t6;
      else
        t6 = $3[21];
      return t6;
    }
    case "local_agent": {
      let t1;
      if ($3[22] !== activityLimit || $3[23] !== task.description)
        t1 = truncate(task.description, activityLimit, !0), $3[22] = activityLimit, $3[23] = task.description, $3[24] = t1;
      else
        t1 = $3[24];
      let t2 = task.status === "completed" ? "done" : void 0, t3 = task.status === "completed" && !task.notified ? ", unread" : void 0, t4;
      if ($3[25] !== t2 || $3[26] !== t3 || $3[27] !== task.status)
        t4 = /* @__PURE__ */ jsx_dev_runtime284.jsxDEV(TaskStatusText, {
          status: task.status,
          label: t2,
          suffix: t3
        }, void 0, !1, void 0, this), $3[25] = t2, $3[26] = t3, $3[27] = task.status, $3[28] = t4;
      else
        t4 = $3[28];
      let t5;
      if ($3[29] !== t1 || $3[30] !== t4)
        t5 = /* @__PURE__ */ jsx_dev_runtime284.jsxDEV(ThemedText, {
          children: [
            t1,
            " ",
            t4
          ]
        }, void 0, !0, void 0, this), $3[29] = t1, $3[30] = t4, $3[31] = t5;
      else
        t5 = $3[31];
      return t5;
    }
    case "in_process_teammate": {
      let T0, T1, t1, t2, t3, t4;
      if ($3[32] !== activityLimit || $3[33] !== task) {
        let activity = describeTeammateActivity(task);
        T1 = ThemedText;
        let t52;
        if ($3[40] !== task.identity.color)
          t52 = toInkColor(task.identity.color), $3[40] = task.identity.color, $3[41] = t52;
        else
          t52 = $3[41];
        if ($3[42] !== t52 || $3[43] !== task.identity.agentName)
          t4 = /* @__PURE__ */ jsx_dev_runtime284.jsxDEV(ThemedText, {
            color: t52,
            children: [
              "@",
              task.identity.agentName
            ]
          }, void 0, !0, void 0, this), $3[42] = t52, $3[43] = task.identity.agentName, $3[44] = t4;
        else
          t4 = $3[44];
        T0 = ThemedText, t1 = !0, t2 = ": ", t3 = truncate(activity, activityLimit, !0), $3[32] = activityLimit, $3[33] = task, $3[34] = T0, $3[35] = T1, $3[36] = t1, $3[37] = t2, $3[38] = t3, $3[39] = t4;
      } else
        T0 = $3[34], T1 = $3[35], t1 = $3[36], t2 = $3[37], t3 = $3[38], t4 = $3[39];
      let t5;
      if ($3[45] !== T0 || $3[46] !== t1 || $3[47] !== t2 || $3[48] !== t3)
        t5 = /* @__PURE__ */ jsx_dev_runtime284.jsxDEV(T0, {
          dimColor: t1,
          children: [
            t2,
            t3
          ]
        }, void 0, !0, void 0, this), $3[45] = T0, $3[46] = t1, $3[47] = t2, $3[48] = t3, $3[49] = t5;
      else
        t5 = $3[49];
      let t6;
      if ($3[50] !== T1 || $3[51] !== t4 || $3[52] !== t5)
        t6 = /* @__PURE__ */ jsx_dev_runtime284.jsxDEV(T1, {
          children: [
            t4,
            t5
          ]
        }, void 0, !0, void 0, this), $3[50] = T1, $3[51] = t4, $3[52] = t5, $3[53] = t6;
      else
        t6 = $3[53];
      return t6;
    }
    case "local_workflow": {
      let t1 = task.workflowName ?? task.summary ?? task.description, t2;
      if ($3[54] !== activityLimit || $3[55] !== t1)
        t2 = truncate(t1, activityLimit, !0), $3[54] = activityLimit, $3[55] = t1, $3[56] = t2;
      else
        t2 = $3[56];
      let t3;
      if ($3[57] !== task.agentCount || $3[58] !== task.status)
        t3 = task.status === "running" ? `${task.agentCount} ${plural(task.agentCount, "agent")}` : task.status === "completed" ? "done" : void 0, $3[57] = task.agentCount, $3[58] = task.status, $3[59] = t3;
      else
        t3 = $3[59];
      let t4 = task.status === "completed" && !task.notified ? ", unread" : void 0, t5;
      if ($3[60] !== t3 || $3[61] !== t4 || $3[62] !== task.status)
        t5 = /* @__PURE__ */ jsx_dev_runtime284.jsxDEV(TaskStatusText, {
          status: task.status,
          label: t3,
          suffix: t4
        }, void 0, !1, void 0, this), $3[60] = t3, $3[61] = t4, $3[62] = task.status, $3[63] = t5;
      else
        t5 = $3[63];
      let t6;
      if ($3[64] !== t2 || $3[65] !== t5)
        t6 = /* @__PURE__ */ jsx_dev_runtime284.jsxDEV(ThemedText, {
          children: [
            t2,
            " ",
            t5
          ]
        }, void 0, !0, void 0, this), $3[64] = t2, $3[65] = t5, $3[66] = t6;
      else
        t6 = $3[66];
      return t6;
    }
    case "monitor_mcp": {
      let t1;
      if ($3[67] !== activityLimit || $3[68] !== task.description)
        t1 = truncate(task.description, activityLimit, !0), $3[67] = activityLimit, $3[68] = task.description, $3[69] = t1;
      else
        t1 = $3[69];
      let t2 = task.status === "completed" ? "done" : void 0, t3 = task.status === "completed" && !task.notified ? ", unread" : void 0, t4;
      if ($3[70] !== t2 || $3[71] !== t3 || $3[72] !== task.status)
        t4 = /* @__PURE__ */ jsx_dev_runtime284.jsxDEV(TaskStatusText, {
          status: task.status,
          label: t2,
          suffix: t3
        }, void 0, !1, void 0, this), $3[70] = t2, $3[71] = t3, $3[72] = task.status, $3[73] = t4;
      else
        t4 = $3[73];
      let t5;
      if ($3[74] !== t1 || $3[75] !== t4)
        t5 = /* @__PURE__ */ jsx_dev_runtime284.jsxDEV(ThemedText, {
          children: [
            t1,
            " ",
            t4
          ]
        }, void 0, !0, void 0, this), $3[74] = t1, $3[75] = t4, $3[76] = t5;
      else
        t5 = $3[76];
      return t5;
    }
    case "dream": {
      let n5 = task.filesTouched.length, t1;
      if ($3[77] !== n5 || $3[78] !== task.phase || $3[79] !== task.sessionsReviewing)
        t1 = task.phase === "updating" && n5 > 0 ? `${n5} ${plural(n5, "file")}` : `${task.sessionsReviewing} ${plural(task.sessionsReviewing, "session")}`, $3[77] = n5, $3[78] = task.phase, $3[79] = task.sessionsReviewing, $3[80] = t1;
      else
        t1 = $3[80];
      let detail = t1, t2;
      if ($3[81] !== detail || $3[82] !== task.phase)
        t2 = /* @__PURE__ */ jsx_dev_runtime284.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            "\xB7 ",
            task.phase,
            " \xB7 ",
            detail
          ]
        }, void 0, !0, void 0, this), $3[81] = detail, $3[82] = task.phase, $3[83] = t2;
      else
        t2 = $3[83];
      let t3 = task.status === "completed" ? "done" : void 0, t4 = task.status === "completed" && !task.notified ? ", unread" : void 0, t5;
      if ($3[84] !== t3 || $3[85] !== t4 || $3[86] !== task.status)
        t5 = /* @__PURE__ */ jsx_dev_runtime284.jsxDEV(TaskStatusText, {
          status: task.status,
          label: t3,
          suffix: t4
        }, void 0, !1, void 0, this), $3[84] = t3, $3[85] = t4, $3[86] = task.status, $3[87] = t5;
      else
        t5 = $3[87];
      let t6;
      if ($3[88] !== t2 || $3[89] !== t5 || $3[90] !== task.description)
        t6 = /* @__PURE__ */ jsx_dev_runtime284.jsxDEV(ThemedText, {
          children: [
            task.description,
            " ",
            t2,
            " ",
            t5
          ]
        }, void 0, !0, void 0, this), $3[88] = t2, $3[89] = t5, $3[90] = task.description, $3[91] = t6;
      else
        t6 = $3[91];
      return t6;
    }
  }
}
var import_compiler_runtime224, jsx_dev_runtime284;
var init_BackgroundTask = __esm(() => {
  init_ink2();
  init_format();
  init_ink3();
  init_figures2();
  init_RemoteSessionProgress();
  init_ShellProgress();
  init_taskStatusUtils();
  import_compiler_runtime224 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime284 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
