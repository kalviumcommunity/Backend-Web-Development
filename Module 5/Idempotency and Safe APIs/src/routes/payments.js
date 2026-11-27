
'use strict';
// routes/payments.js

const router = require('express').Router();
const { charges, idempotency, nextChargeId } = require('../store');

router.post('/', (req, res) => {

  // 1. Check Idempotency-Key
  const rawKey = req.headers['idempotency-key'];
  const key = typeof rawKey === 'string' ? rawKey.trim() : '';

  // Missing key -> return 400
  if (!key) {
    return res.status(400).json({
      error: {
        code: 'IDEMPOTENCY_KEY_REQUIRED',
        message: 'An Idempotency-Key header is required for POST /payments.',
      },
    });
  }

  // 2. Repeat key -> return cached response
  if (idempotency.has(key)) {
    const cached = idempotency.get(key);
    return res.status(cached.status).json(cached.body);
  }

  // 3. New key -> create one charge
  const amount = req.body && req.body.amount;

  const charge = {
    id: nextChargeId(),
    amount: amount,
    status: 'charged'
  };

  charges.push(charge);

  const status = 201;

  const body = {
    id: charge.id,
    amount: charge.amount,
    status: charge.status
  };

  // 4. Store response
  idempotency.set(key, { status, body });

  return res.status(status).json(body);
});

module.exports = router;
