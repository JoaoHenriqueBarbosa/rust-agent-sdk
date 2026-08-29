// function: redactUserinfo
function redactUserinfo(raw) {
  return raw.replace(/\/\/[^@/]*@/, "//***:***@");
}
