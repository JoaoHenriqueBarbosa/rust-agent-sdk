// Original: src/utils/controlMessageCompat.ts
function normalizeControlMessageKeys(obj) {
  if (obj === null || typeof obj !== "object")
    return obj;
  let record3 = obj;
  if ("requestId" in record3 && !("request_id" in record3))
    record3.request_id = record3.requestId, delete record3.requestId;
  if ("response" in record3 && record3.response !== null && typeof record3.response === "object") {
    let response7 = record3.response;
    if ("requestId" in response7 && !("request_id" in response7))
      response7.request_id = response7.requestId, delete response7.requestId;
  }
  return obj;
}
