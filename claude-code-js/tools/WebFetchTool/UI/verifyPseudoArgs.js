// function: verifyPseudoArgs
function verifyPseudoArgs(func, name3, subselect, argIndex) {
  if (subselect === null) {
    if (func.length > argIndex)
      throw Error(`Pseudo-class :${name3} requires an argument`);
  } else if (func.length === argIndex)
    throw Error(`Pseudo-class :${name3} doesn't have any arguments`);
}
