// function: parseFeed
function parseFeed(feed, options2 = parseFeedDefaultOptions) {
  return getFeed(parseDOM(feed, options2));
}
