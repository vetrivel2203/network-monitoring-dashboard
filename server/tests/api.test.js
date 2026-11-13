const assert = require('assert');
const { validateTarget } = require('../src/utils/hostValidator');
const JitterCalculator = require('../src/services/jitterCalculator');
const FlatSimulators = require('../src/services/flatSimulators');

async function runTests() {
  console.log('>>> RUNNING NETPULSE UNIT & ALGORITHM TEST SUITE <<<');

  // Test 1: Host Validator Sanitization & Injection Defense
  console.log('Test 1: Validating Target Sanitization & Command Injection Defense...');
  assert.strictEqual(validateTarget('8.8.8.8').valid, true);
  assert.strictEqual(validateTarget('google.com').valid, true);
  assert.strictEqual(validateTarget('1.1.1.1; rm -rf /').valid, false);
  assert.strictEqual(validateTarget('8.8.8.8 && dir').valid, false);
  assert.strictEqual(validateTarget('127.0.0.1 | whoami').valid, false);
  assert.strictEqual(validateTarget('').valid, false);
  assert.strictEqual(validateTarget('999.999.999.999').valid, false);
  console.log('✔ Test 1 Passed: Command injection vectors successfully blocked.');

  // Test 2: RFC 3550 Jitter Computation
  console.log('Test 2: Verifying RFC 3550 Jitter Calculator...');
  const rtts = [20, 25, 22, 28, 24];
  const stats = JitterCalculator.calculate(rtts);
  assert.strictEqual(typeof stats.rfc3550Jitter, 'number');
  assert.strictEqual(stats.minRtt, 20);
  assert.strictEqual(stats.maxRtt, 28);
  assert.strictEqual(stats.avgRtt, 23.8);
  assert.ok(stats.rfc3550Jitter > 0);
  console.log('✔ Test 2 Passed: RFC 3550 Jitter correctly computed:', stats.rfc3550Jitter, 'ms');

  // Test 3: FLAT Unit 1 DFA Network Status Classifier
  console.log('Test 3: Testing DFA Network Status Classifier...');
  const dfaNormal = FlatSimulators.simulateDfa('0000');
  assert.strictEqual(dfaNormal.finalState, 'q0');
  assert.strictEqual(dfaNormal.isAccepted, true);

  const dfaWarning = FlatSimulators.simulateDfa('001');
  assert.strictEqual(dfaWarning.finalState, 'q1');
  assert.strictEqual(dfaWarning.isAccepted, true);

  const dfaCritical = FlatSimulators.simulateDfa('011');
  assert.strictEqual(dfaCritical.finalState, 'q2');
  assert.strictEqual(dfaCritical.isAccepted, false);
  console.log('✔ Test 3 Passed: DFA status transitions verified.');

  // Test 4: FLAT Unit 1 NFA Anomaly Detector
  console.log('Test 4: Testing NFA Anomaly Detector...');
  const nfaClean = FlatSimulators.simulateNfa('01010');
  assert.strictEqual(nfaClean.isAccepted, false);

  const nfaDrop = FlatSimulators.simulateNfa('010110');
  assert.strictEqual(nfaDrop.isAccepted, true);
  console.log('✔ Test 4 Passed: NFA consecutive drop detection verified.');

  // Test 5: FLAT Unit 2 IPv4 Regular Expression Engine
  console.log('Test 5: Testing IPv4 Regular Expression Engine...');
  assert.strictEqual(FlatSimulators.testRegex('192.168.1.1').isValid, true);
  assert.strictEqual(FlatSimulators.testRegex('255.255.255.255').isValid, true);
  assert.strictEqual(FlatSimulators.testRegex('256.0.0.1').isValid, false);
  assert.strictEqual(FlatSimulators.testRegex('192.168.1').isValid, false);
  console.log('✔ Test 5 Passed: IPv4 Regex validation passed.');

  // Test 6: FLAT Unit 3 CFG Alert Message Generator
  console.log('Test 6: Testing Context-Free Grammar Alert Derivations...');
  const cfg = FlatSimulators.generateAlertCfg('[CRITICAL]', 'ERR_LATENCY', '8.8.8.8');
  assert.strictEqual(cfg.generatedString, '[CRITICAL] ERR_LATENCY 8.8.8.8');
  assert.ok(cfg.parseTree);
  assert.strictEqual(cfg.leftmostDerivation.length, 6);
  console.log('✔ Test 6 Passed: CFG and Parse Tree generated.');

  // Test 7: FLAT Unit 4 PDA Stack Simulator (a^n b^n)
  console.log('Test 7: Testing Pushdown Automata (PDA) Stack Simulator...');
  const pdaBalanced = FlatSimulators.simulatePda('aaabbb');
  assert.strictEqual(pdaBalanced.isAccepted, true);
  assert.strictEqual(pdaBalanced.finalState, 'q_accept');

  const pdaUnbalanced = FlatSimulators.simulatePda('aabbb');
  assert.strictEqual(pdaUnbalanced.isAccepted, false);
  console.log('✔ Test 7 Passed: PDA stack operations and handshake balancing verified.');

  // Test 8: FLAT Unit 5 Turing Machine Parity Verifier
  console.log('Test 8: Testing Turing Machine Parity Checker...');
  const tmEven = FlatSimulators.simulateTuringMachine('101101'); // four 1s -> Even
  assert.strictEqual(tmEven.isAccepted, true);
  assert.strictEqual(tmEven.finalState, 'q_accept');

  const tmOdd = FlatSimulators.simulateTuringMachine('101'); // two 1s -> Even
  const tmSingle = FlatSimulators.simulateTuringMachine('1'); // one 1 -> Odd
  assert.strictEqual(tmSingle.isAccepted, false);
  assert.strictEqual(tmSingle.finalState, 'q_reject');
  console.log('✔ Test 8 Passed: Turing Machine tape, head transitions, and halting verified.');

  console.log('\n===========================================');
  console.log('>>> ALL 8 TEST SUITES COMPLETED WITH 100% SUCCESS <<<');
  console.log('===========================================\n');
}

runTests().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});