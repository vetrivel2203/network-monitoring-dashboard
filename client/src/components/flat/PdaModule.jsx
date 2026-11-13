import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Badge from '../common/Badge';

export default function PdaModule() {
  const [input, setInput] = useState('aaabbb');
  const [result, setResult] = useState(null);

  const runPda = async (val) => {
    try {
      const res = await api.flat.simulatePda(val);
      if (res.success) setResult(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    runPda(input);
  }, []);

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
          Unit 4: Pushdown Automata (PDA) Stack Simulator
        </h3>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          Simulates balanced network handshakes (a = SYN / Push, b = ACK / Pop) for language a^n b^n
        </span>
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => {
            const clean = e.target.value.replace(/[^ab]/g, '');
            setInput(clean);
            runPda(clean);
          }}
          placeholder="e.g. aaabbb, aabb, aabbb"
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
        <Badge
          status={result?.isAccepted ? 'ONLINE' : 'OFFLINE'}
          text={result?.isAccepted ? 'BALANCED HANDSHAKE' : 'HANDSHAKE MISMATCH'}
          size="md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stack Box */}
        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.75rem', fontWeight: 600 }}>
            LIFO STACK MEMORY
          </div>
          <div
            style={{
              width: '110px',
              minHeight: '160px',
              borderLeft: '3px solid var(--accent-cyan)',
              borderRight: '3px solid var(--accent-cyan)',
              borderBottom: '3px solid var(--accent-cyan)',
              borderRadius: '0 0 8px 8px',
              display: 'flex',
              flexDirection: 'column-reverse',
              padding: '6px',
              gap: '4px',
              backgroundColor: 'rgba(0, 0, 0, 0.3)'
            }}
          >
            {result?.finalStack?.map((item, idx) => (
              <div
                key={idx}
                style={{
                  height: '26px',
                  backgroundColor: item === 'Z0' ? 'rgba(100, 116, 139, 0.4)' : 'rgba(0, 210, 255, 0.3)',
                  border: `1px solid ${item === 'Z0' ? '#64748b' : 'var(--accent-cyan)'}`,
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: '#ffffff',
                  fontSize: '0.75rem'
                }}
              >
                {item} {idx === result.finalStack.length - 1 && '← TOS'}
              </div>
            ))}
          </div>
        </div>

        {/* Trace List */}
        <div className="md:col-span-2" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.5rem', fontWeight: 600 }}>
            INSTANTANEOUS DESCRIPTIONS (ID) LOG:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
            {result?.trace?.map((t, idx) => (
              <div
                key={idx}
                style={{
                  padding: '5px 8px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <span style={{ color: 'var(--accent-cyan)' }}>{t.id}</span>
                <span style={{ color: 'var(--text-muted)' }}>{t.action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}