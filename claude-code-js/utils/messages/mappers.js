// Original: src/utils/messages/mappers.ts
import { randomUUID as randomUUID24 } from "crypto";
function toInternalMessages(messages) {
  return messages.flatMap((message) => {
    switch (message.type) {
      case "assistant":
        return [
          {
            type: "assistant",
            message: message.message,
            uuid: message.uuid,
            requestId: void 0,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          }
        ];
      case "user":
        return [
          {
            type: "user",
            message: message.message,
            uuid: message.uuid ?? randomUUID24(),
            timestamp: message.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
            isMeta: message.isSynthetic
          }
        ];
      case "system":
        if (message.subtype === "compact_boundary")
          return [
            {
              type: "system",
              content: "Conversation compacted",
              level: "info",
              subtype: "compact_boundary",
              compactMetadata: fromSDKCompactMetadata(message.compact_metadata),
              uuid: message.uuid,
              timestamp: (/* @__PURE__ */ new Date()).toISOString()
            }
          ];
        return [];
      default:
        return [];
    }
  });
}
function toSDKCompactMetadata(meta) {
  let seg = meta.preservedSegment;
  return {
    trigger: meta.trigger,
    pre_tokens: meta.preTokens,
    ...seg && {
      preserved_segment: {
        head_uuid: seg.headUuid,
        anchor_uuid: seg.anchorUuid,
        tail_uuid: seg.tailUuid
      }
    }
  };
}
function fromSDKCompactMetadata(meta) {
  let seg = meta.preserved_segment;
  return {
    trigger: meta.trigger,
    preTokens: meta.pre_tokens,
    ...seg && {
      preservedSegment: {
        headUuid: seg.head_uuid,
        anchorUuid: seg.anchor_uuid,
        tailUuid: seg.tail_uuid
      }
    }
  };
}
function localCommandOutputToSDKAssistantMessage(rawContent2, uuid8) {
  let cleanContent = stripAnsi(rawContent2).replace(/<local-command-stdout>([\s\S]*?)<\/local-command-stdout>/, "$1").replace(/<local-command-stderr>([\s\S]*?)<\/local-command-stderr>/, "$1").trim();
  return {
    type: "assistant",
    message: createAssistantMessage({ content: cleanContent }).message,
    parent_tool_use_id: null,
    session_id: getSessionId(),
    uuid: uuid8
  };
}
function toSDKRateLimitInfo(limits) {
  if (!limits)
    return;
  return {
    status: limits.status,
    ...limits.resetsAt !== void 0 && { resetsAt: limits.resetsAt },
    ...limits.rateLimitType !== void 0 && {
      rateLimitType: limits.rateLimitType
    },
    ...limits.utilization !== void 0 && {
      utilization: limits.utilization
    },
    ...limits.overageStatus !== void 0 && {
      overageStatus: limits.overageStatus
    },
    ...limits.overageResetsAt !== void 0 && {
      overageResetsAt: limits.overageResetsAt
    },
    ...limits.overageDisabledReason !== void 0 && {
      overageDisabledReason: limits.overageDisabledReason
    },
    ...limits.isUsingOverage !== void 0 && {
      isUsingOverage: limits.isUsingOverage
    },
    ...limits.surpassedThreshold !== void 0 && {
      surpassedThreshold: limits.surpassedThreshold
    }
  };
}
var init_mappers = __esm(() => {
  init_state();
  init_xml();
  init_strip_ansi();
  init_messages3();
  init_plans();
});
