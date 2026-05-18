// deterministic-agent-runtime-architecture
// Copyright (c) 2026 Stefan Len
// SPDX-License-Identifier: MIT

import { createHash } from "node:crypto";
import type {
  LedgerRecord,
  LedgerRecordInput
} from "../contracts/ledgerRecord.ts";

export function createLedgerRecord(input: LedgerRecordInput): LedgerRecord {
  const canonicalInput = stableSerialize(input);
  const eventId = `ledger_${createHash("sha256")
    .update(canonicalInput)
    .digest("hex")
    .slice(0, 32)}`;

  return {
    schemaVersion: 1,
    eventId,
    ...input
  };
}

export function stableSerialize(value: unknown): string {
  return JSON.stringify(sortValue(value));
}

function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortValue);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, nestedValue]) => [key, sortValue(nestedValue)])
    );
  }

  return value;
}
