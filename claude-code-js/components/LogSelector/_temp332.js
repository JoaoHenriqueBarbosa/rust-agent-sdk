// function: _temp332
function _temp332(a2, b) {
  let aTime = new Date(a2.item.log.modified).getTime(), timeDiff = new Date(b.item.log.modified).getTime() - aTime;
  if (Math.abs(timeDiff) > DATE_TIE_THRESHOLD_MS)
    return timeDiff;
  return (a2.score ?? 1) - (b.score ?? 1);
}
