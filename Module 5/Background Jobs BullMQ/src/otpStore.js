
'use strict';

// Store OTPs in memory.
const store = new Map();

// Generate a random 6-digit OTP.
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store the OTP for 10 minutes.
function storeOTP(email, otp) {
  store.set(email, {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000,
    attempts: 0,
  });
}

// Verify the OTP with expiry and attempt-limit checks.
function verifyOTP(email, code) {
  const entry = store.get(email);

  // 1. OTP not found
  if (!entry) {
    return { ok: false, reason: 'not_found' };
  }

  // 2. OTP expired
  if (Date.now() > entry.expiresAt) {
    store.delete(email);
    return { ok: false, reason: 'expired' };
  }

  // 3. Too many wrong attempts
  if (entry.attempts >= 3) {
    return { ok: false, reason: 'too_many_attempts' };
  }

  // 4. Wrong OTP
  if (entry.otp !== String(code)) {
    entry.attempts++;
    return { ok: false, reason: 'wrong_code' };
  }

  // 5. Correct OTP: delete it so it can only be used once.
  store.delete(email);
  return { ok: true };
}

// This helper is called after successful OTP verification.
function markVerified(email) {
  console.log(`Email verified: ${email}`);
}

module.exports = {
  generateOTP,
  storeOTP,
  verifyOTP,
  markVerified,
  _store: store,
};
