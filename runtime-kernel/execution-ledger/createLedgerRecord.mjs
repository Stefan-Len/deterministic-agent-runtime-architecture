// deterministic-agent-runtime-architecture
// Copyright (c) 2026 Stefan Len
// SPDX-License-Identifier: MIT

import { createHash } from "node:crypto";

/**
 * Creates a stable execution ledger record.
 *
 * The event id is derived from the canonical record input. This keeps repeated
 * runs reproducible when the same timestamp and payload are supplied.
 *
 * @param {object} input
 * @param {string} input.timestamp
 * @param {string} input.eventType
 * @param {string} input.actorId
 * @param {string} input.actionId
 * @param {string} input.workItemId
 * @param {string} input.correlationId
 * @param {object} input.summary
 * @returns {object}
 */
export function createLedgerRecord(input) {
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

export function stableSerialize(value) {
  return JSON.stringify(sortValue(value));
}

function sortValue(value) {
  if (Array.isArray(value)) {
    return value.map(sortValue);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, nestedValue]) => [key, sortValue(nestedValue)])
    );
  }

  return value;
}
