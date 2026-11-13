import React, { useState } from 'react';
import { Cpu } from 'lucide-react';
import DfaModule from '../components/flat/DfaModule';
import NfaModule from '../components/flat/NfaModule';
import RegexModule from '../components/flat/RegexModule';
import CfgModule from '../components/flat/CfgModule';
import PdaModule from '../components/flat/PdaModule';
import TmModule from '../components/flat/TmModule';

export default function FlatLab() {
  const [activeUnit, setActiveUnit] = useState('unit1');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Lab Header */}
      <div className="glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(15, 23, 42, 0.8))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.35rem' }}>
          <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(0, 210, 255, 0.15)', color: 'var(--accent-cyan)' }}>
            <Cpu size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              FLAT Interactive Learning Lab
            </h2>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-dim)' }}>
              Formal Languages & Automata Theory applied directly to Computer Networking protocols
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginTop: '1.25rem', paddingBottom: '4px' }}>
          {[
            { id: 'unit1', label: 'Unit 1: DFA & NFA Automata' },
            { id: 'unit2', label: 'Unit 2: RegEx & IPv4 Validator' },
            { id: 'unit3', label: 'Unit 3: CFG & Parse Tree' },
            { id: 'unit4', label: 'Unit 4: PDA Stack Simulator' },
            { id: 'unit5', label: 'Unit 5: Turing Machine' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveUnit(tab.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: activeUnit === tab.id ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                backgroundColor: activeUnit === tab.id ? 'rgba(0, 210, 255, 0.15)' : 'rgba(0, 0, 0, 0.2)',
                color: activeUnit === tab.id ? 'var(--accent-cyan)' : 'var(--text-muted)',
                fontWeight: activeUnit === tab.id ? 700 : 500,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Unit Tab Content */}
      {activeUnit === 'unit1' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <DfaModule />
          <NfaModule />
        </div>
      )}

      {activeUnit === 'unit2' && <RegexModule />}
      {activeUnit === 'unit3' && <CfgModule />}
      {activeUnit === 'unit4' && <PdaModule />}
      {activeUnit === 'unit5' && <TmModule />}
    </div>
  );
}