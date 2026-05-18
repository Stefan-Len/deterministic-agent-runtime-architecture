// deterministic-agent-runtime-architecture
// Copyright (c) 2026 Stefan Len
// SPDX-License-Identifier: MIT

import assert from "node:assert/strict";
import test from "node:test";
import { selectContextRecords } from "../runtime-kernel/index.mjs";

test("selects context records deterministically and excludes local-only records from provider context", () => {
  const result = selectContextRecords({
    actionId: "runtime.plan-change-set",
    requiredScopes: ["architecture", "active-workspace"],
    records: [
      {
        recordId: "context.workspace.local-note",
        scope: "active-workspace",
        visibility: "local-only",
        actionId: "runtime.plan-change-set"
      },
      {
        recordId: "context.architecture.contracts",
        scope: "architecture",
        visibility: "provider-safe-summary",
        actionId: "*"
      },
      {
        recordId: "context.unrelated",
        scope: "billing",
        visibility: "provider-safe-summary",
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
});
