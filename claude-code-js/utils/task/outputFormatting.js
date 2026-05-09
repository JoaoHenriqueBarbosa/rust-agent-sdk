// Original: src/utils/task/outputFormatting.ts
function getMaxTaskOutputLength() {
  return validateBoundedIntEnvVar("TASK_MAX_OUTPUT_LENGTH", process.env.TASK_MAX_OUTPUT_LENGTH, TASK_MAX_OUTPUT_DEFAULT, TASK_MAX_OUTPUT_UPPER_LIMIT).effective;
}
function formatTaskOutput(output, taskId) {
  let maxLen = getMaxTaskOutputLength();
  if (output.length <= maxLen)
    return { content: output, wasTruncated: !1 };
  let header = `[Truncated. Full output: ${getTaskOutputPath(taskId)}]

`, availableSpace = maxLen - header.length, truncated = output.slice(-availableSpace);
  return { content: header + truncated, wasTruncated: !0 };
}
var TASK_MAX_OUTPUT_UPPER_LIMIT = 160000, TASK_MAX_OUTPUT_DEFAULT = 32000;
var init_outputFormatting = __esm(() => {
  init_envValidation();
  init_diskOutput();
});
