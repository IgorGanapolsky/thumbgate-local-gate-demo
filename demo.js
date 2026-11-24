'use strict';

// ThumbGate local demo: a deterministic simulation, not a live agent hook.
const customers = [
  { id: 1, name: 'Ada Lovelace' },
  { id: 2, name: 'Grace Hopper' }
];
const thumbsDownMemory = new Map();

function evaluateGate(proposal) {
  const rememberedLesson = thumbsDownMemory.get(proposal.command);
  if (rememberedLesson) {
    return {
      allowed: false,
      rule: 'remembered thumbs-down for this exact command',
      lesson: rememberedLesson
    };
  }
  if (/^DROP TABLE\b/i.test(proposal.command)) {
    return {
      allowed: false,
      rule: 'destructive SQL requires explicit review'
    };
  }
  if (/^SELECT\b/i.test(proposal.command)) {
    return { allowed: true, rule: 'read-only SELECT query' };
  }
  return { allowed: false, rule: 'unrecognized command is not allowed in this simulation' };
}

function printManifest(proposal, rule) {
  console.log('');
  console.log('PREFLIGHT MANIFEST');
  console.log(`Tool: ${proposal.tool}`);
  console.log(`Command: ${proposal.command}`);
  console.log(`Arguments: ${JSON.stringify(proposal.arguments)}`);
  console.log(`Affected resource: ${proposal.affectedResource}`);
  console.log(`Matched gate rule: ${rule}`);
}

function gate(proposal) {
  const result = evaluateGate(proposal);
  printManifest(proposal, result.rule);
  console.log(`Gate decision: ${result.allowed ? 'ALLOW' : 'BLOCK (not executed)'}`);
  return result;
}

console.log('ThumbGate local demo — SIMULATION ONLY');
console.log('No live agent, shell, or database is connected.');

const destructiveProposal = {
  tool: 'db.query',
  command: 'DROP TABLE customers',
  arguments: { sql: 'DROP TABLE customers' },
  affectedResource: 'in-memory table "customers"'
};

console.log('');
console.log('1) Agent proposes a destructive action');
console.log('Agent proposal: db.query("DROP TABLE customers")');
const firstDecision = gate(destructiveProposal);
if (!firstDecision.allowed) {
  console.log('Execution: skipped; blocked before it ran.');
}
console.log(`Proof: table still has ${customers.length} rows: ${customers.map((row) => row.name).join(', ')}`);

const lesson = 'Never run destructive deletes against demo/prod paths without explicit review.';
thumbsDownMemory.set(destructiveProposal.command, lesson);
console.log(`Thumbs-down recorded: "${lesson}"`);

console.log('');
console.log('2) Agent proposes the same mistake again');
console.log('Agent proposal: db.query("DROP TABLE customers")');
const repeatedDecision = gate(destructiveProposal);
if (!repeatedDecision.allowed && repeatedDecision.lesson) {
  console.log('Memory: ThumbGate remembers thumbs-down feedback, so the agent stops repeating this mistake.');
}

const safeReadProposal = {
  tool: 'db.query',
  command: 'SELECT name FROM customers',
  arguments: { sql: 'SELECT name FROM customers' },
  affectedResource: 'in-memory table "customers" (read-only)'
};

console.log('');
console.log('3) Agent proposes a safe read');
console.log('Agent proposal: db.query("SELECT name FROM customers")');
const readDecision = gate(safeReadProposal);
if (readDecision.allowed) {
  const names = customers.map((row) => row.name);
  console.log(`Execution: simulated read returned ${names.length} rows: ${names.join(', ')}`);
}

console.log('');
console.log('Done. Simulation only; no external tools were called.');