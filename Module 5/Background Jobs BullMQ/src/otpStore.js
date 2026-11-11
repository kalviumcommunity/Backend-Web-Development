'use strict';

const store = new Map();

function generateOTP() {
  // Generates a random 6-digit numeric string, e.g., '014823'
  return Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
}

function storeOTP(email, otp) {
  // Save the OTP with a 10-minute expiration and 0 attempts
  store.set(email, {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000, // + 10 minutes
    attempts: 0
  });
}

function verifyOTP(email, code) {
  const entry = store.get(email);

  // 1. Not found
  if (!entry) {
    return { ok: false, reason: 'not_found' };
  }

  // 2. Expired
  if (Date.now() > entry.expiresAt) {
    store.delete(email);
    return { ok: false, reason: 'expired' };
  }

  // 3. Attempts >= 3
  if (entry.attempts >= 3) {
    return { ok: false, reason: 'too_many_attempts' };
  }

  // 4. Wrong code
  if (entry.otp !== code) {
    entry.attempts += 1;
    return { ok: false, reason: 'wrong_code' };
  }

  // 5. Correct
  store.delete(email);
  return { ok: true };
}

function markVerified(email) {
  // Log that email is verified. In production: update the DB.
  console.log(`Email ${email} has been successfully verified.`);
}

module.exports = { generateOTP, storeOTP, verifyOTP, markVerified, _store: store };