// deterministic-agent-runtime-architecture
// Copyright (c) 2026 Stefan Len
// SPDX-License-Identifier: MIT

export type JsonPrimitive = string | number | boolean | null;

export type JsonValue =
  | JsonPrimitive
  | readonly JsonValue[]
  | { readonly [key: string]: JsonValue };

export interface LedgerRecordInput {
  readonly timestamp: string;
  readonly eventType: string;
  readonly actorId: string;
  readonly actionId: string;
  readonly workItemId: string;
  readonly correlationId: string;
  readonly summary: { readonly [key: string]: JsonValue };
}

export interface LedgerRecord extends LedgerRecordInput {
  readonly schemaVersion: 1;
  readonly eventId: string;
}
