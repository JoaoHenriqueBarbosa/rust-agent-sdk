// function: getAtomFeed
function getAtomFeed(feedRoot) {
  var _a4;
  let childs = feedRoot.children, feed = {
    type: "atom",
    items: getElementsByTagName("entry", childs).map((item) => {
      var _a5;
      let { children } = item, entry = { media: getMediaElements(children) };
      addConditionally(entry, "id", "id", children), addConditionally(entry, "title", "title", children);
      let href2 = (_a5 = getOneElement("link", children)) === null || _a5 === void 0 ? void 0 : _a5.attribs.href;
      if (href2)
        entry.link = href2;
      let description = fetch2("summary", children) || fetch2("content", children);
      if (description)
        entry.description = description;
      let pubDate = fetch2("updated", children);
      if (pubDate)
        entry.pubDate = new Date(pubDate);
      return entry;
    })
  };
  addConditionally(feed, "id", "id", childs), addConditionally(feed, "title", "title", childs);
  let href = (_a4 = getOneElement("link", childs)) === null || _a4 === void 0 ? void 0 : _a4.attribs.href;
  if (href)
    feed.link = href;
  addConditionally(feed, "description", "subtitle", childs);
  let updated = fetch2("updated", childs);
  if (updated)
    feed.updated = new Date(updated);
  return addConditionally(feed, "author", "email", childs, !0), feed;
}
