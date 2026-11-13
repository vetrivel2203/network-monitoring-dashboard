import React, { useState } from 'react';
import {
  Clock,
  Activity,
  Zap,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  Send,
  Shield,
  Layers,
  Cpu
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMonitoring } from '../context/MonitoringContext';
import MetricCard from '../components/common/MetricCard';
import Badge from '../components/common/Badge';

export default function Overview() {
  const {
    target,
    setTarget,
    latestData,
    runProbe,
    isProbing,
    lastError,
    isDemoMode,
    setIsDemoMode
  } = useMonitoring();

  const [inputHost, setInputHost] = useState(target);
  const [packetCount, setPacketCount] = useState(4);

  const handleManualProbe = (e) => {
    e.preventDefault();
    if (!inputHost) return;
    setTarget(inputHost);
    runProbe(inputHost);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Hero Welcome Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '1.75rem 2rem',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(15, 23, 42, 0.8) 100%)',
          borderLeft: '4px solid var(--accent-cyan)'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                TELEMETRY & AUTOMATA PLATFORM
              </span>
              {latestData.isDemo && <Badge status="DEMO" text="DEMO FALLBACK" size="sm" />}
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
              Network Packet Loss & Latency Monitor
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', maxWidth: '720px', lineHeight: 1.5 }}>
              Enterprise-grade ICMP latency analysis, RFC 3550 statistical jitter computation, and interactive Formal Languages & Automata Theory (FLAT) simulation modules.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link
              to="/flat-lab"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '8px',
                background: 'rgba(0, 210, 255, 0.1)',
                border: '1px solid rgba(0, 210, 255, 0.3)',
                color: 'var(--accent-cyan)',
                fontWeight: 600,
                fontSize: '0.875rem',
                textDecoration: 'none'
              }}
            >
              <Cpu size={16} />
              <span>FLAT Learning Lab</span>
              <ArrowRight size={14} />
            </Link>

            <Link
              to="/networks-lab"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '8px',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                color: 'var(--accent-blue)',
                fontWeight: 600,
                fontSize: '0.875rem',
                textDecoration: 'none'
              }}
            >
              <Layers size={16} />
              <span>Networks Theory</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Primary Telemetry Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          title="Round-Trip Latency"
          value={latestData.latencyMs}
          unit="ms"
          description="Average packet round trip"
          accentColor="#00d2ff"
          icon={Clock}
          badgeText={latestData.latencyMs < 60 ? 'Optimal' : (latestData.latencyMs < 150 ? 'Fair' : 'High')}
        />

        <MetricCard
          title="Packet Loss"
          value={latestData.packetLossPercent}
          unit="%"
          description="Packets dropped in transit"
          accentColor={latestData.packetLossPercent === 0 ? '#10b981' : '#ef4444'}
          icon={Activity}
          badgeText={latestData.packetLossPercent === 0 ? '0% Loss' : `${latestData.packetLossPercent}% Loss`}
        />

        <MetricCard
          title="RFC 3550 Jitter"
          value={latestData.jitterMs}
          unit="ms"
          description="Inter-arrival delay variation"
          accentColor="#818cf8"
          icon={Zap}
          badgeText={latestData.jitterMs < 10 ? 'Low Jitter' : 'Moderate'}
        />

        <MetricCard
          title="Availability"
          value={latestData.availability}
          unit="%"
          description="Host reachability ratio"
          accentColor="#10b981"
          icon={CheckCircle2}
          badgeText={latestData.availability > 98 ? 'Reliable' : 'Degraded'}
        />

        <MetricCard
          title="Network Status"
          value={latestData.status}
          unit=""
          description="Current health evaluation"
          accentColor={latestData.status === 'ONLINE' ? '#10b981' : (latestData.status === 'DEGRADED' ? '#f59e0b' : '#ef4444')}
          icon={AlertOctagon}
          badgeText={latestData.isDemo ? 'SIMULATION' : 'ICMP LIVE'}
        />

        <MetricCard
          title="Total Probes"
          value={latestData.totalRequests}
          unit=""
          description="Probes recorded in session"
          accentColor="#38bdf8"
          icon={Shield}
          badgeText="Active"
        />
      </div>

      {/* Quick Probe Controller Section */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem' }}>
          On-Demand ICMP Ping Probe
        </h3>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', marginBottom: '1.25rem' }}>
          Execute controlled ICMP echo requests with strict input validation and non-blocking process execution.
        </p>

        <form onSubmit={handleManualProbe} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ flex: '1 1 240px', minWidth: '220px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              TARGET HOSTNAME OR IP
            </label>
            <input
              type="text"
              value={inputHost}
              onChange={(e) => setInputHost(e.target.value)}
              placeholder="e.g. 8.8.8.8, 1.1.1.1, google.com"
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                color: '#ffffff',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.875rem'
              }}
            />
          </div>

          <div style={{ width: '130px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              PROBES COUNT
            </label>
            <select
              value={packetCount}
              onChange={(e) => setPacketCount(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '0.875rem'
              }}
            >
              <option value="1">1 Probe</option>
              <option value="2">2 Probes</option>
              <option value="4">4 Probes</option>
              <option value="6">6 Probes</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', alignSelf: 'flex-end', paddingBottom: '4px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isDemoMode}
                onChange={(e) => setIsDemoMode(e.target.checked)}
                style={{ accentColor: 'var(--accent-cyan)' }}
              />
              Force Demo Mode
            </label>
          </div>

          <div style={{ alignSelf: 'flex-end' }}>
            <button
              type="submit"
              disabled={isProbing}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #00d2ff, #3b82f6)',
                color: '#0a0f1d',
                border: 'none',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: isProbing ? 'not-allowed' : 'pointer',
                opacity: isProbing ? 0.7 : 1,
                boxShadow: '0 0 16px rgba(0, 210, 255, 0.3)'
              }}
            >
              <Send size={15} />
              <span>{isProbing ? 'Probing Target...' : 'Send Probe'}</span>
            </button>
          </div>
        </form>

        {lastError && (
          <div style={{ marginTop: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', fontSize: '0.8125rem' }}>
            {lastError}
          </div>
        )}
      </div>

      {/* Recent Telemetry Probes Table */}
      <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
              Recent Monitoring Probes
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Real-time measurement stream and status evaluation
            </span>
          </div>
          <Link
            to="/history"
            style={{ fontSize: '0.8125rem', color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: 600 }}
          >
            View Full History →
          </Link>
        </div>

        {latestData.recentProbes && latestData.recentProbes.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem', fontWeight: 600 }}>Timestamp</th>
                <th style={{ padding: '0.75rem', fontWeight: 600 }}>Target / IP</th>
                <th style={{ padding: '0.75rem', fontWeight: 600 }}>Latency</th>
                <th style={{ padding: '0.75rem', fontWeight: 600 }}>Packet Loss</th>
                <th style={{ padding: '0.75rem', fontWeight: 600 }}>RFC Jitter</th>
                <th style={{ padding: '0.75rem', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '0.75rem', fontWeight: 600 }}>Type</th>
              </tr>
            </thead>
            <tbody>
              {latestData.recentProbes.map((probe, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                    {new Date(probe.timestamp).toLocaleTimeString()}
                  </td>
                  <td style={{ padding: '0.75rem', fontWeight: 600, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                    {probe.target} <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>({probe.ip})</span>
                  </td>
                  <td style={{ padding: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    {probe.latencyMs} ms
                  </td>
                  <td style={{ padding: '0.75rem', color: probe.packetLossPercent > 0 ? '#ef4444' : '#10b981', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    {probe.packetLossPercent}%
                  </td>
                  <td style={{ padding: '0.75rem', color: '#818cf8', fontFamily: 'var(--font-mono)' }}>
                    {probe.jitterMs} ms
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <Badge status={probe.status} size="sm" />
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    {probe.isDemo ? (
                      <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>Demo</span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>ICMP Live</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
            No probes recorded yet. Click <strong>"Send Probe"</strong> or <strong>"Start Live"</strong> to begin monitoring.
          </div>
        )}
      </div>
    </div>
  );
}