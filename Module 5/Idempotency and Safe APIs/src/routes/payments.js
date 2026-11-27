'use strict';
// routes/payments.js


const router = require('express').Router();
const { charges, idempotency, nextChargeId } = require('../store');


router.post('/', (req, res) => {
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