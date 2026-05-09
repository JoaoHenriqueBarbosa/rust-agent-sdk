// var: require_route
var require_route = __commonJS((exports, module) => {
  var conversions = require_conversions();
  function buildGraph() {
    let graph = {}, models = Object.keys(conversions);
    for (let len = models.length, i4 = 0;i4 < len; i4++)
      graph[models[i4]] = {
        distance: -1,
        parent: null
      };
    return graph;
  }
  function deriveBFS(fromModel) {
    let graph = buildGraph(), queue = [fromModel];
    graph[fromModel].distance = 0;
    while (queue.length) {
      let current = queue.pop(), adjacents = Object.keys(conversions[current]);
      for (let len = adjacents.length, i4 = 0;i4 < len; i4++) {
        let adjacent = adjacents[i4], node = graph[adjacent];
        if (node.distance === -1)
          node.distance = graph[current].distance + 1, node.parent = current, queue.unshift(adjacent);
      }
    }
    return graph;
  }
  function link2(from, to) {
    return function(args) {
      return to(from(args));
    };
  }
  function wrapConversion(toModel, graph) {
    let path16 = [graph[toModel].parent, toModel], fn = conversions[graph[toModel].parent][toModel], cur = graph[toModel].parent;
    while (graph[cur].parent)
      path16.unshift(graph[cur].parent), fn = link2(conversions[graph[cur].parent][cur], fn), cur = graph[cur].parent;
    return fn.conversion = path16, fn;
  }
  module.exports = function(fromModel) {
    let graph = deriveBFS(fromModel), conversion = {}, models = Object.keys(graph);
    for (let len = models.length, i4 = 0;i4 < len; i4++) {
      let toModel = models[i4];
      if (graph[toModel].parent === null)
        continue;
      conversion[toModel] = wrapConversion(toModel, graph);
    }
    return conversion;
  };
});
