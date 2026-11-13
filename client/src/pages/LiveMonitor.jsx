import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Square,
  Activity,
  Radio,
  Clock,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  RotateCcw
} from 'lucide-react';
import { useMonitoring } from '../context/MonitoringContext';
import Badge from '../components/common/Badge';

export default function LiveMonitor() {
  const {
    target,
    setTarget,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    intervalSec,
    setIntervalSec,
    latestData,
    isProbing,
    isDemoMode,
    setIsDemoMode
  } = useMonitoring();

  const [inputHost, setInputHost] = useState(target);
  const [logEntries, setLogEntries] = useState([]);
  const [autoScroll, setAutoScroll] = useState(true);
  const logContainerRef = useRef(null);

  // Append new probe to live log
  useEffect(() => {
    if (latestData.recentProbes && latestData.recentProbes.length > 0) {
      const latest = latestData.recentProbes[0];
      setLogEntries(prev => {
        // Prevent duplicate consecutive entries
        if (prev.length > 0 && prev[0].timestamp === latest.timestamp) {
          return prev;
        }
        return [latest, ...prev.slice(0, 49)];
      });
    }
  }, [latestData.recentProbes]);

  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = 0;
    }
  }, [logEntries, autoScroll]);

  const handleApplyHost = (e) => {
    e.preventDefault();
    if (!inputHost) return;
    setTarget(inputHost);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Configuration Header Card */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: isMonitoring ? '#10b981' : '#64748b',
                  boxShadow: isMonitoring ? '0 0 10px #10b981' : 'none'
                }}
              />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                Live Network Probing Engine
              </h2>
            </div>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.8125rem', marginTop: '0.25rem' }}>
              Continuous real-time latency sampling, jitter calculation, and packet loss detection.
            </p>
          </div>

          {/* Quick controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={isMonitoring ? stopMonitoring : startMonitoring}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: isMonitoring ? 'rgba(239, 68, 68, 0.2)' : 'linear-gradient(135deg, #00d2ff, #3b82f6)',
                color: isMonitoring ? '#ef4444' : '#0a0f1d',
                border: isMonitoring ? '1px solid rgba(239, 68, 68, 0.4)' : 'none',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                boxShadow: isMonitoring ? 'none' : '0 0 16px rgba(0, 210, 255, 0.3)'
              }}
            >
              {isMonitoring ? <Square size={16} /> : <Play size={16} />}
              <span>{isMonitoring ? 'Stop Monitoring' : 'Start Live Monitoring'}</span>
            </button>
          </div>
        </div>

        {/* Host Configuration Form */}
        <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
          <form onSubmit={handleApplyHost} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
            <div style={{ flex: '1 1 260px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                MONITORING TARGET (IP / DOMAIN)
              </label>
              <input
                type="text"
                value={inputHost}
                onChange={(e) => setInputHost(e.target.value)}
                placeholder="e.g. 8.8.8.8, 1.1.1.1, google.com"
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.875rem'
                }}
              />
            </div>

            <div style={{ width: '150px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                PROBE INTERVAL
              </label>
              <select
                value={intervalSec}
                onChange={(e) => setIntervalSec(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.875rem'
                }}
              >
                <option value="1">Every 1 sec (Fast)</option>
                <option value="2">Every 2 secs</option>
                <option value="3">Every 3 secs (Standard)</option>
                <option value="5">Every 5 secs</option>
                <option value="10">Every 10 secs</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isDemoMode}
                  onChange={(e) => setIsDemoMode(e.target.checked)}
                  style={{ accentColor: 'var(--accent-cyan)' }}
                />
                Demo Simulation Mode
              </label>
            </div>

            <button
              type="submit"
              style={{
                padding: '0.6rem 1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Update Target
            </button>
          </form>
        </div>
      </div>

      {/* Live Visual Telemetry Center */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Realtime Radar Status Card */}
        <div
          className="glass-panel"
          style={{
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Animated radar rings */}
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              border: `2px solid ${isMonitoring ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.1)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              position: 'relative',
              boxShadow: isMonitoring ? '0 0 24px rgba(0, 210, 255, 0.2)' : 'none'
            }}
          >
            {isMonitoring && (
              <div
                style={{
                  position: 'absolute',
                  inset: '-10px',
                  borderRadius: '50%',
                  border: '1px solid rgba(0, 210, 255, 0.3)',
                  animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
                }}
              />
            )}
            <Radio
              size={36}
              style={{
                color: isMonitoring ? 'var(--accent-cyan)' : 'var(--text-dim)',
                transition: 'color 0.3s ease'
              }}
            />
          </div>

          <Badge status={latestData.status} size="md" />

          <div style={{ marginTop: '0.75rem', fontSize: '0.8125rem', color: 'var(--text-dim)' }}>
            Target: <span style={{ color: '#ffffff', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{target}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
            Resolved: <span style={{ fontFamily: 'var(--font-mono)' }}>{latestData.ip}</span>
          </div>
        </div>

        {/* Live metric mini-gauges */}
        <div className="glass-panel lg:col-span-3" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>CURRENT METRICS STREAM</span>
            {isProbing && (
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-cyan)', animation: 'pulse 1s infinite' }} />
                Transmitting ICMP Probe...
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>LATENCY</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                {latestData.latencyMs} <span style={{ fontSize: '0.875rem' }}>ms</span>
              </div>
            </div>

            <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>PACKET LOSS</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: latestData.packetLossPercent > 0 ? '#ef4444' : '#10b981', fontFamily: 'var(--font-mono)' }}>
                {latestData.packetLossPercent} <span style={{ fontSize: '0.875rem' }}>%</span>
              </div>
            </div>

            <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>RFC JITTER</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#818cf8', fontFamily: 'var(--font-mono)' }}>
                {latestData.jitterMs} <span style={{ fontSize: '0.875rem' }}>ms</span>
              </div>
            </div>

            <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>AVAILABILITY</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                {latestData.availability} <span style={{ fontSize: '0.875rem' }}>%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Stream Terminal Console */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', backgroundColor: 'rgba(10, 15, 29, 0.95)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={16} style={{ color: 'var(--accent-cyan)' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
              LIVE TELEMETRY STREAM CONSOLE
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-dim)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={autoScroll}
                onChange={(e) => setAutoScroll(e.target.checked)}
                style={{ accentColor: 'var(--accent-cyan)' }}
              />
              Auto-Scroll
            </label>
            <button
              onClick={() => setLogEntries([])}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RotateCcw size={12} /> Clear Console
            </button>
          </div>
        </div>

        <div
          ref={logContainerRef}
          style={{
            maxHeight: '320px',
            overflowY: 'auto',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8125rem',
            lineHeight: 1.6,
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            paddingRight: '6px'
          }}
        >
          {logEntries.length === 0 ? (
            <div style={{ color: 'var(--text-dim)', fontStyle: 'italic', padding: '1rem 0' }}>
              Waiting for live telemetry stream. Click "Start Live Monitoring" above to stream ICMP packets.
            </div>
          ) : (
            logEntries.map((log, idx) => (
              <div
                key={idx}
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  backgroundColor: idx === 0 ? 'rgba(0, 210, 255, 0.05)' : 'transparent',
                  borderLeft: idx === 0 ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  alignItems: 'center'
                }}
              >
                <span style={{ color: 'var(--text-dim)' }}>
                  [{new Date(log.timestamp).toLocaleTimeString()}]
                </span>
                <span style={{ color: '#38bdf8', fontWeight: 600 }}>
                  {log.target} ({log.ip})
                </span>
                <span style={{ color: 'var(--text-muted)' }}>
                  seq={log.packetsSent}
                </span>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>
                  rtt={log.latencyMs}ms
                </span>
                <span style={{ color: log.packetLossPercent > 0 ? '#ef4444' : '#10b981' }}>
                  loss={log.packetLossPercent}%
                </span>
                <span style={{ color: '#818cf8' }}>
                  jitter={log.jitterMs}ms
                </span>
                <span style={{ color: log.status === 'ONLINE' ? '#10b981' : (log.status === 'DEGRADED' ? '#f59e0b' : '#ef4444'), fontWeight: 600 }}>
                  [{log.status}]
                </span>
                {log.isDemo && (
                  <span style={{ color: '#00d2ff', fontSize: '0.7rem', backgroundColor: 'rgba(0, 210, 255, 0.1)', padding: '1px 5px', borderRadius: '3px' }}>
                    DEMO
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}