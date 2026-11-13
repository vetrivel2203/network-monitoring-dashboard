import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Badge from '../common/Badge';

export default function NfaModule() {
  const [inputSeq, setInputSeq] = useState('010110');
  const [result, setResult] = useState(null);

  const runSimulation = async (val) => {
    try {
      const res = await api.flat.simulateNfa(val);
      if (res.success) setResult(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    runSimulation(inputSeq);
  }, []);

  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
            Unit 1B: NFA Anomaly Pattern Detector
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Language: L = (0+1)* 11 (0+1)* (Detects at least two consecutive dropped packets)
          </span>
        </div>
        <Badge
          status={result?.isAccepted ? 'CRITICAL' : 'ONLINE'}
          text={result?.isAccepted ? 'ANOMALY DETECTED' : 'HEALTHY STREAM'}
          size="md"
        />
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '1.25rem' }}>
        <input
          type="text"
          value={inputSeq}
          onChange={(e) => {
            const clean = e.target.value.replace(/[^01]/g, '');
            setInputSeq(clean);
            runSimulation(clean);
          }}
          placeholder="Enter binary string"
          style={{
            flex: '1 1 200px',
            padding: '8px 12px',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            color: '#818cf8',
            fontFamily: 'var(--font-mono)',
            fontSize: '1rem',
            letterSpacing: '0.15em'
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>
          SIMULTANEOUS NFA ACTIVE SUBSET STATES:
        </div>
        {result?.trace?.map((t, idx) => (
          <div
            key={idx}
            style={{
              padding: '6px 10px',
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.8125rem',
              fontFamily: 'var(--font-mono)'
            }}
          >
            <span style={{ color: 'var(--text-dim)' }}>Step {t.step}: Symbol '{t.symbol}'</span>
            <span>
              Active States: <strong style={{ color: 'var(--accent-cyan)' }}>{JSON.stringify(t.activeStatesAfter)}</strong>
            </span>
            {t.hasReachedAccept && (
              <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.75rem' }}>Accepting State s2 Reached!</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}