// function: fetchWithCorsRetry
async function fetchWithCorsRetry(url3, headers, fetchFn = fetch) {
  try {
    return await fetchFn(url3, { headers });
  } catch (error44) {
    if (error44 instanceof TypeError)
      if (headers)
        return fetchWithCorsRetry(url3, void 0, fetchFn);
      else
        return;
    throw error44;
  }
}
