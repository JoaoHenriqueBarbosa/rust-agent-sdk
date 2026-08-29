// function: maybeDumpStateForDebug
function maybeDumpStateForDebug(state3) {
  if (ENABLE_DUMP_STATE)
    console.error(inspect4(state3, !1, 5));
}
