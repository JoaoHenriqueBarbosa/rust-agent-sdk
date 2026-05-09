// function: BackgroundTasksDialog
function BackgroundTasksDialog({
  onDone,
  toolUseContext,
  initialDetailTaskId
}) {
  let tasks = useAppState((s2) => s2.tasks), foregroundedTaskId = useAppState((s_0) => s_0.foregroundedTaskId), showSpinnerTree = useAppState((s_1) => s_1.expandedView) === "teammates", setAppState = useSetAppState(), killAgentsShortcut = useShortcutDisplay("chat:killAgents", "Chat", "ctrl+x ctrl+k"), typedTasks = tasks, skippedListOnMount = import_react165.useRef(!1), [viewState, setViewState] = import_react165.useState(() => {
    if (initialDetailTaskId)
      return skippedListOnMount.current = !0, {
        mode: "detail",
        itemId: initialDetailTaskId
      };
    let allItems = getSelectableBackgroundTasks(typedTasks, foregroundedTaskId);
    if (allItems.length === 1)
      return skippedListOnMount.current = !0, {
        mode: "detail",
        itemId: allItems[0].id
      };
    return {
      mode: "list"
    };
  }), [selectedIndex, setSelectedIndex] = import_react165.useState(0);
  useRegisterOverlay("background-tasks-dialog");
  let {
    bashTasks,
    remoteSessions,
    agentTasks,
    teammateTasks,
    workflowTasks,
    mcpMonitors,
    dreamTasks: dreamTasks_0,
    allSelectableItems
  } = import_react165.useMemo(() => {
    let sorted = Object.values(typedTasks ?? {}).filter(isBackgroundTask).map(toListItem).sort((a2, b) => {
      let aStatus = a2.status, bStatus = b.status;
      if (aStatus === "running" && bStatus !== "running")
        return -1;
      if (aStatus !== "running" && bStatus === "running")
        return 1;
      let aTime = "task" in a2 ? a2.task.startTime : 0;
      return ("task" in b ? b.task.startTime : 0) - aTime;
    }), bash = sorted.filter((item) => item.type === "local_bash"), remote = sorted.filter((item_0) => item_0.type === "remote_agent"), agent = sorted.filter((item_1) => item_1.type === "local_agent" && item_1.id !== foregroundedTaskId), workflows = sorted.filter((item_2) => item_2.type === "local_workflow"), monitorMcp = sorted.filter((item_3) => item_3.type === "monitor_mcp"), dreamTasks = sorted.filter((item_4) => item_4.type === "dream"), teammates = showSpinnerTree ? [] : sorted.filter((item_5) => item_5.type === "in_process_teammate"), leaderItem = teammates.length > 0 ? [{
      id: "__leader__",
      type: "leader",
      label: `@${TEAM_LEAD_NAME}`,
      status: "running"
    }] : [];
    return {
      bashTasks: bash,
      remoteSessions: remote,
      agentTasks: agent,
      workflowTasks: workflows,
      mcpMonitors: monitorMcp,
      dreamTasks,
      teammateTasks: [...leaderItem, ...teammates],
      allSelectableItems: [...leaderItem, ...teammates, ...bash, ...monitorMcp, ...remote, ...agent, ...workflows, ...dreamTasks]
    };
  }, [typedTasks, foregroundedTaskId, showSpinnerTree]), currentSelection = allSelectableItems[selectedIndex] ?? null;
  useKeybindings({
    "confirm:previous": () => setSelectedIndex((prev) => Math.max(0, prev - 1)),
    "confirm:next": () => setSelectedIndex((prev_0) => Math.min(allSelectableItems.length - 1, prev_0 + 1)),
    "confirm:yes": () => {
      let current = allSelectableItems[selectedIndex];
      if (current)
        if (current.type === "leader")
          exitTeammateView(setAppState), onDone("Viewing leader", {
            display: "system"
          });
        else
          setViewState({
            mode: "detail",
            itemId: current.id
          });
    }
  }, {
    context: "Confirmation",
    isActive: viewState.mode === "list"
  });
  let handleKeyDown = (e) => {
    if (viewState.mode !== "list")
      return;
    if (e.key === "left") {
      e.preventDefault(), onDone("Background tasks dialog dismissed", {
        display: "system"
      });
      return;
    }
    let currentSelection_0 = allSelectableItems[selectedIndex];
    if (!currentSelection_0)
      return;
    if (e.key === "x") {
      if (e.preventDefault(), currentSelection_0.type === "local_bash" && currentSelection_0.status === "running")
        killShellTask(currentSelection_0.id);
      else if (currentSelection_0.type === "local_agent" && currentSelection_0.status === "running")
        killAgentTask(currentSelection_0.id);
      else if (currentSelection_0.type === "in_process_teammate" && currentSelection_0.status === "running")
        killTeammateTask(currentSelection_0.id);
      else if (currentSelection_0.type === "local_workflow" && currentSelection_0.status === "running" && killWorkflowTask)
        killWorkflowTask(currentSelection_0.id, setAppState);
      else if (currentSelection_0.type === "monitor_mcp" && currentSelection_0.status === "running" && killMonitorMcp)
        killMonitorMcp(currentSelection_0.id, setAppState);
      else if (currentSelection_0.type === "dream" && currentSelection_0.status === "running")
        killDreamTask(currentSelection_0.id);
      else if (currentSelection_0.type === "remote_agent" && currentSelection_0.status === "running")
        if (currentSelection_0.task.isUltraplan)
          stopUltraplan(currentSelection_0.id, currentSelection_0.task.sessionId, setAppState);
        else
          killRemoteAgentTask(currentSelection_0.id);
    }
    if (e.key === "f") {
      if (currentSelection_0.type === "in_process_teammate" && currentSelection_0.status === "running")
        e.preventDefault(), enterTeammateView(currentSelection_0.id, setAppState), onDone("Viewing teammate", {
          display: "system"
        });
      else if (currentSelection_0.type === "leader")
        e.preventDefault(), exitTeammateView(setAppState), onDone("Viewing leader", {
          display: "system"
        });
    }
  };
  async function killShellTask(taskId) {
    await LocalShellTask.kill(taskId, setAppState);
  }
  async function killAgentTask(taskId_0) {
    await LocalAgentTask.kill(taskId_0, setAppState);
  }
  async function killTeammateTask(taskId_1) {
    await InProcessTeammateTask.kill(taskId_1, setAppState);
  }
  async function killDreamTask(taskId_2) {
    await DreamTask.kill(taskId_2, setAppState);
  }
  async function killRemoteAgentTask(taskId_3) {
    await RemoteAgentTask.kill(taskId_3, setAppState);
  }
  let onDoneEvent = import_react165.useEffectEvent(onDone);
  import_react165.useEffect(() => {
    if (viewState.mode !== "list") {
      let task = (typedTasks ?? {})[viewState.itemId];
      if (!task || task.type !== "local_workflow" && !isBackgroundTask(task))
        if (skippedListOnMount.current)
          onDoneEvent("Background tasks dialog dismissed", {
            display: "system"
          });
        else
          setViewState({
            mode: "list"
          });
    }
    let totalItems = allSelectableItems.length;
    if (selectedIndex >= totalItems && totalItems > 0)
      setSelectedIndex(totalItems - 1);
  }, [viewState, typedTasks, selectedIndex, allSelectableItems, onDoneEvent]);
  let goBackToList = () => {
    if (skippedListOnMount.current && allSelectableItems.length <= 1)
      onDone("Background tasks dialog dismissed", {
        display: "system"
      });
    else
      skippedListOnMount.current = !1, setViewState({
        mode: "list"
      });
  };
  if (viewState.mode !== "list" && typedTasks) {
    let task_0 = typedTasks[viewState.itemId];
    if (!task_0)
      return null;
    switch (task_0.type) {
      case "local_bash":
        return /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ShellDetailDialog, {
          shell: task_0,
          onDone,
          onKillShell: () => void killShellTask(task_0.id),
          onBack: goBackToList
        }, `shell-${task_0.id}`, !1, void 0, this);
      case "local_agent":
        return /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(AsyncAgentDetailDialog, {
          agent: task_0,
          onDone,
          onKillAgent: () => void killAgentTask(task_0.id),
          onBack: goBackToList
        }, `agent-${task_0.id}`, !1, void 0, this);
      case "remote_agent":
        return /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(RemoteSessionDetailDialog, {
          session: task_0,
          onDone,
          toolUseContext,
          onBack: goBackToList,
          onKill: task_0.status !== "running" ? void 0 : task_0.isUltraplan ? () => void stopUltraplan(task_0.id, task_0.sessionId, setAppState) : () => void killRemoteAgentTask(task_0.id)
        }, `session-${task_0.id}`, !1, void 0, this);
      case "in_process_teammate":
        return /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(InProcessTeammateDetailDialog, {
          teammate: task_0,
          onDone,
          onKill: task_0.status === "running" ? () => void killTeammateTask(task_0.id) : void 0,
          onBack: goBackToList,
          onForeground: task_0.status === "running" ? () => {
            enterTeammateView(task_0.id, setAppState), onDone("Viewing teammate", {
              display: "system"
            });
          } : void 0
        }, `teammate-${task_0.id}`, !1, void 0, this);
      case "local_workflow":
        if (!WorkflowDetailDialog)
          return null;
        return /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(WorkflowDetailDialog, {
          workflow: task_0,
          onDone,
          onKill: task_0.status === "running" && killWorkflowTask ? () => killWorkflowTask(task_0.id, setAppState) : void 0,
          onSkipAgent: task_0.status === "running" && skipWorkflowAgent ? (agentId) => skipWorkflowAgent(task_0.id, agentId, setAppState) : void 0,
          onRetryAgent: task_0.status === "running" && retryWorkflowAgent ? (agentId_0) => retryWorkflowAgent(task_0.id, agentId_0, setAppState) : void 0,
          onBack: goBackToList
        }, `workflow-${task_0.id}`, !1, void 0, this);
      case "monitor_mcp":
        if (!MonitorMcpDetailDialog)
          return null;
        return /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(MonitorMcpDetailDialog, {
          task: task_0,
          onKill: task_0.status === "running" && killMonitorMcp ? () => killMonitorMcp(task_0.id, setAppState) : void 0,
          onBack: goBackToList
        }, `monitor-mcp-${task_0.id}`, !1, void 0, this);
      case "dream":
        return /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(DreamDetailDialog, {
          task: task_0,
          onDone: () => onDone("Background tasks dialog dismissed", {
            display: "system"
          }),
          onBack: goBackToList,
          onKill: task_0.status === "running" ? () => void killDreamTask(task_0.id) : void 0
        }, `dream-${task_0.id}`, !1, void 0, this);
    }
  }
  let runningBashCount = count2(bashTasks, (_) => _.status === "running"), runningAgentCount = count2(remoteSessions, (__0) => __0.status === "running" || __0.status === "pending") + count2(agentTasks, (__1) => __1.status === "running"), runningTeammateCount = count2(teammateTasks, (__2) => __2.status === "running"), subtitle = intersperse([...runningTeammateCount > 0 ? [/* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ThemedText, {
    children: [
      runningTeammateCount,
      " ",
      runningTeammateCount !== 1 ? "agents" : "agent"
    ]
  }, "teammates", !0, void 0, this)] : [], ...runningBashCount > 0 ? [/* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ThemedText, {
    children: [
      runningBashCount,
      " ",
      runningBashCount !== 1 ? "active shells" : "active shell"
    ]
  }, "shells", !0, void 0, this)] : [], ...runningAgentCount > 0 ? [/* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ThemedText, {
    children: [
      runningAgentCount,
      " ",
      runningAgentCount !== 1 ? "active agents" : "active agent"
    ]
  }, "agents", !0, void 0, this)] : []], (index) => /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ThemedText, {
    children: " \xB7 "
  }, `separator-${index}`, !1, void 0, this)), actions = [/* @__PURE__ */ jsx_dev_runtime289.jsxDEV(KeyboardShortcutHint, {
    shortcut: "\u2191/\u2193",
    action: "select"
  }, "upDown", !1, void 0, this), /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(KeyboardShortcutHint, {
    shortcut: "Enter",
    action: "view"
  }, "enter", !1, void 0, this), ...currentSelection?.type === "in_process_teammate" && currentSelection.status === "running" ? [/* @__PURE__ */ jsx_dev_runtime289.jsxDEV(KeyboardShortcutHint, {
    shortcut: "f",
    action: "foreground"
  }, "foreground", !1, void 0, this)] : [], ...(currentSelection?.type === "local_bash" || currentSelection?.type === "local_agent" || currentSelection?.type === "in_process_teammate" || currentSelection?.type === "local_workflow" || currentSelection?.type === "monitor_mcp" || currentSelection?.type === "dream" || currentSelection?.type === "remote_agent") && currentSelection.status === "running" ? [/* @__PURE__ */ jsx_dev_runtime289.jsxDEV(KeyboardShortcutHint, {
    shortcut: "x",
    action: "stop"
  }, "kill", !1, void 0, this)] : [], ...agentTasks.some((t2) => t2.status === "running") ? [/* @__PURE__ */ jsx_dev_runtime289.jsxDEV(KeyboardShortcutHint, {
    shortcut: killAgentsShortcut,
    action: "stop all agents"
  }, "kill-all", !1, void 0, this)] : [], /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(KeyboardShortcutHint, {
    shortcut: "\u2190/Esc",
    action: "close"
  }, "esc", !1, void 0, this)], handleCancel = () => onDone("Background tasks dialog dismissed", {
    display: "system"
  });
  function renderInputGuide2(exitState) {
    if (exitState.pending)
      return /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ThemedText, {
        children: [
          "Press ",
          exitState.keyName,
          " again to exit"
        ]
      }, void 0, !0, void 0, this);
    return /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(Byline, {
      children: actions
    }, void 0, !1, void 0, this);
  }
  return /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    tabIndex: 0,
    autoFocus: !0,
    onKeyDown: handleKeyDown,
    children: /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(Dialog, {
      title: "Background tasks",
      subtitle: /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(jsx_dev_runtime289.Fragment, {
        children: subtitle
      }, void 0, !1, void 0, this),
      onCancel: handleCancel,
      color: "background",
      inputGuide: renderInputGuide2,
      children: allSelectableItems.length === 0 ? /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "No tasks currently running"
      }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: [
          teammateTasks.length > 0 && /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            children: [
              (bashTasks.length > 0 || remoteSessions.length > 0 || agentTasks.length > 0) && /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ThemedText, {
                dimColor: !0,
                children: [
                  /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ThemedText, {
                    bold: !0,
                    children: [
                      "  ",
                      "Agents"
                    ]
                  }, void 0, !0, void 0, this),
                  " (",
                  count2(teammateTasks, (i5) => i5.type !== "leader"),
                  ")"
                ]
              }, void 0, !0, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ThemedBox_default, {
                flexDirection: "column",
                children: /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(TeammateTaskGroups, {
                  teammateTasks,
                  currentSelectionId: currentSelection?.id
                }, void 0, !1, void 0, this)
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          bashTasks.length > 0 && /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            marginTop: teammateTasks.length > 0 ? 1 : 0,
            children: [
              (teammateTasks.length > 0 || remoteSessions.length > 0 || agentTasks.length > 0) && /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ThemedText, {
                dimColor: !0,
                children: [
                  /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ThemedText, {
                    bold: !0,
                    children: [
                      "  ",
                      "Shells"
                    ]
                  }, void 0, !0, void 0, this),
                  " (",
                  bashTasks.length,
                  ")"
                ]
              }, void 0, !0, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ThemedBox_default, {
                flexDirection: "column",
                children: bashTasks.map((item_6) => /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(Item, {
                  item: item_6,
                  isSelected: item_6.id === currentSelection?.id
                }, item_6.id, !1, void 0, this))
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          mcpMonitors.length > 0 && /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            marginTop: teammateTasks.length > 0 || bashTasks.length > 0 ? 1 : 0,
            children: [
              /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ThemedText, {
                dimColor: !0,
                children: [
                  /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ThemedText, {
                    bold: !0,
                    children: [
                      "  ",
                      "Monitors"
                    ]
                  }, void 0, !0, void 0, this),
                  " (",
                  mcpMonitors.length,
                  ")"
                ]
              }, void 0, !0, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ThemedBox_default, {
                flexDirection: "column",
                children: mcpMonitors.map((item_7) => /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(Item, {
                  item: item_7,
                  isSelected: item_7.id === currentSelection?.id
                }, item_7.id, !1, void 0, this))
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          remoteSessions.length > 0 && /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            marginTop: teammateTasks.length > 0 || bashTasks.length > 0 || mcpMonitors.length > 0 ? 1 : 0,
            children: [
              /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ThemedText, {
                dimColor: !0,
                children: [
                  /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ThemedText, {
                    bold: !0,
                    children: [
                      "  ",
                      "Remote agents"
                    ]
                  }, void 0, !0, void 0, this),
                  " (",
                  remoteSessions.length,
                  ")"
                ]
              }, void 0, !0, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ThemedBox_default, {
                flexDirection: "column",
                children: remoteSessions.map((item_8) => /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(Item, {
                  item: item_8,
                  isSelected: item_8.id === currentSelection?.id
                }, item_8.id, !1, void 0, this))
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          agentTasks.length > 0 && /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            marginTop: teammateTasks.length > 0 || bashTasks.length > 0 || mcpMonitors.length > 0 || remoteSessions.length > 0 ? 1 : 0,
            children: [
              /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ThemedText, {
                dimColor: !0,
                children: [
                  /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ThemedText, {
                    bold: !0,
                    children: [
                      "  ",
                      "Local agents"
                    ]
                  }, void 0, !0, void 0, this),
                  " (",
                  agentTasks.length,
                  ")"
                ]
              }, void 0, !0, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ThemedBox_default, {
                flexDirection: "column",
                children: agentTasks.map((item_9) => /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(Item, {
                  item: item_9,
                  isSelected: item_9.id === currentSelection?.id
                }, item_9.id, !1, void 0, this))
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          workflowTasks.length > 0 && /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            marginTop: teammateTasks.length > 0 || bashTasks.length > 0 || mcpMonitors.length > 0 || remoteSessions.length > 0 || agentTasks.length > 0 ? 1 : 0,
            children: [
              /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ThemedText, {
                dimColor: !0,
                children: [
                  /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ThemedText, {
                    bold: !0,
                    children: [
                      "  ",
                      "Workflows"
                    ]
                  }, void 0, !0, void 0, this),
                  " (",
                  workflowTasks.length,
                  ")"
                ]
              }, void 0, !0, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ThemedBox_default, {
                flexDirection: "column",
                children: workflowTasks.map((item_10) => /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(Item, {
                  item: item_10,
                  isSelected: item_10.id === currentSelection?.id
                }, item_10.id, !1, void 0, this))
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          dreamTasks_0.length > 0 && /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            marginTop: teammateTasks.length > 0 || bashTasks.length > 0 || mcpMonitors.length > 0 || remoteSessions.length > 0 || agentTasks.length > 0 || workflowTasks.length > 0 ? 1 : 0,
            children: /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ThemedBox_default, {
              flexDirection: "column",
              children: dreamTasks_0.map((item_11) => /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(Item, {
                item: item_11,
                isSelected: item_11.id === currentSelection?.id
              }, item_11.id, !1, void 0, this))
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this)
  }, void 0, !1, void 0, this);
}
