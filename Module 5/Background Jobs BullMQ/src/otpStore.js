const _store = new Map();
const verifiedUsers = new Set();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function storeOTP(email, otp) {
  _store.set(email, {
    otp: String(otp),
    expiresAt: Date.now() + 10 * 60 * 1000,
    attempts: 0
  });
}

function verifyOTP(email, code) {
  const record = _store.get(email);

  // 1. Not found -> 401
  if (!record) {
    return { ok: false, reason: 'not_found' };
  }

  // 2. Expired -> 410
  if (Date.now() > record.expiresAt) {
    return { ok: false, reason: 'expired' };
  }

  // 3. Too many attempts (>= 3) -> 429
  if (record.attempts >= 3) {
    return { ok: false, reason: 'too_many_attempts' };
  }

  // 4. Wrong code -> 401
  if (record.otp !== String(code)) {
    record.attempts += 1;
    return { ok: false, reason: 'wrong_code' };
  }

  // 5. Correct -> delete single-use & 200
  _store.delete(email);
  return { ok: true };
}

function markVerified(email) {
  verifiedUsers.add(email);
}

module.exports = {
  generateOTP,
  storeOTP,
  verifyOTP,
  markVerified,
  _store
};