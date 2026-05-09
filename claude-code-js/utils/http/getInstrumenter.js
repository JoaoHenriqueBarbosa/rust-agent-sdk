// function: getInstrumenter
function getInstrumenter() {
  if (!state.instrumenterImplementation)
    state.instrumenterImplementation = createDefaultInstrumenter();
  return state.instrumenterImplementation;
}
