const { execFile } = require('child_process');
const os = require('os');
const { validateTarget } = require('../utils/hostValidator');
const JitterCalculator = require('./jitterCalculator');

class PingEngine {
  constructor() {
    this.platform = os.platform(); // 'win32', 'linux', 'darwin'
    this.historyBuffer = []; // In-memory ring buffer for recent probes
    this.maxBufferSize = 100;
  }

  /**
   * Executes controlled ICMP probes against a validated target.
   * Uses execFile (direct binary execution without shell interpretation).
   * 
   * @param {string} target - Validated hostname or IPv4
   * @param {number} count - Number of probes (1 to 10)
   * @param {number} timeoutMs - Timeout in milliseconds
   * @param {boolean} forceDemo - Explicitly use demo mode
   * @returns {Promise<Object>} Telemetry probe result
   */
  async probe(target, count = 4, timeoutMs = 3000, forceDemo = false) {
    const validation = validateTarget(target);
    if (!validation.valid) {
      throw new Error(`Validation Error: ${validation.error}`);
    }

    const safeTarget = validation.sanitized;
    const probeCount = Math.min(Math.max(parseInt(count, 10) || 4, 1), 10);
    const safeTimeout = Math.min(Math.max(parseInt(timeoutMs, 10) || 3000, 500), 10000);

    // If Demo Mode forced or globally enabled via environment
    if (forceDemo || process.env.DEMO_MODE === 'true') {
      return this._generateDemoTelemetry(safeTarget, probeCount);
    }

    try {
      const realResult = await this._executeNativePing(safeTarget, probeCount, safeTimeout);
      this._recordSample(realResult);
      return realResult;
    } catch (err) {
      console.warn(`[PingEngine] Native ping failed for ${safeTarget}: ${err.message}. Providing labeled Demo Mode fallback.`);
      const demoResult = this._generateDemoTelemetry(safeTarget, probeCount, true, err.message);
      this._recordSample(demoResult);
      return demoResult;
    }
  }

  /**
   * Executes the native OS ping binary securely using execFile.
   */
  _executeNativePing(target, count, timeoutMs) {
    return new Promise((resolve, reject) => {
      let cmd = 'ping';
      let args = [];

      if (this.platform === 'win32') {
        // Windows syntax: ping -n <count> -w <timeout_ms> <target>
        args = ['-n', count.toString(), '-w', timeoutMs.toString(), target];
      } else if (this.platform === 'darwin') {
        // macOS syntax: ping -c <count> -W <timeout_ms> <target>
        args = ['-c', count.toString(), '-W', timeoutMs.toString(), target];
      } else {
        // Linux syntax: ping -c <count> -W <timeout_s> <target>
        const timeoutSeconds = Math.max(Math.ceil(timeoutMs / 1000), 1).toString();
        args = ['-c', count.toString(), '-W', timeoutSeconds, target];
      }

      const startTime = Date.now();

      // execFile does not invoke a shell, guaranteeing immunity from command injection
      const proc = execFile(cmd, args, { timeout: timeoutMs * count + 2000 }, (error, stdout, stderr) => {
        const totalDuration = Date.now() - startTime;

        if (error && !stdout) {
          return reject(error);
        }

        const parsed = this._parsePingOutput(stdout || '', this.platform, count);
        parsed.target = target;
        parsed.executionDurationMs = totalDuration;
        parsed.isDemo = false;
        parsed.timestamp = new Date();
        resolve(parsed);
      });

      // Guard against hanging processes
      proc.on('error', (err) => {
        reject(err);
      });
    });
  }

