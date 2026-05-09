// Shared module state and imports
// Original: src/utils/teammateMailbox.ts
__export(exports_teammateMailbox, {
  writeToMailbox: () => writeToMailbox,
  sendShutdownRequestToMailbox: () => sendShutdownRequestToMailbox,
  readUnreadMessages: () => readUnreadMessages,
  readMailbox: () => readMailbox,
  markMessagesAsReadByPredicate: () => markMessagesAsReadByPredicate,
  markMessagesAsRead: () => markMessagesAsRead,
  markMessageAsReadByIndex: () => markMessageAsReadByIndex,
  isTeamPermissionUpdate: () => isTeamPermissionUpdate,
  isTaskAssignment: () => isTaskAssignment,
  isStructuredProtocolMessage: () => isStructuredProtocolMessage,
  isShutdownRequest: () => isShutdownRequest,
  isShutdownRejected: () => isShutdownRejected,
  isShutdownApproved: () => isShutdownApproved,
  isSandboxPermissionResponse: () => isSandboxPermissionResponse,
  isSandboxPermissionRequest: () => isSandboxPermissionRequest,
  isPlanApprovalResponse: () => isPlanApprovalResponse,
  isPlanApprovalRequest: () => isPlanApprovalRequest,
  isPermissionResponse: () => isPermissionResponse,
  isPermissionRequest: () => isPermissionRequest,
  isModeSetRequest: () => isModeSetRequest,
  isIdleNotification: () => isIdleNotification,
  getLastPeerDmSummary: () => getLastPeerDmSummary,
  getInboxPath: () => getInboxPath,
  formatTeammateMessages: () => formatTeammateMessages,
  createShutdownRequestMessage: () => createShutdownRequestMessage,
  createShutdownRejectedMessage: () => createShutdownRejectedMessage,
  createShutdownApprovedMessage: () => createShutdownApprovedMessage,
  createSandboxPermissionResponseMessage: () => createSandboxPermissionResponseMessage,
  createSandboxPermissionRequestMessage: () => createSandboxPermissionRequestMessage,
  createPermissionResponseMessage: () => createPermissionResponseMessage,
  createPermissionRequestMessage: () => createPermissionRequestMessage,
  createModeSetRequestMessage: () => createModeSetRequestMessage,
  createIdleNotification: () => createIdleNotification,
  clearMailbox: () => clearMailbox,
  ShutdownRequestMessageSchema: () => ShutdownRequestMessageSchema,
  ShutdownRejectedMessageSchema: () => ShutdownRejectedMessageSchema,
  ShutdownApprovedMessageSchema: () => ShutdownApprovedMessageSchema,
  PlanApprovalResponseMessageSchema: () => PlanApprovalResponseMessageSchema,
  PlanApprovalRequestMessageSchema: () => PlanApprovalRequestMessageSchema,
  ModeSetRequestMessageSchema: () => ModeSetRequestMessageSchema
});
import { mkdir as mkdir12, readFile as readFile20, writeFile as writeFile17 } from "fs/promises";
import { join as join71 } from "path";
var LOCK_OPTIONS2, PlanApprovalRequestMessageSchema, PlanApprovalResponseMessageSchema, ShutdownRequestMessageSchema, ShutdownApprovedMessageSchema, ShutdownRejectedMessageSchema, ModeSetRequestMessageSchema;

