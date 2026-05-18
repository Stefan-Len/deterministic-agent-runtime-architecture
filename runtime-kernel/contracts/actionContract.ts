// deterministic-agent-runtime-architecture
// Copyright (c) 2026 Stefan Len
// SPDX-License-Identifier: MIT

import type { JsonValue } from "./ledgerRecord.ts";

export interface ActionContract {
  readonly schemaVersion: 1;
  readonly actionId: string;
  readonly title: string;
  readonly inputSchema: JsonValue;
  readonly requiredContextScopes: readonly string[];
  readonly allowedProviderTiers: readonly string[];
  readonly allowedToolCapabilities: readonly string[];
  readonly outputArtifactType: string;
  readonly approvalRequired: boolean;
  readonly recoveryRequiredBeforeWrite: boolean;
  readonly auditCategory: string;
}
