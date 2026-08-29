// function: updateUsage
function updateUsage(usage, partUsage) {
  if (!partUsage)
    return { ...usage };
  return {
    input_tokens: partUsage.input_tokens !== null && partUsage.input_tokens > 0 ? partUsage.input_tokens : usage.input_tokens,
    cache_creation_input_tokens: partUsage.cache_creation_input_tokens !== null && partUsage.cache_creation_input_tokens > 0 ? partUsage.cache_creation_input_tokens : usage.cache_creation_input_tokens,
    cache_read_input_tokens: partUsage.cache_read_input_tokens !== null && partUsage.cache_read_input_tokens > 0 ? partUsage.cache_read_input_tokens : usage.cache_read_input_tokens,
    output_tokens: partUsage.output_tokens ?? usage.output_tokens,
    server_tool_use: {
      web_search_requests: partUsage.server_tool_use?.web_search_requests ?? usage.server_tool_use.web_search_requests,
      web_fetch_requests: partUsage.server_tool_use?.web_fetch_requests ?? usage.server_tool_use.web_fetch_requests
    },
    service_tier: usage.service_tier,
    cache_creation: {
      ephemeral_1h_input_tokens: partUsage.cache_creation?.ephemeral_1h_input_tokens ?? usage.cache_creation.ephemeral_1h_input_tokens,
      ephemeral_5m_input_tokens: partUsage.cache_creation?.ephemeral_5m_input_tokens ?? usage.cache_creation.ephemeral_5m_input_tokens
    },
    ...{},
    inference_geo: usage.inference_geo,
    iterations: partUsage.iterations ?? usage.iterations,
    speed: partUsage.speed ?? usage.speed
  };
}
