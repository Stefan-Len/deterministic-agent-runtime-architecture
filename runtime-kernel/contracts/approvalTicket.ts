// deterministic-agent-runtime-architecture
// Copyright (c) 2026 Stefan Len
// SPDX-License-Identifier: MIT

export type ApprovalDecision = "pending" | "approved" | "rejected";

export type ApprovalLevel = "operator" | "maintainer" | "system-owner";

export interface ApprovalTicket {
  readonly schemaVersion?: 1;
  readonly approvalId: string;
  readonly actionId?: string;
  readonly artifactId?: string;
  readonly approvalLevel: ApprovalLevel;
  readonly decision: ApprovalDecision;
  readonly requiresRecoveryPointBeforeWrite: boolean;
  readonly allowedPaths: readonly string[];
  readonly allowedFileTypes: readonly string[];
  readonly createdAt?: string;
}

export type RecoveryPointStatus = "prepared" | "committed" | "rolled-back";

export interface RecoveryPointMetadata {
  readonly changeSetId?: string;
  readonly contentSnapshotStored?: boolean;
  readonly rollbackExecutionStored?: boolean;
}

export interface RecoveryPoint {
  readonly schemaVersion?: 1;
  readonly recoveryPointId?: string;
  readonly approvalId: string;
  readonly status: RecoveryPointStatus;
  readonly createdAt?: string;
  readonly metadata?: RecoveryPointMetadata;
}

export interface ProposedChange {
  readonly path: string;
}
