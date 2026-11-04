
'use strict';
// routes/payments.js

const router = require('express').Router();
const { charges, idempotency, nextChargeId } = require('../store');

router.post('/', (req, res) => {
  // 1. Read the idempotency key
  const key = req.headers['idempotency-key'];

  // 2. Reject request if key is missing
  if (!key) {
    return res.status(400).json({
      error: {
        code: 'IDEMPOTENCY_KEY_REQUIRED',
        message: 'Idempotency-Key header is required'
      }
    });
  }

  // 3. If key already exists, return saved response
  if (idempotency.has(key)) {
    const saved = idempotency.get(key);
    return res.status(saved.status).json(saved.body);
  }

  // 4. Create a new charge
  const amount = req.body && req.body.amount;

  const charge = {
    id: nextChargeId(),
    amount,
    status: 'charged'
  };

  // 5. Record the real charge
  charges.push(charge);

  // 6. Store the response with the key
  const body = {
    id: charge.id,
    amount: charge.amount,
    status: charge.status
  };

  const status = 201;

  idempotency.set(key, { status, body });

  // 7. Return the response
  return res.status(status).json(body);
});

module.exports = router;
