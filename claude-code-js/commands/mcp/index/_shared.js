// Shared module state and imports
// Original: src/commands/mcp/index.ts
var mcp, mcp_default;

// node_modules/qrcode/lib/can-promise.js

// node_modules/qrcode/lib/core/utils.js

// node_modules/qrcode/lib/core/error-correction-level.js

// node_modules/qrcode/lib/core/bit-buffer.js

// node_modules/qrcode/lib/core/bit-matrix.js

// node_modules/qrcode/lib/core/alignment-pattern.js

// node_modules/qrcode/lib/core/finder-pattern.js

// node_modules/qrcode/lib/core/mask-pattern.js

// node_modules/qrcode/lib/core/error-correction-code.js

// node_modules/qrcode/lib/core/galois-field.js

// node_modules/qrcode/lib/core/polynomial.js

// node_modules/qrcode/lib/core/reed-solomon-encoder.js

// node_modules/qrcode/lib/core/version-check.js

// node_modules/qrcode/lib/core/regex.js

// node_modules/qrcode/lib/core/mode.js

// node_modules/qrcode/lib/core/version.js

// node_modules/qrcode/lib/core/format-info.js

// node_modules/qrcode/lib/core/numeric-data.js

// node_modules/qrcode/lib/core/alphanumeric-data.js

// node_modules/qrcode/lib/core/byte-data.js

// node_modules/qrcode/lib/core/kanji-data.js

// node_modules/dijkstrajs/dijkstra.js

// node_modules/qrcode/lib/core/segments.js

// node_modules/qrcode/lib/core/qrcode.js

// node_modules/pngjs/lib/chunkstream.js

// node_modules/pngjs/lib/interlace.js

// node_modules/pngjs/lib/paeth-predictor.js

// node_modules/pngjs/lib/filter-parse.js

// node_modules/pngjs/lib/filter-parse-async.js

// node_modules/pngjs/lib/constants.js

// node_modules/pngjs/lib/crc.js

// node_modules/pngjs/lib/parser.js

// node_modules/pngjs/lib/bitmapper.js

// node_modules/pngjs/lib/format-normaliser.js

// node_modules/pngjs/lib/parser-async.js

// node_modules/pngjs/lib/bitpacker.js

// node_modules/pngjs/lib/filter-pack.js

// node_modules/pngjs/lib/packer.js

// node_modules/pngjs/lib/packer-async.js

// node_modules/pngjs/lib/sync-inflate.js

// node_modules/pngjs/lib/sync-reader.js

// node_modules/pngjs/lib/filter-parse-sync.js

// node_modules/pngjs/lib/parser-sync.js

// node_modules/pngjs/lib/packer-sync.js

// node_modules/pngjs/lib/png-sync.js

// node_modules/pngjs/lib/png.js

// node_modules/qrcode/lib/renderer/utils.js

// node_modules/qrcode/lib/renderer/png.js

// node_modules/qrcode/lib/renderer/utf8.js

// node_modules/qrcode/lib/renderer/terminal/terminal.js

// node_modules/qrcode/lib/renderer/terminal/terminal-small.js

// node_modules/qrcode/lib/renderer/terminal.js

// node_modules/qrcode/lib/renderer/svg-tag.js

// node_modules/qrcode/lib/renderer/svg.js

// node_modules/qrcode/lib/renderer/canvas.js

// node_modules/qrcode/lib/browser.js

// node_modules/qrcode/lib/server.js
var canPromise, QRCode, PngRenderer, Utf8Renderer, TerminalRenderer, SvgRenderer, $create, $toCanvas, $toString = function(text2, opts, cb) {
  let params = checkParams(text2, opts, cb), type = params.opts ? params.opts.type : void 0, renderer = getStringRendererFromType(type);
  return render3(renderer.render, text2, params);
};

