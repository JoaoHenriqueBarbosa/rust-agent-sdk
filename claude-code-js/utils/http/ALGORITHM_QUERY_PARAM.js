// var: ALGORITHM_QUERY_PARAM
var ALGORITHM_QUERY_PARAM = "X-Amz-Algorithm", CREDENTIAL_QUERY_PARAM = "X-Amz-Credential", AMZ_DATE_QUERY_PARAM = "X-Amz-Date", SIGNED_HEADERS_QUERY_PARAM = "X-Amz-SignedHeaders", EXPIRES_QUERY_PARAM = "X-Amz-Expires", SIGNATURE_QUERY_PARAM = "X-Amz-Signature", TOKEN_QUERY_PARAM = "X-Amz-Security-Token", AUTH_HEADER = "authorization", AMZ_DATE_HEADER, GENERATED_HEADERS, SIGNATURE_HEADER, SHA256_HEADER = "x-amz-content-sha256", TOKEN_HEADER, ALWAYS_UNSIGNABLE_HEADERS, PROXY_HEADER_PATTERN, SEC_HEADER_PATTERN, ALGORITHM_IDENTIFIER = "AWS4-HMAC-SHA256", EVENT_ALGORITHM_IDENTIFIER = "AWS4-HMAC-SHA256-PAYLOAD", UNSIGNED_PAYLOAD = "UNSIGNED-PAYLOAD", MAX_CACHE_SIZE = 50, KEY_TYPE_IDENTIFIER = "aws4_request", MAX_PRESIGNED_TTL = 604800;
var init_constants5 = __esm(() => {
  AMZ_DATE_HEADER = "X-Amz-Date".toLowerCase(), GENERATED_HEADERS = ["authorization", AMZ_DATE_HEADER, "date"], SIGNATURE_HEADER = "X-Amz-Signature".toLowerCase(), TOKEN_HEADER = "X-Amz-Security-Token".toLowerCase(), ALWAYS_UNSIGNABLE_HEADERS = {
    authorization: !0,
    "cache-control": !0,
    connection: !0,
    expect: !0,
    from: !0,
    "keep-alive": !0,
    "max-forwards": !0,
    pragma: !0,
    referer: !0,
    te: !0,
    trailer: !0,
    "transfer-encoding": !0,
    upgrade: !0,
    "user-agent": !0,
    "x-amzn-trace-id": !0
  }, PROXY_HEADER_PATTERN = /^proxy-/, SEC_HEADER_PATTERN = /^sec-/;
});
