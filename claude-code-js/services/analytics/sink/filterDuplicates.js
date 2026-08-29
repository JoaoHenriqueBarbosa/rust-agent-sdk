// var: filterDuplicates
var filterDuplicates = (stdioItems) => stdioItems.filter((stdioItemOne, indexOne) => stdioItems.every((stdioItemTwo, indexTwo) => stdioItemOne.value !== stdioItemTwo.value || indexOne >= indexTwo || stdioItemOne.type === "generator" || stdioItemOne.type === "asyncGenerator")), getDuplicateStream = ({ stdioItem: { type, value, optionName }, direction, fileDescriptors, isSync }) => {
  let otherStdioItems = getOtherStdioItems(fileDescriptors, type);
  if (otherStdioItems.length === 0)
    return;
  if (isSync) {
    validateDuplicateStreamSync({
      otherStdioItems,
      type,
      value,
      optionName,
      direction
    });
    return;
  }
  if (SPECIAL_DUPLICATE_TYPES.has(type))
    return getDuplicateStreamInstance({
      otherStdioItems,
      type,
      value,
      optionName,
      direction
    });
  if (FORBID_DUPLICATE_TYPES.has(type))
    validateDuplicateTransform({
      otherStdioItems,
      type,
      value,
      optionName
    });
}, getOtherStdioItems = (fileDescriptors, type) => fileDescriptors.flatMap(({ direction, stdioItems }) => stdioItems.filter((stdioItem) => stdioItem.type === type).map((stdioItem) => ({ ...stdioItem, direction }))), validateDuplicateStreamSync = ({ otherStdioItems, type, value, optionName, direction }) => {
  if (SPECIAL_DUPLICATE_TYPES_SYNC.has(type))
    getDuplicateStreamInstance({
      otherStdioItems,
      type,
      value,
      optionName,
      direction
    });
}, getDuplicateStreamInstance = ({ otherStdioItems, type, value, optionName, direction }) => {
  let duplicateStdioItems = otherStdioItems.filter((stdioItem) => hasSameValue(stdioItem, value));
  if (duplicateStdioItems.length === 0)
    return;
  let differentStdioItem = duplicateStdioItems.find((stdioItem) => stdioItem.direction !== direction);
  return throwOnDuplicateStream(differentStdioItem, optionName, type), direction === "output" ? duplicateStdioItems[0].stream : void 0;
}, hasSameValue = ({ type, value }, secondValue) => {
  if (type === "filePath")
    return value.file === secondValue.file;
  if (type === "fileUrl")
    return value.href === secondValue.href;
  return value === secondValue;
}, validateDuplicateTransform = ({ otherStdioItems, type, value, optionName }) => {
  let duplicateStdioItem = otherStdioItems.find(({ value: { transform: transform2 } }) => transform2 === value.transform);
  throwOnDuplicateStream(duplicateStdioItem, optionName, type);
}, throwOnDuplicateStream = (stdioItem, optionName, type) => {
  if (stdioItem !== void 0)
    throw TypeError(`The \`${stdioItem.optionName}\` and \`${optionName}\` options must not target ${TYPE_TO_MESSAGE[type]} that is the same.`);
};
