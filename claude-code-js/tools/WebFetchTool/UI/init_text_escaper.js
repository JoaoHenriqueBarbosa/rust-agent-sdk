// var: init_text_escaper
var init_text_escaper = __esm(() => {
  ca = /[<>&\xA0]/g, esca = {
    "\xA0": "&#160;",
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;"
  };
});
