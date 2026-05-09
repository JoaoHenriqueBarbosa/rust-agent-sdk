// Original: src/commands/doctor/index.ts
var doctor, doctor_default;
var init_doctor2 = __esm(() => {
  init_envUtils();
  doctor = {
    name: "doctor",
    description: "Diagnose and verify your Claude Code installation and settings",
    isEnabled: () => !isEnvTruthy(process.env.DISABLE_DOCTOR_COMMAND),
    type: "local-jsx",
    load: () => Promise.resolve().then(() => (init_doctor(), exports_doctor))
  }, doctor_default = doctor;
});
