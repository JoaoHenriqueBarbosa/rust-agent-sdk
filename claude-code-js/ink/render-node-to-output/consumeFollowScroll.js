// function: consumeFollowScroll
function consumeFollowScroll() {
  let f = followScroll;
  return followScroll = null, f;
}
