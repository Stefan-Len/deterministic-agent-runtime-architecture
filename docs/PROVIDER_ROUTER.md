# Provider Router

The provider router selects the model provider and model profile for a work item. It does not transfer runtime authority to the provider.

## Router Inputs

A provider decision can use:

- action id
- required capability
- cost tier
- latency tier
- context sensitivity
- offline requirement
- provider availability
- explicit user or policy override

## Router Output

A provider decision should record:

- provider id
- model profile id
- decision reason
- fallback chain
- payload hash
- raw payload inclusion policy

See [`provider-decision.example.json`](../examples/contracts/provider-decision.example.json).

## Boundary

Provider-specific output must be normalized before entering the runtime contract layer. The provider may suggest. The runtime decides what is accepted.

## Routing Rule

A provider adapter should be replaceable without changing the action contract or approval contract.
