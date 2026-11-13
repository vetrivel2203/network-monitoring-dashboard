import React from 'react';
import { Menu, Play, Square, RefreshCw, Globe, Zap, AlertTriangle } from 'lucide-react';
import { useMonitoring } from '../../context/MonitoringContext';
import Badge from './Badge';

export default function Navbar({ onMenuClick, title }) {
  const {
    target,
    setTarget,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    isProbing,
    runProbe,
    latestData,
    activeAlerts,
    isDemoMode
  } = useMonitoring();

  return (
    <header
      style={{
        height: '64px',
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 30
      }}
    >
      {/* Left: Mobile Toggle & Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onMenuClick}
          className="lg:hidden"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-main)',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <Menu size={22} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
            {title || 'Network Telemetry Dashboard'}
          </h1>
        </div>
      </div>

      {/* Right: Quick Controls & Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Demo Mode Notice */}
        {latestData.isDemo && (
          <Badge status="DEMO" text="DEMO MODE" size="sm" />
        )}

        {/* Active Alerts Pill */}
        {activeAlerts.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 10px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              fontSize: '0.75rem',
              fontWeight: 600
            }}
          >
            <AlertTriangle size={14} />
            <span>{activeAlerts.length} Alert{activeAlerts.length > 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Target Host Quick Switcher */}
        <div
          className="hidden sm:flex"
          style={{
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            padding: '4px 10px',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.8125rem'
          }}
        >
          <Globe size={14} style={{ color: 'var(--accent-cyan)' }} />
          <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Host:</span>
          <span style={{ color: '#ffffff', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
            {target}
          </span>
        </div>

        {/* Quick Manual Probe */}
        <button
          onClick={() => runProbe()}
          disabled={isProbing}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(0, 210, 255, 0.1)',
            color: 'var(--accent-cyan)',
            border: '1px solid rgba(0, 210, 255, 0.3)',
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '0.8125rem',
            fontWeight: 600,
            cursor: isProbing ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <RefreshCw size={14} className={isProbing ? 'animate-spin' : ''} />
          <span className="hidden md:inline">Ping Once</span>
        </button>

        {/* Live Monitoring Controller Toggle */}
        <button
          onClick={isMonitoring ? stopMonitoring : startMonitoring}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: isMonitoring ? 'rgba(239, 68, 68, 0.2)' : 'linear-gradient(135deg, #00d2ff, #3b82f6)',
            background: isMonitoring ? undefined : 'linear-gradient(135deg, #00d2ff, #3b82f6)',
            color: isMonitoring ? '#ef4444' : '#0a0f1d',
            border: isMonitoring ? '1px solid rgba(239, 68, 68, 0.4)' : 'none',
            padding: '6px 14px',
            borderRadius: '8px',
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: isMonitoring ? 'none' : '0 0 12px rgba(0, 210, 255, 0.3)'
          }}
        >
          {isMonitoring ? <Square size={14} /> : <Play size={14} />}
          <span>{isMonitoring ? 'Stop Live' : 'Start Live'}</span>
        </button>
      </div>
    </header>
  );
}