// function: callMCPToolWithUrlElicitationRetry
async function callMCPToolWithUrlElicitationRetry({
  client: connectedClient,
  clientConnection,
  tool,
  args,
  meta,
  signal,
  setAppState,
  onProgress,
  callToolFn = callMCPTool,
  handleElicitation
}) {
  for (let attempt = 0;; attempt++)
    try {
      return await callToolFn({
        client: connectedClient,
        tool,
        args,
        meta,
        signal,
        onProgress
      });
    } catch (error44) {
      if (!(error44 instanceof McpError) || error44.code !== ErrorCode.UrlElicitationRequired)
        throw error44;
      if (attempt >= 3)
        throw error44;
      let errorData = error44.data, elicitations = (errorData != null && typeof errorData === "object" && "elicitations" in errorData && Array.isArray(errorData.elicitations) ? errorData.elicitations : []).filter((e) => {
        if (e == null || typeof e !== "object")
          return !1;
        let obj = e;
        return obj.mode === "url" && typeof obj.url === "string" && typeof obj.elicitationId === "string" && typeof obj.message === "string";
      }), serverName = clientConnection.type === "connected" ? clientConnection.name : "unknown";
      if (elicitations.length === 0)
        throw logMCPDebug(serverName, `Tool '${tool}' returned -32042 but no valid elicitations in error data`), error44;
      logMCPDebug(serverName, `Tool '${tool}' requires URL elicitation (error -32042, attempt ${attempt + 1}), processing ${elicitations.length} elicitation(s)`);
      for (let elicitation of elicitations) {
        let { elicitationId } = elicitation, hookResponse = await runElicitationHooks(serverName, elicitation, signal);
        if (hookResponse) {
          if (logMCPDebug(serverName, `URL elicitation ${elicitationId} resolved by hook: ${jsonStringify(hookResponse)}`), hookResponse.action !== "accept")
            return {
              content: `URL elicitation was ${hookResponse.action === "decline" ? "declined" : hookResponse.action + "ed"} by a hook. The tool "${tool}" could not complete because it requires the user to open a URL.`
            };
          continue;
        }
        let userResult;
        if (handleElicitation)
          userResult = await handleElicitation(serverName, elicitation, signal);
        else {
          let waitingState = {
            actionLabel: "Retry now",
            showCancel: !0
          };
          userResult = await new Promise((resolve25) => {
            let onAbort = () => {
              resolve25({ action: "cancel" });
            };
            if (signal.aborted) {
              onAbort();
              return;
            }
            signal.addEventListener("abort", onAbort, { once: !0 }), setAppState((prev) => ({
              ...prev,
              elicitation: {
                queue: [
                  ...prev.elicitation.queue,
                  {
                    serverName,
                    requestId: `error-elicit-${elicitationId}`,
                    params: elicitation,
                    signal,
                    waitingState,
                    respond: (result) => {
                      if (result.action === "accept")
                        return;
                      signal.removeEventListener("abort", onAbort), resolve25(result);
                    },
                    onWaitingDismiss: (action2) => {
                      if (signal.removeEventListener("abort", onAbort), action2 === "retry")
                        resolve25({ action: "accept" });
                      else
                        resolve25({ action: "cancel" });
                    }
                  }
                ]
              }
            }));
          });
        }
        let finalResult = await runElicitationResultHooks(serverName, userResult, signal, "url", elicitationId);
        if (finalResult.action !== "accept")
          return logMCPDebug(serverName, `User ${finalResult.action === "decline" ? "declined" : finalResult.action + "ed"} URL elicitation ${elicitationId}`), {
            content: `URL elicitation was ${finalResult.action === "decline" ? "declined" : finalResult.action + "ed"} by the user. The tool "${tool}" could not complete because it requires the user to open a URL.`
          };
        logMCPDebug(serverName, `Elicitation ${elicitationId} completed, retrying tool call`);
      }
    }
}
