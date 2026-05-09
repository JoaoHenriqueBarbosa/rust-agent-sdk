// Shared module state and imports
// Original: src/QueryEngine.ts
import { randomUUID as randomUUID46 } from "crypto";

async function* ask({
  commands: commands7,
  prompt,
  promptUuid,
  isMeta,
  cwd: cwd2,
  tools,
  mcpClients,
  verbose = !1,
  thinkingConfig,
  maxTurns,
  maxBudgetUsd,
  taskBudget,
  canUseTool,
  mutableMessages = [],
  getReadFileCache,
  setReadFileCache,
  customSystemPrompt,
  appendSystemPrompt,
  userSpecifiedModel,
  fallbackModel,
  jsonSchema,
  getAppState,
  setAppState,
  abortController,
  replayUserMessages = !1,
  includePartialMessages = !1,
  handleElicitation,
  agents: agents2 = [],
  setSDKStatus,
  orphanedPermission
}) {
  let engine = new QueryEngine({
    cwd: cwd2,
    tools,
    commands: commands7,
    mcpClients,
    agents: agents2,
    canUseTool,
    getAppState,
    setAppState,
    initialMessages: mutableMessages,
    readFileCache: cloneFileStateCache(getReadFileCache()),
    customSystemPrompt,
    appendSystemPrompt,
    userSpecifiedModel,
    fallbackModel,
    thinkingConfig,
    maxTurns,
    maxBudgetUsd,
    taskBudget,
    jsonSchema,
    verbose,
    handleElicitation,
    replayUserMessages,
    includePartialMessages,
    setSDKStatus,
    abortController,
    orphanedPermission,
    ...{}
  });
  try {
    yield* engine.submitMessage(prompt, {
      uuid: promptUuid,
      isMeta
    });
  } finally {
    setReadFileCache(engine.getReadFileState());
  }
}
