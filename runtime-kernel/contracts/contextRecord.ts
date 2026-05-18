// deterministic-agent-runtime-architecture
// Copyright (c) 2026 Stefan Len
// SPDX-License-Identifier: MIT

export type ContextVisibility =
  | "local-only"
  | "provider-safe-summary"
  | "public-reference";

export interface ContextRecord {
  readonly recordId: string;
  readonly scope: string;
  readonly visibility: ContextVisibility;
  readonly actionId?: string;
}

export type ContextSelectionReason =
  | "matched-action-and-scope"
  | "action-mismatch"
  | "scope-mismatch"
  | "not-selected";

export interface ContextSelectionTraceEntry {
  readonly recordId: string;
  readonly scope: string;
  readonly selected: boolean;
  readonly reason: ContextSelectionReason;
  readonly providerEligible: boolean;
}

export interface ContextSelectionInput {
  readonly actionId: string;
  readonly requiredScopes?: readonly string[];
  readonly records: readonly ContextRecord[];
}

export interface ContextSelectionResult {
  readonly selectedRecords: readonly ContextRecord[];
  readonly providerRecords: readonly ContextRecord[];
  readonly trace: readonly ContextSelectionTraceEntry[];
}
