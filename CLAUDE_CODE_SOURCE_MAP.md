# Claude Code TypeScript Source Architecture Map

**Project:** ~/claude-code/src  
**Size:** 1,898 TypeScript files, 35MB  
**Build System:** Bun + Biome  
**SDK Target:** Direct Claude API (for Rust port)

---

## QUICK REFERENCE: CRITICAL FILES

| File Path | Lines | Purpose | Status |
|-----------|-------|---------|--------|
| `src/query.ts` | 67KB | Main query loop + streaming | 🔴 CRITICAL |
| `src/QueryEngine.ts` | 46KB | Query state machine | 🔴 CRITICAL |
| `src/services/api/claude.ts` | ? | API client calls + streaming | 🔴 CRITICAL |
| `src/services/api/client.ts` | ? | SDK client factory | 🔴 CRITICAL |
| `src/services/api/withRetry.ts` | ? | Retry + 529 handling | 🔴 CRITICAL |
| `src/services/tools/StreamingToolExecutor.ts` | ? | Concurrent tool execution | 🔴 CRITICAL |
| `src/Tool.ts` | 29KB | Tool interface + registry | 🔴 CRITICAL |
| `src/utils/messages.ts` | 1000+ | Message creation/normalization | 🔴 CRITICAL |
| `src/utils/sessionStorage.ts` | ? | JSONL persistence | 🔴 CRITICAL |
| `src/utils/api.ts` | ? | Message preprocessing | 🟠 IMPORTANT |
| `src/utils/tokens.ts` | ? | Token counting | 🟠 IMPORTANT |
| `src/constants/prompts.ts` | ? | System prompts | 🟠 IMPORTANT |
| `src/entrypoints/agentSdkTypes.ts` | 13KB | Public SDK API | 🟠 IMPORTANT |
| `src/bootstrap/state.ts` | ? | Ephemeral state | 🟠 IMPORTANT |

---

## 1. DIRECTORY STRUCTURE

```
src/
├── assistant/              # Daemon + remote session management
├── bootstrap/              # State initialization [CRITICAL: state.ts]
├── bridge/                 # Remote session coordination (WebSocket)
├── buddy/                  # Companion help system
├── cli/                    # CLI transport, commands layer [IGNORE]
├── commands/               # Command implementations [IGNORE]
├── components/             # React/Ink terminal UI [IGNORE]
├── constants/              # Config, prompts, XML tags [IMPORTANT: prompts.ts]
├── context/                # Global context providers
├── coordinator/            # Multi-agent coordination
├── entrypoints/            # CLI, SDK, MCP entry points [CRITICAL: agentSdkTypes.ts, sdk/]
├── hooks/                  # React hooks [IGNORE]
├── ink/                    # React-ink terminal components [IGNORE]
├── keybindings/            # Terminal keybindings [IGNORE]
├── memdir/                 # Persistent memory system [IMPORTANT]
├── migrations/             # DB schema migrations
├── moreright/              # Unknown
├── native-ts/              # Native bindings [Bun-specific, IGNORE]
├── outputStyles/           # Terminal output formatting [IGNORE]
├── plugins/                # Plugin system loader
├── query/                  # Query execution engine [CRITICAL: config.ts, deps.ts]
├── remote/                 # Remote agent/assistant integration
├── schemas/                # Type schemas and validation
├── screens/                # Terminal screens [IGNORE]
├── server/                 # HTTP server for IDE/extension [IGNORE]
├── services/               # Core services [CRITICAL: api/, tools/, mcp/]
├── skills/                 # Agent skills system
├── state/                  # Application state [IGNORE]
├── tasks/                  # Background task system
├── tools/                  # Tool implementations [CRITICAL]
├── types/                  # Type definitions [CRITICAL]
├── upstreamproxy/          # Proxy handling
├── utils/                  # Utility functions [CRITICAL]
└── vim/                    # Vim plugin [IGNORE]
```

---

