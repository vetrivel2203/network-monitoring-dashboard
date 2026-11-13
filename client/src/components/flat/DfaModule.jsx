import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Badge from '../common/Badge';

export default function DfaModule() {
  const [inputSeq, setInputSeq] = useState('0010110');
  const [result, setResult] = useState(null);

  const runSimulation = async (val) => {
    try {
      const res = await api.flat.simulateDfa(val);
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
            Unit 1A: DFA Network Status Classifier
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Alphabet Σ = {'{0, 1}'} (0 = Healthy Reply, 1 = Packet Drop)
          </span>
        </div>
        <Badge
          status={result?.isAccepted ? 'ONLINE' : 'CRITICAL'}
          text={result?.finalStatus || 'SIMULATING'}
          size="md"
        />
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={inputSeq}
          onChange={(e) => {
            const clean = e.target.value.replace(/[^01]/g, '');
            setInputSeq(clean);
            runSimulation(clean);
          }}
          placeholder="e.g. 0010110"
          style={{
            flex: '1 1 200px',
            padding: '8px 12px',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            color: 'var(--accent-cyan)',
            fontFamily: 'var(--font-mono)',
            fontSize: '1rem',
            letterSpacing: '0.15em'
          }}
        />
        <div style={{ display: 'flex', gap: '6px' }}>
          {['0000', '00101', '0110', '111'].map((preset) => (
            <button
              key={preset}
              onClick={() => {
                setInputSeq(preset);
                runSimulation(preset);
              }}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer'
              }}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* State Circles */}
      <div style={{ padding: '1.5rem', backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: '10px', border: '1px solid var(--border-subtle)', marginBottom: '1.25rem' }}>
        <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>
          INTERACTIVE STATE TRANSITION DIAGRAM (Active State Glowing)
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          {[
            { id: 'q0', label: 'q0', desc: 'Normal / Healthy', sub: 'Start State' },
            { id: 'q1', label: 'q1', desc: 'Warning / Degraded', sub: '1 Drop' },
            { id: 'q2', label: 'q2', desc: 'Critical / Offline', sub: '2+ Consecutive Drops' },
          ].map((st) => {
            const isActive = result?.finalState === st.id;
            return (
              <div key={st.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div
                  style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    border: isActive ? '3px solid var(--accent-cyan)' : '2px solid rgba(255, 255, 255, 0.2)',
                    backgroundColor: isActive ? 'rgba(0, 210, 255, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    boxShadow: isActive ? '0 0 20px var(--accent-cyan)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isActive ? '#ffffff' : 'var(--text-muted)',
                    fontWeight: 800,
                    fontSize: '1.125rem',
                    fontFamily: 'var(--font-mono)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {st.label}
                </div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: isActive ? 'var(--accent-cyan)' : '#ffffff' }}>
                  {st.desc}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>{st.sub}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transition Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', textAlign: 'center' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
            <th style={{ padding: '6px', textAlign: 'left' }}>State (Q)</th>
            <th style={{ padding: '6px' }}>Input = 0 (Reply OK)</th>
            <th style={{ padding: '6px' }}>Input = 1 (Loss)</th>
            <th style={{ padding: '6px' }}>Accepting State?</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <td style={{ padding: '6px', textAlign: 'left', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>→ q0 (Normal)</td>
            <td style={{ padding: '6px', fontFamily: 'var(--font-mono)' }}>q0</td>
            <td style={{ padding: '6px', fontFamily: 'var(--font-mono)' }}>q1</td>
            <td style={{ padding: '6px', color: '#10b981' }}>Yes (Tolerable)</td>
          </tr>
          <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <td style={{ padding: '6px', textAlign: 'left', fontFamily: 'var(--font-mono)', color: '#f59e0b' }}>q1 (Warning)</td>
            <td style={{ padding: '6px', fontFamily: 'var(--font-mono)' }}>q0</td>
            <td style={{ padding: '6px', fontFamily: 'var(--font-mono)' }}>q2</td>
            <td style={{ padding: '6px', color: '#10b981' }}>Yes (Tolerable)</td>
          </tr>
          <tr>
            <td style={{ padding: '6px', textAlign: 'left', fontFamily: 'var(--font-mono)', color: '#ef4444' }}>q2 (Critical)</td>
            <td style={{ padding: '6px', fontFamily: 'var(--font-mono)' }}>q1</td>
            <td style={{ padding: '6px', fontFamily: 'var(--font-mono)' }}>q2</td>
            <td style={{ padding: '6px', color: '#ef4444' }}>No (Violates SLA)</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}