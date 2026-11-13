import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  BarChart3,
  History,
  Bell,
  Cpu,
  Network,
  Settings,
  ShieldCheck,
  Radio,
  X
} from 'lucide-react';
import { useMonitoring } from '../../context/MonitoringContext';
import Badge from './Badge';

const navItems = [
  { path: '/', label: 'Overview', icon: LayoutDashboard },
  { path: '/live', label: 'Live Monitoring', icon: Activity },
  { path: '/analytics', label: 'Performance Analytics', icon: BarChart3 },
  { path: '/history', label: 'Network History', icon: History },
  { path: '/alerts', label: 'Alerts & Thresholds', icon: Bell },
  { path: '/flat-lab', label: 'FLAT Learning Lab', icon: Cpu, badge: '5 Units' },
  { path: '/networks-lab', label: 'Computer Networks', icon: Network },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ isOpen, onClose }) {
  const { isMonitoring, latestData } = useMonitoring();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 40
          }}
          className="lg:hidden"
        />
      )}

      <aside
        style={{
          width: 'var(--sidebar-width)',
          backgroundColor: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-subtle)',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          display: 'flex',
          flexDirection: 'column',
          zIndex: 50,
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #00d2ff, #3b82f6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0a0f1d',
                boxShadow: '0 0 16px rgba(0, 210, 255, 0.4)'
              }}
            >
              <Radio size={20} strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.125rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
                Net<span style={{ color: 'var(--accent-cyan)' }}>Pulse</span>
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Telemetry & FLAT
              </div>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onClose}
            className="lg:hidden"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Live Engine Status Strip */}
        <div
          style={{
            padding: '0.75rem 1.25rem',
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: isMonitoring ? '#10b981' : '#64748b',
                boxShadow: isMonitoring ? '0 0 8px #10b981' : 'none',
                animation: isMonitoring ? 'pulse 2s infinite' : 'none'
              }}
            />
            <span style={{ color: isMonitoring ? '#10b981' : 'var(--text-muted)', fontWeight: 600 }}>
              {isMonitoring ? 'PROBING ENGINE' : 'ENGINE IDLE'}
            </span>
          </div>
          <Badge status={latestData.status} size="sm" />
        </div>

        {/* Navigation links */}
        <nav
          style={{
            padding: '1rem 0.75rem',
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem'
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  backgroundColor: isActive ? 'rgba(0, 210, 255, 0.08)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--accent-cyan)' : '3px solid transparent',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease'
                })}
              >
                <Icon size={18} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(59, 130, 246, 0.2)',
                      color: 'var(--accent-blue)',
                      border: '1px solid rgba(59, 130, 246, 0.3)'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Academic Footer Info */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            fontSize: '0.75rem'
          }}
        >
          <div style={{ color: 'var(--text-dim)', marginBottom: '0.25rem', fontWeight: 600 }}>
            ACADEMIC CAPSTONE
          </div>
          <div style={{ color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.4 }}>
            3rd Year B.Tech IT Project
          </div>
          <div style={{ color: 'var(--accent-cyan)', fontSize: '0.6875rem', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={13} /> ICMP & Automata Verified
          </div>
        </div>
      </aside>
    </>
  );
}