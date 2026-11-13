import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { MonitoringProvider } from './context/MonitoringContext';
import Sidebar from './components/common/Sidebar';
import Navbar from './components/common/Navbar';

import Overview from './pages/Overview';
import LiveMonitor from './pages/LiveMonitor';
import Analytics from './pages/Analytics';
import History from './pages/History';
import Alerts from './pages/Alerts';
import FlatLab from './pages/FlatLab';
import NetworksLab from './pages/NetworksLab';
import Settings from './pages/Settings';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/': return 'Telemetry Overview';
      case '/live': return 'Live Monitoring Engine';
      case '/analytics': return 'Performance Analytics';
      case '/history': return 'Network Telemetry History';
      case '/alerts': return 'Incident Alerts & Thresholds';
      case '/flat-lab': return 'FLAT Interactive Learning Lab';
      case '/networks-lab': return 'Computer Networks Hub';
      case '/settings': return 'System Settings';
      default: return 'Network Monitoring Dashboard';
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Navbar onMenuClick={() => setSidebarOpen(true)} title={getPageTitle(location.pathname)} />

        <main style={{ flex: 1, padding: '1.75rem', maxWidth: '1440px', width: '100%', margin: '0 auto' }}>
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/live" element={<LiveMonitor />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/history" element={<History />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/flat-lab" element={<FlatLab />} />
            <Route path="/networks-lab" element={<NetworksLab />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <MonitoringProvider>
      <Router>
        <Layout />
      </Router>
    </MonitoringProvider>
  );
}