import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Badge from '../common/Badge';

export default function TmModule() {
  const [tapeInput, setTapeInput] = useState('101101');
  const [result, setResult] = useState(null);

  const runTm = async (val) => {
    try {
      const res = await api.flat.simulateTuring(val);
      if (res.success) setResult(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    runTm(tapeInput);
  }, []);

  const latestTrace = result?.trace?.[result.trace.length - 1];

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
          Unit 5: Turing Machine Educational Simulator
        </h3>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          7-Tuple Computational Automaton verifying Packet Even-Parity Error Detection
        </span>
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="text"
          value={tapeInput}
          onChange={(e) => {
            const clean = e.target.value.replace(/[^01]/g, '');
            setTapeInput(clean);
            runTm(clean);
          }}
          placeholder="e.g. 101101 (even 1s), 101 (odd 1s)"
          style={{
            flex: '1 1 200px',
            padding: '8px 12px',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            color: '#10b981',
            fontFamily: 'var(--font-mono)',
            fontSize: '1rem',
            letterSpacing: '0.15em'
          }}
        />
        <Badge
          status={result?.isAccepted ? 'ONLINE' : 'OFFLINE'}
          text={result?.isAccepted ? 'EVEN PARITY: ACCEPT' : 'ODD PARITY: REJECT'}
          size="md"
        />
      </div>

      {/* Infinite Tape Visualizer */}
      <div style={{ padding: '1.5rem', backgroundColor: 'rgba(0, 0, 0, 0.4)', borderRadius: '10px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.75rem', fontWeight: 600 }}>
          INFINITE TAPE CELLS & MOVABLE READ/WRITE HEAD
        </div>

        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '10px 0' }}>
          {latestTrace?.tapeSnapshot?.map((cell, idx) => (
            <div
              key={idx}
              style={{
                width: '44px',
                height: '48px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '2px solid rgba(0, 210, 255, 0.4)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: '1.125rem',
                fontWeight: 700,
                color: '#ffffff'
              }}
            >
              {cell}
            </div>
          ))}
        </div>

        <div style={{ fontSize: '0.8125rem', color: 'var(--accent-cyan)', marginTop: '0.75rem', fontFamily: 'var(--font-mono)' }}>
          Final State: <strong>{result?.finalState}</strong> | Total Execution Steps: <strong>{result?.totalSteps}</strong>
        </div>
      </div>

      <div style={{ padding: '1rem', backgroundColor: 'rgba(0, 0, 0, 0.25)', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.8125rem', lineHeight: 1.6 }}>
        <div style={{ color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '0.25rem' }}>
          Halting Problem & Undecidability in Networks
        </div>
        <p style={{ color: 'var(--text-muted)' }}>{result?.theoreticalNote}</p>
      </div>
    </div>
  );
}