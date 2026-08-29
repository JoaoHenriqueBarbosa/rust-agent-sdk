// function: randomString
function randomString(length = 10) {
  let str = "";
  for (let i = 0;i < length; i++)
    str += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
  return str;
}
