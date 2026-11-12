'use strict';
// ─── YOUR FILE, implement this ────────────────────────────────────────────────
// In-memory OTP store for email verification.
//
//  generateOTP()    -> random 6-digit numeric string
//  storeOTP(email, otp) -> saves entry with expiresAt (+10 min) and attempts: 0
//  verifyOTP(email, code) -> guards in order:
//      1. not_found  → { ok:false, reason:'not_found' }
//      2. expired    → delete entry, { ok:false, reason:'expired' }
//      3. attempts>=3 → { ok:false, reason:'too_many_attempts' }
//      4. wrong code → increment attempts, { ok:false, reason:'wrong_code' }
//      5. correct    → delete entry (single-use), { ok:true }
//  markVerified(email) -> log verification (production: update DB)

const store = new Map();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function storeOTP(email, otp) {
  store.set(email, {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    attempts: 0,
  });
}

function verifyOTP(email, code) {
  const entry = store.get(email);
  if (!entry) return { ok: false, reason: 'not_found' };

  if (Date.now() > entry.expiresAt) {
    store.delete(email);
    return { ok: false, reason: 'expired' };
  }

  if (entry.attempts >= 3) {
    return { ok: false, reason: 'too_many_attempts' };
  }

  if (entry.otp !== code) {
    entry.attempts += 1;
    return { ok: false, reason: 'wrong_code' };
  }

  store.delete(email); // single-use
  return { ok: true };
}

function markVerified(email) {
  console.log(`Email verified: ${email}`);
}

module.exports = { generateOTP, storeOTP, verifyOTP, markVerified, _store: store };
