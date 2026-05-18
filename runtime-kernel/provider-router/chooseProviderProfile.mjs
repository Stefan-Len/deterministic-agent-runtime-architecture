// deterministic-agent-runtime-architecture
// Copyright (c) 2026 Stefan Len
// SPDX-License-Identifier: MIT

/**
 * Chooses a provider profile from an ordered policy table.
 *
 * The first available profile that satisfies the requested tier wins. This is
 * deliberate: routing should be explainable and deterministic, not emergent.
 *
 * @param {object} input
 * @param {string} input.actionId
 * @param {string} input.requiredTier
 * @param {readonly object[]} input.profiles
 * @returns {{providerId: string, modelProfileId: string, decisionReason: string, fallbackChain: readonly string[]}}
 */
export function chooseProviderProfile({ actionId, requiredTier, profiles }) {
  const fallbackChain = profiles.map((profile) => profile.providerId);
  const selected = profiles.find(
    (profile) => profile.tier === requiredTier && profile.available === true
  );

  if (!selected) {
    return {
      providerId: "none",
      modelProfileId: "unavailable",
      decisionReason: `No available provider profile for tier ${requiredTier}.`,
      fallbackChain
    };
  }

  return {
    providerId: selected.providerId,
    modelProfileId: selected.modelProfileId,
    decisionReason: `Selected ${selected.providerId} for ${actionId} because tier ${requiredTier} is available.`,
    fallbackChain
  };
}
