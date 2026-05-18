# Context Vault

The context vault holds explicit records used by the runtime. It is not an unbounded memory system.

## Record Shape

A context record should include:

- record id
- scope
- visibility
- source
- provider safety level
- content summary
- selection tags
- created timestamp

See [`context-record.example.json`](../examples/contracts/context-record.example.json).

## Visibility Levels

Recommended visibility levels:

- `local-only`: may be used by local runtime logic, never sent to a provider
- `provider-safe-summary`: safe summary may enter provider context
- `public-reference`: safe to show in generated artifacts or docs

## Retrieval Rule

Context selection should be deterministic. A runtime should be able to answer:

- which records were selected
- why each record matched
- which records were excluded
- what was sent to the provider
- what stayed local

## Anti-Pattern

Do not treat prior conversational text as hidden memory authority. If context matters, store it as a scoped record with visibility and retrieval metadata.
