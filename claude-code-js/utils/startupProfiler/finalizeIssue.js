// function: finalizeIssue
function finalizeIssue(iss, ctx, config2) {
  let full = { ...iss, path: iss.path ?? [] };
  if (!iss.message) {
    let message = unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config2.customError?.(iss)) ?? unwrapMessage(config2.localeError?.(iss)) ?? "Invalid input";
    full.message = message;
  }
  if (delete full.inst, delete full.continue, !ctx?.reportInput)
    delete full.input;
  return full;
}
