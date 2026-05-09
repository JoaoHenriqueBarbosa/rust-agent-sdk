// function: prefetchSystemContextIfSafe
function prefetchSystemContextIfSafe() {
  if (getIsNonInteractiveSession()) {
    logForDiagnosticsNoPII("info", "prefetch_system_context_non_interactive"), getSystemContext();
    return;
  }
  if (checkHasTrustDialogAccepted())
    logForDiagnosticsNoPII("info", "prefetch_system_context_has_trust"), getSystemContext();
  else
    logForDiagnosticsNoPII("info", "prefetch_system_context_skipped_no_trust");
}
