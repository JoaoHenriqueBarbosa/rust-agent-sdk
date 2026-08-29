// Original: src/utils/contextAnalysis.ts
function analyzeContext(messages) {
  let stats = {
    toolRequests: /* @__PURE__ */ new Map,
    toolResults: /* @__PURE__ */ new Map,
    humanMessages: 0,
    assistantMessages: 0,
    localCommandOutputs: 0,
    other: 0,
    attachments: /* @__PURE__ */ new Map,
    duplicateFileReads: /* @__PURE__ */ new Map,
    total: 0
  }, toolIdsToToolNames = /* @__PURE__ */ new Map, readToolIdToFilePath = /* @__PURE__ */ new Map, fileReadStats = /* @__PURE__ */ new Map;
  return messages.forEach((msg) => {
    if (msg.type === "attachment") {
      let type = msg.attachment.type || "unknown";
      stats.attachments.set(type, (stats.attachments.get(type) || 0) + 1);
    }
  }), normalizeMessagesForAPI(messages).forEach((msg) => {
    let { content } = msg.message;
    if (typeof content === "string") {
      let tokens = roughTokenCountEstimation(content);
      if (stats.total += tokens, msg.type === "user" && content.includes("local-command-stdout"))
        stats.localCommandOutputs += tokens;
      else
        stats[msg.type === "user" ? "humanMessages" : "assistantMessages"] += tokens;
    } else
      content.forEach((block2) => processBlock(block2, msg, stats, toolIdsToToolNames, readToolIdToFilePath, fileReadStats));
  }), fileReadStats.forEach((data, path16) => {
    if (data.count > 1) {
      let duplicateTokens = Math.floor(data.totalTokens / data.count) * (data.count - 1);
      stats.duplicateFileReads.set(path16, {
        count: data.count,
        tokens: duplicateTokens
      });
    }
  }), stats;
}
function processBlock(block2, message, stats, toolIds, readToolPaths, fileReads) {
  let tokens = roughTokenCountEstimation(jsonStringify(block2));
  switch (stats.total += tokens, block2.type) {
    case "text":
      if (message.type === "user" && "text" in block2 && block2.text.includes("local-command-stdout"))
        stats.localCommandOutputs += tokens;
      else
        stats[message.type === "user" ? "humanMessages" : "assistantMessages"] += tokens;
      break;
    case "tool_use": {
      if ("name" in block2 && "id" in block2) {
        let toolName = block2.name || "unknown";
        if (increment2(stats.toolRequests, toolName, tokens), toolIds.set(block2.id, toolName), toolName === "Read" && "input" in block2 && block2.input && typeof block2.input === "object" && "file_path" in block2.input) {
          let path16 = String(block2.input.file_path);
          readToolPaths.set(block2.id, path16);
        }
      }
      break;
    }
    case "tool_result": {
      if ("tool_use_id" in block2) {
        let toolName = toolIds.get(block2.tool_use_id) || "unknown";
        if (increment2(stats.toolResults, toolName, tokens), toolName === "Read") {
          let path16 = readToolPaths.get(block2.tool_use_id);
          if (path16) {
            let current = fileReads.get(path16) || { count: 0, totalTokens: 0 };
            fileReads.set(path16, {
              count: current.count + 1,
              totalTokens: current.totalTokens + tokens
            });
          }
        }
      }
      break;
    }
    case "image":
    case "server_tool_use":
    case "web_search_tool_result":
    case "search_result":
    case "document":
    case "thinking":
    case "redacted_thinking":
    case "code_execution_tool_result":
    case "mcp_tool_use":
    case "mcp_tool_result":
    case "container_upload":
    case "web_fetch_tool_result":
    case "bash_code_execution_tool_result":
    case "text_editor_code_execution_tool_result":
    case "tool_search_tool_result":
    case "compaction":
      stats.other += tokens;
      break;
  }
}
function increment2(map7, key2, value) {
  map7.set(key2, (map7.get(key2) || 0) + value);
}
function tokenStatsToStatsigMetrics(stats) {
  let metrics = {
    total_tokens: stats.total,
    human_message_tokens: stats.humanMessages,
    assistant_message_tokens: stats.assistantMessages,
    local_command_output_tokens: stats.localCommandOutputs,
    other_tokens: stats.other
  };
  stats.attachments.forEach((count3, type) => {
    metrics[`attachment_${type}_count`] = count3;
  }), stats.toolRequests.forEach((tokens, tool) => {
    metrics[`tool_request_${tool}_tokens`] = tokens;
  }), stats.toolResults.forEach((tokens, tool) => {
    metrics[`tool_result_${tool}_tokens`] = tokens;
  });
  let duplicateTotal = [...stats.duplicateFileReads.values()].reduce((sum, d) => sum + d.tokens, 0);
  if (metrics.duplicate_read_tokens = duplicateTotal, metrics.duplicate_read_file_count = stats.duplicateFileReads.size, stats.total > 0) {
    metrics.human_message_percent = Math.round(stats.humanMessages / stats.total * 100), metrics.assistant_message_percent = Math.round(stats.assistantMessages / stats.total * 100), metrics.local_command_output_percent = Math.round(stats.localCommandOutputs / stats.total * 100), metrics.duplicate_read_percent = Math.round(duplicateTotal / stats.total * 100);
    let toolRequestTotal = [...stats.toolRequests.values()].reduce((sum, v2) => sum + v2, 0), toolResultTotal = [...stats.toolResults.values()].reduce((sum, v2) => sum + v2, 0);
    metrics.tool_request_percent = Math.round(toolRequestTotal / stats.total * 100), metrics.tool_result_percent = Math.round(toolResultTotal / stats.total * 100), stats.toolRequests.forEach((tokens, tool) => {
      metrics[`tool_request_${tool}_percent`] = Math.round(tokens / stats.total * 100);
    }), stats.toolResults.forEach((tokens, tool) => {
      metrics[`tool_result_${tool}_percent`] = Math.round(tokens / stats.total * 100);
    });
  }
  return metrics;
}
var init_contextAnalysis = __esm(() => {
  init_tokenEstimation();
  init_messages3();
  init_slowOperations();
});