## 2. CRITICAL QUERY ENGINE

### src/query.ts [67KB] - THE MAIN LOOP

**This is the hot path. Everything flows through here.**

```
query(prompt: string | AsyncIterable): AsyncGenerator<StreamEvent | Message>

Execution flow:
1. Session management (load/create)
2. Load transcript messages from JSONL
3. Fetch system prompt
4. Normalize messages for API
5. Stream to Claude API
6. Process events (text, tool_use, etc.)
7. Execute tools concurrently
8. Append results to transcript
9. Continue until stop_reason="end_turn"
10. Yield final AssistantMessage
```

### src/QueryEngine.ts [46KB]

**Query state machine, session lifecycle**

```
QueryEngine {
  query()                    # Main entry
  processUserInput()         # Parse + normalize user input
  mergeTools()              # Combine local + MCP tools
  loadMemory()              # Auto-load relevant memories
  renderSystemPrompt()      # Build system prompt
  callClaude()              # Stream to API
  executeTools()            # Run tool_use blocks
  compactMessages()         # Compress old turns
}
```

### src/query/ directory

```
src/query/config.ts         Build QueryConfig (gates, options)
src/query/deps.ts           Dependency injection
src/query/stopHooks.ts      Post-API success hooks
src/query/tokenBudget.ts    Token tracking
src/query/transitions.ts    Terminal/Continue type definitions
```

---

## 3. API CLIENT & COMMUNICATION

### src/services/api/client.ts [CRITICAL]

**Creates Anthropic SDK client instance**

```typescript
getAnthropicClient({
  apiKey?: string
  maxRetries: number
  model?: string
  fetchOverride?: (url, init) => Promise<Response>
  source?: string
}) -> Anthropic

Handles:
- ANTHROPIC_API_KEY environment variable
- AWS Bedrock credentials
- Azure Foundry authentication
- Google Vertex AI authentication
- Custom base URLs
- User agent headers
```

### src/services/api/claude.ts [CRITICAL]

**Main API interaction - streams to Claude**

```typescript
callClaude({
  client: Anthropic
  messages: MessageParam[]
  model: string
  system: SystemPrompt[]
  tools: Tool[]
  maxTokens: number
  thinking?: ThinkingConfig
  temperature?: number
  topP?: number
  betas?: string[]  // Feature flag headers
  // ... 20+ more options
}): Promise<{
  message: BetaMessage
  usage: Usage
  requestId: string
  cacheCreationInputTokens?: number
  cacheReadInputTokens?: number
}>

Streaming:
- client.beta.messages.stream(params)
- for await (const event of stream)
  - MessageStartEvent
  - ContentBlockStartEvent
  - ContentBlockDeltaEvent (text chunks)
  - MessageDeltaEvent (usage)
  - MessageStopEvent
- stream.finalMessage() -> BetaMessage
```

### src/services/api/withRetry.ts [CRITICAL]

**Retry logic with exponential backoff**

```typescript
callWithRetry({
  fn: async () -> Result
  maxRetries: number = 10
  baseDelay: number = 500
}): Promise<Result>

Handles:
- 429 (rate limit) -> exponential backoff
- 529 (overloaded) -> special handling for foreground queries
- APIConnectionError -> retry
- APIUserAbortError -> don't retry
- Custom 529 logic for fast mode
```

### src/services/api/ directory

```
errors.ts              Error categorization + messages
errorUtils.ts          Connection error parsing
logging.ts             Usage tracking (tokens, cost)
bootstrap.ts           API initialization
filesApi.ts            File upload API
usage.ts               Quota tracking
sessionIngress.ts      Session creation
dumpPrompts.ts         Debug prompt dumping
grove.ts               Metrics API (internal)
```

---

## 4. MESSAGE SYSTEM

### src/utils/messages.ts [CRITICAL - 1000+ lines]

**Message creation, normalization, formatting**

