// var: readEnv
var readEnv = (env) => {
  if (typeof globalThis.process < "u")
    return globalThis.process.env?.[env]?.trim() ?? void 0;
  if (typeof globalThis.Deno < "u")
    return globalThis.Deno.env?.get?.(env)?.trim();
  return;
};
