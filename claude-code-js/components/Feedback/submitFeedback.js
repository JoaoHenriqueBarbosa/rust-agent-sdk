// function: submitFeedback
async function submitFeedback(data, signal) {
  if (isEssentialTrafficOnly())
    return {
      success: !1
    };
  try {
    await checkAndRefreshOAuthTokenIfNeeded();
    let authResult = getAuthHeaders();
    if (authResult.error)
      return {
        success: !1
      };
    let headers = {
      "Content-Type": "application/json",
      "User-Agent": getUserAgent(),
      ...authResult.headers
    }, response7 = await axios_default.post("https://api.anthropic.com/api/claude_cli_feedback", {
      content: jsonStringify(data)
    }, {
      headers,
      timeout: 30000,
      signal
    });
    if (response7.status === 200) {
      let result = response7.data;
      if (result?.feedback_id)
        return {
          success: !0,
          feedbackId: result.feedback_id
        };
      return sanitizeAndLogError(Error("Failed to submit feedback: request did not return feedback_id")), {
        success: !1
      };
    }
    return sanitizeAndLogError(Error("Failed to submit feedback:" + response7.status)), {
      success: !1
    };
  } catch (err2) {
    if (axios_default.isCancel(err2))
      return {
        success: !1
      };
    if (axios_default.isAxiosError(err2) && err2.response?.status === 403) {
      let errorData = err2.response.data;
      if (errorData?.error?.type === "permission_error" && errorData?.error?.message?.includes("Custom data retention settings"))
        return sanitizeAndLogError(Error("Cannot submit feedback because custom data retention settings are enabled")), {
          success: !1,
          isZdrOrg: !0
        };
    }
    return sanitizeAndLogError(err2), {
      success: !1
    };
  }
}
