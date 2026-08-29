// function: classifyAxiosError
function classifyAxiosError(e) {
  let message = errorMessage(e);
  if (!e || typeof e !== "object" || !("isAxiosError" in e) || !e.isAxiosError)
    return { kind: "other", message };
  let err = e, status = err.response?.status;
  if (status === 401 || status === 403)
    return { kind: "auth", status, message };
  if (err.code === "ECONNABORTED")
    return { kind: "timeout", status, message };
  if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND")
    return { kind: "network", status, message };
  return { kind: "http", status, message };
}
