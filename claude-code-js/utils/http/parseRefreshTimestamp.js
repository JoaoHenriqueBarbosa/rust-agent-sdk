// function: parseRefreshTimestamp
function parseRefreshTimestamp(body) {
  if (body.refresh_on) {
    if (typeof body.refresh_on === "number")
      return body.refresh_on * 1000;
    if (typeof body.refresh_on === "string") {
      let asNumber = +body.refresh_on;
      if (!isNaN(asNumber))
        return asNumber * 1000;
      let asDate = Date.parse(body.refresh_on);
      if (!isNaN(asDate))
        return asDate;
    }
    throw Error(`Failed to parse refresh_on from body. refresh_on="${body.refresh_on}"`);
  } else
    return;
}
