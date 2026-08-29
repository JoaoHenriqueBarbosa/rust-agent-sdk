// Original: src/tools/SendMessageTool/SendMessageTool.ts
var exports_SendMessageTool = {};
__export(exports_SendMessageTool, {
  SendMessageTool: () => SendMessageTool
});
function findTeammateColor(appState, name3) {
  let teammates = appState.teamContext?.teammates;
  if (!teammates)
    return;
  for (let teammate of Object.values(teammates))
    if ("name" in teammate && teammate.name === name3)
      return teammate.color;
  return;
}
async function handleMessage(recipientName, content, summary, context6) {
  let appState = context6.getAppState(), teamName = getTeamName(appState.teamContext), senderName = getAgentName() || (isTeammate() ? "teammate" : TEAM_LEAD_NAME), senderColor = getTeammateColor();
  await writeToMailbox(recipientName, {
    from: senderName,
    text: content,
    summary,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    color: senderColor
  }, teamName);
  let recipientColor = findTeammateColor(appState, recipientName);
  return {
    data: {
      success: !0,
      message: `Message sent to ${recipientName}'s inbox`,
      routing: {
        sender: senderName,
        senderColor,
        target: `@${recipientName}`,
        targetColor: recipientColor,
        summary,
        content
      }
    }
  };
}
async function handleBroadcast(content, summary, context6) {
  let appState = context6.getAppState(), teamName = getTeamName(appState.teamContext);
  if (!teamName)
    throw Error("Not in a team context. Create a team with Teammate spawnTeam first, or set CLAUDE_CODE_TEAM_NAME.");
  let teamFile = await readTeamFileAsync(teamName);
  if (!teamFile)
    throw Error(`Team "${teamName}" does not exist`);
  let senderName = getAgentName() || (isTeammate() ? "teammate" : TEAM_LEAD_NAME);
  if (!senderName)
    throw Error("Cannot broadcast: sender name is required. Set CLAUDE_CODE_AGENT_NAME.");
  let senderColor = getTeammateColor(), recipients = [];
  for (let member of teamFile.members) {
    if (member.name.toLowerCase() === senderName.toLowerCase())
      continue;
    recipients.push(member.name);
  }
  if (recipients.length === 0)
    return {
      data: {
        success: !0,
        message: "No teammates to broadcast to (you are the only team member)",
        recipients: []
      }
    };
  for (let recipientName of recipients)
    await writeToMailbox(recipientName, {
      from: senderName,
      text: content,
      summary,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      color: senderColor
    }, teamName);
  return {
    data: {
      success: !0,
      message: `Message broadcast to ${recipients.length} teammate(s): ${recipients.join(", ")}`,
      recipients,
      routing: {
        sender: senderName,
        senderColor,
        target: "@team",
        summary,
        content
      }
    }
  };
}
async function handleShutdownRequest(targetName, reason, context6) {
  let appState = context6.getAppState(), teamName = getTeamName(appState.teamContext), senderName = getAgentName() || TEAM_LEAD_NAME, requestId = generateRequestId("shutdown", targetName), shutdownMessage = createShutdownRequestMessage({
    requestId,
    from: senderName,
    reason
  });
  return await writeToMailbox(targetName, {
    from: senderName,
    text: jsonStringify(shutdownMessage),
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    color: getTeammateColor()
  }, teamName), {
    data: {
      success: !0,
      message: `Shutdown request sent to ${targetName}. Request ID: ${requestId}`,
      request_id: requestId,
      target: targetName
    }
  };
}
async function handleShutdownApproval(requestId, context6) {
  let teamName = getTeamName(), agentId = getAgentId(), agentName = getAgentName() || "teammate";
  logForDebugging(`[SendMessageTool] handleShutdownApproval: teamName=${teamName}, agentId=${agentId}, agentName=${agentName}`);
  let ownPaneId, ownBackendType;
  if (teamName) {
    let teamFile = await readTeamFileAsync(teamName);
    if (teamFile && agentId) {
      let selfMember = teamFile.members.find((m4) => m4.agentId === agentId);
      if (selfMember)
        ownPaneId = selfMember.tmuxPaneId, ownBackendType = selfMember.backendType;
    }
  }
  let approvedMessage = createShutdownApprovedMessage({
    requestId,
    from: agentName,
    paneId: ownPaneId,
    backendType: ownBackendType
  });
  if (await writeToMailbox(TEAM_LEAD_NAME, {
    from: agentName,
    text: jsonStringify(approvedMessage),
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    color: getTeammateColor()
  }, teamName), ownBackendType === "in-process") {
    if (logForDebugging(`[SendMessageTool] In-process teammate ${agentName} approving shutdown - signaling abort`), agentId) {
      let appState = context6.getAppState(), task = findTeammateTaskByAgentId(agentId, appState.tasks);
      if (task?.abortController)
        task.abortController.abort(), logForDebugging(`[SendMessageTool] Aborted controller for in-process teammate ${agentName}`);
      else
        logForDebugging(`[SendMessageTool] Warning: Could not find task/abortController for ${agentName}`);
    }
  } else {
    if (agentId) {
      let appState = context6.getAppState(), task = findTeammateTaskByAgentId(agentId, appState.tasks);
      if (task?.abortController)
        return logForDebugging(`[SendMessageTool] Fallback: Found in-process task for ${agentName} via AppState, aborting`), task.abortController.abort(), {
          data: {
            success: !0,
            message: `Shutdown approved (fallback path). Agent ${agentName} is now exiting.`,
            request_id: requestId
          }
        };
    }
    setImmediate(async () => {
      await gracefulShutdown(0, "other");
    });
  }
  return {
    data: {
      success: !0,
      message: `Shutdown approved. Sent confirmation to team-lead. Agent ${agentName} is now exiting.`,
      request_id: requestId
    }
  };
}
async function handleShutdownRejection(requestId, reason) {
  let teamName = getTeamName(), agentName = getAgentName() || "teammate", rejectedMessage = createShutdownRejectedMessage({
    requestId,
    from: agentName,
    reason
  });
  return await writeToMailbox(TEAM_LEAD_NAME, {
    from: agentName,
    text: jsonStringify(rejectedMessage),
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    color: getTeammateColor()
  }, teamName), {
    data: {
      success: !0,
      message: `Shutdown rejected. Reason: "${reason}". Continuing to work.`,
      request_id: requestId
    }
  };
}
async function handlePlanApproval(recipientName, requestId, context6) {
  let appState = context6.getAppState(), teamName = appState.teamContext?.teamName;
  if (!isTeamLead(appState.teamContext))
    throw Error("Only the team lead can approve plans. Teammates cannot approve their own or other plans.");
  let leaderMode = appState.toolPermissionContext.mode, modeToInherit = leaderMode === "plan" ? "default" : leaderMode, approvalResponse = {
    type: "plan_approval_response",
    requestId,
    approved: !0,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    permissionMode: modeToInherit
  };
  return await writeToMailbox(recipientName, {
    from: TEAM_LEAD_NAME,
    text: jsonStringify(approvalResponse),
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  }, teamName), {
    data: {
      success: !0,
      message: `Plan approved for ${recipientName}. They will receive the approval and can proceed with implementation.`,
      request_id: requestId
    }
  };
}
async function handlePlanRejection(recipientName, requestId, feedback, context6) {
  let appState = context6.getAppState(), teamName = appState.teamContext?.teamName;
  if (!isTeamLead(appState.teamContext))
    throw Error("Only the team lead can reject plans. Teammates cannot reject their own or other plans.");
  let rejectionResponse = {
    type: "plan_approval_response",
    requestId,
    approved: !1,
    feedback,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
  return await writeToMailbox(recipientName, {
    from: TEAM_LEAD_NAME,
    text: jsonStringify(rejectionResponse),
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  }, teamName), {
    data: {
      success: !0,
      message: `Plan rejected for ${recipientName} with feedback: "${feedback}"`,
      request_id: requestId
    }
  };
}
var StructuredMessage, inputSchema37, SendMessageTool;
var init_SendMessageTool = __esm(() => {
  init_v4();
  init_Tool();
  init_InProcessTeammateTask();
  init_LocalAgentTask();
  init_LocalMainSessionTask();
  init_ids();
  init_agentSwarmsEnabled();
  init_debug();
  init_errors();
  init_gracefulShutdown();
  init_semanticBoolean();
  init_slowOperations();
  init_teamHelpers();
  init_teammate();
  init_teammateMailbox();
  init_resumeAgent();
  init_UI24();
  StructuredMessage = lazySchema(() => exports_external.discriminatedUnion("type", [
    exports_external.object({
      type: exports_external.literal("shutdown_request"),
      reason: exports_external.string().optional()
    }),
    exports_external.object({
      type: exports_external.literal("shutdown_response"),
      request_id: exports_external.string(),
      approve: semanticBoolean(),
      reason: exports_external.string().optional()
    }),
    exports_external.object({
      type: exports_external.literal("plan_approval_response"),
      request_id: exports_external.string(),
      approve: semanticBoolean(),
      feedback: exports_external.string().optional()
    })
  ])), inputSchema37 = lazySchema(() => exports_external.object({
    to: exports_external.string().describe('Recipient: teammate name, or "*" for broadcast to all teammates'),
    summary: exports_external.string().optional().describe("A 5-10 word summary shown as a preview in the UI (required when message is a string)"),
    message: exports_external.union([
      exports_external.string().describe("Plain text message content"),
      StructuredMessage()
    ])
  }));
  SendMessageTool = buildTool({
    name: SEND_MESSAGE_TOOL_NAME,
    searchHint: "send messages to agent teammates (swarm protocol)",
    maxResultSizeChars: 1e5,
    userFacingName() {
      return "SendMessage";
    },
    get inputSchema() {
      return inputSchema37();
    },
    shouldDefer: !0,
    isEnabled() {
      return isAgentSwarmsEnabled();
    },
    isReadOnly(input) {
      return typeof input.message === "string";
    },
    backfillObservableInput(input) {
      if ("type" in input)
        return;
      if (typeof input.to !== "string")
        return;
      if (input.to === "*") {
        if (input.type = "broadcast", typeof input.message === "string")
          input.content = input.message;
      } else if (typeof input.message === "string")
        input.type = "message", input.recipient = input.to, input.content = input.message;
      else if (typeof input.message === "object" && input.message !== null) {
        let msg = input.message;
        if (input.type = msg.type, input.recipient = input.to, msg.request_id !== void 0)
          input.request_id = msg.request_id;
        if (msg.approve !== void 0)
          input.approve = msg.approve;
        let content = msg.reason ?? msg.feedback;
        if (content !== void 0)
          input.content = content;
      }
    },
    toAutoClassifierInput(input) {
      if (typeof input.message === "string")
        return `to ${input.to}: ${input.message}`;
      switch (input.message.type) {
        case "shutdown_request":
          return `shutdown_request to ${input.to}`;
        case "shutdown_response":
          return `shutdown_response ${input.message.approve ? "approve" : "reject"} ${input.message.request_id}`;
        case "plan_approval_response":
          return `plan_approval ${input.message.approve ? "approve" : "reject"} to ${input.to}`;
      }
    },
    async checkPermissions(input, _context) {
      if (parseAddress(input.to).scheme === "bridge")
        return {
          behavior: "ask",
          message: `Send a message to Remote Control session ${input.to}? It arrives as a user prompt on the receiving Claude (possibly another machine) via Anthropic's servers.`,
          decisionReason: {
            type: "safetyCheck",
            reason: "Cross-machine bridge message requires explicit user consent",
            classifierApprovable: !1
          }
        };
      return { behavior: "allow", updatedInput: input };
    },
    async validateInput(input, _context) {
      if (input.to.trim().length === 0)
        return {
          result: !1,
          message: "to must not be empty",
          errorCode: 9
        };
      let addr = parseAddress(input.to);
      if ((addr.scheme === "bridge" || addr.scheme === "uds") && addr.target.trim().length === 0)
        return {
          result: !1,
          message: "address target must not be empty",
          errorCode: 9
        };
      if (input.to.includes("@"))
        return {
          result: !1,
          message: 'to must be a bare teammate name or "*" \u2014 there is only one team per session',
          errorCode: 9
        };
      if (parseAddress(input.to).scheme === "bridge") {
        if (typeof input.message !== "string")
          return {
            result: !1,
            message: "structured messages cannot be sent cross-session \u2014 only plain text",
            errorCode: 9
          };
        return {
          result: !1,
          message: "Remote Control is not available in this build.",
          errorCode: 9
        };
      }
      if (typeof input.message === "string") {
        if (!input.summary || input.summary.trim().length === 0)
          return {
            result: !1,
            message: "summary is required when message is a string",
            errorCode: 9
          };
        return { result: !0 };
      }
      if (input.to === "*")
        return {
          result: !1,
          message: 'structured messages cannot be broadcast (to: "*")',
          errorCode: 9
        };
      if (input.message.type === "shutdown_response" && input.to !== TEAM_LEAD_NAME)
        return {
          result: !1,
          message: `shutdown_response must be sent to "${TEAM_LEAD_NAME}"`,
          errorCode: 9
        };
      if (input.message.type === "shutdown_response" && !input.message.approve && (!input.message.reason || input.message.reason.trim().length === 0))
        return {
          result: !1,
          message: "reason is required when rejecting a shutdown request",
          errorCode: 9
        };
      return { result: !0 };
    },
    async description() {
      return DESCRIPTION18;
    },
    async prompt() {
      return getPrompt8();
    },
    mapToolResultToToolResultBlockParam(data, toolUseID) {
      return {
        tool_use_id: toolUseID,
        type: "tool_result",
        content: [
          {
            type: "text",
            text: jsonStringify(data)
          }
        ]
      };
    },
    async call(input, context6, canUseTool, assistantMessage) {
      if (typeof input.message === "string" && input.to !== "*") {
        let appState = context6.getAppState(), agentId = appState.agentNameRegistry.get(input.to) ?? toAgentId(input.to);
        if (agentId) {
          let task = appState.tasks[agentId];
          if (isLocalAgentTask(task) && !isMainSessionTask(task)) {
            if (task.status === "running")
              return queuePendingMessage(agentId, input.message, context6.setAppStateForTasks ?? context6.setAppState), {
                data: {
                  success: !0,
                  message: `Message queued for delivery to ${input.to} at its next tool round.`
                }
              };
            try {
              let result = await resumeAgentBackground({
                agentId,
                prompt: input.message,
                toolUseContext: context6,
                canUseTool,
                invokingRequestId: assistantMessage?.requestId
              });
              return {
                data: {
                  success: !0,
                  message: `Agent "${input.to}" was stopped (${task.status}); resumed it in the background with your message. You'll be notified when it finishes. Output: ${result.outputFile}`
                }
              };
            } catch (e) {
              return {
                data: {
                  success: !1,
                  message: `Agent "${input.to}" is stopped (${task.status}) and could not be resumed: ${errorMessage(e)}`
                }
              };
            }
          } else
            try {
              let result = await resumeAgentBackground({
                agentId,
                prompt: input.message,
                toolUseContext: context6,
                canUseTool,
                invokingRequestId: assistantMessage?.requestId
              });
              return {
                data: {
                  success: !0,
                  message: `Agent "${input.to}" had no active task; resumed from transcript in the background with your message. You'll be notified when it finishes. Output: ${result.outputFile}`
                }
              };
            } catch (e) {
              return {
                data: {
                  success: !1,
                  message: `Agent "${input.to}" is registered but has no transcript to resume. It may have been cleaned up. (${errorMessage(e)})`
                }
              };
            }
        }
      }
      if (typeof input.message === "string") {
        if (input.to === "*")
          return handleBroadcast(input.message, input.summary, context6);
        return handleMessage(input.to, input.message, input.summary, context6);
      }
      if (input.to === "*")
        throw Error("structured messages cannot be broadcast");
      switch (input.message.type) {
        case "shutdown_request":
          return handleShutdownRequest(input.to, input.message.reason, context6);
        case "shutdown_response":
          if (input.message.approve)
            return handleShutdownApproval(input.message.request_id, context6);
          return handleShutdownRejection(input.message.request_id, input.message.reason);
        case "plan_approval_response":
          if (input.message.approve)
            return handlePlanApproval(input.to, input.message.request_id, context6);
          return handlePlanRejection(input.to, input.message.request_id, input.message.feedback ?? "Plan needs revision", context6);
      }
    },
    renderToolUseMessage: renderToolUseMessage26,
    renderToolResultMessage: renderToolResultMessage24
  });
});
