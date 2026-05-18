# Runtime Contracts

Runtime contracts are the core unit of the architecture. They make agent behavior explicit before any provider call or tool call happens.

## Action Contract

An action contract defines:

- stable action id
- schema version
- input shape
- required context scopes
- allowed provider tiers
- allowed tool capabilities
- output artifact type
- approval requirement
- recovery requirement
- audit category

See [`action-contract.example.json`](../examples/contracts/action-contract.example.json). The matching TypeScript interface is `ActionContract` in `runtime-kernel/contracts/actionContract.ts`.

## Session Contract

A session groups related work. It should not carry hidden authority. It may hold:

- session id
- actor id
- workspace reference
- active work item ids
- status event cursor
- created timestamp

## Work Item Contract

A work item is the unit of tracked runtime progress. It can be blocked, ready, terminal, or waiting for a decision. A work item should expose status without exposing sensitive context.

## Artifact Contract

An artifact is a normalized candidate output. It should include:

- artifact id
- source action id
- normalized status
- lineage metadata
- validation summary
- risk summary
- preview references

## Approval Levels

The reference kernel uses three approval levels:

- `operator` for normal human approval of bounded work
- `maintainer` for broader repository changes
- `system-owner` for high-risk runtime or policy changes

The kernel demonstrates the field as a contract value; it does not implement organization-specific authorization.

## Contract Rule

A provider response should never become runtime authority directly. It must first pass through normalization and become a typed artifact.

## Verification

The `verification-suite/` directory checks the contract behavior that is represented in `runtime-kernel/`:

- context records are selected deterministically
- local-only records are excluded from provider context
- preflight blocks unapproved work, missing recovery points, and empty change sets
- path and file type policies are enforced
- provider profile decisions are deterministic
- ledger ids are stable for canonical input
