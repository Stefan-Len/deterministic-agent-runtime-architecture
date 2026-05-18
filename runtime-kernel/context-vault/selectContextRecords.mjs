// deterministic-agent-runtime-architecture
// Copyright (c) 2026 Stefan Len
// SPDX-License-Identifier: MIT

/**
 * Selects context records deterministically for a runtime action.
 *
 * The selector is intentionally narrow:
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

  const trace = records.map((record) => {
    const matchesAction =
      record.actionId === actionId ||
      record.actionId === "*" ||
      record.actionId === undefined;
    const matchesScope = scopeSet.size === 0 || scopeSet.has(record.scope);
    const selected = matchesAction && matchesScope;

    return {
      recordId: record.recordId,
      scope: record.scope,
      selected,
      reason: selected ? "matched-action-and-scope" : "not-required-for-action",
      providerEligible: selected && record.visibility === "provider-safe-summary"
    };
  });

  const selectedRecords = records
    .filter((record) => {
      const entry = trace.find((item) => item.recordId === record.recordId);
      return entry?.selected === true;
    })
    .toSorted(compareContextRecords);

  const providerRecords = selectedRecords.filter(
    (record) => record.visibility === "provider-safe-summary"
  );

  return {
    selectedRecords,
    providerRecords,
    trace
  };
}

function compareContextRecords(left, right) {
  const scopeComparison = String(left.scope).localeCompare(String(right.scope));
  if (scopeComparison !== 0) {
    return scopeComparison;
  }

  return String(left.recordId).localeCompare(String(right.recordId));
}
