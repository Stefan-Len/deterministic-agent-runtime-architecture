# Planning To Approval Flow

This example shows the runtime sequence without domain-specific details.

1. A host submits a request against an action contract.
2. The runtime validates the input shape.
3. The context vault selects scoped records.
4. The provider router selects a model profile.
5. The planning runtime creates a normalized artifact.
6. The decision gate opens an approval ticket.
7. The execution ledger records the transition.
8. A later preflight checks approval, recovery readiness, paths, and file types.

No write occurs in this flow.
