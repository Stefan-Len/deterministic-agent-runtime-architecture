// deterministic-agent-runtime-architecture
// Copyright (c) 2026 Stefan Len
// SPDX-License-Identifier: MIT

/**
 * Selects context records deterministically for a runtime action.
 *
 * Selection rules:
 * - exact action id matches first
 * - wildcard records are allowed as shared baseline context
 * - local-only records never enter provider context
 * - output ordering is stable by scope and record id
 *
 * @param {object} input
 * @param {string} input.actionId
 * @param {readonly string[]} [input.requiredScopes]
 * @param {readonly object[]} input.records
 * @returns {{selectedRecords: readonly object[], providerRecords: readonly object[], trace: readonly object[]}}
 */
export function selectContextRecords({ actionId, requiredScopes = [], records }) {
  const scopeSet = new Set(requiredScopes);
  const selectedRecords = [];

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
      providerEligible: selected && record.visibility === "provider-safe-summary"
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

function contextSelectionReason({ selected, matchesAction, matchesScope }) {
  if (selected) {
    return "matched-action-and-scope";
  }

  if (!matchesAction) {
    return "action-mismatch";
  }

  if (!matchesScope) {
    return "scope-mismatch";
  }

  return "not-selected";
}

function compareContextRecords(left, right) {
  const scopeComparison = String(left.scope).localeCompare(String(right.scope));
  if (scopeComparison !== 0) {
    return scopeComparison;
  }

  return String(left.recordId).localeCompare(String(right.recordId));
}
