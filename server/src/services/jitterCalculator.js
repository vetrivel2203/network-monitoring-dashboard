/**
 * Network Jitter & Variance Calculator
 * Compliant with RFC 3550 (RTP: A Transport Protocol for Real-Time Applications)
 */

class JitterCalculator {
  /**
   * Calculates RFC 3550 moving jitter and summary metrics from an array of RTT measurements.
   * @param {number[]} rttList - Array of RTT in milliseconds
   * @returns {{
   *   rfc3550Jitter: number,
   *   meanJitter: number,
   *   stdDev: number,
   *   minRtt: number,
   *   maxRtt: number,
   *   avgRtt: number
   * }}
   */
  static calculate(rttList) {
    if (!rttList || rttList.length === 0) {
      return {
        rfc3550Jitter: 0,
        meanJitter: 0,
        stdDev: 0,
        minRtt: 0,
        maxRtt: 0,
        avgRtt: 0
      };
    }

    if (rttList.length === 1) {
      const val = Number(rttList[0].toFixed(2));
      return {
        rfc3550Jitter: 0,
        meanJitter: 0,
        stdDev: 0,
        minRtt: val,
        maxRtt: val,
        avgRtt: val
      };
    }

    let rfcJitter = 0;
    let absoluteDifferencesSum = 0;

    for (let i = 1; i < rttList.length; i++) {
      const d = Math.abs(rttList[i] - rttList[i - 1]);
      absoluteDifferencesSum += d;
      // RFC 3550 EWMA filtering: J = J + (|D| - J) / 16
      rfcJitter += (d - rfcJitter) / 16;
    }

    const meanJitter = absoluteDifferencesSum / (rttList.length - 1);

    // Basic stats
    const minRtt = Math.min(...rttList);
    const maxRtt = Math.max(...rttList);
    const sum = rttList.reduce((acc, v) => acc + v, 0);
    const avgRtt = sum / rttList.length;

    // Standard deviation
    const variance = rttList.reduce((acc, v) => acc + Math.pow(v - avgRtt, 2), 0) / rttList.length;
    const stdDev = Math.sqrt(variance);

    return {
      rfc3550Jitter: Number(rfcJitter.toFixed(2)),
      meanJitter: Number(meanJitter.toFixed(2)),
      stdDev: Number(stdDev.toFixed(2)),
      minRtt: Number(minRtt.toFixed(2)),
      maxRtt: Number(maxRtt.toFixed(2)),
      avgRtt: Number(avgRtt.toFixed(2))
    };
  }
}

module.exports = JitterCalculator;