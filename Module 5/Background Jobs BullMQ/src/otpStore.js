'use strict';

// In-memory OTP store
const store = new Map();

// Generate a random 6-digit OTP
function generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// Store OTP with 10-minute expiry
function storeOTP(email, otp) {
  store.set(email, {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000,
    attempts: 0
  });
}

// Verify OTP with expiry and attempt limits
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

  // 3. Maximum attempts reached
  if (entry.attempts >= 3) {
    return { ok: false, reason: 'too_many_attempts' };
  }

  // 4. Incorrect OTP
  if (entry.otp !== code) {
    entry.attempts++;
    return { ok: false, reason: 'wrong_code' };
  }

  // 5. Correct OTP - delete it (single use)
  store.delete(email);
  return { ok: true };
}

// Mark email as verified
function markVerified(email) {
  console.log(`Email verified: ${email}`);
}

module.exports = {
  generateOTP,
  storeOTP,
  verifyOTP,
  markVerified,
  _store: store
};