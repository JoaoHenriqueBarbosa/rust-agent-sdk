// function: random
async function random(size) {
  let evenDistCutoff = Math.pow(2, 8) - Math.pow(2, 8) % 66, result = "";
  while (result.length < size) {
    let randomBytes5 = await getRandomValues(size - result.length);
    for (let randomByte of randomBytes5)
      if (randomByte < evenDistCutoff)
        result += "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~"[randomByte % 66];
  }
  return result;
}
