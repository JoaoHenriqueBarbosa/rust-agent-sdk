// var: getArrayIfSingleItem2
var getArrayIfSingleItem2 = (mayBeArray) => Array.isArray(mayBeArray) ? mayBeArray : [mayBeArray];

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/smithy-client/dist-es/get-value-from-text-node.js
var getValueFromTextNode2 = (obj) => {
  for (let key in obj)
    if (obj.hasOwnProperty(key) && obj[key]["#text"] !== void 0)
      obj[key] = obj[key]["#text"];
    else if (typeof obj[key] === "object" && obj[key] !== null)
      obj[key] = getValueFromTextNode2(obj[key]);
  return obj;
};
