import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import api from '../services/api';

const MonitoringContext = createContext();

export function MonitoringProvider({ children }) {
  const [target, setTarget] = useState('8.8.8.8');
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [intervalSec, setIntervalSec] = useState(3);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [latestData, setLatestData] = useState({
    latencyMs: 0,
    packetLossPercent: 0,
    jitterMs: 0,
    availability: 100,
    status: 'ONLINE',
    isDemo: false,
    demoLabel: '',
    ip: '8.8.8.8',
    totalRequests: 0,
    recentProbes: []
  });
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [thresholds, setThresholds] = useState({
    latencyThresholdMs: 150,
    packetLossThresholdPercent: 5,
    jitterThresholdMs: 30,
    notificationSound: true,
    emailAlert: false
  });
  const [isProbing, setIsProbing] = useState(false);
  const [lastError, setLastError] = useState(null);

  const timerRef = useRef(null);

  // Fetch initial overview and alerts
  const refreshOverview = async () => {
    try {
      const res = await api.ping.getOverview();
      if (res.success && res.data) {
        setLatestData(prev => ({
          ...prev,
          latencyMs: res.data.currentLatency || 0,
          packetLossPercent: res.data.currentPacketLoss || 0,
          jitterMs: res.data.currentJitter || 0,
          availability: res.data.availability || 100,
          status: res.data.status || 'ONLINE',
          isDemo: res.data.isDemo || false,
          demoLabel: res.data.demoLabel || '',
          totalRequests: res.data.totalRequests || 0,
          recentProbes: res.data.recentProbes || []
        }));
      }
    } catch (err) {
      console.warn('Failed to fetch initial overview:', err.message);
    }
  };

  const refreshAlerts = async () => {
    try {
      const res = await api.alerts.getActive();
      if (res.success && res.data) {
        setActiveAlerts(res.data.activeAlerts || []);
        if (res.data.thresholds) {
          setThresholds(res.data.thresholds);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch active alerts:', err.message);
    }
  };

  useEffect(() => {
    refreshOverview();
    refreshAlerts();
  }, []);

  // Single probe runner
  const runProbe = async (overrideTarget = null) => {
    const probeTarget = overrideTarget || target;
    setIsProbing(true);
    setLastError(null);

    try {
      const res = await api.ping.probe(probeTarget, 2, 2500, isDemoMode);
      if (res.success && res.data) {
        const d = res.data;
        setLatestData(prev => ({
          ...prev,
          latencyMs: d.latencyMs,
          packetLossPercent: d.packetLossPercent,
          jitterMs: d.jitterMs,
          availability: d.availability,
          status: d.status,
          isDemo: d.isDemo,
          demoLabel: d.demoLabel || '',
          ip: d.ip,
          totalRequests: prev.totalRequests + 1,
          recentProbes: [d, ...(prev.recentProbes || []).slice(0, 19)]
        }));
        refreshAlerts();
        return d;
      }
    } catch (err) {
      setLastError(err.message);
    } finally {
      setIsProbing(false);
    }
  };

  // Start / Stop periodic live monitoring
  const startMonitoring = () => {
    if (isMonitoring) return;
    setIsMonitoring(true);
    runProbe(); // Immediate first probe
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (isMonitoring) {
      timerRef.current = setInterval(() => {
        runProbe();
      }, intervalSec * 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isMonitoring, intervalSec, target, isDemoMode]);

  return (
    <MonitoringContext.Provider
      value={{
        target,
        setTarget,
        isMonitoring,
        startMonitoring,
        stopMonitoring,
        intervalSec,
        setIntervalSec,
        isDemoMode,
        setIsDemoMode,
        latestData,
        activeAlerts,
        thresholds,
        setThresholds,
        isProbing,
        lastError,
        runProbe,
        refreshOverview,
        refreshAlerts
      }}
    >
      {children}
    </MonitoringContext.Provider>
  );
}

export function useMonitoring() {
  const context = useContext(MonitoringContext);
  if (!context) {
    throw new Error('useMonitoring must be used within a MonitoringProvider');
  }
  return context;
}