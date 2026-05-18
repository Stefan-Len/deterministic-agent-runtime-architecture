// deterministic-agent-runtime-architecture
// Copyright (c) 2026 Stefan Len
// SPDX-License-Identifier: MIT

export type PreflightStatus = "ready" | "blocked";

export type PreflightCheckStatus = "passed" | "blocked";

export type PreflightBlockReason =
  | "approval-not-approved"
  | "recovery-point-not-prepared"
  | "empty-proposed-changes"
  | "path-not-allowed"
  | "file-type-not-allowed";

export interface PassedPreflightCheck {
  readonly checkId: string;
  readonly status: "passed";
  readonly message: string;
}

export interface BlockedPreflightCheck {
  readonly checkId: string;
  readonly status: "blocked";
  readonly reason: PreflightBlockReason;
  readonly message: string;
}

export type PreflightCheck = PassedPreflightCheck | BlockedPreflightCheck;

export interface PreflightResult {
  readonly status: PreflightStatus;
  readonly checks: readonly PreflightCheck[];
  readonly blockReasons: readonly PreflightBlockReason[];
}
