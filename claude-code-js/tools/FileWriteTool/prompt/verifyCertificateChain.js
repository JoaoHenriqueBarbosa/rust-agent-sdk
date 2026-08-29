// function: verifyCertificateChain
async function verifyCertificateChain(certificate, intermediates) {
  let tempDir = null;
  try {
    tempDir = await mkdtemp(join37(tmpdir3(), "mcpb-verify-"));
    let certChainPath = join37(tempDir, "chain.pem"), certChain = [certificate, ...intermediates || []].join(`
`);
    if (await writeFile5(certChainPath, certChain), process.platform === "darwin")
      try {
        return await execFileAsync6("security", [
          "verify-cert",
          "-c",
          certChainPath,
          "-p",
          "codeSign"
        ]), !0;
      } catch (error44) {
        return !1;
      }
    else if (process.platform === "win32") {
      let psCommand = `
        $ErrorActionPreference = 'Stop'
        $certCollection = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2Collection
        $certCollection.Import('${certChainPath}')
        
        if ($certCollection.Count -eq 0) {
          Write-Error 'No certificates found'
          exit 1
        }
        
        $leafCert = $certCollection[0]
        $chain = New-Object System.Security.Cryptography.X509Certificates.X509Chain
        
        # Enable revocation checking
        $chain.ChainPolicy.RevocationMode = 'Online'
        $chain.ChainPolicy.RevocationFlag = 'EntireChain'
        $chain.ChainPolicy.UrlRetrievalTimeout = New-TimeSpan -Seconds 30
        
        # Add code signing application policy
        $codeSignOid = New-Object System.Security.Cryptography.Oid '1.3.6.1.5.5.7.3.3'
        $chain.ChainPolicy.ApplicationPolicy.Add($codeSignOid)
        
        # Add intermediate certificates to extra store
        for ($i = 1; $i -lt $certCollection.Count; $i++) {
          [void]$chain.ChainPolicy.ExtraStore.Add($certCollection[$i])
        }
        
        # Build and validate chain
        $result = $chain.Build($leafCert)
        
        if ($result) { 
          'Valid' 
        } else { 
          $chain.ChainStatus | ForEach-Object { 
            Write-Error "$($_.Status): $($_.StatusInformation)"
          }
          exit 1 
        }
      `.trim(), { stdout } = await execFileAsync6("powershell.exe", [
        "-NoProfile",
        "-NonInteractive",
        "-Command",
        psCommand
      ]);
      return stdout.includes("Valid");
    } else
      try {
        return await execFileAsync6("openssl", [
          "verify",
          "-purpose",
          "codesigning",
          "-CApath",
          "/etc/ssl/certs",
          certChainPath
        ]), !0;
      } catch (error44) {
        return !1;
      }
  } catch (error44) {
    return !1;
  } finally {
    if (tempDir)
      try {
        await rm2(tempDir, { recursive: !0, force: !0 });
      } catch {}
  }
}
