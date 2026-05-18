// deterministic-agent-runtime-architecture
// Copyright (c) 2026 Stefan Len
// SPDX-License-Identifier: MIT

export type ApprovalDecision = "pending" | "approved" | "rejected";

export interface ApprovalTicket {
  readonly approvalId: string;
  readonly decision: ApprovalDecision;
  readonly requiresRecoveryPointBeforeWrite: boolean;
  readonly allowedPaths: readonly string[];
  readonly allowedFileTypes: readonly string[];
}

export type RecoveryPointStatus = "prepared" | "committed" | "rolled-back";

export interface RecoveryPoint {
  readonly approvalId: string;
  readonly status: RecoveryPointStatus;
}

export interface ProposedChange {
  readonly path: string;
}
