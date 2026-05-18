# Recovery Model

The recovery model defines what must exist before write-capable execution can run.

## Recovery Point

A recovery point is a prepared safety record. It can link an approval ticket to the state needed for rollback or inspection.

See [`recovery-point.example.json`](../examples/contracts/recovery-point.example.json).

## Status Model

Suggested statuses:

- `prepared`
- `committed`
- `rolled-back`

Only prepared recovery points should satisfy write preflight.

## Strict Failure Rule

Recovery prerequisites are strict. If a write path requires a recovery point and the recovery point cannot be verified, execution should stop.

## Non-Goals

This document does not define actual file snapshot implementation, rollback execution, or destructive operations. It defines the readiness boundary.
