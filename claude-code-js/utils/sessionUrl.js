// Original: src/utils/sessionUrl.ts
import { randomUUID as randomUUID47 } from "crypto";
function parseSessionIdentifier(resumeIdentifier) {
  if (resumeIdentifier.toLowerCase().endsWith(".jsonl"))
    return {
      sessionId: randomUUID47(),
      ingressUrl: null,
      isUrl: !1,
      jsonlFile: resumeIdentifier,
      isJsonlFile: !0
    };
  if (validateUuid2(resumeIdentifier))
    return {
      sessionId: resumeIdentifier,
      ingressUrl: null,
      isUrl: !1,
      jsonlFile: null,
      isJsonlFile: !1
    };
  try {
    let url3 = new URL(resumeIdentifier);
    return {
      sessionId: randomUUID47(),
      ingressUrl: url3.href,
      isUrl: !0,
      jsonlFile: null,
      isJsonlFile: !1
    };
  } catch {}
  return null;
}
var init_sessionUrl = __esm(() => {
  init_uuid();
});
