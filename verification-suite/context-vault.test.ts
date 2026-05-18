// deterministic-agent-runtime-architecture
// Copyright (c) 2026 Stefan Len
// SPDX-License-Identifier: MIT

import assert from "node:assert/strict";
import test from "node:test";
import { selectContextRecords } from "../runtime-kernel/index.ts";

test("selects context records deterministically and excludes local-only records from provider context", () => {
  const result = selectContextRecords({
    actionId: "runtime.plan-change-set",
    requiredScopes: ["architecture", "active-workspace"],
    records: [
      {
        recordId: "context.workspace.local-note",
        scope: "active-workspace",
        visibility: "local-only" as const,
        actionId: "runtime.plan-change-set"
      },
      {
        recordId: "context.architecture.contracts",
        scope: "architecture",
        visibility: "provider-safe-summary" as const,
        actionId: "*"
      },
      {
        recordId: "context.unrelated",
        scope: "billing",
        visibility: "provider-safe-summary" as const,
        actionId: "*"
      }
    ]
  });

  assert.deepEqual(
    result.selectedRecords.map((record) => record.recordId),
    ["context.workspace.local-note", "context.architecture.contracts"]
  );
  assert.deepEqual(
    result.providerRecords.map((record) => record.recordId),
    ["context.architecture.contracts"]
  );
  assert.deepEqual(
    result.trace.map((entry) => ({
      recordId: entry.recordId,
      reason: entry.reason,
      providerIncluded: entry.providerIncluded
    })),
    [
      {
        recordId: "context.workspace.local-note",
        reason: "matched-action-and-scope",
        providerIncluded: false
      },
      {
        recordId: "context.architecture.contracts",
        reason: "matched-action-and-scope",
        providerIncluded: true
      },
      {
        recordId: "context.unrelated",
        reason: "scope-mismatch",
        providerIncluded: false
      }
    ]
  );
});

test("selects wildcard action records when no scope filter is supplied", () => {
  const result = selectContextRecords({
    actionId: "runtime.plan-change-set",
    records: [
      {
        recordId: "context.shared.reference",
        scope: "architecture",
        visibility: "public-reference" as const,
        actionId: "*"
      }
    ]
  });

  assert.deepEqual(
    result.selectedRecords.map((record) => record.recordId),
    ["context.shared.reference"]
  );
  assert.equal(result.trace[0]?.reason, "matched-action-and-scope");
});
