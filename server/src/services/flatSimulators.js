/**
 * Formal Languages and Automata Theory (FLAT) Simulation Engines
 * Educational models mapped to Computer Networks applications.
 */

class FlatSimulators {
  // ==========================================
  // UNIT 1: DFA & NFA
  // ==========================================

  /**
   * DFA Network Status Classifier
   * States: q0 (Normal), q1 (Warning - 1 drop), q2 (Critical - 2+ drops)
   * Alphabet: '0' (Healthy Reply), '1' (Dropped Packet)
   */
  static simulateDfa(inputSequence = '0010110') {
    const states = ['q0', 'q1', 'q2'];
    const alphabet = ['0', '1'];
    const stateNames = {
      q0: 'Normal / Healthy',
      q1: 'Warning / Degraded',
      q2: 'Critical / Offline'
    };
    const startState = 'q0';
    const acceptStates = ['q0', 'q1']; // Tolerable states

    // Transition Table: delta(state, symbol)
    const transitions = {
      q0: { '0': 'q0', '1': 'q1' },
      q1: { '0': 'q0', '1': 'q2' },
      q2: { '0': 'q1', '1': 'q2' }
    };

    let currentState = startState;
    const trace = [];

    for (let i = 0; i < inputSequence.length; i++) {
      const symbol = inputSequence[i];
      if (!alphabet.includes(symbol)) {
        continue;
      }
      const prevState = currentState;
      currentState = transitions[prevState][symbol];
      trace.push({
        step: i + 1,
        input: symbol,
        event: symbol === '0' ? 'Packet Reply (OK)' : 'Packet Drop (Loss)',
        fromState: prevState,
        toState: currentState,
        statusName: stateNames[currentState]
      });
    }

    return {
      formalDefinition: {
        tuple: '(Q, Sigma, delta, q0, F)',
        Q: states,
        Sigma: alphabet,
        startState,
        acceptStates,
        transitionTable: transitions,
        stateDescriptions: stateNames
      },
      inputSequence,
      finalState: currentState,
      finalStatus: stateNames[currentState],
      isAccepted: acceptStates.includes(currentState),
      trace
    };
  }

  /**
   * NFA Anomaly Detector
   * Detects anomaly pattern: contains two consecutive drops '11' anywhere: (0+1)* 11 (0+1)*
   */
  static simulateNfa(inputSequence = '010110') {
    const states = ['s0', 's1', 's2'];
    const stateNames = {
      s0: 'Monitoring Traffic',
      s1: 'First Drop Detected',
      s2: 'Anomaly Alert (Accepting)'
    };
    const startState = 's0';
    const acceptStates = ['s2'];

    // NFA Transitions delta(state, symbol) -> Set of states
    const transitions = {
      s0: { '0': ['s0'], '1': ['s0', 's1'] }, // Non-deterministic branch on '1'
      s1: { '0': [], '1': ['s2'] },
      s2: { '0': ['s2'], '1': ['s2'] }
    };

    let currentStates = [startState];
    const trace = [];

    for (let i = 0; i < inputSequence.length; i++) {
      const symbol = inputSequence[i];
      const nextStatesSet = new Set();
      const branches = [];

      for (const s of currentStates) {
        const dests = transitions[s][symbol] || [];
        for (const d of dests) {
          nextStatesSet.add(d);
          branches.push({ from: s, symbol, to: d });
        }
      }

      const nextStates = Array.from(nextStatesSet);
      trace.push({
        step: i + 1,
        symbol,
        activeStatesBefore: [...currentStates],
        branches,
        activeStatesAfter: nextStates,
        hasReachedAccept: nextStates.includes('s2')
      });
      currentStates = nextStates;
    }

    const isAccepted = currentStates.some(s => acceptStates.includes(s));

    return {
      formalDefinition: {
        tuple: '(Q, Sigma, delta, s0, F)',
        Q: states,
        Sigma: ['0', '1'],
        startState,
        acceptStates,
        transitionTable: {
          s0: { '0': ['s0'], '1': ['s0', 's1'] },
          s1: { '0': ['none'], '1': ['s2'] },
          s2: { '0': ['s2'], '1': ['s2'] }
        },
        language: 'L = { w in {0,1}* | w contains substring "11" (consecutive drops) }'
      },
      inputSequence,
      finalActiveStates: currentStates,
      isAccepted,
      trace
    };
  }