```typescript
// Message construction
createUserMessage({
  content: ContentBlock[]
  toolUseResult?: string
  sourceToolAssistantUUID?: UUID
}) -> UserMessage

createAssistantAPIErrorMessage(error: APIError) -> AssistantMessage

// Normalization (CRITICAL)
normalizeMessagesForAPI(messages: Message[]) -> MessageParam[]
  Converts internal Message[] format to API MessageParam[]
  Handles: stripping IDE context, image validation, compact boundaries

normalizeContentFromAPI(content: BetaContentBlock[]) -> ContentBlock[]
  Converts BetaMessage content to internal format
  Handles: thinking blocks, text, tool_use, images

// Helpers
ensureToolResultPairing()       Validate tool_use → tool_result matching
stripSignatureBlocks()          Remove email signatures
stripCallerFieldFromAssistantMessage()
createToolUseSummaryMessage()   Summarize tool results
createMicrocompactBoundaryMessage()
getMessagesAfterCompactBoundary()
```

### src/types/logs.ts

**Session persistence types**

```typescript
SerializedMessage = Message & {
  cwd: string
  userType: string
  entrypoint?: string
  sessionId: string
  timestamp: string
  version: string
  gitBranch?: string
  slug?: string
}

TranscriptMessage = SerializedMessage & {
  parentUuid: UUID | null
  logicalParentUuid?: UUID | null
  isSidechain: boolean
  agentId?: string
  teamName?: string
}

Entry = TranscriptMessage | SummaryMessage | CustomTitleMessage | ...
```

---

## 5. SESSION MANAGEMENT

### src/utils/sessionStorage.ts [CRITICAL]

**JSONL transcript I/O**

```typescript
loadTranscriptFile(sessionId: string) -> Message[]
  Loads ~/.claude/projects/*/logs/{sessionId}.jsonl
  Parses Entry[] and reconstructs Message[] via parentUuid chain
  Returns chronological messages

appendEntry(entry: Entry, sessionId: string) -> void
  Stage entry in memory buffer

flushSessionStorage() -> void
  Write all staged entries to JSONL file

recordTranscript(messages: Message[], sessionId: string) -> void
  Batch record (overwrites)

Session file location: ~/.claude/projects/<project>/logs/<sessionId>.jsonl
Format: One JSON object per line (Entry type)
```

### src/bootstrap/state.ts [CRITICAL]

**Ephemeral in-memory state (no persistence)**

```typescript
getSessionId() -> UUID
getCurrentTurnTokenBudget() -> number
isSessionPersistenceDisabled() -> boolean
getThinkingClearLatched() -> boolean
setLastMainRequestId(id: string) -> void
getPromptCache1hEligible() -> boolean
```

### src/utils/sessionStart.ts

**Initialize new session**

```typescript
initializeSession({
  model?: string
  cwd?: string
  agent?: string
}) -> { sessionId: UUID, ... }
```

### src/utils/sessionRestore.ts

**Resume existing session**

```typescript
resumeSession(sessionId: UUID) -> { messages: Message[], ... }
```

---

## 6. TOOL SYSTEM

### src/Tool.ts [CRITICAL - 29KB]

**Tool interface & registry**

```typescript
interface Tool {
  name: string                      // "bash", "read_file", etc.
  description: string               // User-facing description
  handler?: (args: unknown, context: ToolUseContext) -> Promise<string>
  input_schema?: JSONSchema         // Zod or standard JSON schema
  isBuiltIn?: boolean
  isRemote?: boolean
  isConcurrencySafe?: boolean       // Can run parallel with other tools
}

interface ToolUseContext {
  abortSignal: AbortSignal
  cwd: string
  env: Record<string, string>
  fileState: FileStateCache
  permissions: ToolPermissionContext
  onProgress?: (progress: Progress) -> void
}

// Helpers
findToolByName(tools: Tool[], name: string) -> Tool | undefined
toolMatchesName(tool: Tool, name: string) -> boolean
getSlashCommandToolSkills() -> Tool[]
```

