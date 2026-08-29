// function: buildCharToSegmentMap
function buildCharToSegmentMap(segments) {
  let map7 = [];
  for (let i4 = 0;i4 < segments.length; i4++) {
    let len = segments[i4].text.length;
    for (let j4 = 0;j4 < len; j4++)
      map7.push(i4);
  }
  return map7;
}
