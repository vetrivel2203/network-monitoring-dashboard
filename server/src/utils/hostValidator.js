/**
 * Host & IP Validator for Network Monitoring Engine
 * Ensures safe execution without command injection risks.
 */

// Strict regex patterns
const IPV4_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])$/;
const HOSTNAME_REGEX = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$|^localhost$/i;
const DISALLOWED_CHARS = /[;&|`$><*!?~()[\]{}\\\/'" \t\r\n]/;

/**
 * Validates if a target string is a safe, valid IPv4 or Hostname.
 * @param {string} target 
 * @returns {{ valid: boolean, error?: string, sanitized?: string, isIp?: boolean }}
 */
function validateTarget(target) {
  if (!target || typeof target !== 'string') {
    return { valid: false, error: 'Target hostname or IP address is required.' };
  }

  const clean = target.trim();

  if (clean.length === 0 || clean.length > 253) {
    return { valid: false, error: 'Target length must be between 1 and 253 characters.' };
  }

  // Reject shell metacharacters
  if (DISALLOWED_CHARS.test(clean)) {
    return { valid: false, error: 'Target contains invalid characters or potential shell metacharacters.' };
  }

  // Check if string contains only digits and dots (IP candidate)
  const isDigitAndDot = /^[\d.]+$/.test(clean);
  if (isDigitAndDot) {
    if (!IPV4_REGEX.test(clean)) {
      return { valid: false, error: 'Target appears to be an IP address but octets exceed 255 or format is invalid.' };
    }
    return { valid: true, sanitized: clean, isIp: true };
  }

  // Check hostname format
  if (!HOSTNAME_REGEX.test(clean)) {
    return { valid: false, error: 'Target must be a valid IPv4 address (e.g. 8.8.8.8) or valid domain (e.g. google.com).' };
  }

  return { valid: true, sanitized: clean, isIp: false };
}

module.exports = {
  validateTarget,
  IPV4_REGEX,
  HOSTNAME_REGEX
};