
'use strict';
// routes/payments.js

const router = require('express').Router();
const { charges, idempotency, nextChargeId } = require('../store');

router.post('/', (req, res) => {
  // 1. Get the idempotency key from the request header
  const key = req.headers['idempotency-key'];

  // 2. If the key is missing, reject the request
  if (!key) {
    return res.status(400).json({
      error: {
        code: 'IDEMPOTENCY_KEY_REQUIRED',
        message: 'Idempotency-Key header is required'
      }
    });
  }

  // 3. If this key was already used, return the saved response
  if (idempotency.has(key)) {
    const savedResponse = idempotency.get(key);
    return res.status(savedResponse.status).json(savedResponse.body);
  }

  // 4. This is a new key, so create one real charge
  const amount = req.body && req.body.amount;

  const charge = {
    id: nextChargeId(),
    amount,
    status: 'charged'
  };

  charges.push(charge);

  // 5. Save the response so retries do not charge again
  const responseBody = {
    id: charge.id,
    amount: charge.amount,
    status: charge.status
  };

  idempotency.set(key, {
    status: 201,
    body: responseBody
  });

  // 6. Return the new charge
  return res.status(201).json(responseBody);
});

module.exports = router;
