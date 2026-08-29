// Original: src/ink/devtools.ts
var exports_devtools = {};
var init_devtools = __esm(() => {
  try {
    (()=>{throw new Error("Cannot require module "+"react-devtools-core");})().connectToDevTools({
      host: process.env.REACT_DEVTOOLS_HOST ?? "localhost",
      port: process.env.REACT_DEVTOOLS_PORT ? parseInt(process.env.REACT_DEVTOOLS_PORT, 10) : 8097
    });
  } catch {}
});
