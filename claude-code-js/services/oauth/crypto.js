// Original: src/services/oauth/crypto.ts
import { createHash as createHash13, randomBytes as randomBytes9 } from "crypto";
function base64URLEncode(buffer) {
  return buffer.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
function generateCodeVerifier() {
  return base64URLEncode(randomBytes9(32));
}
function generateCodeChallenge(verifier) {
  let hash = createHash13("sha256");
  return hash.update(verifier), base64URLEncode(hash.digest());
}
function generateState() {
  return base64URLEncode(randomBytes9(32));
}
var init_crypto8 = () => {};
