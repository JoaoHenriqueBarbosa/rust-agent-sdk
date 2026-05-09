// function: getRssFeed
function getRssFeed(feedRoot) {
  var _a4, _b2;
  let childs = (_b2 = (_a4 = getOneElement("channel", feedRoot.children)) === null || _a4 === void 0 ? void 0 : _a4.children) !== null && _b2 !== void 0 ? _b2 : [], feed = {
    type: feedRoot.name.substr(0, 3),
    id: "",
    items: getElementsByTagName("item", feedRoot.children).map((item) => {
      let { children } = item, entry = { media: getMediaElements(children) };
      addConditionally(entry, "id", "guid", children), addConditionally(entry, "title", "title", children), addConditionally(entry, "link", "link", children), addConditionally(entry, "description", "description", children);
      let pubDate = fetch2("pubDate", children) || fetch2("dc:date", children);
      if (pubDate)
        entry.pubDate = new Date(pubDate);
      return entry;
    })
  };
  addConditionally(feed, "title", "title", childs), addConditionally(feed, "link", "link", childs), addConditionally(feed, "description", "description", childs);
  let updated = fetch2("lastBuildDate", childs);
  if (updated)
    feed.updated = new Date(updated);
  return addConditionally(feed, "author", "managingEditor", childs, !0), feed;
}
