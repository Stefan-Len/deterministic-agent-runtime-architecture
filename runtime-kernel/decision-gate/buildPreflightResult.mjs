// deterministic-agent-runtime-architecture
// Copyright (c) 2026 Stefan Len
// SPDX-License-Identifier: MIT

/**
 * Builds a deterministic preflight result for approved work.
 *
 * The function is pure and performs no file writes. It only evaluates whether
 * a proposed execution is allowed to proceed according to the provided contract
 * state.
 *
 * @param {object} input
 * @param {object} input.approvalTicket
 * @param {readonly object[]} input.recoveryPoints
 * @param {readonly object[]} input.proposedChanges
 * @returns {{status: "ready" | "blocked", checks: readonly object[], blockReasons: readonly string[]}}
 */
export function buildPreflightResult({
  approvalTicket,
  recoveryPoints,
  proposedChanges
}) {
  const checks = [
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

function checkApprovalDecision(approvalTicket) {
  if (approvalTicket.decision === "approved") {
    return passed("decision.approved", "Approval ticket is approved.");
  }

  return blocked(
    "decision.approved",
    "approval-not-approved",
    "Approval ticket is not approved."
  );
}

function checkRecoveryPoint(approvalTicket, recoveryPoints) {
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

function checkProposedChanges(proposedChanges) {
  if (proposedChanges.length > 0) {
    return passed("changes.present", "Proposed changes are present.");
  }

  return blocked(
    "changes.present",
    "empty-proposed-changes",
    "No proposed changes were provided."
  );
}

function checkAllowedPaths(approvalTicket, proposedChanges) {
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

function checkAllowedFileTypes(approvalTicket, proposedChanges) {
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

function isPathAllowed(path, policies) {
  return policies.some((policy) => {
    if (policy.endsWith("/**")) {
      const prefix = policy.slice(0, -3);
      return path === prefix || path.startsWith(`${prefix}/`);
    }

    return path === policy;
  });
}

function fileExtension(path) {
  const lastDot = path.lastIndexOf(".");
  if (lastDot < 0) {
    return "";
  }

  return path.slice(lastDot);
}

function passed(checkId, message) {
  return {
    checkId,
    status: "passed",
    message
  };
}

function blocked(checkId, reason, message) {
  return {
    checkId,
    status: "blocked",
    reason,
    message
  };
}
