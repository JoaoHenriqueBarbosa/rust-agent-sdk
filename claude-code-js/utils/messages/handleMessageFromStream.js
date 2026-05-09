// function: handleMessageFromStream
function handleMessageFromStream(message, onMessage2, onUpdateLength, onSetStreamMode, onStreamingToolUses, onTombstone, onStreamingThinking, onApiMetrics, onStreamingText) {
  if (message.type !== "stream_event" && message.type !== "stream_request_start") {
    if (message.type === "tombstone") {
      onTombstone?.(message.message);
      return;
    }
    if (message.type === "tool_use_summary")
      return;
    if (message.type === "assistant") {
      let thinkingBlock = message.message.content.find((block2) => block2.type === "thinking");
      if (thinkingBlock && thinkingBlock.type === "thinking")
        onStreamingThinking?.(() => ({
          thinking: thinkingBlock.thinking,
          isStreaming: !1,
          streamingEndedAt: Date.now()
        }));
    }
    onStreamingText?.(() => null), onMessage2(message);
    return;
  }
  if (message.type === "stream_request_start") {
    onSetStreamMode("requesting");
    return;
  }
  if (message.event.type === "message_start") {
    if (message.ttftMs != null)
      onApiMetrics?.({ ttftMs: message.ttftMs });
  }
  if (message.event.type === "message_stop") {
    onSetStreamMode("tool-use"), onStreamingToolUses(() => []);
    return;
  }
  switch (message.event.type) {
    case "content_block_start":
      switch (onStreamingText?.(() => null), message.event.content_block.type) {
        case "thinking":
        case "redacted_thinking":
          onSetStreamMode("thinking");
          return;
        case "text":
          onSetStreamMode("responding");
          return;
        case "tool_use": {
          onSetStreamMode("tool-input");
          let contentBlock = message.event.content_block, index = message.event.index;
          onStreamingToolUses((_) => [
            ..._,
            {
              index,
              contentBlock,
              unparsedToolInput: ""
            }
          ]);
          return;
        }
        case "server_tool_use":
        case "web_search_tool_result":
        case "code_execution_tool_result":
        case "mcp_tool_use":
        case "mcp_tool_result":
        case "container_upload":
        case "web_fetch_tool_result":
        case "bash_code_execution_tool_result":
        case "text_editor_code_execution_tool_result":
        case "tool_search_tool_result":
        case "compaction":
          onSetStreamMode("tool-input");
          return;
      }
      return;
    case "content_block_delta":
      switch (message.event.delta.type) {
        case "text_delta": {
          let deltaText = message.event.delta.text;
          onUpdateLength(deltaText), onStreamingText?.((text2) => (text2 ?? "") + deltaText);
          return;
        }
        case "input_json_delta": {
          let delta = message.event.delta.partial_json, index = message.event.index;
          onUpdateLength(delta), onStreamingToolUses((_) => {
            let element = _.find((_2) => _2.index === index);
            if (!element)
              return _;
            return [
              ..._.filter((_2) => _2 !== element),
              {
                ...element,
                unparsedToolInput: element.unparsedToolInput + delta
              }
            ];
          });
          return;
        }
        case "thinking_delta":
          onUpdateLength(message.event.delta.thinking);
          return;
        case "signature_delta":
          return;
        default:
          return;
      }
    case "content_block_stop":
      return;
    case "message_delta":
      onSetStreamMode("responding");
      return;
    default:
      onSetStreamMode("responding");
      return;
  }
}
