import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import {
  BarChart3,
  TrendingUp,
  Activity,
  Zap,
  ShieldCheck,
  RefreshCw,
  Clock
} from 'lucide-react';
import api from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Analytics() {
  const [sampleLimit, setSampleLimit] = useState(30);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.analytics.get(sampleLimit);
      if (res.success && res.data) {
        setAnalyticsData(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [sampleLimit]);

  const metrics = analyticsData?.metrics || {
    avgLatency: 0,
    minLatency: 0,
    maxLatency: 0,
    avgPacketLoss: 0,
    avgJitter: 0,
    availability: 100,
    healthScore: 100,
    totalSamples: 0
  };

  const chartData = analyticsData?.chartData || {
    labels: [],
    latency: [],
    packetLoss: [],
    jitter: []
  };

  // Chart configs
  const latencyChartData = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Round-Trip Latency (ms)',
        data: chartData.latency,
        borderColor: '#00d2ff',
        backgroundColor: 'rgba(0, 210, 255, 0.1)',
        borderWidth: 2,
        tension: 0.35,
        fill: true,
        pointRadius: 2,
        pointHoverRadius: 5
      }
    ]
  };

  const lossAndJitterChartData = {
    labels: chartData.labels,
    datasets: [
      {
        type: 'bar',
        label: 'Packet Loss (%)',
        data: chartData.packetLoss,
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: '#ef4444',
        borderWidth: 1,
        yAxisID: 'yLoss'
      },
      {
        type: 'line',
        label: 'RFC 3550 Jitter (ms)',
        data: chartData.jitter,
        borderColor: '#818cf8',
        backgroundColor: 'rgba(129, 140, 248, 0.1)',
        borderWidth: 2,
        tension: 0.35,
        fill: false,
        pointRadius: 2,
        yAxisID: 'yJitter'
      }
    ]
  };

  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#94a3b8',
          font: { family: 'Plus Jakarta Sans', size: 12 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#64748b', font: { size: 10 } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#64748b' }
      }
    }
  };

  const dualAxisOptions = {
    ...commonChartOptions,
    scales: {
      x: commonChartOptions.scales.x,
      yLoss: {
        type: 'linear',
        position: 'left',
        title: { display: true, text: 'Loss (%)', color: '#ef4444' },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#ef4444' },
        min: 0,
        max: 100
      },
      yJitter: {
        type: 'linear',
        position: 'right',
        title: { display: true, text: 'Jitter (ms)', color: '#818cf8' },
        grid: { drawOnChartArea: false },
        ticks: { color: '#818cf8' },
        min: 0
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header and Controls */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={20} style={{ color: 'var(--accent-cyan)' }} />
            Performance Analytics & Trend Analysis
          </h2>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-dim)' }}>
            Statistical analysis of round-trip times, delay jitter, and packet loss rates
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '4px 8px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Samples:</span>
            <select
              value={sampleLimit}
              onChange={(e) => setSampleLimit(Number(e.target.value))}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.8125rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="20" style={{ background: '#111827' }}>Last 20 Probes</option>
              <option value="30" style={{ background: '#111827' }}>Last 30 Probes</option>
              <option value="50" style={{ background: '#111827' }}>Last 50 Probes</option>
              <option value="100" style={{ background: '#111827' }}>Last 100 Probes</option>
            </select>
          </div>

          <button
            onClick={fetchAnalytics}
            disabled={loading}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(0, 210, 255, 0.1)',
              border: '1px solid rgba(0, 210, 255, 0.3)',
              color: 'var(--accent-cyan)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Aggregate Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Avg Latency</div>
          <div style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', margin: '0.35rem 0' }}>
            {metrics.avgLatency} <span style={{ fontSize: '0.875rem' }}>ms</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Min: {metrics.minLatency}ms | Max: {metrics.maxLatency}ms</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Avg Packet Loss</div>
          <div style={{ fontSize: '1.625rem', fontWeight: 800, color: metrics.avgPacketLoss === 0 ? '#10b981' : '#ef4444', fontFamily: 'var(--font-mono)', margin: '0.35rem 0' }}>
            {metrics.avgPacketLoss} <span style={{ fontSize: '0.875rem' }}>%</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Based on {metrics.totalSamples} probes</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>RFC 3550 Jitter</div>
          <div style={{ fontSize: '1.625rem', fontWeight: 800, color: '#818cf8', fontFamily: 'var(--font-mono)', margin: '0.35rem 0' }}>
            {metrics.avgJitter} <span style={{ fontSize: '0.875rem' }}>ms</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Delay variation variance</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Availability Ratio</div>
          <div style={{ fontSize: '1.625rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)', margin: '0.35rem 0' }}>
            {metrics.availability} <span style={{ fontSize: '0.875rem' }}>%</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Uptime health evaluation</div>
        </div>

        <div className="glass-panel col-span-2 lg:col-span-1" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Health Index Score</div>
          <div style={{ fontSize: '1.625rem', fontWeight: 800, color: metrics.healthScore > 85 ? '#10b981' : (metrics.healthScore > 60 ? '#f59e0b' : '#ef4444'), fontFamily: 'var(--font-mono)', margin: '0.35rem 0' }}>
            {metrics.healthScore} <span style={{ fontSize: '0.875rem' }}>/ 100</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Composite QoS rating</div>
        </div>
      </div>

      {/* Latency Line Chart */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>
          Round-Trip Time Latency Over Time (ms)
        </h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '1.25rem' }}>
          Temporal latency distribution across ICMP probe sequences
        </p>
        <div style={{ height: '280px', width: '100%' }}>
          {chartData.labels.length > 0 ? (
            <Line data={latencyChartData} options={commonChartOptions} />
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
              No telemetry data points available. Run ping probes from Overview or Live Monitor.
            </div>
          )}
        </div>
      </div>

      {/* Packet Loss & Jitter Dual Chart */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>
          Packet Loss (%) and Delay Jitter (ms) Correlation
        </h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '1.25rem' }}>
          Comparative view of lost packets vs RFC 3550 statistical inter-arrival jitter
        </p>
        <div style={{ height: '280px', width: '100%' }}>
          {chartData.labels.length > 0 ? (
            <Bar data={lossAndJitterChartData} options={dualAxisOptions} />
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
              No data available yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}