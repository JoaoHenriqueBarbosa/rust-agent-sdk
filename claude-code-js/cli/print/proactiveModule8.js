// var: proactiveModule8
var proactiveModule8 = null, SHUTDOWN_TEAM_PROMPT = `<system-reminder>
You are running in non-interactive mode and cannot return a response to the user until your team is shut down.

You MUST shut down your team before preparing your final response:
1. Use requestShutdown to ask each team member to shut down gracefully
2. Wait for shutdown approvals
3. Use the cleanup operation to clean up the team
4. Only then provide your final response to the user

The user cannot receive your response until the team is completely shut down.
</system-reminder>

Shut down your team and prepare your final response for the user.`, MAX_RECEIVED_UUIDS = 1e4, receivedMessageUuids, receivedMessageUuidsOrder;
var init_print = __esm(() => {
  init_settingsSync();
  init_remoteManagedSettings();
  init_structuredIO();
  init_remoteIO();
  init_commands5();
  init_streamlinedTransform();
  init_streamJsonStdoutGuard();
  init_tools2();
  init_uniqBy();
  init_toolPool();
  init_debug();
  init_diagLogs();
  init_Tool();
  init_loadAgentsDir();
  init_messageQueueManager();
  init_sessionState();
  init_onChangeAppState();
  init_log3();
  init_logging2();
  init_conversationRecovery();
  init_channelNotification();
  init_channelAllowlist();
  init_pluginIdentifier();
  init_uuid();
  init_generators();
  init_QueryEngine();
  init_fileStateCache();
  init_path2();
  init_queryHelpers();
  init_hookEvents();
  init_filePersistence();
  init_AsyncHookRegistry();
  init_gracefulShutdown();
  init_cleanupRegistry();
  init_idleTimeout();
  init_cwd2();
  init_omit();
  init_reject2();
  init_policyLimits();
  init_permissions2();
  init_json();
  init_PermissionPromptToolResultSchema();
  init_abortController();
  init_combinedAbortSignal();
  init_sessionTitle();
  init_queryContext();
  init_sideQuestion();
  init_sessionStart();
  init_outputStyles();
  init_xml();
  init_settings2();
  init_changeDetector();
  init_applySettingsChange();
  init_fastMode();
  init_permissionSetup();
  init_promptSuggestion();
  init_forkedAgent();
  init_auth14();
  init_oauth2();
  init_auth18();
  init_providers();
  init_awsAuthStatusManager();
  init_state();
  init_SyntheticOutputTool();
  init_sessionUrl();
  init_sessionStorage();
  init_commitAttribution();
  init_client20();
  init_config8();
  init_auth17();
  init_elicitationHandler();
  init_hooks5();
  init_types();
  init_mcpStringUtils();
  init_utils7();
  init_vscodeSdkMcp();
  init_config8();
  init_grove();
  init_mappers();
  init_messages3();
  init_context_noninteractive();
  init_xml();
  init_claudeAiLimits();
  init_model();
  init_modelOptions();
  init_effort();
  init_thinking();
  init_betas2();
  init_modelStrings();
  init_state();
  init_workloadContext();
  init_fileHistory();
  init_sessionRestore();
  init_sandbox_adapter();
  init_headlessProfiler();
  init_queryProfiler();
  init_ids();
  init_slowOperations();
  init_skillChangeDetector();
  init_commands5();
  init_envUtils();
  init_headlessPluginInstall();
  init_refresh();
  init_pluginLoader();
  init_teammate();
  init_teammateMailbox();
  init_teamHelpers();
  init_tasks();
  init_framework();
  init_stopTask();
  init_sdkEventQueue();
  init_errors();
  init_paths();
  receivedMessageUuids = /* @__PURE__ */ new Set, receivedMessageUuidsOrder = [];
});
