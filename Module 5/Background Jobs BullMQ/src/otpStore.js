const _store = new Map();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function storeOTP(email, otp) {
  _store.set(email, {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000,
    attempts: 0,
  });
}

function verifyOTP(email, code) {
  const entry = _store.get(email);

  if (!entry) {
    return { ok: false, reason: 'not_found' };
  }

  if (Date.now() > entry.expiresAt) {
    return { ok: false, reason: 'expired' };
  }

  if (entry.attempts >= 3) {
    return { ok: false, reason: 'too_many_attempts' };
  }

  if (entry.otp !== code) {
    entry.attempts++;
    return { ok: false, reason: 'wrong_code' };
  }

  _store.delete(email);

  return { ok: true };
}

// Preserve your existing markVerified helper here.
// If the starter file already defines it, keep that implementation.

module.exports = {
  generateOTP,
  storeOTP,
  verifyOTP,
  markVerified,
  _store,
};