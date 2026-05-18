// deterministic-agent-runtime-architecture
// Copyright (c) 2026 Stefan Len
// SPDX-License-Identifier: MIT

import type {
  ProviderDecision,
  ProviderRoutingInput
} from "../contracts/providerProfile.ts";

export function chooseProviderProfile({
  actionId,
  requiredTier,
  profiles
}: ProviderRoutingInput): ProviderDecision {
  const fallbackChain = profiles.map((profile) => profile.providerId);
  const selected = profiles.find(
    (profile) => profile.tier === requiredTier && profile.available === true
  );

  if (!selected) {
    return {
      status: "unavailable",
      decisionReason: `No available provider profile for tier ${requiredTier}.`,
      fallbackChain
    };
  }

  return {
    status: "selected",
    providerId: selected.providerId,
    modelProfileId: selected.modelProfileId,
    decisionReason: `Selected ${selected.providerId} for ${actionId} because tier ${requiredTier} is available.`,
    fallbackChain
  };
}
