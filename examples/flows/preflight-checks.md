# Preflight Checks

A preflight result should explain every check, not only the final outcome.

The canonical check categories are documented in [`docs/DECISION_GATE.md`](../../docs/DECISION_GATE.md). This example flow keeps the rule simple: a blocked result must include a stable reason code and enough context for the host UI to explain the block without re-running the provider.
