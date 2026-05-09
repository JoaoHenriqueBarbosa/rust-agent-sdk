// var: init_server
var init_server = __esm(() => {
  canPromise = require_can_promise(), QRCode = require_qrcode(), PngRenderer = require_png2(), Utf8Renderer = require_utf8(), TerminalRenderer = require_terminal2(), SvgRenderer = require_svg2();
  $create = QRCode.create, $toCanvas = require_browser2().toCanvas;
});
