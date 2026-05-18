// deterministic-agent-runtime-architecture
// Copyright (c) 2026 Stefan Len
// SPDX-License-Identifier: MIT

import assert from "node:assert/strict";
import test from "node:test";
import { createLedgerRecord, stableSerialize } from "../runtime-kernel/index.ts";

test("creates deterministic ledger ids for the same canonical input", () => {
  const input = {
    timestamp: "2026-01-01T12:00:00.000Z",
    eventType: "approval.requested",
    actorId: "runtime",
    actionId: "runtime.plan-change-set",
    workItemId: "work_01",
    correlationId: "corr_01",
    summary: {
      artifactId: "artifact_01",
      approvalId: "approval_01"
    }
  };

  const first = createLedgerRecord(input);
  const second = createLedgerRecord({
    ...input,
    summary: {
      approvalId: "approval_01",
      artifactId: "artifact_01"
    }
  });

  assert.equal(first.eventId, second.eventId);
  assert.equal(first.schemaVersion, 1);
});

test("stableSerialize sorts object keys recursively", () => {
  assert.equal(
    stableSerialize({ z: 1, nested: { b: 2, a: 1 } }),
    '{"nested":{"a":1,"b":2},"z":1}'
  );
});

test("creates a different ledger id when the timestamp changes", () => {
  const first = createLedgerRecord({
    timestamp: "2026-01-01T12:00:00.000Z",
    eventType: "approval.requested",
    actorId: "runtime",
    actionId: "runtime.plan-change-set",
    workItemId: "work_01",
    correlationId: "corr_01",
    summary: { approvalId: "approval_01" }
  });

  const second = createLedgerRecord({
    timestamp: "2026-01-01T12:00:01.000Z",
    eventType: "approval.requested",
    actorId: "runtime",
    actionId: "runtime.plan-change-set",
    workItemId: "work_01",
    correlationId: "corr_01",
    summary: { approvalId: "approval_01" }
  });

  assert.notEqual(first.eventId, second.eventId);
});
