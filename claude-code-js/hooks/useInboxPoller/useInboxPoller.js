// function: useInboxPoller
function useInboxPoller({
  enabled: enabled2,
  isLoading,
  focusedInputDialog,
  onSubmitMessage
}) {
  let onSubmitTeammateMessage = onSubmitMessage, store = useAppStateStore(), setAppState = useSetAppState(), inboxMessageCount = useAppState((s2) => s2.inbox.messages.length), terminal = useTerminalNotification(), poll = import_react276.useCallback(async () => {
    if (!enabled2)
      return;
    let currentAppState = store.getState(), agentName = getAgentNameToPoll(currentAppState);
    if (!agentName)
      return;
    let unread = await readUnreadMessages(agentName, currentAppState.teamContext?.teamName);
    if (unread.length === 0)
      return;
    if (logForDebugging(`[InboxPoller] Found ${unread.length} unread message(s)`), isTeammate() && isPlanModeRequired())
      for (let msg of unread) {
        let approvalResponse = isPlanApprovalResponse(msg.text);
        if (approvalResponse && msg.from === "team-lead")
          if (logForDebugging(`[InboxPoller] Received plan approval response from team-lead: approved=${approvalResponse.approved}`), approvalResponse.approved) {
            let targetMode = approvalResponse.permissionMode ?? "default";
            setAppState((prev) => ({
              ...prev,
              toolPermissionContext: applyPermissionUpdate(prev.toolPermissionContext, {
                type: "setMode",
                mode: toExternalPermissionMode(targetMode),
                destination: "session"
              })
            })), logForDebugging(`[InboxPoller] Plan approved by team lead, exited plan mode to ${targetMode}`);
          } else
            logForDebugging(`[InboxPoller] Plan rejected by team lead: ${approvalResponse.feedback || "No feedback provided"}`);
        else if (approvalResponse)
          logForDebugging(`[InboxPoller] Ignoring plan approval response from non-team-lead: ${msg.from}`);
      }
    let markRead = () => {
      markMessagesAsRead(agentName, currentAppState.teamContext?.teamName);
    }, permissionRequests = [], permissionResponses = [], sandboxPermissionRequests = [], sandboxPermissionResponses = [], shutdownRequests = [], shutdownApprovals = [], teamPermissionUpdates = [], modeSetRequests = [], planApprovalRequests = [], regularMessages = [];
    for (let m4 of unread) {
      let permReq = isPermissionRequest(m4.text), permResp = isPermissionResponse(m4.text), sandboxReq = isSandboxPermissionRequest(m4.text), sandboxResp = isSandboxPermissionResponse(m4.text), shutdownReq = isShutdownRequest(m4.text), shutdownApproval = isShutdownApproved(m4.text), teamPermUpdate = isTeamPermissionUpdate(m4.text), modeSetReq = isModeSetRequest(m4.text), planApprovalReq = isPlanApprovalRequest(m4.text);
      if (permReq)
        permissionRequests.push(m4);
      else if (permResp)
        permissionResponses.push(m4);
      else if (sandboxReq)
        sandboxPermissionRequests.push(m4);
      else if (sandboxResp)
        sandboxPermissionResponses.push(m4);
      else if (shutdownReq)
        shutdownRequests.push(m4);
      else if (shutdownApproval)
        shutdownApprovals.push(m4);
      else if (teamPermUpdate)
        teamPermissionUpdates.push(m4);
      else if (modeSetReq)
        modeSetRequests.push(m4);
      else if (planApprovalReq)
        planApprovalRequests.push(m4);
      else
        regularMessages.push(m4);
    }
    if (permissionRequests.length > 0 && isTeamLead(currentAppState.teamContext)) {
      logForDebugging(`[InboxPoller] Found ${permissionRequests.length} permission request(s)`);
      let setToolUseConfirmQueue = getLeaderToolUseConfirmQueue(), teamName = currentAppState.teamContext?.teamName;
      for (let m4 of permissionRequests) {
        let parsed = isPermissionRequest(m4.text);
        if (!parsed)
          continue;
        if (setToolUseConfirmQueue) {
          let tool = findToolByName(getAllBaseTools(), parsed.tool_name);
          if (!tool) {
            logForDebugging(`[InboxPoller] Unknown tool ${parsed.tool_name}, skipping permission request`);
            continue;
          }
          let entry = {
            assistantMessage: createAssistantMessage({ content: "" }),
            tool,
            description: parsed.description,
            input: parsed.input,
            toolUseContext: {},
            toolUseID: parsed.tool_use_id,
            permissionResult: {
              behavior: "ask",
              message: parsed.description
            },
            permissionPromptStartTimeMs: Date.now(),
            workerBadge: {
              name: parsed.agent_id,
              color: "cyan"
            },
            onUserInteraction() {},
            onAbort() {
              sendPermissionResponseViaMailbox(parsed.agent_id, { decision: "rejected", resolvedBy: "leader" }, parsed.request_id, teamName);
            },
            onAllow(updatedInput, permissionUpdates) {
              sendPermissionResponseViaMailbox(parsed.agent_id, {
                decision: "approved",
                resolvedBy: "leader",
                updatedInput,
                permissionUpdates
              }, parsed.request_id, teamName);
            },
            onReject(feedback2) {
              sendPermissionResponseViaMailbox(parsed.agent_id, {
                decision: "rejected",
                resolvedBy: "leader",
                feedback: feedback2
              }, parsed.request_id, teamName);
            },
            async recheckPermission() {}
          };
          setToolUseConfirmQueue((queue2) => {
            if (queue2.some((q4) => q4.toolUseID === parsed.tool_use_id))
              return queue2;
            return [...queue2, entry];
          });
        } else
          logForDebugging(`[InboxPoller] ToolUseConfirmQueue unavailable, dropping permission request from ${parsed.agent_id}`);
      }
      let firstParsed = isPermissionRequest(permissionRequests[0]?.text ?? "");
      if (firstParsed && !isLoading && !focusedInputDialog)
        sendNotification({
          message: `${firstParsed.agent_id} needs permission for ${firstParsed.tool_name}`,
          notificationType: "worker_permission_prompt"
        }, terminal);
    }
    if (permissionResponses.length > 0 && isTeammate()) {
      logForDebugging(`[InboxPoller] Found ${permissionResponses.length} permission response(s)`);
      for (let m4 of permissionResponses) {
        let parsed = isPermissionResponse(m4.text);
        if (!parsed)
          continue;
        if (hasPermissionCallback(parsed.request_id))
          if (logForDebugging(`[InboxPoller] Processing permission response for ${parsed.request_id}: ${parsed.subtype}`), parsed.subtype === "success")
            processMailboxPermissionResponse({
              requestId: parsed.request_id,
              decision: "approved",
              updatedInput: parsed.response?.updated_input,
              permissionUpdates: parsed.response?.permission_updates
            });
          else
            processMailboxPermissionResponse({
              requestId: parsed.request_id,
              decision: "rejected",
              feedback: parsed.error
            });
      }
    }
    if (sandboxPermissionRequests.length > 0 && isTeamLead(currentAppState.teamContext)) {
      logForDebugging(`[InboxPoller] Found ${sandboxPermissionRequests.length} sandbox permission request(s)`);
      let newSandboxRequests = [];
      for (let m4 of sandboxPermissionRequests) {
        let parsed = isSandboxPermissionRequest(m4.text);
        if (!parsed)
          continue;
        if (!parsed.hostPattern?.host) {
          logForDebugging("[InboxPoller] Invalid sandbox permission request: missing hostPattern.host");
          continue;
        }
        newSandboxRequests.push({
          requestId: parsed.requestId,
          workerId: parsed.workerId,
          workerName: parsed.workerName,
          workerColor: parsed.workerColor,
          host: parsed.hostPattern.host,
          createdAt: parsed.createdAt
        });
      }
      if (newSandboxRequests.length > 0) {
        setAppState((prev) => ({
          ...prev,
          workerSandboxPermissions: {
            ...prev.workerSandboxPermissions,
            queue: [
              ...prev.workerSandboxPermissions.queue,
              ...newSandboxRequests
            ]
          }
        }));
        let firstRequest = newSandboxRequests[0];
        if (firstRequest && !isLoading && !focusedInputDialog)
          sendNotification({
            message: `${firstRequest.workerName} needs network access to ${firstRequest.host}`,
            notificationType: "worker_permission_prompt"
          }, terminal);
      }
    }
    if (sandboxPermissionResponses.length > 0 && isTeammate()) {
      logForDebugging(`[InboxPoller] Found ${sandboxPermissionResponses.length} sandbox permission response(s)`);
      for (let m4 of sandboxPermissionResponses) {
        let parsed = isSandboxPermissionResponse(m4.text);
        if (!parsed)
          continue;
        if (hasSandboxPermissionCallback(parsed.requestId))
          logForDebugging(`[InboxPoller] Processing sandbox permission response for ${parsed.requestId}: allow=${parsed.allow}`), processSandboxPermissionResponse({
            requestId: parsed.requestId,
            host: parsed.host,
            allow: parsed.allow
          }), setAppState((prev) => ({
            ...prev,
            pendingSandboxRequest: null
          }));
      }
    }
    if (teamPermissionUpdates.length > 0 && isTeammate()) {
      logForDebugging(`[InboxPoller] Found ${teamPermissionUpdates.length} team permission update(s)`);
      for (let m4 of teamPermissionUpdates) {
        let parsed = isTeamPermissionUpdate(m4.text);
        if (!parsed) {
          logForDebugging(`[InboxPoller] Failed to parse team permission update: ${m4.text.substring(0, 100)}`);
          continue;
        }
        if (!parsed.permissionUpdate?.rules || !parsed.permissionUpdate?.behavior) {
          logForDebugging("[InboxPoller] Invalid team permission update: missing permissionUpdate.rules or permissionUpdate.behavior");
          continue;
        }
        logForDebugging(`[InboxPoller] Applying team permission update: ${parsed.toolName} allowed in ${parsed.directoryPath}`), logForDebugging(`[InboxPoller] Permission update rules: ${jsonStringify(parsed.permissionUpdate.rules)}`), setAppState((prev) => {
          let updated = applyPermissionUpdate(prev.toolPermissionContext, {
            type: "addRules",
            rules: parsed.permissionUpdate.rules,
            behavior: parsed.permissionUpdate.behavior,
            destination: "session"
          });
          return logForDebugging(`[InboxPoller] Updated session allow rules: ${jsonStringify(updated.alwaysAllowRules.session)}`), {
            ...prev,
            toolPermissionContext: updated
          };
        });
      }
    }
    if (modeSetRequests.length > 0 && isTeammate()) {
      logForDebugging(`[InboxPoller] Found ${modeSetRequests.length} mode set request(s)`);
      for (let m4 of modeSetRequests) {
        if (m4.from !== "team-lead") {
          logForDebugging(`[InboxPoller] Ignoring mode set request from non-team-lead: ${m4.from}`);
          continue;
        }
        let parsed = isModeSetRequest(m4.text);
        if (!parsed) {
          logForDebugging(`[InboxPoller] Failed to parse mode set request: ${m4.text.substring(0, 100)}`);
          continue;
        }
        let targetMode = permissionModeFromString(parsed.mode);
        logForDebugging(`[InboxPoller] Applying mode change from team-lead: ${targetMode}`), setAppState((prev) => ({
          ...prev,
          toolPermissionContext: applyPermissionUpdate(prev.toolPermissionContext, {
            type: "setMode",
            mode: toExternalPermissionMode(targetMode),
            destination: "session"
          })
        }));
        let teamName = currentAppState.teamContext?.teamName, agentName2 = getAgentName();
        if (teamName && agentName2)
          setMemberMode(teamName, agentName2, targetMode);
      }
    }
    if (planApprovalRequests.length > 0 && isTeamLead(currentAppState.teamContext)) {
      logForDebugging(`[InboxPoller] Found ${planApprovalRequests.length} plan approval request(s), auto-approving`);
      let teamName = currentAppState.teamContext?.teamName, leaderExternalMode = toExternalPermissionMode(currentAppState.toolPermissionContext.mode), modeToInherit = leaderExternalMode === "plan" ? "default" : leaderExternalMode;
      for (let m4 of planApprovalRequests) {
        let parsed = isPlanApprovalRequest(m4.text);
        if (!parsed)
          continue;
        let approvalResponse = {
          type: "plan_approval_response",
          requestId: parsed.requestId,
          approved: !0,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          permissionMode: modeToInherit
        };
        writeToMailbox(m4.from, {
          from: TEAM_LEAD_NAME,
          text: jsonStringify(approvalResponse),
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }, teamName);
        let taskId = findInProcessTeammateTaskId(m4.from, currentAppState);
        if (taskId)
          handlePlanApprovalResponse(taskId, {
            type: "plan_approval_response",
            requestId: parsed.requestId,
            approved: !0,
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            permissionMode: modeToInherit
          }, setAppState);
        logForDebugging(`[InboxPoller] Auto-approved plan from ${m4.from} (request ${parsed.requestId})`), regularMessages.push(m4);
      }
    }
    if (shutdownRequests.length > 0 && isTeammate()) {
      logForDebugging(`[InboxPoller] Found ${shutdownRequests.length} shutdown request(s)`);
      for (let m4 of shutdownRequests)
        regularMessages.push(m4);
    }
    if (shutdownApprovals.length > 0 && isTeamLead(currentAppState.teamContext)) {
      logForDebugging(`[InboxPoller] Found ${shutdownApprovals.length} shutdown approval(s)`);
      for (let m4 of shutdownApprovals) {
        let parsed = isShutdownApproved(m4.text);
        if (!parsed)
          continue;
        if (parsed.paneId && parsed.backendType)
          (async () => {
            try {
              await ensureBackendsRegistered();
              let insideTmux = await isInsideTmux(), success2 = await getBackendByType(parsed.backendType)?.killPane(parsed.paneId, !insideTmux);
              logForDebugging(`[InboxPoller] Killed pane ${parsed.paneId} for ${parsed.from}: ${success2}`);
            } catch (error44) {
              logForDebugging(`[InboxPoller] Failed to kill pane for ${parsed.from}: ${error44}`);
            }
          })();
        let teammateToRemove = parsed.from;
        if (teammateToRemove && currentAppState.teamContext?.teammates) {
          let teammateId = Object.entries(currentAppState.teamContext.teammates).find(([, t2]) => t2.name === teammateToRemove)?.[0];
          if (teammateId) {
            let teamName = currentAppState.teamContext?.teamName;
            if (teamName)
              removeTeammateFromTeamFile(teamName, {
                agentId: teammateId,
                name: teammateToRemove
              });
            let { notificationMessage } = teamName ? await unassignTeammateTasks(teamName, teammateId, teammateToRemove, "shutdown") : { notificationMessage: `${teammateToRemove} has shut down.` };
            setAppState((prev) => {
              if (!prev.teamContext?.teammates)
                return prev;
              if (!(teammateId in prev.teamContext.teammates))
                return prev;
              let { [teammateId]: _, ...remainingTeammates } = prev.teamContext.teammates, updatedTasks = { ...prev.tasks };
              for (let [tid, task] of Object.entries(updatedTasks))
                if (isInProcessTeammateTask(task) && task.identity.agentId === teammateId)
                  updatedTasks[tid] = {
                    ...task,
                    status: "completed",
                    endTime: Date.now()
                  };
              return {
                ...prev,
                tasks: updatedTasks,
                teamContext: {
                  ...prev.teamContext,
                  teammates: remainingTeammates
                },
                inbox: {
                  messages: [
                    ...prev.inbox.messages,
                    {
                      id: randomUUID41(),
                      from: "system",
                      text: jsonStringify({
                        type: "teammate_terminated",
                        message: notificationMessage
                      }),
                      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
                      status: "pending"
                    }
                  ]
                }
              };
            }), logForDebugging(`[InboxPoller] Removed ${teammateToRemove} (${teammateId}) from teamContext`);
          }
        }
        regularMessages.push(m4);
      }
    }
    if (regularMessages.length === 0) {
      markRead();
      return;
    }
    let formatted = regularMessages.map((m4) => {
      let colorAttr = m4.color ? ` color="${m4.color}"` : "", summaryAttr = m4.summary ? ` summary="${m4.summary}"` : "", messageContent = m4.text;
      return `<${TEAMMATE_MESSAGE_TAG} teammate_id="${m4.from}"${colorAttr}${summaryAttr}>
${messageContent}
</${TEAMMATE_MESSAGE_TAG}>`;
    }).join(`

`), queueMessages = () => {
      setAppState((prev) => ({
        ...prev,
        inbox: {
          messages: [
            ...prev.inbox.messages,
            ...regularMessages.map((m4) => ({
              id: randomUUID41(),
              from: m4.from,
              text: m4.text,
              timestamp: m4.timestamp,
              status: "pending",
              color: m4.color,
              summary: m4.summary
            }))
          ]
        }
      }));
    };
    if (!isLoading && !focusedInputDialog) {
      if (logForDebugging("[InboxPoller] Session idle, submitting immediately"), !onSubmitTeammateMessage(formatted))
        logForDebugging("[InboxPoller] Submission rejected, queuing for later delivery"), queueMessages();
    } else
      logForDebugging("[InboxPoller] Session busy, queuing for later delivery"), queueMessages();
    markRead();
  }, [
    enabled2,
    isLoading,
    focusedInputDialog,
    onSubmitTeammateMessage,
    setAppState,
    terminal,
    store
  ]);
  import_react276.useEffect(() => {
    if (!enabled2)
      return;
    if (isLoading || focusedInputDialog)
      return;
    let currentAppState = store.getState();
    if (!getAgentNameToPoll(currentAppState))
      return;
    let pendingMessages = currentAppState.inbox.messages.filter((m4) => m4.status === "pending"), processedMessages = currentAppState.inbox.messages.filter((m4) => m4.status === "processed");
    if (processedMessages.length > 0) {
      logForDebugging(`[InboxPoller] Cleaning up ${processedMessages.length} processed message(s) that were delivered mid-turn`);
      let processedIds = new Set(processedMessages.map((m4) => m4.id));
      setAppState((prev) => ({
        ...prev,
        inbox: {
          messages: prev.inbox.messages.filter((m4) => !processedIds.has(m4.id))
        }
      }));
    }
    if (pendingMessages.length === 0)
      return;
    logForDebugging(`[InboxPoller] Session idle, delivering ${pendingMessages.length} pending message(s)`);
    let formatted = pendingMessages.map((m4) => {
      let colorAttr = m4.color ? ` color="${m4.color}"` : "", summaryAttr = m4.summary ? ` summary="${m4.summary}"` : "";
      return `<${TEAMMATE_MESSAGE_TAG} teammate_id="${m4.from}"${colorAttr}${summaryAttr}>
${m4.text}
</${TEAMMATE_MESSAGE_TAG}>`;
    }).join(`

`);
    if (onSubmitTeammateMessage(formatted)) {
      let submittedIds = new Set(pendingMessages.map((m4) => m4.id));
      setAppState((prev) => ({
        ...prev,
        inbox: {
          messages: prev.inbox.messages.filter((m4) => !submittedIds.has(m4.id))
        }
      }));
    } else
      logForDebugging("[InboxPoller] Submission rejected, keeping messages queued");
  }, [
    enabled2,
    isLoading,
    focusedInputDialog,
    onSubmitTeammateMessage,
    setAppState,
    inboxMessageCount,
    store
  ]);
  let shouldPoll = enabled2 && !!getAgentNameToPoll(store.getState());
  useInterval(() => void poll(), shouldPoll ? INBOX_POLL_INTERVAL_MS : null);
  let hasDoneInitialPollRef = import_react276.useRef(!1);
  import_react276.useEffect(() => {
    if (!enabled2)
      return;
    if (hasDoneInitialPollRef.current)
      return;
    if (getAgentNameToPoll(store.getState()))
      hasDoneInitialPollRef.current = !0, poll();
  }, [enabled2, poll, store]);
}
