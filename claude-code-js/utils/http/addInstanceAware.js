// function: addInstanceAware
function addInstanceAware(parameters) {
  if (!parameters.has(INSTANCE_AWARE))
    parameters.set(INSTANCE_AWARE, "true");
}
