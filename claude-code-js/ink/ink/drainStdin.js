// function: drainStdin
function drainStdin(stdin = process.stdin) {
  if (!stdin.isTTY)
    return;
  try {
    while (stdin.read() !== null)
      ;
  } catch {}
  if (process.platform === "win32")
    return;
  let tty4 = stdin, wasRaw = tty4.isRaw === !0, fd = -1;
  try {
    if (!wasRaw)
      tty4.setRawMode?.(!0);
    fd = openSync3("/dev/tty", fsConstants3.O_RDONLY | fsConstants3.O_NONBLOCK);
    let buf = Buffer.alloc(1024);
    for (let i4 = 0;i4 < 64; i4++)
      if (readSync2(fd, buf, 0, buf.length, null) <= 0)
        break;
  } catch {} finally {
    if (fd >= 0)
      try {
        closeSync3(fd);
      } catch {}
    if (!wasRaw)
      try {
        tty4.setRawMode?.(!1);
      } catch {}
  }
}
