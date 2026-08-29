// function: setSku
function setSku(params) {
  let { skuArr, index, skuName, skuVersion } = params;
  if (index >= skuArr.length)
    return;
  skuArr[index] = [skuName, skuVersion].join(skuValueSeparator);
}