  // ==========================================
  // UNIT 2: REGULAR EXPRESSIONS & LANGUAGES
  // ==========================================

  /**
   * Interactive IPv4 & Hostname Regular Expression Engine
   */
  static testRegex(ipAddress = '192.168.1.1') {
    const octetRegex = '(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])';
    const fullPattern = `^(${octetRegex}\\.){3}${octetRegex}$`;
    const regex = new RegExp(fullPattern);

    const isValid = regex.test(ipAddress.trim());
    const octets = ipAddress.trim().split('.');

    const octetAnalysis = octets.map((oct, idx) => {
      const num = parseInt(oct, 10);
      const isNum = !isNaN(num) && oct === num.toString();
      const inRange = isNum && num >= 0 && num <= 255;
      return {
        octetIndex: idx + 1,
        value: oct,
        numericValue: isNum ? num : null,
        isValid: inRange,
        ruleMatched: num >= 250 && num <= 255 ? '25[0-5]'
          : (num >= 200 && num <= 249 ? '2[0-4][0-9]'
          : (num >= 100 && num <= 199 ? '1[0-9]{2}' : '[1-9]?[0-9]'))
      };
    });

    return {
      expression: fullPattern,
      explanation: {
        pattern: '((25[0-5] | 2[0-4][0-9] | 1[0-9]{2} | [1-9]?[0-9])\\.){3}...',
        components: [
          { token: '25[0-5]', range: '250 to 255' },
          { token: '2[0-4][0-9]', range: '200 to 249' },
          { token: '1[0-9]{2}', range: '100 to 199' },
          { token: '[1-9]?[0-9]', range: '0 to 99 (no leading zeroes)' },
          { token: '\\.', meaning: 'Dot delimiter matching literal period' },
          { token: '{3}', meaning: 'Repeat 3 times for first three octets' }
        ]
      },
      input: ipAddress,
      isValid,
      octetCount: octets.length,
      octetAnalysis,
      theoreticalNote: "By Kleene's Theorem, any language defined by a regular expression can be recognized by a Finite Automaton. An IPv4 address validator is a Regular Language (Chomsky Type-3)."
    };
  }

  // ==========================================
  // UNIT 3: CONTEXT-FREE GRAMMAR (CFG) & PARSE TREE
  // ==========================================

  /**
   * Generates derivations and Parse Tree for Network Alert Messages
   * Grammar:
   * S -> ALERT
   * ALERT -> LEVEL CODE TARGET
   * LEVEL -> [CRITICAL] | [WARNING] | [INFO]
   * CODE -> ERR_LATENCY | ERR_PACKET_LOSS | ERR_TIMEOUT
   * TARGET -> 8.8.8.8 | 1.1.1.1 | gw.local
   */
  static generateAlertCfg(level = '[CRITICAL]', code = 'ERR_LATENCY', target = '8.8.8.8') {
    const grammar = {
      variables: ['S', 'ALERT', 'LEVEL', 'CODE', 'TARGET'],
      terminals: ['[CRITICAL]', '[WARNING]', '[INFO]', 'ERR_LATENCY', 'ERR_PACKET_LOSS', 'ERR_TIMEOUT', '8.8.8.8', '1.1.1.1', 'gw.local'],
      startSymbol: 'S',
      rules: [
        'S -> ALERT',
        'ALERT -> LEVEL CODE TARGET',
        'LEVEL -> [CRITICAL] | [WARNING] | [INFO]',
        'CODE -> ERR_LATENCY | ERR_PACKET_LOSS | ERR_TIMEOUT',
        'TARGET -> 8.8.8.8 | 1.1.1.1 | gw.local'
      ]
    };

    // Leftmost Derivation steps
    const leftmostDerivation = [
      'S',
      '=> ALERT',
      `=> LEVEL CODE TARGET`,
      `=> ${level} CODE TARGET`,
      `=> ${level} ${code} TARGET`,
      `=> ${level} ${code} ${target}`
    ];

    // Rightmost Derivation steps
    const rightmostDerivation = [
      'S',
      '=> ALERT',
      `=> LEVEL CODE TARGET`,
      `=> LEVEL CODE ${target}`,
      `=> LEVEL ${code} ${target}`,
      `=> ${level} ${code} ${target}`
    ];

    // Hierarchical Parse Tree representation for visual rendering
    const parseTree = {
      name: 'S',
      type: 'variable',
      children: [
        {
          name: 'ALERT',
          type: 'variable',
          children: [
            {
              name: 'LEVEL',
              type: 'variable',
              children: [{ name: level, type: 'terminal' }]
            },
            {
              name: 'CODE',
              type: 'variable',
              children: [{ name: code, type: 'terminal' }]
            },
            {
              name: 'TARGET',
              type: 'variable',
              children: [{ name: target, type: 'terminal' }]
            }
          ]
        }
      ]
    };

    const generatedString = `${level} ${code} ${target}`;

    return {
      grammar,
      generatedString,
      leftmostDerivation,
      rightmostDerivation,
      parseTree,
      chomskyHierarchy: 'Type-2 Context-Free Grammar (CFG), recognized by Pushdown Automata (PDA).'
    };
  }

