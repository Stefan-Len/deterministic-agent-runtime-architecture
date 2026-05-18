# Tool Perimeter

The tool perimeter defines what tools can do and under which conditions.

A tool connector is not arbitrary code execution. It is a bounded contract.

## Connector Contract

A connector should define:

- connector id
- title
- capability class
- allowed actions
- read/write mode
- approval requirement
- path or resource boundary
- timeout
- output schema
- audit category

See [`tool-connector.example.json`](../examples/contracts/tool-connector.example.json). The matching TypeScript interface is `ToolConnector` in `runtime-kernel/contracts/toolConnector.ts`.

## Recommended Connector Classes

### Repository Connector

Read status, diff, branch, and commit metadata. Write operations require explicit approval and should remain scoped.

### Filesystem Connector

Bounded file read/write with path allowlists. No global filesystem access.

### Shell Connector

Command allowlist only. No arbitrary shell by default.

### Documentation Connector

Search and read canonical Markdown documents. Useful for retrieval without scanning unrelated files.

### Build Connector

Run explicit build/test commands and parse structured results.

## Operational Boundary

The tool perimeter should keep dangerous capabilities explicit, narrow, logged, and easy to deny.
