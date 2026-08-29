// var: getArrayIfSingleItem3
var getArrayIfSingleItem3 = (mayBeArray) => Array.isArray(mayBeArray) ? mayBeArray : [mayBeArray];

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/smithy-client/dist-es/get-value-from-text-node.js
var getValueFromTextNode3 = (obj) => {
  for (let key in obj)
    if (obj.hasOwnProperty(key) && obj[key]["#text"] !== void 0)
      obj[key] = obj[key]["#text"];
    else if (typeof obj[key] === "object" && obj[key] !== null)
      obj[key] = getValueFromTextNode3(obj[key]);
  return obj;
};
