// var: readEnv4
var readEnv4 = (env5) => {
  if (typeof globalThis.process < "u")
    return globalThis.process.env?.[env5]?.trim() ?? void 0;
  if (typeof globalThis.Deno < "u")
    return globalThis.Deno.env?.get?.(env5)?.trim();
  return;
};
