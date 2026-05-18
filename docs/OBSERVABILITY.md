# Observability

Observability is part of the runtime boundary. The system should not rely on a human reading chat history to understand what happened.

## Execution Ledger

The execution ledger stores structured records for meaningful runtime events:

- action resolved
- context selected
- provider routed
- artifact normalized
- approval requested
- approval decided
- preflight checked
- recovery point prepared
- tool call attempted
- execution blocked

See [`execution-ledger-record.example.json`](../examples/contracts/execution-ledger-record.example.json).

## Record Policy

Ledger records should include identifiers and safe summaries, not raw sensitive payloads.

Recommended fields:

- event id
- timestamp
- event type
- actor id
- action id
- work item id
- correlation id
- safe context
- schema version

## Structured Logs

Structured logs are operational support records. They should help diagnose failure without becoming a data leak.

## Support Export Boundary

Support bundles should be allowlisted exports. They should include summaries and IDs, not raw provider payloads, secrets, or local-only context content.
