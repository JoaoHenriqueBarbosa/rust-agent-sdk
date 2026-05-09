// function: wrapWithOsc8Link
function wrapWithOsc8Link(text, url3) {
  return `${OSC2}8;;${url3}${BEL2}${text}${OSC2}8;;${BEL2}`;
}
