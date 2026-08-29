// var: DEFAULT_PARSE_TIMEOUT_MS
var DEFAULT_PARSE_TIMEOUT_MS = 5000, PARSE_SCRIPT_BODY = `
if (-not $EncodedCommand) {
    Write-Output '{"valid":false,"errors":[{"message":"No command provided","errorId":"NoInput"}],"statements":[],"variables":[],"hasStopParsing":false,"originalCommand":""}'
    exit 0
}
