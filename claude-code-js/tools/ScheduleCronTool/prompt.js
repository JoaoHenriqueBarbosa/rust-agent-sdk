// Original: src/tools/ScheduleCronTool/prompt.ts
var DEFAULT_MAX_AGE_DAYS;
var init_prompt11 = __esm(() => {
  init_cronTasks();
  init_envUtils();
  DEFAULT_MAX_AGE_DAYS = DEFAULT_CRON_JITTER_CONFIG.recurringMaxAgeMs / 86400000;
});
