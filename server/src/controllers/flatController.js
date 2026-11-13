const FlatSimulators = require('../services/flatSimulators');

exports.simulateDfa = (req, res) => {
  try {
    const input = req.body.input || '0010110';
    const result = FlatSimulators.simulateDfa(input);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

exports.simulateNfa = (req, res) => {
  try {
    const input = req.body.input || '010110';
    const result = FlatSimulators.simulateNfa(input);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

exports.testRegex = (req, res) => {
  try {
    const ip = req.body.ip || '192.168.1.1';
    const result = FlatSimulators.testRegex(ip);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

exports.generateCfg = (req, res) => {
  try {
    const { level, code, target } = req.body;
    const result = FlatSimulators.generateAlertCfg(level, code, target);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

exports.simulatePda = (req, res) => {
  try {
    const input = req.body.input || 'aaabbb';
    const result = FlatSimulators.simulatePda(input);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

exports.simulateTuringMachine = (req, res) => {
  try {
    const input = req.body.input || '101101';
    const result = FlatSimulators.simulateTuringMachine(input);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};