'use strict';
// routes/payments.js
//
// YOUR TASK: make POST /payments idempotent.
//
// Right now this handler charges the card on EVERY request, so a retried request
// (same purchase, sent twice because of a lost response or a double-tap) creates a
// duplicate charge. Fix it using an Idempotency-Key so a retry is processed exactly once.
//
// The in-memory helpers you need are in ../store:
//   idempotency  — a Map you use as  key -> { status, body }
//   charges      — the array of REAL charges (push once per real charge)
//   nextChargeId — returns a fresh 'ch_N' id
//
// Implement these four rules (checked by the tests):
//   1. MISSING key   -> respond 400 with { error: { code: 'IDEMPOTENCY_KEY_REQUIRED', ... } }
//   2. REPEAT key    -> return the stored response; do NOT create a new charge
//   3. NEW key       -> create exactly ONE charge, store { status, body } under the key, return it
//   4. DIFFERENT key -> a separate operation (falls out of rules 2 and 3 naturally)
//
// Hint: read the key from  req.headers['idempotency-key'].

const router = require('express').Router();
const { charges, idempotency, nextChargeId } = require('../store');

router.post('/', (req, res) => {
  // TODO: implement rules 1-3 above. The stub below always charges — remove it.
const rawKey = req.headers['idempotency-key'];
  const key = typeof rawKey === 'string' ? rawKey.trim() : '';


  // 1. MISSING key -> respond 400
  if (!key) {
    return res.status(400).json({
      error: {
        code: 'IDEMPOTENCY_KEY_REQUIRED',
        message: 'An Idempotency-Key header is required for POST /payments.',
      },
    });
  }


  // 2. REPEAT key -> return the stored response without creating a new charge
  if (idempotency.has(key)) {
    const cached = idempotency.get(key);
    return res.status(cached.status).json(cached.body);
  }


  // 3. NEW key -> create one charge, store { status, body }, and return it
  const amount = req.body && req.body.amount;
  const charge = { id: nextChargeId(), amount, status: 'charged' };
  charges.push(charge);


  const status = 201;
  const body = {
    id: charge.id,
    amount: charge.amount,
    status: charge.status,
  };


  idempotency.set(key, { status, body });


  return res.status(status).json(body);
});


module.exports = router;