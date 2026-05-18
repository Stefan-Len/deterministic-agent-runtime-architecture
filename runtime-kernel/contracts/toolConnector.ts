// deterministic-agent-runtime-architecture
// Copyright (c) 2026 Stefan Len
// SPDX-License-Identifier: MIT

export type ToolConnectorMode = "read-only" | "write-with-approval";

export interface ToolConnectorResourceBoundary {
  readonly type: string;
  readonly allowlist: readonly string[];
}

export interface ToolConnector {
  readonly schemaVersion: 1;
  readonly connectorId: string;
  readonly title: string;
  readonly capabilityClass: string;
  readonly allowedActions: readonly string[];
  readonly mode: ToolConnectorMode;
  readonly approvalRequired: boolean;
  readonly resourceBoundary: ToolConnectorResourceBoundary;
  readonly timeoutMs: number;
  readonly outputSchema: string;
  readonly auditCategory: string;
}
