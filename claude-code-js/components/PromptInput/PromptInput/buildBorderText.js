// function: buildBorderText
function buildBorderText(showFastIcon, showFastIconHint, fastModeCooldown) {
  if (!showFastIcon)
    return;
  return {
    content: ` ${showFastIconHint ? `${getFastIconString(!0, fastModeCooldown)} ${source_default.dim("/fast")}` : getFastIconString(!0, fastModeCooldown)} `,
    position: "top",
    align: "end",
    offset: 0
  };
}
