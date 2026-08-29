// function: normalize10
function normalize10(name3) {
  return name3.replace(/([a-z])([A-Z])/g, "$1_$2").replace(/-/g, "_").toLowerCase();
}
