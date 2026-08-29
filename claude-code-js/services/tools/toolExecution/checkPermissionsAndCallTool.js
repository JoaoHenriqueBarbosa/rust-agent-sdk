// function: checkPermissionsAndCallTool
async function checkPermissionsAndCallTool(tool, toolUseID, input, toolUseContext, canUseTool, assistantMessage, messageId, requestId, mcpServerType, mcpServerBaseUrl, onToolProgress) {
  let parsedInput = tool.inputSchema.safeParse(input);
  if (!parsedInput.success) {
    let errorContent = formatZodValidationError(tool.name, parsedInput.error), schemaHint = buildSchemaNotSentHint(tool, toolUseContext.messages, toolUseContext.options.tools);
    if (schemaHint)
      logEvent("tengu_deferred_tool_schema_not_sent", {
        toolName: sanitizeToolNameForAnalytics(tool.name),
        isMcp: tool.isMcp ?? !1
      }), errorContent += schemaHint;
    return logForDebugging(`${tool.name} tool input error: ${errorContent.slice(0, 200)}`), logEvent("tengu_tool_use_error", {
      error: "InputValidationError",
      errorDetails: errorContent.slice(0, 2000),
      messageID: messageId,
      toolName: sanitizeToolNameForAnalytics(tool.name),
      isMcp: tool.isMcp ?? !1,
      queryChainId: toolUseContext.queryTracking?.chainId,
      queryDepth: toolUseContext.queryTracking?.depth,
      ...mcpServerType && {
        mcpServerType
      },
      ...mcpServerBaseUrl && {
        mcpServerBaseUrl
      },
      ...requestId && {
        requestId
      },
      ...mcpToolDetailsForAnalytics(tool.name, mcpServerType, mcpServerBaseUrl)
    }), [
      {
        message: createUserMessage({
          content: [
            {
              type: "tool_result",
              content: `<tool_use_error>InputValidationError: ${errorContent}</tool_use_error>`,
              is_error: !0,
              tool_use_id: toolUseID
            }
          ],
          toolUseResult: `InputValidationError: ${parsedInput.error.message}`,
          sourceToolAssistantUUID: assistantMessage.uuid
        })
      }
    ];
  }
  let isValidCall = await tool.validateInput?.(parsedInput.data, toolUseContext);
  if (isValidCall?.result === !1)
    return logForDebugging(`${tool.name} tool validation error: ${isValidCall.message?.slice(0, 200)}`), logEvent("tengu_tool_use_error", {
      messageID: messageId,
      toolName: sanitizeToolNameForAnalytics(tool.name),
      error: isValidCall.message,
      errorCode: isValidCall.errorCode,
      isMcp: tool.isMcp ?? !1,
      queryChainId: toolUseContext.queryTracking?.chainId,
      queryDepth: toolUseContext.queryTracking?.depth,
      ...mcpServerType && {
        mcpServerType
      },
      ...mcpServerBaseUrl && {
        mcpServerBaseUrl
      },
      ...requestId && {
        requestId
      },
      ...mcpToolDetailsForAnalytics(tool.name, mcpServerType, mcpServerBaseUrl)
    }), [
      {
        message: createUserMessage({
          content: [
            {
              type: "tool_result",
              content: `<tool_use_error>${isValidCall.message}</tool_use_error>`,
              is_error: !0,
              tool_use_id: toolUseID
            }
          ],
          toolUseResult: `Error: ${isValidCall.message}`,
          sourceToolAssistantUUID: assistantMessage.uuid
        })
      }
    ];
  if (tool.name === BASH_TOOL_NAME && parsedInput.data && "command" in parsedInput.data) {
    let appState = toolUseContext.getAppState();
    startSpeculativeClassifierCheck(parsedInput.data.command, appState.toolPermissionContext, toolUseContext.abortController.signal, toolUseContext.options.isNonInteractiveSession);
  }
  let resultingMessages = [], processedInput = parsedInput.data;
  if (tool.name === BASH_TOOL_NAME && processedInput && typeof processedInput === "object" && "_simulatedSedEdit" in processedInput) {
    let { _simulatedSedEdit: _, ...rest } = processedInput;
    processedInput = rest;
  }
  let callInput = processedInput, backfilledClone = tool.backfillObservableInput && typeof processedInput === "object" && processedInput !== null ? { ...processedInput } : null;
  if (backfilledClone)
    tool.backfillObservableInput(backfilledClone), processedInput = backfilledClone;
  let shouldPreventContinuation = !1, stopReason, hookPermissionResult, preToolHookInfos = [], preToolHookStart = Date.now();
  for await (let result of runPreToolUseHooks(toolUseContext, tool, processedInput, toolUseID, assistantMessage.message.id, requestId, mcpServerType, mcpServerBaseUrl))
    switch (result.type) {
      case "message":
        if (result.message.message.type === "progress")
          onToolProgress(result.message.message);
        else {
          resultingMessages.push(result.message);
          let att = result.message.message.attachment;
          if (att && "command" in att && att.command !== void 0 && "durationMs" in att && att.durationMs !== void 0)
            preToolHookInfos.push({
              command: att.command,
              durationMs: att.durationMs
            });
        }
        break;
      case "hookPermissionResult":
        hookPermissionResult = result.hookPermissionResult;
        break;
      case "hookUpdatedInput":
        processedInput = result.updatedInput;
        break;
      case "preventContinuation":
        shouldPreventContinuation = result.shouldPreventContinuation;
        break;
      case "stopReason":
        stopReason = result.stopReason;
        break;
      case "additionalContext":
        resultingMessages.push(result.message);
        break;
      case "stop":
        return getStatsStore()?.observe("pre_tool_hook_duration_ms", Date.now() - preToolHookStart), resultingMessages.push({
          message: createUserMessage({
            content: [createToolResultStopMessage(toolUseID)],
            toolUseResult: `Error: ${stopReason}`,
            sourceToolAssistantUUID: assistantMessage.uuid
          })
        }), resultingMessages;
    }
  let preToolHookDurationMs = Date.now() - preToolHookStart;
  if (getStatsStore()?.observe("pre_tool_hook_duration_ms", preToolHookDurationMs), preToolHookDurationMs >= SLOW_PHASE_LOG_THRESHOLD_MS)
    logForDebugging(`Slow PreToolUse hooks: ${preToolHookDurationMs}ms for ${tool.name} (${preToolHookInfos.length} hooks)`, { level: "info" });
  let toolAttributes = {};
  if (processedInput && typeof processedInput === "object") {
    if (tool.name === FILE_READ_TOOL_NAME && "file_path" in processedInput)
      toolAttributes.file_path = String(processedInput.file_path);
    else if ((tool.name === FILE_EDIT_TOOL_NAME || tool.name === FILE_WRITE_TOOL_NAME) && "file_path" in processedInput)
      toolAttributes.file_path = String(processedInput.file_path);
    else if (tool.name === BASH_TOOL_NAME && "command" in processedInput) {
      let bashInput = processedInput;
      toolAttributes.full_command = bashInput.command;
    }
  }
  startToolSpan(tool.name, toolAttributes, isBetaTracingEnabled() ? jsonStringify(processedInput) : void 0), startToolBlockedOnUserSpan();
  let permissionMode = toolUseContext.getAppState().toolPermissionContext.mode, permissionStart = Date.now(), resolved = await resolveHookPermissionDecision(hookPermissionResult, tool, processedInput, toolUseContext, canUseTool, assistantMessage, toolUseID), permissionDecision = resolved.decision;
  processedInput = resolved.input;
  let permissionDurationMs = Date.now() - permissionStart;
  if (permissionDurationMs >= SLOW_PHASE_LOG_THRESHOLD_MS && permissionMode === "auto")
    logForDebugging(`Slow permission decision: ${permissionDurationMs}ms for ${tool.name} (mode=${permissionMode}, behavior=${permissionDecision.behavior})`, { level: "info" });
  if (permissionDecision.behavior !== "ask" && !toolUseContext.toolDecisions?.has(toolUseID)) {
    let decision = permissionDecision.behavior === "allow" ? "accept" : "reject", source = decisionReasonToOTelSource(permissionDecision.decisionReason, permissionDecision.behavior);
    if (logOTelEvent("tool_decision", {
      decision,
      source,
      tool_name: sanitizeToolNameForAnalytics(tool.name)
    }), isCodeEditingTool(tool.name))
      buildCodeEditToolAttributes(tool, processedInput, decision, source).then((attributes2) => getCodeEditToolDecisionCounter()?.add(1, attributes2));
  }
  if (permissionDecision.decisionReason?.type === "hook" && permissionDecision.decisionReason.hookName === "PermissionRequest" && permissionDecision.behavior !== "ask")
    resultingMessages.push({
      message: createAttachmentMessage({
        type: "hook_permission_decision",
        decision: permissionDecision.behavior,
        toolUseID,
        hookEvent: "PermissionRequest"
      })
    });
  if (permissionDecision.behavior !== "allow") {
    logForDebugging(`${tool.name} tool permission denied`);
    let decisionInfo2 = toolUseContext.toolDecisions?.get(toolUseID);
    endToolBlockedOnUserSpan("reject", decisionInfo2?.source || "unknown"), endToolSpan(), logEvent("tengu_tool_use_can_use_tool_rejected", {
      messageID: messageId,
      toolName: sanitizeToolNameForAnalytics(tool.name),
      queryChainId: toolUseContext.queryTracking?.chainId,
      queryDepth: toolUseContext.queryTracking?.depth,
      ...mcpServerType && {
        mcpServerType
      },
      ...mcpServerBaseUrl && {
        mcpServerBaseUrl
      },
      ...requestId && {
        requestId
      },
      ...mcpToolDetailsForAnalytics(tool.name, mcpServerType, mcpServerBaseUrl)
    });
    let errorMessage2 = permissionDecision.message;
    if (shouldPreventContinuation && !errorMessage2)
      errorMessage2 = `Execution stopped by PreToolUse hook${stopReason ? `: ${stopReason}` : ""}`;
    let messageContent = [
      {
        type: "tool_result",
        content: errorMessage2,
        is_error: !0,
        tool_use_id: toolUseID
      }
    ], rejectContentBlocks = permissionDecision.behavior === "ask" ? permissionDecision.contentBlocks : void 0;
    if (rejectContentBlocks?.length)
      messageContent.push(...rejectContentBlocks);
    let rejectImageIds;
    if (rejectContentBlocks?.length) {
      let imageCount = count2(rejectContentBlocks, (b) => b.type === "image");
      if (imageCount > 0) {
        let startId = getNextImagePasteId(toolUseContext.messages);
        rejectImageIds = Array.from({ length: imageCount }, (_, i5) => startId + i5);
      }
    }
    return resultingMessages.push({
      message: createUserMessage({
        content: messageContent,
        imagePasteIds: rejectImageIds,
        toolUseResult: `Error: ${errorMessage2}`,
        sourceToolAssistantUUID: assistantMessage.uuid
      })
    }), resultingMessages;
  }
  if (logEvent("tengu_tool_use_can_use_tool_allowed", {
    messageID: messageId,
    toolName: sanitizeToolNameForAnalytics(tool.name),
    queryChainId: toolUseContext.queryTracking?.chainId,
    queryDepth: toolUseContext.queryTracking?.depth,
    ...mcpServerType && {
      mcpServerType
    },
    ...mcpServerBaseUrl && {
      mcpServerBaseUrl
    },
    ...requestId && {
      requestId
    },
    ...mcpToolDetailsForAnalytics(tool.name, mcpServerType, mcpServerBaseUrl)
  }), permissionDecision.updatedInput !== void 0)
    processedInput = permissionDecision.updatedInput;
  let telemetryToolInput = extractToolInputForTelemetry(processedInput), toolParameters = {};
  if (isToolDetailsLoggingEnabled()) {
    if (tool.name === BASH_TOOL_NAME && "command" in processedInput) {
      let bashInput = processedInput;
      toolParameters = {
        bash_command: bashInput.command.trim().split(/\s+/)[0] || "",
        full_command: bashInput.command,
        ...bashInput.timeout !== void 0 && {
          timeout: bashInput.timeout
        },
        ...bashInput.description !== void 0 && {
          description: bashInput.description
        },
        ..."dangerouslyDisableSandbox" in bashInput && {
          dangerouslyDisableSandbox: bashInput.dangerouslyDisableSandbox
        }
      };
    }
    let mcpDetails = extractMcpToolDetails(tool.name);
    if (mcpDetails)
      toolParameters.mcp_server_name = mcpDetails.serverName, toolParameters.mcp_tool_name = mcpDetails.mcpToolName;
    let skillName = extractSkillName(tool.name, processedInput);
    if (skillName)
      toolParameters.skill_name = skillName;
  }
  let decisionInfo = toolUseContext.toolDecisions?.get(toolUseID);
  endToolBlockedOnUserSpan(decisionInfo?.decision || "unknown", decisionInfo?.source || "unknown"), startToolExecutionSpan();
  let startTime = Date.now();
  if (startSessionActivity("tool_exec"), backfilledClone && processedInput !== callInput && typeof processedInput === "object" && processedInput !== null && "file_path" in processedInput && "file_path" in callInput && processedInput.file_path === backfilledClone.file_path)
    callInput = {
      ...processedInput,
      file_path: callInput.file_path
    };
  else if (processedInput !== backfilledClone)
    callInput = processedInput;
  try {
    let result = await tool.call(callInput, {
      ...toolUseContext,
      toolUseId: toolUseID,
      userModified: permissionDecision.userModified ?? !1
    }, canUseTool, assistantMessage, (progress) => {
      onToolProgress({
        toolUseID: progress.toolUseID,
        data: progress.data
      });
    }), durationMs = Date.now() - startTime;
    if (addToToolDuration(durationMs), result.data && typeof result.data === "object") {
      let contentAttributes = {};
      if (tool.name === FILE_READ_TOOL_NAME && "content" in result.data) {
        if ("file_path" in processedInput)
          contentAttributes.file_path = String(processedInput.file_path);
        contentAttributes.content = String(result.data.content);
      }
      if ((tool.name === FILE_EDIT_TOOL_NAME || tool.name === FILE_WRITE_TOOL_NAME) && "file_path" in processedInput) {
        if (contentAttributes.file_path = String(processedInput.file_path), tool.name === FILE_EDIT_TOOL_NAME && "diff" in result.data)
          contentAttributes.diff = String(result.data.diff);
        if (tool.name === FILE_WRITE_TOOL_NAME && "content" in processedInput)
          contentAttributes.content = String(processedInput.content);
      }
      if (tool.name === BASH_TOOL_NAME && "command" in processedInput) {
        let bashInput = processedInput;
        if (contentAttributes.bash_command = bashInput.command, "output" in result.data)
          contentAttributes.output = String(result.data.output);
      }
      if (Object.keys(contentAttributes).length > 0)
        addToolContentEvent("tool.output", contentAttributes);
    }
    if (typeof result === "object" && "structured_output" in result)
      resultingMessages.push({
        message: createAttachmentMessage({
          type: "structured_output",
          data: result.structured_output
        })
      });
    endToolExecutionSpan({ success: !0 });
    let toolResultStr = result.data && typeof result.data === "object" ? jsonStringify(result.data) : String(result.data ?? "");
    endToolSpan(toolResultStr);
    let mappedToolResultBlock = tool.mapToolResultToToolResultBlockParam(result.data, toolUseID), mappedContent = mappedToolResultBlock.content, toolResultSizeBytes = !mappedContent ? 0 : typeof mappedContent === "string" ? mappedContent.length : jsonStringify(mappedContent).length, fileExtension2;
    if (processedInput && typeof processedInput === "object") {
      if ((tool.name === FILE_READ_TOOL_NAME || tool.name === FILE_EDIT_TOOL_NAME || tool.name === FILE_WRITE_TOOL_NAME) && "file_path" in processedInput)
        fileExtension2 = getFileExtensionForAnalytics(String(processedInput.file_path));
      else if (tool.name === NOTEBOOK_EDIT_TOOL_NAME && "notebook_path" in processedInput)
        fileExtension2 = getFileExtensionForAnalytics(String(processedInput.notebook_path));
      else if (tool.name === BASH_TOOL_NAME && "command" in processedInput) {
        let bashInput = processedInput;
        fileExtension2 = getFileExtensionsFromBashCommand(bashInput.command, bashInput._simulatedSedEdit?.filePath);
      }
    }
    if (logEvent("tengu_tool_use_success", {
      messageID: messageId,
      toolName: sanitizeToolNameForAnalytics(tool.name),
      isMcp: tool.isMcp ?? !1,
      durationMs,
      preToolHookDurationMs,
      toolResultSizeBytes,
      ...fileExtension2 !== void 0 && { fileExtension: fileExtension2 },
      queryChainId: toolUseContext.queryTracking?.chainId,
      queryDepth: toolUseContext.queryTracking?.depth,
      ...mcpServerType && {
        mcpServerType
      },
      ...mcpServerBaseUrl && {
        mcpServerBaseUrl
      },
      ...requestId && {
        requestId
      },
      ...mcpToolDetailsForAnalytics(tool.name, mcpServerType, mcpServerBaseUrl)
    }), isToolDetailsLoggingEnabled() && (tool.name === BASH_TOOL_NAME || tool.name === POWERSHELL_TOOL_NAME) && "command" in processedInput && typeof processedInput.command === "string" && processedInput.command.match(/\bgit\s+commit\b/) && result.data && typeof result.data === "object" && "stdout" in result.data) {
      let gitCommitId = parseGitCommitId(String(result.data.stdout));
      if (gitCommitId)
        toolParameters.git_commit_id = gitCommitId;
    }
    let mcpServerScope = isMcpTool(tool) ? getMcpServerScopeFromToolName(tool.name) : null;
    logOTelEvent("tool_result", {
      tool_name: sanitizeToolNameForAnalytics(tool.name),
      success: "true",
      duration_ms: String(durationMs),
      ...Object.keys(toolParameters).length > 0 && {
        tool_parameters: jsonStringify(toolParameters)
      },
      ...telemetryToolInput && { tool_input: telemetryToolInput },
      tool_result_size_bytes: String(toolResultSizeBytes),
      ...decisionInfo && {
        decision_source: decisionInfo.source,
        decision_type: decisionInfo.decision
      },
      ...mcpServerScope && { mcp_server_scope: mcpServerScope }
    });
    let toolOutput = result.data, hookResults = [], toolContextModifier = result.contextModifier, mcpMeta = result.mcpMeta;
    async function addToolResult(toolUseResult, preMappedBlock) {
      let contentBlocks = [preMappedBlock ? await processPreMappedToolResultBlock(preMappedBlock, tool.name, tool.maxResultSizeChars) : await processToolResultBlock(tool, toolUseResult, toolUseID)];
      if ("acceptFeedback" in permissionDecision && permissionDecision.acceptFeedback)
        contentBlocks.push({
          type: "text",
          text: permissionDecision.acceptFeedback
        });
      let allowContentBlocks = "contentBlocks" in permissionDecision ? permissionDecision.contentBlocks : void 0;
      if (allowContentBlocks?.length)
        contentBlocks.push(...allowContentBlocks);
      let allowImageIds;
      if (allowContentBlocks?.length) {
        let imageCount = count2(allowContentBlocks, (b) => b.type === "image");
        if (imageCount > 0) {
          let startId = getNextImagePasteId(toolUseContext.messages);
          allowImageIds = Array.from({ length: imageCount }, (_, i5) => startId + i5);
        }
      }
      resultingMessages.push({
        message: createUserMessage({
          content: contentBlocks,
          imagePasteIds: allowImageIds,
          toolUseResult: toolUseContext.agentId && !toolUseContext.preserveToolUseResults ? void 0 : toolUseResult,
          mcpMeta: toolUseContext.agentId ? void 0 : mcpMeta,
          sourceToolAssistantUUID: assistantMessage.uuid
        }),
        contextModifier: toolContextModifier ? {
          toolUseID,
          modifyContext: toolContextModifier
        } : void 0
      });
    }
    if (!isMcpTool(tool))
      await addToolResult(toolOutput, mappedToolResultBlock);
    let postToolHookInfos = [], postToolHookStart = Date.now();
    for await (let hookResult of runPostToolUseHooks(toolUseContext, tool, toolUseID, assistantMessage.message.id, processedInput, toolOutput, requestId, mcpServerType, mcpServerBaseUrl))
      if ("updatedMCPToolOutput" in hookResult) {
        if (isMcpTool(tool))
          toolOutput = hookResult.updatedMCPToolOutput;
      } else if (isMcpTool(tool)) {
        if (hookResults.push(hookResult), hookResult.message.type === "attachment") {
          let att = hookResult.message.attachment;
          if ("command" in att && att.command !== void 0 && "durationMs" in att && att.durationMs !== void 0)
            postToolHookInfos.push({
              command: att.command,
              durationMs: att.durationMs
            });
        }
      } else if (resultingMessages.push(hookResult), hookResult.message.type === "attachment") {
        let att = hookResult.message.attachment;
        if ("command" in att && att.command !== void 0 && "durationMs" in att && att.durationMs !== void 0)
          postToolHookInfos.push({
            command: att.command,
            durationMs: att.durationMs
          });
      }
    let postToolHookDurationMs = Date.now() - postToolHookStart;
    if (postToolHookDurationMs >= SLOW_PHASE_LOG_THRESHOLD_MS)
      logForDebugging(`Slow PostToolUse hooks: ${postToolHookDurationMs}ms for ${tool.name} (${postToolHookInfos.length} hooks)`, { level: "info" });
    if (isMcpTool(tool))
      await addToolResult(toolOutput);
    if (result.newMessages && result.newMessages.length > 0)
      for (let message of result.newMessages)
        resultingMessages.push({ message });
    if (shouldPreventContinuation)
      resultingMessages.push({
        message: createAttachmentMessage({
          type: "hook_stopped_continuation",
          message: stopReason || "Execution stopped by hook",
          hookName: `PreToolUse:${tool.name}`,
          toolUseID,
          hookEvent: "PreToolUse"
        })
      });
    for (let hookResult of hookResults)
      resultingMessages.push(hookResult);
    return resultingMessages;
  } catch (error44) {
    let durationMs = Date.now() - startTime;
    if (addToToolDuration(durationMs), endToolExecutionSpan({
      success: !1,
      error: errorMessage(error44)
    }), endToolSpan(), error44 instanceof McpAuthError)
      toolUseContext.setAppState((prevState) => {
        let serverName = error44.serverName, existingClientIndex = prevState.mcp.clients.findIndex((c3) => c3.name === serverName);
        if (existingClientIndex === -1)
          return prevState;
        let existingClient = prevState.mcp.clients[existingClientIndex];
        if (!existingClient || existingClient.type !== "connected")
          return prevState;
        let updatedClients = [...prevState.mcp.clients];
        return updatedClients[existingClientIndex] = {
          name: serverName,
          type: "needs-auth",
          config: existingClient.config
        }, {
          ...prevState,
          mcp: {
            ...prevState.mcp,
            clients: updatedClients
          }
        };
      });
    if (!(error44 instanceof AbortError)) {
      let errorMsg = errorMessage(error44);
      if (logForDebugging(`${tool.name} tool error (${durationMs}ms): ${errorMsg.slice(0, 200)}`), !(error44 instanceof ShellError))
        logError2(error44);
      logEvent("tengu_tool_use_error", {
        messageID: messageId,
        toolName: sanitizeToolNameForAnalytics(tool.name),
        error: classifyToolError(error44),
        isMcp: tool.isMcp ?? !1,
        queryChainId: toolUseContext.queryTracking?.chainId,
        queryDepth: toolUseContext.queryTracking?.depth,
        ...mcpServerType && {
          mcpServerType
        },
        ...mcpServerBaseUrl && {
          mcpServerBaseUrl
        },
        ...requestId && {
          requestId
        },
        ...mcpToolDetailsForAnalytics(tool.name, mcpServerType, mcpServerBaseUrl)
      });
      let mcpServerScope = isMcpTool(tool) ? getMcpServerScopeFromToolName(tool.name) : null;
      logOTelEvent("tool_result", {
        tool_name: sanitizeToolNameForAnalytics(tool.name),
        use_id: toolUseID,
        success: "false",
        duration_ms: String(durationMs),
        error: errorMessage(error44),
        ...Object.keys(toolParameters).length > 0 && {
          tool_parameters: jsonStringify(toolParameters)
        },
        ...telemetryToolInput && { tool_input: telemetryToolInput },
        ...decisionInfo && {
          decision_source: decisionInfo.source,
          decision_type: decisionInfo.decision
        },
        ...mcpServerScope && { mcp_server_scope: mcpServerScope }
      });
    }
    let content = formatError3(error44), isInterrupt = error44 instanceof AbortError, hookMessages = [];
    for await (let hookResult of runPostToolUseFailureHooks(toolUseContext, tool, toolUseID, messageId, processedInput, content, isInterrupt, requestId, mcpServerType, mcpServerBaseUrl))
      hookMessages.push(hookResult);
    return [
      {
        message: createUserMessage({
          content: [
            {
              type: "tool_result",
              content,
              is_error: !0,
              tool_use_id: toolUseID
            }
          ],
          toolUseResult: `Error: ${content}`,
          mcpMeta: toolUseContext.agentId ? void 0 : error44 instanceof McpToolCallError_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS ? error44.mcpMeta : void 0,
          sourceToolAssistantUUID: assistantMessage.uuid
        })
      },
      ...hookMessages
    ];
  } finally {
    if (stopSessionActivity("tool_exec"), decisionInfo)
      toolUseContext.toolDecisions?.delete(toolUseID);
  }
}
