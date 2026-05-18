// deterministic-agent-runtime-architecture
// Copyright (c) 2026 Stefan Len
// SPDX-License-Identifier: MIT

import assert from "node:assert/strict";
import test from "node:test";
import { buildPreflightResult } from "../runtime-kernel/index.mjs";

const approvedTicket = {
  approvalId: "approval_01",
  decision: "approved",
  requiresRecoveryPointBeforeWrite: true,
  allowedPaths: ["runtime-kernel/**", "verification-suite/**"],
  allowedFileTypes: [".mjs", ".md", ".json"]
};

test("returns ready when approval, recovery point, paths, and file types pass", () => {
  const result = buildPreflightResult({
    approvalTicket: approvedTicket,
    recoveryPoints: [{ approvalId: "approval_01", status: "prepared" }],
    proposedChanges: [{ path: "runtime-kernel/decision-gate/buildPreflightResult.mjs" }]
  });

  assert.equal(result.status, "ready");
  assert.deepEqual(result.blockReasons, []);
});

test("blocks when a prepared recovery point is missing", () => {
  const result = buildPreflightResult({
    approvalTicket: approvedTicket,
    recoveryPoints: [{ approvalId: "approval_01", status: "committed" }],
    proposedChanges: [{ path: "runtime-kernel/decision-gate/buildPreflightResult.mjs" }]
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
