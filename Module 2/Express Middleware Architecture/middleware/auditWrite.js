/** Per-route audit middleware: mount on write routes only. */
module.exports = function auditWrite(req, res, next) {
  const shortId = req.id ? `[${req.id.substring(0, 8)}] ` : '';
  console.log(`[AUDIT] ${shortId}Write request received for ${req.method} ${req.originalUrl || req.path}`);
  next();
};