### src/services/tools/StreamingToolExecutor.ts [CRITICAL]

**Concurrent tool execution**

```typescript
class StreamingToolExecutor {
  addTool(block: ToolUseBlock, assistantMessage: AssistantMessage) {
    // Called as tools arrive during streaming
    // Tracks execution status + concurrency
  }
  
  getRemainingResults(): AsyncGenerator<Message> {
    // Yields tool results + progress after stream ends
  }
  
  hasError(): boolean
  discard(): void  // On streaming fallback
}

Concurrency model:
- Concurrent-safe tools (FileReadTool, WebSearchTool) run in parallel
- Non-concurrent tools (BashTool, FileEditTool) run alone
- Bash errors abort siblings via siblingAbortController
```

### src/services/tools/toolExecution.ts

**Execute a single tool**

```typescript
runToolUse({
  toolUse: ToolUseBlock
  tools: Tool[]
  context: ToolUseContext
  canUseTool: (name: string) -> boolean
}): AsyncGenerator<Message | ProgressMessage>
```

### src/services/tools/toolOrchestration.ts

**Orchestrate multiple tools**

```typescript
runTools({
  toolUseBlocks: ToolUseBlock[]
  tools: Tool[]
  context: ToolUseContext
  concurrencySafe: boolean
}): AsyncGenerator<Message>
```

### src/tools/ directory

```
BashTool/              Execute shell commands (subprocess)
FileReadTool/          Read files with line limits
FileEditTool/          Edit files with undo support
FileWriteTool/         Write/create files
GlobTool/              File globbing with cwd
GrepTool/              Search file contents
WebSearchTool/         Web search (if available)
AgentTool/             Spawn sub-agents
SkillTool/             Execute user-defined skills
AskUserQuestionTool/   Prompt user for input
SendMessageTool/       Send to teammates
SleepTool/             Delay execution
TaskTool/              Task creation/management
SyntheticOutputTool/   Format output
MCPTool/               MCP resource access
```

---

## 7. SUPPORTING MODULES

### src/utils/api.ts

**Message preprocessing for API**

```typescript
normalizeToolInput(input: unknown) -> unknown
normalizeToolInputForAPI(input: unknown) -> unknown
prependUserContext() -> string
appendSystemContext() -> string
toolToAPISchema(tool: Tool) -> JSONSchema
```

### src/utils/tokens.ts

**Token counting and budgeting**

```typescript
tokenCountWithEstimation(
  messages: Message[],
  model: string,
  options?: { thinking?: boolean }
) -> number

finalContextTokensFromLastResponse(lastResponse) -> number
doesMostRecentAssistantMessageExceed200k() -> boolean
```

### src/utils/queryContext.ts

**Build system prompt**

```typescript
fetchSystemPromptParts(model: string) -> Promise<string[]>
getSystemPrompt(attachments: Attachment[], model: string) -> Promise<SystemPrompt>
```

### src/utils/context.ts

**Context window limits**

```typescript
CAPPED_DEFAULT_MAX_TOKENS = 16000
getModelMaxOutputTokens(model: string) -> number
```

### src/constants/prompts.ts

**System prompt parts**

```typescript
getSystemPrompt(model: string) -> Promise<string[]>
// Contains: rules, tool descriptions, memory instructions, etc.
```

### src/constants/betas.ts

**Feature flag headers to API**

```typescript
AFK_MODE_BETA_HEADER
CONTEXT_1M_BETA_HEADER
THINKING_MODE_BETA_HEADER
STRUCTURED_OUTPUTS_BETA_HEADER
// etc.
```

---

## 8. OPTIONAL BUT IMPORTANT

### src/services/mcp/

**Model Context Protocol (tool servers)**

```
client.ts              MCP client + server lifecycle
config.ts              Load MCP servers from settings
types.ts               ServerConnection, Resource types
InProcessTransport.ts  Stdio transport for subprocesses
SdkControlTransport.ts SDK transport
// 20+ provider-specific integrations (GitHub, Slack, etc.)
```

