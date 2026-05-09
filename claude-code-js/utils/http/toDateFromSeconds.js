// function: toDateFromSeconds
function toDateFromSeconds(seconds) {
  if (seconds)
    return new Date(Number(seconds) * 1000);
  return /* @__PURE__ */ new Date;
}
