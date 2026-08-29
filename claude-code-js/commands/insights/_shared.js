// Shared module state and imports
// Original: src/commands/insights.ts
__export(exports_insights, {
  generateUsageReport: () => generateUsageReport,
  detectMultiClauding: () => detectMultiClauding,
  default: () => insights_default,
  deduplicateSessionBranches: () => deduplicateSessionBranches,
  buildExportData: () => buildExportData
});
import {
  mkdir as mkdir36,
  readdir as readdir26,
  readFile as readFile50,
  unlink as unlink19,
  writeFile as writeFile42
} from "fs/promises";
import { extname as extname12, join as join133 } from "path";
var EXTENSION_TO_LANGUAGE, LABEL_MAP, FACET_EXTRACTION_PROMPT = `Analyze this Claude Code session and extract structured facets.

CRITICAL GUIDELINES:

1. **goal_categories**: Count ONLY what the USER explicitly asked for.
   - DO NOT count Claude's autonomous codebase exploration
   - DO NOT count work Claude decided to do on its own
   - ONLY count when user says "can you...", "please...", "I need...", "let's..."

2. **user_satisfaction_counts**: Base ONLY on explicit user signals.
   - "Yay!", "great!", "perfect!" \u2192 happy
   - "thanks", "looks good", "that works" \u2192 satisfied
   - "ok, now let's..." (continuing without complaint) \u2192 likely_satisfied
   - "that's not right", "try again" \u2192 dissatisfied
   - "this is broken", "I give up" \u2192 frustrated

3. **friction_counts**: Be specific about what went wrong.
   - misunderstood_request: Claude interpreted incorrectly
   - wrong_approach: Right goal, wrong solution method
   - buggy_code: Code didn't work correctly
   - user_rejected_action: User said no/stop to a tool call
   - excessive_changes: Over-engineered or changed too much

4. If very short or just warmup, use warmup_minimal for goal_category

SESSION:
`, SUMMARIZE_CHUNK_PROMPT = `Summarize this portion of a Claude Code session transcript. Focus on:
1. What the user asked for
2. What Claude did (tools used, files modified)
3. Any friction or issues
4. The outcome

Keep it concise - 3-5 sentences. Preserve specific details like file names, error messages, and user feedback.

TRANSCRIPT CHUNK:
`, INSIGHT_SECTIONS, SATISFACTION_ORDER, OUTCOME_ORDER, usageReport, insights_default;

