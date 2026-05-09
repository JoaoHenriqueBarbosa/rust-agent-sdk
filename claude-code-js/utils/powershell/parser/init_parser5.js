// var: init_parser5
var init_parser5 = __esm(() => {
  init_execa();
  init_debug();
  init_memoize2();
  init_powershellDetection();
  init_slowOperations();
  SCRIPT_CHARS_BUDGET = (WINDOWS_ARGV_CAP - FIXED_ARGV_OVERHEAD) * 3 / 8, CMD_B64_BUDGET = SCRIPT_CHARS_BUDGET - PARSE_SCRIPT_BODY.length - ENCODED_CMD_WRAPPER, WINDOWS_MAX_COMMAND_LENGTH = Math.max(0, Math.floor(CMD_B64_BUDGET * 3 / 4) - SAFETY_MARGIN2), MAX_COMMAND_LENGTH2 = process.platform === "win32" ? WINDOWS_MAX_COMMAND_LENGTH : UNIX_MAX_COMMAND_LENGTH, INVALID_RESULT_BASE = {
    valid: !1,
    statements: [],
    variables: [],
    hasStopParsing: !1
  };
  TRANSIENT_ERROR_IDS = /* @__PURE__ */ new Set([
    "PwshSpawnError",
    "PwshError",
    "PwshTimeout",
    "EmptyOutput",
    "InvalidJson"
  ]), parsePowerShellCommandCached = memoizeWithLRU((command12) => {
    let promise3 = parsePowerShellCommandImpl(command12);
    return promise3.then((result) => {
      if (!result.valid && TRANSIENT_ERROR_IDS.has(result.errors[0]?.errorId ?? ""))
        parsePowerShellCommandCached.cache.delete(command12);
    }), promise3;
  }, (command12) => command12, 256), COMMON_ALIASES = Object.assign(Object.create(null), {
    ls: "Get-ChildItem",
    dir: "Get-ChildItem",
    gci: "Get-ChildItem",
    cat: "Get-Content",
    type: "Get-Content",
    gc: "Get-Content",
    cd: "Set-Location",
    sl: "Set-Location",
    chdir: "Set-Location",
    pushd: "Push-Location",
    popd: "Pop-Location",
    pwd: "Get-Location",
    gl: "Get-Location",
    gi: "Get-Item",
    gp: "Get-ItemProperty",
    ni: "New-Item",
    mkdir: "New-Item",
    md: "New-Item",
    ri: "Remove-Item",
    del: "Remove-Item",
    rd: "Remove-Item",
    rmdir: "Remove-Item",
    rm: "Remove-Item",
    erase: "Remove-Item",
    mi: "Move-Item",
    mv: "Move-Item",
    move: "Move-Item",
    ci: "Copy-Item",
    cp: "Copy-Item",
    copy: "Copy-Item",
    cpi: "Copy-Item",
    si: "Set-Item",
    rni: "Rename-Item",
    ren: "Rename-Item",
    ps: "Get-Process",
    gps: "Get-Process",
    kill: "Stop-Process",
    spps: "Stop-Process",
    start: "Start-Process",
    saps: "Start-Process",
    sajb: "Start-Job",
    ipmo: "Import-Module",
    echo: "Write-Output",
    write: "Write-Output",
    sleep: "Start-Sleep",
    help: "Get-Help",
    man: "Get-Help",
    gcm: "Get-Command",
    gsv: "Get-Service",
    gv: "Get-Variable",
    sv: "Set-Variable",
    h: "Get-History",
    history: "Get-History",
    iex: "Invoke-Expression",
    iwr: "Invoke-WebRequest",
    irm: "Invoke-RestMethod",
    icm: "Invoke-Command",
    ii: "Invoke-Item",
    nsn: "New-PSSession",
    etsn: "Enter-PSSession",
    exsn: "Exit-PSSession",
    gsn: "Get-PSSession",
    rsn: "Remove-PSSession",
    cls: "Clear-Host",
    clear: "Clear-Host",
    select: "Select-Object",
    where: "Where-Object",
    foreach: "ForEach-Object",
    "%": "ForEach-Object",
    "?": "Where-Object",
    measure: "Measure-Object",
    ft: "Format-Table",
    fl: "Format-List",
    fw: "Format-Wide",
    oh: "Out-Host",
    ogv: "Out-GridView",
    ac: "Add-Content",
    clc: "Clear-Content",
    tee: "Tee-Object",
    epcsv: "Export-Csv",
    sp: "Set-ItemProperty",
    rp: "Remove-ItemProperty",
    cli: "Clear-Item",
    epal: "Export-Alias",
    sls: "Select-String"
  });
  PS_TOKENIZER_DASH_CHARS = /* @__PURE__ */ new Set([
    "-",
    "\u2013",
    "\u2014",
    "\u2015"
  ]);
});
