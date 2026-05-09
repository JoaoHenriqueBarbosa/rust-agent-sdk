// function: getMediaElements
function getMediaElements(where) {
  return getElementsByTagName("media:content", where).map((elem) => {
    let { attribs } = elem, media = {
      medium: attribs.medium,
      isDefault: !!attribs.isDefault
    };
    for (let attrib of MEDIA_KEYS_STRING)
      if (attribs[attrib])
        media[attrib] = attribs[attrib];
    for (let attrib of MEDIA_KEYS_INT)
      if (attribs[attrib])
        media[attrib] = parseInt(attribs[attrib], 10);
    if (attribs.expression)
      media.expression = attribs.expression;
    return media;
  });
}
