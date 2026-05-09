// function: getFeed
function getFeed(doc2) {
  let feedRoot = getOneElement(isValidFeed, doc2);
  return !feedRoot ? null : feedRoot.name === "feed" ? getAtomFeed(feedRoot) : getRssFeed(feedRoot);
}
