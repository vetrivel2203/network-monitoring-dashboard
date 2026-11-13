import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import api from '../../services/api';
import Badge from '../common/Badge';

export default function RegexModule() {
  const [ip, setIp] = useState('192.168.1.1');
  const [result, setResult] = useState(null);

  const runTest = async (val) => {
    try {
      const res = await api.flat.testRegex(val);
      if (res.success) setResult(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    runTest(ip);
  }, []);

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
          Unit 2: Regular Expression Engine & IPv4 Network Parser
        </h3>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          Formal regular language syntax recognition and tokenization under Kleene's Theorem
        </span>
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="text"
          value={ip}
          onChange={(e) => {
            setIp(e.target.value);
            runTest(e.target.value);
          }}
          placeholder="e.g. 192.168.1.1, 255.255.255.0, 999.1.2.3"
          style={{
            flex: '1 1 240px',
            padding: '10px 14px',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            color: '#ffffff',
            fontFamily: 'var(--font-mono)',
            fontSize: '1rem'
          }}
        />
        <Badge
          status={result?.isValid ? 'ONLINE' : 'OFFLINE'}
          text={result?.isValid ? 'VALID IPV4' : 'INVALID IPV4'}
          size="md"
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>OCTET VALIDATION BREAKDOWN:</div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {result?.octetAnalysis?.map((oct) => (
            <div
              key={oct.octetIndex}
              style={{
                padding: '1rem',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                border: `1px solid ${oct.isValid ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Octet {oct.octetIndex}</span>
                {oct.isValid ? <CheckCircle2 size={16} color="#10b981" /> : <XCircle size={16} color="#ef4444" />}
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#ffffff' }}>
                {oct.value || '∅'}
              </div>
              <div style={{ fontSize: '0.6875rem', color: oct.isValid ? '#10b981' : '#ef4444', marginTop: '4px' }}>
                {oct.isValid ? `Matched: ${oct.ruleMatched}` : 'Out of bounds [0-255]'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '1rem', backgroundColor: 'rgba(0, 0, 0, 0.25)', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.8125rem', lineHeight: 1.6 }}>
        <div style={{ color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '0.25rem' }}>
          Kleene's Theorem & Automata Equivalence
        </div>
        <p style={{ color: 'var(--text-muted)' }}>{result?.theoreticalNote}</p>
      </div>
    </div>
  );
}