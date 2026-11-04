'use strict';

const router = require('express').Router();
const { charges, idempotency, nextChargeId } = require('../store');

router.post('/', (req, res) => {
  const key = req.headers['idempotency-key'];

  // Reject requests without an idempotency key.
  if (!key) {
    return res.status(400).json({
      error: {
        code: 'IDEMPOTENCY_KEY_REQUIRED',
        message: 'Idempotency-Key header is required'
      }
    });
  }

  // Return the previously saved response for repeated keys.
  if (idempotency.has(key)) {
    const savedResponse = idempotency.get(key);
    return res.status(savedResponse.status).json(savedResponse.body);
  }

  // Create one new charge for a new key.
  const amount = req.body && req.body.amount;

  const charge = {
    id: nextChargeId(),
    amount,
    status: 'charged'
  };

  charges.push(charge);

  const responseBody = {
    id: charge.id,
    amount: charge.amount,
    status: charge.status
  };

  // Save the response for future retries.
  idempotency.set(key, {
    status: 201,
    body: responseBody
  });

  return res.status(201).json(responseBody);
});

module.exports = router;
