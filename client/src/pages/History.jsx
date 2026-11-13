import React, { useState, useEffect } from 'react';
import {
  History as HistoryIcon,
  Search,
  Filter,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react';
import api from '../services/api';
import Badge from '../components/common/Badge';

export default function History() {
  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const fetchHistory = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.history.get(page, pagination.limit, search, statusFilter);
      if (res.success) {
        setRecords(res.data || []);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(1);
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHistory(1);
  };

  const handleExportCsv = async () => {
    setExporting(true);
    try {
      await api.history.exportCsv();
    } catch (err) {
      alert('Failed to export CSV: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  const handleClear = async () => {
    if (!window.confirm('Are you sure you want to clear all telemetry monitoring history?')) {
      return;
    }
    try {
      await api.history.clear();
      fetchHistory(1);
    } catch (err) {
      alert('Failed to clear history: ' + err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top action bar */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HistoryIcon size={20} style={{ color: 'var(--accent-cyan)' }} />
            Telemetry Measurement History
          </h2>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-dim)' }}>
            Stored ICMP probe records with export and filtering capabilities
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleExportCsv}
            disabled={exporting || records.length === 0}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#10b981',
              fontSize: '0.8125rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: exporting ? 'not-allowed' : 'pointer'
            }}
          >
            <Download size={15} />
            <span>{exporting ? 'Exporting...' : 'Export CSV Report'}</span>
          </button>

          <button
            onClick={handleClear}
            disabled={records.length === 0}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              fontSize: '0.8125rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: records.length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            <Trash2 size={15} />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 260px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by target host or IP..."
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem 0.5rem 2rem',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '0.8125rem',
                fontFamily: 'var(--font-mono)'
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: '0.5rem 0.85rem',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Search
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>STATUS:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '0.8125rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="" style={{ background: '#111827' }}>All Statuses</option>
            <option value="ONLINE" style={{ background: '#111827' }}>ONLINE</option>
            <option value="DEGRADED" style={{ background: '#111827' }}>DEGRADED</option>
            <option value="OFFLINE" style={{ background: '#111827' }}>OFFLINE</option>
          </select>
        </div>
      </div>

      {/* Historical Data Table */}
      <div className="glass-panel" style={{ padding: '1rem', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 0.75rem', color: 'var(--accent-cyan)' }} />
            Loading historical telemetry...
          </div>
        ) : records.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <FileSpreadsheet size={32} style={{ margin: '0 auto 0.75rem', color: 'var(--text-dim)' }} />
            No records found matching criteria.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem', fontWeight: 600 }}>Timestamp</th>
                <th style={{ padding: '0.75rem', fontWeight: 600 }}>Target Host</th>
                <th style={{ padding: '0.75rem', fontWeight: 600 }}>Resolved IP</th>
                <th style={{ padding: '0.75rem', fontWeight: 600 }}>Latency</th>
                <th style={{ padding: '0.75rem', fontWeight: 600 }}>Min / Max</th>
                <th style={{ padding: '0.75rem', fontWeight: 600 }}>Packet Loss</th>
                <th style={{ padding: '0.75rem', fontWeight: 600 }}>Packets</th>
                <th style={{ padding: '0.75rem', fontWeight: 600 }}>Jitter</th>
                <th style={{ padding: '0.75rem', fontWeight: 600 }}>Availability</th>
                <th style={{ padding: '0.75rem', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '0.75rem', fontWeight: 600 }}>Type</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr
                  key={r._id || i}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                    {new Date(r.timestamp).toLocaleString()}
                  </td>
                  <td style={{ padding: '0.75rem', fontWeight: 600, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                    {r.target}
                  </td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                    {r.ip}
                  </td>
                  <td style={{ padding: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    {r.latencyMs} ms
                  </td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-dim)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                    {r.minLatency} / {r.maxLatency} ms
                  </td>
                  <td style={{ padding: '0.75rem', color: r.packetLossPercent > 0 ? '#ef4444' : '#10b981', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    {r.packetLossPercent}%
                  </td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-dim)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                    {r.packetsReceived}/{r.packetsSent}
                  </td>
                  <td style={{ padding: '0.75rem', color: '#818cf8', fontFamily: 'var(--font-mono)' }}>
                    {r.jitterMs} ms
                  </td>
                  <td style={{ padding: '0.75rem', color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                    {r.availability}%
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <Badge status={r.status} size="sm" />
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    {r.isDemo ? (
                      <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>Demo</span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>ICMP</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination controls */}
        {pagination.totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.8125rem', color: 'var(--text-dim)' }}>
            <div>
              Showing page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.total} total records)
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => fetchHistory(pagination.page - 1)}
                disabled={pagination.page <= 1}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: pagination.page <= 1 ? 'var(--text-dim)' : '#ffffff',
                  cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <button
                onClick={() => fetchHistory(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: pagination.page >= pagination.totalPages ? 'var(--text-dim)' : '#ffffff',
                  cursor: pagination.page >= pagination.totalPages ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}