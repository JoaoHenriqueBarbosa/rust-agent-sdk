// function: generateChallenge
async function generateChallenge(code_verifier) {
  let buffer = await (await crypto11).subtle.digest("SHA-256", (/* @__PURE__ */ new TextEncoder()).encode(code_verifier));
  return btoa(String.fromCharCode(...new Uint8Array(buffer))).replace(/\//g, "_").replace(/\+/g, "-").replace(/=/g, "");
}
