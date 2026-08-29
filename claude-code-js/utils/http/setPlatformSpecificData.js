// function: setPlatformSpecificData
async function setPlatformSpecificData(map7) {
  if (process14 && process14.versions) {
    let osInfo = `${os3.type()} ${os3.release()}; ${os3.arch()}`, versions2 = process14.versions;
    if (versions2.bun)
      map7.set("Bun", `${versions2.bun} (${osInfo})`);
    else if (versions2.deno)
      map7.set("Deno", `${versions2.deno} (${osInfo})`);
    else if (versions2.node)
      map7.set("Node", `${versions2.node} (${osInfo})`);
  }
}
