// deterministic-agent-runtime-architecture
// Copyright (c) 2026 Stefan Len
// SPDX-License-Identifier: MIT

import type {
  ContextRecord,
  ContextSelectionInput,
  ContextSelectionReason,
  ContextSelectionResult
} from "../contracts/contextRecord.ts";

export function selectContextRecords({
  actionId,
  requiredScopes = [],
  records
}: ContextSelectionInput): ContextSelectionResult {
  const scopeSet = new Set(requiredScopes);
  const selectedRecords: ContextRecord[] = [];

  const trace = records.map((record) => {
    const matchesAction =
      record.actionId === actionId ||
      record.actionId === "*" ||
      record.actionId === undefined;
    const matchesScope = scopeSet.size === 0 || scopeSet.has(record.scope);
    const selected = matchesAction && matchesScope;

    if (selected) {
      selectedRecords.push(record);
    }

    return {
      recordId: record.recordId,
      scope: record.scope,
      selected,
      reason: contextSelectionReason({ selected, matchesAction, matchesScope }),
      providerIncluded: selected && record.visibility === "provider-safe-summary"
    };
  });

  const orderedSelectedRecords = selectedRecords.toSorted(compareContextRecords);

  const providerRecords = orderedSelectedRecords.filter(
    (record) => record.visibility === "provider-safe-summary"
  );

  return {
    selectedRecords: orderedSelectedRecords,
    providerRecords,
    trace
  };
}

function contextSelectionReason({
  selected,
  matchesAction,
  matchesScope
}: {
  readonly selected: boolean;
  readonly matchesAction: boolean;
  readonly matchesScope: boolean;
}): ContextSelectionReason {
  if (selected) {
    return "matched-action-and-scope";
  }

  if (!matchesAction) {
    return "action-mismatch";
  }

  return "scope-mismatch";
}

function compareContextRecords(
  left: ContextRecord,
  right: ContextRecord
): number {
  const scopeComparison = String(left.scope).localeCompare(String(right.scope));
  if (scopeComparison !== 0) {
    return scopeComparison;
  }

  return String(left.recordId).localeCompare(String(right.recordId));
}
