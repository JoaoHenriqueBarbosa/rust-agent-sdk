// function: getErrorMessage2
function getErrorMessage2(e) {
  if (isError(e))
    return e.message;
  else {
    let stringified;
    try {
      if (typeof e === "object" && e)
        stringified = JSON.stringify(e);
      else
        stringified = String(e);
    } catch (err) {
      stringified = "[unable to stringify input]";
    }
    return `Unknown error ${stringified}`;
  }
}
