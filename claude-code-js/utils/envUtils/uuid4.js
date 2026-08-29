// var: uuid4
var uuid4 = function() {
  let { crypto: crypto2 } = globalThis;
  if (crypto2?.randomUUID)
    return uuid4 = crypto2.randomUUID.bind(crypto2), crypto2.randomUUID();
  let u8 = new Uint8Array(1), randomByte = crypto2 ? () => crypto2.getRandomValues(u8)[0] : () => Math.random() * 255 & 255;
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) => (+c ^ randomByte() & 15 >> +c / 4).toString(16));
};
