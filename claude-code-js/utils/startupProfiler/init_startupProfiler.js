// var: init_startupProfiler
var init_startupProfiler = __esm(() => {
  init_state();
  init_debug();
  init_envUtils();
  init_fsOperations();
  init_profilerBase();
  init_slowOperations();
  DETAILED_PROFILING = isEnvTruthy(process.env.CLAUDE_CODE_PROFILE_STARTUP), STATSIG_LOGGING_SAMPLED = Math.random() < STATSIG_SAMPLE_RATE, SHOULD_PROFILE = DETAILED_PROFILING || STATSIG_LOGGING_SAMPLED, memorySnapshots = [], PHASE_DEFINITIONS = {
    import_time: ["cli_entry", "main_tsx_imports_loaded"],
    init_time: ["init_function_start", "init_function_end"],
    settings_time: ["eagerLoadSettings_start", "eagerLoadSettings_end"],
    total_time: ["cli_entry", "main_after_run"]
  };
  if (SHOULD_PROFILE)
    profileCheckpoint("profiler_initialized");
});
