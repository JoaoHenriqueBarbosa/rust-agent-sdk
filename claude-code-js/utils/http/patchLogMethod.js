// function: patchLogMethod
function patchLogMethod(parent, child) {
  child.log = (...args) => {
    parent.log(...args);
  };
}
