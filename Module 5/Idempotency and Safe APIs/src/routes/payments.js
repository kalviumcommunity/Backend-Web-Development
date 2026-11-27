'use strict';
// routes/payments.js

const router = require('express').Router();
const { charges, idempotency, nextChargeId } = require('../store');

router.post('/', (req, res) => {
  // 1. Read the Idempotency-Key header
  const key = req.headers['idempotency-key'];

  // 2. Reject requests with a missing key
  if (!key || !key.trim()) {
    return res.status(400).json({
      error: {
        code: 'IDEMPOTENCY_KEY_REQUIRED',
        message: 'Idempotency-Key header is required'
      }
    });
  }

  // 3. Check if the key already exists
  if (idempotency.has(key)) {
    const cachedResponse = idempotency.get(key);

    return res
      .status(cachedResponse.status)
      .json(cachedResponse.body);
  }

  // 4. Create a new charge
  const amount = req.body && req.body.amount;

  const charge = {
    id: nextChargeId(),
    amount,
    status: 'charged'
  };

  // 5. Record the actual charge
  charges.push(charge);

  // 6. Store the response in the idempotency Map
  const response = {
    status: 201,
    body: {
      id: charge.id,
      amount: charge.amount,
      status: charge.status
    }
  };

  idempotency.set(key, response);

  // 7. Return the response
  return res.status(response.status).json(response.body);
});

module.exports = router;