### src/memdir/

**Persistent memory system**

```
memdir.ts              Load auto-memories for context
findRelevantMemories.ts Rank memories by relevance
memoryScan.ts          Scan memory directory
memoryTypes.ts         Memory type definitions
paths.ts               Memory file paths (~/.claude/memory/)
```

### src/services/compact/

**Message compression for long sessions**

```
autoCompact.ts         Decide when to compact
compact.ts             Core compaction logic
apiMicrocompact.ts     API-side compaction
sessionMemoryCompact.ts Compact session memory
```

### src/utils/thinking.ts

**Extended thinking configuration**

```typescript
type ThinkingConfig = {
  enabled: boolean
  budgetTokens?: number
  type?: 'enabled' | 'disabled'
}

shouldEnableThinkingByDefault(model: string) -> boolean
```

---

## 9. ENTRYPOINTS

### src/entrypoints/agentSdkTypes.ts [13KB]

**Public SDK API (what users import)**

```typescript
export function query(params: {
  prompt: string | AsyncIterable<SDKUserMessage>
  options?: Options
}): Query

export async function unstable_v2_prompt(
  message: string,
  options: SDKSessionOptions
): Promise<SDKResultMessage>

export async function unstable_v2_createSession(
  options: SDKSessionOptions
): SDKSession

export async function getSessionMessages(
  sessionId: string,
  options?: GetSessionMessagesOptions
): Promise<SessionMessage[]>

export async function listSessions(
  options?: ListSessionsOptions
): Promise<SDKSessionInfo[]>

// All other exports throw "not implemented"
```

### src/entrypoints/sdk/

**Implementation files**

```
coreTypes.ts              Message types (serializable)
runtimeTypes.ts           Query/Session runtime (async generators)
runtimeTypes.ts           Zod schemas for messages
controlTypes.ts           Control protocol (bridges)
toolTypes.ts              Tool definition types
settingsTypes.generated.ts Generated from JSON schema
```

---

## 10. THE HOT PATH

```
user: query("What files are here?")
  ↓
agentSdkTypes.ts:query() -> entrypoints/sdk/runtimeTypes.ts:Query
  ↓
query.ts:query() [GENERATOR FUNCTION]
  ↓
1. bootstrap/state.ts:getSessionId()
2. utils/sessionStorage.ts:loadTranscriptFile(sessionId)
3. utils/queryContext.ts:fetchSystemPromptParts(model)
4. utils/messages.ts:createUserMessage(prompt)
5. utils/messages.ts:normalizeMessagesForAPI(messages)
  ↓
services/api/claude.ts:callClaude({
  client, messages, system, tools, model, maxTokens
})
  ↓
6. services/api/client.ts:getAnthropicClient()
7. client.beta.messages.stream(params)
  ↓
8. FOR EACH event in stream:
   - ContentBlockDeltaEvent → yield StreamEvent
   - ToolUseBlock → StreamingToolExecutor.addTool()
  ↓
9. stream.finalMessage() -> BetaMessage
10. utils/messages.ts:normalizeContentFromAPI(message.content)
  ↓
11. utils/sessionStorage.ts:appendEntry(AssistantMessage)
12. FOR EACH toolResult:
    - appendEntry(UserMessage with tool_results)
  ↓
13. utils/sessionStorage.ts:flushSessionStorage()
  ↓
14. yield AssistantMessage (final)
```

---

## 11. CRITICAL TYPE MAPPINGS

```
User input: string
  ↓ createUserMessage()
Internal: UserMessage { uuid, content[], parentUuid, cwd, timestamp }
  ↓ normalizeMessagesForAPI()
API: MessageParam { role: "user", content: ContentBlockParam[] }
  ↓ client.beta.messages.stream()
API Response: BetaRawMessageStreamEvent (streamed)
  ↓ stream.finalMessage()
API: BetaMessage { content: BetaContentBlock[], stop_reason, usage }
  ↓ normalizeContentFromAPI()
Internal: AssistantMessage { uuid, message: BetaMessage, created_at }
  ↓ appendEntry()
Storage: TranscriptMessage (JSONL line)
```

