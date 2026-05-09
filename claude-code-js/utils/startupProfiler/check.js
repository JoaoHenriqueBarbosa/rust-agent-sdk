// function: check
function check(fn) {
  let ch = new $ZodCheck({
    check: "custom"
  });
  return ch._zod.check = fn, ch;
}
