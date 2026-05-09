// var: readEnv3
var readEnv3 = (env4) => {
  if (typeof globalThis.process < "u")
    return globalThis.process.env?.[env4]?.trim() ?? void 0;
  if (typeof globalThis.Deno < "u")
    return globalThis.Deno.env?.get?.(env4)?.trim();
  return;
};
