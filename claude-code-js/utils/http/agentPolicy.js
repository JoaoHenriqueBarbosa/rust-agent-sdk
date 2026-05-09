// function: agentPolicy
function agentPolicy(agent) {
  return {
    name: "agentPolicy",
    sendRequest: async (req, next) => {
      if (!req.agent)
        req.agent = agent;
      return next(req);
    }
  };
}
