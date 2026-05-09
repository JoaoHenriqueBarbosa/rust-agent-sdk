// var: init_teammateMailbox
var init_teammateMailbox = __esm(() => {
  init_v4();
  init_xml();
  init_coreSchemas();
  init_debug();
  init_envUtils();
  init_errors();
  init_log3();
  init_slowOperations();
  init_tasks();
  init_teammate();
  LOCK_OPTIONS2 = {
    retries: {
      retries: 10,
      minTimeout: 5,
      maxTimeout: 100
    }
  };
  PlanApprovalRequestMessageSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("plan_approval_request"),
    from: exports_external.string(),
    timestamp: exports_external.string(),
    planFilePath: exports_external.string(),
    planContent: exports_external.string(),
    requestId: exports_external.string()
  })), PlanApprovalResponseMessageSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("plan_approval_response"),
    requestId: exports_external.string(),
    approved: exports_external.boolean(),
    feedback: exports_external.string().optional(),
    timestamp: exports_external.string(),
    permissionMode: PermissionModeSchema().optional()
  })), ShutdownRequestMessageSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("shutdown_request"),
    requestId: exports_external.string(),
    from: exports_external.string(),
    reason: exports_external.string().optional(),
    timestamp: exports_external.string()
  })), ShutdownApprovedMessageSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("shutdown_approved"),
    requestId: exports_external.string(),
    from: exports_external.string(),
    timestamp: exports_external.string(),
    paneId: exports_external.string().optional(),
    backendType: exports_external.string().optional()
  })), ShutdownRejectedMessageSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("shutdown_rejected"),
    requestId: exports_external.string(),
    from: exports_external.string(),
    reason: exports_external.string(),
    timestamp: exports_external.string()
  }));
  ModeSetRequestMessageSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("mode_set_request"),
    mode: PermissionModeSchema(),
    from: exports_external.string()
  }));
});
