// Original: src/constants/common.ts
function getLocalISODate() {
  if (process.env.CLAUDE_CODE_OVERRIDE_DATE)
    return process.env.CLAUDE_CODE_OVERRIDE_DATE;
  let now2 = /* @__PURE__ */ new Date, year = now2.getFullYear(), month = String(now2.getMonth() + 1).padStart(2, "0"), day = String(now2.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function getLocalMonthYear() {
  return (process.env.CLAUDE_CODE_OVERRIDE_DATE ? new Date(process.env.CLAUDE_CODE_OVERRIDE_DATE) : /* @__PURE__ */ new Date).toLocaleString("en-US", { month: "long", year: "numeric" });
}
var getSessionStartDate;
var init_common2 = __esm(() => {
  init_memoize();
  getSessionStartDate = memoize_default(getLocalISODate);
});
