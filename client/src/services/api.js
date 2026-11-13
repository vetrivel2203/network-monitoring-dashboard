/**
 * REST API Client for NetPulse Telemetry Dashboard
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get('content-type');
    
    // Check if CSV or binary
    if (contentType && contentType.includes('text/csv')) {
      return response.blob();
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }
    return data;
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'} ${url}]:`, err.message);
    throw err;
  }
}

export const api = {
  // Telemetry & Ping Probes
  ping: {
    probe: (target, count = 4, timeoutMs = 3000, isDemo = false) =>
      request('/ping/probe', {
        method: 'POST',
        body: JSON.stringify({ target, count, timeoutMs, isDemo })
      }),
    getOverview: () => request('/ping/overview')
  },

  // Analytics
  analytics: {
    get: (limit = 50) => request(`/analytics?limit=${limit}`)
  },

  // History
  history: {
    get: (page = 1, limit = 20, search = '', status = '') => {
      const params = new URLSearchParams({ page, limit, search, status });
      return request(`/history?${params.toString()}`);
    },
    exportCsv: async () => {
      const blob = await request('/history/export');
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `network_telemetry_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    },
    clear: () => request('/history/clear', { method: 'DELETE' })
  },

  // Alerts & Settings
  alerts: {
    getActive: () => request('/alerts/active'),
    getSettings: () => request('/alerts/settings'),
    updateSettings: (settings) =>
      request('/alerts/settings', {
        method: 'PUT',
        body: JSON.stringify(settings)
      })
  },

  // FLAT Simulators
  flat: {
    simulateDfa: (input) => request('/flat/dfa', { method: 'POST', body: JSON.stringify({ input }) }),
    simulateNfa: (input) => request('/flat/nfa', { method: 'POST', body: JSON.stringify({ input }) }),
    testRegex: (ip) => request('/flat/regex', { method: 'POST', body: JSON.stringify({ ip }) }),
    generateCfg: (level, code, target) => request('/flat/cfg', { method: 'POST', body: JSON.stringify({ level, code, target }) }),
    simulatePda: (input) => request('/flat/pda', { method: 'POST', body: JSON.stringify({ input }) }),
    simulateTuring: (input) => request('/flat/turing', { method: 'POST', body: JSON.stringify({ input }) })
  }
};

export default api;