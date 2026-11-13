import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Database, Server, Sliders, Shield, Save, CheckCircle2 } from 'lucide-react';
import { useMonitoring } from '../context/MonitoringContext';
import api from '../services/api';
import Badge from '../components/common/Badge';

export default function Settings() {
  const {
    target,
    setTarget,
    intervalSec,
    setIntervalSec,
    isDemoMode,
    setIsDemoMode,
    thresholds,
    setThresholds
  } = useMonitoring();

  const [localTarget, setLocalTarget] = useState(target);
  const [localInterval, setLocalInterval] = useState(intervalSec);
  const [localDemo, setLocalDemo] = useState(isDemoMode);
  const [serverHealth, setServerHealth] = useState(null);
  const [savedNotice, setSavedNotice] = useState('');

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch('/api/health').then(r => r.json());
        setServerHealth(res);
      } catch (err) {
        setServerHealth({ status: 'offline', error: err.message });
      }
    }
    checkHealth();
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setTarget(localTarget);
    setIntervalSec(localInterval);
    setIsDemoMode(localDemo);
    setSavedNotice('Settings saved successfully!');
    setTimeout(() => setSavedNotice(''), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '900px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SettingsIcon size={20} style={{ color: 'var(--accent-cyan)' }} />
            Application & Telemetry Settings
          </h2>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-dim)' }}>
            Configure default ping targets, probe intervals, and database connections
          </span>
        </div>
      </div>

      {/* System Status & Backend Diagnostics */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Server size={18} style={{ color: 'var(--accent-cyan)' }} />
          Telemetry Engine & Database Diagnostics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>EXPRESS TELEMETRY API</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '0.35rem' }}>
              <Badge status={serverHealth?.status === 'online' ? 'ONLINE' : 'OFFLINE'} text={serverHealth?.status === 'online' ? 'CONNECTED' : 'DISCONNECTED'} size="sm" />
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {serverHealth?.service || 'Node.js Express Backend'}
              </span>
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>DATABASE STORAGE LAYER</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '0.35rem' }}>
              <Badge status="ONLINE" text="ACTIVE STORE" size="sm" />
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                MongoDB Atlas / Resilient In-Memory Buffer
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* General Configuration Form */}
      <form onSubmit={handleSave} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sliders size={18} style={{ color: 'var(--accent-cyan)' }} />
          Default Probe Parameters
        </h3>

        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
            DEFAULT PROBE TARGET (IP / HOSTNAME)
          </label>
          <input
            type="text"
            value={localTarget}
            onChange={(e) => setLocalTarget(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '400px',
              padding: '0.65rem 0.85rem',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: '#ffffff',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.875rem'
            }}
          />
          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Enter an authorized IP address (e.g. 8.8.8.8, 1.1.1.1) or domain (e.g. google.com).
          </span>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
            DEFAULT SAMPLING INTERVAL
          </label>
          <select
            value={localInterval}
            onChange={(e) => setLocalInterval(Number(e.target.value))}
            style={{
              width: '100%',
              maxWidth: '400px',
              padding: '0.65rem 0.85rem',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '0.875rem'
            }}
          >
            <option value="1">1 second (High Frequency)</option>
            <option value="2">2 seconds</option>
            <option value="3">3 seconds (Recommended)</option>
            <option value="5">5 seconds</option>
            <option value="10">10 seconds</option>
          </select>
        </div>

        <div style={{ paddingTop: '0.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--text-main)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={localDemo}
              onChange={(e) => setLocalDemo(e.target.checked)}
              style={{ accentColor: 'var(--accent-cyan)' }}
            />
            Always run in Demo Mode (Generates realistic synthetic latency for cloud demo hosting)
          </label>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          {savedNotice ? (
            <span style={{ color: '#10b981', fontSize: '0.8125rem', fontWeight: 600 }}>
              {savedNotice}
            </span>
          ) : <span />}

          <button
            type="submit"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #00d2ff, #3b82f6)',
              color: '#0a0f1d',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            <Save size={16} />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}