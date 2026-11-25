# ThumbGate local gate demo

A standalone Node.js simulation showing a local gate checking a proposed destructive database action.

## Run

`node demo.js`

## The three steps

1. **Blocked destructive action:** The demo prints a preflight manifest, blocks `DROP TABLE customers` before execution, and shows proof that both in-memory customer rows survive.
2. **Remembered thumbs-down:** The same destructive proposal is blocked again using the remembered thumbs-down for that command.
3. **Allowed read:** A read-only `SELECT` is allowed and returns the simulated rows.

## Scope

This is a simulation with no live agent, shell, or database connected, and therefore does not prove real-world enforcement.

Learn more: [ThumbGate Reliable Agent Governance Kit](https://thumbgate.ai)
