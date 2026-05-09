// Original: src/context/modalContext.tsx
function useIsInsideModal() {
  return import_react40.useContext(ModalContext) !== null;
}
function useModalOrTerminalSize(fallback) {
  let $3 = import_compiler_runtime29.c(3), ctx = import_react40.useContext(ModalContext), t0;
  if ($3[0] !== ctx || $3[1] !== fallback)
    t0 = ctx ? {
      rows: ctx.rows,
      columns: ctx.columns
    } : fallback, $3[0] = ctx, $3[1] = fallback, $3[2] = t0;
  else
    t0 = $3[2];
  return t0;
}
function useModalScrollRef() {
  return import_react40.useContext(ModalContext)?.scrollRef ?? null;
}
var import_compiler_runtime29, import_react40, ModalContext;
var init_modalContext = __esm(() => {
  import_compiler_runtime29 = __toESM(require_react_compiler_runtime_development(), 1), import_react40 = __toESM(require_react_development(), 1), ModalContext = import_react40.createContext(null);
});
