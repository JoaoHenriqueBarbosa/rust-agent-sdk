// Original: src/utils/handlePromptSubmit.ts
function exit2() {
  gracefulShutdownSync(0);
}
async function handlePromptSubmit(params) {
  let {
    helpers: helpers3,
    queryGuard,
    isExternalLoading = !1,
    commands: commands7,
    onInputChange,
    setPastedContents,
    setToolJSX,
    getToolUseContext,
    messages,
    mainLoopModel,
    ideSelection,
    setUserInputOnProcessing,
    setAbortController,
    onQuery,
    setAppState,
    onBeforeQuery,
    canUseTool,
    queuedCommands,
    uuid: uuid8,
    skipSlashCommands
  } = params, { setCursorOffset, clearBuffer, resetHistory } = helpers3;
  if (queuedCommands?.length) {
    startQueryProfile(), await executeUserInput({
      queuedCommands,
      messages,
      mainLoopModel,
      ideSelection,
      querySource: params.querySource,
      commands: commands7,
      queryGuard,
      setToolJSX,
      getToolUseContext,
      setUserInputOnProcessing,
      setAbortController,
      onQuery,
      setAppState,
      onBeforeQuery,
      resetHistory,
      canUseTool,
      onInputChange
    });
    return;
  }
  let input = params.input ?? "", mode = params.mode ?? "prompt", rawPastedContents = params.pastedContents ?? {}, referencedIds = new Set(parseReferences(input).map((r4) => r4.id)), pastedContents = Object.fromEntries(Object.entries(rawPastedContents).filter(([, c3]) => c3.type !== "image" || referencedIds.has(c3.id))), hasImages = Object.values(pastedContents).some(isValidImagePaste);
  if (input.trim() === "")
    return;
  if (!skipSlashCommands && ["exit", "quit", ":q", ":q!", ":wq", ":wq!"].includes(input.trim())) {
    if (commands7.find((cmd2) => cmd2.name === "exit"))
      handlePromptSubmit({
        ...params,
        input: "/exit"
      });
    else
      exit2();
    return;
  }
  let finalInput = expandPastedTextRefs(input, pastedContents), pastedTextRefs = parseReferences(input).filter((r4) => pastedContents[r4.id]?.type === "text"), pastedTextCount = pastedTextRefs.length, pastedTextBytes = pastedTextRefs.reduce((sum, r4) => sum + (pastedContents[r4.id]?.content.length ?? 0), 0);
  if (logEvent("tengu_paste_text", { pastedTextCount, pastedTextBytes }), !skipSlashCommands && finalInput.trim().startsWith("/")) {
    let trimmedInput = finalInput.trim(), spaceIndex = trimmedInput.indexOf(" "), commandName = spaceIndex === -1 ? trimmedInput.slice(1) : trimmedInput.slice(1, spaceIndex), commandArgs = spaceIndex === -1 ? "" : trimmedInput.slice(spaceIndex + 1).trim(), immediateCommand = commands7.find((cmd2) => cmd2.immediate && isCommandEnabled(cmd2) && (cmd2.name === commandName || cmd2.aliases?.includes(commandName) || getCommandName(cmd2) === commandName));
    if (immediateCommand && immediateCommand.type === "local-jsx" && (queryGuard.isActive || isExternalLoading)) {
      logEvent("tengu_immediate_command_executed", {
        commandName: immediateCommand.name
      }), onInputChange(""), setCursorOffset(0), setPastedContents({}), clearBuffer();
      let context7 = getToolUseContext(messages, [], createAbortController(), mainLoopModel), doneWasCalled = !1, onDone = (result, options2) => {
        if (doneWasCalled = !0, setToolJSX({
          jsx: null,
          shouldHidePromptInput: !1,
          clearLocalJSX: !0
        }), result && options2?.display !== "skip" && params.addNotification)
          params.addNotification({
            key: `immediate-${immediateCommand.name}`,
            text: result,
            priority: "immediate"
          });
        if (options2?.nextInput)
          if (options2.submitNextInput)
            enqueue({ value: options2.nextInput, mode: "prompt" });
          else
            onInputChange(options2.nextInput);
      }, jsx = await (await immediateCommand.load()).call(onDone, context7, commandArgs);
      if (jsx && !doneWasCalled)
        setToolJSX({
          jsx,
          shouldHidePromptInput: !1,
          isLocalJSXCommand: !0,
          isImmediate: !0
        });
      return;
    }
  }
  if (queryGuard.isActive || isExternalLoading) {
    if (mode !== "prompt" && mode !== "bash")
      return;
    if (params.hasInterruptibleToolInProgress)
      logForDebugging(`[interrupt] Aborting current turn: streamMode=${params.streamMode}`), logEvent("tengu_cancel", {
        source: "interrupt_on_submit",
        streamMode: params.streamMode
      }), params.abortController?.abort("interrupt");
    enqueue({
      value: finalInput.trim(),
      preExpansionValue: input.trim(),
      mode,
      pastedContents: hasImages ? pastedContents : void 0,
      skipSlashCommands,
      uuid: uuid8
    }), onInputChange(""), setCursorOffset(0), setPastedContents({}), resetHistory(), clearBuffer();
    return;
  }
  startQueryProfile(), await executeUserInput({
    queuedCommands: [{
      value: finalInput,
      preExpansionValue: input,
      mode,
      pastedContents: hasImages ? pastedContents : void 0,
      skipSlashCommands,
      uuid: uuid8
    }],
    messages,
    mainLoopModel,
    ideSelection,
    querySource: params.querySource,
    commands: commands7,
    queryGuard,
    setToolJSX,
    getToolUseContext,
    setUserInputOnProcessing,
    setAbortController,
    onQuery,
    setAppState,
    onBeforeQuery,
    resetHistory,
    canUseTool,
    onInputChange
  });
}
async function executeUserInput(params) {
  let {
    messages,
    mainLoopModel,
    ideSelection,
    querySource,
    queryGuard,
    setToolJSX,
    getToolUseContext,
    setUserInputOnProcessing,
    setAbortController,
    onQuery,
    setAppState,
    onBeforeQuery,
    resetHistory,
    canUseTool,
    queuedCommands
  } = params, abortController = createAbortController();
  setAbortController(abortController);
  function makeContext() {
    return getToolUseContext(messages, [], abortController, mainLoopModel);
  }
  try {
    queryGuard.reserve(), queryCheckpoint("query_process_user_input_start");
    let newMessages = [], shouldQuery = !1, allowedTools, model, effort, nextInput, submitNextInput, commands7 = queuedCommands ?? [], firstWorkload = commands7[0]?.workload, turnWorkload = firstWorkload !== void 0 && commands7.every((c3) => c3.workload === firstWorkload) ? firstWorkload : void 0;
    await runWithWorkload(turnWorkload, async () => {
      for (let i5 = 0;i5 < commands7.length; i5++) {
        let cmd = commands7[i5], isFirst = i5 === 0, result = await processUserInput({
          input: cmd.value,
          preExpansionInput: cmd.preExpansionValue,
          mode: cmd.mode,
          setToolJSX,
          context: makeContext(),
          pastedContents: isFirst ? cmd.pastedContents : void 0,
          messages,
          setUserInputOnProcessing: isFirst ? setUserInputOnProcessing : void 0,
          isAlreadyProcessing: !isFirst,
          querySource,
          canUseTool,
          uuid: cmd.uuid,
          ideSelection: isFirst ? ideSelection : void 0,
          skipSlashCommands: cmd.skipSlashCommands,
          bridgeOrigin: cmd.bridgeOrigin,
          isMeta: cmd.isMeta,
          skipAttachments: !isFirst
        }), origin2 = cmd.origin ?? (cmd.mode === "task-notification" ? { kind: "task-notification" } : void 0);
        if (origin2) {
          for (let m4 of result.messages)
            if (m4.type === "user")
              m4.origin = origin2;
        }
        if (newMessages.push(...result.messages), isFirst)
          shouldQuery = result.shouldQuery, allowedTools = result.allowedTools, model = result.model, effort = result.effort, nextInput = result.nextInput, submitNextInput = result.submitNextInput;
      }
      if (queryCheckpoint("query_process_user_input_end"), fileHistoryEnabled())
        queryCheckpoint("query_file_history_snapshot_start"), newMessages.filter(selectableUserMessagesFilter).forEach((message) => {
          fileHistoryMakeSnapshot((updater) => {
            setAppState((prev) => ({
              ...prev,
              fileHistory: updater(prev.fileHistory)
            }));
          }, message.uuid);
        }), queryCheckpoint("query_file_history_snapshot_end");
      if (newMessages.length) {
        resetHistory(), setToolJSX({
          jsx: null,
          shouldHidePromptInput: !1,
          clearLocalJSX: !0
        });
        let primaryCmd = commands7[0], primaryMode = primaryCmd?.mode ?? "prompt", primaryInput = primaryCmd && typeof primaryCmd.value === "string" ? primaryCmd.value : void 0, shouldCallBeforeQuery = primaryMode === "prompt";
        await onQuery(newMessages, abortController, shouldQuery, allowedTools ?? [], model ? resolveSkillModelOverride(model, mainLoopModel) : mainLoopModel, shouldCallBeforeQuery ? onBeforeQuery : void 0, primaryInput, effort);
      } else
        queryGuard.cancelReservation(), setToolJSX({
          jsx: null,
          shouldHidePromptInput: !1,
          clearLocalJSX: !0
        }), resetHistory(), setAbortController(null);
      if (nextInput)
        if (submitNextInput)
          enqueue({ value: nextInput, mode: "prompt" });
        else
          params.onInputChange(nextInput);
    });
  } finally {
    queryGuard.cancelReservation(), setUserInputOnProcessing(void 0);
  }
}
var init_handlePromptSubmit = __esm(() => {
  init_commands5();
  init_MessageSelector();
  init_history();
  init_abortController();
  init_debug();
  init_fileHistory();
  init_gracefulShutdown();
  init_messageQueueManager();
  init_model();
  init_processUserInput();
  init_queryProfiler();
  init_workloadContext();
});
