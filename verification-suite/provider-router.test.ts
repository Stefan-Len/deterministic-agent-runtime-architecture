// deterministic-agent-runtime-architecture
// Copyright (c) 2026 Stefan Len
// SPDX-License-Identifier: MIT

import assert from "node:assert/strict";
import test from "node:test";
import { chooseProviderProfile } from "../runtime-kernel/index.ts";

test("chooses the first available provider profile for the required tier", () => {
  const decision = chooseProviderProfile({
    actionId: "runtime.plan-change-set",
    requiredTier: "large-reasoning",
    profiles: [
      {
        providerId: "provider-alpha",
        modelProfileId: "alpha-large",
        tier: "large-reasoning",
        available: false
      },
      {
        providerId: "provider-beta",
        modelProfileId: "beta-large",
        tier: "large-reasoning",
        available: true
      }
    ]
  });

  assert.equal(decision.status, "selected");
  assert.equal(decision.providerId, "provider-beta");
  assert.deepEqual(decision.fallbackChain, ["provider-alpha", "provider-beta"]);
});

test("returns an unavailable decision when no profile can satisfy the tier", () => {
  const decision = chooseProviderProfile({
    actionId: "runtime.plan-change-set",
    requiredTier: "large-reasoning",
    profiles: [
      {
        providerId: "provider-alpha",
        modelProfileId: "alpha-small",
        tier: "small-fast",
        available: true
      }
    ]
  });

  assert.deepEqual(decision, {
    status: "unavailable",
    decisionReason: "No available provider profile for tier large-reasoning.",
    fallbackChain: ["provider-alpha"]
  });
});
