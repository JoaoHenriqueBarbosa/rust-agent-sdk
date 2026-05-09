// var: require_dijkstra
var require_dijkstra = __commonJS((exports, module) => {
  var dijkstra = {
    single_source_shortest_paths: function(graph, s2, d) {
      var predecessors = {}, costs = {};
      costs[s2] = 0;
      var open12 = dijkstra.PriorityQueue.make();
      open12.push(s2, 0);
      var closest, u5, v2, cost_of_s_to_u, adjacent_nodes, cost_of_e, cost_of_s_to_u_plus_cost_of_e, cost_of_s_to_v, first_visit;
      while (!open12.empty()) {
        closest = open12.pop(), u5 = closest.value, cost_of_s_to_u = closest.cost, adjacent_nodes = graph[u5] || {};
        for (v2 in adjacent_nodes)
          if (adjacent_nodes.hasOwnProperty(v2)) {
            if (cost_of_e = adjacent_nodes[v2], cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e, cost_of_s_to_v = costs[v2], first_visit = typeof costs[v2] > "u", first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e)
              costs[v2] = cost_of_s_to_u_plus_cost_of_e, open12.push(v2, cost_of_s_to_u_plus_cost_of_e), predecessors[v2] = u5;
          }
      }
      if (typeof d < "u" && typeof costs[d] > "u") {
        var msg = ["Could not find a path from ", s2, " to ", d, "."].join("");
        throw Error(msg);
      }
      return predecessors;
    },
    extract_shortest_path_from_predecessor_list: function(predecessors, d) {
      var nodes = [], u5 = d, predecessor;
      while (u5)
        nodes.push(u5), predecessor = predecessors[u5], u5 = predecessors[u5];
      return nodes.reverse(), nodes;
    },
    find_path: function(graph, s2, d) {
      var predecessors = dijkstra.single_source_shortest_paths(graph, s2, d);
      return dijkstra.extract_shortest_path_from_predecessor_list(predecessors, d);
    },
    PriorityQueue: {
      make: function(opts) {
        var T = dijkstra.PriorityQueue, t2 = {}, key3;
        opts = opts || {};
        for (key3 in T)
          if (T.hasOwnProperty(key3))
            t2[key3] = T[key3];
        return t2.queue = [], t2.sorter = opts.sorter || T.default_sorter, t2;
      },
      default_sorter: function(a2, b) {
        return a2.cost - b.cost;
      },
      push: function(value, cost2) {
        var item = { value, cost: cost2 };
        this.queue.push(item), this.queue.sort(this.sorter);
      },
      pop: function() {
        return this.queue.shift();
      },
      empty: function() {
        return this.queue.length === 0;
      }
    }
  };
  if (typeof module < "u")
    module.exports = dijkstra;
});
