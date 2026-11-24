# ThumbGate local gate demo

A free, standalone Node.js demonstration of a coding agent proposing a destructive database action and a simulated gate checking it before execution. It uses only Node.js built-ins; there is no framework, build step, dependency install, API key, network call, live agent, shell, or database.

## Run it

Install Node.js if it is not already available, then run this one command from this directory:

```sh
node demo.js
```

No `npm install` is needed.

## What you should see

The terminal labels the program as a **SIMULATION ONLY**, prints a preflight manifest for `DROP TABLE customers` (including the command, arguments, affected in-memory table, and matched rule), blocks the action, and confirms the two in-memory rows remain. It then records a thumbs-down lesson, blocks the identical proposal using that remembered lesson, and allows a read-only `SELECT` query. The exact output is deterministic.

This demo is a simulation; it does **not** prove a live hook against a real coding agent, shell, or database.

Learn more: ThumbGate Reliable Agent Governance Kit — https://thumbgate.ai
