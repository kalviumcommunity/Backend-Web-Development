'use strict';

const router = require('express').Router();
const { charges, idempotency, nextChargeId } = require('../store');

router.post('/', (req, res) => {

  // Get the Idempotency-Key from request headers
  const key = req.headers['idempotency-key'];

  // Rule 1: Reject requests without an idempotency key
  if (!key) {
    return res.status(400).json({
      error: {
        code: 'IDEMPOTENCY_KEY_REQUIRED',
        message: 'Idempotency-Key header is required'
      }
    });
  }

  // Rule 2: Return cached response if key already exists
  if (idempotency.has(key)) {
    const savedResponse = idempotency.get(key);

    return res.status(savedResponse.status).json(savedResponse.body);
  }

  // Rule 3: Create a new charge for a new key
  const amount = req.body && req.body.amount;

  const charge = {
    id: nextChargeId(),
    amount: amount,
    status: 'charged'
  };

  // Record the real charge
  charges.push(charge);

  // Prepare response
  const responseBody = {
    id: charge.id,
    amount: charge.amount,
    status: charge.status
  };

  // Save the response in the idempotency Map
  idempotency.set(key, {
    status: 201,
    body: responseBody
  });

  return res.status(201).json(responseBody);
});

module.exports = router;