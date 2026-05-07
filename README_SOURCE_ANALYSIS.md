# Claude Code TypeScript Source Analysis

**Analysis Date:** 2026-05-07  
**Project Scanned:** ~/claude-code/src (1,898 TypeScript files, 35MB)  
**Analysis Scope:** Extracting architecture for Rust SDK port  

---

## Documentation Files

Two detailed analysis documents have been created:

### 1. **CLAUDE_CODE_ANALYSIS_SUMMARY.txt** (292 lines, 11KB)
**Quick reference guide - START HERE**

- Critical findings (6 key insights)
- Directory map with ignore list
- The hot path (10-step flow diagram)
- Type transformations
- Known complications (6 areas)
- Top 14 files to study (in priority order)
- Minimal Rust dependencies
- Implementation phases (4 phases)
- Effort estimates (2-12 weeks)

**Best for:** Getting oriented quickly, understanding scope, planning phases

### 2. **CLAUDE_CODE_SOURCE_MAP.md** (803 lines, 22KB)
**Comprehensive architecture reference**

- Complete directory structure (32 subdirectories)
- Detailed module breakdowns:
  - Query execution engine
  - API client & communication
  - Message system
  - Session management
  - Tool system
  - Streaming tool execution
  - Supporting modules
- All critical file paths with purposes
- Type definitions and flow diagrams
- Entrypoint specifications
- The hot path (detailed 10-step flow)
- Dependency graph
- Known complications (4 complex areas)
- Glossary of key terms
- Rust port strategy (4 phases)
- Final summary for SDK developers

**Best for:** Deep understanding, architecture decisions, implementation reference

---

## Key Takeaways

### The Core

1. **src/query.ts** (67KB) - **THE MAIN LOOP**
   - Read this file 3x to understand the whole system
   - Everything flows through here

2. **src/services/api/claude.ts** - **API STREAMING**
   - Streams to Anthropic API
   - Handles events (text, tool_use, etc.)

3. **src/utils/messages.ts** (1000+ lines) - **MESSAGE NORMALIZATION**
   - Converts internal message format ↔ API format
   - Most critical transformation point

4. **src/utils/sessionStorage.ts** - **JSONL PERSISTENCE**
   - Simple JSONL file reading/writing
   - Session location: `~/.claude/projects/<project>/logs/<sessionId>.jsonl`

### The Insight

Tools execute **concurrently as they stream in** (not sequentially after the stream):
- During streaming: new tool_use blocks trigger StreamingToolExecutor.addTool()
- After streaming: collect results, send back to API
- Results buffered, emitted in receipt order

### The Scope

**Must port (MVP):**
- query.ts + QueryEngine.ts
- API layer (3 files: client, claude, withRetry)
- Message normalization
- Session storage (JSONL)
- Tool registry + execution
- Basic tools (bash, file ops)

**Advanced (later):**
- MCP (subprocess tool servers)
- Memory system (auto-memories)
- Message compaction
- Thinking mode
- Prompt caching

**Ignore completely:**
- All React/UI code
- All CLI code
- Terminal rendering
- Vim plugin

---

## Implementation Roadmap

### Phase 1: MVP (1 week)
- HTTP client + Anthropic SDK types
- Message normalization
- Session storage (JSONL)
- Query loop skeleton
- Basic tool sync execution

### Phase 2: Streaming (1 week)
- HTTP streaming response parsing
- Event processing
- Async iterator API
- Concurrent tool execution

### Phase 3: Tools (1 week)
- BashTool (subprocess)
- File tools (read, edit, write, glob, grep)
- WebSearchTool
- Tool permissions

### Phase 4: Advanced (2 weeks)
- MCP integration
- Memory system
- Compact/compression
- Thinking mode
- Prompt cache

---

## Study Order

Read these files in this order:

1. `~/claude-code/src/query.ts` [67KB]
   - Main loop, streaming, tool orchestration
   - Read 3x until you understand the flow

2. `~/claude-code/src/QueryEngine.ts` [46KB]
   - Session management, state machine

