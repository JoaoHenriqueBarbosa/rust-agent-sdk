// function: MailboxProvider
function MailboxProvider(t0) {
  let $3 = import_compiler_runtime18.c(3), {
    children
  } = t0, t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = new Mailbox, $3[0] = t1;
  else
    t1 = $3[0];
  let mailbox = t1, t2;
  if ($3[1] !== children)
    t2 = /* @__PURE__ */ jsx_dev_runtime21.jsxDEV(MailboxContext.Provider, {
      value: mailbox,
      children
    }, void 0, !1, void 0, this), $3[1] = children, $3[2] = t2;
  else
    t2 = $3[2];
  return t2;
}
