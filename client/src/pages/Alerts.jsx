import React, { useState, useEffect } from 'react';
import {
  Bell,
  AlertTriangle,
  AlertOctagon,
  Info,
  Sliders,
  CheckCircle2,
  Volume2,
  VolumeX,
  Save,
  ShieldAlert
} from 'lucide-react';
import { useMonitoring } from '../context/MonitoringContext';
import api from '../services/api';
import Badge from '../components/common/Badge';

export default function Alerts() {
  const { activeAlerts, refreshAlerts } = useMonitoring();
  const [thresholds, setThresholds] = useState({
    latencyThresholdMs: 150,
    packetLossThresholdPercent: 5,
    jitterThresholdMs: 30,
    notificationSound: true,
    emailAlert: false
  });
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await api.alerts.getSettings();
        if (res.success && res.data) {
          setThresholds(res.data);
        }
      } catch (err) {
        console.error('Failed to load alert settings:', err);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedMsg('');
    try {
      const res = await api.alerts.updateSettings(thresholds);
      if (res.success) {
        setSavedMsg('Alert thresholds updated successfully!');
        refreshAlerts();
        setTimeout(() => setSavedMsg(''), 4000);
      }
    } catch (err) {
      alert('Error saving thresholds: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={20} style={{ color: 'var(--accent-cyan)' }} />
            Network Incident Alerts & Threshold Configuration
          </h2>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-dim)' }}>
            Real-time threshold evaluation, incident logs, and SLA monitoring
          </span>
        </div>
        <button
          onClick={refreshAlerts}
          style={{
            padding: '6px 12px',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-main)',
            fontSize: '0.8125rem',
            cursor: 'pointer'
          }}
        >
          Re-evaluate Alerts
        </button>
      </div>

      {/* Active Incidents Banner */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert size={18} style={{ color: activeAlerts.length > 0 ? '#ef4444' : '#10b981' }} />
          Active Incident Notifications ({activeAlerts.length})
        </h3>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', marginBottom: '1.25rem' }}>
          Live alerts triggered by current telemetry probes violating your configured thresholds
        </p>

        {activeAlerts.length === 0 ? (
          <div style={{ padding: '1.5rem', backgroundColor: 'rgba(16, 185, 129, 0.08)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CheckCircle2 size={24} style={{ color: '#10b981' }} />
            <div>
              <div style={{ color: '#10b981', fontWeight: 700, fontSize: '0.9375rem' }}>All Systems Operating Within Safe Thresholds</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>No packet loss, latency spikes, or offline incidents currently detected.</div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {activeAlerts.map((alert, idx) => (
              <div
                key={alert.id || idx}
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '8px',
                  backgroundColor: alert.type === 'CRITICAL' ? 'rgba(239, 68, 68, 0.12)' : (alert.type === 'WARNING' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(59, 130, 246, 0.12)'),
                  borderLeft: `4px solid ${alert.type === 'CRITICAL' ? '#ef4444' : (alert.type === 'WARNING' ? '#f59e0b' : '#3b82f6')}`,
                  borderTop: '1px solid var(--border-subtle)',
                  borderRight: '1px solid var(--border-subtle)',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {alert.type === 'CRITICAL' ? (
                    <AlertOctagon size={22} style={{ color: '#ef4444' }} />
                  ) : (
                    <AlertTriangle size={22} style={{ color: '#f59e0b' }} />
                  )}
                  <div>
                    <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.9375rem' }}>{alert.title}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginTop: '2px' }}>{alert.message}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                    Violated: <strong style={{ color: '#ffffff' }}>{alert.value}</strong>
                  </span>
                  <Badge status={alert.type} size="sm" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Threshold Configuration Card */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sliders size={18} style={{ color: 'var(--accent-cyan)' }} />
          Threshold Rules & Incident Trigger Settings
        </h3>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', marginBottom: '1.5rem' }}>
          Customize the mathematical thresholds for latency, loss percentage, and jitter before alerts are escalated.
        </p>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Latency Threshold */}
            <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  MAX LATENCY THRESHOLD
                </label>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  {thresholds.latencyThresholdMs} ms
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="500"
                step="5"
                value={thresholds.latencyThresholdMs}
                onChange={(e) => setThresholds({ ...thresholds, latencyThresholdMs: Number(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--accent-cyan)', marginBottom: '0.5rem' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                ITU-T G.114 standard advises ≤ 150ms for real-time speech.
              </span>
            </div>

            {/* Packet Loss Threshold */}
            <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  PACKET LOSS THRESHOLD
                </label>
                <span style={{ color: '#ef4444', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  {thresholds.packetLossThresholdPercent} %
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="1"
                value={thresholds.packetLossThresholdPercent}
                onChange={(e) => setThresholds({ ...thresholds, packetLossThresholdPercent: Number(e.target.value) })}
                style={{ width: '100%', accentColor: '#ef4444', marginBottom: '0.5rem' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                Loss above 1% severely degrades TCP congestion windows.
              </span>
            </div>

            {/* Jitter Threshold */}
            <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  RFC 3550 JITTER THRESHOLD
                </label>
                <span style={{ color: '#818cf8', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  {thresholds.jitterThresholdMs} ms
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={thresholds.jitterThresholdMs}
                onChange={(e) => setThresholds({ ...thresholds, jitterThresholdMs: Number(e.target.value) })}
                style={{ width: '100%', accentColor: '#818cf8', marginBottom: '0.5rem' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                High jitter induces audio/video buffer under-runs.
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={thresholds.notificationSound}
                  onChange={(e) => setThresholds({ ...thresholds, notificationSound: e.target.checked })}
                  style={{ accentColor: 'var(--accent-cyan)' }}
                />
                {thresholds.notificationSound ? <Volume2 size={16} /> : <VolumeX size={16} />}
                Audio Warning Beeps
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {savedMsg && (
                <span style={{ color: '#10b981', fontSize: '0.8125rem', fontWeight: 600 }}>
                  {savedMsg}
                </span>
              )}

              <button
                type="submit"
                disabled={saving}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #00d2ff, #3b82f6)',
                  color: '#0a0f1d',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: saving ? 'not-allowed' : 'pointer'
                }}
              >
                <Save size={16} />
                <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}