  /**
   * Parses ping output across Windows, Linux, and macOS platforms.
   */
  _parsePingOutput(output, platform, sentCount) {
    const rttList = [];
    let receivedCount = 0;
    let resolvedIp = null;

    if (platform === 'win32') {
      // Windows parsing
      // e.g. "Reply from 142.250.190.46: bytes=32 time=23ms TTL=117"
      // or "Reply from 8.8.8.8: bytes=32 time<1ms TTL=118"
      const lines = output.split('\n');
      for (const line of lines) {
        const ipMatch = line.match(/Reply from ([0-9.]+):/i) || line.match(/Pinging [^\s]+ \[([0-9.]+)\]/i);
        if (ipMatch && !resolvedIp) {
          resolvedIp = ipMatch[1];
        }

        const timeMatch = line.match(/time[<=]([0-9.]+)ms/i);
        if (timeMatch) {
          rttList.push(parseFloat(timeMatch[1]));
          receivedCount++;
        }
      }
    } else {
      // Unix / macOS parsing
      // e.g. "64 bytes from 8.8.8.8: icmp_seq=1 ttl=117 time=14.2 ms"
      const lines = output.split('\n');
      for (const line of lines) {
        const ipMatch = line.match(/\(([0-9.]+)\)/);
        if (ipMatch && !resolvedIp) {
          resolvedIp = ipMatch[1];
        }

        const timeMatch = line.match(/time=([0-9.]+)\s*ms/i);
        if (timeMatch) {
          rttList.push(parseFloat(timeMatch[1]));
          receivedCount++;
        }
      }
    }

    const packetsSent = sentCount;
    const packetsReceived = receivedCount;
    const packetsLost = Math.max(packetsSent - packetsReceived, 0);
    const packetLossPercent = Number(((packetsLost / packetsSent) * 100).toFixed(1));

    const stats = JitterCalculator.calculate(rttList);

    // Network status categorization
    let status = 'ONLINE';
    if (packetLossPercent === 100 || packetsReceived === 0) {
      status = 'OFFLINE';
    } else if (packetLossPercent > 0 || stats.avgRtt > 150 || stats.rfc3550Jitter > 30) {
      status = 'DEGRADED';
    }

    return {
      ip: resolvedIp || 'N/A',
      packetsSent,
      packetsReceived,
      packetsLost,
      packetLossPercent,
      rttList,
      latencyMs: stats.avgRtt,
      minLatency: stats.minRtt,
      maxLatency: stats.maxRtt,
      jitterMs: stats.rfc3550Jitter,
      meanJitter: stats.meanJitter,
      stdDev: stats.stdDev,
      availability: Number((((packetsSent - packetsLost) / packetsSent) * 100).toFixed(1)),
      status,
      rawOutput: output.slice(0, 1000)
    };
  }

  /**
   * Generates realistic, clearly labeled Demo Mode telemetry.
   * Explicitly sets isDemo: true so simulated data is never mistaken for real ICMP.
   */
  _generateDemoTelemetry(target, count, isFallback = false, fallbackReason = '') {
    const rttList = [];
    const baseLatency = target.includes('google') || target.includes('8.8.8.8') ? 18 : 45;

    for (let i = 0; i < count; i++) {
      // Realistic jitter fluctuation between -6ms and +14ms
      const fluctuation = (Math.random() * 20) - 6;
      const rtt = Math.max(Number((baseLatency + fluctuation).toFixed(1)), 4);
      rttList.push(rtt);
    }

    // 10% chance of 1 packet loss during simulated bursts
    const packetsLost = Math.random() < 0.1 ? 1 : 0;
    const packetsSent = count;
    const packetsReceived = packetsSent - packetsLost;
    const packetLossPercent = Number(((packetsLost / packetsSent) * 100).toFixed(1));

    const stats = JitterCalculator.calculate(rttList);

    let status = 'ONLINE';
    if (packetLossPercent > 0 || stats.avgRtt > 100) {
      status = 'DEGRADED';
    }

    return {
      target,
      ip: target === '8.8.8.8' ? '8.8.8.8' : (target === '1.1.1.1' ? '1.1.1.1' : '172.217.16.206'),
      packetsSent,
      packetsReceived,
      packetsLost,
      packetLossPercent,
      rttList,
      latencyMs: stats.avgRtt,
      minLatency: stats.minRtt,
      maxLatency: stats.maxRtt,
      jitterMs: stats.rfc3550Jitter,
      meanJitter: stats.meanJitter,
      stdDev: stats.stdDev,
      availability: Number((((packetsSent - packetsLost) / packetsSent) * 100).toFixed(1)),
      status,
      isDemo: true,
      demoLabel: isFallback 
        ? `DEMO MODE (Native ping unavailable: ${fallbackReason || 'Restricted environment'})` 
        : 'DEMO MODE (Simulation)',
      timestamp: new Date()
    };
  }

  _recordSample(sample) {
    this.historyBuffer.push(sample);
    if (this.historyBuffer.length > this.maxBufferSize) {
      this.historyBuffer.shift();
    }
  }

  getRecentHistory() {
    return [...this.historyBuffer];
  }
}

module.exports = new PingEngine();