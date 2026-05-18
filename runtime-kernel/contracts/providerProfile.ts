// deterministic-agent-runtime-architecture
// Copyright (c) 2026 Stefan Len
// SPDX-License-Identifier: MIT

export interface ProviderProfile {
  readonly providerId: string;
  readonly modelProfileId: string;
  readonly tier: string;
  readonly available: boolean;
}

export interface ProviderRoutingInput {
  readonly actionId: string;
  readonly requiredTier: string;
  readonly profiles: readonly ProviderProfile[];
}

export interface ProviderDecisionMetadata {
  readonly schemaVersion?: 1;
  readonly decisionId?: string;
  readonly actionId?: string;
  readonly payloadHash?: string;
  readonly rawPayloadStored?: false;
}

export interface SelectedProviderDecision extends ProviderDecisionMetadata {
  readonly status: "selected";
  readonly providerId: string;
  readonly modelProfileId: string;
  readonly decisionReason: string;
  readonly fallbackChain: readonly string[];
}

export interface UnavailableProviderDecision extends ProviderDecisionMetadata {
  readonly status: "unavailable";
  readonly decisionReason: string;
  readonly fallbackChain: readonly string[];
}

export type ProviderDecision =
  | SelectedProviderDecision
  | UnavailableProviderDecision;