  // ==========================================
  // UNIT 4: PUSHDOWN AUTOMATA (PDA)
  // ==========================================

  /**
   * Simulates PDA for protocol handshake encapsulation (balanced packets: a^n b^n)
   * where 'a' = SYN / Push Packet, 'b' = ACK / Pop Packet.
   */
  static simulatePda(inputString = 'aaabbb') {
    const states = ['q0', 'q1', 'q_accept', 'q_reject'];
    const alphabet = ['a', 'b'];
    const stackAlphabet = ['Z0', 'A'];
    const initialStack = ['Z0'];

    const stack = ['Z0'];
    let currentState = 'q0';
    const trace = [];

    trace.push({
      step: 0,
      state: currentState,
      remainingInput: inputString,
      stack: [...stack],
      topOfStack: stack[stack.length - 1],
      action: 'Initial State. Stack holds bottom marker Z0.',
      id: `(q0, "${inputString}", Z0)`
    });

    for (let i = 0; i < inputString.length; i++) {
      const char = inputString[i];
      const remaining = inputString.slice(i + 1);

      if (currentState === 'q0') {
        if (char === 'a') {
          // Push 'A' onto stack
          stack.push('A');
          trace.push({
            step: i + 1,
            state: currentState,
            readChar: char,
            remainingInput: remaining,
            stack: [...stack],
            topOfStack: stack[stack.length - 1],
            action: 'Push A (SYN packet recorded into stack)',
            id: `(q0, "${remaining}", ${stack.slice().reverse().join('')})`
          });
        } else if (char === 'b') {
          // Transition to q1 and Pop 'A'
          if (stack[stack.length - 1] === 'A') {
            stack.pop();
            currentState = 'q1';
            trace.push({
              step: i + 1,
              state: currentState,
              readChar: char,
              remainingInput: remaining,
              stack: [...stack],
              topOfStack: stack[stack.length - 1],
              action: 'Transition to q1: Pop A (ACK paired with SYN)',
              id: `(q1, "${remaining}", ${stack.slice().reverse().join('')})`
            });
          } else {
            currentState = 'q_reject';
            trace.push({
              step: i + 1,
              state: currentState,
              readChar: char,
              remainingInput: remaining,
              stack: [...stack],
              topOfStack: stack[stack.length - 1],
              action: 'Reject: Unexpected b without matching A on stack',
              id: `(q_reject, "${remaining}", ${stack.slice().reverse().join('')})`
            });
            break;
          }
        }
      } else if (currentState === 'q1') {
        if (char === 'b') {
          if (stack[stack.length - 1] === 'A') {
            stack.pop();
            trace.push({
              step: i + 1,
              state: currentState,
              readChar: char,
              remainingInput: remaining,
              stack: [...stack],
              topOfStack: stack[stack.length - 1],
              action: 'Pop A (Matched ACK)',
              id: `(q1, "${remaining}", ${stack.slice().reverse().join('')})`
            });
          } else {
            currentState = 'q_reject';
            trace.push({
              step: i + 1,
              state: currentState,
              readChar: char,
              remainingInput: remaining,
              stack: [...stack],
              topOfStack: stack[stack.length - 1],
              action: 'Reject: Excess b (ACK without SYN)',
              id: `(q_reject, "${remaining}", ${stack.slice().reverse().join('')})`
            });
            break;
          }
        } else {
          currentState = 'q_reject';
          trace.push({
            step: i + 1,
            state: currentState,
            readChar: char,
            remainingInput: remaining,
            stack: [...stack],
            topOfStack: stack[stack.length - 1],
            action: 'Reject: Symbol a found after transitioning to phase b',
            id: `(q_reject, "${remaining}", ${stack.slice().reverse().join('')})`
          });
          break;
        }
      }
    }

    // Check acceptance
    let isAccepted = false;
    if (currentState === 'q1' && stack.length === 1 && stack[0] === 'Z0') {
      currentState = 'q_accept';
      isAccepted = true;
      trace.push({
        step: trace.length,
        state: 'q_accept',
        readChar: 'epsilon',
        remainingInput: '',
        stack: [...stack],
        topOfStack: 'Z0',
        action: 'Acceptance: Input exhausted and stack contains only Z0 (balanced handshake).',
        id: `(q_accept, epsilon, Z0)`
      });
    }

    return {
      formalTuple: '(Q, Sigma, Gamma, delta, q0, Z0, F)',
      language: 'L = { a^n b^n | n >= 1 } (Models balanced SYN/ACK handshakes)',
      inputString,
      isAccepted,
      finalState: currentState,
      finalStack: stack,
      trace
    };
  }

