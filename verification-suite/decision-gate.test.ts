// deterministic-agent-runtime-architecture
// Copyright (c) 2026 Stefan Len
// SPDX-License-Identifier: MIT

import assert from "node:assert/strict";
import test from "node:test";
import { buildPreflightResult } from "../runtime-kernel/index.ts";

const approvedTicket = {
  approvalId: "approval_01",
  approvalLevel: "operator" as const,
  decision: "approved" as const,
  requiresRecoveryPointBeforeWrite: true,
  allowedPaths: ["runtime-kernel/**", "verification-suite/**"],
  allowedFileTypes: [".ts", ".md", ".json"]
};

test("returns ready when approval, recovery point, paths, and file types pass", () => {
  const result = buildPreflightResult({
    approvalTicket: approvedTicket,
    recoveryPoints: [{ approvalId: "approval_01", status: "prepared" }],
    proposedChanges: [{ path: "runtime-kernel/decision-gate/buildPreflightResult.ts" }]
  });

  assert.equal(result.status, "ready");
  assert.deepEqual(result.blockReasons, []);
});

test("blocks when a prepared recovery point is missing", () => {
  const result = buildPreflightResult({
    approvalTicket: approvedTicket,
    recoveryPoints: [{ approvalId: "approval_01", status: "committed" }],
    proposedChanges: [{ path: "runtime-kernel/decision-gate/buildPreflightResult.ts" }]
  });

  assert.equal(result.status, "blocked");
  assert.ok(result.blockReasons.includes("recovery-point-not-prepared"));
});

test("blocks paths and file types outside the approval policy", () => {
  const result = buildPreflightResult({
    approvalTicket: approvedTicket,
    recoveryPoints: [{ approvalId: "approval_01", status: "prepared" }],
    proposedChanges: [{ path: "private/runtime-note.txt" }]
  });

  assert.equal(result.status, "blocked");
  assert.ok(result.blockReasons.includes("path-not-allowed"));
  assert.ok(result.blockReasons.includes("file-type-not-allowed"));
});

test("blocks when the approval ticket is not approved", () => {
  const result = buildPreflightResult({
    approvalTicket: {
      ...approvedTicket,
      decision: "pending"
    },
    recoveryPoints: [{ approvalId: "approval_01", status: "prepared" }],
    proposedChanges: [{ path: "runtime-kernel/decision-gate/buildPreflightResult.ts" }]
  });

  assert.equal(result.status, "blocked");
  assert.ok(result.blockReasons.includes("approval-not-approved"));
});

test("blocks empty proposed changes", () => {
  const result = buildPreflightResult({
    approvalTicket: approvedTicket,
    recoveryPoints: [{ approvalId: "approval_01", status: "prepared" }],
    proposedChanges: []
  });

  assert.equal(result.status, "blocked");
  assert.ok(result.blockReasons.includes("empty-proposed-changes"));
});
