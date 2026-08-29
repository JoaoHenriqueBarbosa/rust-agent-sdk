// function: makeGetter
function makeGetter(requiredVersion, instance, fallback) {
  return (version5) => version5 === requiredVersion ? instance : fallback;
}