  // ==========================================
  // UNIT 5: TURING MACHINE (TM)
  // ==========================================

  /**
   * Simulates a Turing Machine for network packet parity verification.
   * Checks if a binary packet string has EVEN PARITY.
   */
  static simulateTuringMachine(inputTape = '101101') {
    const tape = inputTape.split('');
    if (tape.length === 0) tape.push('0');
    // Blank symbols on both sides
    const fullTape = [...tape, 'B', 'B'];
    let head = 0;
    let state = 'q_even'; // Start state: even number of 1s seen so far

    const transitions = {
      q_even: {
        '0': { nextState: 'q_even', write: '0', move: 'R' },
        '1': { nextState: 'q_odd', write: '1', move: 'R' },
        'B': { nextState: 'q_accept', write: 'B', move: 'N' } // Halts and accepts
      },
      q_odd: {
        '0': { nextState: 'q_odd', write: '0', move: 'R' },
        '1': { nextState: 'q_even', write: '1', move: 'R' },
        'B': { nextState: 'q_reject', write: 'B', move: 'N' } // Halts and rejects
      }
    };

    const trace = [];
    let step = 0;
    const maxSteps = 100;

    while (step < maxSteps) {
      const currentSymbol = fullTape[head] !== undefined ? fullTape[head] : 'B';
      const transition = transitions[state] ? transitions[state][currentSymbol] : null;

      trace.push({
        step,
        state,
        headIndex: head,
        tapeSnapshot: [...fullTape],
        readSymbol: currentSymbol,
        action: transition 
          ? `Write '${transition.write}', Move ${transition.move === 'R' ? 'Right' : (transition.move === 'L' ? 'Left' : 'None')}, goto ${transition.nextState}`
          : 'Halted (No valid transition)'
      });

      if (!transition || state === 'q_accept' || state === 'q_reject') {
        break;
      }

      fullTape[head] = transition.write;
      state = transition.nextState;
      if (transition.move === 'R') head++;
      else if (transition.move === 'L') head = Math.max(0, head - 1);

      step++;
    }

    const isAccepted = state === 'q_accept';

    return {
      formalTuple: 'M = (Q, Sigma, Gamma, delta, q_even, B, {q_accept})',
      taskDescription: 'Packet Even-Parity Verifier (Determines if transmitted packet is error-free under parity scheme)',
      inputTape,
      finalState: state,
      isAccepted,
      totalSteps: step,
      trace,
      theoreticalNote: 'The Turing Machine is the most powerful computational model (Chomsky Type-0). Alan Turing proved that the Halting Problem is Undecidable; similarly, determining whether an arbitrary network routing policy will avoid infinite routing loops in all topologies is undecidable.'
    };
  }
}

module.exports = FlatSimulators;