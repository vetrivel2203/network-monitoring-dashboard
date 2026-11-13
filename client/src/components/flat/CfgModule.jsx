import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function CfgModule() {
  const [level, setLevel] = useState('[CRITICAL]');
  const [code, setCode] = useState('ERR_LATENCY');
  const [target, setTarget] = useState('8.8.8.8');
  const [result, setResult] = useState(null);

  const runCfg = async (lvl, cod, tgt) => {
    try {
      const res = await api.flat.generateCfg(lvl, cod, tgt);
      if (res.success) setResult(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    runCfg(level, code, target);
  }, [level, code, target]);

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
          Unit 3: Context-Free Grammar (CFG) & Parse Tree Visualization
        </h3>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          Chomsky Type-2 grammar generating network alert & incident message payloads
        </span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ flex: '1 1 180px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>SEVERITY LEVEL</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            style={{ width: '100%', padding: '8px', backgroundColor: 'rgba(0, 0, 0, 0.4)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#ffffff' }}
          >
            <option value="[CRITICAL]">[CRITICAL]</option>
            <option value="[WARNING]">[WARNING]</option>
            <option value="[INFO]">[INFO]</option>
          </select>
        </div>

        <div style={{ flex: '1 1 180px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>ERROR CODE</label>
          <select
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{ width: '100%', padding: '8px', backgroundColor: 'rgba(0, 0, 0, 0.4)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#ffffff' }}
          >
            <option value="ERR_LATENCY">ERR_LATENCY</option>
            <option value="ERR_PACKET_LOSS">ERR_PACKET_LOSS</option>
            <option value="ERR_TIMEOUT">ERR_TIMEOUT</option>
          </select>
        </div>

        <div style={{ flex: '1 1 180px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>TARGET IP</label>
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            style={{ width: '100%', padding: '8px', backgroundColor: 'rgba(0, 0, 0, 0.4)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#ffffff' }}
          >
            <option value="8.8.8.8">8.8.8.8 (Google DNS)</option>
            <option value="1.1.1.1">1.1.1.1 (Cloudflare)</option>
            <option value="gw.local">gw.local (Local Gateway)</option>
          </select>
        </div>
      </div>

      <div style={{ padding: '0.85rem 1rem', backgroundColor: 'rgba(0, 0, 0, 0.4)', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-dim)' }}>GENERATED STRING:</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
          {result?.generatedString}
        </span>
      </div>

      {/* SVG Parse Tree */}
      <div style={{ padding: '1rem', backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: '10px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>DYNAMIC HIERARCHICAL PARSE TREE</div>
        <svg width="440" height="190" viewBox="0 0 440 190">
          <circle cx="220" cy="25" r="16" fill="rgba(0, 210, 255, 0.2)" stroke="#00d2ff" strokeWidth="2" />
          <text x="220" y="30" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="13">S</text>

          <line x1="220" y1="41" x2="220" y2="65" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" />
          <circle cx="220" cy="80" r="16" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" strokeWidth="2" />
          <text x="220" y="84" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="11">ALERT</text>

          <line x1="220" y1="96" x2="70" y2="120" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" />
          <line x1="220" y1="96" x2="220" y2="120" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" />
          <line x1="220" y1="96" x2="370" y2="120" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" />

          <circle cx="70" cy="135" r="15" fill="rgba(245, 158, 11, 0.2)" stroke="#f59e0b" strokeWidth="2" />
          <text x="70" y="139" textAnchor="middle" fill="#f59e0b" fontWeight="600" fontSize="9">LEVEL</text>

          <circle cx="220" cy="135" r="15" fill="rgba(129, 140, 248, 0.2)" stroke="#818cf8" strokeWidth="2" />
          <text x="220" y="139" textAnchor="middle" fill="#818cf8" fontWeight="600" fontSize="9">CODE</text>

          <circle cx="370" cy="135" r="15" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="2" />
          <text x="370" y="139" textAnchor="middle" fill="#10b981" fontWeight="600" fontSize="9">TARGET</text>

          <text x="70" y="172" textAnchor="middle" fill="#ffffff" fontFamily="var(--font-mono)" fontSize="11">{level}</text>
          <text x="220" y="172" textAnchor="middle" fill="#ffffff" fontFamily="var(--font-mono)" fontSize="11">{code}</text>
          <text x="370" y="172" textAnchor="middle" fill="#ffffff" fontFamily="var(--font-mono)" fontSize="11">{target}</text>
        </svg>
      </div>

      {/* Derivation Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '0.35rem' }}>LEFTMOST DERIVATION (LMD)</div>
          {result?.leftmostDerivation?.map((s, idx) => (
            <div key={idx} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: idx === result.leftmostDerivation.length - 1 ? '#10b981' : 'var(--text-muted)' }}>
              {s}
            </div>
          ))}
        </div>

        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#818cf8', marginBottom: '0.35rem' }}>RIGHTMOST DERIVATION (RMD)</div>
          {result?.rightmostDerivation?.map((s, idx) => (
            <div key={idx} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: idx === result.rightmostDerivation.length - 1 ? '#10b981' : 'var(--text-muted)' }}>
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}