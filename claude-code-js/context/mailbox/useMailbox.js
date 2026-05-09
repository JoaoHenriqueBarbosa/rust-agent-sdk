// function: useMailbox
function useMailbox() {
  let mailbox = import_react29.useContext(MailboxContext);
  if (!mailbox)
    throw Error("useMailbox must be used within a MailboxProvider");
  return mailbox;
}
