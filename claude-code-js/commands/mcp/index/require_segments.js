// var: require_segments
var require_segments = __commonJS((exports) => {
  var Mode = require_mode2(), NumericData = require_numeric_data(), AlphanumericData = require_alphanumeric_data(), ByteData = require_byte_data(), KanjiData = require_kanji_data(), Regex = require_regex3(), Utils = require_utils13(), dijkstra = require_dijkstra();
  function getStringByteLength(str2) {
    return unescape(encodeURIComponent(str2)).length;
  }
  function getSegments(regex2, mode, str2) {
    let segments = [], result;
    while ((result = regex2.exec(str2)) !== null)
      segments.push({
        data: result[0],
        index: result.index,
        mode,
        length: result[0].length
      });
    return segments;
  }
  function getSegmentsFromString(dataStr) {
    let numSegs = getSegments(Regex.NUMERIC, Mode.NUMERIC, dataStr), alphaNumSegs = getSegments(Regex.ALPHANUMERIC, Mode.ALPHANUMERIC, dataStr), byteSegs, kanjiSegs;
    if (Utils.isKanjiModeEnabled())
      byteSegs = getSegments(Regex.BYTE, Mode.BYTE, dataStr), kanjiSegs = getSegments(Regex.KANJI, Mode.KANJI, dataStr);
    else
      byteSegs = getSegments(Regex.BYTE_KANJI, Mode.BYTE, dataStr), kanjiSegs = [];
    return numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs).sort(function(s1, s2) {
      return s1.index - s2.index;
    }).map(function(obj) {
      return {
        data: obj.data,
        mode: obj.mode,
        length: obj.length
      };
    });
  }
  function getSegmentBitsLength(length, mode) {
    switch (mode) {
      case Mode.NUMERIC:
        return NumericData.getBitsLength(length);
      case Mode.ALPHANUMERIC:
        return AlphanumericData.getBitsLength(length);
      case Mode.KANJI:
        return KanjiData.getBitsLength(length);
      case Mode.BYTE:
        return ByteData.getBitsLength(length);
    }
  }
  function mergeSegments(segs) {
    return segs.reduce(function(acc, curr) {
      let prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null;
      if (prevSeg && prevSeg.mode === curr.mode)
        return acc[acc.length - 1].data += curr.data, acc;
      return acc.push(curr), acc;
    }, []);
  }
  function buildNodes(segs) {
    let nodes = [];
    for (let i5 = 0;i5 < segs.length; i5++) {
      let seg = segs[i5];
      switch (seg.mode) {
        case Mode.NUMERIC:
          nodes.push([
            seg,
            { data: seg.data, mode: Mode.ALPHANUMERIC, length: seg.length },
            { data: seg.data, mode: Mode.BYTE, length: seg.length }
          ]);
          break;
        case Mode.ALPHANUMERIC:
          nodes.push([
            seg,
            { data: seg.data, mode: Mode.BYTE, length: seg.length }
          ]);
          break;
        case Mode.KANJI:
          nodes.push([
            seg,
            { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
          ]);
          break;
        case Mode.BYTE:
          nodes.push([
            { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
          ]);
      }
    }
    return nodes;
  }
  function buildGraph(nodes, version5) {
    let table = {}, graph = { start: {} }, prevNodeIds = ["start"];
    for (let i5 = 0;i5 < nodes.length; i5++) {
      let nodeGroup = nodes[i5], currentNodeIds = [];
      for (let j4 = 0;j4 < nodeGroup.length; j4++) {
        let node2 = nodeGroup[j4], key3 = "" + i5 + j4;
        currentNodeIds.push(key3), table[key3] = { node: node2, lastCount: 0 }, graph[key3] = {};
        for (let n5 = 0;n5 < prevNodeIds.length; n5++) {
          let prevNodeId = prevNodeIds[n5];
          if (table[prevNodeId] && table[prevNodeId].node.mode === node2.mode)
            graph[prevNodeId][key3] = getSegmentBitsLength(table[prevNodeId].lastCount + node2.length, node2.mode) - getSegmentBitsLength(table[prevNodeId].lastCount, node2.mode), table[prevNodeId].lastCount += node2.length;
          else {
            if (table[prevNodeId])
              table[prevNodeId].lastCount = node2.length;
            graph[prevNodeId][key3] = getSegmentBitsLength(node2.length, node2.mode) + 4 + Mode.getCharCountIndicator(node2.mode, version5);
          }
        }
      }
      prevNodeIds = currentNodeIds;
    }
    for (let n5 = 0;n5 < prevNodeIds.length; n5++)
      graph[prevNodeIds[n5]].end = 0;
    return { map: graph, table };
  }
  function buildSingleSegment(data, modesHint) {
    let mode, bestMode = Mode.getBestModeForData(data);
    if (mode = Mode.from(modesHint, bestMode), mode !== Mode.BYTE && mode.bit < bestMode.bit)
      throw Error('"' + data + '" cannot be encoded with mode ' + Mode.toString(mode) + `.
 Suggested mode is: ` + Mode.toString(bestMode));
    if (mode === Mode.KANJI && !Utils.isKanjiModeEnabled())
      mode = Mode.BYTE;
    switch (mode) {
      case Mode.NUMERIC:
        return new NumericData(data);
      case Mode.ALPHANUMERIC:
        return new AlphanumericData(data);
      case Mode.KANJI:
        return new KanjiData(data);
      case Mode.BYTE:
        return new ByteData(data);
    }
  }
  exports.fromArray = function(array3) {
    return array3.reduce(function(acc, seg) {
      if (typeof seg === "string")
        acc.push(buildSingleSegment(seg, null));
      else if (seg.data)
        acc.push(buildSingleSegment(seg.data, seg.mode));
      return acc;
    }, []);
  };
  exports.fromString = function(data, version5) {
    let segs = getSegmentsFromString(data, Utils.isKanjiModeEnabled()), nodes = buildNodes(segs), graph = buildGraph(nodes, version5), path25 = dijkstra.find_path(graph.map, "start", "end"), optimizedSegs = [];
    for (let i5 = 1;i5 < path25.length - 1; i5++)
      optimizedSegs.push(graph.table[path25[i5]].node);
    return exports.fromArray(mergeSegments(optimizedSegs));
  };
  exports.rawSplit = function(data) {
    return exports.fromArray(getSegmentsFromString(data, Utils.isKanjiModeEnabled()));
  };
});
