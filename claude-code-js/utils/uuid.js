// Original: src/utils/uuid.ts
import { randomBytes as randomBytes7 } from "crypto";
function validateUuid2(maybeUuid) {
  if (typeof maybeUuid !== "string")
    return null;
  return uuidRegex3.test(maybeUuid) ? maybeUuid : null;
}
function createAgentId(label) {
  let suffix = randomBytes7(8).toString("hex");
  return label ? `a${label}-${suffix}` : `a${suffix}`;
}
var uuidRegex3;
var init_uuid = __esm(() => {
  uuidRegex3 = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
});
