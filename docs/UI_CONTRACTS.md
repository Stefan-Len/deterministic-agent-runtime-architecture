# UI Contracts

The UI should consume runtime contracts. It should not own agent authority.

## UI-Ready Read Models

A runtime can expose read models for:

- sessions
- work items
- decision state
- preflight status
- artifact preview
- context trace
- provider decision summary
- tool call summary
- ledger tail

## Host Boundary

A host can display and request actions. The backend runtime remains the contract authority.

## Useful Panels

A complete host can eventually render:

- work queue
- active work item
- decision gate state
- context trace
- artifact preview
- tool execution log
- recovery readiness
- provider/model selection

## State Boundary

UI state should be derived from runtime contracts and event records. It should not infer hidden state from unstructured text.
