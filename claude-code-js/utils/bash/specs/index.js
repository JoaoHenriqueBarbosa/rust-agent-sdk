// Original: src/utils/bash/specs/index.ts
var specs_default;
var init_specs = __esm(() => {
  init_alias();
  init_nohup();
  init_pyright();
  init_sleep();
  init_srun();
  init_time();
  init_timeout2();
  specs_default = [
    pyright_default,
    timeout_default,
    sleep_default,
    alias_default,
    nohup_default,
    time_default,
    srun_default
  ];
});
