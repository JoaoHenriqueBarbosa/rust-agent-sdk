// Original: src/utils/cronTasks.ts
import { join as join47 } from "path";
var CRON_FILE_REL, DEFAULT_CRON_JITTER_CONFIG;
var init_cronTasks = __esm(() => {
  init_state();
  init_cron();
  init_debug();
  init_errors();
  init_fsOperations();
  init_json();
  init_log3();
  init_slowOperations();
  CRON_FILE_REL = join47(".claude", "scheduled_tasks.json"), DEFAULT_CRON_JITTER_CONFIG = {
    recurringFrac: 0.1,
    recurringCapMs: 900000,
    oneShotMaxMs: 90000,
    oneShotFloorMs: 0,
    oneShotMinuteMod: 30,
    recurringMaxAgeMs: 604800000
  };
});
