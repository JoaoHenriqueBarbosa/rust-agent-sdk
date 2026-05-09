// Original: src/ink/measure-element.ts
var measureElement = (node) => ({
  width: node.yogaNode?.getComputedWidth() ?? 0,
  height: node.yogaNode?.getComputedHeight() ?? 0
}), measure_element_default;
var init_measure_element = __esm(() => {
  measure_element_default = measureElement;
});