3. `~/claude-code/src/services/api/claude.ts`
   - API interaction, streaming handling

4. `~/claude-code/src/services/api/client.ts`
   - SDK client factory

5. `~/claude-code/src/services/api/withRetry.ts`
   - Retry logic

6. `~/claude-code/src/utils/messages.ts` [1000+ lines]
   - Message normalization (CRITICAL)

7. `~/claude-code/src/utils/sessionStorage.ts`
   - JSONL I/O

Then read CLAUDE_CODE_SOURCE_MAP.md for the full architecture.

---

## Critical Types

```
User Input: "string"
  ↓ createUserMessage()
Internal: UserMessage {uuid, content[], parentUuid, cwd, timestamp}
  ↓ normalizeMessagesForAPI()
API Request: MessageParam[] {role: "user", content: ContentBlockParam[]}
  ↓ client.beta.messages.stream()
Stream Events: BetaRawMessageStreamEvent (streamed)
  ↓ stream.finalMessage()
API Response: BetaMessage {content: BetaContentBlock[], stop_reason, usage}
  ↓ normalizeContentFromAPI()
Internal: AssistantMessage {uuid, message: BetaMessage, created_at}
  ↓ appendEntry()
Persistent: TranscriptMessage (JSONL line)
```

---

## Minimal Rust Dependencies

```toml
[dependencies]
tokio = { version = "1", features = ["full"] }
reqwest = { version = "0.11", features = ["stream"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
uuid = { version = "1", features = ["v4"] }
anyhow = "1"
futures = "0.3"
tempfile = "3"
```

---

## Known Complications

1. **Streaming Tool Execution**
   - Tools start as they stream in, run concurrently
   - Concurrency control: some tools run together, some alone
   - Results buffered, emitted in original order

2. **Message Type Scattering**
   - No single message.ts file!
   - Types in: utils/messages.ts, types/logs.ts, entrypoints/sdk/coreTypes.ts
   - Circular imports possible

3. **Streaming Fallback**
   - HTTP streaming can fail mid-stream
   - Falls back to polling
   - Results discarded, retry from before

4. **Message Compression**
   - Long sessions trigger automatic compaction
   - Affects resume + token counting
   - Complex state tracking

5. **Thinking Mode**
   - Extended thinking creates synthetic blocks
   - Special display handling needed
   - Reduces output token budget

6. **Permission System**
   - Tools blocked until user approval
   - Affects retry flow
   - Early exit possible

---

## Estimated Effort

- **MVP (query + basic tools):** 2-3 weeks
- **Full feature parity:** 6-8 weeks  
- **Including MCP + memory + compact:** 10-12 weeks

Main complexity: Streaming tool execution + message normalization  
Main risk: Anthropic API changes + edge cases in compact/thinking

---

## File Locations

All analysis documents in: `/home/john/projects/rust-agent-sdk/`

- `CLAUDE_CODE_ANALYSIS_SUMMARY.txt` - Quick reference (292 lines)
- `CLAUDE_CODE_SOURCE_MAP.md` - Full architecture (803 lines)
- `README_SOURCE_ANALYSIS.md` - This file

---

## Recommended Next Steps

1. Read `CLAUDE_CODE_ANALYSIS_SUMMARY.txt` (15 min)
2. Open `~/claude-code/src/query.ts` and read it completely (45 min)
3. Open `~/claude-code/src/services/api/claude.ts` (20 min)
4. Open `~/claude-code/src/utils/messages.ts` (30 min)
5. Review `CLAUDE_CODE_SOURCE_MAP.md` sections as reference (30 min)
6. Start porting: begin with HTTP client + Anthropic SDK bindings
7. Build message normalization
8. Build session storage (JSONL)
9. Build query loop skeleton
10. Test with simple prompt

---

Generated by comprehensive analysis of ~/claude-code/src
Total files analyzed: 1,898 TypeScript files, 35MB
Analysis depth: Directory structure + hot paths + type mappings + file purposes
