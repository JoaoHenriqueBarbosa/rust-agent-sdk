// function: structuredPatch
function structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options2) {
  if (!options2)
    options2 = {};
  if (typeof options2 === "function")
    options2 = {
      callback: options2
    };
  if (typeof options2.context > "u")
    options2.context = 4;
  if (options2.newlineIsToken)
    throw Error("newlineIsToken may not be used with patch-generation functions, only with diffing functions");
  if (!options2.callback)
    return diffLinesResultToPatch(diffLines(oldStr, newStr, options2));
  else {
    var _options = options2, _callback = _options.callback;
    diffLines(oldStr, newStr, _objectSpread2(_objectSpread2({}, options2), {}, {
      callback: function(diff3) {
        var patch = diffLinesResultToPatch(diff3);
        _callback(patch);
      }
    }));
  }
  function diffLinesResultToPatch(diff3) {
    if (!diff3)
      return;
    diff3.push({
      value: "",
      lines: []
    });
    function contextLines(lines2) {
      return lines2.map(function(entry) {
        return " " + entry;
      });
    }
    var hunks = [], oldRangeStart = 0, newRangeStart = 0, curRange = [], oldLine = 1, newLine = 1, _loop = function() {
      var current = diff3[i5], lines2 = current.lines || splitLines2(current.value);
      if (current.lines = lines2, current.added || current.removed) {
        var _curRange;
        if (!oldRangeStart) {
          var prev = diff3[i5 - 1];
          if (oldRangeStart = oldLine, newRangeStart = newLine, prev)
            curRange = options2.context > 0 ? contextLines(prev.lines.slice(-options2.context)) : [], oldRangeStart -= curRange.length, newRangeStart -= curRange.length;
        }
        if ((_curRange = curRange).push.apply(_curRange, _toConsumableArray(lines2.map(function(entry) {
          return (current.added ? "+" : "-") + entry;
        }))), current.added)
          newLine += lines2.length;
        else
          oldLine += lines2.length;
      } else {
        if (oldRangeStart)
          if (lines2.length <= options2.context * 2 && i5 < diff3.length - 2) {
            var _curRange2;
            (_curRange2 = curRange).push.apply(_curRange2, _toConsumableArray(contextLines(lines2)));
          } else {
            var _curRange3, contextSize = Math.min(lines2.length, options2.context);
            (_curRange3 = curRange).push.apply(_curRange3, _toConsumableArray(contextLines(lines2.slice(0, contextSize))));
            var _hunk = {
              oldStart: oldRangeStart,
              oldLines: oldLine - oldRangeStart + contextSize,
              newStart: newRangeStart,
              newLines: newLine - newRangeStart + contextSize,
              lines: curRange
            };
            hunks.push(_hunk), oldRangeStart = 0, newRangeStart = 0, curRange = [];
          }
        oldLine += lines2.length, newLine += lines2.length;
      }
    };
    for (var i5 = 0;i5 < diff3.length; i5++)
      _loop();
    for (var _i = 0, _hunks = hunks;_i < _hunks.length; _i++) {
      var hunk = _hunks[_i];
      for (var _i2 = 0;_i2 < hunk.lines.length; _i2++)
        if (hunk.lines[_i2].endsWith(`
`))
          hunk.lines[_i2] = hunk.lines[_i2].slice(0, -1);
        else
          hunk.lines.splice(_i2 + 1, 0, "\\ No newline at end of file"), _i2++;
    }
    return {
      oldFileName,
      newFileName,
      oldHeader,
      newHeader,
      hunks
    };
  }
}
