// Shared module state and imports
// Original: src/utils/attachments.ts
import { readdir as readdir15, stat as stat29 } from "fs/promises";
import { dirname as dirname39, parse as parse17, relative as relative19, resolve as resolve35 } from "path";
import { randomUUID as randomUUID21 } from "crypto";
async function* getAttachmentMessages(input, toolUseContext, ideSelection, queuedCommands, messages, querySource, options2) {
  let attachments = await getAttachments(input, toolUseContext, ideSelection, queuedCommands, messages, querySource, options2);
  if (attachments.length === 0)
    return;
  logEvent("tengu_attachments", {
    attachment_types: attachments.map((_) => _.type)
  });
  for (let attachment of attachments)
    yield createAttachmentMessage(attachment);
}
var BRIEF_TOOL_NAME5, TODO_REMINDER_CONFIG, PLAN_MODE_ATTACHMENT_CONFIG, MAX_MEMORY_LINES = 200, MAX_MEMORY_BYTES = 4096, RELEVANT_MEMORIES_CONFIG, VERIFY_PLAN_REMINDER_CONFIG, INLINE_NOTIFICATION_MODES, sentSkillNames, suppressNext = !1;

