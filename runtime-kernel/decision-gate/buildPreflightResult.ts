// deterministic-agent-runtime-architecture
// Copyright (c) 2026 Stefan Len
// SPDX-License-Identifier: MIT

import type {
  ApprovalTicket,
  ProposedChange,
  RecoveryPoint
} from "../contracts/approvalTicket.ts";
import type {
  BlockedPreflightCheck,
  PassedPreflightCheck,
  PreflightBlockReason,
  PreflightCheck,
  PreflightResult
} from "../contracts/preflightResult.ts";

export function buildPreflightResult({
  approvalTicket,
  recoveryPoints,
  proposedChanges
}: {
  readonly approvalTicket: ApprovalTicket;
  readonly recoveryPoints: readonly RecoveryPoint[];
  readonly proposedChanges: readonly ProposedChange[];
}): PreflightResult {
  const checks: PreflightCheck[] = [
    checkApprovalDecision(approvalTicket),
    checkRecoveryPoint(approvalTicket, recoveryPoints),
    checkProposedChanges(proposedChanges),
    checkAllowedPaths(approvalTicket, proposedChanges),
    checkAllowedFileTypes(approvalTicket, proposedChanges)
  ];

  const blockReasons = checks
    .filter((check) => check.status === "blocked")
    .map((check) => check.reason);

  return {
    status: blockReasons.length === 0 ? "ready" : "blocked",
    checks,
    blockReasons
  };
}

function checkApprovalDecision(approvalTicket: ApprovalTicket): PreflightCheck {
  if (approvalTicket.decision === "approved") {
    return passed("decision.approved", "Approval ticket is approved.");
  }

  return blocked(
    "decision.approved",
    "approval-not-approved",
    "Approval ticket is not approved."
  );
}

function checkRecoveryPoint(
  approvalTicket: ApprovalTicket,
  recoveryPoints: readonly RecoveryPoint[]
): PreflightCheck {
  if (!approvalTicket.requiresRecoveryPointBeforeWrite) {
    return passed("recovery.prepared", "Recovery point is not required.");
  }

  const hasPreparedRecoveryPoint = recoveryPoints.some(
    (point) =>
      point.approvalId === approvalTicket.approvalId &&
      point.status === "prepared"
  );

  if (hasPreparedRecoveryPoint) {
    return passed("recovery.prepared", "Prepared recovery point found.");
  }

  return blocked(
    "recovery.prepared",
    "recovery-point-not-prepared",
    "No prepared recovery point found for this approval."
  );
}

function checkProposedChanges(
  proposedChanges: readonly ProposedChange[]
): PreflightCheck {
  if (proposedChanges.length > 0) {
    return passed("changes.present", "Proposed changes are present.");
  }

  return blocked(
    "changes.present",
    "empty-proposed-changes",
    "No proposed changes were provided."
  );
}

function checkAllowedPaths(
  approvalTicket: ApprovalTicket,
  proposedChanges: readonly ProposedChange[]
): PreflightCheck {
  const invalidPath = proposedChanges.find(
    (change) => !isPathAllowed(change.path, approvalTicket.allowedPaths)
  );

  if (!invalidPath) {
    return passed("paths.allowed", "All proposed paths match the allowed path policy.");
  }

  return blocked(
    "paths.allowed",
    "path-not-allowed",
    `Path is outside the allowed policy: ${invalidPath.path}`
  );
}

function checkAllowedFileTypes(
  approvalTicket: ApprovalTicket,
  proposedChanges: readonly ProposedChange[]
): PreflightCheck {
  const invalidType = proposedChanges.find(
    (change) => !approvalTicket.allowedFileTypes.includes(fileExtension(change.path))
  );

  if (!invalidType) {
    return passed("file-types.allowed", "All proposed file types are allowed.");
  }

  return blocked(
    "file-types.allowed",
    "file-type-not-allowed",
    `File type is outside the allowed policy: ${invalidType.path}`
  );
}

function isPathAllowed(path: string, policies: readonly string[]): boolean {
  return policies.some((policy) => {
    if (policy.endsWith("/**")) {
      const prefix = policy.slice(0, -3);
      return path === prefix || path.startsWith(`${prefix}/`);
    }

    return path === policy;
  });
}

function fileExtension(path: string): string {
  const lastDot = path.lastIndexOf(".");
  if (lastDot < 0) {
    return "";
  }

  return path.slice(lastDot);
}

function passed(checkId: string, message: string): PassedPreflightCheck {
  return {
    checkId,
    status: "passed",
    message
  };
}

function blocked(
  checkId: string,
  reason: PreflightBlockReason,
  message: string
): BlockedPreflightCheck {
  return {
    checkId,
    status: "blocked",
    reason,
    message
  };
}
