
'use strict';
// routes/payments.js

const router = require('express').Router();
const { charges, idempotency, nextChargeId } = require('../store');

router.post('/', (req, res) => {
  // 1. Check whether Idempotency-Key is provided
  const key = req.headers['idempotency-key'];

  if (!key) {
    return res.status(400).json({
      error: {
        code: 'IDEMPOTENCY_KEY_REQUIRED',
        message: 'Idempotency-Key header is required'
      }
    });
  }

  // 2. If the key already exists, return the stored response
  if (idempotency.has(key)) {
    const storedResponse = idempotency.get(key);
    return res.status(storedResponse.status).json(storedResponse.body);
  }

  // 3. Create exactly one new charge
  const amount = req.body && req.body.amount;

  const charge = {
    id: nextChargeId(),
    amount,
    status: 'charged'
  };

  charges.push(charge);

  // 4. Store the response against the idempotency key
  const responseBody = {
    id: charge.id,
    amount: charge.amount,
    status: charge.status
  };

  const response = {
    status: 201,
    body: responseBody
  };

  idempotency.set(key, response);

  return res.status(response.status).json(response.body);
});

module.exports = router;
