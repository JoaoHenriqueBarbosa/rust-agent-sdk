// function: accumulateUsage
function accumulateUsage(totalUsage, messageUsage) {
  return {
    input_tokens: totalUsage.input_tokens + messageUsage.input_tokens,
    cache_creation_input_tokens: totalUsage.cache_creation_input_tokens + messageUsage.cache_creation_input_tokens,
    cache_read_input_tokens: totalUsage.cache_read_input_tokens + messageUsage.cache_read_input_tokens,
    output_tokens: totalUsage.output_tokens + messageUsage.output_tokens,
    server_tool_use: {
      web_search_requests: totalUsage.server_tool_use.web_search_requests + messageUsage.server_tool_use.web_search_requests,
      web_fetch_requests: totalUsage.server_tool_use.web_fetch_requests + messageUsage.server_tool_use.web_fetch_requests
    },
    service_tier: messageUsage.service_tier,
    cache_creation: {
      ephemeral_1h_input_tokens: totalUsage.cache_creation.ephemeral_1h_input_tokens + messageUsage.cache_creation.ephemeral_1h_input_tokens,
      ephemeral_5m_input_tokens: totalUsage.cache_creation.ephemeral_5m_input_tokens + messageUsage.cache_creation.ephemeral_5m_input_tokens
    },
    ...{},
    inference_geo: messageUsage.inference_geo,
    iterations: messageUsage.iterations,
    speed: messageUsage.speed
  };
}
