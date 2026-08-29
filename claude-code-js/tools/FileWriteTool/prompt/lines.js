// function: lines
function lines({ items, width, renderItem, active, position: requested, pageSize }) {
  let layouts = items.map((item, index) => ({
    item,
    index,
    isActive: index === active
  })), layoutsInPage = rotate(active - requested, layouts).slice(0, pageSize), renderItemAt = (index) => layoutsInPage[index] == null ? [] : split(renderItem(layoutsInPage[index]), width), pageBuffer = Array.from({ length: pageSize }), activeItem = renderItemAt(requested).slice(0, pageSize), position = requested + activeItem.length <= pageSize ? requested : pageSize - activeItem.length;
  pageBuffer.splice(position, activeItem.length, ...activeItem);
  let bufferPointer = position + activeItem.length, layoutPointer = requested + 1;
  while (bufferPointer < pageSize && layoutPointer < layoutsInPage.length) {
    for (let line of renderItemAt(layoutPointer))
      if (pageBuffer[bufferPointer++] = line, bufferPointer >= pageSize)
        break;
    layoutPointer++;
  }
  bufferPointer = position - 1, layoutPointer = requested - 1;
  while (bufferPointer >= 0 && layoutPointer >= 0) {
    for (let line of renderItemAt(layoutPointer).reverse())
      if (pageBuffer[bufferPointer--] = line, bufferPointer < 0)
        break;
    layoutPointer--;
  }
  return pageBuffer.filter((line) => typeof line === "string");
}