---

## 12. PHASE IMPLEMENTATION PLAN

### Phase 1: Bare Minimum (MVP)
```
1. HTTP client (reqwest)
2. Anthropic SDK types
3. Query loop skeleton
4. Session storage (JSONL read/write)
5. Message normalization
6. Basic tool execution (sync)
```

### Phase 2: Streaming
```
1. HTTP streaming response handling
2. Event parsing
3. Generator/async iterator API
4. Concurrent tool execution
```

### Phase 3: Tools
```
1. BashTool (subprocess execution)
2. FileReadTool, FileEditTool, FileWriteTool
3. GlobTool, GrepTool
4. WebSearchTool (if available)
```

### Phase 4: Advanced
```
1. MCP integration (subprocess transport)
2. Memory system (auto-memories)
3. Compact/compression
4. Thinking mode
5. Permissions system
```

---

## DEPENDENCY MAP

```
CRITICAL:
query.ts
  ├─ QueryEngine.ts
  ├─ services/api/claude.ts
  │  ├─ services/api/client.ts
  │  ├─ services/api/withRetry.ts
  │  └─ utils/messages.ts (normalizeMessagesForAPI)
  ├─ services/tools/StreamingToolExecutor.ts
  │  └─ services/tools/toolExecution.ts
  ├─ Tool.ts
  ├─ utils/messages.ts
  ├─ utils/sessionStorage.ts
  ├─ utils/queryContext.ts
  ├─ utils/tokens.ts
  ├─ bootstrap/state.ts
  └─ constants/prompts.ts
```

---

## 13. FILES TO IGNORE

```
components/              React/Ink UI components
hooks/                   React hooks (useCanUseTool, etc.)
screens/                 Terminal screens
state/                   Application state (Redux-like)
cli/                     CLI transport + handlers
commands/                Command implementations (/resign, /config, etc.)
ink/                     React-ink (terminal rendering)
keybindings/             Vim/keybinding system
outputStyles/            Terminal output formatting
migrations/              Database migrations (legacy)
native-ts/               Bun native bindings
vim/                     Vim plugin
assistant/               Daemon supervisor (if not using)
bridge/                  Remote WebSocket bridge (if not using)
coordinator/             Multi-agent coordinator (if not using)
entrypoints/cli.tsx      CLI entry point
services/analytics/      Event tracking (optional)
plugins/                 Plugin system (optional)
```

---

## 14. MINIMAL RUST SDK STACK

```toml
[dependencies]
tokio = { version = "1", features = ["full"] }      # Async runtime
reqwest = { version = "0.11", features = ["stream"] }  # HTTP streaming
serde = { version = "1", features = ["derive"] }    # JSON
serde_json = "1"
uuid = { version = "1", features = ["v4"] }         # Session IDs
anyhow = "1"                                         # Error handling
futures = "0.3"                                      # Streams
tempfile = "3"                                       # Temp files
```

---

## FINAL CHECKLIST FOR RUST PORTING

- [ ] Understand src/query.ts hot path (read it 3x)
- [ ] Understand message normalization flow
- [ ] Understand session storage (JSONL format)
- [ ] Understand streaming tool execution model
- [ ] Port HTTP client + Anthropic SDK types
- [ ] Port message types + serialization
- [ ] Port query state machine
- [ ] Port streaming event loop
- [ ] Port session storage (load/append/flush)
- [ ] Port Tool registry + execution
- [ ] Port BashTool (subprocess)
- [ ] Port file tools
- [ ] Add MCP (optional)
- [ ] Add memory system (optional)
- [ ] Add thinking mode (optional)
- [ ] Add compact (optional)

---

**Analysis complete. Focus on the 14 files marked CRITICAL.**
